import { Layout } from '@contember/layout'
import { classNameForFactory, isNonNegativeNumber } from '@contember/utilities'
import { memo } from 'react'
import { PANEL_CONTENT_BASIS, PANEL_CONTENT_MAX_WIDTH, PANEL_CONTENT_MIN_WIDTH } from './Constants'
import { CMSLayoutContentProps } from './Types'

export const Content = memo<CMSLayoutContentProps>(({
	basis,
	children,
	className,
	componentClassName = 'cms-content',
	maxWidth = PANEL_CONTENT_MAX_WIDTH,
	minWidth,
	panelName,
}) => {
	const classNameFor = classNameForFactory(componentClassName, className)

	return (
		<Layout.Panel
			basis={basis ?? PANEL_CONTENT_BASIS}
			minWidth={minWidth ?? PANEL_CONTENT_MIN_WIDTH}
			maxWidth={isNonNegativeNumber(maxWidth) ? maxWidth : null}
			className={classNameFor()}
			defaultBehavior="static"
			defaultVisibility="visible"
			name={panelName}
		>
			{children}
		</Layout.Panel>
	)
})
Content.displayName = 'CMSLayout.Content'