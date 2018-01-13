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

    this.state = {
      columns: props.store.get(StoreKeys.Columns, []),
      data: props.data || props.store.get(StoreKeys.Table, []),
      filters: {},
    }
  }

  public componentWillMount() {
    if (this.props.static) {
      return
    }

    this.listeners = [
      register(ActionTypes.UPDATE_COLUMNS, (columns: any) => {
        this.setState({
          columns: columns || []
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

  private filterData(filters: I.Filters) {
    let { data } = this.state
    for (const key in filters) {
      if (filters.hasOwnProperty(key) && filters[key] && filters[key]!.length) {
        data = data.filter((value: any) => {
          return this.compareFilter(value[key], filters[key]!)
        })
      }
    }
    return data
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
                return (
                  <th key={col}>
                    {col}
                    <div>
                      <input type="text"
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
            {this.filterData(this.state.filters).map((row, i) => (
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
