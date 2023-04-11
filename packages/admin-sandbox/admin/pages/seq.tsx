import {
	AnchorButton,
	CreateScope,
	DataGrid,
	DeleteEntityButton,
	EditScope,
	GenericCell,
	LinkButton,
	PersistButton,
	Repeater,
	TextCell,
	TextField,
} from '@contember/admin'
import { TextFieldView } from '@contember/cms-layout'
import { Actions, Content, ContentStack, Title } from '../components/Layout'


export const list = (
	<>
		<Title>List of Seqs</Title>
		<Actions>
			<LinkButton to={'seq/create'}>New entity</LinkButton>
		</Actions>

		<Content>
			<DataGrid entities={'SeqEntity'}>
				<TextCell field={'value'} />
				<GenericCell canBeHidden={false} justification="justifyEnd">
					<LinkButton to={`seq/edit(id: $entity.id)`} Component={AnchorButton}>Edit</LinkButton>
					<DeleteEntityButton title="Delete" immediatePersist={true} />
				</GenericCell>
			</DataGrid>
		</Content>
	</>
)

export const create = (
	<>
		<Title>Create a new Seq</Title>
		<CreateScope entity="SeqEntity" redirectOnSuccess="seq/edit(id: $entity.id)">
			<Actions><PersistButton /></Actions>

			<ContentStack>
				<TextField field={'value'} label={'Value'} />
			</ContentStack>
		</CreateScope>
	</>
)

export const edit = (
	<>
		<EditScope entity="SeqEntity(id = $id)">
			<TextFieldView field="value">{
				title => <Title>{`Edit ${title ? title : 'Seq'}`}</Title>
			}</TextFieldView>

			<Actions><PersistButton /></Actions>

			<ContentStack>
				<TextField field={'value'} label={'Value'} />
				<Repeater field={'sub'} label={'Sub'} orderBy={undefined}>
					<TextField field={'value'} label={'Value sub'} />
				</Repeater>
			</ContentStack>
		</EditScope>
	</>
)
