export interface IProps {
  className?: string
  onChangeMethod?(value: string): void
  onChangeURL?(value: string): void
  onSend?(request: { method: string, url: string }): void
  store: any
}

export interface IState {
  method: Methods
  url: string
}

export type Methods = 'GET' | 'POST' | 'PUT' | 'DELETE'
