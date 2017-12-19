import * as React from 'react'
import * as I from './DataTable.module'
import * as css from './DataTable.css'

class DataTable extends React.Component<I.Props, I.State> {
  private columns: string[]

  constructor(props: I.Props) {
    super(props)

    this.state = {
      columns: this.getDataColumns(),
      data: this.props.data && this.props.data.map(row => {
        row._id = row._id || row.id || 'row-' + Math.random()
        return row
      })
    }
  }

  private getDataColumns() {
    if (!this.props.data.length) {
      return []
    }

    return Object.keys(this.props.data[0])
  }

  public render() {
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