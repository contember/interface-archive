import { splitStringToStringList, toFlatArrayOfNonEmptyStrings } from './Helpers'

export function toClassNameList(value: Exclude<any, null>): string[] {
  if (value === null) {
    throw new Error(`'null' should be kept intact`)
  } else if (typeof value === 'string') {
    return splitStringToStringList(value)
  } else if (Array.isArray(value)) {
    return toFlatArrayOfNonEmptyStrings(value)
  } else {
    return []
  }
}
