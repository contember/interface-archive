import { AllHTMLAttributes } from 'react'
import type {
  ColorString,
  ControlProps,
  ControlPropsKeys,
  DateInputString,
  DateTimeInputString,
  MonthInputString,
  TimeInputString,
  WeekInputString,
} from '../Types'

export interface RestHTMLTextInputProps extends Omit<AllHTMLAttributes<HTMLInputElement>, ControlPropsKeys<string>> {}

export type TextInputOwnProps<V extends string = string> = ControlProps<V> & {
	withTopToolbar?: boolean
}

export type TextInputProps<V extends string = string> = TextInputOwnProps<V> & RestHTMLTextInputProps

export type ColorInputProps = TextInputProps<ColorString>
export type DateInputProps = TextInputProps<DateInputString>
export type DateTimeInputProps = TextInputProps<DateTimeInputString>
export type EmailInputProps = TextInputProps
export type FloatInputProps = TextInputProps
export type MonthInputProps = TextInputProps<MonthInputString>
export type NumberInputProps = TextInputProps
export type PasswordInputProps = TextInputProps
export type RangeInputProps = TextInputProps
export type SearchInputProps = TextInputProps
export type TelInputProps = TextInputProps
export type TimeInputProps = TextInputProps<TimeInputString>
export type UrlInputProps = TextInputProps
export type WeekInputProps = TextInputProps<WeekInputString>
