/* eslint-disable quote-props */
import { describe, expect, test } from 'vitest'
import { CLASS_NAME_RESET, CLASS_NAME_RESET_STRING, ComponentStyleSheet, ProcessedClassNameListValue, PropsWithClassName, resolveStyleSheet, StyleSheetClassName, toClassName, ToStyleSheet } from '../../src'
import { StyleSheetValueResolver } from '../../src/components/StyleSheet'
import { deepMerge, excludeFromArray, filterResetClassNames, REMOVE_RESET_CLASS_NAME, toFlatArrayOfClassNameValues } from '../../src/components/StyleSheet/Helpers'
import { toClassNameList } from '../../src/components/StyleSheet/toClassNameList'
import { toStyleSheet } from '../../src/components/StyleSheet/toStyleSheet'

function shape(data: any): any {
	return JSON.parse(JSON.stringify(data))
}

describe('StyleSheet module', () => {
	test('resolveStyleSheet()', () => {
		expect(shape(resolveStyleSheet('some class name', CLASS_NAME_RESET))).toEqual([[], {}])

		expect(shape(resolveStyleSheet(
			{ '$aClassName': 'var-$a', $a: () => 'a' },
			'$aClassName some class name',
			'extra-class mx-10',
			{ header: 'some class' },
			{ footer: CLASS_NAME_RESET },
		))).toEqual([
			['var-a', 'some', 'class', 'name', 'extra-class', 'mx-10'],
			{
				'header': { '$': ['some', 'class'] },
				'footer': { '$': [CLASS_NAME_RESET_STRING] },
			},
		])

		expect(shape(resolveStyleSheet(
			{ '$aClassName': 'var-$a', $a: () => 'a' },
			'$aClassName some class name',
			CLASS_NAME_RESET,
			'new-class mx-10 ',
		))).toEqual([['new-class', 'mx-10'], {}])
	})

	test('resolveStyleSheet(): README example to string render', () => {
		const f: StyleSheetValueResolver = ({ $variable }) => $variable === null
			? 'no-foo' : $variable === undefined ? undefined
				: `foo--${$variable}`

		const handCrafted = toClassName({ '$': '$variableClassName', '$variableClassName': 'bar--$variable' })
		const baseClassName = toClassName('$variableClassName', { '$variableClassName': 'bar--$variable' })
		//    ^?

		expect(baseClassName).toEqual(handCrafted)

		expect('' + resolveStyleSheet(baseClassName, { $variable: true })[0]).toBe('bar--true')
		expect('' + resolveStyleSheet(baseClassName, { $variable: false })[0]).toBe('bar--false')
		expect('' + resolveStyleSheet(baseClassName, { $variable: 123 })[0]).toBe('bar--123')
		expect('' + resolveStyleSheet(baseClassName, { $variable: 'bar' })[0]).toBe('bar--bar')
		expect('' + resolveStyleSheet(baseClassName, { $variable: null })[0]).toBe('')
		expect('' + resolveStyleSheet(baseClassName, { $variable: undefined })[0]).toBe('')

		const overriddenClassName = toClassName(baseClassName, {
			$variableClassName: f,
		})

		expect('' + resolveStyleSheet(overriddenClassName, { $variable: true })[0]).toBe('foo--true')
		expect('' + resolveStyleSheet(overriddenClassName, { $variable: false })[0]).toBe('foo--false')
		expect('' + resolveStyleSheet(overriddenClassName, { $variable: 123 })[0]).toBe('foo--123')
		expect('' + resolveStyleSheet(overriddenClassName, { $variable: 'bar' })[0]).toBe('foo--bar')
		expect('' + resolveStyleSheet(overriddenClassName, { $variable: null })[0]).toBe('no-foo')
		expect('' + resolveStyleSheet(overriddenClassName, { $variable: undefined })[0]).toBe('')
	})

	test('resolveStyleSheet(): Targeting sub-components README example to string render', () => {
		const styleSheet = toClassName('$componentClassName', {
			$componentClassName: '$prefix-$componentName',
			$prefix: 'cui',
			$componentName: 'box',
			body: {
				$gapClassName: 'gap-size-$gap',
				$gap: 2,
				$: '$componentClassName-body $gapClassName',
			},
		})

		const [className, resolvedStyleSheet] = resolveStyleSheet(styleSheet)

		expect('' + className).toBe('cui-box')
		expect('' + resolvedStyleSheet.body).toBe('cui-box-body gap-size-2')

		const [overriddenClassName, overriddenResolvedStyleSheet] = resolveStyleSheet(styleSheet, {
			// Will override prefix
			$prefix: 'next',
			// Will change gap value for body sub-component
			body: { $gap: 1 },
		})

		// When used as strings:
		expect('' + overriddenClassName).toBe('next-box')
		expect('' + overriddenResolvedStyleSheet.body).toBe('next-box-body gap-size-1')
	})

	const fieldContainerStyleSheet = toClassName({
		// Variables:
		$componentClassName: '$prefix$root',
		$errorClassName: ({ $error }) => $error ? 'has-error' : 'no-error',
		$error: false,
		$gap: 1,
		$gapClassName: 'gap:$gap',
		$prefix: 'cui-',
		$root: 'field-container',
		// ClassName:
		$: '$componentClassName $gapClassName $errorClassName',
		// Sub-component class names:
		header: '$componentClassName-header',
		body: {
			// ClassName:
			$: '$componentClassName-body $gapClassName',
			// Sub-component override of the root template:
			$gapClassName: 'gap-size-$gap',
			// Sub-component override of the root variable:
			$gap: 2,
		},
		footer: '$componentClassName-footer',
	})

	test('resolveStyleSheet(): README 2.1 Default rendering', () => {
		const [className, styleSheet] = resolveStyleSheet(fieldContainerStyleSheet)

		expect(`<div class="${className}">
	<span class="${styleSheet.header}">...</span>
	<span class="${styleSheet.body}">...</span>
	<span class="${styleSheet.footer}">...</span>
</div>`).toBe(`<div class="cui-field-container gap:1 no-error">
	<span class="cui-field-container-header">...</span>
	<span class="cui-field-container-body gap-size-2">...</span>
	<span class="cui-field-container-footer">...</span>
</div>`)
	})

	test('resolveStyleSheet(): README 2.2 Extra string class name', () => {
		// Resolve as inside of the component
		const classNameProp = 'extra-class'
		const [className, styleSheet] = resolveStyleSheet(fieldContainerStyleSheet, classNameProp)

		expect(`<div class="${className}">
	<span class="${styleSheet.header}">...</span>
	<span class="${styleSheet.body}">...</span>
	<span class="${styleSheet.footer}">...</span>
</div>`).toBe(`<div class="cui-field-container gap:1 no-error extra-class">
	<span class="cui-field-container-header">...</span>
	<span class="cui-field-container-body gap-size-2">...</span>
	<span class="cui-field-container-footer">...</span>
</div>`)
	})

	test('resolveStyleSheet(): README 2.3 Override root and target sub-components', () => {
		// Resolve as inside of the component
		const classNameProp = {
			$prefix: 'next-',
			body: { $prefix: 'cui-', $gap: 3 },
		}
		const [className, styleSheet] = resolveStyleSheet(fieldContainerStyleSheet, classNameProp)

		expect(`<div class="${className}">
	<span class="${styleSheet.header}">...</span>
	<span class="${styleSheet.body}">...</span>
	<span class="${styleSheet.footer}">...</span>
</div>`).toBe(`<div class="next-field-container gap:1 no-error">
	<span class="next-field-container-header">...</span>
	<span class="cui-field-container-body gap-size-3">...</span>
	<span class="next-field-container-footer">...</span>
</div>`)
	})

	test('resolveStyleSheet(): README 2.4 Resetting internal and pass extra class names', () => {
		// Resolve as inside of the component
		const classNameProp = toClassName(CLASS_NAME_RESET, 'extra-class', {
			$prefix: 'next-',
			body: { $prefix: 'cui-', $gap: 3 },
		})
		const [className, styleSheet] = resolveStyleSheet(fieldContainerStyleSheet, classNameProp)

		expect(`<div class="${className}">
	<span class="${styleSheet.header}">...</span>
	<span class="${styleSheet.body}">...</span>
	<span class="${styleSheet.footer}">...</span>
</div>`).toBe(`<div class="extra-class">
	<span class="next-field-container-header">...</span>
	<span class="cui-field-container-body gap-size-3">...</span>
	<span class="next-field-container-footer">...</span>
</div>`)
	})

	test('resolveStyleSheet(): README 2.5 Resetting all internal class names', () => {
		// Resolve as inside of the component
		const classNameProp = toClassName(CLASS_NAME_RESET, 'extra-class', {
			header: toClassName(CLASS_NAME_RESET, 'my-header'),
			body: toClassName(CLASS_NAME_RESET, 'my-body'),
			footer: toClassName(CLASS_NAME_RESET, 'my-footer'),
		})
		const [className, styleSheet] = resolveStyleSheet(fieldContainerStyleSheet, classNameProp)

		expect(`<div class="${className}">
	<span class="${styleSheet.header}">...</span>
	<span class="${styleSheet.body}">...</span>
	<span class="${styleSheet.footer}">...</span>
</div>`).toBe(`<div class="extra-class">
	<span class="my-header">...</span>
	<span class="my-body">...</span>
	<span class="my-footer">...</span>
</div>`)
	})

	test('resolveStyleSheet(): README 2.6 Changing error class resolving', () => {
		// Resolve as inside of the component
		const classNameProp: StyleSheetClassName = {
			$errorClassName: ({ $error }) => $error ? 'text-red-500' : undefined,
		}
		const [className, styleSheet] = resolveStyleSheet(fieldContainerStyleSheet, {
			$error: true,
		}, classNameProp)

		expect(`<div class="${className}">
	<span class="${styleSheet.header}">...</span>
	<span class="${styleSheet.body}">...</span>
	<span class="${styleSheet.footer}">...</span>
</div>`).toBe(`<div class="cui-field-container gap:1 text-red-500">
	<span class="cui-field-container-header">...</span>
	<span class="cui-field-container-body gap-size-2">...</span>
	<span class="cui-field-container-footer">...</span>
</div>`)
	})

	test('resolveStyleSheet(): to string render with reset', () => {
		const [className, ext] = resolveStyleSheet(
			'base',
			CLASS_NAME_RESET,
			{ $: 'next-base' },
			'mx-10',
			{ $: [''], a: undefined, c: null },
			{ b: 'gap:2', c: null },
		)

		expect(shape(className)).toEqual(['next-base', 'mx-10'])

		ext.a
		ext.b
		ext.c
		// @ts-expect-error: Property 'foo' does not exist on type 'ProcessedStyleSheet<"a" | "b" | "c"> & string'.
		ext.foo

		const castToString: string | undefined = className

		expect(className + '').toBe('next-base mx-10')
		expect(ext.a + '').toBe('undefined')
		expect(ext.b + '').toBe('gap:2')
		expect(ext.c + '').toBe('undefined')
	})

	test('resolveStyleSheet(): to string render 2', () => {
		const [className, styleSheet] = resolveStyleSheet({
			$gapClassName: 'gap:$gap',
			$errorClassName: 'error:$error',
			$rootClassName: '$prefix$root',
			$: '$rootClassName $someOne $some $some-one $gapClassName $someTwo'.split(' ').filter(Boolean),
			'body': {
				$: '$rootClassName-body $errorClassName $gapClassName'.split(' ').filter(Boolean),
				label: {
					$: [],
				},
			},
		}, {
			$prefix: 'cui-',
			$root: 'field-container',
			$some: 'some',
			$gap: 1,
			body: {
				$gap: 2,
			},
		}, {
			'$prefix': '',
			'$root': 'fc',
			$gapClassName: 'g-$gap',
		})

		expect(`<div class="${className}">
	<div class="${styleSheet.body}">
		{children}
	</div>
</div>`).toBe(`<div class="fc some some-one g-1">
	<div class="fc-body g-2">
		{children}
	</div>
</div>`)
	})

	test('resolveStyleSheet(): render box > field-container', () => {
		type FieldContainerStyleSheet = ComponentStyleSheet<{
			$ampersand?: string
			$gap?: number | null
			$prefix?: string,
			$root?: string,
		}>

		const fieldContainerStyleSheet: FieldContainerStyleSheet = {
			...{
				$ampersand: '$prefix$root',
				$gapClassName: 'gap:$gap',
			},
			$: '$ampersand $gapClassName',
			$prefix: 'cui-',
			$root: 'field-container',
			$gap: 0,
		}

		function FieldContainer({ className: _className }: PropsWithClassName<FieldContainerStyleSheet> = {}) {
			const [className, styleSheet] = resolveStyleSheet(fieldContainerStyleSheet, _className)

			return `<div class="${className}">{children}</div>`
		}

		type BoxStyleSheet = ComponentStyleSheet<{
			$ampersand?: string
			$prefix?: string,
			$root?: string,
			fieldContainer?: FieldContainerStyleSheet
		}>

		const boxStyleSheet: BoxStyleSheet = {
			$ampersand: '$prefix$root',
			$: '$ampersand',
			$prefix: 'cui-',
			$root: 'box',
			fieldContainer: { $gap: 1 },
		}

		expect(deepMerge(
			{ 'fieldContainer': { $gap: 1 } },
			{ 'fieldContainer': CLASS_NAME_RESET }),
		).toEqual({
			fieldContainer: { $gap: 1, $: [CLASS_NAME_RESET_STRING] },
		})

		function Box({ className: _className }: PropsWithClassName<BoxStyleSheet> = {}) {
			const [className, styleSheet] = resolveStyleSheet(boxStyleSheet, _className)
			//                ^?

			const aa: BoxStyleSheet = boxStyleSheet
			//    ^?
			const bb: BoxStyleSheet | undefined = _className
			//    ^?

			const a = resolveStyleSheet(boxStyleSheet)
			//    ^?
			const b = resolveStyleSheet(_className)
			//    ^?

			return `<div class="${className}">${FieldContainer({ className: styleSheet?.fieldContainer })}</div>`
		}

		expect(Box({
			className: {
				$prefix: 'old-cui-',
				fieldContainer: { $gap: 2 },
			},
		})).toBe('<div class="old-cui-box"><div class="cui-field-container gap:2">{children}</div></div>')

		expect(Box({ className: CLASS_NAME_RESET })).toBe('<div class=""><div class="cui-field-container gap:1">{children}</div></div>')
		expect(Box({ className: toClassName(CLASS_NAME_RESET) })).toBe('<div class=""><div class="cui-field-container gap:1">{children}</div></div>')
		expect(Box({
			className: toClassName(CLASS_NAME_RESET, {
				fieldContainer: CLASS_NAME_RESET,
			}),
		})).toBe('<div class=""><div class="">{children}</div></div>')

		const repeaterStyleSheet = {
			$ampersand: '$prefix$name',
			$prefix: 'cui-',
			$name: 'repeater',
			$: '$ampersand',
			box: [],
		}

		function Repeater({ className: _className }: PropsWithClassName = {}) {
			const [className, stylesheet] = resolveStyleSheet(repeaterStyleSheet, _className)

			return Box({ className: toClassName(className, stylesheet.box) })
		}

		expect(Repeater()).toBe('<div class="cui-box cui-repeater"><div class="cui-field-container gap:1">{children}</div></div>')
		expect(Repeater({ className: CLASS_NAME_RESET })).toBe('<div class="cui-box"><div class="cui-field-container gap:1">{children}</div></div>')
		expect(Repeater({ className: toClassName(CLASS_NAME_RESET, { box: CLASS_NAME_RESET }) })).toBe('<div class=""><div class="cui-field-container gap:1">{children}</div></div>')
		expect(Repeater({
			className: toClassName(CLASS_NAME_RESET, {
				box: toClassName(CLASS_NAME_RESET, {
					fieldContainer: CLASS_NAME_RESET,
				}),
			}),
		})).toBe('<div class=""><div class="">{children}</div></div>')
	})

	test('toClassName(): Typescript', () => {
		expect(toClassName('one', 'two')).toEqual({ $: ['one', 'two'] })
		const extendedStyleSheet1: { $: ProcessedClassNameListValue } = toClassName('one', 'two')
		expect(toClassName('one', '')).toEqual({ $: ['one'] })
		const extendedStyleSheet2: { $: ProcessedClassNameListValue } = toClassName('one', '')
		expect(toClassName('one', null)).toEqual({ $: ['one'] })
		const extendedStyleSheet3: { $: ProcessedClassNameListValue } = toClassName('one', null)
		expect(toClassName('one', { header: 'some' })).toEqual({ $: ['one'], header: { $: ['some'] } })
		const extendedStyleSheet4: { $: ProcessedClassNameListValue; header: { $: ProcessedClassNameListValue } } = toClassName('one', { header: 'some' })
		expect(toClassName('one', { header: { headerLabel: 'some' } })).toEqual({ '$': ['one'], 'header': { 'headerLabel': { '$': ['some'] } } })
		const extendedStyleSheet5: { $: ProcessedClassNameListValue; header: { headerLabel: { $: ProcessedClassNameListValue } } } = toClassName('one', { header: { headerLabel: 'some' } })

		extendedStyleSheet5
		// ^?
		extendedStyleSheet5.header
		//                  ^?
		extendedStyleSheet5.header.headerLabel
		//                         ^?
		extendedStyleSheet5.header.headerLabel.$
		//                                     ^?
	})

	test('toClassName: empty', () => {
		expect(toClassName()).toEqual(undefined)
		expect(toClassName('')).toEqual({ $: [] })
		expect(toClassName(null)).toEqual(undefined)
		expect(toClassName(undefined)).toEqual(undefined)
		expect(toClassName(false)).toEqual(undefined)
		// @ts-expect-error: Argument of type 'true' is not assignable to parameter of type 'StyleSheetClassName'.
		expect(toClassName(true)).toEqual(undefined)
		// @ts-expect-error: Argument of type '999' is not assignable to parameter of type 'StyleSheetClassName'.
		expect(toClassName(0)).toEqual(undefined)
		// @ts-expect-error: Argument of type '999' is not assignable to parameter of type 'StyleSheetClassName'.
		expect(toClassName(999)).toEqual(undefined)
	})

	test('toClassName: string & string[]', () => {
		expect(toClassName('lorem ipsum dolor sit amet')).toEqual({ $: ['lorem', 'ipsum', 'dolor', 'sit', 'amet'] })
		expect(toClassName(['lorem', 'ipsum', 'dolor', 'sit', 'amet'])).toEqual({ $: ['lorem', 'ipsum', 'dolor', 'sit', 'amet'] })
		expect(toClassName('lorem ipsum', null, 'dolor sit amet')).toEqual({ $: ['lorem', 'ipsum', 'dolor', 'sit', 'amet'] })
		expect(toClassName('lorem ipsum', ['dolor', 'sit', 'amet'])).toEqual({ $: ['lorem', 'ipsum', 'dolor', 'sit', 'amet'] })
		expect(toClassName(['lorem', 'ipsum'], 'dolor', ['sit', 'amet'])).toEqual({ $: ['lorem', 'ipsum', 'dolor', 'sit', 'amet'] })
	})

	test('toClassName: reset', () => {
		expect(toClassName(['lorem', 'ipsum'], 'dolor', ['sit', 'amet'], CLASS_NAME_RESET)).toEqual(CLASS_NAME_RESET)
		expect(toClassName(['lorem', 'ipsum'], 'dolor', ['sit', 'amet'], CLASS_NAME_RESET, 'new start')).toEqual({ $: [CLASS_NAME_RESET_STRING, 'new', 'start'] })
		expect(toClassName(['lorem', 'ipsum'], 'dolor', ['sit', 'amet'], CLASS_NAME_RESET, ['next-${&}', 'new start'])).toEqual({ $: [CLASS_NAME_RESET_STRING, 'next-${&}', 'new', 'start'] })

		expect(
			toClassName(CLASS_NAME_RESET, { fieldContainer: CLASS_NAME_RESET }),
		).toEqual(
			{ $: [CLASS_NAME_RESET_STRING], fieldContainer: { $: [CLASS_NAME_RESET_STRING] } },
		)
	})

	test('toClassName: mixed', () => {
		const varStyleSheet = toClassName('$varTemplate $unusedVarTemplate', {
			$unusedVarTemplate: '$unusedVar',
			$varTemplate: 'foo--$value',
			$value: 2,
		})

		expect(toClassName(varStyleSheet)).toEqual({
			'$': [
				'$varTemplate',
				'$unusedVarTemplate',
			],
			$value: 2,
			$varTemplate: 'foo--$value',
			$unusedVarTemplate: '$unusedVar',
		})

		expect(toClassName(varStyleSheet, {
			$value: 1,
		})).toEqual({
			'$': [
				'$varTemplate',
				'$unusedVarTemplate',
			],
			$value: 1,
			$varTemplate: 'foo--$value',
			$unusedVarTemplate: '$unusedVar',
		})
	})

	test('toClassName: skip undefined values', () => {
		expect(toClassName({ $var: 1 }, { $var: undefined })).toEqual({ $var: 1 })
	})

	test('toClassName: null-ify with values', () => {
		expect(toClassName({ $var: 1 }, { $var: null })).toEqual({ $var: null })
	})

	test('toStyleSheet()', () => {
		expect(toStyleSheet(null)).toEqual(undefined)
		const expectType1: ToStyleSheet<null> = undefined
		// @ts-expect-error: Argument of type '1' is not assignable to parameter of type 'StyleSheetClassName'.
		expect(toStyleSheet(1)).toEqual(undefined)
		const expectType2: ToStyleSheet<1> = undefined
		expect(toStyleSheet(undefined)).toEqual(undefined)
		const expectType3: ToStyleSheet<undefined> = undefined
		expect(toStyleSheet('mx-10 p-20')).toEqual({ $: ['mx-10', 'p-20'] })
		const expectType4: ToStyleSheet<'mx-10 p-20'> = { $: ['mx-10', 'p-20'] }
		expect(toStyleSheet(['mx-10', null, undefined, false, 'p-20'])).toEqual({ $: ['mx-10', 'p-20'] })
		const expectType5: ToStyleSheet<['mx-10', 1, null, undefined, false, 'p-20']> = { $: ['mx-10', 'p-20'] }
		expect(toStyleSheet(['mx-10', '', null, undefined, 'p-20'])).toEqual({ $: ['mx-10', 'p-20'] })
		const expectType6: ToStyleSheet<['mx-10', '', null, undefined, 'p-20']> = { $: ['mx-10', 'p-20'] }
		expect(toStyleSheet({ header: 'mx-10 p-20' })).toEqual({ header: { $: ['mx-10', 'p-20'] } })
		const expectType7: ToStyleSheet<{ header: 'mx-10 p-20' }> = { header: { $: ['mx-10', 'p-20'] } }
		expect(toStyleSheet(CLASS_NAME_RESET)).toEqual(CLASS_NAME_RESET)
		const expectType8: ToStyleSheet<typeof CLASS_NAME_RESET> = CLASS_NAME_RESET
		expect(toStyleSheet({ $: 'string' })).toEqual({ $: ['string'] })
		const expectType9: ToStyleSheet<{ $: 'string' }> = { $: ['string'] }
		// @ts-expect-error: Type 'number' is not assignable to type 'UnprocessedClassNameListValue | Iterable<UnprocessedClassNameListValue>'.
		expect(toStyleSheet({ $: 1 })).toEqual({ $: [] })
		const expectType10: ToStyleSheet<{ $: 1 }> = { $: [] }
		// @ts-expect-error: Type 'true' is not assignable to type 'UnprocessedClassNameListValue | Iterable<UnprocessedClassNameListValue>'.
		expect(toStyleSheet({ $: true })).toEqual({ $: [] })
		const expectType11: ToStyleSheet<{ $: true }> = { $: [] }
		expect(toStyleSheet({ $: false })).toEqual({ $: [] })
		const expectType12: ToStyleSheet<{ $: false }> = { $: [] }
		expect(toStyleSheet({ $: undefined })).toEqual({ $: [] })
		const expectType13: ToStyleSheet<{ $: undefined }> = { $: [] }
		expect(toStyleSheet({ $: null })).toEqual({ $: [] })
		const expectType14: ToStyleSheet<{ $: null }> = { $: [] }
		expect(toStyleSheet({ $a: 1 })).toEqual({ $a: 1 })
		const expectType15: ToStyleSheet<{ $a: 1 }> = { $a: 1 }
		expect(toStyleSheet({ $a: null })).toEqual({ $a: null })
		const expectType16: ToStyleSheet<{ $a: null }> = { $a: null }
		expect(toStyleSheet({ $a: undefined })).toEqual({ a: undefined })
		const expectType17: ToStyleSheet<{ $a: undefined }> = { $a: undefined }

		// @ts-expect-error: Type 'null[]' is not assignable to type 'StyleSheetVariableValue'.
		expect(() => toStyleSheet({ $a: [null] })).toThrowError(`Unexpected '$a' variable value: [null]. Use 'string', 'number', 'boolean', 'null' or 'undefined' value type.`)
	})

	test('deepMerge()', () => {
		expect(deepMerge(undefined, undefined)).toEqual(undefined)
		expect(deepMerge(1, undefined)).toEqual(1)
		expect(deepMerge(1, null)).toEqual(null)
		expect(deepMerge(1, [])).toEqual([])
		expect(deepMerge(1, {})).toEqual({})
		expect(deepMerge(1, 2)).toEqual(2)
		expect(deepMerge('1', undefined)).toEqual('1')
		expect(deepMerge(true, undefined)).toEqual(true)
		expect(deepMerge(false, undefined)).toEqual(false)
		expect(deepMerge(false, true)).toEqual(true)
		expect(deepMerge(false, null)).toEqual(null)
		expect(deepMerge([false], [null])).toEqual([false, null])
		expect(deepMerge(undefined, CLASS_NAME_RESET)).toEqual(CLASS_NAME_RESET)
		expect(deepMerge(null, CLASS_NAME_RESET)).toEqual(CLASS_NAME_RESET)
		expect(deepMerge(CLASS_NAME_RESET, undefined)).toEqual(CLASS_NAME_RESET)
		expect(deepMerge(CLASS_NAME_RESET, { $: [] })).toEqual(CLASS_NAME_RESET)
		expect(deepMerge({ $: null, header: 'some' }, { $: [] })).toEqual({ $: [], header: 'some' })
		expect(deepMerge({ $: ['one'], header: 'some' }, { $: ['two'] })).toEqual({ $: ['one', 'two'], header: 'some' })
		expect(deepMerge(
			{ $: ['one'], header: { label: { $: ['some'] } } },
			{ $: ['two'], header: { label: { $: ['more'] } } },
		)).toEqual({ $: ['one', 'two'], header: { label: { $: ['some', 'more'] } } })
		expect(deepMerge(
			{ $: ['one'], header: { label: { $: ['some'] } } },
			{ $: ['two'], header: { label: CLASS_NAME_RESET } },
		)).toEqual({ $: ['one', 'two'], header: { label: CLASS_NAME_RESET } })
		expect(deepMerge(
			{ $: ['one'], header: { label: { $: ['some'] } } },
			{ $: ['two'], header: { label: CLASS_NAME_RESET } },
		)).toEqual({ $: ['one', 'two'], header: { label: CLASS_NAME_RESET } })
	})

	describe('excludeFromArray()', () => {
		test('null removal', () => {
			const from = [null, 1, 'string', true, false]
			// @ts-expect-error: Type 'null' is not assignable to type 'string | number | boolean'.
			const tsFail: (string | number | boolean)[] = from
			const to: (string | number | boolean)[] = excludeFromArray(null, from)

			expect(to).toEqual([1, 'string', true, false])
		})
	})

	describe('toClassNameList', () => {
		test('toClassNameList()', () => {
			expect(toClassNameList(-1)).toEqual([])
			expect(toClassNameList(0)).toEqual([])
			expect(toClassNameList(1)).toEqual([])
			expect(toClassNameList(null)).toEqual([])
			expect(toClassNameList(undefined)).toEqual([])
			expect(toClassNameList('')).toEqual([])
			expect(toClassNameList('string')).toEqual(['string'])
			expect(toClassNameList(['string', null, undefined, 1, 0])).toEqual(['string'])
		})
	})

	describe('toStyleSheet()', () => {
		test('toStyleSheet()', () => {
			expect(toStyleSheet({})).toEqual({})
			expect(toStyleSheet({ $: 'some string' })).toEqual({ $: ['some', 'string'] })
			// @ts-expect-error: Type 'number' is not assignable to type 'UnprocessedClassNameListValue | Iterable<UnprocessedClassNameListValue>'.
			expect(toStyleSheet({ $: 1 })).toEqual({ $: [] })
			expect(toStyleSheet({ $var: 1 })).toEqual({ $var: 1 })
			expect(toStyleSheet({ $var: 1, $gap: true })).toEqual({ $var: 1, $gap: true })
		})
	})

	describe('toFlatArrayOfClassNameValues()', () => {
		test('toFlatArrayOfClassNameValues()', () => {
			const f = () => undefined
			expect(toFlatArrayOfClassNameValues(['string', 'spaced string', null, 1, 2, undefined, f])).toEqual(['string', 'spaced', 'string', f])
		})
	})

	describe('filterResetClassNames()', () => {
		test('filterResetClassNames()', () => {
			expect(filterResetClassNames([
				'some',
				'class',
				'name',
				'*:null',
			], REMOVE_RESET_CLASS_NAME)).toEqual([])
		})
	})
})
