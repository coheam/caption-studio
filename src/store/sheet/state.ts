'use client'
import { atom, selector } from 'recoil'
import type { 
  FormatType,
  TimeLine,
  CellStyle,
  Analysis,
  DrawSheet,
  Position,
  PositionState,
  color,
  Log,
  CustomKey,
} from './types'
import { cloneDeep } from 'lodash'
import utils from '@/utils'
import { computeDraw } from '@/store/sheet/compute'
import { ColRate } from '@/components/Sheet/types'
import { fontSize } from '../app/state'

const colKeys = {
  smi : ['index','start','dur','text','memo'],
  srt : ['index','start','end','dur','text','memo']
}
const colRate: ColRate = {
  index: 3.5625,
  start: 7.1875,
  end: 7.1875,
  dur: 5.1875,
  text: 25.75,
  memo: 25.75
}

export const subtitleList = atom<TimeLine[][]>({
  key: 'subtitleList',
  default: [
    [{start:0, end: 0, text: "", memo: ""}]
  ],
  effects: [
    ({ setSelf, onSet }) => {
      try {
        if (window) {
          const StorageKey = 'subtitle-list'
          onSet(($subtitleList, _, isReset) => {
            if (!isReset) {
              utils.storage.set(StorageKey, $subtitleList)
            }
          })
        }
      } catch (error) {
        
      }
    }
  ]
})
export const analysisList = atom<Analysis[][]>({
  key: 'analysisList',
  default: [],
})
export const sheetTabList = atom<string[]>({
  key: 'sheetTabList',
  default: ['Sheet1'],
  effects: [
    ({ setSelf, onSet }) => {
      try {
        if (window) {
          const StorageKey = 'sheet-tab-list'
          onSet(($sheetTabList, _, isReset) => {
            !isReset && utils.storage.set(StorageKey, $sheetTabList)
          })
        }
      } catch (error) {
        
      }
    }
  ]
})
export const scrollTopList = atom<number[]>({
  key: 'scrollTopList',
  default: [0]
})
export const pagingList = atom<number[]>({
  key: 'pagingList',
  default: [0]
})
export const positionList = atom<Position[]>({
  key: 'positionList',
  default: [
    { row: 0, col: 'text' },
  ]
})
export const logList = atom<Log[][]>({
  key: 'logList',
  default: [
    []
  ],
  effects: [
    ({ setSelf, onSet }) => {
      try {
        if (window) {
          onSet(($logList, _, isReset) => {
            // if (!isReset) {
            //   utils.storage.set(StorageKey, $subtitleList)
            // }
          })
        }
      } catch (error) {
        
      }
    }
  ]
})
export const activeLogList = atom<number[]>({
  key: 'activeLogList',
  default: [0],
  effects: [
    ({ setSelf, onSet }) => {
      try {
        if (window) {
          onSet(($activeLog, _, isReset) => {
            // if (!isReset) {
            //   utils.storage.set(StorageKey, $subtitleList)
            // }
          })
        }
      } catch (error) {
        
      }
    }
  ]
})
export const search = atom<Position[]>({
  key: 'search',
  default: []
})

export const format = atom<FormatType>({
  key: 'format',
  default: 'smi'
})
export const viewHeight = atom<number>({
  key: 'viewHeight',
  default: 0
})
export const activeTab = atom<number>({
  key: 'activeTab',
  default: 0
})
export const editable = atom<boolean>({
  key: 'editable',
  default: false
})
export const timeStep = atom<number>({
  key: 'timeStep',
  default: 30
})
export const colorChips = atom<color[]>({
  key: 'colorChips',
  default: ['#ff0000','#ff00ff','#aa00ff','#0000ff','#00ffff','#00ff00','#ffff00','#ffaa00'],
  effects: [
    ({ setSelf, onSet }) => {
      try {
        if (window) {
          const StorageKey = 'CaptionColorTemp'
          onSet(($colorChips, _, isReset) => {
            if (!isReset) {
              utils.storage.set(StorageKey, $colorChips)
            }
          })
        }
      } catch (error) {
        
      }
    }
  ]
})
export const customKeys = atom<CustomKey[]>({
  key: 'customKeys',
  default: []
})

export const subtitle = selector<TimeLine[]>({
  key: 'subtitle',
  get: ({ get }) => {
    const $subtitleList = get(subtitleList)
    const $activeTab = get(activeTab)
    return $subtitleList[$activeTab]
  },
  set: ({ get, set }, $subtitle) => {
    const $subtitleList = cloneDeep(get(subtitleList))
    const $activeTab = get(activeTab)
    $subtitleList[$activeTab] = $subtitle as TimeLine[]
    set(subtitleList, $subtitleList)
  }
})
export const error = selector<number[]>({
  key: 'error',
  get: ({ get }) => {
    const $subtitle = get(subtitle)
    const $format = get(format)
    const errorList: number[] = []
    $subtitle.map(({ start, end }, index) => {
      const prev = $subtitle[index - 1]
      const next = $subtitle[index + 1]
      if ($format === 'smi') {
        if (next && start > next.start) {
          if (!errorList.includes(index)) {
            errorList.push(index)
          }
        }
      } else if ($format === 'srt') {
        end = end as number
        if (
          (next && end > next.start) || 
          (start > end) ||
          (prev && prev.end as number > start)
        ) {
          if (!errorList.includes(index)) {
            errorList.push(index)
          }
        }
      }
    })
    return errorList
  },
})
export const analysis = selector<Analysis[]>({
  key: 'analysis',
  get: ({ get }) => {
    const $analysisList = get(analysisList)
    const $activeTab = get(activeTab)
    return $analysisList[$activeTab]
  },
  set: ({ get, set }, $analysis) => {
    const $analysisList = cloneDeep(get(analysisList))
    const $activeTab = get(activeTab)
    $analysisList[$activeTab] = $analysis as Analysis[]
    set(analysisList, $analysisList)
  }
})
export const offsetHeightList = selector<number[]>({
  key: 'offsetHeightList',
  get: ({ get }) => {
    const $analysisList = get(analysisList)
    return $analysisList.map(($analysis) => $analysis.reduce((a, { height }) => a + height, 0))
  }
})
export const offsetHeight = selector<number>({
  key: 'offsetHeight',
  get: ({ get }) => {
    const $offsetHeightList = get(offsetHeightList)
    const $activeTab = get(activeTab)
    return $offsetHeightList[$activeTab]
  }
})
export const scrollTop = selector<number>({
  key: 'scrollTop',
  get: ({ get }) => {
    const $scrollTopList = get(scrollTopList)
    const $activeTab = get(activeTab)
    return $scrollTopList[$activeTab]
  },
  set: ({ get, set }, $scrollTop) => {
    const $scrollTopList = cloneDeep(get(scrollTopList))
    const $activeTab = get(activeTab)
    $scrollTopList[$activeTab] = $scrollTop as number
    set(scrollTopList, $scrollTopList)
  }
})
export const paging = selector<number>({
  key: 'paging',
  get: ({ get }) => {
    const $pagingList = get(pagingList)
    const $activeTab = get(activeTab)
    return $pagingList[$activeTab]
  },
  set: ({ get, set }, $paging) => {
    const $pagingList = cloneDeep(get(pagingList))
    const $activeTab = get(activeTab)
    $pagingList[$activeTab] = $paging as number
    set(pagingList, $pagingList)
  }
})
export const drawSheet = selector<DrawSheet>({
  key: 'drawSheet',
  get: ({ get }) => {
    const $activeTab = get(activeTab)
    const $subtitleList = get(subtitleList)
    const $analysis = get(analysis)
    const $paging = get(paging) ?? 0
    const $viewHeight = get(viewHeight)
    return computeDraw({
      subtitle: $subtitleList[$activeTab],
      analysis: $analysis, 
      scrollTop: $paging * $viewHeight - $viewHeight,
      viewHeight: $viewHeight,
    })
  }
})
export const position = selector<Position>({
  key: 'position',
  get: ({ get }) => {
    const $positionList = get(positionList)
    const $activeTab = get(activeTab)
    return $positionList[$activeTab]
  },
  set: ({ get, set }, $position) => {
    const $positionList = cloneDeep(get(positionList))
    const $activeTab = get(activeTab)
    $positionList[$activeTab] = $position as Position
    set(positionList, $positionList)
  }
})
export const positionState = selector<PositionState>({
  key: 'positionState',
  get: ({ get }) => {
    const $format = get(format)
    const $fontSize = get(fontSize)
    const $position = get(position)
    const $analysis = get(analysis)
    const $subtitle = get(subtitle)
    const before = $analysis.slice(0, $position.row)
    const timeline = $subtitle[$position.row]
    const formatColkeys = utils.object.getObjectValue(colKeys, $format)
    const colkeyIndex = formatColkeys.indexOf($position.col)
    const left = formatColkeys.slice(0, colkeyIndex).reduce((a:number, key: string): number => 
      a + Math.ceil(utils.object.getObjectValue(colRate, key) * $fontSize)
    , 0) - 1

    return {
      top: (before.length > 0 ? before.reduce((a, { height }) => a + height, 0) : 0) - 1,
      left,
      width: Math.ceil(utils.object.getObjectValue(colRate, $position.col) * $fontSize) + 1,
      height: $analysis[$position.row].height + 1,
      data: utils.object.getObjectValue(timeline, $position.col)
    }
  }
})
export const log = selector<Log[]>({
  key: 'log',
  get: ({ get }) => {
    const $logList = get(logList)
    const $activeTab = get(activeTab)
    return $logList[$activeTab]
  },
  set: ({ get, set }, $log) => {
    const $logList = cloneDeep(get(logList))
    const $activeTab = get(activeTab)
    $logList[$activeTab] = $log as Log[]
    set(logList, $logList)
  }
})
export const activeLog = selector<number>({
  key: 'activeLog',
  get: ({ get }) => {
    const $activeLogList = get(activeLogList)
    const $activeTab = get(activeTab)
    return $activeLogList[$activeTab]
  },
  set: ({ get, set }, $activeLog) => {
    const $activeLogList = cloneDeep(get(activeLogList))
    const $activeTab = get(activeTab)
    $activeLogList[$activeTab] = $activeLog as number
    set(activeLogList, $activeLogList)
  }
})
export const cellStyle = selector<CellStyle>({
  key: 'cellStyle',
  get: ({ get }) => {
    const getFontSize = get(fontSize)
    return {
      fontSize: getFontSize,
      lineheight: Math.floor(getFontSize * 1.65),
      padding: Math.floor(getFontSize / 4.5)
    }
  },
  set: ({ get, set }, $colStyle) => {
    $colStyle = $colStyle as CellStyle
    set(fontSize, $colStyle.fontSize)
  }
})