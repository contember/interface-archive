import { Component } from '@contember/binding'
import type { ReactElement } from 'react'
import { PersistButton } from '../../buttons'
import { LayoutRenderer, LayoutRendererProps } from '../LayoutRenderer'
import { MutableEntityListRenderer, MutableEntityListRendererProps } from '../listRenderers'

export type MutableEntityListPageRendererProps<ContainerExtraProps, ItemExtraProps> =
	& LayoutRendererProps
	& MutableEntityListRendererProps<ContainerExtraProps, ItemExtraProps>

/** @deprecated Use scope alternative instead of Page */
export const MutableEntityListPageRenderer = Component(
	<ContainerExtraProps, ItemExtraProps>({
		actions,
		children,
		fit,
		navigation,
		pageContentLayout,
		side,
		title,
		afterTitle,
		...entityListProps
	}: MutableEntityListPageRendererProps<ContainerExtraProps, ItemExtraProps>) => (
		<LayoutRenderer
			actions={actions ?? <PersistButton />}
			fit={fit}
			navigation={navigation}
			pageContentLayout={pageContentLayout}
			side={side}
			title={title}
			afterTitle={afterTitle}
		>
			<MutableEntityListRenderer {...entityListProps}>{children}</MutableEntityListRenderer>
		</LayoutRenderer>
	),
	'MutableEntityListPageRenderer',
) as <ContainerExtraProps, ItemExtraProps>(
	props: MutableEntityListPageRendererProps<ContainerExtraProps, ItemExtraProps>,
) => ReactElement
