import { ReactNode } from 'react'
import { HelperContainerGetter, SortableContainer, SortableContainerProps } from 'react-sortable-hoc'
export interface SortableRepeaterContainerProps extends SortableContainerProps {
	children: ReactNode
}

const getHelperContainer: HelperContainerGetter = () => {
	console.log(document.getElementById('portal-root'))

	return document.getElementById('portal-root') ?? document.body
}

const SortableRepeaterContainerInner = SortableContainer(({ children }: SortableRepeaterContainerProps) => <>{children}</>)

export const SortableRepeaterContainer = (props: SortableRepeaterContainerProps) => <SortableRepeaterContainerInner
	helperContainer={getHelperContainer}
	{...props}
/>

SortableRepeaterContainer.displayName = 'SortableRepeaterContainer'
