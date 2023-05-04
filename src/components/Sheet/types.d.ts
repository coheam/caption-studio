import { currentProps } from "@/store/app/_types"
import { timelineProps } from "@/store/subtitle/_types"

export interface sheetRowProps {
  format: string[]
  current: currentProps
  rowData : rowDataProps
  height: number
}

export interface sheetColProps {
  index: number
  current: currentProps
  colName: string
  rowData : rowDataProps
}

export interface rowDataProps extends timelineProps {
  index: number
}