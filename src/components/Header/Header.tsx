import * as React from 'react'
import * as css from './Header.css'
import * as I from './Header.module'
import AddressBar from 'components/AddressBar/AddressBar'
import RequestPayload from 'components/RequestPayload/RequestPayload'
import { Tab, TabContainer } from 'components/Tabs/Tabs'
import SelectBox, { Option, styles as selectBoxStyle } from 'components/SelectBox/SelectBox'
import Button from 'components/Button/Button'
import axios, { AxiosResponse } from 'axios'
import { dispatch, register, ActionTypes, StoreKeys, Store } from 'common/Dispatcher'
import * as classNames from 'classnames'
import NavBar from 'components/NavBar/NavBar'
import RequestHeaders from 'components/RequestHeaders/RequestHeaders'
import Transformer from 'components/Transformer/Transformer'
const logo = require('../../../public/android-chrome-192x192.png')

class Header extends React.Component<I.IProps, I.IState> {
  constructor(props: I.IProps) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div className={classNames(css.header, this.props.className)}>
        <div className={css.navBarContainer}>
          <img src={logo} />
          <NavBar store={this.props.store} />
        </div>
        <TabContainer rememberAs="mainTabs" collapsible={true}>
          <Tab label="Data" className={css.requestDataContainer}>
            <RequestPayload store={this.props.store} />
            <RequestHeaders store={this.props.store} />
          </Tab>
          <Tab label="Transform Response">
            <Transformer store={this.props.store} />
          </Tab>
        </TabContainer>
      </div>
    )
  }
}

export default Header
