export interface IProps {
  store: any
}

export interface IState {
  url: string
  method: string
  requestPayload: string
  requestType: string
  headers: string
}

export type ReqTypeTransformer = (str: string) => string
