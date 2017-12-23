import * as React from 'react'
import * as I from './DataTable.module'
import * as css from './DataTable.css'
import { register } from 'common/Dispatcher'

class DataTable extends React.Component<I.Props, I.State> {
  private columns: string[]
  private listener: string

  constructor(props: I.Props) {
    super(props)

    this.state = {
      columns: [],
      data: [],
    }
  }

  public componentWillMount() {
    this.listener = register('set-data', (data: any) => {
      console.debug('new data incoming to table:', data)
      data = data.json
      this.setState({ data: this.parseData(data), columns: this.getDataColumns(data) })
    })
  }

  private parseData(data: any) {
    return data.map(row => {
      row._id = row._id || row.id || 'row-' + Math.random()
      return row
    })
  }

  private getDataColumns(data: any) {
    if (!data.length) {
      return []
    }

    return Object.keys(data[0])
  }

  public render() {
    if (!this.state.data.length) {
      return <div />
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
              {this.state.columns.map((col, j) => <td key={[col, i, j].join('_')}>{row[col]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    )
  }
}

export default DataTable
