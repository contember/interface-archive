/* eslint-disable quote-props */
import { describe, expect, test } from 'vitest'
import { CLASS_NAME_RESET, ComponentStyleSheet, createStyleSheet, extendStyleSheet, ProcessedStyleSheetClassName, PropsWithClassName, resolveStyleSheet, ToStyleSheet } from '../../src'
import { deepMerge, excludeFromArray } from '../../src/components/StyleSheet/Helpers'
import { toClassNameList } from '../../src/components/StyleSheet/toClassNameList'
import { toStyleSheet } from '../../src/components/StyleSheet/toStyleSheet'

function shape(data: any): any {
  return JSON.parse(JSON.stringify(data))
}

describe('StyleSheet module', () => {
  test('resolveStyleSheet()', () => {
    expect(resolveStyleSheet('some class name', CLASS_NAME_RESET)).toEqual([undefined, {}])

    expect(shape(resolveStyleSheet(
      { '${a}': '$a', $a: 'var-a' },
      '${a} some class name',
      'extra-class mx-10',
      { header: 'some class' },
      { footer: CLASS_NAME_RESET },
    ))).toEqual([
      ['var-a', 'some', 'class', 'name', 'extra-class', 'mx-10'],
      {
        'header': {
          '$': ['some', 'class'],
        },
        'footer': {
          '$': null,
        },
      },
    ])

    expect(shape(resolveStyleSheet(
      { '${a}': '$a', $a: 'var-a' },
      '${a} some class name',
      CLASS_NAME_RESET,
      'new-class mx-10 ',
    ))).toEqual([['new-class', 'mx-10'], {}])
  })

  test('resolveStyleSheet(): README example to string render', () => {
    const created = createStyleSheet({ '$': '${template}', '${template}': 'foo--$variable' })
    const base = extendStyleSheet('${template}', { '${template}': 'foo--$variable' })
    //    ^?

    expect(base).toEqual(created)

    expect('' + resolveStyleSheet(base, { $variable: true })[0]).toBe('foo--true')
    expect('' + resolveStyleSheet(base, { $variable: false })[0]).toBe('foo--false')
    expect('' + resolveStyleSheet(base, { $variable: 123 })[0]).toBe('foo--123')
    expect('' + resolveStyleSheet(base, { $variable: 'bar' })[0]).toBe('foo--bar')
    expect('' + resolveStyleSheet(base, { $variable: null })[0]).toBe('')
    expect('' + resolveStyleSheet(base, { $variable: undefined })[0]).toBe('')
  })

  test('resolveStyleSheet(): Targetting sub-components README example to string render', () => {
    const styleSheet = createStyleSheet('${componentName}', {
      // Templates:
      '${componentName}': '$prefix-$componentName',
      // Variables:
      $prefix: 'cui',
      $componentName: 'box',
      // sub-components:
      body: {
        // Templates:
        '${gap}': 'gap-size-$gap',
        // Variables:
        $gap: 2,
        // ClassName:
        $: '${componentName}-body ${gap}',
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

  test('resolveStyleSheet(): README example to string render', () => {
    const fieldContainerStyleSheet = createStyleSheet({
      // Placeholder:Template
      '${gap}': 'gap:$gap',
      '${&}': '$prefix$root',
      // Prop:Value
      $gap: 2,
      $prefix: 'cui-',
      $root: 'field-container',
      // className
      $: '${&} ${gap}',
      // Sub-component/elements style sheets:
      header: '${&}-header',
      body: '${&}-body',
      footer: '${&}-footer',
    })

    // Resolve inside of the component
    const classNameProp = 'extra-class'
    const [className, styleSheet] = resolveStyleSheet(fieldContainerStyleSheet, classNameProp)

    expect(`<div class="${className}">
  <span class="${styleSheet.header}">...</span>
  <span class="${styleSheet.body}">...</span>
  <span class="${styleSheet.footer}">...</span>
</div>`).toBe(`<div class="cui-field-container gap:2 extra-class">
  <span class="cui-field-container-header">...</span>
  <span class="cui-field-container-body">...</span>
  <span class="cui-field-container-footer">...</span>
</div>`)
  })

  test('resolveStyleSheet(): to string render with reset', () => {
    const [className, ext] = resolveStyleSheet(
      'base',
      CLASS_NAME_RESET,
      { $: 'next-base' },
      'mx-10',
      { $: [''], a: 1, c: null },
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
      '${gap}': 'gap:$gap',
      '${error}': 'error:$error',
      '${root}': '$prefix$root',
      '$': '${root} $someOne $some $some-one ${gap} $someTwo'.split(' ').filter(Boolean),
      'body': {
        $: '${root}-body ${error} ${gap}'.split(' ').filter(Boolean),
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
      '${gap}': 'g-$gap',
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
    type FieldContainerStyleSheet = ComponentStyleSheet<never> & {
      '${&}'?: string
      $gap?: number | null
      $prefix?: string,
      $root?: string,
    }

    const fieldContainerStyleSheet: FieldContainerStyleSheet = {
      ...{
        '${&}': '$prefix$root',
        '${gap}': 'gap:$gap',
      },
      $: '${&} ${gap}',
      $prefix: 'cui-',
      $root: 'field-container',
      $gap: 0,
    }

    function FieldContainer({ className: _className }: PropsWithClassName<FieldContainerStyleSheet> = {}) {
      const [className, styleSheet] = resolveStyleSheet(fieldContainerStyleSheet, _className)

      return `<div class="${className}">{children}</div>`
    }

    type BoxStyleSheet = {
      '${&}'?: string
      $?: string,
      $prefix?: string,
      $root?: string,
      fieldContainer?: FieldContainerStyleSheet
    }
    const boxStyleSheet: BoxStyleSheet = {
      ...{
        '${&}': '$prefix$root',
      },
      $: '${&}',
      $prefix: 'cui-',
      $root: 'box',
      fieldContainer: { $gap: 1 },
    }

    function Box({ className: _className }: PropsWithClassName<BoxStyleSheet> = {}) {
      const [className, styleSheet] = resolveStyleSheet(boxStyleSheet, _className)

      expect(deepMerge(
        { 'fieldContainer': { $gap: 1 } },
        { 'fieldContainer': { $: null } }),
      ).toEqual({
        fieldContainer: { $gap: 1, $: null },
      })

      return `<div class="${className}">${FieldContainer({ className: styleSheet?.fieldContainer })}</div>`
    }

    expect(Box({
      className: {
        $prefix: 'old-cui-',
        fieldContainer: { $gap: 2 },
      },
    })).toBe('<div class="old-cui-box"><div class="cui-field-container gap:2">{children}</div></div>')

    const repeaterStyleSheet = {
      ...{
        '${&}': '$prefix$name',
      },
      $prefix: 'cui-',
      $name: 'repeater',
      $: '${&}',
      box: [],
    }

    function Repeater({ className: _className }: PropsWithClassName = {}) {
      const [className, stylesheet] = resolveStyleSheet(repeaterStyleSheet, _className)

      return Box({ className: extendStyleSheet(className, stylesheet.box) })
    }

    expect(Repeater()).toBe('<div class="cui-box cui-repeater"><div class="cui-field-container gap:1">{children}</div></div>')
    expect(Repeater({ className: CLASS_NAME_RESET })).toBe('<div class="cui-box"><div class="cui-field-container gap:1">{children}</div></div>')
    expect(Repeater({ className: extendStyleSheet(CLASS_NAME_RESET, { box: CLASS_NAME_RESET }) })).toBe('<div class="undefined"><div class="cui-field-container gap:1">{children}</div></div>')
    expect(Repeater({ className: extendStyleSheet(CLASS_NAME_RESET, { box: extendStyleSheet(CLASS_NAME_RESET, { fieldContainer: CLASS_NAME_RESET }) }) })).toBe('<div class="undefined"><div class="undefined">{children}</div></div>')
  })

  test('extendStyleSheet(): Typescript', () => {
    expect(extendStyleSheet('one', 'two')).toEqual({ $: ['one', 'two'] })
    const extendedStyleSheet1: { $: ProcessedStyleSheetClassName } = extendStyleSheet('one', 'two')
    expect(extendStyleSheet('one', '')).toEqual({ $: ['one'] })
    const extendedStyleSheet2: { $: ProcessedStyleSheetClassName } = extendStyleSheet('one', '')
    expect(extendStyleSheet('one', null)).toEqual({ $: ['one'] })
    const extendedStyleSheet3: { $: ProcessedStyleSheetClassName } = extendStyleSheet('one', null)
    expect(extendStyleSheet('one', { header: 'some' })).toEqual({ $: ['one'], header: { $: ['some'] } })
    const extendedStyleSheet4: { $: ProcessedStyleSheetClassName; header: { $: ProcessedStyleSheetClassName } } = extendStyleSheet('one', { header: 'some' })
    expect(extendStyleSheet('one', { header: { headerLabel: 'some' } })).toEqual({ '$': ['one'], 'header': { 'headerLabel': { '$': ['some'] } } })
    const extendedStyleSheet5: { $: ProcessedStyleSheetClassName; header: { headerLabel: { $: ProcessedStyleSheetClassName } } } = extendStyleSheet('one', { header: { headerLabel: 'some' } })

    extendedStyleSheet5
    // ^?
    extendedStyleSheet5.header
    //                  ^?
    extendedStyleSheet5.header.headerLabel
    //                         ^?
    extendedStyleSheet5.header.headerLabel.$
    //                                     ^?
  })

  test('extendStyleSheet: empty', () => {
    expect(extendStyleSheet()).toEqual(undefined)
    expect(extendStyleSheet('')).toEqual({ $: [] })
    expect(extendStyleSheet(null)).toEqual(undefined)
    expect(extendStyleSheet(undefined)).toEqual(undefined)
    expect(extendStyleSheet(false)).toEqual(undefined)
    expect(extendStyleSheet(true)).toEqual(undefined)
    expect(extendStyleSheet(0)).toEqual(undefined)
    expect(extendStyleSheet(999)).toEqual(undefined)
  })

  test('extendStyleSheet: string & string[]', () => {
    expect(extendStyleSheet('lorem ipsum dolor sit amet')).toEqual({ $: ['lorem', 'ipsum', 'dolor', 'sit', 'amet'] })
    expect(extendStyleSheet(['lorem', 'ipsum', 'dolor', 'sit', 'amet'])).toEqual({ $: ['lorem', 'ipsum', 'dolor', 'sit', 'amet'] })
    expect(extendStyleSheet('lorem ipsum', null, 'dolor sit amet')).toEqual({ $: ['lorem', 'ipsum', 'dolor', 'sit', 'amet'] })
    expect(extendStyleSheet('lorem ipsum', ['dolor', 'sit', 'amet'])).toEqual({ $: ['lorem', 'ipsum', 'dolor', 'sit', 'amet'] })
    expect(extendStyleSheet(['lorem', 'ipsum'], 'dolor', ['sit', 'amet'])).toEqual({ $: ['lorem', 'ipsum', 'dolor', 'sit', 'amet'] })
  })

  test('extendStyleSheet: reset', () => {
    expect(extendStyleSheet(['lorem', 'ipsum'], 'dolor', ['sit', 'amet'], CLASS_NAME_RESET)).toEqual(CLASS_NAME_RESET)
    expect(extendStyleSheet(['lorem', 'ipsum'], 'dolor', ['sit', 'amet'], CLASS_NAME_RESET, 'new start')).toEqual({ $: ['new', 'start'] })
    expect(extendStyleSheet(['lorem', 'ipsum'], 'dolor', ['sit', 'amet'], CLASS_NAME_RESET, ['next-${&}', 'new start'])).toEqual({ $: ['next-${&}', 'new', 'start'] })

    expect(
      extendStyleSheet(CLASS_NAME_RESET, { fieldContainer: CLASS_NAME_RESET }),
    ).toEqual(
      { $: null, fieldContainer: { $: null } },
    )
  })

  test('extendStyleSheet: mixed', () => {
    const varStyleSheet = createStyleSheet('${template} ${unusedVarTemplate}', {
      '${unusedVarTemplate}': '$unusedVar',
      '${template}': 'foo--$value',
      $value: 2,
    })

    expect(extendStyleSheet(varStyleSheet)).toEqual({
      '$': [
        '${template}',
        '${unusedVarTemplate}',
      ],
      $value: 2,
      '${template}': 'foo--$value',
      '${unusedVarTemplate}': '$unusedVar',
    })

    expect(extendStyleSheet(varStyleSheet, {
      $value: 1,
    })).toEqual({
      '$': [
        '${template}',
        '${unusedVarTemplate}',
      ],
      $value: 1,
      '${template}': 'foo--$value',
      '${unusedVarTemplate}': '$unusedVar',
    })
  })

  test('extendStyleSheet: skip undefined values', () => {
    expect(extendStyleSheet({ $var: 1 }, { $var: undefined })).toEqual({ $var: 1 })
  })

  test('extendStyleSheet: null-ify with values', () => {
    expect(extendStyleSheet({ $var: 1 }, { $var: null })).toEqual({ $var: null })
  })

  test('toStyleSheet()', () => {
    expect(toStyleSheet(null)).toEqual(undefined)
    const expectType1: ToStyleSheet<null> = undefined
    expect(toStyleSheet(1)).toEqual(undefined)
    const expectType2: ToStyleSheet<1> = undefined
    expect(toStyleSheet(undefined)).toEqual(undefined)
    const expectType3: ToStyleSheet<undefined> = undefined
    expect(toStyleSheet('mx-10 p-20')).toEqual({ $: ['mx-10', 'p-20'] })
    const expectType4: ToStyleSheet<'mx-10 p-20'> = { $: ['mx-10', 'p-20'] }
    // @ts-expect-error: Type 'boolean' is not assignable to type 'string'.
    expect(toStyleSheet(['mx-10', 1, null, undefined, false, 'p-20'])).toEqual({ $: ['mx-10', 'p-20'] })
    const expectType5: ToStyleSheet<['mx-10', 1, null, undefined, false, 'p-20']> = { $: ['mx-10', 'p-20'] }
    expect(toStyleSheet(['mx-10', '', null, undefined, 'p-20'])).toEqual({ $: ['mx-10', 'p-20'] })
    const expectType6: ToStyleSheet<['mx-10', '', null, undefined, 'p-20']> = { $: ['mx-10', 'p-20'] }
    expect(toStyleSheet({ header: 'mx-10 p-20' })).toEqual({ header: { $: ['mx-10', 'p-20'] } })
    const expectType7: ToStyleSheet<{ header: 'mx-10 p-20' }> = { header: { $: ['mx-10', 'p-20'] } }
    expect(toStyleSheet(CLASS_NAME_RESET)).toEqual(CLASS_NAME_RESET)
    const expectType8: ToStyleSheet<typeof CLASS_NAME_RESET> = CLASS_NAME_RESET
    expect(toStyleSheet({ $: 'string' })).toEqual({ $: ['string'] })
    const expectType9: ToStyleSheet<{ $: 'string' }> = { $: ['string'] }
    expect(toStyleSheet({ $: 1 })).toEqual({ $: [] })
    const expectType10: ToStyleSheet<{ $: 1 }> = { $: [] }
    expect(toStyleSheet({ $: true })).toEqual({ $: [] })
    const expectType11: ToStyleSheet<{ $: true }> = { $: [] }
    expect(toStyleSheet({ $: false })).toEqual({ $: [] })
    const expectType12: ToStyleSheet<{ $: false }> = { $: [] }
    expect(toStyleSheet({ $: undefined })).toEqual({ $: [] })
    const expectType13: ToStyleSheet<{ $: undefined }> = { $: [] }
    expect(toStyleSheet({ $a: 1 })).toEqual({ $a: 1 })
    const expectType14: ToStyleSheet<{ $a: 1 }> = { $a: 1 }
    expect(toStyleSheet({ $a: null })).toEqual({ $a: null })
    const expectType15: ToStyleSheet<{ $a: null }> = { $a: null }
    expect(toStyleSheet({ $a: undefined })).toEqual({ a: undefined })
    const expectType16: ToStyleSheet<{ $a: undefined }> = { $a: undefined }

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
    expect(deepMerge(CLASS_NAME_RESET, { $: [] })).toEqual({ $: [] })
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
      expect(() => toClassNameList(null)).toThrowError(`'null' should be kept intact`)
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
      expect(toStyleSheet({ $: 1 })).toEqual({ $: [] })
      expect(toStyleSheet({ $var: 1 })).toEqual({ $var: 1 })
      expect(toStyleSheet({ $var: 1, $gap: true })).toEqual({ $var: 1, $gap: true })
    })
  })
})
