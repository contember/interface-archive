import { useState } from '@storybook/addons'
import type { ComponentMeta, ComponentStory } from '@storybook/react'
import * as React from 'react'
import { Select } from '../../src'
import { Button } from '../ui/Button'
import { booleanControl, disabledControlsForAttributes } from './Helpers'

export default {
	title: 'Select',
	component: Select,
	argTypes: {
		...disabledControlsForAttributes<typeof Select>('options'),
		active: booleanControl(false),
		disabled: booleanControl(false),
		loading: booleanControl(false),
		readOnly: booleanControl(false),
		required: booleanControl(false),
	},
	args: {
		options: [],
		placeholder: 'Set value...',
	},
} as ComponentMeta<typeof Select>

const Template: ComponentStory<typeof Select> = args => {
	const ref = React.useRef<HTMLSelectElement>(null)
	const [value, setValue] = useState(args.value)
	const [error, setError] = useState<string | undefined>(undefined)
	const [touched, setTouched] = useState<boolean | undefined>(undefined)

	React.useEffect(() => {
		setValue(args.value)
	}, [args.value])

	return <>
		<Select
			ref={ref}
			validationState={touched && error ? 'invalid' : undefined}
			{...args}
			value={value}
			onChange={React.useCallback(value => {
				setValue(value)
				console.log('Changed value:', value)
			}, [setValue])}
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

Defaut.args = {
	options: [{
		value: '1',
		label: 'Fist option',
	}, {
		value: '2',
		label: 'Second option',
	}, {
		value: '3',
		label: 'Third option',
	}],
}

export const Custom_Empty_Option = Template.bind({})

Custom_Empty_Option.args = {
	options: [{
		value: null,
		label: 'Set fancy value...',
	}, {
		value: '1',
		label: 'Fist option',
	}, {
		value: '2',
		label: 'Second option',
	}, {
		value: '3',
		label: 'Third option',
	}],
}

export const Numeric = Template.bind({})

Numeric.args = {
	options: [{
		value: 1,
		label: 'Fist option',
	}, {
		value: 2,
		label: 'Second option',
	}, {
		value: 3,
		label: 'Third option',
	}],
}

export const Numeric_Strict = Template.bind({})

Numeric_Strict.args = {
	required: true,
	placeholder: null,
	options: [{
		value: 1,
		label: 'Fist option',
	}, {
		value: 2,
		label: 'Second option',
	}, {
		value: 3,
		label: 'Third option',
	}],
}

export const Mixed_Values = Template.bind({})

Mixed_Values.args = {
	options: [{
		value: [1, 2, 3],
		label: 'Array of numbers',
	}, {
		value: { message: 'Hello world' },
		label: 'Object with message',
	}, {
		value: new Date(),
		label: 'Date object',
	}],
}
