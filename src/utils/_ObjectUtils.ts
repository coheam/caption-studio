export const isEquals = (n: Object, o: Object) : boolean => {
  for (let k in n) {
    const nv = getObjectValue(n, k)
    const ov = getObjectValue(o, k)
    if (typeof nv === 'object') {
      return typeof ov === 'object' ? isEquals(nv, ov) : false
    }
    if (nv !== ov) {
      return false
    }
  }
  return true
}

export const getObjectValue = (o: Object, k: string) => {
  return Object.getOwnPropertyDescriptor(o, k)?.value
}

export const setObjectValue = (o: Object, k: string, value: any) => {
  Object.defineProperty(o, k, { value })
  return o
}
const ObjectUtil = {
  isEquals,
  getObjectValue,
  setObjectValue
}
export default ObjectUtil