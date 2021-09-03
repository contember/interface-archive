import type { RadioGroupProps } from './RadioGroup'
import { RadioGroup } from './RadioGroup'

export function RadioButtonGroup(props: Omit<RadioGroupProps, 'presentation'>) {
	return <RadioGroup presentation="button" {...props} />
}
