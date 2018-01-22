export interface IProps {
  className?: string
  onChange?(payload: any): void
  store: any
}

export interface IState {
  type: string
  payload: string
}
