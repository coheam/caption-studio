import { sheetRowProps } from './types'
import SheetCol from "./SheetCol"

const SheetRow = ({ format, current, rowData, click, dblclick }: sheetRowProps) => {
  return (
    <div className="sheet-row" data-index={ rowData.index }>
      {format.map((colName: string, eq: number) => (
        <SheetCol key={Number(`${rowData.index}${eq}`)}
          index={rowData.index}
          current={current}
          colName={colName}
          rowData={rowData}
          click={click}
          dblclick={dblclick}
        ></SheetCol>
      ))}
    </div>
  )
}
export default SheetRow