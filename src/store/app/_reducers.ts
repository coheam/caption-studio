import { reducersActionProps } from './_types';
import { 
  SET_ACTION,
  SET_CURRENT,
  SET_EDIT,
  SET_THEME,
  DELETE,
  SET_READY
} from './_namespace'
import initialState from './_state'

const Reducers = (state = initialState, action: reducersActionProps) => {
  const store = { ...state }
  switch (action.type) {
    case SET_ACTION:
      store.action = action.action
      return store
    case SET_CURRENT:
      store.current = action.current
      return store
    case SET_EDIT:
      store.edit = action.edit
      return store
    case SET_READY:
      store.ready = action.ready
      return store
    case SET_THEME:
      store.config.theme = action.config.theme
      return store
    case DELETE:
      return store
    default:
      return store
  }
}
export default Reducers