export const isEquals = (n: Object, o: Object) : boolean => {
  for (let k in n) {
    const nv = Object.getOwnPropertyDescriptor(n, k)?.value
    const ov = Object.getOwnPropertyDescriptor(o, k)?.value
    if (typeof nv === 'object') {
      return typeof ov === 'object' ? isEquals(nv, ov) : false
    }
    if (nv !== ov) {
      return false
    }
  }
  return true
}