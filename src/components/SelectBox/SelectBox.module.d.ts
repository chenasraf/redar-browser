export interface Props<T> {
  name?: string
  value: any
  options: Option<T>[]
  placeholder?: string
  onChange?(value: T, e: React.ChangeEvent<HTMLInputElement>): void
  className?: string
}

export interface Option<T> {
  label: string
  value: T | null | undefined
  className?: string
}

export interface State<T> {
  selected?: Option<T> | null | undefined
  options: Option<T>[]
  open: boolean
  input: string
}

export as namespace ISelectBox