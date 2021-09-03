import classNames from 'classnames'
import { memo } from 'react'
import { useRadioGroup } from 'react-aria'
import { useRadioGroupState } from 'react-stately'
import { useClassNamePrefix } from '../../../auxiliary'
import type { Size, ValidationState } from '../../../types'
import { toEnumStateClass, toEnumViewClass } from '../../../utils'
import { Icon } from '../../Icon'
import { ErrorList, ErrorListProps } from '../ErrorList'
import { RadioContext } from './RadioContext'
import { RadioControl } from './RadioControl'
import type { RadioOption } from './types'

export interface RadioGroupProps extends ErrorListProps {
	isDisabled?: boolean
	isReadOnly?: boolean
	name?: string
	onChange: (newValue: string) => void
	options: RadioOption[]
	orientation?: 'horizontal' | 'vertical'
	presentation?: 'radio' | 'button'
	size?: Size
	validationState?: ValidationState
	value?: string
	allowNull?: boolean
}

// TODO: Maybe extract later for reuse
function deriveAriaValidationState(validationState?: ValidationState): 'valid' | 'invalid' | undefined {
	if (validationState === 'valid') {
		return 'valid'
	}
	if (validationState === 'invalid') {
		return 'invalid'
	}

	return undefined
}

export const RadioGroup = memo((props: RadioGroupProps) => {
	const { errors, name, options, size, validationState, allowNull } = props

	const presentation = props.presentation ?? 'radio'
	const orientation = props.orientation ?? (presentation === 'button' ? 'horizontal' : 'vertical')

	const prefix = useClassNamePrefix()

	const ariaRadioGroupProps = {
		...props,
		validationState: deriveAriaValidationState(validationState),
	}

	const state = useRadioGroupState(ariaRadioGroupProps)
	const { radioGroupProps } = useRadioGroup(ariaRadioGroupProps, state)

	const hasSelectedSomething = !(state.selectedValue === null || typeof state.selectedValue === 'undefined')

	const classList = classNames(
		`${prefix}radio-group`,
		toEnumViewClass(size),
		toEnumStateClass(validationState),
		toEnumViewClass(orientation),
		toEnumViewClass(presentation),
		toEnumViewClass(allowNull ? 'allowNull' : 'denyNull'),
	)

	return (
		<div className={classList} {...radioGroupProps}>
			<div className={`${prefix}radio-group-options`}>
				<RadioContext.Provider value={state}>
					{options.map(({ value, label, labelDescription }: RadioOption) => (
						<RadioControl
							key={value}
							name={name}
							value={value}
							validationState={validationState}
							description={labelDescription}
						>
							{label}
						</RadioControl>
					))}
					{allowNull && hasSelectedSomething && (
						<RadioControl
							name={name}
							value={null as unknown as string}
							validationState={validationState}
							description={null}
							centered
						>
							<Icon blueprintIcon="cross" />
						</RadioControl>
					)}
				</RadioContext.Provider>
			</div>
			{!!errors && (
				<div className={`${prefix}radio-group-error`}>
					<div className={`${prefix}checkbox-errors`}>
						<ErrorList errors={errors} size={size} />
					</div>
				</div>
			)}
		</div>
	)
})

RadioGroup.displayName = 'RadioGroup'
