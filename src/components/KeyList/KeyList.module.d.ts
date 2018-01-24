export interface IProps {
  store: any
  className?: string
}

export interface IState {
  keyList: KeyItem[]
  viewKey: string
}

export interface KeyItem {
  label: string,
  path: string
  children?: KeyItem[]
}
