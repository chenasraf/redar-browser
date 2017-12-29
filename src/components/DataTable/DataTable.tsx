import * as React from 'react'
import * as I from './DataTable.module'
import * as css from './DataTable.css'
import Dispatcher, { register, dispatch, ActionTypes } from 'common/Dispatcher'

class DataTable extends React.Component<I.Props, I.State> {
  private columns: string[]
  private listener: string

  constructor(props: I.Props) {
    super(props)

    this.state = {
      columns: props.store.get('columns', []),
      data: props.store.get('tableData', []),
    }
  }

  public componentWillMount() {
    this.listener = register(ActionTypes.set, (data: any) => {
      this.updateData({
        data: data.tableData || [],
        columns: data.columns || [],
      })
    })
  }

  public componentWillUnmount() {
    Dispatcher.unregister(this.listener)
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

    parsed = parsed.map(row => {
      row._id = row._id || row.id || 'row-' + parseInt((Math.random() * 10000).toString(), 10)
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
