import { stateProps } from './_types'

const getDefaultState = (fontSize = 14): stateProps => {
  let lineHeight: number = Math.floor(fontSize * 1.65)
  let padding: number = Math.floor(fontSize / 4.5)
  return {
    ready: false,
    config: {
      language: 'ko-KR',
      theme: 'black',
      format: 'smi',
      timeInterval: 30,
    },
    colStyles: {
      fontSize: fontSize,
      lineHeight: lineHeight,
      padding: padding,
    },
    current: {
      row: 0,
      col: 'text'
    },
  }
}

export default getDefaultState()