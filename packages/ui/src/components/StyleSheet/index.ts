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
  createStyleSheet,
  extendStyleSheet,
  useCreateStyleSheet,
  useExtendStyleSheet,
} from './extendStyleSheet'
export {
  resolveStyleSheet,
  useResolveStyleSheet,
} from './resolveStyleSheet'
export type {
  ComponentStyleSheet,
  ObjectExceptArray,
  ProcessedStyleSheetClassName,
  PropsWithClassName,
  StyleSheetClassName,
  StyleSheetValueResolver,
  StyleSheetVariableKey,
  StyleSheetVariableValue,
  SubComponentsStyleSheet,
  ToStyleSheet,
  UnionToIntersection,
} from './Types'
