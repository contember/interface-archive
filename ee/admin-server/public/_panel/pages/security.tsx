import { Box, ChangePassword, Divider, GenericPage, Heading, OtpManagement, Stack } from '@contember/admin'

export default () => (
	<GenericPage title="Profile security">
		<Stack direction="vertical" gap="xlarge">
			<ChangePassword />

			<Divider />

			<Heading depth={3}>Two-factor authentication</Heading>
			<Box>
				<OtpManagement />
			</Box>
		</Stack>
	</GenericPage>
)
