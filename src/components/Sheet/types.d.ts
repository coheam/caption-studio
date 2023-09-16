import React, { ReactElement } from 'react'
import { CellStyle, Position, TimeLine } from '@/store/sheet/_types'
import { Analysis } from '@/store/sheet/types'

export declare type SheetCol = (props: SheetColProps) => ReactElement
export interface SheetColProps {
  fontSize: number
  padding: number
  colKey: string
  position: Position
  timeline: TimeLine
  analysis: Analysis
  classList?: string[]
  onMouseDown?: (event: React.MouseEvent) => void
  onClick?: (event: React.MouseEvent) => void
  onDoubleClick?: (event: React.MouseEvent) => void
  onContextMenu?: (event: React.MouseEvent) => void
}
export interface ColRate {
  index: number
  start: number
  end: number
  dur: number
  text: number
  memo: number
}
export interface StyledSheetBoxProps {
  $fontSize: number
  $lineheight: number
}
export interface StyledCellBoxProps {
  $padding: number
}
export interface StyledSheetColProps {
  $colKey: string
  $fontSize: number
}
export interface StyledSheetRowProps {
  colNames: string[]
  cellStyle: CellStyle
  timeline: TimeLine
  position: Position
  setPosition: Function
}