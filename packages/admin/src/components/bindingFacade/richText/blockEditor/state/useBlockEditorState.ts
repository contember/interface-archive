import { useBlockElementCache } from './useBlockElementCache'
import { Editor } from 'slate'
import {
	EntityId, SugaredFieldProps, SugaredRelativeEntityList,
	sortEntities, useDesugaredRelativeSingleField, useEntityList,
} from '@contember/binding'
import { useBlockElementPathRefs } from './useBlockElementPathRefs'
import { useBlockEditorOnChange } from './useBlockEditorOnChange'
import { useEffect, useMemo, useRef } from 'react'
import { useBlockEditorSlateNodes } from '../useBlockEditorSlateNodes'
import { useRefreshBlocks } from './useRefreshBlocks'

export const useBlockEditorState = ({ editor, blockList, sortableBy, contentField, monolithicReferencesMode, referencesField }: {
	editor: Editor,
	blockList: SugaredRelativeEntityList,
	sortableBy: SugaredFieldProps['field']
	contentField: SugaredFieldProps['field']
	referencesField?: SugaredRelativeEntityList | string
	monolithicReferencesMode?: boolean
}) => {
	const entityList = useEntityList(blockList)
	const desugaredSortableByField = useDesugaredRelativeSingleField(sortableBy)
	const trashFakeBlockId = useRef<EntityId>()
	const sortedBlocks = useMemo(() => {
		return sortEntities(
			Array.from(entityList).filter(it => it.id !== trashFakeBlockId.current),
			desugaredSortableByField,
		)
	}, [desugaredSortableByField, entityList])
	const sortedBlocksRef = useRef(sortedBlocks)
	useEffect(() => {
		sortedBlocksRef.current = sortedBlocks
	}, [sortedBlocks])
	const blockElementCache = useBlockElementCache({ editor, blockList, sortableBy, contentField })
	const blockElementPathRefs = useBlockElementPathRefs({ editor, blockList })

	const refreshBlocks = useRefreshBlocks({ editor, sortableBy, contentField, blockList, blockElementCache, blockElementPathRefs, referencesField, monolithicReferencesMode, sortedBlocksRef, trashFakeBlockId })
	const onChange = useBlockEditorOnChange({ editor, blockList, contentField, blockElementCache, sortedBlocksRef, refreshBlocks })
	const nodes = useBlockEditorSlateNodes({ editor, blockElementCache, blockElementPathRefs, blockContentField: contentField, topLevelBlocks: sortedBlocks })

	return { onChange, nodes, sortedBlocksRef, refreshBlocks }
}
