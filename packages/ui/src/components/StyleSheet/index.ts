export const CLASS_NAME_RESET_STRING = '*:null'

/**
 * Special className object to reset component's internal className
 *
 * Usage:
 *
 * ```tsx
 * <Box className={useExtendClassName(CLASS_NAME_RESET)}>Hello world</Box>
 * ```
 *
 */
export const CLASS_NAME_RESET = { $: [CLASS_NAME_RESET_STRING] }

export {
  resolveStyleSheet,
  useResolveStyleSheet,
} from './resolveStyleSheet'
export {
  toClassName,
  useToClassName,
} from './toClassName'
export type {
  ComponentStyleSheet,
  ObjectExceptArray,
  ProcessedClassNameListValue,
  PropsWithClassName,
  StyleSheetClassName,
  StyleSheetValueResolver,
  StyleSheetVariableKey,
  StyleSheetVariableValue,
  SubComponentsStyleSheet,
  ToStyleSheet,
  UnionToIntersection,
} from './Types'
