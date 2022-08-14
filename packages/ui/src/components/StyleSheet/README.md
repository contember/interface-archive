# StyleSheets

> ✨ Keep in mind this tool internal and experimental.

**[Contember](https://github.com/contember) UI uses semantic CSS classes in [Admin](https://github.com/contember/admin). As any system grows in complexity combining semantic classes to targe specific cases increases specificity and is harder to override to extend.**

To support complex UIs being easily overridden as well by users and by internal team too (and to keep our stack at minimum) we created this _**"merge class names tool"**_.

_**Features:**_

1. Support string class names (current and default state);
2. Support array of class names (without extra package, e.g. `classnames`);
3. Support for customization of component's internal state classes with `$variables` for simple use-cases or `$callback()` for more complex use-cases;
4. Support for nested stylesheet objects to target underlying sub-components and combinations of all of the above.


_**Table of contents:**_

- [1. StyleSheet anatomy](#1-stylesheet-anatomy)
- [2. Writing UI components](#2-writing-ui-components)
- [3. Understanding resolving](#3-understanding-resolving)
- [4. StyleSheet API](#4-api)
- [Appendix: React Hooks](#appendix-react-hooks)


---

## 1. StyleSheet anatomy

A stylesheet can be:

- [a single `string` or even `callback()` or an arrays of those](#11-base-stylesheet-types);
- [complex `StyleSheet` objects with `$variables`](#12-complex-stylesheet-type).

### 1.1 Base stylesheet types

| Type                                       | Description                                       | Example                                                                      |
| ------------------------------------------ | ------------------------------------------------- | ---------------------------------------------------------------------------- |
| `string`                                   | Space separated CSS classes string.               | `<span className="cui-spinner is-loading" />`                                |
| `StyleSheetValueResolver`                  | Callback that returns a value (or CSS class name) | `<span className={({ $loading }) => $loading ? 'is-loading' : undefined} />` |
| `Array<string \| StyleSheetValueResolver>` | Array of CSS classes or callbacks, even nested.   | `<span className={['cui-spinner', ['is-loading']]]} />`                      |

> **💡 TIP:** Use [`extendStyleSheet()`](#41-extendstylesheetstyles-style) function to combine various types of stylesheet types.

```ts
const styleSHeet = extendStyleSheet(
	// string:
	'cui-spinner',
	// array of strings:
	['font-bold', 'view-small'],
	// value resolver callback:
	({ $loading }) => $loading ? 'is-loading' : undefined,
	// ...
)
```

### 1.2 Complex stylesheet type

`StyleSheet` objects properties can furthermore [bare base stylesheet types for the component](#11-base-stylesheet-types), but also for it's [sub-components](#123-sub-component-properties) and carry [`$variables`](#122-variable-properties) of those sub-components.

| Property        | Description                                                                                        |
| --------------- | -------------------------------------------------------------------------------------------------- |
| `$`             | [Carries the value of the current component class name &rarr;](#121-special--property)             |
| `$[a-zA-Z0-9_]` | [Variables that carry scalar values or `StyleSheetValueResolver` &rarr;](#122-variable-properties) |
| `string`        | [Nested stylesheet object or base stylesheet type &rarr;](#123-sub-component-properties)           |


> **💡 TIP:**: Use [`createStyleSheet()`](#42-createstylesheetstyles-style) to convert any of these types to an object stylesheet. Don't write or use the `$` prop directly.

```ts
const styleSheet = createStyleSheet({
	// Variables:
	$gap: 1,
	$component: 'cui-box',
	// Plain string value for body sub-component:
	body: '$component-body',
	// Mixed string and sub-component values for header and its nested sub-component:
	header: extendStyleSheet(
		'$component-header',
		{
			heading: '$component-header-heading',
		},
	),
	// Mixed array values for the footer sub-component:
	footer: [
		'$component-footer',
		// This callback is replaceable with a simple string value 'gap:$gap'
		// That would resolve just the same way, but callback gives you more
		// customization power when desired:
		({ $gap }) => `gap:${$gap}`,
	],
})

```

### 1.2.1 Special `$` property

Special private key, a string representation of the root component; when stylesheet is being extended with `string`, `callback()` or `(string | StyleSheetValueResolver)[]`, values are being appended to this property.

Extending stylesheet with an object declaring the `$` property will drop previous value of `$` during the merge in all cases except for arrays. Arrays are always merged with previous values. This behavior is used to override component `className` when needed.

In most cases you might want to `import { CLASS_NAME_RESET } from '@contember/admin'` that will [handle the reset](#25-resetting-all-internal-class-names) for you in black-box fashion.

> **💬 Is the `CLASS_NAME_RESET` required to override component class name?**<br>
> _No, the UI components should not require `CLASS_NAME_RESET` to be overriden. However, it is there if needed._

_**Allowed values:**_

- `string`;
- `callback()` (`StyleSheetValueResolver` type);
- `(string | callback())[]`;
- `null` and `undefined` are being ignored.

> **IMPORTANT:** You might want to use `createStyleSheet()` of `extendStyleSheet()` instead of handcrafting stylesheet object your-self.
### 1.2.2 `$variable` properties

Keys starting with a `$` followed by a word character, e.g. `$gap` or `$size`. Variables object is passed to the `StyleSheetValueResolver` as the first argument. If the value is dependant on some unresolved value, the callback should return `undefined` to be resolved in the next pass.

_**Allowed values:**_

- `string`;
- `number`;
- `boolean`;
- `callback()` (`StyleSheetValueResolver` type);
- `null` or `undefined`

### 1.2.3 Sub-component properties

Representing sub-component style sheets consisting of simple [1.1 base stylesheet types](#11-base-stylesheet-types) or complex objects, see: [1.2.1](#121-special--property) and [1.2.2](#122-variable-properties).


## 2. Writing UI components

- [2.1 Default rendering](#21-default-rendering)
- [2.2 Extra string class name](#22-extra-string-class-name)
- [2.3 Override root and target sub-components](#23-override-root-and-target-sub-components)
- [2.4 Resetting internal and pass extra class names](#24-resetting-internal-and-pass-extra-class-names)
- [2.5 Resetting all internal class names](#25-resetting-all-internal-class-names)
- [2.6 Changing error class resolving](#26-changing-error-class-resolving)

**Example FieldContainer React component:**

```tsx
// file: FieldContainer.tsx
import { createStyleSheet, useResolveStyleSheet, PropsWithClassName } from '@contember/admin'

/**
 * Example FieldContainer React component
 */
type FieldContainerProps = PropsWithClassName<typeof fieldContainerStyleSheet> & {
	header?: ReactNode
	body?: ReactNode
	footer?: ReactNode
	errors?: Error[]
}

function FieldContainer({
	className: classNameProp,
	header,
	body,
	footer,
	errors,
}, FieldContainerProps) {
	const [className, styleSheet] = useResolveStyleSheet(
		fieldContainerStyleSheet,
		{ $error: !!errors?.length },
		classNameProp,
	)

	return (
		<div className={className}>
			<span className={styleSheet.header}>{header}</span>
			<span className={styleSheet.body}>{body}</span>
			<span className={styleSheet.footer}>{footer}</span>
		</div>
	)
}

const fieldContainerStyleSheet = createStyleSheet({
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
```

### 2.1 Default rendering

```tsx
<FieldContainer />
```
&darr;

```tsx
<div class="cui-field-container gap:1 no-error">
	<span class="cui-field-container-header">...</span>
	<span class="cui-field-container-body gap-size-2">...</span>
	<span class="cui-field-container-footer">...</span>
</div>
```

^ [Back](#2-example-of-ui-components-using-stylesheet)

### 2.2 Extra string class name

```tsx
<FieldContainer className="extra-class" />
```
&darr;

```tsx
<div class="cui-field-container gap:1 no-error extra-class">
	<span class="cui-field-container-header">...</span>
	<span class="cui-field-container-body gap-size-2">...</span>
	<span class="cui-field-container-footer">...</span>
</div>`
```

^ [Back](#2-example-of-ui-components-using-stylesheet)

### 2.3 Override root and target sub-components

```tsx
<FieldContainer className={createStyleSheet({
	$prefix: 'next-',
	body: { $prefix: 'cui-', $gap: 3 }
})} />
```
&darr;

```tsx
<div class="next-field-container gap:1 no-error">
	<span class="next-field-container-header">...</span>
	<span class="cui-field-container-body gap-size-3">...</span>
	<span class="next-field-container-footer">...</span>
</div>
```

^ [Back](#2-example-of-ui-components-using-stylesheet)

### 2.4 Resetting internal and pass extra class names

```tsx
import { CLASS_NAME_RESET, extendStyleSheet } from '@contember/admin'

<FieldContainer className={useExtendStyleSheet(CLASS_NAME_RESET, 'extra-class', {
	$prefix: 'next-',
	body: { $prefix: 'cui-', $gap: 3 }
})} />
```
&darr;

```tsx
<div class="extra-class">
	<span class="next-field-container-header">...</span>
	<span class="cui-field-container-body gap-size-3">...</span>
	<span class="next-field-container-footer">...</span>
</div>
```

^ [Back](#2-example-of-ui-components-using-stylesheet)

### 2.5 Resetting all internal class names

```tsx
import { CLASS_NAME_RESET, extendStyleSheet } from '@contember/admin'

<FieldContainer className={useExtendStyleSheet(CLASS_NAME_RESET, 'extra-class', {
	header: extendStyleSheet(CLASS_NAME_RESET, 'my-header'),
	body: extendStyleSheet(CLASS_NAME_RESET, 'my-body'),
	footer: extendStyleSheet(CLASS_NAME_RESET, 'my-footer'),
})} />
```
&darr;

```tsx
<div class="extra-class">
	<span class="my-header">...</span>
	<span class="my-body">...</span>
	<span class="my-footer">...</span>
</div>
```

^ [Back](#2-example-of-ui-components-using-stylesheet)

### 2.6 Changing error class resolving

```tsx
<FieldContainer
	errors={[ new Error('Please fill the input') ]}
	className={useCreateClassName({
		$errorClassName: ({ $error }) => $error ? 'text-red-500' : undefined,
	})}
/>
```
&darr;

```tsx
<div class="next-field-container gap:1 no-error">
	<span class="next-field-container-header">...</span>
	<span class="cui-field-container-body gap-size-3">...</span>
	<span class="next-field-container-footer">...</span>
</div>
```

^ [Back](#2-example-of-ui-components-using-stylesheet)

## 3. Understanding resolving

1. every `$variable` used in class name string gets replaced with a string representation, e.g.: when `{ '$variable': true }` then:
   2. `'var-is-$variable'` resolves as `'var-is-true'` className string;
   3. `({ $variable })=> $variable ? 'var-is-on' : 'var-is-off'` uses on-off instead of simple string case.
2. Class names are internally stored as arrays, later *enhanced* with `toString()` method during the `resolveStyleSheet()` call that joins all the classes into one space separated list. It is possible to pass styles where strings are expected but also keeps the underlying structure to be processed by another sub-component when needed.

> *Extending vs. Resolving styles:*
>
> - Use `extendStyleSheet()` when you need to merge your extra class name data forward with received class name data;
> - Use `resolveStyleSheet()` same as extend, but prepares the data to be used inside of the component.


```ts
import { createStyleSheet, extendStyleSheet } from '@contember/admin'

// Pass 1:  Create basic stylesheet
const baseClassName = createStyleSheet('$variableClassName', {
	$variable: undefined,
	$variableClassName: 'bar-$variable',
})

'' + resolveStyleSheet(baseClassName, { $variable: true })[0]).toBe('bar--true' // true
'' + resolveStyleSheet(baseClassName, { $variable: false })[0]).toBe('bar--false' // true
'' + resolveStyleSheet(baseClassName, { $variable: 123 })[0]).toBe('bar--123' // true
'' + resolveStyleSheet(baseClassName, { $variable: 'bar' })[0]).toBe('bar--bar' // true
'' + resolveStyleSheet(baseClassName, { $variable: null })[0]).toBe('' // true
'' + resolveStyleSheet(baseClassName, { $variable: undefined })[0]).toBe('' // true

// Pass 2: Change resolving of $variableClassName.
const overriddenClassName = extendStyleSheet(baseClassName, {
	$variableClassName: ({ $variable }) => $variable === null
		? 'no-foo' : $variable === undefined ? undefined
		: `foo--${$variable}`
});

// Pass 3: Extended with variable values and resolve in the same step.
// Same as calling `extendStyleSheet()` and `resolveStyleSheet()` in sequence.
'' + resolveStyleSheet(overriddenClassName, { $variable: true }) === 'foo--true'; // true
'' + resolveStyleSheet(overriddenClassName, { $variable: false }) === 'foo--false'; // true
'' + resolveStyleSheet(overriddenClassName, { $variable: 123 }) === 'foo--123'; // true
'' + resolveStyleSheet(overriddenClassName, { $variable: 'bar' }) === 'foo--bar'; // true
'' + resolveStyleSheet(overriddenClassName, { $variable: null }) === 'no-foo'; // true
'' + resolveStyleSheet(overriddenClassName, { $variable: undefined }) === ''; // true
```

## 4. StyleSheet API

`style` can be almost any unprocessed (or previously processed class name) value:
- `string`, e.g. `"some space separated class name list string"`
- `StyleSheetValueResolver`, e.g. `({ $margin }) => 'm-' + $margin`
- `(string | StyleSheetValueResolver)[]`, e.g. `["class", "names", "separated", "as", "words"]`
- `object`

Pass `CLASS_NAME_RESET` object to ignore any previous classNames, useful for overriding purposes.

**Methods:**

### 4.1 `extendStyleSheet(...styles[]: style`
- Reduces passed style sheets to single style;
- When passing parameter as:
	- `string` or `StyleSheetValueResolver` or `(string | StyleSheetValueResolver)[]` – value merged into `$` with its previous value into `(string | StyleSheetValueResolver)[]`
	- `object` — incoming properties replace previous, except arrays are merged, `undefined` are skipped.

---
### 4.2 `createStyleSheet(...styles[]): style`
- Uses `extendStyleSheet()` under the hood.

---
### 4.3 `resolveStyleSheet(...styles[]): style`
- Uses `extendStyleSheet()` under the hood.
- Resolves placeholders and variables of the root component and sub-components.
	- Adds `toString()` method to className arrays.

## Appendix: React Hooks

Always use memoized versions of API inside of the React functional components.

- `useExtendStyleSheet()`
- `useCreateStyleSheet()`
- `useResolveStyleSheet()`
