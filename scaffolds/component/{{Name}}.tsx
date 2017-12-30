import * as React from 'react'
import * as I from './{{Name}}.module'
import * as css from './{{Name}}.css'
import Dispatcher, { register, dispatch, ActionTypes } from 'common/Dispatcher'

class {{Name}} extends React.Component<I.Props, I.State> {
  private columns: string[]
  private listener: string

  constructor(props: I.Props) {
    super(props)

    // this.state = {
    //   // insert props here
    // }
  }

  public componentWillMount() {
    this.listener = register(ActionTypes.set, (data: any) => {
      console.debug('New data incoming to {{Name}}:', data)
    })
  }

  public componentWillUnmount() {
    Dispatcher.unregister(this.listener)
  }

  public render() {
    return (
      <div className={css.{{name}}}>
        Component: {{Name}}
      </div>
    )
  }
}

export default {{Name}}
