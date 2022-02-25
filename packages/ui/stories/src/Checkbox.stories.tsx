import { useCallback, useState } from '@storybook/addons'
import { ComponentMeta, ComponentStory, forceReRender } from '@storybook/react'
import * as React from 'react'
import { Checkbox } from '../../src'
import { booleanControl, disabledControlsForAttributes, enumControl, stringControl } from './Helpers'

export default {
	title: 'Checkbox',
	component: Checkbox,
	argTypes: {
		...disabledControlsForAttributes<typeof Checkbox>('CheckboxButtonComponent'),
		isDisabled: booleanControl(false),
		value: enumControl([undefined, null, true, false], 'radio', undefined),
		children: stringControl('Label'),
		labelDescription: stringControl('Description under the label'),
	},
} as ComponentMeta<typeof Checkbox>

const Template: ComponentStory<typeof Checkbox> = args => {
	const [value, setValue] = useState<boolean | undefined | null>(args.value)

	const onChange = useCallback((value?: boolean | null) => {
		setValue(value)
		forceReRender()
	}, [])

	React.useEffect(() => {
		setValue(args.value)
	}, [args.value])

	return <>
		<Checkbox {...args} value={value} onChange={onChange} />
		<div>value: {JSON.stringify(value)}</div>
	</>
}

export const Defaut = Template.bind({})

Defaut.args = {}
