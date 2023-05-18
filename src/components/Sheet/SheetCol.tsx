import React from 'react'
import { sheetColProps } from "./types"
import { timeFormat } from '@/util/NumberUtils'
import { getObjectValue } from '@/util/ObjectUtils'

const SheetCol = ({ index, current, colName, rowData, click, dblclick }: sheetColProps) => {
  const computed = {
    colData: getObjectValue(rowData, colName),
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
    <div className={computed.colClassName}
      onClick={methods.clickHandler}
      onDoubleClick={methods.dbClickHandler}
    >
      {colName === 'index' && (
        <div className="cell">{computed.colData + 1}</div>
      )}
      {(colName === 'start' || colName === 'end') && (
        <div className="cell">{timeFormat(computed.colData)}</div>
      )}
      {colName === 'dur' && (
        <div className="cell">{ rowData.end && ((rowData.end - rowData.start) / 1000).toFixed(3) }</div>
      )}
      {colName === 'text' && (
        <div className="cell" dangerouslySetInnerHTML={{
          __html: `${computed.colData}<br>`
        }}></div>
      )}
      {colName === 'memo' && (
        <div className="cell">{computed.colData}</div>
      )}
    </div>
  )
}
export default SheetCol