import { ReactNode } from 'react'
import { CommonPage, CommonPageProps } from '../../CommonPage'
import { pageComponent } from './pageComponent'

export type GenericPageProps =
	& Omit<CommonPageProps, 'children'>
	& {
		/** @deprecated Use `React.Fragment` instead */
		pageName?: never;
		children: ReactNode
	}

/**
 * Page for generic content. To use data binding, you must provide {@link @contember/binding#DataBindingProvider}
 *
 * @deprecated @deprecated Use other component, e.g. `React.Fragment` instead.
 * @example
 * ```
 * <GenericPage>
 *   <p>Welcome to Contember.</p>
 * </GenericPage>
 * ```
 *
 * @group Pages
 */
export const GenericPage = pageComponent(
	({ children, pageName, ...props }: GenericPageProps) => <CommonPage {...props}>{children}</CommonPage>,
	'GenericPage',
)
