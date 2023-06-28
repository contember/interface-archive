import { Box, BoxOwnProps, Heading, Layout, Spacer, Stack } from '@contember/ui'
import { ReactNode, memo } from 'react'

export interface MiscPageLayoutProps extends BoxOwnProps {
	footerActions?: ReactNode
}

/** @deprecated Use `CommonPage` component instead */
export const MiscPageLayout = memo<MiscPageLayoutProps>(({ footerActions, heading, children, ...props }) => (
	<Layout>
		<div className="centerCard">
			<div className="centerCard-in">
				<Box
					gap="large"
					heading={heading && (typeof heading === 'string'
						? <Heading depth={1} size="small">{heading}</Heading>
						: heading
					)}
					{...props}
				>
					<Stack direction="vertical" gap="large">
						{children}
					</Stack>
				</Box>
				{footerActions && <div style={{ position: 'sticky', bottom: 0 }}>
					<Spacer gap="large" />
					<Stack direction="horizontal">
						{footerActions}
					</Stack>
				</div>}
			</div>
		</div>
	</Layout>
))
MiscPageLayout.displayName = 'MiscPageLayout'
