// import {  } from './_types'
import storeProps, { colStylesProps } from '@/store/app/_types'
import { 
  SET_THEME
} from './_namespace'


export const setTheme = (theme: string) => {
  return {
    type: SET_THEME,
    config: {
      theme
    }
  }
}
