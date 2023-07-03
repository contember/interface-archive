import type { SugaredFieldProps, SugaredRelativeEntityList } from '@contember/binding'
import { Component } from '@contember/binding'
import type { ReactNode } from 'react'
import { ReactElement } from 'react'
import { BareFileRepeater, FileInputPublicProps, useFileSelection } from '../../internalComponents'
import { HybridFileKindProps } from '../../fileKinds'
import { getFileHandler, useFileHandler } from '../../fileHandler'

export type FileRepeaterProps<SFExtraProps extends {} = {}> =
	& SugaredRelativeEntityList
	& HybridFileKindProps
	& FileInputPublicProps
	& {
		boxLabel?: ReactNode
		label: ReactNode
		sortableBy?: SugaredFieldProps['field']
		children?: ReactNode
	}

/**
 * @group Uploads
 * 
 * @example
 * ```typescript
 * <FileRepeater
 * 	field="galleryList.items"
 * 	baseEntity={'item'}
 * 	boxLabel="Gallery list"
 * 	label="Gallery list"
 * 	sortableBy="order"
 * 	fileSelectionComponent={GallerySelectForm}
 * 	discriminationField="type"
 * >
 * 	<ImageFiles
 * 		discriminateBy="basicImage"
 * 		baseEntity="basicImage"
 * 		urlField="url"
 * 	>
 * 	</ImageFiles>
 * 	<ImageFiles
 * 		discriminateBy="image"
 * 		baseEntity="image"
 * 		urlField="url"
 * 		widthField="width"
 * 		heightField="height"
 * 		fileSizeField="size"
 * 		fileTypeField="type"
 * 		fileNameField="fileName"
 * 	>
 * 		<TextField field="alt" label="Image alternate" />
 * 	</ImageFiles>
 * 	<VideoFiles
 * 		discriminateBy="video"
 * 		baseEntity="video"
 * 		urlField="url"
 * 		widthField="width"
 * 		heightField="height"
 * 		fileSizeField="size"
 * 		fileTypeField="type"
 * 	>
 * 	</VideoFiles>
 * </FileRepeater>
 * ```
 * 
 */
export const FileRepeater = Component<FileRepeaterProps>(
	props => {
		const fileHandler = useFileHandler(props, 'FileRepeater')
		const fileSelection = useFileSelection(props)
		return <BareFileRepeater {...props} fileHandler={fileHandler} fileSelection={fileSelection} />
	},
	(props, environment) => (
		<BareFileRepeater {...props} fileHandler={getFileHandler(props, environment, 'FileRepeater')} />
	),
	'FileRepeater',
) as <SFExtraProps extends {} = {}>(props: FileRepeaterProps<SFExtraProps>) => ReactElement | null
