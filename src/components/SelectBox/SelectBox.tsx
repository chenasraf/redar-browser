import * as React from 'react'
import * as I from './SelectBox.module'
import * as css from './SelectBox.css'

type T = string | number | {}

class SelectBox extends React.Component<I.Props<T>, I.State<T>> {
  private inputRef: HTMLInputElement

  constructor(props: I.Props<T>) {
    super(props)
    this.state = {
      selected: undefined,
      options: this.props.options,
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
    return this.state.selected ? this.state.selected.label : this.state.input
  }

  public toggleDropdown(state: boolean = !this.state.open) {
    this.setState({ open: state })
  }

  public componentWillReceiveProps(nextProps: I.Props<T>) {
    if (nextProps.value !== this.props.value) {
      this.setState({
        input: nextProps.value
      })
    }
  }

  public search(e: React.ChangeEvent<HTMLInputElement>) {
    const value = (e.target as HTMLInputElement).value
    const options = this.props.options.filter((option: I.Option<T>) => (
      (option.label.toLowerCase().indexOf(value) > -1) ||
      (String(option.value).toLowerCase().indexOf(value) > -1)
    ))

    this.setState({
      input: value,
      options
    })
  }

  public select(option: I.Option<T>, e?: React.MouseEvent<HTMLDivElement>) {
    console.log('selecting', option)
    
    if (e) {
      e.preventDefault()
    }
    
    this.inputRef.value = ''
    this.setState({
      selected: option,
      input: ''
    }, () => this.toggleDropdown(false))
  }
  
  public render() {
    const options: Array<JSX.Element> = []
    
    this.state.options.forEach((option: I.Option<T>) => {
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