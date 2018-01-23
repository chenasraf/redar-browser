import * as React from 'react'
import * as css from './AddressBar.css'
import * as I from './AddressBar.module'
import Dispatcher, { StoreKeys } from 'src/common/Dispatcher'

class AddressBar extends React.Component<I.IProps, I.IState> {
  constructor(props: I.IProps) {
    super(props)

    this.state = {
      url: props.url
    }
  }
  private onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target as HTMLInputElement
    this.setState({ url: value }, () => {
      if (this.props.onChange) {
        this.props.onChange(value, e)
      }
    })
  }

  public componentWillReceiveProps(nextProps: I.IProps) {
    if (nextProps.url != null && nextProps.url !== this.props.url) {
      this.setState({ url: nextProps.url })
    }
  }

  render() {
    return (
      <div className={css.addressBar}>
        <input placeholder="https://www.example.com/request"
          value={this.state.url}
          onChange={(e) => this.onChange(e)}
         />
      </div>
    )
  }
}

export default AddressBar
