// import {  } from './_types'
import { syncDispatch } from '@/mixins'
import { currentProps, logProps } from '@/store/app/_types'
import { deleteTimeline, insertTimeline, updateTimeline } from '../subtitle/actions'
import { 
  SET_ACTION,
  SET_CURRENT,
  SET_EDIT,
  SET_READY,
  SET_THEME,
  SET_HISTORY,
  BACK_HISTORY,
  FORWARD_HISTORY,
  CLEAR_HISTORY
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
  if (state.app.edit){
    dispatch(setEdit(false))
  }
  dispatch({
    type: SET_CURRENT,
    current
  })
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

export const setHistory = ( log: logProps ) => {
  return {
    type: SET_HISTORY,
    log
  }
}

export const backHistory = () => ( dispatch: Function, getState: Function ) => {
  const { app: { history, current: { tab } } } = getState()
  if (history.index[tab] > 0){
    syncDispatch(()=>({
      type: BACK_HISTORY
    }), dispatch).then(()=>{
      const { app: { history } } = getState()
      const log = history.current[tab]
      switch (log.action){
        case 'insert':
          dispatch(deleteTimeline(log.index, log.current, true))
          break
        case 'update':
          dispatch(updateTimeline({
            ...log.current,
            data: log.back
          }, true))
          break
        case 'delete':
          dispatch(insertTimeline({
            ...log.current,
            data: log.back
          }, true))
          break
      }
      dispatch(setCurrent(log.current))
    })
  }
}

export const forwardHistory = () => ( dispatch: Function, getState: Function ) => {
  const { app: { history, current: { tab } } } = getState()
  if (history.index[tab] < history.logs[tab].length){
    syncDispatch(() => ({
      type: FORWARD_HISTORY
    }), dispatch).then(()=>{
      const { app: { history } } = getState()
      const log = history.current[tab]
      const current = {
        ...log.current,
        row: log.index
      }
      switch (log.action){
        case 'insert':
          dispatch(insertTimeline({
            ...current,
            data: log.forward
          }, true))
          break
        case 'update':
          dispatch(updateTimeline({
            ...current,
            data: log.forward
          }, true))
          break
        case 'delete':
          dispatch(deleteTimeline(log.index, current, true))
          break
      }
      dispatch(setCurrent(current))
    })
  }
}

export const clearHistory = () => {
  return {
    type: CLEAR_HISTORY,
  }
}