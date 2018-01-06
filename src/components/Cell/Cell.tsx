import * as React from 'react'
import * as css from './Cell.css'
import * as I from './Cell.module'

class Cell extends React.Component<I.IProps, I.IState> {
  constructor(props: I.IProps) {
    super(props)
    this.state = {
      //
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

  private parse(obj?: any) {
    if (this.isRepresentable(obj)) {
      let str = JSON.stringify(obj).split(`\\`).join('')
      const maxLen = 400
      if (str.length > maxLen) {
        str = str.slice(0, maxLen) + '\u2026'
      }
      return (
        <span>{str}</span>
      )
    }
    
    if (typeof obj === 'function') {
      const name = obj.name || 'Function'
      return `${name}()`
    }

    if (obj.constructor === Array && (!obj.length || obj[0].constructor === {}.constructor)) {
      const items = obj.slice(0, 3)
      return (
        <span>
          [{items.map((item, i) => (
            <span key={Math.random()}>
              {this.parse(item)}
            </span>
          ))}]
        </span>
      )
    }

    const keyList = Object.keys(obj).map(s => `"${s}"`).join(', ')
    return (
      <div>
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
        {this.parse(this.props.data)}
      </div>
    )
  }
}

export default Cell
