import * as React from 'react'
import * as css from './App.css'
import Header from 'components/Header/Header'
import DataTable from 'components/DataTable/DataTable'
import axios, { AxiosResponse } from 'axios'

const data = [
  { first: 'John', last: 'Doe', age: 22 },
  { first: 'Jane', last: 'Doe', age: 24 },
]

class App extends React.Component<{}> {
  constructor(props: {}) {
    super(props)
    console.debug('App Init!')

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
        <Header />
        <div style={{background: 'yellow'}}>
          {JSON.stringify(this.props)}
        </div>
        <DataTable data={data} />
      </div>
    )
  }
}

export default App
