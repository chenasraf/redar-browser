import { Dispatcher } from 'flux'
import { ReduceStore } from 'flux/utils'
import * as Immutable from 'immutable'
import axios, { AxiosResponse } from 'axios'

const ActionTypes = {
  SEND_REQUEST: 'SEND_REQUEST',
  UPDATE_RESPONSE: 'UPDATE_RESPONSE',
  UPDATE_VIEWKEY: 'UPDATE_VIEWKEY',
  UPDATE_REQ_TYPE: 'UPDATE_REQ_TYPE',
  UPDATE_REQ_PAYLOAD: 'UPDATE_REQ_PAYLOAD',
  UPDATE_REQ_METHOD: 'UPDATE_REQ_METHOD',
  UPDATE_REQ_HEADERS: 'UPDATE_REQ_HEADERS',
  UPDATE_REQ_URL: 'UPDATE_REQ_URL',
}

const StoreKeys = {
  Response: 'RESPONSE',
  ViewKey: 'VIEWKEY',
  RequestType: 'REQ_TYPE',
  RequestPayload: 'REQ_PAYLOAD',
  RequestMethod: 'REQ_METHOD',
  RequestHeaders: 'REQ_HEADERS',
  RequestURL: 'REQ_URL',
}

export type TActionName =
  'UPDATE_RESPONSE' | 'UPDATE_TABLE' | 'UPDATE_COLUMNS' | 'UPDATE_VIEWKEY' | 'UPDATE_REQ_TYPE' | 'SEND_REQUEST'

export interface IAction<T = any> {
  name: TActionName | string,
  payload?: T
}

export const AppDispatcher = new Dispatcher<IAction>()

function innerObjFromKey<T = any>(obj: T, k: string): Immutable.Map<string, T> {
  return Immutable.Map<string, any>(obj || {}).get(k, {})
}

export type IState = Immutable.Map<string, any>

class AppStore extends ReduceStore<IState, IAction> {
  constructor() {
    super(AppDispatcher)
  }

  getInitialState() {
    return Immutable.Map<string, any>([
      [StoreKeys.ViewKey, localStorage.lastViewKey || ''],
      [StoreKeys.RequestType, localStorage.lastRequestType || 'JSON'],
      [StoreKeys.RequestMethod, localStorage.lastMethod || 'GET'],
      [StoreKeys.RequestPayload, localStorage.lastPayload || ''],
      [StoreKeys.RequestURL, localStorage.lastURL || ''],
      [StoreKeys.RequestHeaders, this.parseHeaderList(localStorage.lastHeaders || '')],
    ])
  }

  reduce(state: IState, action: IAction) {
    switch (action.name) {
      case ActionTypes.UPDATE_RESPONSE:
        let viewKey = state.get(StoreKeys.ViewKey)
        if (localStorage.lastViewKey !== '' && action.payload && !action.payload.hasOwnProperty(viewKey)) {
          viewKey = this.getViewKey(action.payload)
          state = state.set(StoreKeys.ViewKey, viewKey)
        }
        return state.set(StoreKeys.Response, action.payload)
      case ActionTypes.UPDATE_VIEWKEY:
        localStorage.lastViewKey = action.payload
        return state.set(StoreKeys.ViewKey, action.payload)
      case ActionTypes.UPDATE_REQ_HEADERS:
        localStorage.lastHeaders = this.stringHeaders(action.payload)
        return state.set(StoreKeys.RequestHeaders, action.payload)
      case ActionTypes.UPDATE_REQ_URL:
        localStorage.lastURL = action.payload
        return state.set(StoreKeys.RequestURL, action.payload)
      case ActionTypes.UPDATE_REQ_METHOD:
        localStorage.lastMethod = action.payload
        return state.set(StoreKeys.RequestMethod, action.payload)
      case ActionTypes.UPDATE_REQ_PAYLOAD:
        localStorage.lastPayload = action.payload
        return state.set(StoreKeys.RequestPayload, action.payload)
      case ActionTypes.SEND_REQUEST:
        if (!action.payload) {
          action.payload = {
            url: state.get(StoreKeys.RequestURL),
            method: state.get(StoreKeys.RequestMethod),
            data: state.get(StoreKeys.RequestPayload),
            headers: this.headerListToObject(state.get(StoreKeys.RequestHeaders, Immutable.List<[string, string]>())),
          }
        }
        axios.request(action.payload)
          .then((response: AxiosResponse) => {
            dispatch(ActionTypes.UPDATE_RESPONSE, response.data)
          })
        return state
      default:
        return state
    }
  }

  public parseHeaderList(headers: string) {
    let headerMap = Immutable.List<[string, string]>()

    headers.split('\n').forEach((header, idx) => {
      const [ name, value ] = header.split(':').map(s => s.trim())
      const finalName = name.split('-')
        .map(s => this.capitalize(s))
        .join('-')

      if (finalName) {
        headerMap = headerMap.set(idx, [finalName, value || ''])
      }
    })

    return headerMap
  }

  public headerListToObject(headers: Immutable.List<[string, string]>) {
    const headerObj = {}
    headers.toJS().forEach((header) => {
      let [ name, value ] = header
      name = name.split('-').map(s => this.capitalize(s)).join('-')
      headerObj[name] = value
    })
    return headerObj
  }

  public stringHeaders(headers: Immutable.List<[string, string]>) {
    return headers.entrySeq()
      .map((header) => {
        if (!header) {
          return
        }
        let [ name, value ] = header[1]
        name = name.split('-').map(s => this.capitalize(s)).join('-')
        return name ?
          `${name}: ${value}`
        : undefined
      })
      .filter(s => Boolean(s))
      .join('\n')
  }
  
  private capitalize(str: string) {
    if (!str) {
      return ''
    }
    return str[0].toUpperCase() + str.slice(1).toLowerCase()
  }

  private getViewKey(data: any) {
    for (const k in data) {
      if (data.hasOwnProperty(k) && data[k] && data[k].constructor === Array) {
        return k
      }
    }
    
    return ''
  }
}

export function dispatch(name: TActionName | string, payload: any) {
  AppDispatcher.dispatch({ name, payload })
}

function register(name: TActionName | string, callback: (payload: any) => void): string {
  return AppDispatcher.register((payload: IAction) => {
    if (payload.name === name) {
      console.debug('Dispatching:', payload.name, payload.payload)
      callback(payload.payload)
    }
  })
}

const Store = new AppStore()
export default AppDispatcher
export { Store, ActionTypes, StoreKeys, AppDispatcher as Dispatcher, register }
