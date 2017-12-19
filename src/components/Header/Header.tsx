import * as React from 'react'
import * as css from './Header.css'
import * as I from './Header.module'
import * as selectBoxStyle from 'components/SelectBox/SelectBox.css'
import AddressBar from 'components/AddressBar/AddressBar'
import SelectBox from 'components/SelectBox/SelectBox'
import Button from 'components/Button/Button'
import { Option } from 'components/SelectBox/SelectBox.module'

class Header extends React.Component<I.IProps, I.IState> {
  private httpMethods = [
    { label: 'GET', value: 'GET', className: selectBoxStyle.option },
    { label: 'POST', value: 'POST', className: selectBoxStyle.option },
    { label: 'PUT', value: 'PUT', className: selectBoxStyle.option },
    { label: 'DELETE', value: 'DELETE', className: selectBoxStyle.option },
  ] as Option<string>[]

  constructor(props: I.IProps) {
    super(props)
    this.state = {
      uri: '',
      method: 'GET',
    }
  }

  private changeURI(location: string) {
    this.setState({ uri: location })
  }

  private changeMethod(method: string) {
    this.setState({ method })
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
            <AddressBar handleChange={(value) => this.changeURI(value)}/>
          </div>
          <div className={css.go}>
            <Button>Go</Button>
          </div>
      </div>
    )
  }
}

export default Header
