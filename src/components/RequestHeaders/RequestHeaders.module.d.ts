import * as Immutable from 'immutable'

export interface IProps {
  className?: string
  store: any
}

export type HeaderSet = Immutable.List<[string, string]>

export interface IState {
  headers: HeaderSet
}
