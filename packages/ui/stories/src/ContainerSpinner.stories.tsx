import type { ComponentMeta, ComponentStory } from '@storybook/react'
import { SpinnerContainer } from '../../src'

export default {
	title: 'Misc/Container Spinner',
	component: SpinnerContainer,
} as ComponentMeta<typeof SpinnerContainer>

const Template: ComponentStory<typeof SpinnerContainer> = args => <SpinnerContainer {...args} />

export const Default = Template.bind({})
