import useTranslation from 'next-translate/useTranslation'
import React, { useEffect, useRef, useState } from 'react'
import { Badge, Button, Input, NoSsr } from '@mui/base'
import { useRecoilCallback, useRecoilValue } from 'recoil'
import store from '@/store'
import { Position } from '@/store/sheet/types'
import { pressedKey } from './parseHotkeys'
import { isEqual } from 'lodash'
import { ControlSearch } from './types'

const ControlSearch: ControlSearch = ({ open, onClose }) => {
  const { t } = useTranslation('app')

  const sheetState = store.sheet.state

  
  const subtitle = useRecoilValue(sheetState.subtitle)
  const error = useRecoilValue(sheetState.error)
  const position = useRecoilValue<Position>(sheetState.position)
  const result = useRecoilValue<Position[]>(sheetState.search)

  const [key, setKey] = useState<string>('')
  const [current, setCurrent] = useState<number>(0)
  const [findError, setFindError] = useState<boolean>(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const positionRef = useRef<Position>(position)
  const searchRef = useRef<boolean>(false)

  const find = (() => findError ? error : result)()
  

  const getApprox = ($position: Position): number => {
    let approx:number = 0
    let remain:number
    if (findError) {
      error.map((row, index) => {
        const remaining = Math.abs(row - $position.row)
        if (remain === undefined || remain > remaining) {
          approx = index
          remain = remaining
        }
      })
    } else {
      result.map((pos, index) => {
        const remaining = Math.abs(pos.row - $position.row)
        if (remain === undefined || remain > remaining || (remaining === 0 && pos.col === $position.col)) {
          approx = index
          remain = remaining
        }
      })
    }
    return approx
  }
  const getPostemp = ($position: Position): number => {
    const colGroup = ['start', 'end', 'text', 'memo']
    const postemp = $position.row * 10 + colGroup.indexOf($position.col)
    return postemp
  }
  const prevPosition = useRecoilCallback(({ set }) => async () => {
    if (find.length) {
      const approx = getApprox(position)
      const approxStemp = findError ? error[approx] : getPostemp(result[approx])
      const poStemp = findError ? position.row : getPostemp(position)
      let prevIndex = approxStemp >= poStemp ? approx - 1 : approx
      if (prevIndex < 0) {
        prevIndex = find.length - 1
      }
      const prevPosition = findError ? { row: find[prevIndex], col: 'start' } : find[prevIndex]
      set(sheetState.position, prevPosition as Position)
    }
  }, [ find, findError, position ])
  const nextPosition = useRecoilCallback(({ set }) => async () => {
    if (find.length) {
      const approx = getApprox(position)
      const approxStemp = findError ? error[approx] : getPostemp(result[approx])
      const poStemp = findError ? position.row : getPostemp(position)
      let nextIndex = approxStemp <= poStemp ? approx + 1 : approx
      if (nextIndex == find.length) {
        nextIndex = 0
      }
      const nextPosition = findError ? { row: find[nextIndex], col: 'start' } : find[nextIndex]
      set(sheetState.position, nextPosition as Position)
    }
  }, [ find, findError, position ])
  const setApproxPosition = useRecoilCallback(({ set }) => async () => {
    if (searchRef.current) {
      searchRef.current = false
      if (find.length) {
        const approx = getApprox(positionRef.current)
        const approxPosition = findError ? { row: find[approx], col: 'start' } : find[approx]
        set(sheetState.position, approxPosition as Position)
      } else {
        set(sheetState.position, positionRef.current)
      }
    }
  }, [ find, findError ])
  const setFind = useRecoilCallback(({ set, snapshot }) => async () => {
    const $result = await snapshot.getPromise(sheetState.search)
    const findPosition: Position[] = []
    if (key !== '' &&document) {
      let inbox = document?.createElement('div')
      subtitle.map(({text, memo}, index) => {
        inbox.innerHTML = text
        if (inbox.innerText.toLocaleLowerCase().includes(key.toLocaleLowerCase())) {
          findPosition.push({
            row: index,
            col: 'text'
          })
        }
        if (memo !== '') {
          inbox.innerHTML = memo
          if (inbox.innerText.toLocaleLowerCase().includes(key.toLocaleLowerCase())) {
            findPosition.push({
              row: index,
              col: 'memo'
            })
          }
        }
      })
      inbox.remove()
    }
    if (!isEqual($result, findPosition)) {
      set(sheetState.search, findPosition)
    }
  }, [key, subtitle])
  const destroyFind = useRecoilCallback(({ set }) => async () => {
    onClose && onClose()
    setFindError(false)
    setKey('')
    set(sheetState.search, [])
  }, [])
  const handleFindError = useRecoilCallback(({ set }) => async () => {
    searchRef.current = !findError
    if (searchRef.current) {
      setKey('')
      set(sheetState.search, [])
    }
    setFindError(searchRef.current)
  }, [findError])
  const warningClassName = () => {
    const className = !findError ? 'search__warning' : 'search__warning--active'
    const classList = [className]
    return classList.join(' ')
  }
  const counterClassName = () => {
    const classList = ['search__counter']
    if (key.length !== 0 && find.length === 0) {
      classList.push('text-red-600')
    }
    return classList.join(' ')
  }
  const searchInputEventHandler = {
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
      e.stopPropagation()
      const pressed = pressedKey(e as unknown as KeyboardEvent)
      if (pressed.has('enter')) {
        const value = (inputRef.current?.firstChild as HTMLInputElement)?.value ?? ''
        if (value != key) {
          setTimeout(() => {
            searchRef.current = true
            setKey(value)
          })
        }
      }
    },
    onInput: (e: React.KeyboardEvent<HTMLInputElement>) => {
      e.stopPropagation()
    }
  }
  useEffect(() => { setFind() }, [ setFind ])
  useEffect(() => { setApproxPosition() }, [ setApproxPosition ])
  useEffect(() => {
    const index = findError ?
      find.findIndex((row) => row === position.row) :
      (find as Position[]).findIndex(({row,col}) => row === position.row && col === position.col)
    if (find.length === 0 || index < 0) {
      positionRef.current = position
    } else {
      setCurrent(index + 1)
    }
  }, [find, findError, position])
  
  return (<>
  <NoSsr>
    {open && (<>
      <div className="controls__search">
        <div className="search__inbox">
          {error.length > 0 && (
            <Badge badgeContent={error.length} className="badge__warning">
              <Button type="button" className={warningClassName()}
                onClick={handleFindError}
              >
                <i className="icon">priority_high</i>
                <div className="sr-only">{t('text-warning')}</div>
              </Button>
            </Badge>
          )}
          {findError ? (<>
            <div className="search__error">{t("placeholder-find-error")}</div>
          </>) : (<>
            <Input className="search__input" ref={inputRef}
              autoFocus={true}
              placeholder={t("placeholder-find")}
              multiline={false}
              {...searchInputEventHandler}
              endAdornment={
                <Button className="search__input--button"
                  aria-label="toggle password visibility"
                  onClick={() => {}}
                >
                  <i className="icon">search</i>
                </Button>
              }
            />
          </>
          )}
          <div className={counterClassName()}>
            {find.length == 0 ? (<>{t('no-result')}</>) : (<>
              <span className="search__counter--total">{find.length}</span>
              {t("find-of")} 
              <span className="search__counter--current">{current}</span>
            </>)}
          </div>
          <div className="search__control">
            <Button className="search__control--button"
              disabled={find.length === 0}
              onClick={prevPosition}
            >
              <i className="icon">arrow_upward</i>
              <span className="sr-only">{t('button-prev')}</span>
            </Button>
            <Button className="search__control--button"
              disabled={find.length === 0}
              onClick={nextPosition}
            >
              <i className="icon">arrow_downward</i>
              <span className="sr-only">{t('button-next')}</span>
            </Button>
          </div>
          <Button type="button" className="search__control--button"
            onClick={destroyFind}
          >
            <i className="icon">close</i>
            <span className="sr-only">{t("button-close")}</span>
          </Button>
        </div>
      </div>
    </>)}
  </NoSsr>
  </>)
}
export default ControlSearch