import { Dispatcher } from 'flux'
import { ReduceStore } from 'flux/utils'
import * as Immutable from 'immutable'

const ActionTypes = {
  set: 'set-data',
}

export interface Action<T = any> {
  name: string,
  payload?: T
}

export const AppDispatcher = new Dispatcher<Action>()

function innerObjFromKey<T = any>(obj: T, k: string): Immutable.OrderedMap<string, T> {
  return Immutable.OrderedMap<string, any>(obj || {}).get(k, {})
}

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
      case ActionTypes.set:
        if (action.payload.constructor === Array && action.payload.length === 2) {
          return state.set(action.payload[0], action.payload[1])
        }

        const keys = Object.keys(action.payload)
        let reduced = state.toOrderedMap()

        for (const k of keys) {
          reduced = reduced.set(k, action.payload[k])
        }

        return reduced
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
export { Store, ActionTypes }
