import * as React from 'react'
import * as css from './Button.css'

class Button extends React.Component {
  render() {
    return (
      <button className={css.button}>
        {this.props.children}
      </button>
    )
  }
}

export default Button
