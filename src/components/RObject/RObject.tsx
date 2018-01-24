import * as React from 'react'
import * as css from './RObject.css'
import * as I from './RObject.module'

class RObject extends React.Component<I.IProps, I.IState> {
  constructor(props: I.IProps) {
    super(props)
    this.state = {}
  }
  
  private getCorrectRepr(obj: any) {
    let cls = this.props.className

    try {
      switch (typeof obj) {
        case 'number':
        case 'string':
          return <span className={css.RObject}>{obj}</span>
        default:
          const keys = obj ? Object.keys(obj) : []
          const isArray = obj && obj.constructor === Array

          if (!keys.length) {
            return <span className={css.RObject}>{JSON.stringify(obj)}</span>
          }

          return keys.map((k: string, i: number) => {
            let tempCls = this.props.className
            if (typeof tempCls === 'function') {
              tempCls = tempCls(i, k)
            }
            tempCls += ' ' + css.RObject
            return (
              <div className={tempCls as string} key={'obj-' + k}>
                <h3>{!isArray ? k : typeof obj}</h3>
                <RObject data={obj[k]} />
              </div>
            )
          })
      }
    } catch (e) {
      return <span className={css.RObject}>{typeof obj}</span>
    }
  }

  render() {    
    const repr = this.getCorrectRepr(this.props.data)
    return repr
  }
}

export default RObject
