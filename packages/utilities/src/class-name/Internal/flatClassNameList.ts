import { NestedClassName } from '../Types'

export function flatClassNameList(className: NestedClassName): string[] {
	if (!className) {
		return []
	} else if (typeof className === 'string') {
		return className.split(' ').filter(Boolean)
	} else if (Array.isArray(className)) {
		return className.map(flatClassNameList).flat(1)
	} else {
		if (import.meta.env.DEV) {
			const never: never = className
		}

		throw new Error(`Unexpected className: ${JSON.stringify(className)}`)
	}
}
