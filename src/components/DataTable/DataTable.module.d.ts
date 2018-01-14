export interface Props {
  store: any
  className?: string
  static?: boolean
  data?: any[]
}

export interface Filters {
  [key: string]: string | undefined
}

export type FilterFunc = (a: any, b: any) => boolean

export interface State {
  columns: string[]
  data: any[]
  filters: Filters
  sortKey: string
  sortDesc: boolean
}
