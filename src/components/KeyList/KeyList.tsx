import * as React from 'react'
import * as css from './KeyList.css'
import * as I from './KeyList.module'
import AddressBar from 'components/AddressBar/AddressBar'
import SelectBox, { Option, styles as selectBoxStyle } from 'components/SelectBox/SelectBox'
import Button from 'components/Button/Button'
import axios, { AxiosResponse } from 'axios'
import Dispatcher, { register, dispatch, ActionTypes } from 'common/Dispatcher'

class KeyList extends React.Component<I.IProps, I.IState> {
  private listener: string

  constructor(props: I.IProps) {
    super(props)
    this.state = {
      keyList: this.keyListFromObject(props.store.get('fullData', {})),
      viewKey: props.store.get('viewKey', null)
    }
  }

  public componentWillMount() {
    this.listener = register(ActionTypes.set, (data: any) => {
      if (data.hasOwnProperty('fullData')) {
        this.setState({
          keyList: this.keyListFromObject(data.fullData || {})
        })
      }
      if (data.hasOwnProperty('viewKey')) {
        this.setState({
          viewKey: data.viewKey
        })
      }
    })
  }
  
  public componentWillUnmount() {
    Dispatcher.unregister(this.listener)
  }

  private keyListFromObject(data: any) {
    return [''].concat(Object.keys(data))
  }

  private selectItem(key: string) {
    const body = this.props.store.get('fullData', {})
    const tableData = body[key]

    this.setState({ viewKey: key }, () => {
      if (!key.length) {
        console.debug('entire response', [body])
        dispatch(ActionTypes.set, {
          tableData: [body],
          columns: this.columnListFromRow(body),
        })

        return
      }

      if (tableData.constructor !== Array) {
        return
      }

      const firstRow = tableData.length ? tableData[0] : {}
      const columns = this.columnListFromRow(firstRow)

      dispatch(ActionTypes.set, {
        tableData,
        columns
      })
    })
  }

  private columnListFromRow(row: any) {
    return ['_id'].concat(Object.keys(row).filter((k: string) => (
      k.toLowerCase() !== 'id' && k.toLowerCase() !== '_id'
    )))
  }

  private get keyListElements() {
    const fullData = this.props.store.get('fullData', {})

    return this.state.keyList.map((key: string) => {
      const className = [
        css.item,
        key === '' || (fullData[key] && fullData[key].constructor === Array) ? css.valid : '',
        this.state.viewKey === key ? css.selected : ''
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
    return (
      <div className={css.KeyList}>
        {this.keyListElements}
      </div>
    )
  }
}

export default KeyList
