import { Dispatcher } from 'flux'
import { ReduceStore } from 'flux/utils'
import * as Immutable from 'immutable'

const ActionTypes = {
  UPDATE_RESPONSE: 'UPDATE_RESPONSE',
  UPDATE_VIEWKEY: 'UPDATE_VIEWKEY',
  UPDATE_REQ_TYPE: 'UPDATE_REQ_TYPE',
}

const StoreKeys = {
  Response: 'RESPONSE',
  ViewKey: 'VIEWKEY',
  RequestType: 'REQ_TYPE'
}

export type TActionName =
  'UPDATE_RESPONSE' | 'UPDATE_TABLE' | 'UPDATE_COLUMNS' | 'UPDATE_VIEWKEY' | 'UPDATE_REQ_TYPE'

export interface IAction<T = any> {
  name: TActionName | string,
  payload?: T
}

export const AppDispatcher = new Dispatcher<IAction>()

function innerObjFromKey<T = any>(obj: T, k: string): Immutable.OrderedMap<string, T> {
  return Immutable.OrderedMap<string, any>(obj || {}).get(k, {})
}

export type IState = Immutable.OrderedMap<string, any>

class AppStore extends ReduceStore<IState, IAction> {
  constructor() {
    super(AppDispatcher)
  }

  getInitialState() {
    const t = Immutable.OrderedMap<string, any>([
      [StoreKeys.ViewKey, localStorage.lastViewKey || '']
    ])
    console.debug(t)
    return t
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
      default:
        return state
    }
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
