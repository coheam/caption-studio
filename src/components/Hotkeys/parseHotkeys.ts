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

export function mapKey(key: string): string {
  return (mappedKeys[key] || key)
    .trim()
    .toLowerCase()
    .replace(/key|digit|numpad|arrow/, '')
}