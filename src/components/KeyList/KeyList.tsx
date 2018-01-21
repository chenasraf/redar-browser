import * as React from 'react'
import * as css from './KeyList.css'
import * as I from './KeyList.module'
import AddressBar from 'components/AddressBar/AddressBar'
import SelectBox, { Option, styles as selectBoxStyle } from 'components/SelectBox/SelectBox'
import Button from 'components/Button/Button'
import axios, { AxiosResponse } from 'axios'
import Dispatcher, { register, dispatch, ActionTypes, StoreKeys } from 'common/Dispatcher'

class KeyList extends React.Component<I.IProps, I.IState> {
  private listeners: string[]

  constructor(props: I.IProps) {
    super(props)
    this.state = {
      keyList: this.keyListFromObject(props.store.get(StoreKeys.Response, {})),
      viewKey: props.store.get(StoreKeys.ViewKey, '')
    }
  }

  public componentWillMount() {
    this.listeners = [
      register(ActionTypes.UPDATE_RESPONSE, (data: any) => {
        const viewKey = this.props.store.get(StoreKeys.ViewKey, '')

        this.setState({
          keyList: this.keyListFromObject(data || {}),
          viewKey,
        })
      }),
        
      register(ActionTypes.UPDATE_VIEWKEY, (data: any) => {
        this.setState({ viewKey: data })
      })
    ]
  }
  
  public componentWillUnmount() {
    this.listeners.forEach(l => Dispatcher.unregister(l))
  }

  private keyListFromObject(data: any) {
    return [''].concat(Object.keys(data))
  }

  private selectItem(key: string) {
    this.setState({ viewKey: key }, () => {
      dispatch(ActionTypes.UPDATE_VIEWKEY, key)
    })
  }

  private get keyListElements() {
    const fullData = this.props.store.get(StoreKeys.Response, {})
    const viewKey = this.state.viewKey

    return this.state.keyList.map((key: string) => {
      const className = [
        css.item,
        key === '' || (fullData[key] && fullData[key].constructor === Array) ? css.valid : '',
        viewKey === key ? css.selected : ''
      ].join(' ')

      return (
        <div className={className}
          key={key}
          onClick={(e) => this.selectItem(key)}>
          {key === '' ? '[Response]' : key}
        </div>
      )
    })
  }

  render() {
    const classNames = [
      css.KeyList,
      this.props.className || ''
    ].join(' ')
    return (
      <div className={classNames}>
        {this.keyListElements}
      </div>
    )
  }
}

export default KeyList
