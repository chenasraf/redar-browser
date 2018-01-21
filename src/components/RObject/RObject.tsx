import * as React from 'react'
import * as css from './RObject.css'
import * as I from './RObject.module'

class RObject extends React.Component<I.IProps, I.IState> {
  constructor(props: I.IProps) {
    super(props)
    this.state = {}
  }
  
  private getCorrectRepr(obj: any, cls?: string) {
    try {
      switch (typeof obj) {
        case 'number':
        case 'string':
          return <span className={css.simple}>{obj}</span>
        default:
          const keys = obj ? Object.keys(obj) : []
          const isArray = obj && obj.constructor === Array

          if (!keys.length) {
            return <span>{JSON.stringify(obj)}</span>
          }

          return keys.map((k: string) => {
            return (
              <div className={cls} key={'obj-' + k}>
                <h3>{!isArray ? k : typeof obj}</h3>
                <RObject data={obj[k]} />
              </div>
            )
          })
      }
    } catch (e) {
      return <span className={css.simple}>{typeof obj}</span>
    }
  }

  render() {
    const classNames = [
      css.RObject,
      this.props.className
    ].join(' ')
    
    const repr = this.getCorrectRepr(this.props.data, classNames)
    return repr
  }
}

export default RObject
