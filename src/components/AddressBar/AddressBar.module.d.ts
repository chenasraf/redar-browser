export interface IProps {
  store: any
  url: string
  onChange?(value: string, e: React.ChangeEvent<HTMLInputElement>): void
}

export interface IState {
  url: string
}
