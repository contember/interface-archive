import { splitStringToStringList, toFlatArrayOfClassNameValues } from './Helpers'
import { StyleSheetValueResolver } from './Types'

export function toClassNameList(value: Exclude<any, null>): (string | StyleSheetValueResolver)[] {
  if (value === null) {
    throw new Error(`'null' should be kept intact`)
  } else if (typeof value === 'string') {
    return splitStringToStringList(value)
  } else if (Array.isArray(value)) {
    return toFlatArrayOfClassNameValues(value)
  } else {
    return []
  }
}
