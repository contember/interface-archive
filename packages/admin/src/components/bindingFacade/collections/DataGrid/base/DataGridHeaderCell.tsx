import type { Environment } from '@contember/binding'
import { ActionableBox, Box, Dropdown, DropdownProps, Justification, TableHeaderCell } from '@contember/ui'
import { ChevronDownIcon, ChevronUpIcon, FilterIcon } from 'lucide-react'
import { ComponentType, ReactElement, ReactNode, createElement, useMemo } from 'react'
import type { FilterRendererProps } from './DataGridColumn'
import type { DataGridFilterArtifact } from './DataGridFilterArtifact'
import { DataGridOrderDirection, cycleOrderDirection } from './DataGridOrderDirection'
import type { DataGridSetFilter } from './DataGridSetFilter'
import type { DataGridSetOrderBy } from './DataGridSetOrderBy'

export interface DataGridHeaderCellPublicProps {
	header?: ReactNode
	shrunk?: boolean
	headerJustification?: Justification
	ascOrderIcon?: ReactNode
	descOrderIcon?: ReactNode
}

export interface DataGridHeaderCellInternalProps {
	environment: Environment
	hasFilter: boolean
	emptyFilterArtifact: DataGridFilterArtifact
	filterArtifact: DataGridFilterArtifact
	orderState: { direction: Exclude<DataGridOrderDirection, null>, index: number | undefined } | undefined
	setFilter: DataGridSetFilter
	setOrderBy: DataGridSetOrderBy
	filterRenderer: ComponentType<FilterRendererProps<DataGridFilterArtifact>> | undefined
}

export interface DataGridHeaderCellProps extends DataGridHeaderCellInternalProps, DataGridHeaderCellPublicProps { }

export function DataGridHeaderCell({
	ascOrderIcon,
	descOrderIcon,
	emptyFilterArtifact,
	environment,
	filterArtifact,
	filterRenderer,
	hasFilter,
	header,
	headerJustification,
	orderState,
	setFilter,
	setOrderBy,
	shrunk,
}: DataGridHeaderCellProps): ReactElement {
	const buttonProps: DropdownProps['buttonProps'] = useMemo(() => ({
		intent: hasFilter ? undefined : 'default',
		distinction: 'seamless',
		size: 'small',
		children: (
			<FilterIcon
				fill={hasFilter ? 'currentColor' : 'none'}
			/>
		),
	}), [hasFilter])

	return (
		<TableHeaderCell scope="col" justification={headerJustification} shrunk={shrunk}>
			<span style={{ display: 'flex', justifyContent: 'flex-start', gap: '.25em' }}>
				<span onClick={e => setOrderBy(cycleOrderDirection(orderState?.direction ?? null), e.ctrlKey || e.metaKey)} style={{ cursor: 'pointer' }}>
					{header}
					&nbsp;
					{orderState &&
						<>
							{{
								asc: ascOrderIcon ?? defaultAscIcon,
								desc: descOrderIcon ?? defaultDescIcon,
							}[orderState.direction]}
							{orderState.index !== undefined ? `(${orderState.index + 1})` : null}
						</>}
				</span>
				{filterRenderer && (
					<Dropdown
						buttonProps={buttonProps}
						renderContent={({ requestClose }) => (
							<ActionableBox
								onRemove={() => {
									setFilter(undefined)
									requestClose()
								}}
							>
								<Box padding={false} background={false} border={false} header={<>Filter: {header}</>}>
									{createElement(filterRenderer, {
										filter: filterArtifact === undefined ? emptyFilterArtifact : filterArtifact,
										setFilter: setFilter,
										environment: environment,
									})}
								</Box>
							</ActionableBox>
						)}
					/>
				)}
			</span>
		</TableHeaderCell>
	)
}

const defaultAscIcon = <ChevronUpIcon />
const defaultDescIcon = <ChevronDownIcon />