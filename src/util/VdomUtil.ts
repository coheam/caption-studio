
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
  encode(htmlString: string){
    let el = VdomUtil.parser(htmlString)
    /*
		input.find('*').each(function(eq,element,color,attr){
			element = $(element);
			if (element.attr('color') || (element.attr('style') && element.attr('style').indexOf('color') == 0)){
				color = eval(element.css('color'));
				element.prop('style',false);
				if (element[0].localName == 'font'){
					element.attr('color',color);
				} else {
					element.removeAttr('color').wrap('<font />');
					element.parent().attr('color',color);
				};
			}
			attr = $.map(this.attributes, function(attr) {
				return attr.name;
			});
			$.each(attr, function(eq, attrItem) {
				try{
					if (attrItem != 'color') element.removeAttr(attrItem);
				} catch(e) {}
			});
		});
		text = input.html().replace(/\n/gi,'').replace(/\t/gi,'');
		contents = Subtitle.Vaild(text);
		if (contents.length >= 4){
			contents = contents.lastIndexOf('<br>') == contents.length - 4 ? contents.substr(0,contents.length - 4) : contents;
		}
		function rgb(a,b,c){
			var r = (a).toString(16), g = (b).toString(16), b = (c).toString(16);
			return  ('#' + (r.length == 1 ? ('0'+ r) : r) + (g.length == 1 ? ('0'+ g) : g) + (b.length == 1 ? ('0'+ b) : b)).toUpperCase();
		};
		return contents;
        */
    return VdomUtil.stringify(el)
  },
}
const util = {
    name: 'vdom',
    methods: VdomUtil
}
export default VdomUtil