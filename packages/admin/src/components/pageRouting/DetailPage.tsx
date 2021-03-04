import {
	DataBindingProvider,
	EntitySubTree,
	EntitySubTreeAdditionalProps,
	SugaredQualifiedSingleEntity,
} from '@contember/binding'
import { ReactNode, ComponentType, ReactElement, memo, useCallback, useMemo, useRef, useState, FC, FunctionComponent, Fragment, PureComponent, useEffect } from 'react'
import { FeedbackRenderer, ImmutableContentLayoutRendererProps, ImmutableSingleEntityRenderer } from '../bindingFacade'
import { PageProvider } from './PageProvider'

export interface DetailPageProps extends SugaredQualifiedSingleEntity, EntitySubTreeAdditionalProps {
	pageName: string
	children: ReactNode
	rendererProps?: Omit<ImmutableContentLayoutRendererProps, 'accessor'>
}

const DetailPage: Partial<PageProvider<DetailPageProps>> & ComponentType<DetailPageProps> = memo(
	({ pageName, children, rendererProps, ...entityProps }: DetailPageProps) => (
		<DataBindingProvider stateComponent={FeedbackRenderer}>
			<EntitySubTree {...entityProps} entityComponent={ImmutableSingleEntityRenderer} entityProps={rendererProps}>
				{children}
			</EntitySubTree>
		</DataBindingProvider>
	),
)

DetailPage.displayName = 'DetailPage'
DetailPage.getPageName = (props: DetailPageProps) => props.pageName

export { DetailPage }
