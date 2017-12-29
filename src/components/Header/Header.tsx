import * as React from 'react'
import * as css from './Header.css'
import * as I from './Header.module'
import AddressBar from 'components/AddressBar/AddressBar'
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

  private go() {
    const { method, url: url } = this.state
    axios.request({ method, url, data: [
        { a: 1, b: 2, c: 3 }
      ]
    }).then((response: AxiosResponse) => {
      const { data } = response
      let viewKey = this.props.store.get('viewKey', null)
      let tableData
      
      if (viewKey && data.hasOwnProperty(viewKey)) {
        tableData = data[viewKey]
      } else {
        for (const k in data) {
          if (data.hasOwnProperty(k) && data[k].constructor === Array) {
            viewKey = k
            tableData = data[k]
          }
        }
      }

      dispatch(ActionTypes.set, {
        fullData: data,
        viewKey,
        tableData,
        columns: this.getDataColumns(tableData)
      })
    })
  }
  
  private getDataColumns(data?: any) {
    if (!data.length) {
      return []
    }

    const columns = Object.keys(data[0])
    const idIdx = columns.indexOf('_id')

    if (idIdx >= 0) {
      columns.splice(idIdx, 1)
    }

    columns.unshift('_id')

    return columns
  }

  render() {
    return (
      <div className={css.header}>
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
    )
  }
}

export default Header
