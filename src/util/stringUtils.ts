export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.toLowerCase().slice(1)
}
export const toCamelCase = (str: string) => {
  let string = str.toLowerCase().replace(/[^A-Za-z0-9]/g, ' ').split(' ')
    .reduce((result, word) => result + capitalize(word.toLowerCase()))
  return string.charAt(0).toLowerCase() + string.slice(1)
}
export const sepCase = (str: string, sep: string = '_') => {
  return str
  .replace(/[A-Z]/g, (letter, index) => {
    const lcLet = letter.toLowerCase();
    return index ? sep + lcLet : lcLet;
  })
  .replace(/([-_ ]){1,}/g, sep)
}