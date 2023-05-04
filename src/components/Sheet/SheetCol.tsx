import { sheetColProps } from "./types"
import { timeFormat } from '@/util/NumberUtils'

const SheetCol = ({ index, current, colName, rowData }: sheetColProps) => {
  const colData = Object.getOwnPropertyDescriptor(rowData, colName)?.value
  const colClassName = ['col']
  colClassName.push(colName)
  if (current.row === index && current.col === colName) {
    colClassName.push('current')
  }
  return (
    <div className={colClassName.join(' ')}>
      {colName === 'index' && (
        <div className="cell">{colData + 1}</div>
      )}
      {(colName === 'start' || colName === 'end') && (
        <div className="cell">{timeFormat(colData)}</div>
      )}
      {colName === 'dur' && (
        <div className="cell">{ rowData.end && ((rowData.end - rowData.start) / 1000).toFixed(3) }</div>
      )}
      {colName === 'text' && (
        <div className="cell" dangerouslySetInnerHTML={{
          __html: `${colData}`
        }}></div>
      )}
      {colName === 'memo' && (
        <div className="cell">{colData}</div>
      )}
    </div>
  )
}
export default SheetCol