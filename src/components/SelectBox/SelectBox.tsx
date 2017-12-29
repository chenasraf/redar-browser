import * as React from 'react'
import * as I from './SelectBox.module'
import * as css from './SelectBox.css'

class SelectBox extends React.Component<I.Props, I.State> {
  private inputRef: HTMLInputElement

  constructor(props: I.Props) {
    super(props)

    const selected = this.findOption(props.value)

    this.state = {
      selected,
      options: props.options,
      open: false,
      input: ''
    }
  }
  
  private get wrapperClassNames(): string {
    const prop = this.props.className || ''
    const open = this.state.open ? css.open : ''
    return [css.selectBox, prop.trim(), open].join(' ')
  }

  private get label(): string {
    return this.state.selected ? this.state.selected.label : this.state.input.toString()
  }

  public toggleDropdown(state: boolean = !this.state.open) {
    this.setState({ open: state })
  }

  private findOption(value: any) {
    return this.props.options.find((option: I.Option) => value === option.value)
  }

  public componentWillReceiveProps(nextProps: I.Props) {
    if (nextProps.value !== this.props.value) {
      const selected = this.findOption(nextProps.value)

      if (selected) {
        this.select(selected)
      } else {
        this.setState({
          input: nextProps.value.toString()
        })
      }
    }
  }

  public search(e: React.ChangeEvent<HTMLInputElement>) {
    const value = (e.target as HTMLInputElement).value
    const options = this.props.options.filter((option: I.Option) => (
      (option.label.toLowerCase().indexOf(value) > -1) ||
      (String(option.value).toLowerCase().indexOf(value) > -1)
    ))

    this.setState({
      input: value,
      options
    })
  }

  public select(option: I.Option, e?: React.MouseEvent<HTMLDivElement>) {
    
    if (e) {
      e.preventDefault()
    }
    
    this.inputRef.value = ''
    this.setState({
      selected: option,
      input: ''
    }, () => {
      this.toggleDropdown(false)
      if (typeof this.props.onChange === 'function') {
        this.props.onChange(this.state.selected!, e)
      }
    })
  }
  
  public render() {
    const options: Array<JSX.Element> = []
    
    this.state.options.forEach((option: I.Option) => {
      const classNames = [
        css.option,
        option.className,
        this.state.selected && this.state.selected.value === option.value ? css.selected : ''
      ].join(' ')

      options.push(
        <div key={(option.value || ('rand-' + Math.random())).toString()}
          className={classNames}
          onClick={(e) => this.select(option, e)}>
          {option.label}
        </div>
      )
    })

    return (
      <div className={this.wrapperClassNames}>
        <input className={css.input}
          type="text"
          ref={(ref) => this.inputRef = ref!}
          placeholder={this.state.selected && this.state.selected.label || this.props.placeholder}
          onChange={(e) => this.search(e)}
          onFocus={e => {
            (e.target as HTMLInputElement).select()
            this.toggleDropdown(true)
          }}
          value={this.state.input}
          />
        <i className={css.arrow} onClick={() => this.toggleDropdown()} />
        <div className={css.optionsContainer}>
          {options}
        </div>
      </div>
    )
  }
}

export default SelectBox
export * from './SelectBox.module'
export { css as styles }
