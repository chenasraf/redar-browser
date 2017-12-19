import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from './layouts/App/App'
import registerServiceWorker from './registerServiceWorker'
import './index.css'

ReactDOM.render(
  <App />,
  document.getElementById('root') as HTMLElement
)

/// #if !EXTENSION
  registerServiceWorker()
/// #endif
