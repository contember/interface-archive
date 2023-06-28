import { Component } from '@contember/binding'
import { FunctionComponent } from 'react'
import { CommonPage, CommonPageProps } from '../../CommonPage'

export type LayoutRendererProps = CommonPageProps

/**
 * @deprecated use any UI component instead combined with Scopes, e.g. `EditScope` or `CreateScope`
 */
export const LayoutRenderer: FunctionComponent<CommonPageProps> = Component(
	CommonPage,
	props => (
		<>
			{props.title}
			{props.afterTitle}
			{props.children}
			{props.side}
			{props.actions}
			{props.navigation}
		</>
	),
	'LayoutRenderer',
)
