import * as React from 'react'
import * as css from './ResponseRepr.css'
import * as I from './ResponseRepr.module'
import * as D from 'common/Dispatcher'
import RObject from 'components/RObject/RObject'
import * as classNames from 'classnames'

class ResponseRepr extends React.Component<I.IProps, I.IState> {
  private listeners: string[]
  constructor(props: I.IProps) {
    super(props)
    this.state = {
      response: props.store.get(D.StoreKeys.Response, {})
    }
  }

  componentDidMount() {
    this.listeners = [
      D.register(D.ActionTypes.UPDATE_RESPONSE, (response) => {
        const viewKey = this.props.store.get(D.StoreKeys.ViewKey)
        if (viewKey && Object.keys(response).indexOf(viewKey) > -1) {
          response = response[viewKey]
        }
        this.setState({ response })
      }),

      D.register(D.ActionTypes.UPDATE_VIEWKEY, (viewKey) => {
        let resp = this.props.store.get(D.StoreKeys.Response, {})
        resp = resp && viewKey && resp.hasOwnProperty(viewKey) ? resp[viewKey] : resp
        this.setState({ response: resp })
      }),
    ]
  }

  componentWillUnmount() {
    this.listeners.forEach(listener => D.AppDispatcher.unregister(listener))
  }

  private getRObjectList() {
    const { response } = this.state
    let colAmt

    if (response && response.constructor === Array) {
      const keys = Object.keys(response[0] || {})
      colAmt = keys.length
      return (
        <div className={css.table}
          style={{gridTemplateColumns: `repeat(${colAmt}, auto)`}}>
            {keys.map((key) => <h3 key={`col-th-${key}`}>{key}</h3>)}
            {response.map((row, i) => {
              const cls = (j) => {
                return classNames(css.cell, {
                  [css.rowStart]: j % colAmt === 0,
                  [css.rowEnd]: j % colAmt === colAmt - 1,
                })
              }

              return (
                  <RObject className={cls}
                    key={`row-${i}`}
                    data={row} />
              )
            })}
          </div>
      )
    }

    colAmt = Object.keys(response || {})

    return (
      <div className={css.table}
        style={{gridTemplateRows: `repeat(${colAmt}, auto)`}}>
        <RObject data={response} />
      </div>
    )
  }

  render() {
    const className = [
      css.ResponseRepr,
      this.props.className
    ].join(' ')

    const repr = this.getRObjectList()
    
    return (
      <div className={className}>
        {repr}
      </div>
    )
  }
}

export default ResponseRepr
