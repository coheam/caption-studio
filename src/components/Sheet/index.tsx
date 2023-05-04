import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { storeProps } from "@/store"
import SheetRow from './SheetRow'

const colMoved = {
  smi : ['start','text','memo'],
  srt : ['start','end','text','memo']
}
const colFormat = {
  smi : ['index','start','dur','text','memo'],
  srt : ['index','start','end','dur','text','memo']
}
const Sheet = () => {
  const config = useSelector((state: storeProps) => state.app.config)
  const current = useSelector((state: storeProps) => state.app.current)
  const timeline = useSelector((state: storeProps) => state.subtitle.timeline)
  const rowHeight = useSelector((state: storeProps) => state.subtitle.state.map(({height}) => height))
  const dispatch = useDispatch()

  const sheetBodyRef = useRef<HTMLDivElement>(null)
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
    scrollHandler(e: any) {
      e.preventDefault()
      methods.update()
    },
    update() {
      const sheetBody: HTMLDivElement | null = sheetBodyRef.current
      if (sheetBody) {
        methods.drawRow(sheetBody.scrollTop, sheetBody.clientHeight)
        if (scrollLeft != sheetBody.scrollLeft){
          setScrollLeft(sheetBody.scrollLeft)
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
  }, [timeline])
  return (
    <>
    <div id="sheet" className="srt">
      <div className="sheet-head" style={{left: `-${scrollLeft}px`}}>
        <div className="sheet-panel tcp">
          <div className="sheet-row">
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
      <div className="sheet-body" ref={sheetBodyRef} onScroll={methods.scrollHandler}>
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