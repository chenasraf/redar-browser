export interface IProps {
  store: any
}

export interface IState {
  url: string
  method: string
  requestPayload: string
  requestType: (str: string) => string
}

export type ReqTypeTransformer = (str: string) => string
