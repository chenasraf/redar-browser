import * as React from 'react'
import * as css from './Transformer.css'
import * as I from './Transformer.module'
import * as classNames from 'classnames'
import Dispatcher, { StoreKeys, ActionTypes, dispatch, register, Store } from 'common/Dispatcher'

class Transformer extends React.Component<I.IProps, I.IState> {
  private listeners: string[]

  constructor(props: I.IProps) {
    super(props)
    this.state = {
      transform: Store.getState().get(StoreKeys.ResponseTransform),
      hasError: Store.getState().get(StoreKeys.ResponseTransformError),
    }
  }

  private onChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    this.setState({ transform: e.currentTarget.value }, () => {
      dispatch(ActionTypes.UPDATE_RES_TRANSFORM, this.state.transform)
    })
  }
  
  public componentWillMount() {
    this.listeners = [
      register(ActionTypes.UPDATE_RES_TRANSFORM_ERROR, (error: any) => {
        this.setState({ hasError: Boolean(error) })
      }),
    ]
  }

  public componentWillUnmount() {
    this.listeners.forEach(l => Dispatcher.unregister(l))
  }

  render() {
    const className = classNames(css.Transformer, this.props.className)
    const textAreaCls = classNames(css.textarea, {
      [css.hasError]: this.state.hasError
    })
    
    return (
      <div className={className}>
        <h3 className={css.title}>Transform Response (experimental)</h3>
        <div className={css.info}>
          Use <pre>response</pre> to get the response data,
          and return the final output you want to parse as a table.
        </div>
        <textarea className={textAreaCls}
          onChange={(e) => this.onChange(e)}
          placeholder="e.g. return response.map(row => ...)"
          value={this.state.transform} />
      </div>
    )
  }
}

export default Transformer
