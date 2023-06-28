import { Button, ButtonList, Divider, Stack, StickyContainer } from '@contember/ui'
import { GridIcon, MenuSquareIcon } from 'lucide-react'
import { ReactNode, memo, useCallback } from 'react'
import { useMessageFormatter } from '../../../../../../i18n'
import { DataGridColumnHiding } from '../DataGridColumnHiding'
import { DataGridFullFilters } from '../DataGridFullFilters'
import { dataGridDictionary } from '../dataGridDictionary'
import { DataGridContainerProps } from './Types'

interface DataGridContainerHeaderProps
	extends Pick<
		DataGridContainerProps,
		| 'accessor'
		| 'allowAggregateFilterControls'
		| 'allowColumnVisibilityControls'
		| 'desiredState'
		| 'setFilter'
		| 'setIsColumnHidden'
		| 'setLayout'
	> {
		hasTile: boolean
		pagingSummary: ReactNode
	}

export const DataGridContainerHeader = memo<DataGridContainerHeaderProps>(({
	accessor,
	allowAggregateFilterControls,
	allowColumnVisibilityControls,
	desiredState,
	hasTile,
	pagingSummary,
	setFilter,
	setIsColumnHidden,
	setLayout,
}) => {
	const { layout } = desiredState
	const formatMessage = useMessageFormatter(dataGridDictionary)

	const setDefaultView = useCallback(() => setLayout('default'), [setLayout])
	const setTileView = useCallback(() => setLayout('tiles'), [setLayout])

	return (
		<StickyContainer top={0}>
			<Stack wrap align="center" direction="horizontal" justify="space-between">
				<Stack gap="small" direction="horizontal">
					{hasTile && <>
						<ButtonList>
							<Button onClick={setTileView} size="small" distinction="seamless" intent={layout === 'tiles' ? 'primary' : 'default'}>
								<GridIcon />
							</Button>
							<Button onClick={setDefaultView} size="small" distinction="seamless" intent={layout === 'default' ? 'primary' : 'default'}>
								<MenuSquareIcon />
							</Button>
						</ButtonList>

						<Divider />
					</>}
					{layout !== 'tiles' && allowColumnVisibilityControls !== false && (
							<DataGridColumnHiding
								desiredState={desiredState}
								formatMessage={formatMessage}
								setIsColumnHidden={setIsColumnHidden}
							/>
						)
					}
					{allowAggregateFilterControls !== false && (
						<DataGridFullFilters
							desiredState={desiredState}
							environment={accessor.environment}
							formatMessage={formatMessage}
							setFilter={setFilter}
						/>
					)}
				</Stack>
				<div>{pagingSummary}</div>
			</Stack>
		</StickyContainer>
	)
})
DataGridContainerHeader.displayName = 'DataGridContainerHeader'
