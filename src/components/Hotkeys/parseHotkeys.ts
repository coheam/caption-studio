const mappedKeys: Record<string, string> = {
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
}

export const mapKey = (key: string): string => {
  return (mappedKeys[key] || key)
    .trim()
    .toLowerCase()
    .replace(/key|digit|numpad|arrow/, '')
}

export const pressedKey = (e: KeyboardEvent): Set<string> => {
  const pressedKeys: Set<string> = new Set<string>()
  const key = mapKey(e.key)
  const code = mapKey(e.code)
  e.metaKey && pressedKeys.add('meta')
  e.ctrlKey && pressedKeys.add('ctrl')
  e.altKey && pressedKeys.add('alt')
  e.shiftKey && pressedKeys.add('shift')
  if (key === 'process') {
    pressedKeys.add(code)
  } else {
    pressedKeys.add(key)
  }
  return pressedKeys
}