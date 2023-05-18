// import {  } from './_types'
import { currentProps } from '@/store/app/_types'
import { 
  SET_ACTION,
  SET_CURRENT,
  SET_EDIT,
  SET_READY,
  SET_THEME,
} from './_namespace'

export const setAction = ( type: string, param?: string ) => {
  return {
    type: SET_ACTION,
    action: {
      type,
      param,
      stamp: Date.now()
    }
  }
}

export const setCurrent = ( current: currentProps ) => ( dispatch: Function, getState: Function ) => {
  const state = getState()
  const setDispatch =  () => {
    dispatch({
      type: SET_CURRENT,
      current
    })
  }
  if (state.app.edit){
    syncDispatch(() => setEdit(false), dispatch).then(() => {
      setDispatch()
    })
  } else {
    setDispatch()
  }
}

export const setEdit = ( edit: boolean ) => ( dispatch: Function, getState: Function ) => {
  dispatch({
    type: SET_EDIT,
    edit
  })
}

export const setReady = ( ready: boolean ) => {
  return {
    type: SET_READY,
    ready
  }
}

export const setTheme = ( theme: string ) => {
  return {
    type: SET_THEME,
    config: {
      theme
    }
  }
}

export const syncDispatch = (callback: Function, dispatch: Function) => new Promise((resolve: Function, reject: Function) => {
  dispatch(callback())
  resolve()
})
