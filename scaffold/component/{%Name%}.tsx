import * as React from 'react'
import * as css from './{%Name%}.css'
import * as I from './{%Name%}.module'

class {%Name%} extends React.Component<I.IProps, I.IState> {
  constructor(props: I.IProps) {
    super(props)
    this.state = {
    }
  }

  render() {
    return (
      <div className={css.{%Name%}}>
        {%Name%} Component
      </div>
    )
  }
}

export default {%Name%}
