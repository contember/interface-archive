import { EditScope, PersistButton } from '@contember/admin'
import { AddContent } from '../components/AddContent'
import { ContentField } from '../components/ContentField'
import { Actions, ContentStack, Title } from '../components/Layout'

export default (
	<EditScope entity="Homepage(unique = One)" setOnCreate="(unique = One)">
		<Title>Home Page</Title>

		<Actions>
			<PersistButton />
		</Actions>

		<ContentStack>
			<ContentField field="content" />
			<AddContent field="content" />
		</ContentStack>
	</EditScope>
)
