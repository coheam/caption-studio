import ExecCommand from './_ExecUtils'
import NumberUtil from './_NumberUtils'
import ObjectUtil from './_ObjectUtils'
import StringUtil from './_StringUtils'
import Storage from './_StorageUtil'
import VdomUtil from './_VdomUtil'

const utils = {
  exec: ExecCommand,
  vdom: VdomUtil,
  number: NumberUtil,
  object: ObjectUtil,
  string: StringUtil,
  storage: Storage,
}

export default utils