import { Children, ReactNode, useMemo } from 'react'

/**
 * Walks through the children and returns a string representation of the text content.
 * 
 * @param node - The children to walk through.
 * @returns String representation of the text content or undefined if there is no text content.
 * 
 */
export function getChildrenAsLabel(node: ReactNode): string | undefined {
	if (typeof node === 'string' || typeof node === 'number') {
		return String(node)
	} else if (node === null || node === undefined || typeof node === 'boolean') {
		return undefined
	} else {
		let label: (string | number)[] = []

		Children.map(node, child => {
			if (child === null || child === undefined || typeof child === 'boolean') {
			} else if (typeof child === 'string') {
				const trimmed = child.trim()

				if (trimmed.length > 0) {
					label.push(trimmed)
				}
			} else if (typeof child === 'number') {
				label.push(child)
			} else if ('$$typeof' in child && 'props' in child && child.props && child.props.children) {
				const childLabel = getChildrenAsLabel(child.props.children)

				if (childLabel) {
					label.push(childLabel)
				}
			} else if (Array.isArray(child)) {
				const childLabel = getChildrenAsLabel(child)

				if (childLabel) {
					label.push(childLabel)
				}
			} else {
				console.log('Unsupported child:', child)
			}
		})

		return label.length > 0 ? label.join(' ') : undefined
	}
}

/**
 * Walks through the children and returns a string representation of the text content.
 * 
 * @param node - The children to walk through.
 * @returns String representation of the text content or undefined if there is no text content.
 * 
 */
export function useChildrenAsLabel(node: ReactNode): string | undefined {
	return useMemo(() => getChildrenAsLabel(node), [node])
}
