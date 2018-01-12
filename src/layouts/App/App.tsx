import * as React from 'react'
import * as css from './App.css'
import Header from 'components/Header/Header'
import KeyList from 'components/KeyList/KeyList'
import DataTable from 'components/DataTable/DataTable'
import axios, { AxiosResponse } from 'axios'
import { Store } from 'common/Dispatcher'

const data = [
  { first: 'John', last: 'Doe', age: 22 },
  { first: 'Jane', last: 'Doe', age: 24 },
]

export interface TProps {
  store: any
}

class App extends React.Component<TProps> {
  constructor(props: any) {
    super(props)

    /// #if EXTENSION
    axios.defaults.adapter = (config) => {
      return new Promise<AxiosResponse>(
        (resolve: (response: AxiosResponse) => void, reject: (reason: any) => void) => {
          chrome.runtime.sendMessage({ action: 'request', payload: config }, (response) => {
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError)
            }

            resolve(response)
          })
        })
    }
    /// #endif
  }

  render() {
    return (
      <div className={css.App}>
        <Header className={css.header} {...this.props} />
        <div className={css.content}>
          <KeyList className={[css.scrollable, css.keyList].join(' ')}
            {...this.props} />
          <DataTable className={[css.scrollable, css.table].join(' ')}
            {...this.props} />
        </div>
      </div>
    )
  }
}

export default App
