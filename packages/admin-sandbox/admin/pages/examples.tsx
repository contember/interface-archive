import { Title } from '../components/Directives'
import { SlotSources } from '../components/Slots'

export default () => {
	return (
		<>
			<Title>Examples</Title>
			<SlotSources.Content>
				<p>Say hi to examples</p>
			</SlotSources.Content>
		</>
	)
}
