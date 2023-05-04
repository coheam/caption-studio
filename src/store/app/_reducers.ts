import { ActionProps } from './_types';
import { 
  SET_THEME,
  SET_CURRENT,
  DELETE
} from './_namespace'
import initialState from './_state'

const Reducers = (state = initialState, action: ActionProps) => {
  const store = { ...state }
  switch (action.type) {
    case SET_THEME:
      store.config.theme = action.config.theme
      return store
    case SET_CURRENT:
      store.current = action.current
      return store
    case DELETE:
      return store
    default:
      return store
  }
}
export default Reducers