import * as React from 'react'
import * as css from './Header.css'
import * as I from './Header.module'
import AddressBar from 'components/AddressBar/AddressBar'
import RequestType from 'components/RequestType/RequestType'
import SelectBox, { Option, styles as selectBoxStyle } from 'components/SelectBox/SelectBox'
import Button from 'components/Button/Button'
import axios, { AxiosResponse } from 'axios'
import { dispatch, register, ActionTypes, StoreKeys } from 'common/Dispatcher'
import * as classNames from 'classnames'
import NavBar from 'components/NavBar/NavBar'
import RequestHeaders from 'components/RequestHeaders/RequestHeaders'

class Header extends React.Component<I.IProps, I.IState> {
  constructor(props: I.IProps) {
    super(props)
    this.state = {}
  }

  public componentDidMount() {
    if (this.props.store.get(StoreKeys.RequestURL).length) {
      this.go()
    }
  }

  private go() {
    dispatch(ActionTypes.SEND_REQUEST, {
      method: this.props.store.get(StoreKeys.RequestMethod),
      url: this.props.store.get(StoreKeys.RequestURL),
      data: this.props.store.get(StoreKeys.RequestPayload),
      headers: this.props.store.get(StoreKeys.RequestHeaders),
    })
  }

  render() {
    return (
      <div className={classNames(css.header, this.props.className)}>
        <NavBar store={this.props.store} />
        <div className={css.requestDataContainer}>
          <RequestType store={this.props.store} />
          <RequestHeaders store={this.props.store} />
        </div>
      </div>
    )
  }
}

export default Header
