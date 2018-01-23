import * as React from 'react'
import * as css from './RequestHeaders.css'
import * as I from './RequestHeaders.module'
import * as classNames from 'classnames'
import * as Immutable from 'immutable'
import { StoreKeys, ActionTypes, dispatch } from 'common/Dispatcher'

class RequestHeaders extends React.Component<I.IProps, I.IState> {
  constructor(props: I.IProps) {
    super(props)
    this.state = {
      headers: this.parseStringHeaders(props.store.get(StoreKeys.RequestHeaders, ''))
    }
  }

  private parseStringHeaders(headers: string) {
    let headerMap = Immutable.List<[string, string]>()

    headers.split('\n').forEach((header, idx) => {
      const [ name, value ] = header.split(':').map(s => s.trim())
      const finalName = name.split('-')
        .map(s => this.capitalize(s))
        .join('-')

      if (finalName) {
        headerMap = headerMap.set(idx, [finalName, value || ''])
      }
    })

    return headerMap
  }

  private get stringHeaders() {
    const seq = this.state.headers.entrySeq()

    return seq
      .map((header) => {
        if (!header) {
          return
        }
        let [ name, value ] = header[1]
        name = name.split('-').map(s => this.capitalize(s)).join('-')
        return name ?
          `${name}: ${value}`
        : undefined
      })
      .filter(s => Boolean(s))
      .join('\n')
  }

  private capitalize(str: string) {
    if (!str) {
      return ''
    }
    return str[0].toUpperCase() + str.slice(1).toLowerCase()
  }

  private updateHeaderName(idx: number, name: string) {
    const value = this.state.headers.get(idx, [name, ''])
    this.setState({
      headers: this.state.headers.set(idx, [name, value[1]])
    }, () => {
      dispatch(ActionTypes.UPDATE_REQ_HEADERS, this.stringHeaders)
    })
  }

  private updateHeaderValue(idx: number, value: string) {
    const header = this.state.headers.get(idx, ['', ''])

    this.setState({
      headers: this.state.headers.set(idx, [header[0], value || ''])
    }, () => {
      dispatch(ActionTypes.UPDATE_REQ_HEADERS, this.stringHeaders)
    })
  }

  private getHeaderName(idx: number) {
    return this.state.headers.get(idx, ['', ''])[0]
  }

  private getHeaderValue(idx: number) {
    return this.state.headers.get(idx, ['', ''])[1]
  }

  render() {
    const className = classNames(css.RequestHeaders, this.props.className)
    const inputRowRange = Immutable.Range(0, this.state.headers.count() + 1)
    
    return (
      <div className={className}>
        <h4 className={css.title}>Headers</h4>
        {inputRowRange.map((i: number) => {
          return (
            <div key={`header-${i}`}
              className={css.pair}>
              <div>
                <input type="text" 
                  placeholder="Name"
                  value={this.getHeaderName(i)}
                  onChange={(e) => this.updateHeaderName(i, (e.target as HTMLInputElement).value)}
                />
              </div>
              <div>
                <input type="text" 
                  placeholder="Value"
                  value={this.getHeaderValue(i)}
                  onChange={(e) => this.updateHeaderValue(i, (e.target as HTMLInputElement).value)}
                />
              </div>
            </div>
          )
        })}
      </div>
    )
  }
}

export default RequestHeaders
