import type { 
  TimeLine,
  CellStyle,
  Analysis,
  DrawSheet,
  ComputeDraw,
} from './types'
import utils from '@/utils'

export const computeAnalysisList = (subtitleList: TimeLine[][], styles: CellStyle) => {
  return subtitleList.map(subtitle => 
    subtitle.map(timeline => 
      computeAnalysisTimeline(timeline, styles)
    )
  )
}
export const computeAnalysisTimeline = (timeline: TimeLine, styles: CellStyle): Analysis => {
  const line: number = utils.vdom.breakLine(timeline.text)
  const height: number = ( line * styles.lineheight ) + ( styles.padding * 2 ) + 1
  return {
    line,
    height
  }
}
export const computeDraw = ({ subtitle, analysis, scrollTop = 0, viewHeight = 0 }: ComputeDraw): DrawSheet => {
  const timelines: any[] = []
  const count : number = subtitle?.length ?? 0
  const halfHeight = viewHeight / 2
  let offsetTop: number = 0
  let offset: number = 0
  let approx: number = ( Math.floor((scrollTop - (halfHeight)) / halfHeight) ) * halfHeight
  let index: number = analysis?.findIndex(({height}) => {
    offsetTop = offset
    offset+=height
    return offsetTop > approx
  })
  offset = 0
  while (index < count && offset < viewHeight * 3){
    if (subtitle[index]) {
      timelines.push({
        index,
        ...subtitle[index]
      })
    }
    offset += analysis[index].height
    index++
  }
  return {
    offsetTop : offsetTop,
    timelines
  }
}