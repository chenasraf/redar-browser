import * as React from 'react'
import * as css from './Tabs.css'
import * as I from './Tabs.module'
import * as classNames from 'classnames'

export const Tab = (props: I.TabProps) => {
  const children = (props.children.constructor === Array
    ? props.children : [props.children]) as I.Tab[]
  const newProps = Object.assign({}, props)
  delete newProps.children

  return React.createElement('div', newProps, children)
}

export class TabContainer extends React.Component<I.ContainerProps, I.ContainerState> {
  constructor(props: I.ContainerProps) {
    const children = (props.children.constructor === Array
      ? props.children : [props.children]) as JSX.Element[]

    super(props)
    this.checkChildrenTypes(this.props.children, this.constructor.name)
    let activeIdx = 0
    let collapsed = false

    if (props.rememberAs && props.rememberAs.length) {
      try {
        const tabCache = JSON.parse(localStorage.getItem('tabs') || '{}')
        activeIdx = tabCache[props.rememberAs] || 0
        collapsed = Boolean(tabCache[props.rememberAs + '.collapsed'])
      } catch (e) {
        console.warn(e)
      }
    }
      
    this.state = {
      children,
      activeIdx,
      collapsed,
      collapsible: Boolean(props.collapsible),
    }
  }

  public componentWillReceiveProps(next: I.ContainerProps) {
    if (next.collapsible !== Boolean(this.state.collapsible)) {
      this.setState({ collapsible: Boolean(next.collapsible) })
    }
  }

  private checkChildrenTypes(children: React.ReactNode | JSX.Element[] | JSX.Element, componentName: string) {
    let error: Error | null = null
  
    React.Children.forEach(children, function (child: React.ReactElement<any>) {
      if (child.type !== Tab) {
        throw new Error('`' + componentName + '` children should be of type `Tab`.')
      }
    })
    
    return true
  }

  private tabStrip() {
    const arrowCls = classNames('material-icons', css.collapseIcon, {
      [css.collapsed]: this.state.collapsed
    })

    const stripCls = classNames(css.tabStrip, {
      [css.collapsed]: this.state.collapsed
    })

    return (
      <div className={stripCls}>
        {this.state.children.map((child, idx) => {
          const cls = classNames(css.tabLabel, {
            [css.active]: idx === this.state.activeIdx
          })
          const { onClick }: I.TabProps = child.props
          const onTabClick = this.onTabClick(idx, onClick)

          return (
            <div className={cls} key={`tab-${idx}`}
              onClick={onTabClick}>
              {child.props.label}
            </div>
          )
        })}
        {this.state.collapsible ? (
          <span className={arrowCls}
            onClick={() => this.onCollapseClick()}>
            keyboard_arrow_down
          </span>
        ) : ''}
      </div>
    )
  }

  private tabContents() {
    if (this.state.collapsed) {
      return (<div />)
    }
    const Child = this.state.children[this.state.activeIdx]
    const { children, className: tabClasses, ...rest }: I.TabProps = Child.props
    const cls = classNames(tabClasses, css.tabContent)

    return (
      <Child.type className={cls}
        {...rest}>
        {children}
      </Child.type>
    )
  }

  private onCollapseClick() {
    this.setState({ collapsed: !this.state.collapsed }, () => {
      if (this.props.rememberAs && this.props.rememberAs.length) {
        const key = this.props.rememberAs + '.collapsed'
        const tabCache = JSON.parse(localStorage.getItem('tabs') || '{}')
        localStorage.setItem('tabs', JSON.stringify({ ...tabCache, [key]: this.state.collapsed }))
      }
    })
  }

  private onTabClick(idx: number, callback?: (e: React.MouseEvent<HTMLDivElement>) => void) {
    const commonClick = (e: React.MouseEvent<HTMLDivElement>) => {
      this.setState({ activeIdx: idx }, () => {
        if (this.props.rememberAs && this.props.rememberAs.length) {
          const key = this.props.rememberAs
          const tabCache = JSON.parse(localStorage.getItem('tabs') || '{}')
          localStorage.setItem('tabs', JSON.stringify({ ...tabCache, [key]: this.state.activeIdx }))
        }
      })
    }

    if (callback) {
      return (e: React.MouseEvent<HTMLDivElement>) => {
        commonClick(e)
        callback(e)
      }
    }

    return (e: React.MouseEvent<HTMLDivElement>) => {
      commonClick(e)
    }
  }

  render() {
    const className = classNames(css.TabsContainer, this.props.className)
    
    return (
      <div className={className}>
        {this.tabStrip()}
        {this.tabContents()}
      </div>
    )
  }
}

export default TabContainer
