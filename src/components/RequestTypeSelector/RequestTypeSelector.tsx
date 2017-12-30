import * as React from 'react'
import * as css from './RequestTypeSelector.css'
import * as I from './RequestTypeSelector.module'
import AddressBar from 'components/AddressBar/AddressBar'
import SelectBox, { Option, styles as selectBoxStyle } from 'components/SelectBox/SelectBox'
import Button from 'components/Button/Button'
import axios, { AxiosResponse } from 'axios'
import Dispatcher, { register, dispatch, ActionTypes } from 'common/Dispatcher'

class RequestTypeSelector extends React.Component<I.IProps, I.IState> {
  private listener: string
  private requestTypeMap = {
    JSON: JSON.parse,
    Form: String
  }

  constructor(props: I.IProps) {
    super(props)
    this.state = {
      requestType: 'JSON'
     }
  }

  public componentWillMount() {
    this.listener = register(ActionTypes.set, (data: any) => {
      // if (data.hasOwnProperty('fullData')) {
      //   this.setState({
      //     requestType: 'JSON'
      //   })
      // }
    })
  }
  
  public componentWillUnmount() {
    Dispatcher.unregister(this.listener)
  }

  private keyListFromObject(data: any) {
    return Object.keys(data)
  }

  private selectItem(key: string) {
    this.setState({ requestType: key }, () => {
      if (typeof this.props.onChange === 'function') {
        this.props.onChange(this.requestTypeMap[key])
      }
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
    return (
      <div className={css.RequestTypeSelector}>
        {this.typeItems}
      </div>
    )
  }
}

export default RequestTypeSelector
