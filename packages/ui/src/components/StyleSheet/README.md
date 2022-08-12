# StyleSheets

## Why:

1. Allows targeting sub-component using single `className`;
2. Allows customization of generated `className` with variables and callbacks;
3. Allows total override of the component's (and its sub-components) `className` when needed.

## 1. `StyleSheet` anatomy

`StyleSheet` objects consist of 3 parts:

1. **\$** – special key, a string representation of the root component; when style sheet is being extended with `string` or `string[]`, values are appended to this property;
2. **\$variables** – keys start with a `$` followed by a word character, e.g. `$componentName`
3. other keys representing sub-component style sheets;

> ! Extending style sheet with an object declaring the `$` property will drop previous value (except for arrays which are always merged) of `$` during the merge. It is handy to totally override how the `className` will gets resolved.

## 2. Example of UI components using `StyleSheet`

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
<FieldContainer className={{
	$prefix: 'next-',
	body: { $prefix: 'cui-', $gap: 3 }
}} />
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

<FieldContainer className={extendStyleSheet(CLASS_NAME_RESET, 'extra-class', {
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

<FieldContainer className={extendStyleSheet(CLASS_NAME_RESET, 'extra-class', {
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
	className={{
		$errorClassName: ({ $error }) => $error ? 'text-red-500' : undefined,
	}}
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

## 3. Understanding how resolving of class names works

1. every `$variable` property then gets replaced with its value cast as string, e.g. when `{ '$variable': true }`, then `['var-is-$variable']` resolves as `'var-is-true'` className string;
2. Class names are *enhanced* with `toString()` – method that joins all the previous `$` class list values. So it's possible to pass styles where strings are expected but also keeping the underlying structure to be processed by another component.

> *Extending vs. Resolving styles:*
>
> - Use `extendStyleSheet()` when you need to merge your extra class name data forward with received class name data;
> - Use `resolveStyleSheet()` same as extend, but prepares the data to be used inside of the component.


```ts
import { createStyleSheet, extendStyleSheet } from '@contember/admin'

// Pass 1:  Create basic style sheet
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

## 4. API

`style` can be almost any unprocessed (or previously processed class name) value:
- `string`, e.g. `"some space separated class name string"`
- `string[]`, e.g. `["class", "names", "separated", "as", "words"]`
- `function(variables) => `
- `object`

Pass `CLASS_NAME_RESET` object to ignore any previous classNames, useful for overriding purposes.

**Methods:**

### 4.1 `extendStyleSheet(...styles[]: style`
- Reduces passed style sheets to single style;
- When passing parameter as:
	- `string` or `string[]` – value merged into `$` with its previous value into `string[]`
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

Memoized versions of API.

- `useExtendStyleSheet()`
- `useCreateStyleSheet()`
- `useResolveStyleSheet()`
