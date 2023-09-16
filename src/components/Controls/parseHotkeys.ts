import { detect } from 'detect-browser'
import {
  HotKey,
  KeyboardEventTypes,
  MapKey,
  MappedKeysProps,
  PressedKey,
} from './types'
import { CustomKey } from '@/store/sheet/types'

const browser = detect()
const mappedKeys: MappedKeysProps = {
  Escape: 'esc',
  ShiftLeft: 'shift',
  ShiftRight: 'shift',
  AltLeft: 'alt',
  AltRight: 'alt',
  MetaLeft: 'meta',
  MetaRight: 'meta',
  OSLeft: 'meta',
  OSRight: 'meta',
  Control: 'ctrl',
  ControlLeft: 'ctrl',
  ControlRight: 'ctrl',
  '-': 'minus',
  '+': 'plus',
  '=': 'plus',
  ' ': 'space',
}

export const mapKey: MapKey = (key) => {
  return (mappedKeys[key] || key)
    .trim()
    .toLowerCase()
    .replace(/key|digit|numpad|arrow/, '')
}
export const pressedKey: PressedKey = (e: KeyboardEvent) => {
  const pressedKeys: Set<string> = new Set<string>()
  const key = mapKey(e.key).toLocaleLowerCase()
  const code = mapKey(e.code).toLocaleLowerCase().replace('key', '')
  const regexp = /[ㄱ-ㅎㅏ-ㅣ가-힣]/
  e.metaKey && pressedKeys.add('meta')
  e.ctrlKey && pressedKeys.add('ctrl')
  e.altKey && pressedKeys.add('alt')
  e.shiftKey && pressedKeys.add('shift')
  if (key === 'process' || regexp.test(key)) {
    pressedKeys.add(code)
  } else {
    pressedKeys.add(key)
  }
  return pressedKeys
}
export const isPressed = (pressedKeys: Set<string>, mask: string, splitKey: string) => {
  const hotkeyArray = (Array.isArray(mask) ? mask : mask.split(splitKey)).sort().join('+')
  const pressedKey = Array.from(pressedKeys).sort().join('+')
  return hotkeyArray === pressedKey
}
export const hotKeyHandler = (
  hotKeys: HotKey[],
  customKeys: CustomKey[],
  type: KeyboardEventTypes,
  event: KeyboardEvent
) => {
  const hotKey = hotKeys.find(hotKey => {
    const customkey = customKeys.find(customKey => customKey.key === hotKey?.key)
    const mask = customkey?.value ?? hotKey.mask
    return hotKey.type == type && isPressed(pressedKey(event), mask, '+')
  })
  if (!event.isComposing && hotKey) {
    hotKey.handler(event)
  }
}