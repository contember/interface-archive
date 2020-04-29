import { BindingError, Entity, EntityAccessor, RelativeSingleField, RemovalType } from '@contember/binding'
import { ActionableBox, Box } from '@contember/ui'
import * as React from 'react'
import { Transforms } from 'slate'
import { ReactEditor, RenderElementProps, useEditor, useSelected } from 'slate-react'
import { getDiscriminatedBlock, NormalizedBlocks } from '../../../blocks'
import { BlockSlateEditor } from '../editor'
import { ContemberEmbedElement } from '../elements'

export interface ContemberEmbedElementRendererProps extends RenderElementProps {
	element: ContemberEmbedElement
	entity: EntityAccessor
	removalType: RemovalType
	discriminationField: RelativeSingleField
	normalizedBlocks: NormalizedBlocks
}

export const ContemberEmbedElementRenderer = React.memo((props: ContemberEmbedElementRendererProps) => {
	const editor = useEditor() as BlockSlateEditor
	const selected = useSelected()

	// TODO remove button, dragHandle, etc.
	const discriminationField = props.entity.getRelativeSingleField(props.discriminationField)
	const discriminatedBlock = getDiscriminatedBlock(props.normalizedBlocks, discriminationField)
	const onContainerClick = React.useCallback(
		(e: React.MouseEvent<HTMLElement>) => {
			if (e.target === e.currentTarget) {
				const path = ReactEditor.findPath(editor, props.element)
				Transforms.select(editor, path)
			}
		},
		[editor, props.element],
	)
	const addDefaultElement = (offset: number) => {
		const [topLevelIndex] = ReactEditor.findPath(editor, props.element)
		const targetPath = [topLevelIndex + offset]
		Transforms.insertNodes(editor, editor.createDefaultElement([{ text: '' }]), {
			at: targetPath,
		})
		Transforms.select(editor, targetPath)
	}

	//if (!discriminatedBlock) {
	//	throw new BindingError(`BlockEditor: Trying to render an entity with an undefined block type.`)
	//}

	//const selectedBlock = discriminatedBlock.data
	//const alternate = selectedBlock.alternate ? <Box>{selectedBlock.alternate}</Box> : undefined

	return (
		<div {...props.attributes}>
			{/* https://github.com/ianstormtaylor/slate/issues/3426#issuecomment-573939245 */}
			<div contentEditable={false} data-slate-editor={false}>
				<Entity accessor={props.entity}>
					<div onClick={() => addDefaultElement(0)} style={{ height: '1em' }} />
					<div style={{ display: 'flex', justifyContent: 'center' }}>
						<ActionableBox
							//editContents={alternate}
							editContents={null}
							onRemove={selected ? undefined : () => props.entity.remove?.(props.removalType)}
						>
							<Box
								/*heading={selectedBlock.label}*/
								isActive={selected}
								onClick={onContainerClick}
							>
								<div
									// This is a bit of a hack to avoid rendering any whitespace
									style={{ display: 'flex' }}
								>
									{/*{selectedBlock.children}*/}
									{props.element.embedHandler.data.renderEmbed({
										entity: props.entity,
									})}
								</div>
							</Box>
						</ActionableBox>
					</div>
					<div onClick={() => addDefaultElement(1)} style={{ height: '1em' }} />
				</Entity>
			</div>
			{props.children}
		</div>
	)
})
ContemberEmbedElementRenderer.displayName = 'ContemberEmbedElementRenderer'
