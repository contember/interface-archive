import {
	AccessorTree,
	Entity,
	EntityAccessor,
	useAccessorTreeState,
	useGetEntityListSubTree,
} from '@contember/binding'
import { Box, Button, Stack, useDialog } from '@contember/ui'
import { useMemo } from 'react'
import { useMessageFormatter } from '../../../../../i18n'
import { BaseDynamicChoiceField } from '../BaseDynamicChoiceField'
import { choiceFieldDictionary } from '../choiceFieldDictionary'
import { useDesugaredOptionPath } from './useDesugaredOptionPath'

export const useOnAddNew = ({ createNewForm, connect, ...props }: BaseDynamicChoiceField & { connect: (entity: EntityAccessor) => void }) => {
	const desugaredOptionPath = useDesugaredOptionPath(props, undefined)
	const getSubTree = useGetEntityListSubTree()
	const dialog = useDialog<true>()
	const localization = useMessageFormatter(choiceFieldDictionary)

	const accessorTreeState = useAccessorTreeState()
	return useMemo(() => {
			if (!createNewForm) {
				return undefined
			}
			return async () => {
				const subTree = getSubTree({
					entities: {
						entityName: desugaredOptionPath.entityName,
					},
					limit: 0,
				})
				const newEntityId = subTree.createNewEntity()
				const entity = subTree.getChildEntityById(newEntityId.value)

				const result = await dialog.openDialog({
					children: resolve => (
						<Box
							gap="large"
							header={localization('choiceField.createNew.dialogTitle')}
							children={(
								<Stack direction="vertical">
									<AccessorTree state={accessorTreeState}>
										<Entity accessor={entity}>{createNewForm}</Entity>
									</AccessorTree>
								</Stack>
							)}
							footer={(
								<Stack grow direction="horizontal" evenly>
									<Button onClick={() => resolve()} distinction="default" elevation="none">{localization('choiceField.createNew.cancelButtonText')}</Button>
									<Button onClick={() => resolve(true)} distinction="primary" elevation="none">{localization('choiceField.createNew.confirmButtonText')}</Button>
								</Stack>
							)}
						/>
					),
				})
				if (result === true) {
					const entityToConnect = entity.getAccessor()
					connect(entityToConnect)
				} else {
					entity.deleteEntity()
				}
			}
		}, [createNewForm, getSubTree, desugaredOptionPath.entityName, dialog, accessorTreeState, localization, connect],
	)
}
