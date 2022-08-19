export interface MessageDictionaryByLocaleCode {
	[localeCode: string]: MessageDictionary
}

export interface MessageDictionary {
	[Key: string]: MessageDictionary | string
}

export type MessageDictionaryKeys<Dict extends MessageDictionary> = {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	[Key in keyof Dict & string]: Dict[Key] extends MessageDictionary ? `${Key}.${MessageDictionaryKeys<Dict[Key]>}` : Key
}[keyof Dict & string]
