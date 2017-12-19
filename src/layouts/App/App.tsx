import * as React from 'react'
import * as css from './App.css'
import Header from 'components/Header/Header'
import DataTable from 'components/DataTable/DataTable'

const data = [
  { first: 'John', last: 'Doe', age: 22 },
  { first: 'Jane', last: 'Doe', age: 24 },
]

class App extends React.Component {
  constructor(props: {}) {
    super(props)
    console.debug('App Init!')
  }

  render() {
    return (
      <div className={css.App}>
        <Header />
        <DataTable data={data} />
      </div>
    )
  }
}

export default App
