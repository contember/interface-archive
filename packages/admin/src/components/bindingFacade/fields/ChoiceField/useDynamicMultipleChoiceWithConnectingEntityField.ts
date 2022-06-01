import {
	EntityAccessor,
	EntityId,
	SugaredFieldProps,
	SugaredRelativeSingleEntity,
	useDesugaredRelativeSingleEntity,
	useEntityList,
	useSortedEntities,
} from '@contember/binding'
import { useCallback, useMemo } from 'react'
import { useCurrentValues } from './BaseDynamicChoiceField'
import type { ChoiceFieldData } from './ChoiceFieldData'
import { useSelectOptions } from './useSelectOptions'
import { useAccessorErrors } from '../../errors'
import { useOnAddNew } from './useOnAddNew'
import { DynamicMultipleChoiceFieldProps } from './useDynamicMultipleChoiceField'

export interface DynamicMultipleChoiceWithConnectingEntityFieldProps {
	connectingEntityField: string | SugaredRelativeSingleEntity
	sortableBy?: SugaredFieldProps['field']
}



export const useDynamicMultipleChoiceWithConnectingEntityField = (
	props: DynamicMultipleChoiceFieldProps & DynamicMultipleChoiceWithConnectingEntityFieldProps,
): ChoiceFieldData.MultipleChoiceFieldMetadata => {
	const connectingEntitiesListAccessor = useEntityList(props)
	const sortedConnectingEntities = useSortedEntities(connectingEntitiesListAccessor, props.sortableBy)
	const optionTargetField = useDesugaredRelativeSingleEntity(props.connectingEntityField)

	const [currentlyChosenEntities, optionIdToConnectingEntityMap] = useMemo(() => {
		const optionEntities = []
		const optionIdToConnectingEntityMap = new Map<EntityId, EntityAccessor>()
		for (const connectingEntity of sortedConnectingEntities.entities) {
			const optionEntity = connectingEntity.getRelativeSingleEntity(optionTargetField)
			optionEntities.push(optionEntity)
			optionIdToConnectingEntityMap.set(optionEntity.id, connectingEntity)
		}
		return [optionEntities, optionIdToConnectingEntityMap]
	}, [optionTargetField, sortedConnectingEntities.entities])

	const [entities, options] = useSelectOptions(props, currentlyChosenEntities)

	const currentValues = useCurrentValues(currentlyChosenEntities, entities)

	const getConnectingEntityValues = connectingEntitiesListAccessor.getAccessor

	const clear = useCallback(() => {
		getConnectingEntityValues().batchUpdates(getListAccessor => {
			for (const child of getListAccessor()) {
				child.deleteEntity()
			}
		})
	}, [getConnectingEntityValues])

	const onAdd = useCallback((option: EntityAccessor) => {
		sortedConnectingEntities.appendNew(accessor => {
			const entity = accessor()
			const hasOne = optionTargetField.hasOneRelationPath
			const parentEntity = hasOne.length > 1
				? entity.getRelativeSingleEntity({
					hasOneRelationPath: hasOne.slice(0, -1),
				})
				: entity
			parentEntity.connectEntityAtField(hasOne[hasOne.length - 1].field, option)
		})
	}, [optionTargetField.hasOneRelationPath, sortedConnectingEntities])

	const onChange = useCallback(
		(optionKey: ChoiceFieldData.ValueRepresentation, isChosen: boolean) => {
			const optionEntity = entities[optionKey]
			if (isChosen) {
				onAdd(optionEntity)
			} else {
				const connectingEntity = optionIdToConnectingEntityMap.get(optionEntity.id)
				if (connectingEntity !== undefined) {
					connectingEntity.deleteEntity()
				}
			}
		},
		[entities, onAdd, optionIdToConnectingEntityMap],
	)

	const errors = useAccessorErrors(connectingEntitiesListAccessor)

	return {
		currentValues,
		data: options,
		errors,
		clear,
		onChange,
		onAddNew: useOnAddNew({
			...props,
			connect: useCallback(entity => {
				onAdd(entity)
			}, [onAdd]),
		}),
		onMove: sortedConnectingEntities.moveEntity,
	}
}
