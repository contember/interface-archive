import { splitStringToStringList, toFlatArrayOfClassNameValues } from './Helpers'
import { StyleSheetValueResolver } from './Types'

export function toClassNameList(value: any): (string | StyleSheetValueResolver)[] {
  if (typeof value === 'string') {
    return splitStringToStringList(value)
  } else if (typeof value === 'function') {
    return [value]
  } else if (Array.isArray(value)) {
    return toFlatArrayOfClassNameValues(value)
  } else {
    return []
  }
}
