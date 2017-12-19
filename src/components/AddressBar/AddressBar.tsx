import * as React from 'react'
import * as css from './AddressBar.css'
import * as types from './AddressBar.module'

class AddressBar extends React.Component<types.IProps, types.IState> {
  private handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target as HTMLInputElement
    if (typeof this.props.handleChange === 'function') {
      this.props.handleChange(value, e)
    }
  }

  render() {
    return (
      <div className={css.addressBar}>
        <input placeholder="https://www.example.com/request"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.handleChange(e)}
         />
      </div>
    )
  }
}

export default AddressBar
