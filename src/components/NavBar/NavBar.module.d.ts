export interface IProps {
  className?: string
  onChangeMethod?(value: string): void
  onChangeURL?(value: string): void
  onSend?(request: { method: string, url: string }): void
  store: any
}

export interface IState {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  url: string
}
