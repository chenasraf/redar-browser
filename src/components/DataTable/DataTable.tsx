import * as React from 'react'
import * as I from './DataTable.module'
import * as css from './DataTable.css'
import Dispatcher, { register, dispatch, ActionTypes, StoreKeys } from 'common/Dispatcher'
import Cell from 'components/Cell/Cell'

class DataTable extends React.Component<I.Props, I.State> {
  private columns: string[]
  private listeners: string[]

  constructor(props: I.Props) {
    super(props)
    
    const columns = props.store.get(StoreKeys.Columns, [])

    this.state = {
      columns,
      data: props.data || props.store.get(StoreKeys.Table, []),
      filters: {},
      sortKey: columns[0],
      sortDesc: false
    }
  }

  public componentWillMount() {
    if (this.props.static) {
      return
    }

    this.listeners = [
      register(ActionTypes.UPDATE_COLUMNS, (columns: any) => {
        let { sortKey } = this.state
        if (columns.indexOf(sortKey) === -1) {
          sortKey = columns[0]
        }

        this.setState({
          columns: columns || [],
          sortKey,
        })
      }),
      register(ActionTypes.UPDATE_TABLE, (table: any) => {
        this.setState({
          data: this.parseData(table || [])
        })
      })
    ]
  }

  public componentWillUnmount() {
    if (this.props.static) {
      return
    }
    
    this.listeners.forEach(l => Dispatcher.unregister(l))
  }

  private updateData(data: any) {
    const parsed = this.parseData(data.data)
    this.setState({
      data: parsed,
      columns: data.columns
    })
  }

  private parseData(data: any) {
    let parsed = data

    if (!parsed) {
      return []
    }

    parsed = parsed.map((row: any, i: number) => {
      row._id = row._id || row.id || i
      return row
    })

    return parsed
  }

  private getColumnRowData(row: any, i: number) {
    return this.state.columns.map((col, j) => {
      const s = (css as any)
      const camelCase = col
        .replace(/([^a-z]+[a-z0-9])/i, ($1) => $1.toUpperCase())
        .replace(/[^a-z]/i, '')

      const asClsName = camelCase[0].toUpperCase() + camelCase.slice(1)

      const cls = [
        s.hasOwnProperty('col' + asClsName) ? s['col' + asClsName] : css.colUnknown,
        ['col', j].join('-'),
        ['col', col].join('-')
      ].join(' ')

      return (
        <td key={[col, i, j].join('_')}
          className={cls}>
          <Cell data={row[col]} />
        </td>
      )
    })
  }

  private setFilter(key: string, value: string) {
    this.setState((cur: I.State) => {
      const filters = cur.filters
      filters[key] = value
      return { filters }
    })
  }

  private filterAndSortData() {
    let { data, filters } = this.state

    for (const key in filters) {
      if (filters.hasOwnProperty(key) && filters[key] && filters[key]!.length) {
        data = data.filter((value: any) => {
          return this.compareFilter(value[key], filters[key]!)
        })
      }
    }

    const skey = this.state.sortKey
    const cmp = (a, b) => a > b ? 1 : a === b ? 0 : -1
    const sort = (a, b) => !skey ? 1 : this.state.sortDesc ? cmp(b[skey], a[skey]) : cmp(a[skey], b[skey])
    data = data.sort(sort)

    return data
  }

  private sortBy(key: string) {
    const { sortKey, sortDesc } = this.state
    const desc = sortKey === key && !sortDesc
    this.setState({ sortKey: key, sortDesc: desc })
  }

  private compareFilter(obj: any, filter: string) {
    return String(obj).toLowerCase().indexOf(filter.toLowerCase()) > -1
  }

  public render() {
    return (
      <div className={this.props.className || ''}>
        <table className={css.dataTable}>
          <thead>
            <tr>
              {this.state.columns.map(col => {
                const anchorCls = [
                  css.colName,
                  this.state.sortKey === col ? css.sortingBy : ''
                ].join(' ')

                const caretCls = [
                  css.sortCaret,
                  'material-icons'
                ].join(' ')

                return (
                  <th key={col}>
                    <a href="#"
                      onClick={(e) => { e.preventDefault(); this.sortBy(col) }}
                      className={anchorCls}>
                      {col}
                      <span className={caretCls}>
                        {this.state.sortKey === col && this.state.sortDesc ?
                          'keyboard_arrow_down' : 'keyboard_arrow_up'}
                      </span>
                    </a>
                    <div>
                      <input type="text"
                        className={css.filterInput}
                        value={this.state.filters[col] || ''}
                        placeholder={`filter "${col}"`}
                        onChange={(e) => {
                          const { value } = e.target
                          this.setFilter(col, value)
                        }}
                      />
                    </div>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {this.filterAndSortData().map((row, i) => (
              <tr key={`row_${i}`}>
                {this.getColumnRowData(row, i)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
}

export default DataTable
