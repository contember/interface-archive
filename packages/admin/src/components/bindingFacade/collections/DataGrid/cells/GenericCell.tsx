import { Component } from '@contember/binding'
import type { FunctionComponent, ReactNode } from 'react'
import { DataGridCellPublicProps, DataGridColumn, DataGridHeaderCellPublicProps } from '../base'

export type GenericCellProps = DataGridHeaderCellPublicProps &
	DataGridCellPublicProps & {
		children: ReactNode
	}

export const GenericCell: FunctionComponent<GenericCellProps> = Component(props => {
	return (
		<DataGridColumn<string> {...props} enableOrdering={false} enableFiltering={false}>
			{props.children}
		</DataGridColumn>
	)
}, 'GenericCell')
