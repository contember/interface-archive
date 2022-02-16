import { EditPage } from '@contember/admin'
import { AddContent } from '../components/AddContent'
import { ContentField } from '../components/ContentField'

export const HomepagePage = (
	<EditPage pageName="homepage" entity="Homepage(unique = One)">
		<ContentField field={'content'}/>
		<AddContent field="content" />
	</EditPage>
)
