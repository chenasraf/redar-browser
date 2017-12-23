import App from './App/App'
import { Container } from 'flux/utils'
import { Store } from 'common/Dispatcher'
import * as React from 'react'

function getStores() {
  return [ Store ]
}

function getState() {
  return {
    store: Store.getState()
  }
}

function AppView<TProps>(props: any): React.ReactElement<TProps> {
  return <App {...props} />
}

export default Container.createFunctional(AppView, getStores, getState)
