import * as React from 'react'
import * as css from './Cell.css'
import * as I from './Cell.module'
import DataTable from 'components/DataTable/DataTable'

const MAX_DEPTH = 5

class Cell extends React.Component<I.IProps, I.IState> {
  constructor(props: I.IProps) {
    super(props)
    this.state = {
      tableData: props.data,
      dataVisible: false,
      depth: props.depth || 0,
    }
  }

  private isRepresentable(obj?: any) {
    return (
      obj.constructor === String ||
      typeof obj === 'undefined' ||
      typeof obj === 'number' ||
      !obj
    )
  }

  private expandData() {
    this.setState({ dataVisible: true })
  }

  private parse() {
    const obj = this.props.data
    const classNames = this.props.className || ''

    if (this.state.depth >= MAX_DEPTH) {
      return (
        <span>&hellip;</span>
      )
    }

    if (this.isRepresentable(obj)) {
      let str = JSON.stringify(obj, null, '\t').split(`\\`).join('')
      const maxLen = 400

      if (str.length > maxLen) {
        str = str.slice(0, maxLen) + '\u2026'
      }

      return (
        <div className={[classNames, css.pre].join(' ')}>{str}</div>
      )
    }
    
    if (typeof obj === 'function') {
      const name = obj.name || 'Function'
      return `${name}()`
    }

    if (obj.constructor === Array && (!obj.length || obj[0].constructor === {}.constructor)) {
      const items = obj.slice(0, 3)
      return (
        <div className={[classNames, css.preAlt].join(' ')}>
          Array[{items.map((item, i) => (
            <Cell className={css.pre} depth={this.state.depth + 1} data={item} />
          ))}]
        </div>
      )
    }

    const keyList = Object.keys(obj).map(s => (
      <Cell depth={this.state.depth + 1} data={s} />
    ))

    return (
      <div className={[classNames, css.preAlt].join(' ')} onClick={(e) => this.expandData()}>
        Object({keyList})
      </div>
    )
  }

  render() {
    const classNames = [
      css.Cell,
    ].join(' ')
    
    return (
      <div className={classNames}>
        {this.parse()}
        {this.state.dataVisible ? (
          <div className={css.popover}>
            {/* <DataTable data={this.state.tableData} static={true} store={null} /> */}
          </div>
        ) : ''}
      </div>
    )
  }
}

export default Cell
