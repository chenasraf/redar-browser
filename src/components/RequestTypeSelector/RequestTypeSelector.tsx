import * as React from 'react'
import * as css from './RequestTypeSelector.css'
import * as I from './RequestTypeSelector.module'
import AddressBar from 'components/AddressBar/AddressBar'
import SelectBox, { Option, styles as selectBoxStyle } from 'components/SelectBox/SelectBox'
import Button from 'components/Button/Button'
import axios, { AxiosResponse } from 'axios'
import Dispatcher, { register, dispatch, ActionTypes, StoreKeys } from 'common/Dispatcher'
import * as classNames from 'classnames'

class RequestTypeSelector extends React.Component<I.IProps, I.IState> {
  private listeners: string[]

  constructor(props: I.IProps) {
    super(props)
    this.state = {
      requestType: props.store.get(StoreKeys.RequestType, localStorage.lastRequestType || 'JSON')
     }
  }

  public componentWillMount() {
    this.listeners = [
      register(ActionTypes.UPDATE_REQ_TYPE, (requestType: string) => {
        this.setState({ requestType })
      })
    ]
  }

  private keyListFromObject(data: any) {
    return Object.keys(data)
  }

  private selectItem(key: string) {
    this.setState({ requestType: key }, () => {
      localStorage.lastRequestType = key
      dispatch(ActionTypes.UPDATE_REQ_TYPE, key)
    })
  }

  private get typeItems() {
    return ['JSON', 'Form'].map((key: string) => {
      const className = [
        css.item,
        this.state.requestType === key ? css.selected : ''
      ].join(' ')

      return (
        <div className={className}
          key={key}
          onClick={(e) => this.selectItem(key)}>
          {key}
        </div>
      )
    })
  }

  render() {
    const className = classNames(css.RequestTypeSelector, this.props.className)
    return (
      <div className={className}>
        {this.typeItems}
      </div>
    )
  }
}

export default RequestTypeSelector
