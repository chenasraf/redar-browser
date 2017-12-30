import * as React from 'react'
import * as css from './Header.css'
import * as I from './Header.module'
import AddressBar from 'components/AddressBar/AddressBar'
import RequestTypeSelector from 'components/RequestTypeSelector/RequestTypeSelector'
import SelectBox, { Option, styles as selectBoxStyle } from 'components/SelectBox/SelectBox'
import Button from 'components/Button/Button'
import axios, { AxiosResponse } from 'axios'
import { dispatch, ActionTypes } from 'common/Dispatcher'

class Header extends React.Component<I.IProps, I.IState> {
  private httpMethods = [
    { label: 'GET', value: 'GET' },
    { label: 'POST', value: 'POST' },
    { label: 'PUT', value: 'PUT' },
    { label: 'DELETE', value: 'DELETE' },
  ] as Array<Option<string>>

  constructor(props: I.IProps) {
    super(props)
    this.state = {
      url: localStorage.lastUrl || '',
      method: localStorage.lastMethod || 'GET',
      requestPayload: localStorage.lastRequestPayload || '',
      requestType: String,
    }
  }

  public componentWillMount() {
    if (this.state.url.length) {
      this.go()
    }
  }

  private changeURL(url: string) {
    this.setState({ url })
    localStorage.lastUrl = url
  }
  
  private changeMethod(method: string) {
    this.setState({ method })
    localStorage.lastMethod = method
  }
  
  private changeRequestPayload(requestPayload: string) {
    this.setState({ requestPayload })
    localStorage.lastRequestPayload = requestPayload
  }
  
  private changeRequestType(requestType: I.ReqTypeTransformer) {
    console.debug('Request type changed!', requestType)
    this.setState({ requestType })
    localStorage.lastRequestType = requestType
  }

  private go() {
    const { method, url: url } = this.state

    axios.request({ method, url, data: this.requestPayload })
      .then((response: AxiosResponse) => {
        const { data } = response
        let viewKey = this.props.store.get('viewKey', null)
        let tableData
        
        if (viewKey && data.hasOwnProperty(viewKey)) {
          tableData = data[viewKey]
        } else {
          for (const k in data) {
            if (data.hasOwnProperty(k) && data[k] && data[k].constructor === Array) {
              viewKey = k
              tableData = data[k]
            }
          }
        }

        if (!tableData) {
          tableData = [data]
        }

        dispatch(ActionTypes.set, {
          fullData: data,
          viewKey,
          tableData,
          columns: this.getDataColumns(tableData)
        })
      })
  }

  private get requestPayload() {
    return this.state.requestType(this.state.requestPayload)
  }
  
  private getDataColumns(data?: any) {
    if (!data || !data.length) {
      return []
    }

    const columns = Object.keys(data[0])
    const idIdx = columns.map(s => s.toLocaleLowerCase()).indexOf('id')
    const _idIdx = columns.map(s => s.toLocaleLowerCase()).indexOf('_id')

    if (idIdx >= 0) {
      columns.splice(idIdx, 1)
    }

    if (_idIdx >= 0) {
      columns.splice(_idIdx, 1)
    }

    columns.unshift('_id')

    return columns
  }

  render() {
    return (
      <div className={css.header}>
        <div className={css.nav}>
          <div className={css.method}>
            <SelectBox name="method"
              className={selectBoxStyle.selectBox}
              value={this.state.method}
              options={this.httpMethods}
              placeholder="METHOD"
              onChange={(value: Option<string>) => this.changeMethod(value.value!)}
              />
          </div>
          <div className={css.address}>
            <AddressBar url={this.state.url}
              handleChange={(value) => this.changeURL(value)}/>
          </div>
          <div className={css.go}>
            <Button onClick={() => this.go()}>Go</Button>
          </div>
        </div>
        <div className={css.requestDataContainer}>
          <div className={css.payloadType}>
            <RequestTypeSelector
              onChange={(transformer: I.ReqTypeTransformer) => this.changeRequestType(transformer)} />
          </div>
          <div className={css.payload}>
            <textarea name="requestPayload"
              value={this.state.requestPayload}
              onChange={(e) => this.changeRequestPayload(e.target.value)} />
          </div>
        </div>
      </div>
    )
  }
}

export default Header
