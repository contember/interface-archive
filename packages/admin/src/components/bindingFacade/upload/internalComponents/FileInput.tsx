import { useElementSize } from '@contember/react-utils'
import { Button, FieldContainer, FieldContainerProps, FieldErrors, FileDropZone, Grid, Stack } from '@contember/ui'
import { CSSProperties, Children, ReactNode, useMemo, useRef } from 'react'
import type { DropzoneState } from 'react-dropzone'
import type { MessageFormatter } from '../../../../i18n'
import type { AddEntityButtonProps } from '../../collections'
import type { UploadDictionary } from '../uploadDictionary'
import { SelectFileInput, SelectFileInputProps, SelectFileInputPublicProps } from './selection/SelectFileInput'

export type FileInputPublicProps =
	& Pick<FieldContainerProps, 'label' | 'description' | 'labelDescription'>
	& AddEntityButtonProps
	& SelectFileInputPublicProps
	& {
		enableAddingNew?: boolean
		addButtonSubText?: ReactNode
		columnWidth?: number
	}

export type FileInputProps =
	& FileInputPublicProps
	& SelectFileInputProps<{}>
	& {
		children: ReactNode
		dropzoneState: DropzoneState
		errors: FieldErrors | undefined
		formatMessage: MessageFormatter<UploadDictionary>
	}

export const FileInput = ({
	addButtonComponent: AddButton = Button,
	addButtonComponentExtraProps,
	addButtonProps,
	addButtonSubText,
	addButtonText,
	children,
	columnWidth = 160,
	description,
	dropzoneState,
	enableAddingNew = true,
	errors,
	formatMessage,
	label,
	labelDescription,
	...selectProps
}: FileInputProps) => {
	const { getRootProps, isDragActive, isDragAccept, isDragReject, getInputProps } = dropzoneState
	const gridRef = useRef<HTMLDivElement>(null)
	const { width = columnWidth } = useElementSize(gridRef)

	const gridColumns = Math.floor(width / columnWidth)
	const gridItems = Children.count(children)
	const columnStart = (gridItems % gridColumns) + 1

	return (
		<FieldContainer
			label={label}
			useLabelElement={false}
			description={description}
			labelDescription={labelDescription}
			errors={errors}
		>
			<Grid
				ref={gridRef}
				className="fileInput"
				columnWidth={columnWidth}
				style={useMemo(() => ({
					'--fileInput-column-start': columnStart,
				} as CSSProperties), [columnStart])}
			>
				{children !== undefined && children}
				{enableAddingNew && (
					<FileDropZone
						{...getRootProps()}
						isActive={isDragActive}
						isAccepting={isDragAccept}
						isRejecting={isDragReject}
						className="fileInput-dropZone"
					>
						<input {...getInputProps()} />
						<div className="fileInput-cta">
							<Stack wrap justify="center" horizontal>
								{selectProps.fileSelection && (
									<SelectFileInput {...selectProps} formatMessage={formatMessage} />
								)}
								<AddButton
									size="small"
									{...addButtonComponentExtraProps}
									{...addButtonProps}
								>
									{formatMessage(addButtonText, 'upload.addButton.text')}
								</AddButton>
							</Stack>
							<span className="fileInput-cta-label">
								{formatMessage(addButtonSubText, 'upload.addButton.subText')}
							</span>
						</div>
					</FileDropZone>
				)}
			</Grid>
		</FieldContainer>
	)
}
