import { ProcessedStyleSheetClassName, StyleSheetValueResolver, StyleSheetVariableKey, StyleSheetVariableValue } from './Types'

export function isNonEmptyString(value: any): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

export function isString(value: any): boolean {
  return typeof value === 'string'
}

export function isRegularKey(value: string): boolean {
  return value.indexOf('$') === -1
}

export function isClassNameKey(value: string): value is '$' {
  return value === '$'
}

export function isClassNameValue(value: any): value is ProcessedStyleSheetClassName {
  return value === null || (Array.isArray(value) && value.every(isString))
}

export function isVariableKey(value: any): value is StyleSheetVariableKey {
  return !isClassNameKey(value) && value.slice(0, 1) === '$' && value.indexOf('{') === -1 && value.indexOf('}') === -1
}

export function isVariableValue(value: any): value is StyleSheetVariableValue {
  return value === null || value === undefined || typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean' || typeof value === 'function'
}

export function isValueResolver(value: StyleSheetVariableValue): value is StyleSheetValueResolver {
  return typeof value === 'function'
}
