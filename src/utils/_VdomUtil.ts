
import { DOMParser } from 'xmldom'
const VdomUtil = {
	parser(htmlString: string): Element {
    return new DOMParser()
      .parseFromString(`<html xmlns="http://www.w3.org/1999/xhtml">${htmlString}</html>`, 'text/html')
      .documentElement
	},
	stringify(el: Element): string {
		return el.toString()
      .replace('<html xmlns="http://www.w3.org/1999/xhtml">','')
      .replace('</html>','')
	},
	breakLine(htmlString: string): number {
    const counting = ({ tagName, childNodes }: Element, count: number = 1): number => {
      if (tagName?.toLocaleLowerCase() === 'br') {
        count++
      }
      if (childNodes?.length) {
        Array.from(childNodes).map(children => {
          count = counting(children as Element, count)
        })
      }
      return count
    }
    return counting(VdomUtil.parser(htmlString))
	},
}
export default VdomUtil