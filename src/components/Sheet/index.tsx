import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { storeProps } from "@/store"
import SheetRow from './SheetRow'

const Sheet = () => {
  const timeline = useSelector((state: storeProps) => state.subtitle.timeline)
  const rowHeight = useSelector((state: storeProps) => state.subtitle.state.map(({height}) => height))
  const dispatch = useDispatch()

  const sheetBodyRef = useRef<HTMLDivElement>(null)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [bodyOffset, setBodyOffset] = useState(0)
  const [bodyHeight, setBodyHeight] = useState(0)
  const [displayRow, setDisplayRow] = useState<any[]>([])

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
            <div className="index col">
              <div className="cell">#</div>
            </div>
            <div className="starttime col">
              <div className="cell">시작</div>
            </div>
            <div className="endtime col">
              <div className="cell">종료</div>
            </div>
            <div className="dur col">
              <div className="cell">지속</div>
            </div>
            <div className="text col">
              <div className="cell">내용</div>
            </div>
            <div className="memo col">
              <div className="cell">메모</div>
            </div>
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