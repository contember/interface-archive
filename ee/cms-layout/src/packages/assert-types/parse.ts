import { assert } from './assert'

export type ParserCallback<In, Out> = (value: In) => Out

export function parse<In, Out extends In>(
	value: In,
	parser: undefined,
	predicate: (value: unknown) => value is Out,
	that: string,
): Out;

export function parse<In, Out>(
	value: In,
	parser: ParserCallback<In, Out>,
	predicate: (value: Out) => value is Out,
	that: string,
): Out;

export function parse<In, Out extends In | unknown>(
	value: In,
	parser: ParserCallback<In, Out> | undefined,
	predicate: (value: unknown) => value is Out,
	that: string,
): Out {
	if (parser) {
		const parsed = parser(value)
		assert<Out, Out>(that, parsed, predicate)
		return parsed
	} else {
		assert<unknown, Out>(that, value, predicate)
		return value
	}
}
