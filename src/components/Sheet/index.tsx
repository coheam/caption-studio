import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toCamelCase } from '@/util/stringUtils'
import { setCurrent, setEdit } from '@/store/app/actions'
import { storeProps } from "@/store"
import { currentColProps, currentProps } from '@/store/app/_types'
import { inputDataProps } from './types'
import SheetRow from './SheetRow'
import SheetInput from './SheetInput'
import { isEquals } from '@/util/ObjectUtils'

const Sheet = () => {
  const colMoved = {
    smi : ['start','text','memo'],
    srt : ['start','end','text','memo']
  }
  const colFormat = {
    smi : ['index','start','dur','text','memo'],
    srt : ['index','start','end','dur','text','memo']
  }
  const dispatch = useDispatch()

  const action = useSelector((state: storeProps) => state.app.action) 
  const config = useSelector((state: storeProps) => state.app.config)
  const current = useSelector((state: storeProps) => state.app.current)
  const isEdit = useSelector((state: storeProps) => state.app.edit)
  const timeline = useSelector((state: storeProps) => state.subtitle.timeline)
  const rowHeight = useSelector((state: storeProps) => state.subtitle.state.map(({height}) => height))

  const headRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const [inputData, setInputData] = useState<inputDataProps>({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    data: ''
  })
  const [scrollLeft, setScrollLeft] = useState(0)
  const [bodyOffset, setBodyOffset] = useState(0)
  const [bodyHeight, setBodyHeight] = useState(0)
  const [displayRow, setDisplayRow] = useState<any[]>([])

  const format = Object.getOwnPropertyDescriptor(colFormat, config.format)?.value
  const methods = {
    drawRow(scroll: number = 0, size:number = 0) {
      const display: any[] = []
      const count : number = timeline?.length ?? 0
      let top: number = 0
      let offset: number = 0
      let approx: number = ( Math.floor((scroll - size) / size) ) * size
      let index: number = rowHeight.findIndex((height) => {
        top = offset
        offset+=height
        return top > approx
      })
      offset = 0
      if (bodyOffset !== top || displayRow.length === 0 || displayRow.length === count) {
        if (timeline){
          while (index < count && offset < size * 3){
            if (timeline[index]) {
              display.push({
                index,
                ...timeline[index]
              })
            }
            offset += rowHeight[index]
            index++
          }
          setBodyHeight(rowHeight.reduce((a, b) => a + b, 0))
          setBodyOffset(top)
          setDisplayRow(display)
        }
      }
    },
    calcInputData(current: currentProps){
      const info: inputDataProps = {
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        data: ''
      }
      if (timeline[current.row]){
        info.top = [...rowHeight].reduce((acc: number,curr: number,i: number, arr:number[]) => {
          if (i === current.row) {
            arr.splice(1)
            acc -= curr
          }
          return (acc += curr)
        }, 0)
        Array.prototype.map.call(headRef.current?.children, (children: HTMLDivElement) => {
          if (children.className.includes(current.col)) {
            info.left = children.offsetLeft
            info.width = children.offsetWidth
          }
        })
        info.height = rowHeight[current.row]
        if (current.col === 'text' || current.col === 'memo') {
          info.data = Object.getOwnPropertyDescriptor(timeline[current.row], current.col)?.value
        }
      }
      return info
    },
    colPrev(){
      const moved = { ...current }
      const colGroup = Object.getOwnPropertyDescriptor(colMoved, config.format)?.value
      let index = colGroup.indexOf(current.col)
      if (index > 0){
        moved.col = colGroup[index - 1]
      } else if (moved.row > 0){
        //if (!Sheet.Multiple.State)
        moved.row -= 1
        moved.col = colGroup.pop()
      }
      if (!isEquals(current, moved)){
        dispatch(setCurrent(moved))
      }
    },
    colNext(){
      const moved = { ...current }
      const size = timeline.length - 1
      const colGroup = Object.getOwnPropertyDescriptor(colMoved, config.format)?.value
      let index = colGroup.indexOf(current.col)
      if (index < colGroup.length - 1){
        moved.col = colGroup[index + 1]
      } else if (moved.row < size){
        // if (!Sheet.Multiple.State)
        moved.row++
        moved.col = colGroup.shift()
      }
      if (!isEquals(current, moved)){
        dispatch(setCurrent(moved))
      }
    },
    rowPrev(){
      if(!isEdit) {
        const moved = { ...current }
        if (moved.row > 0) {
          moved.row -= 1
          dispatch(setCurrent(moved))
        }
      }
    },
    rowNext(){
      if(!isEdit) {
        const moved = { ...current }
        if (moved.row < timeline.length - 1) {
          moved.row += 1
          dispatch(setCurrent(moved))
        }
      }
    },
    pagePrev(){
      const body: HTMLDivElement | null = bodyRef.current
      const moved = { ...current }
      if ( body && moved.row > 0 ) {
        isEdit && dispatch(setEdit(false))
        const start = body.scrollTop
        const end = start + body.clientHeight
        let overflow = false
        let top = 0
        let position = inputData.top
        if ( start >= inputData.top || end < (inputData.top - inputData.height) ) {
          top = inputData.top - Math.floor(body.clientHeight * .925)
          top < 0 && (top = 0)
          overflow = true
        } else {
          top = start + 1
        }
        while(position >= top){
          if (moved.row > 0){
            moved.row--
            position -= rowHeight[moved.row]
          } else {
            break
          }
        }
        if ( overflow ) {
          body.scrollTop = position
        }
        dispatch(setCurrent(moved))
      }
    },
    pageNext(){
      const body: HTMLDivElement | null = bodyRef.current
      const size = timeline.length - 1
      const moved = { ...current }
      if (body && current.row < size) {
        isEdit && dispatch(setEdit(false))
        const start = body.scrollTop
        const end = start + body.clientHeight
        let overflow = false
        let bottom = 0
        let height = 0
        let position = inputData.top

        if (start > inputData.top || end <= (inputData.top + inputData.height)){
          bottom = inputData.top + Math.floor(body.clientHeight * .925)
          overflow = true
        } else {
          bottom = end
        }
        while (position <= bottom - height){
          if (moved.row < size) {
            height = rowHeight[moved.row]
            position += height
            moved.row++
          } else {
            break
          }
        }
        if ( overflow ) {
          body.scrollTop = position - body.clientHeight
        }
        dispatch(setCurrent(moved))
      }
    },
    callMove(){
      const moveData = methods.calcInputData(current)
      const body: HTMLDivElement | null = bodyRef.current
      if (body) {
        let start = body.scrollTop
        let end = start + body.clientHeight
        if (start > moveData.top) {
          body.scrollTop = moveData.top
        }
        if (end < moveData.top + moveData.height) {
          body.scrollTop = moveData.top + moveData.height - body.clientHeight
        }
        setInputData(moveData)
      }
    },
    callAction(){
      const actionState = action.type.split('/')
      if (actionState[0] === 'sheet') {
        const actionType = toCamelCase(actionState.slice(1).join('_'))
        Object.getOwnPropertyDescriptor(methods, actionType)?.value()
      }
    },
    scrollHandler(e: React.SyntheticEvent) {
      e.preventDefault()
      methods.update()
    },
    colClickHandler(index: number, colName: string){
      const active = {
        row: index,
        col: colName as currentColProps
      }
      if (isEdit) {
        dispatch(setEdit(false))
      }
      if (!isEquals(current, active)){
        dispatch(setCurrent({
          row: index,
          col: colName as currentColProps
        }))
      }
    },
    colDblClickHandler(){
      dispatch(setEdit(true))
    },
    update() {
      const body: HTMLDivElement | null = bodyRef.current
      const moveData = methods.calcInputData(current)
      if (body) {
        methods.drawRow(body.scrollTop, body.clientHeight)
        setInputData(moveData)
        if (scrollLeft != body.scrollLeft){
          setScrollLeft(body.scrollLeft)
        }
      }
    }
  }
  useEffect(()=>{
    methods.update()
    return () => {
      console.log('distory')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(timeline)])
  useEffect(()=>{
    methods.callMove()
    return () => {
      console.log('distory')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(current)])
  useEffect(()=>{
    methods.callAction()
    return () => {

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[action.stamp])
  return (
    <>
    <div id="sheet" className="srt">
      <div className="sheet-head" style={{left: `-${scrollLeft}px`}}>
        <div className="sheet-panel tcp">
          <div className="sheet-row" ref={headRef}>
            {format.map((colName: string, eq: number) => {
              const colClassName = ['col']
              colClassName.push(colName)
              return (
                <div className={colClassName.join(' ')} key={eq}>
                  <div className="cell">
                    {colName === 'index' && '#'}
                    {colName === 'start' && '시작'}
                    {colName === 'end' && '종료'}
                    {colName === 'dur' && '지속'}
                    {colName === 'text' && '내용'}
                    {colName === 'memo' && '메모'}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <div className="sheet-body" ref={bodyRef} onScroll={methods.scrollHandler}>
        <SheetInput         
          top={inputData?.top}
          left={inputData?.left}
          width={inputData?.width}
          height={inputData?.height}
          data={inputData?.data}
        />
        <div className="sheet-contain" style={{paddingTop: `${bodyOffset}px`, height: bodyHeight == 0 ? 'auto' : `${bodyHeight}px`}}>
          <div className="sheet-panel" style={{}}>
            {displayRow.map((rowData, index) => {
              const seq = rowData.index ?? index
              return (
                <SheetRow key={seq}
                  current={current}
                  format={format}
                  rowData={{ ...rowData, index: seq }}
                  height={rowHeight[seq]}
                  click={methods.colClickHandler}
                  dblclick={methods.colDblClickHandler}
                ></SheetRow>
              )
            })}
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
export default Sheet