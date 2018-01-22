import * as React from 'react'
import * as css from './NavBar.css'
import * as I from './NavBar.module'
import * as classNames from 'classnames'
import SelectBox, { Option, styles as selectBoxStyle } from 'components/SelectBox/SelectBox'
import AddressBar from 'components/AddressBar/AddressBar'
import Button from 'components/Button/Button'
import { StoreKeys } from 'common/Dispatcher'

class NavBar extends React.Component<I.IProps, I.IState> {  
  private httpMethods = [
    { label: 'GET', value: 'GET' },
    { label: 'POST', value: 'POST' },
    { label: 'PUT', value: 'PUT' },
    { label: 'DELETE', value: 'DELETE' },
  ] as Array<Option<string>>

  constructor(props: I.IProps) {
    super(props)
    this.state = {
      method: props.store.get(StoreKeys.RequestMethod, 'GET'),
      url: props.store.get(StoreKeys.RequestURL, ''),
    }
  }

  private changeMethod(value: string) {
    if (this.props.onChangeMethod) {
      this.props.onChangeMethod(value)
    }
  }

  private changeURL(value: string) {
    if (this.props.onChangeURL) {
      this.props.onChangeURL(value)
    }
  }

  private go() {
    if (this.props.onSend) {
      const { method, url } = this.state
      this.props.onSend({ method, url })
    }
  }

  render() {
    const className = classNames(css.NavBar, this.props.className)
    
    return (
      <div className={className}>
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

export default NavBar
