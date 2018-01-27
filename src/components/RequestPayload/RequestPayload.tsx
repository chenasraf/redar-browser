import * as React from 'react'
import * as css from './RequestPayload.css'
import * as I from './RequestPayload.module'
import { StoreKeys, dispatch, ActionTypes, register } from 'common/Dispatcher'
import * as classNames from 'classnames'
import RequestTypeSelector from 'components/RequestTypeSelector/RequestTypeSelector'

class RequestPayload extends React.Component<I.IProps, I.IState> {
  private listeners: string[]

  constructor(props: I.IProps) {
    super(props)
    const type = props.store.get(StoreKeys.RequestType)
    const payload = props.store.get(StoreKeys.RequestPayload, '""')
    this.state = {
      type,
      payload: JSON.parse(payload),
    }
  }

  private onChange(payload: string) {
    this.setState({ payload }, () => {
      dispatch(ActionTypes.UPDATE_REQ_PAYLOAD, JSON.stringify(payload))
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

export default RequestPayload
