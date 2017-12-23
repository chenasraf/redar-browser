import { Dispatcher } from 'flux'
import { ReduceStore } from 'flux/utils'
import * as Immutable from 'immutable'

export interface Action<T = any> {
  name: string,
  payload?: T
}

export const AppDispatcher = new Dispatcher<Action>()

type TState = Immutable.OrderedMap<string, any>

class AppStore extends ReduceStore<TState, Action> {
  constructor() {
    super(AppDispatcher)
  }

  getInitialState() {
    return Immutable.OrderedMap<string, any>()
  }

  reduce(state: TState, action: Action) {
    switch (action.name) {
      case 'get-data':
        return state
      case 'set-table-data':
        return state.set('tableData', action.payload)
      default:
        return state
    }
  }
}

export function dispatch(name: string, payload: any) {
  AppDispatcher.dispatch({
    name, payload
  })
}

export function register(name: string, callback: (payload: any) => void): string {
  return AppDispatcher.register((payload: Action) => {
    if (payload.name === name) {
      callback(payload.payload)
    }
  })
}

const Store = new AppStore()
export default AppDispatcher
export { Store }
