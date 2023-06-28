import { AnchorButton, Button, ButtonGroup, Message } from '@contember/ui'
import { CommonPage } from '../CommonPage'
import { LogoutLink } from '../LogoutLink'

export const InvalidIdentityFallback = () => {
	return (
		<CommonPage>
			<Message intent="danger" size="large" flow="generousBlock">Failed to fetch an identity</Message>
			<ButtonGroup orientation={'vertical'}>
				<AnchorButton href={window.location.href}>Reload</AnchorButton>
				<LogoutLink Component={Button}>Login again</LogoutLink>
			</ButtonGroup>
		</CommonPage>
	)
}
