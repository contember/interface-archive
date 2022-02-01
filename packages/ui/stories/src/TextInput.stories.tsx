import { useState } from '@storybook/addons'
import type { ComponentMeta, ComponentStory } from '@storybook/react'
import * as React from 'react'
import { TextInput } from '../../src'
import { Button } from '../ui/Button'
import { booleanControl, stringControl } from './Helpers'

export default {
	title: 'TextInput',
	component: TextInput,
	argTypes: {
		active: booleanControl(false),
		disabled: booleanControl(false),
		loading: booleanControl(false),
		readOnly: booleanControl(false),
		required: booleanControl(false),
		placeholder: stringControl('Enter value...'),
	},
} as ComponentMeta<typeof TextInput>

const Template: ComponentStory<typeof TextInput> = args => {
	const ref = React.useRef<HTMLInputElement>(null)
	const [value, setValue] = useState<string | null | undefined>(args.value)
	const [error, setError] = useState<string | undefined>(undefined)
	const [touched, setTouched] = useState<boolean | undefined>(undefined)

	React.useEffect(() => {
		setValue(args.value ?? '')
	}, [args.value])

	return <>
		<TextInput
			ref={ref}
			validationState={touched && error ? 'invalid' : undefined}
			{...args}
			value={value}
			onChange={setValue}
			onBlur={React.useCallback(() => {
				setTouched(true)
			}, [setTouched])}
			onValidationStateChange={setError}
		/>
		<div>Validation error: {error ?? 'Valid'}</div>
		<div>Value set: {JSON.stringify(value)}</div>
		<div>touched: {touched ? 'yes' : 'no'}</div>
		<Button onClick={() => {
			setTouched(false)
		}}>Reset touched state</Button>
	</>
}

export const Defaut = Template.bind({})

Defaut.args = {}
