import { Dispatcher } from 'flux'
import { ReduceStore } from 'flux/utils'
import * as Immutable from 'immutable'

const ActionTypes = {
  UPDATE_RESPONSE: 'UPDATE_RESPONSE',
  UPDATE_TABLE: 'UPDATE_TABLE',
  UPDATE_COLUMNS: 'UPDATE_COLUMNS',
  UPDATE_VIEWKEY: 'UPDATE_VIEWKEY',
  UPDATE_REQ_TYPE: 'UPDATE_REQ_TYPE',
}

const StoreKeys = {
  Response: 'RESPONSE',
  Table: 'TABLE',
  Columns: 'COLUMNS',
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
    return Immutable.OrderedMap<string, any>()
  }

  reduce(state: IState, action: IAction) {
    switch (action.name) {
      case ActionTypes.UPDATE_COLUMNS:
        return state.set(StoreKeys.Columns, action.payload)
      case ActionTypes.UPDATE_TABLE:
        return state.set(StoreKeys.Table, action.payload)
      case ActionTypes.UPDATE_RESPONSE:
        return state.set(StoreKeys.Response, action.payload)
      case ActionTypes.UPDATE_VIEWKEY:
        return state.set(StoreKeys.ViewKey, action.payload)
      default:
        return state
    }
  }
}

export function dispatch(name: TActionName | string, payload: any) {
  AppDispatcher.dispatch({
    name, payload
  })
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
