import useTranslation from 'next-translate/useTranslation'
import { useState } from 'react'
import { useRecoilValue } from 'recoil'
import styled from 'styled-components'
import store from '@/store'

import { ControlColors, StyledColorChipProps } from './types'

import ColorPicker from '@/components/ColorPicker'
import Dialog from '@/components/Dialog'
import ControlButton from './ControlButton'

const StyledColorChip = styled.div<StyledColorChipProps>(
  ({ $color }) => `
    background-color: ${$color};
  `
)

const ControlColors: ControlColors = ({ action }) => {
  const { t } = useTranslation('app')
  
  const sheetState = store.sheet.state

  const position = useRecoilValue(sheetState.position)
  const colorChips = useRecoilValue(sheetState.colorChips)

  const [menuOpen, setMenuOpen] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)
  const handleMenuOpen = () => setMenuOpen(!menuOpen)
  const handlePickerOpen = () => setPickerOpen(!pickerOpen)

  return (<>
    <ControlButton icon={menuOpen ? 'palette' : 'format_color_text'} title={t('font-color')}
      classList={['controls__button--small']}
      iconClassList={menuOpen ? [] : ['icon--slim']}
      disabled={!['text', 'memo'].includes(position.col)}
      onClick={() => {
        if (['text', 'memo'].includes(position.col)){
          handleMenuOpen()
        }
      }}
    />
    <Dialog open={pickerOpen} onClose={handlePickerOpen}>
      <ColorPicker />
    </Dialog>
    {menuOpen && (
      <div className="controls__color-chips">
        {colorChips.map((color, index) => (
          <ControlButton title={(color as string).toLocaleUpperCase()} key={index}
            classList={['w-full']}
            disabled={!['text', 'memo'].includes(position.col)}
            onClick={() => {
              if (['text', 'memo'].includes(position.col)){
                action && action('color', color)
              }
            }}
          ><>
            <StyledColorChip className="color-chip" $color={color as string} />
            <div>
              <span className="color-chip__text">{color}</span>
            </div>
          </>
          </ControlButton>
        ))}
        <ControlButton icon="format_color_reset" title={t('font-color-reset')}
          disabled={!['text', 'memo'].includes(position.col)}
          onClick={() => {
            if (['text', 'memo'].includes(position.col)){
              action('color', 'reset')
            }
          }}
        />
        <ControlButton icon="colorize" title={t('colorize')}
          disabled={!['text', 'memo'].includes(position.col)}
          onClick={() => {
            if (['text', 'memo'].includes(position.col)){
              handlePickerOpen()
              // shiftEditAction('italic')
            }
          }}
        />

      </div>
    )}
  </>)
}
export default ControlColors