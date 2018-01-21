export type ClassNameFunc = (index?: number, item?: string) => string

export interface IProps {
  className?: string | ClassNameFunc
  data: any
}

export interface IState {
  // state
}
