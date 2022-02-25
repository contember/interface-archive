import classNames from 'classnames'
import { AllHTMLAttributes, DetailedHTMLProps, forwardRef, InputHTMLAttributes, memo, ReactNode, useCallback, useEffect } from 'react'
import { mergeProps, useFocusRing, useHover, VisuallyHidden } from 'react-aria'
import { fromBooleanValue, toBooleanValue } from '..'
import { useComponentClassName } from '../../../auxiliary'
import { toStateClass } from '../../../utils'
import { FieldContainer } from '../FieldContainer'
import { OwnControlProps, OwnControlPropsKeys } from '../Types'
import { useNativeInput } from '../useNativeInput'
import { CheckboxButton as DefaultCheckboxButton } from './CheckboxButton'

export interface RestHTMLCheckboxProps extends Omit<AllHTMLAttributes<HTMLInputElement>, OwnControlPropsKeys<boolean> | 'checked'> {}

export type CheckoboxOwnProps = OwnControlProps<boolean> & {
	CheckboxButtonComponent?: typeof DefaultCheckboxButton
	children: ReactNode
	labelDescription?: ReactNode
}

export type CheckboxProps = CheckoboxOwnProps & RestHTMLCheckboxProps

export const Checkbox = memo(
	forwardRef<HTMLInputElement, CheckboxProps>(({
		CheckboxButtonComponent,
		children,
		labelDescription,
		onChange,
		value,
		...outerProps
	}, forwardedRef) => {
		const componentClassName = useComponentClassName('checkbox')

		const notNull = outerProps.notNull

		const onChangeRotateState = useCallback((nextValue?: string | null) => {
			let next = toBooleanValue(nextValue)
			console.log('onChange:before', { next })

			if (!notNull) {
				if (value === false && next === true) {
					next = null
				} else if (value === null) {
					next = true
				}
			}

			console.log('onChange:after', { next })

			onChange?.(next)
		}, [value, notNull, onChange])

		const { ref, props, state } = useNativeInput({
				...outerProps,
				onChange: onChangeRotateState,
				type: 'checkbox',
				defaultValue: fromBooleanValue(outerProps.defaultValue),
				value: fromBooleanValue(value),
			}, forwardedRef)

		const { className, ...nativeInputProps } = props
		const booleanValue = toBooleanValue(state)

		// Sync when internal value changes
		useEffect(() => {
			if (typeof ref !== 'object' || !ref.current) {
				return
			}

			ref.current.indeterminate = booleanValue === null
			ref.current.checked = booleanValue === true
		}, [ref, booleanValue])

		const { isFocusVisible: focused, focusProps } = useFocusRing()
		const { isHovered: hovered, hoverProps } = useHover({ isDisabled: props.disabled })

		const ariaProps: {
			'aria-checked': DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>['aria-checked']
		} = {
			'aria-checked': booleanValue === null ? 'mixed' : booleanValue === true ? 'true' : booleanValue === false ? 'false' : undefined,
		}

		const CheckboxButton = CheckboxButtonComponent ?? DefaultCheckboxButton

		return (
			<label {...hoverProps} className={classNames(
				componentClassName,
				toStateClass('indeterminate', booleanValue === null),
				toStateClass('checked', booleanValue === true),
				className,
			)}>
				<FieldContainer
					useLabelElement={false}
					size={outerProps.size}
					label={children}
					labelDescription={labelDescription}
					labelPosition="labelInlineRight"
				>
					<VisuallyHidden>
						<input
							ref={ref}
							{...mergeProps(nativeInputProps, ariaProps, focusProps)}
						/>
					</VisuallyHidden>

					<CheckboxButton
						active={outerProps.active}
						checked={booleanValue}
						className={className}
						disabled={outerProps.disabled}
						distinction={outerProps.distinction}
						focused={focused}
						hovered={hovered}
						indeterminate={booleanValue === null}
						intent={outerProps.intent}
						loading={outerProps.loading}
						readOnly={outerProps.readOnly}
						required={outerProps.required}
						scheme={outerProps.scheme}
						size={outerProps.size}
						type={props.type}
						validationState={outerProps.validationState}
					/>
				</FieldContainer>
			</label>
		)
	},
))
Checkbox.displayName = 'Checkbox'
