import * as React from 'react'
import * as css from './NavBar.css'
import * as I from './NavBar.module'
import * as classNames from 'classnames'
import SelectBox, { Option, styles as selectBoxStyle } from 'components/SelectBox/SelectBox'
import AddressBar from 'components/AddressBar/AddressBar'
import Button from 'components/Button/Button'
import { StoreKeys, dispatch, ActionTypes } from 'common/Dispatcher'

class NavBar extends React.Component<I.IProps, I.IState> {  
  private httpMethods = [
    { label: 'GET', value: 'GET' },
    { label: 'POST', value: 'POST' },
    { label: 'PUT', value: 'PUT' },
    { label: 'DELETE', value: 'DELETE' },
  ] as Array<Option<string>>

  constructor(props: I.IProps) {
    super(props)
    this.state = {
      method: props.store.get(StoreKeys.RequestMethod, 'GET'),
      url: props.store.get(StoreKeys.RequestURL, ''),
    }
  }

  public componentWillMount() {
    if (this.state.url.length) {
      this.go()
    }
  }

  private changeMethod(value: I.Methods) {
    dispatch(ActionTypes.UPDATE_REQ_METHOD, value)
    this.setState({ method: value })

    if (this.props.onChangeMethod) {
      this.props.onChangeMethod(value)
    }
  }

  private changeURL(value: string) {
    dispatch(ActionTypes.UPDATE_REQ_URL, value)
    this.setState({ url: value })

    if (this.props.onChangeURL) {
      this.props.onChangeURL(value)
    }
  }

  private go() {
    dispatch(ActionTypes.SEND_REQUEST, null)

    if (this.props.onSend) {
      const { method, url } = this.state
      this.props.onSend({ method, url })
    }
  }

  render() {
    const className = classNames(css.NavBar, this.props.className)
    
    return (
      <div className={className}>
        <div className={css.method}>
            <SelectBox name="method"
              className={selectBoxStyle.selectBox}
              value={this.state.method}
              options={this.httpMethods}
              placeholder="METHOD"
              onChange={(value: Option<I.Methods>) => this.changeMethod(value.value!)}
              />
          </div>
          <div className={css.address}>
            <AddressBar url={this.state.url}
              store={this.props.store}
              onChange={(value) => this.changeURL(value)}/>
          </div>
          <div className={css.go}>
            <Button onClick={() => this.go()}>Go</Button>
          </div>
      </div>
    )
  }
}

export default NavBar
