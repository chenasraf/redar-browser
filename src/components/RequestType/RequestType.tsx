import * as React from 'react'
import * as css from './RequestType.css'
import * as I from './RequestType.module'
import { StoreKeys, dispatch, ActionTypes, register } from 'common/Dispatcher'
import * as classNames from 'classnames'
import RequestTypeSelector from 'components/RequestTypeSelector/RequestTypeSelector'

class RequestType extends React.Component<I.IProps, I.IState> {
  private listeners: string[]
  
  private typeMap = {
    JSON: JSON.parse,
    Form: String
  }

  constructor(props: I.IProps) {
    super(props)
    this.state = {
      type: props.store.get(StoreKeys.RequestType),
      payload: props.store.get(StoreKeys.RequestPayload),
    }
  }

  private onChange(str: string) {
    this.setState({ payload: str }, () => {
      const payload = this.requestPayload
      dispatch(ActionTypes.UPDATE_REQ_PAYLOAD, payload)
      if (this.props.onChange) {
        this.props.onChange(payload)
      }
    })
  }

  public componentDidMount() {
    this.listeners = [
      register(ActionTypes.UPDATE_REQ_TYPE, (type: string) => {
        this.setState({ type })
      })
    ]
  }

  private get requestPayload() {
    if (!this.state.type
        || !this.typeMap.hasOwnProperty(this.state.type)
        || !this.state.payload.length) {
      return undefined
    }

    try {
      return this.typeMap[this.state.type](this.state.payload)
    } catch (e) {
      console.error(e)
      return "Can't parse response"
    }
  }

  render() {
    const className = classNames(css.RequestType, this.props.className)
    
    return (
      <div className={className}>
        <RequestTypeSelector store={this.props.store} />
        <div>
          <h4 className={css.title}>Payload</h4>
          <textarea name="requestPayload"
            value={this.state.payload}
            placeholder="Request Payload"
            onChange={(e) => this.onChange(e.target.value)} />
        </div>
      </div>
    )
  }
}

export default RequestType
