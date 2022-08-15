import {
	AccessorTree,
	Entity,
	EntityAccessor,
	EntityListSubTree, TreeRootIdProvider,
	useAccessorTreeState,
	useEnvironment,
	useExtendTree,
	useGetEntityListSubTree,
} from '@contember/binding'
import { Button, Stack, useDialog } from '@contember/ui'
import { useMemo } from 'react'
import { useMessageFormatter } from '../../../../../i18n'
import { BaseDynamicChoiceField } from '../BaseDynamicChoiceField'
import { choiceFieldDictionary } from '../choiceFieldDictionary'
import { useDesugaredOptionPath } from './useDesugaredOptionPath'
import { renderDynamicChoiceFieldStatic } from '../renderDynamicChoiceFieldStatic'

export const useOnAddNew = ({ createNewForm, connect, ...props }: BaseDynamicChoiceField & { connect: (entity: EntityAccessor) => void }) => {
	const desugaredOptionPath = useDesugaredOptionPath(props, undefined)
	const getSubTree = useGetEntityListSubTree()
	const dialog = useDialog<true>()
	const localization = useMessageFormatter(choiceFieldDictionary)
	const extendTree = useExtendTree()
	const environment = useEnvironment()

	const accessorTreeState = useAccessorTreeState()
	return useMemo(() => {
			if (!createNewForm) {
				return undefined
			}
			return async () => {
				const { renderedOption } = renderDynamicChoiceFieldStatic(props, environment)

				const treeRootId = await extendTree(<>
					<EntityListSubTree entities={{
						entityName: desugaredOptionPath.entityName,
					}} limit={0} expectedMutation={'none'}>
						{createNewForm}
						{renderedOption}
					</EntityListSubTree>
				</>)

				if (!treeRootId) {
					return
				}

				const subTree = getSubTree({
					entities: {
						entityName: desugaredOptionPath.entityName,
					},
					limit: 0,
				}, treeRootId)

				const newEntityId = subTree.createNewEntity()
				const entity = subTree.getChildEntityById(newEntityId.value)

				const result = await dialog.openDialog({
					heading: localization('choiceField.createNew.dialogTitle'),
					content: contentProps => (
						<Stack direction="vertical">
							<AccessorTree state={accessorTreeState}>
								<TreeRootIdProvider treeRootId={treeRootId}>
									<Entity accessor={entity}>{createNewForm}</Entity>
								</TreeRootIdProvider>
							</AccessorTree>
							<Stack direction="horizontal" evenly>
								<Button onClick={() => contentProps.resolve()} distinction="default" elevation="none">{localization('choiceField.createNew.cancelButtonText')}</Button>
								<Button onClick={() => contentProps.resolve(true)} distinction="primary" elevation="none">{localization('choiceField.createNew.confirmButtonText')}</Button>
							</Stack>
						</Stack>
					),
				})
				if (result === true) {
					const entityToConnect = entity.getAccessor()
					connect(entityToConnect)
				} else {
					entity.deleteEntity()
				}
			}
		}, [createNewForm, props, environment, extendTree, desugaredOptionPath.entityName, getSubTree, dialog, localization, accessorTreeState, connect],
	)
}
