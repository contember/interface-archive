import { Component, SugaredQualifiedEntityList } from '@contember/react-binding'
import { ComponentType, ReactNode } from 'react'
import { ControlledDataGridProps, createControlledDataGrid } from './createControlledDataGrid'
import { useDataGrid } from './useDataGrid'

export type DataGridProps<P extends {}> =
	& {
		dataGridKey?: string
		entities: SugaredQualifiedEntityList['entities']
		children: ReactNode
		itemsPerPage?: number | null
	}
	& P

export const createDataGrid = <P extends {}>(Renderer: ComponentType<P & ControlledDataGridProps>): ComponentType<DataGridProps<P>> => {
	const ControlledDataGrid = createControlledDataGrid(Renderer)

	return Component<DataGridProps<P>>(props => {
		const dataGridProps = useDataGrid(props)
		return (
			<ControlledDataGrid {...dataGridProps} {...(props as unknown as P)} />
		)
	}, () => null)
}
