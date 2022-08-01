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
export const CLASS_NAME_RESET = { $: null }

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
  StyleSheetPlaceholderKey,
  StyleSheetPlaceholderValue,
  StyleSheetVariableKey,
  StyleSheetVariableValue,
  SubComponentsStyleSheet,
  ToStyleSheet,
  UnionToIntersection,
} from './Types'
