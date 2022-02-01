import { HTMLAttributes } from 'react'
import { ControlDistinction, Intent, Scheme, Size, ValidationState } from '../../types'

/**
 * Returns new type where all the properties are required but some of them may be undefined
 */
type All<T> = {
	[P in keyof Required<T>]: Pick<T, P> extends Required<Pick<T, P>> ? T[P] : (T[P] | undefined);
}

export interface ValidationSteteProps {
	onValidationStateChange?: (error?: string) => void
	validationState?: ValidationState
}

export interface ControlStateProps {
	active?: boolean
	disabled?: boolean
	loading?: boolean
	readOnly?: boolean
	required?: boolean
  focused?: boolean
  hovered?: boolean
}

export interface ControlFocusProps {
	onBlur?: () => void
	onFocus?: () => void
	onFocusChange?: (isFocused: boolean) => void
}

export interface ControlDisplayProps {
	className?: HTMLAttributes<HTMLElement>['className']
	distinction?: ControlDistinction
	intent?: Intent
	scheme?: Scheme
	size?: Size
	type?: string | undefined
}

export interface ControlValueProps<V> {
	defaultValue?: V | undefined
	onChange?: (value?: V | null) => void
	placeholder?: string | null
	value?: V | null
}

interface RequiredControlValueProps<V> {
	required: true
	onChange?: (value: V) => void
}

interface OptionalControlValueProps<V> {
	required?: false
	onChange?: (value?: V | null) => void
}

interface _OwnControlProps<V> extends
	ControlValueProps<V>,
	ValidationSteteProps,
	ControlStateProps,
	ControlFocusProps,
	ControlDisplayProps {}

export type OwnControlProps<V> =
	| _OwnControlProps<V> & RequiredControlValueProps<V>
	| _OwnControlProps<V> & OptionalControlValueProps<V>

export type AllOwnControlProps<V> = All<OwnControlProps<V>>
export type OwnControlPropsKeys<V> = keyof OwnControlProps<V>

export type VisuallyDependententControlProps =
	ControlStateProps
	& ControlDisplayProps
	& Pick<ValidationSteteProps, 'validationState'>
export type AllVisuallyDependententControlProps = All<VisuallyDependententControlProps>
