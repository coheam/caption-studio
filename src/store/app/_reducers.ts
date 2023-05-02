import { ActionProps } from './_types';
import { 
  INJECT,
  INSERT,
  DELETE
} from './_namespace'
import initialState from './_state'

const Reducers = (state = initialState, action: ActionProps) => {
  console.log(action.type)
  console.log('app store')
  switch (action.type) {
    case INJECT:
      return { ...state }
    case INSERT:
      return { ...state }
    case DELETE:
      return { ...state }
    default:
      return state;
  }
}
export default Reducers