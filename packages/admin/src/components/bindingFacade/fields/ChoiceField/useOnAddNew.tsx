import {
	AccessorTree,
	Entity,
	EntityAccessor,
	InitializedAccessorTreeState,
	NIL_UUID,
	TreeRootAccessor,
	useBindingOperations,
	useDirtinessState,
	useGetEntityListSubTree,
	useMutationState,
} from '@contember/binding'
import { Button, Stack, useDialog } from '@contember/ui'
import { useMemo } from 'react'
import { useMessageFormatter } from '../../../../i18n'
import { BaseDynamicChoiceField, useDesugaredOptionPath } from './BaseDynamicChoiceField'
import { choiceFieldDictionary } from './choiceFieldDictionary'

export const useOnAddNew = ({ createNewForm, connect, ...props }: BaseDynamicChoiceField & { connect: (entity: EntityAccessor) => void }) => {
	const desugaredOptionPath = useDesugaredOptionPath(props)
	const getSubtree = useGetEntityListSubTree()
	const dialog = useDialog<true>()
	const hasUnpersistedChanges = useDirtinessState()
	const bindingOperations = useBindingOperations()
	const isMutating = useMutationState()
	const localization = useMessageFormatter(choiceFieldDictionary)

	const currentAccessorTreeState = useMemo(
		(): InitializedAccessorTreeState => ({
			name: 'initialized',
			data: new TreeRootAccessor(hasUnpersistedChanges, isMutating, bindingOperations),
		}),
		[hasUnpersistedChanges, isMutating, bindingOperations],
	)
	return useMemo(() => {
			if (!createNewForm) {
				return undefined
			}
			return async () => {
				const subtree = getSubtree({
					entities: {
						entityName: desugaredOptionPath.entityName,
						filter: { id: { eq: NIL_UUID } },
					},
				})
				const newEntityId = subtree.createNewEntity()
				const entity = subtree.getChildEntityById(newEntityId.value)

				const result = await dialog.openDialog({
					heading: localization('choiceField.createNew.dialogTitle'),
					content: contentProps => (
						<Stack direction={'vertical'}>
							<AccessorTree state={currentAccessorTreeState}>
								<Entity accessor={entity}>{createNewForm}</Entity>
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
					subtree.disconnectAll()
				} else {
					entity.deleteEntity()
				}
			}
		}, [createNewForm, getSubtree, desugaredOptionPath.entityName, dialog, currentAccessorTreeState, localization, connect],
	)
}
