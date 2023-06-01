import { useState, useEffect, useRef } from "react"
import { storeProps } from "@/store"
import { useSelector, useDispatch } from "react-redux"
import { backHistory, forwardHistory, setAction, setEdit } from "@/store/app/actions"
import { buttonTypeProps } from "@/components/Button/types"
import Button from "@/components/Button"
import { colorType } from "@/store/app/_types"
import ColorChip from "../ColorChip"

const Controller = () => {
  const dispatch = useDispatch()
  const isEdit = useSelector((state: storeProps) => state.app.edit)
  const current = useSelector((state: storeProps) => state.app.current)
  const history = useSelector((state: storeProps) => state.app.history)
  const colorList = useSelector((state: storeProps) => state.app.colors)
  const isClip = useRef(false)
  const [colorPanelVisible, setColorPanelVisible] = useState(false)
  const sheetController = [
    {
      type: 'button', id: 'sheet-edit', title: '내용 편집', icon: isEdit && !isClip.current ? 'edit_off' : 'edit',
      classList: ['btn-control', 'single-controls'],
      isDisable: false,
      click: () => {
        dispatch(setEdit(!isEdit))
      }
    }, {
      type: 'button', id: 'sheet-insert', title: '현재 열 뒤 열 추가', icon: 'add_box',
      classList: ['btn-control', 'single-controls'],
      isDisable: (() => {
       return false 
      })(),
      click: () => {
        dispatch(setAction('sheet/row/insert'))
      }
    }, {
      type: 'button', id: 'sheet-remove', title: '현재 열 삭제', icon: 'indeterminate_check_box',
      classList: ['btn-control', 'single-controls'],
      isDisable: (() => {
       return false 
      })(),
      click: () => {
        if (!isEdit) {
          dispatch(setAction('sheet/row/delete'))
        }
      }
    }, {
      type: 'button', id: 'sheet-multiple', title: '다중 열 선택', icon: 'check_box',
      classList: ['btn-control', 'multiple-controls'],
      isDisable: (() => {
       return false 
      })(),
      click: () => {
        // dispatch(backHistory())
      }
    },
  ]
  const inputController = [
    {
      type: 'button', id: 'font-bold', title: '두껍게', icon: 'format_bold',
      classList: ['btn-control', 'single-controls', 'slim-icon'],
      isDisable: false,
      click: () => {
				if (['text', 'memo'].includes(current.col)){
          isClip.current = true
          dispatch(setAction('input/clip', 'bold'))
				}
      }
    }, 
    {
      type: 'button', id: 'font-underline', title: '밑줄', icon: 'format_underlined',
      classList: ['btn-control', 'single-controls'],
      isDisable: false,
      click: () => {
				if (['text', 'memo'].includes(current.col)){
          isClip.current = true
					dispatch(setAction('input/clip', 'underline'))
				}
      }
    }, 
    {
      type: 'button', id: 'font-italic', title: '기울임', icon: 'format_italic',
      classList: ['btn-control', 'single-controls', 'slim-icon'],
      isDisable: false,
      click: () => {
				if (['text', 'memo'].includes(current.col)){
          isClip.current = true
          dispatch(setAction('input/clip', 'italic'))
				}
      }
    }
  ]
  const colorController = [
    {
      type: 'button', id: 'color-reset', title: '글자 색 초기화', icon: 'format_color_reset',
      classList: ['btn-control'],
      isDisable: false,
      click: () => {
				if (['text', 'memo'].includes(current.col)){
          isClip.current = true
					dispatch(setAction('input/clip', 'color/reset'))
				}
      }
    }, {
      type: 'button', id: 'color-select', title: '색상 선택', icon: 'colorize',
      classList: ['btn-control'],
      isDisable: false,
      click: () => {
				if (['text', 'memo'].includes(current.col)){
          isClip.current = true
					dispatch(setAction('input/clip', 'bold'))
				}
      }
    },
  ]
  const historyController = [
    {
      type: 'button', id: 'undo', title: '실행취소', icon: 'reply',
      classList: ['btn-control', 'single-controls'],
      isDisable: !(history.index[current.tab] > 0),
      click: () => {
        dispatch(backHistory())
      }
    }, {
      type: 'button', id: 'redo', title: '재실행', icon: 'forward',
      classList: (() => {
        const classList = ['btn-control', 'single-controls']
        return classList
      })(),
      isDisable: !history.logs[current.tab] || history.index[current.tab] == history.logs[current.tab].length,
      click: () => {
        dispatch(forwardHistory())
      }
    }
  ]
  useEffect(()=>{
    if (isEdit === false) {
      isClip.current = false
    }
    return () => {
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit])
  return (
    <div id="controller">
		<ul className="subtitle-util ui-left">
			<li className="ui-toggle">
				<a href="#" id="sheet-search" className="trigger i18n" data-title="sheet-search" title="자막 검색">
					<i className="mt icon-search"></i>
					<span className="i18n tir" data-text="sheet-search">자막 검색</span>
				</a>
				<div id="sheet-search-panel" className="panel">
					<form className="form-sheet-search" autoComplete="off">
						<input type="search" className="i18n i-sheet-search" autoComplete="off" name="key" data-placeholder="sheet-search-input" placeholder="검색어 입력" />
						<button type="submit" className="btn-sheet-search"><i className="mt icon-search"></i></button>
					</form>
					<input type="checkbox" id="error-search" name="error-search" className="none" />
					<label htmlFor="error-search" className="error-label" style={{display: "none"}}>
						<i className="mt icon-error_outline"></i>
						<strong className="error-count"></strong><span className="i18n" data-text="error-search">건의 오류 찾기</span>
					</label>
					<span className="result">0/0</span>
					<a href="#" className="btn-prev disabled i18n" data-title="prev" title="이전"><i className="mt icon-keyboard_arrow_up"></i><span className="i18n tir" data-text="prev">이전</span></a>
					<a href="#" className="btn-next disabled i18n" data-title="next" title="다음"><i className="mt icon-keyboard_arrow_down"></i><span className="i18n tir" data-text="next">다음</span></a>
				</div>
			</li>
		</ul>
		<ul className="time-util ui-left">
			<li><a href="#" id="time-edit" className="i18n btn-time-controls btn-multiple-controls disabled" data-title="time-edit" title="시간 편집">
				<i className="mt icon-update"></i>
				<span className="i18n tir" data-text="time-edit">시간 편집</span>
			</a></li>
			<li><a href="#" id="time-plus" className="i18n btn-time-controls btn-multiple-controls disabled" data-title="time-plus" title="자막 시간 증가">
				<span>+<strong>30</strong><small>ms</small></span>
			</a></li>
			<li><a href="#" id="time-minus" className="i18n btn-time-controls btn-multiple-controls disabled" data-title="time-minus" title="자막 시간 감소">
				<span>-<strong>30</strong><small>ms</small></span>
			</a></li>
		</ul>
		<ul className="text-util ui-right">
      {inputController.map((ctrl, index) => (
        <li key={index}>
          <Button
            type={ctrl.type as unknown as buttonTypeProps}
            id={ctrl.id}
            title={ctrl.title}
            icon={ctrl.icon}
            classList={ctrl.classList}
            isDisable={ctrl.isDisable as unknown as boolean}
            click={ctrl.click}
          >{ctrl.title}</Button>
        </li>
      ))}
			<li>
        <Button 
          type="button"
          id="font-color"
          title="글자 색 리스트"
          icon={colorPanelVisible ? 'palette' : 'format_color_text'}
          classList={['btn-control', 'slim-icon']}
          isDisable={false}
          click={(e: React.SyntheticEvent) => {
            setColorPanelVisible(!colorPanelVisible)
          }}
        ></Button>
				<div id="font-color-list" style={colorPanelVisible ? {display : 'block'} : {}}>
					<ul className="color-list">
            {colorList.map((color: colorType, index: number) => (
              <li className="color-panel" key={`${index}-${color}`}>
                <ColorChip color={color}
                  index={index + 1}
                ></ColorChip>
              </li>
            ))}
					</ul>
					<ul className="color-util">
            {colorController.map((ctrl, index) => (
              <li key={index}>
                <Button
                  type={ctrl.type as unknown as buttonTypeProps}
                  id={ctrl.id}
                  title={ctrl.title}
                  icon={ctrl.icon}
                  classList={ctrl.classList}
                  isDisable={ctrl.isDisable as unknown as boolean}
                  click={ctrl.click}
                >{ctrl.title}</Button>
              </li>
            ))}
					</ul>
				</div>
			</li>
		</ul>
		<ul className="sheet-util ui-right">
      {sheetController.map((ctrl, index) => (
        <li key={index}>
          <Button
            type={ctrl.type as unknown as buttonTypeProps}
            id={ctrl.id}
            title={ctrl.title}
            icon={ctrl.icon}
            classList={ctrl.classList}
            isDisable={ctrl.isDisable as unknown as boolean}
            click={ctrl.click}
          >{ctrl.title}</Button>
        </li>
      ))}
		</ul>
		<ul className="history">
      {historyController.map((ctrl, index) => (
        <li key={index}>
          <Button
            type={ctrl.type as unknown as buttonTypeProps}
            id={ctrl.id}
            title={ctrl.title}
            icon={ctrl.icon}
            classList={ctrl.classList}
            isDisable={ctrl.isDisable as unknown as boolean}
            click={ctrl.click}
          >{ctrl.title}</Button>
        </li>
      ))}
		</ul>
	</div>
  )
}
export default Controller