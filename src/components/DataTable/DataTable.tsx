import * as React from 'react'
import * as I from './DataTable.module'
import * as css from './DataTable.css'
import Dispatcher, { register, dispatch, ActionTypes, StoreKeys } from 'common/Dispatcher'

class DataTable extends React.Component<I.Props, I.State> {
  private columns: string[]
  private listeners: string[]

  constructor(props: I.Props) {
    super(props)

    this.state = {
      columns: props.store.get(StoreKeys.Columns, []),
      data: props.store.get(StoreKeys.Table, []),
    }
  }

  public componentWillMount() {
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
          {JSON.stringify(row[col], undefined, '  ')}
        </td>
      )
    })
  } 

  public render() {
    if (!this.state.data.length) {
      return <div className={css.dataTable}>No data to show!</div>
    }

    return (
      <table className={css.dataTable}>
        <thead>
          <tr>
            {this.state.columns.map(col => <th key={col}>{col}</th>)}
          </tr>
        </thead>
        <tbody>
          {this.state.data.map((row, i) => (
            <tr key={`row_${i}`}>
              {this.getColumnRowData(row, i)}
            </tr>
          ))}
        </tbody>
      </table>
    )
  }
}

export default DataTable
