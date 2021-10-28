import {
	Block,
	BlockEditor,
	BlockEditorProps,
	Button,
	Component,
	EditorRenderElementProps,
	EditorTransforms,
	EditorWithBlocks,
	horizontalRuleToolbarButton,
	ImageUploadField, isElementWithReference,
	paragraphNumberedToolbarButton,
	paragraphToolbarButton,
	RichEditor,
	scrollTargetToolbarButton,
	tableToolbarButton,
	TextField,
	useEntity,
} from '@contember/admin'

const RB = RichEditor.buttons
export const fullEditorInlineButtons: BlockEditorProps['inlineButtons'] = [
	[RB.bold, RB.italic, RB.underline, RB.anchor],
	[RB.headingOne, RB.headingTwo, RB.headingThree, RB.headingFour, RB.unorderedList, RB.orderedList],
	[RB.strikeThrough, RB.code],
	[{
		label: 'Link',
		blueprintIcon: 'link',
		discriminateBy: 'link',
		referenceContent: Component(({ onSuccess, selection, editor, referenceId }) => {
			return <>
				<TextField field={'url'} label={'URL'} />
				<ImageUploadField
					label="Image"
					baseEntity="image"
					urlField="url"
					widthField="width"
					heightField="height"
					fileSizeField="size"
					fileTypeField="type"
				/>
				<Button onClick={() => {
					if (!selection) {
						return
					}
					EditorTransforms.select(editor, selection)
					EditorTransforms.wrapNodes(
						editor,
						{
							type: 'link',
							children: [{ text: '' }],
							referenceId,
						},
						{ split: true },
					)
					EditorTransforms.collapse(editor, { edge: 'end' })
					onSuccess()
				}}>OK</Button>
			</>
		}),
	}],
]

export interface ContentFieldProps {
	field: string
}

const LinkElement = ({ attributes, children, element }: EditorRenderElementProps) => {
	const ref = useEntity()
	if (!isElementWithReference(element)) {
		return <span {...attributes}>{children}</span> // stub
	}
	return (
		<>
			<span {...attributes} style={{ color: '#0094FF' }}>
				{children}
				<span style={{ userSelect: 'none' }} contentEditable={false}>({ref.getField('url').value}, {ref.id})</span>
			</span>
		</>
	)
}
export const ContentField = Component<ContentFieldProps>(
	({ field }) => (
		<BlockEditor
			augmentEditor={editor => {
				editor.registerElement({
					type: 'link',
					render: LinkElement,
					isInline: true,
					normalizeNode: ({ element, path }) => {
						if ('href' in element) {
							const referenceId = (editor as EditorWithBlocks).createElementReference(path, 'link', getAccessor => (
								getAccessor().getField('url').updateValue(element.href)
							)).id
							EditorTransforms.setNodes(editor, { referenceId, href: null }, { at: path })
						}
					},
				})
				editor.htmlDeserializer.registerPlugin({
					processInlinePaste: ({ element, next, cumulativeTextAttrs }) => {
						if (element.tagName === 'A' && element.getAttribute('href')) {
							const href = element.getAttribute('href')

							const node = {
								type: 'link',
								children: next(element.childNodes, cumulativeTextAttrs),
								href,
							}
							return [node]
						}
						return null
					},
				})
				return editor
			}}
			leadingFieldBackedElements={[
				{
					field: 'title',
					placeholder: 'Title',
					format: 'plainText',
					size: 'large',
					render: props => <h1 style={{ fontSize: '2.5em', fontWeight: 600 }}>{props.children}</h1>,
				},
				{
					field: 'lead',
					placeholder: 'Lead',
					format: 'richText',
					render: props => <p>{props.children}</p>,
				},
			]}
			trailingFieldBackedElements={[
				{
					field: 'footer',
					placeholder: 'Footer',
					format: 'richText',
					render: props => <p>{props.children}</p>,
				},
			]}
			referencesField="references"
			referenceDiscriminationField="type"
			field={`${field}.blocks`}
			inlineButtons={fullEditorInlineButtons}
			itemLabel="Content"
			label="Content"
			contentField="json"
			sortableBy="order"
			blockButtons={[
				{
					blueprintIcon: 'media',
					discriminateBy: 'image',
					title: 'Image',
				},
				{
					blueprintIcon: 'citation',
					discriminateBy: 'quote',
					title: 'Quote',
				},
				tableToolbarButton,
				scrollTargetToolbarButton,
				paragraphToolbarButton,
				paragraphNumberedToolbarButton,
				horizontalRuleToolbarButton,
			]}
		>
			<Block discriminateBy="image" label="Image">
				<BlockEditor.ContentOutlet placeholder="Text" />
				<ImageUploadField
					label="Image"
					baseEntity="image"
					urlField="url"
					widthField="width"
					heightField="height"
					fileSizeField="size"
					fileTypeField="type"
				/>
			</Block>
			<Block discriminateBy="quote" label="Quote">
				<BlockEditor.ContentOutlet />
				<TextField field="primaryText" label="Quote" />
				<TextField field="secondaryText" label="Author" />
			</Block>
		</BlockEditor>
	),
	'ContentField',
)
