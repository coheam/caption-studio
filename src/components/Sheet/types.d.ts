import { currentProps } from "@/store/app/_types"
import { timelineProps } from "@/store/subtitle/_types"

export interface inputDataProps {
  top: number
  left: number
  width: number
  height: number
  data: string
}
export interface sheetRowProps {
  format: string[]
  current: currentProps
  rowData : rowDataProps
  height: number
  click: Function
  dblclick: Function
}

export interface sheetColProps {
  index: number
  current: currentProps
  colName: string
  rowData : rowDataProps
  click: Function
  dblclick: Function
}

export interface rowDataProps extends timelineProps {
  index: number
}