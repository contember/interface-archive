import { Try } from './Try'

export type Narrowable =
	| string
	| number
	| bigint
	| boolean
type NarrowRaw<A> =
	| (A extends [] ? [] : never)
	| (A extends Narrowable ? A : never)
	| ({ [K in keyof A]: A[K] extends Function
		? A[K]
		: NarrowRaw<A[K]> });

// TODO: Maybe could be removed after Typescript 5.0
// See: https://devblogs.microsoft.com/typescript/announcing-typescript-5-0-beta/#const-type-parameters
export type Narrow<A> =
	Try<A, [], NarrowRaw<A>>
