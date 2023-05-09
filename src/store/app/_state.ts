import { stateProps } from './_types'

const getDefaultState = (fontSize = 14): stateProps => {
  let lineHeight: number = Math.floor(fontSize * 1.65)
  let padding: number = Math.floor(fontSize / 4.5)
  return {
    ready: false,
    action: {
      type: '',
      stamp: 0
    },
    config: {
      language: 'ko-KR',
      theme: 'black',
      format: 'srt',
      timeInterval: 30,
    },
    colStyles: {
      fontSize: fontSize,
      lineHeight: lineHeight,
      padding: padding,
    },
    current: {
      row: 10,
      col: 'text'
    },
    edit: true
  }
}

export default getDefaultState()