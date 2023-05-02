import React, { memo, ReactElement, useReducer, useState } from "react"
import { timeFormat } from '@/util/NumberUtils'

type rowDataProps = {
  index: number
  start: number
  end: number
  text: string
  memo: string
}
type sheetRowProps = {
  rowData : rowDataProps
  height: number
}
const SheetRow = ({ rowData, height }: sheetRowProps) => {
  return (
    <div className="sheet-row" data-index={rowData.index} style={{height: `${height}px`}}>
        <div className="col index">{ rowData.index + 1 }</div>
        <div className="col starttime">{ timeFormat(rowData.start) }</div>
        <div className="col endtime">{ timeFormat(rowData.end) }</div>
        <div className="col dur">{ ((rowData.end - rowData.start) / 1000).toFixed(3) }</div>
        <div className="col text" dangerouslySetInnerHTML={{
            __html: `${rowData.text}`
          }}></div>
        <div className="col memo">{ rowData.memo }</div>
    </div>
  )
}
export default SheetRow