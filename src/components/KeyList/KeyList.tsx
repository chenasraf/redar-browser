import * as React from 'react'
import * as css from './KeyList.css'
import * as I from './KeyList.module'
import AddressBar from 'components/AddressBar/AddressBar'
import SelectBox, { Option, styles as selectBoxStyle } from 'components/SelectBox/SelectBox'
import Button from 'components/Button/Button'
import axios, { AxiosResponse } from 'axios'
import Dispatcher, { register, dispatch, ActionTypes, StoreKeys } from 'common/Dispatcher'
import * as classNames from 'classnames'

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

  private keyListFromObject(data: any, relativePath: string = ''): I.KeyItem[] {
    const list: I.KeyItem[] = []

    if (relativePath === '') {
      list.push({
        label: '[Response]',
        path: '',
      })
    }

    Object.keys(data).forEach((key) => {
      const newPath = relativePath ? [relativePath, key].join('.') : key
      let children
      
      if (typeof data[key] !== 'string' && typeof data[key] !== 'number' && 
          data[key].constructor !== Array && Object.keys(data[key]).length) {
        children = this.keyListFromObject(data[key], newPath)
      }

      list.push({ label: key, path: newPath, children })
    })
    return list
  }

  private selectItem(key: I.KeyItem) {
    this.setState({ viewKey: key.path }, () => {
      dispatch(ActionTypes.UPDATE_VIEWKEY, key.path)
    })
  }

  private keyListElements(keyList: I.KeyItem[], depth: number = 0) {
    const fullData = this.props.store.get(StoreKeys.Response, {})
    const viewKey = this.state.viewKey

    return keyList.map((key: I.KeyItem) => {
      const className = classNames(css.item, {
        [css.selected]: viewKey === key.path
      })

      return (
        <div key={key.path}>
          <div className={className}
            style={{marginLeft: depth * 20 + 'px'}}
            onClick={(e) => this.selectItem(key)}>
            {key.label}
          </div>
          {key.children && key.children.length ? (
            this.keyListElements(key.children, depth + 1)
          ) : ''}
        </div>
      )
    })
  }

  render() {
    const className = classNames(css.KeyList, this.props.className)

    return (
      <div className={className}>
        {this.keyListElements(this.state.keyList)}
      </div>
    )
  }
}

export default KeyList
