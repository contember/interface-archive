import { Component, FieldValue, SugaredField, SugaredFieldProps, useField } from '@contember/binding'
import { ReactElement } from 'react'
import { FieldValueFormatter } from '../fields'
import { FieldFallbackView, FieldFallbackViewProps } from './FieldFallbackView'
import { FieldValueRenderer } from './Types'

export type TextFieldViewPropsWithRenderer<FV extends FieldValue = string> = {
  children: FieldValueRenderer<FV>;
  fallback?: never;
  fallbackStyle?: never;
  formatValue?: never;
}

export type TextFieldViewProps<FV extends FieldValue = string> = {
  field: SugaredFieldProps['field'];
} & (
    | TextFieldViewPropsWithRenderer<FV>
    | {
      children?: never;
      formatValue?: FieldValueFormatter<FV, string>;
    } & (
      | {
        fallback: FieldFallbackViewProps['fallback'];
        fallbackStyle?: never;
      }
      | {
        fallback?: never;
        fallbackStyle: FieldFallbackViewProps['fallbackStyle'];
      }
    )
  )

export const TextFieldView = Component(
  <FV extends FieldValue = string>({
    children,
    fallback,
    fallbackStyle,
    field,
    formatValue,
  }: TextFieldViewProps<FV>) => {
    const fieldAccessor = useField<FV>(field)

    if (fieldAccessor.value === null) {
      if (typeof children === 'function') {
        return children(null, fieldAccessor)
      } else {
        return <FieldFallbackView fallback={fallback} fallbackStyle={fallbackStyle} />
      }
    } else {
      if (typeof children === 'function') {
        return children(fieldAccessor.value, fieldAccessor)
      } else {
        return (
          <>{typeof formatValue === 'function' ? formatValue(fieldAccessor.value, fieldAccessor) : fieldAccessor.value}</>
        )
      }
    }

  },
  ({ field }) => <SugaredField field={field} />,
  'TextFieldView',
) as <FV extends FieldValue = string>(props: TextFieldViewProps<FV>) => ReactElement
