import * as React from 'react'
import * as css from './Cell.css'
import * as I from './Cell.module'
import DataTable from 'components/DataTable/DataTable'
import * as Repr from './Repr'

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
      !obj ||
      obj.constructor === String ||
      obj.constructor === Boolean ||
      typeof obj === 'undefined' ||
      typeof obj === 'boolean' ||
      typeof obj === 'number'
    )
  }

  private expandData() {
    this.setState({ dataVisible: true })
  }

  private parse() {
    const obj = this.props.data
    const className = this.props.className || ''

    if (this.state.depth >= MAX_DEPTH) {
      return (
        <span>&hellip;</span>
      )
    }

    if (this.isRepresentable(obj)) {
      return (
        <Repr.JSON className={[className, css.pre, css.string].join(' ')}>
          {obj}
        </Repr.JSON>
      )
    }
    
    if (typeof obj === 'function') {
      return (
        <Repr.Function className={[className, css.func].join(' ')}>
          {obj}
        </Repr.Function>
      )
    }

    if (obj.constructor === Array && (!obj.length || obj[0].constructor === {}.constructor)) {
      const items = obj.slice(0, 3)

      return (
        <Repr.Any className={[className, css.preAlt].join(' ')}
          title={'Array (' + obj.length + ')'}>
          {items.map((item, i) => (
            <Cell key={'item-' + i} className={[css.preAlt, css.any].join(' ')}
              depth={this.state.depth + 1}
              data={item} />
          ))}
        </Repr.Any>
      )
    }

    const keys = Object.keys(obj)

    return keys.length ? (
      <Repr.Any className={[className, css.preAlt].join(' ')}
        title={'Object (' + keys.length + ' keys)'}
        onClick={(e) => this.expandData()}>
        {keys.map((s, i) => (
          <div key={'key-' + i}
            className={[css.preAlt, css.string].join(' ')}>
            <div>{s}:</div>
            <Repr.JSON className={css.preAlt}>{obj[s]}</Repr.JSON>
          </div>
        ))}
      </Repr.Any>
    ) : (
      <Repr.Any className={[className, css.preAlt].join(' ')}
        title="Empty Object" />
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
