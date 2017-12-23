import * as React from 'react'
import * as css from './Header.css'
import * as I from './Header.module'
import AddressBar from 'components/AddressBar/AddressBar'
import SelectBox, { Option, styles as selectBoxStyle } from 'components/SelectBox/SelectBox'
import Button from 'components/Button/Button'
import axios from 'axios'

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
    })
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
