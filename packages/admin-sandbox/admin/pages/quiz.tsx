import { Block, DiscriminatedBlocks, MultiEditScope, NumberField, PersistButton, TextField } from '@contember/admin'
import { Title } from '../components/Directives'
import { SlotSources } from '../components/Slots'

export default () => (
	<>
		<Title>Quiz!</Title>
		<SlotSources.Content>
			<MultiEditScope entities="QuizResult" listProps={{
				beforeContent: <SlotSources.HeaderActions><PersistButton /></SlotSources.HeaderActions>,
			}}>
				<TextField label="Answer" field="answer" />
				<DiscriminatedBlocks field={'state'} label={undefined}>
					<Block discriminateBy={'pending'} label={'Pending'} />
					<Block discriminateBy={'failed'} label={'Failed'}>
						<TextField field={'failReason'} label={'Reason'} />
					</Block>
					<Block discriminateBy={'succeed'} label={'Succeed'}>
						<NumberField field={'successRating'} label={'Rating'} />
					</Block>
				</DiscriminatedBlocks>
			</MultiEditScope>
		</SlotSources.Content>
	</>
)
