import React, { useEffect, useRef, useState } from 'react'
import { sheetColProps } from "./types"
import { timeFormat } from '@/util/NumberUtils'

const SheetCol = ({ index, current, colName, rowData, click, dblclick }: sheetColProps) => {
  const compute = {
    colData: Object.getOwnPropertyDescriptor(rowData, colName)?.value,
    colClassName: (() => {
      const className = ['col']
      className.push(colName)
      if (current.row === index && current.col === colName) {
        className.push('current')
      }
      return className.join(' ')
    })(),
  }
  const methods = {
    clickHandler(e: React.SyntheticEvent){
      e.preventDefault()
      e.stopPropagation()
      if (colName !== 'index' && colName !== 'dur') {
        console.log(colName)
        click(index, colName)
      }
    },
    dbClickHandler(e: React.SyntheticEvent){
      e.preventDefault()
      e.stopPropagation()
      dblclick()
    }
  }
  return (
    <div className={compute.colClassName}
      onClick={methods.clickHandler}
      onDoubleClick={methods.dbClickHandler}
    >
      {colName === 'index' && (
        <div className="cell">{compute.colData + 1}</div>
      )}
      {(colName === 'start' || colName === 'end') && (
        <div className="cell">{timeFormat(compute.colData)}</div>
      )}
      {colName === 'dur' && (
        <div className="cell">{ rowData.end && ((rowData.end - rowData.start) / 1000).toFixed(3) }</div>
      )}
      {colName === 'text' && (
        <div className="cell" dangerouslySetInnerHTML={{
          __html: `${compute.colData}`
        }}></div>
      )}
      {colName === 'memo' && (
        <div className="cell">{compute.colData}</div>
      )}
    </div>
  )
}
export default SheetCol