import * as React from 'react'
import * as css from './{{Name}}.css'
import * as I from './{{Name}}.module'

class {{Name}} extends React.Component<I.IProps, I.IState> {
  constructor(props: I.IProps) {
    super(props)
    this.state = {}
  }

  render() {
    const className = [
      css.{{Name}},
      this.props.className
    ].join(' ')
    
    return (
      <div className={className}>
        {{Name}} Component
      </div>
    )
  }
}

export default {{Name}}
