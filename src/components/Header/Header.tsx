import * as React from 'react'
import * as css from './Header.css'
import * as types from './Header.module'
import * as selectBoxStyle from 'components/SelectBox/SelectBox.css'
import AddressBar from 'components/AddressBar/AddressBar'
import SelectBox from 'components/SelectBox/SelectBox'
import Button from 'components/Button/Button'
import { Option } from 'components/SelectBox/SelectBox.module'

class Header extends React.Component<types.IProps, types.IState> {
  private httpMethods = [
    { label: 'GET', value: 'GET', className: selectBoxStyle.option },
    { label: 'POST', value: 'POST', className: selectBoxStyle.option },
    { label: 'PUT', value: 'PUT', className: selectBoxStyle.option },
    { label: 'DELETE', value: 'DELETE', className: selectBoxStyle.option },
  ] as Option<string>[]

  private handleChange(location: string) {
    // cool
  }

  render() {
    return (
      <div className={css.header}>
        <div className={css.method}>
            <SelectBox name="method"
              className={selectBoxStyle.selectBox}
              value="GET"
              options={this.httpMethods}
              placeholder="METHOD"
              onChange={(value: Option<string>) => this.handleChange(value.value!)}
            />
          </div>
          <div className={css.address}>
            <AddressBar handleChange={(value) => this.handleChange(value)}/>
          </div>
          <div className={css.go}>
            <Button>Go</Button>
          </div>
      </div>
    )
  }
}

export default Header
