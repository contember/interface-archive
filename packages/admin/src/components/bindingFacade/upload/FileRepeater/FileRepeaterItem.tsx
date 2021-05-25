import {
	Entity,
	EntityAccessor,
	Environment,
	RelativeSingleField,
	RemovalType,
	VariableInputTransformer,
} from '@contember/binding'
import type { SingleFileUploadState } from '@contember/react-client'
import { ActionableBox, Box } from '@contember/ui'
import { memo, MouseEvent as ReactMouseEvent, ReactNode, useCallback } from 'react'
import { getDiscriminatedBlock, NormalizedBlocks } from '../../blocks'
import { UploadedFilePreview, UploadingFilePreview } from '../core'
import type { FileDataPopulator } from '../fileDataPopulators'
import type { DiscriminatedFileUploadProps } from './DiscriminatedFileUploadProps'

export interface FileRepeaterItemProps {
	canBeRemoved: boolean
	defaultFileKind: DiscriminatedFileUploadProps
	desugaredDiscriminant: RelativeSingleField | undefined
	entity: EntityAccessor
	environment: Environment
	fileDataPopulators: Iterable<FileDataPopulator>
	fileKinds: DiscriminatedFileUploadProps[]
	normalizedBlocks: NormalizedBlocks
	removalType?: RemovalType
	uploadingState: SingleFileUploadState | undefined
}

export const FileRepeaterItem = memo(
	({
		canBeRemoved,
		defaultFileKind,
		desugaredDiscriminant,
		entity,
		environment,
		fileDataPopulators,
		fileKinds,
		normalizedBlocks,
		uploadingState,
	}: FileRepeaterItemProps) => {
		let resolvedFileKind: Partial<DiscriminatedFileUploadProps> = defaultFileKind
		let editContents: ReactNode = undefined

		if (desugaredDiscriminant) {
			const discriminantField = entity.getRelativeSingleField(desugaredDiscriminant)
			const acceptingFileKind: DiscriminatedFileUploadProps | undefined = fileKinds.find(
				fileKind =>
					fileKind.discriminateBy !== undefined &&
					discriminantField.hasValue(VariableInputTransformer.transformValue(fileKind.discriminateBy, environment)),
			)
			if (acceptingFileKind) {
				resolvedFileKind = acceptingFileKind
			}

			const relevantBlock = getDiscriminatedBlock(normalizedBlocks, discriminantField)

			if (relevantBlock !== undefined) {
				editContents = (
					<div>
						<Box heading={relevantBlock.datum.label}>{relevantBlock.datum.children}</Box>
					</div>
				)
			}
		}

		const preview = uploadingState ? (
			<UploadingFilePreview
				uploadState={uploadingState}
				getFileAccessor={entity.getAccessor}
				renderFilePreview={resolvedFileKind.renderFilePreview || defaultFileKind.renderFilePreview}
				environment={environment}
				populators={fileDataPopulators}
			/>
		) : (
			<UploadedFilePreview renderFile={resolvedFileKind.renderFile || defaultFileKind.renderFile} />
		)

		const getAccessor = entity.getAccessor
		const onRemove = useCallback(
			(e: ReactMouseEvent) => {
				e.stopPropagation()
				getAccessor().deleteEntity()
			},
			[getAccessor],
		)

		return (
			<div className="fileInput-preview">
				<Entity accessor={entity}>
					<ActionableBox onRemove={canBeRemoved ? onRemove : undefined} editContents={editContents}>
						{preview}
					</ActionableBox>
				</Entity>
			</div>
		)
	},
)
