import * as React from 'react'

export interface ContainerProps {
  className?: string
  children: JSX.Element[] | JSX.Element
  collapsible?: boolean
  rememberAs?: string
}

export interface ContainerState {
  children: JSX.Element[]
  activeIdx: number
  collapsed: boolean
}

export interface TabProps {
  className?: string
  children: any | any[]
  label: string
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void
}

export type Tab = React.ComponentElement<TabProps, React.Component<TabProps>>
