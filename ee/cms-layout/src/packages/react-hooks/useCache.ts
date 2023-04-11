import { DependencyList, useRef } from 'react'
import { assert, isTrue } from '../assert-types'

export function useCache() {
	const depsRef = useRef<ReadonlyArray<unknown>>()
	const productRef = useRef<unknown>()

	return <T>(factory: () => T, deps: DependencyList): T => {
		if (!depsRef.current || arrayMembersHaveChanged(depsRef.current, deps)) {
			depsRef.current = deps
			productRef.current = factory()
		}

		return productRef.current as T
	}
}

function arrayMembersHaveChanged(previous: DependencyList, next: DependencyList) {
	assert('dependency arrays has same lengths', previous.length === next.length, isTrue)

	for (let i = 0; i < previous.length; i++) {
		if (!Object.is(previous[i], next[i])) {
			return true
		}
	}

	return false
}
