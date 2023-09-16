export const zeroPad = (num: number, digits: number = 2): string => {
  let loop = digits
  let zeros = ''
  while (loop) {
      zeros += '0'
      loop--;
  }
  return (num.toString().length > digits) ? num.toString() : (zeros + num).slice(-digits)
}
export const timeFormat = (millisecond: number): string => {
  if (isNaN(millisecond)) {
    return ''
  }
  let str = (millisecond/1000).toFixed(3).toString().split('.')
  let sec = parseInt(str[0])
  let msec = parseInt(str[1]) || 0
  return `${zeroPad(Math.floor(sec/3600))}:${zeroPad(Math.floor(sec%3600/60))}:${zeroPad(Math.floor(sec%60))},${zeroPad(msec, 3)}`
}
const NumberUtil = {
  zeroPad,
  timeFormat
}
export default NumberUtil