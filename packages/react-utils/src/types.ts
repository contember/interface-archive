export type Serializable =
	| string
	| number
	| boolean
	| null
	| readonly Serializable[]
	| { readonly [K in string]?: Serializable }

export type NotArray<T extends object & { [Symbol.iterator]?: never }> = T

export type AlphaLower = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm' | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z'
export type AlphaUpper = Uppercase<AlphaLower>
export type Alpha = AlphaLower | AlphaUpper
