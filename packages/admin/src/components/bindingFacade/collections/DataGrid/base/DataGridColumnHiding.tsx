import { Box, Checkbox, Dropdown, DropdownProps, FieldContainer } from '@contember/ui'
import { ColumnsIcon } from 'lucide-react'
import { Fragment, ReactElement, useMemo } from 'react'
import type { MessageFormatter } from '../../../../../i18n'
import type { DataGridSetIsColumnHidden } from './DataGridSetIsColumnHidden'
import type { DataGridState } from './DataGridState'
import type { DataGridDictionary } from './dataGridDictionary'

export interface DataGridColumnHidingProps {
	desiredState: DataGridState
	formatMessage: MessageFormatter<DataGridDictionary>
	setIsColumnHidden: DataGridSetIsColumnHidden
}

export function DataGridColumnHiding({
	desiredState,
	formatMessage,
	setIsColumnHidden,
}: DataGridColumnHidingProps): ReactElement | null {
	const buttonProps: DropdownProps['buttonProps'] = useMemo(() => ({
		intent: 'default',
		distinction: 'seamless',
		children: (
			<>
				<ColumnsIcon />
				{formatMessage('dataGrid.columnHiding.showMenuButton.text')}
			</>
		),
	}), [formatMessage])

	return (
		<Dropdown
			alignment="end"
			buttonProps={buttonProps}
		>
			<Box heading={formatMessage('dataGrid.columnHiding.heading')}>
				<div style={{ display: 'flex', flexDirection: 'column', gap: '0.25em' }}>
					{Array.from(desiredState.columns, ([key, column]) => {
						if (column.canBeHidden === false) {
							return <Fragment key={key} />
						}
						return (
							<FieldContainer
								key={key}
								label={column.header}
								labelPosition="labelInlineRight"
							>
								<Checkbox
									notNull
									value={!desiredState.hiddenColumns[key]}
									onChange={isChecked => setIsColumnHidden(key, !isChecked)}
								/>
							</FieldContainer>
						)
					})}
				</div>
			</Box>
		</Dropdown>
	)
}
