'use client'
import React from 'react'
import styled from 'styled-components'
import utils from '@/utils'
import {
  ColRate,
  SheetCol,
  StyledCellBoxProps,
  StyledSheetColProps
} from './types'
import store from '@/store'
import { useRecoilValue } from 'recoil'

const StyledSheetCol = styled.div<StyledSheetColProps>(
  ({ $fontSize, $colKey }) => {
    const rate: ColRate = {
      index: 3.5625,
      start: 7.1875,
      end: 7.1875,
      dur: 5.1875,
      text: 25.75,
      memo: 25.75
    }
    const getRate = utils.object.getObjectValue(rate, $colKey)
    const calc = Math.ceil($fontSize * getRate)
    return `
      width: ${calc}px;
      min-width: ${calc}px;
    `
  }
)
const StyledCellBox = styled.div<StyledCellBoxProps>(
  ({ $padding }) => `
    padding: ${$padding}px;
  `
)
const SheetCol: SheetCol = ({
  fontSize,
  padding,
  colKey,
  position,
  timeline,
  analysis,
  classList = [],
  onMouseDown,
  onClick,
  onDoubleClick,
  onContextMenu
}) => {
  const sheetState = store.sheet.state
  
  const editable = useRecoilValue(sheetState.editable)

  const data = utils.object.getObjectValue(timeline, colKey)
  const colClassName = () => {
    const colClassList = [`sheet__col--${colKey}`, ...classList]
    if (position.row === timeline.index && (position.col === colKey || colKey === 'index')) {
      colClassList.push(colKey === 'index' ? 'sheet__current--index' : 'sheet__current')
    }
    return colClassList.join(' ')
  }
  return (
    <StyledSheetCol className={colClassName()}
      $colKey={colKey} 
      $fontSize={fontSize}
      data-row={ timeline.index }
      data-col={ colKey }
      onMouseDown={(e: React.MouseEvent) => {
        onMouseDown && onMouseDown(e)
      }}
      onClick={(e: React.MouseEvent) => {
        onClick && onClick(e)
      }}
      onDoubleClick={(e: React.MouseEvent) => {
        onDoubleClick && onDoubleClick(e)
      }}
      onContextMenu={(e: React.MouseEvent) => {
        onContextMenu && onContextMenu(e)
      }}
    >
      {colKey === 'index' && (
        <StyledCellBox className="sheet__cell" $padding={padding}>{data + 1}</StyledCellBox>
      )}
      {(colKey === 'start' || colKey === 'end') && (
        <StyledCellBox $padding={padding}
          className="sheet__cell"
        >{utils.number.timeFormat(data)}</StyledCellBox>
      )}
      {colKey === 'dur' && (
        <StyledCellBox className="sheet__cell" $padding={padding}>
          { timeline.end && ((timeline.end - timeline.start) / 1000).toFixed(3) }
        </StyledCellBox>
      )}
      {colKey === 'text' && (
        <StyledCellBox $padding={padding}
          className="sheet__cell"
          dangerouslySetInnerHTML={{__html: `${data}<br>`}}
        ></StyledCellBox>
      )}
      {colKey === 'memo' && (
        <StyledCellBox $padding={padding} style={
          !editable && position.row === timeline.index && position.col === 'memo' ? {
            'position': 'absolute',
            'WebkitLineClamp': 9999999999,
          } : {
            'WebkitLineClamp': analysis.line,
            'maxHeight':`${analysis.height - 1}px`
          }
        }
          className="sheet__cell"
          dangerouslySetInnerHTML={{__html: `${data}<br>`}}
        ></StyledCellBox>
      )}
    </StyledSheetCol>
  ) 
}
export default SheetCol