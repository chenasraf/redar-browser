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
      viewKey: null,
    }
  }

  public componentWillMount() {
    this.listener = register('set-data', (data: any) => {
      console.debug('new data incoming to table:', data)
      this.updateData(data)
    })
  }

  private updateData(data: any) {
    const parsed = this.parseData(data)
    const columns = this.getDataColumns(parsed)
    this.setState({
      data: parsed,
      columns
    })
  }

  private parseData(data: any) {
    let parsed = this.getArrayData(data)
    console.debug('got array data:', parsed)

    if (!parsed) {
      return []
    }

    parsed = parsed.map(row => {
      row._id = row._id || row.id || 'row-' + Math.random()
      return row
    })

    return parsed
  }

  private getArrayData(data: any, key?: string) {
    key = key || this.state.viewKey || undefined

    if (data.constructor === Array) {
      return data
    }
    
    if (key && data.hasOwnProperty(key)) {
      return data[key]
    }
    
    for (const k in data) {
      if (data.hasOwnProperty(k) && data[k].constructor === Array) {
        return data[k]
      }
    }

    return []
  }
  
  private getDataColumns(data?: any) {
    data = data || this.state.data || []

    if (this.state.columns.length) {
      return this.state.columns
    }

    if (!data.length) {
      return []
    }

    const columns = Object.keys(data[0])
    const idIdx = columns.indexOf('_id')

    if (idIdx >= 0) {
      columns.splice(idIdx, 1)
    }

    columns.unshift('_id')

    return columns
  }

  private getColumnRowData(row: any, i: number) {
    return this.getDataColumns().map((col, j) => {
      const s = (css as any)
      const camelCase = col
        .replace(/([^a-z]+[a-z0-9])/i, ($1) => $1.toUpperCase())
        .replace(/[^a-z]/i, '')

      const asClsName = camelCase[0].toUpperCase() + camelCase.slice(1)
      console.log(camelCase, asClsName, css)

      const cls = [
        s.hasOwnProperty('col' + asClsName) ? s['col' + asClsName] : css.colUnknown,
        ['col', j].join('-'),
        ['col', col].join('-')
      ].join(' ')

      return (
        <td key={[col, i, j].join('_')}
          className={cls}>
          {row[col]}
        </td>
      )
    })
  } 

  public render() {
    if (!this.state.data.length) {
      return <div>No data to show!</div>
    }

    return (
      <table className={css.dataTable}>
        <thead>
          <tr>
            {this.getDataColumns().map(col => <th key={col}>{col}</th>)}
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
