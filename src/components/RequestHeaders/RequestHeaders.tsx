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
      headers: props.store.get(StoreKeys.RequestHeaders, Immutable.List<[string, string]>())
    }
  }

  private updateHeaderName(idx: number, name: string) {
    const value = this.state.headers.get(idx, [name, ''])
    this.setState({
      headers: this.state.headers.set(idx, [name, value[1]])
    }, () => {
      dispatch(ActionTypes.UPDATE_REQ_HEADERS, this.state.headers)
    })
  }

  private updateHeaderValue(idx: number, value: string) {
    const header = this.state.headers.get(idx, ['', ''])

    this.setState({
      headers: this.state.headers.set(idx, [header[0], value || ''])
    }, () => {
      dispatch(ActionTypes.UPDATE_REQ_HEADERS, this.state.headers)
    })
  }

  private getHeaderName(idx: number) {
    return this.state.headers.get(idx, ['', ''])[0]
  }

  private getHeaderValue(idx: number) {
    return this.state.headers.get(idx, ['', ''])[1]
  }

  private removeHeader(idx: number) {
    this.setState({ headers: this.state.headers.remove(idx) })
  }

  render() {
    const className = classNames(css.RequestHeaders, this.props.className)
    const inputRowRange = Immutable.Range(0, this.state.headers.count() + 1)
    const moreThanOne = this.state.headers.count() > 0
    
    return (
      <div className={className}>
        <h4 className={css.title}>Headers</h4>
        {inputRowRange.map((i: number) => {
          return (
            <div key={`header-${i}`}
              className={css.pair}>
              <div className={css.close}>
                {moreThanOne && i < inputRowRange.count() - 1 ? (
                  <i className="material-icons"
                    onClick={() => this.removeHeader(i)}>close</i>
                ) : ''}
              </div>
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
