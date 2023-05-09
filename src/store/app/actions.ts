// import {  } from './_types'
import storeProps, { colStylesProps, currentProps } from '@/store/app/_types'
import { 
  SET_ACTION,
  SET_CURRENT,
  SET_EDIT,
  SET_READY,
  SET_THEME,
} from './_namespace'

export const setAction = (type: string) => {
  return {
    type: SET_ACTION,
    action: {
      type,
      stamp: Date.now()
    }
  }
}

export const setCurrent = (current: currentProps) => {
  return {
    type: SET_CURRENT,
    current
  }
}

export const setEdit = (edit: boolean) => {
  return {
    type: SET_EDIT,
    edit
  }
}

export const setReady = (ready: boolean) => {
  return {
    type: SET_READY,
    ready
  }
}

export const setTheme = (theme: string) => {
  return {
    type: SET_THEME,
    config: {
      theme
    }
  }
}
