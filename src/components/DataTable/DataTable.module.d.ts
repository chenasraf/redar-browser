export interface Props {
  store: any
  className?: string
  static?: boolean
  data?: any[]
}

export interface Filters {
  [key: string]: string | undefined
}

export interface State {
  columns: string[]
  data: any[]
  filters: Filters
  sortKey: string
  sortDesc: boolean
}
