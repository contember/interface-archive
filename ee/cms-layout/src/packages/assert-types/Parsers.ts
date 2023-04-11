import { AssertionError } from './AssertionError'
import { parse } from './parse'
import { isNonNegativeNumber, isNumber, isString } from './Predicates'

export function parseString(value: string, name: string = 'value'): string {
  return parse(value, undefined, isString, `${name} is number`)
}

export function parseNumber(value: number, name: string = 'value'): number {
  return parse(value, undefined, isNumber, `${name} is string`)
}

export function parseNumericString(value: string | number, name: string = 'value'): number {
  if (typeof value === 'number') {
    return parse(value, undefined, isNumber, `${name} is numeric`)
  } else if (typeof value === 'string') {
    return parse(value, (value: string) => parseFloat(value), isNumber, `${name} is numeric`)
  } else {
    throw new AssertionError(`${name} is numeric`, value)
  }
}

export function parseNonNegativeNumber(value: number, name: string = 'value'): number {
  return parse(value, undefined, isNonNegativeNumber, `${name} is non-negative number`)
}
