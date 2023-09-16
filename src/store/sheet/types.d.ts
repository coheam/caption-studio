import React from 'react'

export interface TimeLine {
  index?: number
  start: number
  end?: number
  text: string
  memo: string
}
export interface CellStyle {
  fontSize: number
  lineheight: number
  padding: number
}
export interface Analysis {
  line: number
  height: number
}
export interface DrawSheet {
  offsetTop: number,
  timelines: TimeLine[]
}
export interface ComputeDraw {
  subtitle: TimeLine[]
  analysis: Analysis[]
  scrollTop: number
  viewHeight:number
}
export interface Position {
  row: number
  col: ColType
}
export interface PositionState {
  top: number
  left: number
  width: number
  height: number
  data: number | string
}
export interface Log {
  action: string
  index: number
  back?: TimeLine | TimeLineLog[]
  forward?: TimeLine | TimeLineLog[]
  position: Position
}
export interface TimeLineLog {
  index: number
  timeline: TimeLine
}
export interface CustomKey {
  key: string
  value: string
}

export type color = React.CSSProperties['color']
export type ColType = 'start' | 'end' | 'text' | 'memo'
export type FormatType = 'smi' | 'srt'
export type PixelType = `${number}px`
type Nullable<T> = T | null