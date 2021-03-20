import {
	DataBindingProvider,
	EntityAccessor,
	EntitySubTree,
	EntitySubTreeAdditionalCreationProps,
	EntitySubTreeAdditionalProps,
	SugaredUnconstrainedQualifiedSingleEntity,
} from '@contember/binding'
import { ComponentType, memo, ReactNode } from 'react'
import RequestState from '../../state/request'
import { FeedbackRenderer, MutableContentLayoutRendererProps, MutableSingleEntityRenderer } from '../bindingFacade'
import { PageProvider } from './PageProvider'
import { useEntityRedirectOnPersistSuccess } from './useEntityRedirectOnPersistSuccess'

export type CreatePageProps = Omit<SugaredUnconstrainedQualifiedSingleEntity, 'isCreating'> &
	EntitySubTreeAdditionalProps &
	EntitySubTreeAdditionalCreationProps & {
		pageName: string
		children: ReactNode
		redirectOnSuccess?: (currentState: RequestState, persistedId: string, entity: EntityAccessor) => RequestState
		rendererProps?: Omit<MutableContentLayoutRendererProps, 'accessor'>
	}

const CreatePage: Partial<PageProvider<CreatePageProps>> & ComponentType<CreatePageProps> = memo(
	({ pageName, children, rendererProps, redirectOnSuccess, ...entityProps }: CreatePageProps) => (
		<DataBindingProvider stateComponent={FeedbackRenderer}>
			<EntitySubTree
				{...entityProps}
				entityComponent={MutableSingleEntityRenderer}
				entityProps={rendererProps}
				onPersistSuccess={useEntityRedirectOnPersistSuccess(redirectOnSuccess)}
				isCreating
			>
				{children}
			</EntitySubTree>
		</DataBindingProvider>
	),
)

CreatePage.displayName = 'CreatePage'
CreatePage.getPageName = (props: CreatePageProps) => props.pageName

export { CreatePage }
