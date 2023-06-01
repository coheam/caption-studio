import { appStateProps } from './_types'

const getDefaultState = (fontSize = 14): appStateProps => {
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
      format: 'smi',
      timeInterval: 30,
    },
    colStyles: {
      fontSize: fontSize,
      lineHeight: lineHeight,
      padding: padding,
    },
    current: {
      tab: 0,
      row: 0,
      col: 'text'
    },
    edit: false,
    history: {
      index: [],
      logs: [],
      current: []
    },
    colors: ['#ff0000','#ff00ff','#aa00ff','#0000ff','#00ffff','#00ff00','#ffff00','#ffaa00']
  }
}

export default getDefaultState()