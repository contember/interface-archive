import { DataBindingProvider, DataBindingProviderStateComponent } from '@contember/binding'
import { PropsWithChildren } from 'react'
import { DataGrid, DataGridProps, FeedbackRenderer } from '../../bindingFacade'
import { scopeComponent } from './scopeComponent'

export type DataGridScopeProps<StateProps> =
	& PropsWithChildren<DataGridProps<{}>>
	& DataBindingProviderStateComponent<StateProps>
	& {
		refreshDataBindingOnPersist?: boolean
		skipBindingStateUpdateAfterPersist?: boolean
	}

/**
 * @group Scopes
 */
export const DataGridScope = scopeComponent(
	<StateProps, >({ stateComponent, stateProps, skipBindingStateUpdateAfterPersist, refreshDataBindingOnPersist, ...props }: DataGridScopeProps<StateProps>) => (
		<DataBindingProvider
			stateComponent={stateComponent ?? FeedbackRenderer}
			stateProps={stateProps}
			skipStateUpdateAfterPersist={skipBindingStateUpdateAfterPersist}
			refreshOnPersist={refreshDataBindingOnPersist ?? true}
		>
			<DataGrid {...props} />
		</DataBindingProvider>
	),
	'DataGridScope',
)
