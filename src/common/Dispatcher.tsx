import { Dispatcher } from 'flux'
import { ReduceStore } from 'flux/utils'
import * as Immutable from 'immutable'

export interface Action<T = any> {
  name: string,
  payload?: T
}

export const AppDispatcher = new Dispatcher<Action>()

type TState = {}

class AppStore extends ReduceStore<TState, Action> {
  private state: TState

  constructor() {
    super(AppDispatcher)
    this.state = {}
  }

  getInitialState() {
    return Immutable.OrderedMap([])
  }

  getState() {
    return this.state
  }

  reduce(state: TState, action: Action) {
    switch (action.name) {
      case 'get-data':
        return state
      default:
        return state
    }
  }
}

const Store = new AppStore()

export default AppDispatcher
export { Store }
