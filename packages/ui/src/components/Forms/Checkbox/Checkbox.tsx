import classNames from 'classnames'
import { AllHTMLAttributes, forwardRef, memo, ReactNode, RefObject } from 'react'
import { mergeProps, useCheckbox, useFocusRing, useHover, VisuallyHidden } from 'react-aria'
import { useToggleState } from 'react-stately'
import { useComponentClassName } from '../../../auxiliary'
import { toStateClass } from '../../../utils'
import { FieldContainer } from '../FieldContainer'
import { OwnControlProps, OwnControlPropsKeys } from '../Types'
import { useNativeInput } from '../useNativeInput'
import { CheckboxButton as DefaultCheckboxButton } from './CheckboxButton'

interface UnderlyingElementProps extends Omit<AllHTMLAttributes<HTMLInputElement>, OwnControlPropsKeys<boolean> | 'checked'> {}

export type CheckoboxOwnProps = OwnControlProps<boolean> & {
	CheckboxButtonComponent?: typeof DefaultCheckboxButton
	children: ReactNode
	labelDescription?: ReactNode
}

export type CheckboxProps = CheckoboxOwnProps & UnderlyingElementProps

export const Checkbox = memo(
	forwardRef<HTMLInputElement, CheckboxProps>(({
		CheckboxButtonComponent,
		children,
		className: outerClassName,
		...props
	}, forwardedRef) => {
		const checked = props.value ?? false
		const indeterminate = props.value === null
		const componentClassName = useComponentClassName('checkbox')

		const { ref, className, ...nativeInputProps } = useNativeInput({
			...props,
			className: classNames(
				componentClassName,
				toStateClass('checked', checked),
				toStateClass('indeterminate', indeterminate),
				outerClassName,
			),
			defaultValue: undefined,
			onChange: undefined,
			value: undefined,
		}, forwardedRef)

		const toggleProps: Parameters<typeof useToggleState>[0] = {
			children,
			isDisabled: props.disabled,
			isSelected: checked,
			onChange: props.onChange,
		}

		const toggleState = useToggleState(toggleProps)
		const { inputProps: checkboxProps } = useCheckbox(
			{
				...toggleProps,
				isIndeterminate: indeterminate,
			},
			toggleState,
			ref as RefObject<HTMLInputElement>,
		)

		const { isFocusVisible, focusProps } = useFocusRing()
		const { isHovered, hoverProps } = useHover({ isDisabled: props.disabled })

		const CheckboxButton = CheckboxButtonComponent ?? DefaultCheckboxButton

		return (
			<label {...hoverProps} className={className}>
				<FieldContainer
					useLabelElement={false}
					size={props.size}
					label={children}
					labelDescription={props.labelDescription}
					labelPosition="labelInlineRight"
				>
					<VisuallyHidden>
						<input {...mergeProps(nativeInputProps, checkboxProps, focusProps)} ref={ref} />
					</VisuallyHidden>

					<CheckboxButton
						active={props.active}
						checked={checked}
						className={outerClassName}
						disabled={props.disabled}
						distinction={props.distinction}
						focused={isFocusVisible}
						hovered={isHovered}
						indeterminate={indeterminate}
						intent={props.intent}
						loading={props.loading}
						readOnly={props.readOnly}
						required={props.required}
						scheme={props.scheme}
						size={props.size}
						type="checkbox" // TODO: should come from props?
						validationState={props.validationState}
					/>
				</FieldContainer>
			</label>
		)
	},
))
Checkbox.displayName = 'Checkbox'
