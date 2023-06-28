import { useUserConfig } from '@contember/react-utils'
import { stateClassName, useClassName } from '@contember/utilities'
import { PropsWithChildren } from 'react'
import { DropdownContentContainerProvider } from '../Dropdown'

export const StyleProvider = ({
	displayContents = false,
	children,
}: PropsWithChildren<{
	displayContents?: boolean;
}>) => {

	return (
		<div className={useClassName(displayContents ? 'root-no-display' : 'root', stateClassName({
			// TODO: Make this configurable
			'lucide-icons:override-active': true,
		}))}>
			{children}

			<DropdownContentContainerProvider />
			<div id="portal-root" />
		</div>
	)
}
StyleProvider.displayName = 'Interface.StyleProvider'
