
export type ValueTypes = any | null
export interface Props<T = ValueTypes> {
  name?: string
  value?: T
  options: Option<T>[]
  placeholder?: string
  onChange?(value: T, e: React.ChangeEvent<HTMLInputElement>): void
  className?: string
}


export interface State<T = ValueTypes> {
  selected?: Option<T> | null
  options: Array<Option<T>>
  open: boolean
  input: string
}

export interface Option<T = ValueTypes> {
  label: string
  value?: T
  className?: string
}

export as namespace ISelectBox