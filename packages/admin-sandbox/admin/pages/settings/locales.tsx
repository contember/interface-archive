import { MultiEditScope, NavigateBackLink, PersistButton, TextField } from '@contember/admin'
import { Title } from '../../components/Directives'
import { SlotSources } from '../../components/Slots'

export default () => (
	<>
		<Title>Languages</Title>
		<SlotSources.Back><NavigateBackLink to="settings">Back</NavigateBackLink></SlotSources.Back>
		<SlotSources.Content>
			<MultiEditScope entities="Locale" listProps={{ beforeContent: <SlotSources.HeaderActions><PersistButton /></SlotSources.HeaderActions> }}>
				<TextField label="Code" field="code" />
				<TextField label="Label" field="label" />
			</MultiEditScope>
		</SlotSources.Content>
	</>
)
