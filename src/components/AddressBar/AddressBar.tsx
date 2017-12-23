import * as React from 'react'
import * as css from './AddressBar.css'
import * as I from './AddressBar.module'
import Dispatcher from 'src/common/Dispatcher'

class AddressBar extends React.Component<I.IProps, I.IState> {
  constructor(props: I.IProps) {
    super(props)

    this.state = {
      url: props.url || ''
    }
  }
  private handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target as HTMLInputElement
    if (typeof this.props.handleChange === 'function') {
      this.props.handleChange(value, e)
    }
  }

  public componentWillReceiveProps(nextProps: I.IProps) {
    if (nextProps.url && nextProps.url !== this.props.url) {
      this.setState({ url: nextProps.url })
    }
  }

  render() {
    return (
      <div className={css.addressBar}>
        <input placeholder="https://www.example.com/request"
          value={this.state.url}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.handleChange(e)}
         />
      </div>
    )
  }
}

export default AddressBar
