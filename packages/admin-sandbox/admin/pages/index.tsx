import {
	Checkbox,
	Divider,
	EditPage,
	FieldContainer,
	FileRepeater,
	Heading,
	ImageFiles,
	ImageUploadField,
	Link, noop, TextField,
	UploadField,
	VideoFiles,
} from '@contember/admin'

export default () => (
	<EditPage entity="UploadShowcase(unique = One)" setOnCreate="(unique = One)">
		<Link to="second">SECOND</Link>
		<ImageUploadField urlField="singleTrivialImage.url" label="Trivial imageddd" />
		<ImageUploadField
			label="Single basic image"
			baseEntity="singleBasicImage"
			urlField="url"
			widthField="width"
			heightField="height"
			fileSizeField="size"
			fileTypeField="type"
		/>
		<UploadField label="Discriminated has one" baseEntity="discriminatedAttachment" discriminationField="type">
			<ImageFiles
				discriminateBy="image"
				baseEntity="image"
				urlField="url"
				widthField="width"
				heightField="height"
				fileSizeField="size"
				fileTypeField="type"
				fileNameField="fileName"
			>
				<TextField field="alt" label="Image alternate" />
			</ImageFiles>
			<VideoFiles
				discriminateBy="video"
				baseEntity="video"
				urlField="url"
				widthField="width"
				heightField="height"
				fileSizeField="size"
				fileTypeField="type"
			>
				test test
			</VideoFiles>
		</UploadField>
		<FileRepeater field="fileList.items" boxLabel="Complex file list" label="Complex file list item" sortableBy="order" discriminationField="type">
			<ImageFiles
				discriminateBy="image"
				baseEntity="image"
				urlField="url"
				widthField="width"
				heightField="height"
				fileSizeField="size"
				fileTypeField="type"
				fileNameField="fileName"
			>
				<TextField field="alt" label="Image alternate" />
			</ImageFiles>
			<VideoFiles
				discriminateBy="video"
				baseEntity="video"
				urlField="url"
				widthField="width"
				heightField="height"
				fileSizeField="size"
				fileTypeField="type"
			>
				test test
			</VideoFiles>
		</FileRepeater>

		<Divider />

		<Heading depth={3}>Test case for Safari performance issue</Heading>

		<p>Safari has problems with <code>:focus-within</code> pseudoclass. Proposed solution was to
		use <a href="https://github.com/WICG/focus-visible#readme" target="_blank">hack</a>.
		However using <code>:not</code> together with <code>:focus-within</code> caused major
		redrawal and style recalculation issues in Safari.</p>

		{[...new Array(30 * 8)].map((v, index) => <FieldContainer
			label={`Checkbox ${index}`}
		>
			{/* <input type="checkbox" /> */}
			<Checkbox value={true} onChange={noop}>{`Checkbox ${index}`} </Checkbox>
		</FieldContainer>)}
	</EditPage>
)
