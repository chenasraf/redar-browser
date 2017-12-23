import * as React from 'react'
import * as css from './Button.css'

interface Props {
  className?: string
  [k: string]: any | null | undefined
}

class Button extends React.Component<Props> {
  render() {
    return (
      <button className={css.button} {...this.props}>
        {this.props.children}
      </button>
    )
  }
}

export default Button
