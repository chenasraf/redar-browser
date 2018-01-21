import * as React from 'react'
import * as css from './ResponseRepr.css'
import * as I from './ResponseRepr.module'
import * as D from 'common/Dispatcher'
import RObject from 'components/RObject/RObject'

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
    if (response && response.constructor === Array) {
      return response.map((row, i) => {
        return (<RObject key={`row-${i}`} className={css.obj} data={row} />)
      })
    }

    return (
      <RObject className={css.obj} data={response} />
    )
  }

  render() {
    const classNames = [
      css.ResponseRepr,
      this.props.className
    ].join(' ')

    const repr = this.getRObjectList()
    
    return (
      <div className={classNames}>
        {repr}
      </div>
    )
  }
}

export default ResponseRepr
