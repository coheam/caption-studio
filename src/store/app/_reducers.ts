import { appStateProps, historyPayloadProps, logProps, payloadProps } from './_types'
import { 
  SET_ACTION,
  SET_CURRENT,
  SET_EDIT,
  SET_THEME,
  SET_READY,
  SET_HISTORY,
  BACK_HISTORY,
  FORWARD_HISTORY,
  CLEAR_HISTORY
} from './_namespace'
import initialState from './_state'
import { getObjectValue } from '@/util/ObjectUtils'
import cloneDeep from 'lodash.clonedeep'

const mutations = {
  [SET_ACTION]: ({ action }: payloadProps, store: appStateProps): appStateProps => {
    store.action = action
    return store
  },
  [SET_CURRENT]: ({ current }: payloadProps, store: appStateProps): appStateProps => {
    store.current = current
    return store
  },
  [SET_EDIT]: ({ edit }: payloadProps, store: appStateProps): appStateProps => {
    store.edit = edit
    return store
  },
  [SET_READY]: ({ ready }: payloadProps, store: appStateProps): appStateProps => {
    store.ready = ready
    return store
  },
  [SET_THEME]: ({ config : { theme } }: payloadProps, store: appStateProps): appStateProps => {
    store.config.theme = theme
    return store
  },
  [SET_HISTORY]: ({ log }: historyPayloadProps, store: appStateProps): appStateProps => {
    const { current: { tab } } = store
    if (!store.history.logs[tab]){
      store.history.logs[tab] = []
      store.history.index[tab] = 0
    }
    if (store.history.index[tab] !== store.history.logs[tab].length){
      store.history.logs[tab] = store.history.logs[tab].slice(0, store.history.index[tab])
    }
    store.history.current[tab] = log as unknown as logProps
    store.history.logs[tab].push(log)
    store.history.index[tab]++
    return store
  },
  [BACK_HISTORY]: (_: payloadProps, store: appStateProps): appStateProps => {
    const { current: { tab } } = store
    if (store.history.index[tab] > 0){
      store.history.index[tab]--
      store.history.current[tab] = store.history.logs[tab][store.history.index[tab]]
    }
    return store
  },
  [FORWARD_HISTORY]: (_: payloadProps, store: appStateProps): appStateProps => {
    const { current: { tab } } = store
    if (store.history.index[tab] < store.history.logs[tab].length){
      store.history.index[tab]++
      store.history.current[tab] = store.history.logs[tab][store.history.index[tab] - 1]
    }
    return store
  },
  [CLEAR_HISTORY]: (_: payloadProps, store: appStateProps): appStateProps => {
    store.history.logs = []
    store.history.index = []
    store.history.current = []
    return store
  }
}

const Reducers = (appState = initialState, payload: payloadProps) => {
  const mutation = getObjectValue(mutations, payload.type)
  if (typeof mutation === 'function') {
    const state = mutation(payload, cloneDeep(appState))
    return state
  } else {
    return appState
  }
}
export default Reducers