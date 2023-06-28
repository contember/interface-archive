import {
	DataBindingProvider,
	EntitySubTree,
	EntitySubTreeAdditionalCreationProps,
	EntitySubTreeAdditionalProps,
	SugaredUnconstrainedQualifiedSingleEntity,
} from '@contember/binding'
import { ReactNode } from 'react'
import { FeedbackRenderer, LayoutRenderer, LayoutRendererProps, PersistButton } from '../../bindingFacade'
import { RedirectOnSuccessTarget } from '../useEntityRedirectOnPersistSuccess'
import { useOnPersistSuccess } from '../useOnPersistSuccess'
import { pageComponent } from './pageComponent'

export type CreatePageProps =
	& Omit<SugaredUnconstrainedQualifiedSingleEntity, 'isCreating'>
	& EntitySubTreeAdditionalProps
	& EntitySubTreeAdditionalCreationProps
	& {
		/** @deprecated Use `CreateScope` instead */
		pageName?: never;
		children: ReactNode
		redirectOnSuccess?: RedirectOnSuccessTarget
		rendererProps?: LayoutRendererProps
	}

/**
 * @example
 * @deprecated Use `CreateScope` instead
 *
 * ```
 * <CreatePage
 *   entity="Article"
 *   redirectOnSuccess="articleEdit(id: $entity.id)"
 *   rendererProps={{ title: 'Create article' }}
 * >
 *   <TextField label="Name" name="name" />
 * </CreatePage>
 * ```
 *
 * @group Pages
 */
export const CreatePage = pageComponent(
	({ pageName, children, rendererProps, redirectOnSuccess, onPersistSuccess, ...entityProps }: CreatePageProps) => {
		return (
			<DataBindingProvider stateComponent={FeedbackRenderer}>
				<EntitySubTree {...entityProps} onPersistSuccess={useOnPersistSuccess({ redirectOnSuccess, onPersistSuccess })} isCreating>
					<LayoutRenderer {...rendererProps} headerActions={rendererProps?.actions ?? <PersistButton />}>
						{children}
					</LayoutRenderer>
				</EntitySubTree>
			</DataBindingProvider>
		)
	},
	'CreatePage',
)
