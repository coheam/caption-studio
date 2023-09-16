import useTranslation from 'next-translate/useTranslation'
import React, { useRef } from 'react'
import { 
  useRecoilState,
  useRecoilTransaction_UNSTABLE,
  useRecoilValue,
  useSetRecoilState
} from 'recoil'
import { cloneDeep } from 'lodash'
import { Button } from '@mui/base'
import utils from '@/utils'
import store from '@/store'
import { computeAnalysisList } from '@/store/sheet/compute'
import Confirm from '@/components/Confirm'

const SheetFooter = () => {
  const { t } = useTranslation('app')
  const sheetState = store.sheet.state
  const [sheetTabList, setSheetTabList] = useRecoilState(sheetState.sheetTabList)

  const activeTab = useRecoilValue(sheetState.activeTab)
  const cellStyle = useRecoilValue(sheetState.cellStyle)
  
  const setEditable = useSetRecoilState(sheetState.editable)

  const activeRef = useRef<number>(0)
  const createCountRef = useRef<number>(0)
  
  const createCountNameing = ($sheetTabList: string[]): string => {
    const stockName = `Sheet${++createCountRef.current}`
    if ($sheetTabList.includes(stockName)) {
      return createCountNameing($sheetTabList)
    }
    return stockName
  }
  const reduceTabActive = useRecoilTransaction_UNSTABLE(({ set }) => {
    return () => {
      if (activeTab !== activeRef.current) {
        set(sheetState.activeTab, activeRef.current)
      }
    }
  })
  const reduceSheetAdd = useRecoilTransaction_UNSTABLE(({ get, set }) => () => {
    const $subtitleList = cloneDeep(get(sheetState.subtitleList))
    const $sheetTabList = cloneDeep(get(sheetState.sheetTabList))
    const $positionList = cloneDeep(get(sheetState.positionList))
    const $scrollTopList = cloneDeep(get(sheetState.scrollTopList))
    const $pagingList = cloneDeep(get(sheetState.pagingList))
    const $logList = cloneDeep(get(sheetState.logList))
    const $activeLogList = cloneDeep(get(sheetState.activeLogList))
    const $count = $sheetTabList.length
    $subtitleList.push([{start:0, end: 0, text: "", memo: ""}])
    $sheetTabList.push(createCountNameing($sheetTabList))
    $positionList.push({ row: 0, col: 'text' })
    $scrollTopList.push(0)
    $pagingList.push(0)
    $logList.push([])
    $activeLogList.push(0)
    set(sheetState.sheetTabList, $sheetTabList)
    set(sheetState.analysisList, computeAnalysisList($subtitleList, cellStyle))
    set(sheetState.subtitleList, $subtitleList)
    set(sheetState.positionList, $positionList)
    set(sheetState.scrollTopList, $scrollTopList)
    set(sheetState.pagingList, $pagingList)
    set(sheetState.logList, $logList)
    set(sheetState.activeLogList, $activeLogList)
    set(sheetState.activeTab, $count)
  })
  const reduceSheetDelete = useRecoilTransaction_UNSTABLE(({ get, set, reset }) => () => {
    const $subtitleList = cloneDeep(get(sheetState.subtitleList))
    const $sheetTabList = cloneDeep(get(sheetState.sheetTabList))
    const $positionList = cloneDeep(get(sheetState.positionList))
    const $scrollTopList = cloneDeep(get(sheetState.scrollTopList))
    const $pagingList = cloneDeep(get(sheetState.pagingList))
    const $logList = cloneDeep(get(sheetState.logList))
    const $activeLogList = cloneDeep(get(sheetState.activeLogList))
    $subtitleList.splice(activeRef.current, 1)
    $sheetTabList.splice(activeRef.current, 1)
    $positionList.splice(activeRef.current, 1)
    $scrollTopList.splice(activeRef.current, 1)
    $pagingList.splice(activeRef.current, 1)
    $logList.splice(activeRef.current, 1)
    $activeLogList.splice(activeRef.current, 1)
    if ($subtitleList.length){
      set(sheetState.sheetTabList, $sheetTabList)
      set(sheetState.subtitleList, $subtitleList)
      set(sheetState.positionList, $positionList)
      set(sheetState.scrollTopList, $scrollTopList)
      set(sheetState.pagingList, $pagingList)
      set(sheetState.logList, $logList)
      set(sheetState.activeLogList, $activeLogList)
      if ( activeTab > 0 && activeTab >= activeRef.current ) {
        set(sheetState.activeTab, activeTab - 1)
      }
    } else {
      reset(sheetState.sheetTabList)
      reset(sheetState.subtitleList)
      reset(sheetState.positionList)
      reset(sheetState.scrollTopList)
      reset(sheetState.logList)
      reset(sheetState.activeLogList)
      reset(sheetState.activeTab)
    }
  })

  const tabEventHandler = {
    onClick: (e: React.MouseEvent<HTMLDivElement>) => {
      const tab = (e.target as HTMLDivElement).closest('.sheet__tab') as HTMLDivElement
      activeRef.current = Number(tab.dataset.index)
      setEditable(false)
      setTimeout(reduceTabActive)
    },
    onDoubleClick: (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLDivElement
      const tab = target.closest('.sheet__tab') as HTMLDivElement
      activeRef.current = Number(tab.dataset.index)
      target.contentEditable = (target.contentEditable !== 'true').toString()
      target.focus()
      utils.exec('selectAll')
    },
    onBlur: (e: React.SyntheticEvent<HTMLDivElement>) => {
      const target = e.target as HTMLDivElement
      const tab = target.closest('.sheet__tab') as HTMLDivElement
      const value = target.innerHTML
      const $sheetTabList = cloneDeep(sheetTabList)
      activeRef.current = Number(tab.dataset.index)
      target.contentEditable = (target.contentEditable !== 'true').toString()

      if ($sheetTabList[activeRef.current] !== value) {
        $sheetTabList[activeRef.current] = value
        setSheetTabList($sheetTabList)
      }
    },
    onKeyDown: (e: React.KeyboardEvent) => {
      const target = (e.target as HTMLDivElement)
      const key = e.key.toLocaleLowerCase()
      if (key === 'enter') {
        e.preventDefault()
        e.stopPropagation()
        target.blur()
      }
    }
  }
  const buttonAddEventHandler = {
    onClick:(e: React.MouseEvent) => {
      setEditable(false)
      setTimeout(reduceSheetAdd)
    }
  }
  const buttonDeleteEventHandler = {
    onClick:(e: React.MouseEvent) => {
      Confirm(t('confirm-sheet-remove'), {
        isCancel: true,
        labelCancel: t('button-cancel'),
        labelConfirm: t('button-confirm'),
        onConfirm: () => {
          const tab = (e.target as HTMLDivElement).closest('.sheet__tab') as HTMLDivElement
          activeRef.current = Number(tab.dataset.index)
          setEditable(false)
          setTimeout(reduceSheetDelete)
        }
      })
    }
  }
  return (<>
    {sheetTabList.map((tab, eq) => (
      <div className="sheet__tab" key={eq} aria-current={activeTab === eq} data-index={eq}>
        <div className="sheet__tab--text"
          contentEditable={false}
          suppressContentEditableWarning={false}
          { ...tabEventHandler }
        >{ tab }</div>
        <Button type="button" className="sheet__tab--delete"
          title={t('delete')}
          { ...buttonDeleteEventHandler }
        >
          <i className="icon">close</i>
        </Button>
      </div>
    ))}
    <Button className="sheet__tab--add" title={t('sheet-add')}
      { ...buttonAddEventHandler }
    >
      <i className="icon">add</i>
    </Button>
  </>)
}
export default SheetFooter