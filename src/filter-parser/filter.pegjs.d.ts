export function parse<T extends FilterResultValue = FilterResultValue>(input: string): FilterResult<T>

export type Oper = '=' | '>' | '<' | '>=' | '<=' | '!='
export type Value = string | number
export interface FilterResultValue {
  oper: Oper
  value: Value
}

export interface FilterResult<T extends FilterResultValue = FilterResultValue> {
  [filter: string]: FilterResultValue
}
