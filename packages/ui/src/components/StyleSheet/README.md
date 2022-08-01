# StyleSheets

## Why:

1. Allows targeting sub-component using single `className`;
2. Allows customization of `className` parts with placeholders/templates and variables;
3. Allows total override of the component's (and its sub-components) `className` when needed.

## 1. `StyleSheet` anatomy

`StyleSheet` objects consist of 4 parts:

1. **\${placeholders}** – keys similar to [template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)
2. **\$variables** – keys start with a `$` followed by a word character, e.g. `$componentName`
3. **\$** – special key, a string representation of the root component; when style sheet is being extended with `string` or `string[]`, values are appended to this property;
4. other keys representing sub-component style sheets;

> ! Extending style sheet with an object declaring the `$` property will drop previous value of `$` during the merge and is handy to totally override how the `className` will gets resolved.

## 2. Example of UI components using `StyleSheet`

- [2.1 Default rendering](#21-default-rendering)
- [2.2 Extra string class name](#22-extra-string-class-name)
- [2.3 Override root and target sub-components](#23-override-root-and-target-sub-components)
- [2.4 Resetting internal and pass extra class names](#24-resetting-internal-and-pass-extra-class-names)
- [2.5 Resetting all internal class names](#25-resetting-all-internal-class-names)

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
}

function FieldContainer({
	className: classNameProp,
	header,
	body,
	footer,
}, FieldContainerProps) {
	const [className, styleSheet] = useResolveStyleSheet(
		fieldContainerStyleSheet,
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
	// [Placeholder]: Template pairs
	'${gap}': 'gap:$gap',
	'${&}': '$prefix$root',
	// Root [Variables]: Value pairs
	$gap: 1,
	$prefix: 'cui-',
	$root: 'field-container',
	// List of component class names
	$: '${&} ${gap}',
	// Sub-component class names:
	header: '${&}-header',
	body: {
		// ClassName:
		$: '${&}-body ${gap}',
		// Sub-component override of the root template:
		'${gap}': 'gap-size-$gap',
		// Sub-component override of the root variable:
		$gap: 2,
	},
	footer: '${&}-footer',
 })
```

### 2.1 Default rendering

```tsx
<FieldContainer />
```
&#8286;

```tsx
<div class="cui-field-container gap:2">
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
&#8286;

```tsx
<div class="cui-field-container gap:2 extra-class">
	<span class="cui-field-container-header">...</span>
	<span class="cui-field-container-body gap-size-2">...</span>
	<span class="cui-field-container-footer">...</span>
</div>
```

^ [Back](#2-example-of-ui-components-using-stylesheet)

### 2.3 Override root and target sub-components

```tsx
<FieldContainer className={{
	$prefix: 'next-',
	body: { $prefix: 'cui-', $gap: 3 }
}} />
```
&#8286;

```tsx
<div class="next-field-container gap:2">
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
&#8286;

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
&#8286;

```tsx
<div class="extra-class">
	<span class="my-header">...</span>
	<span class="my-body">...</span>
	<span class="my-footer">...</span>
</div>
```

^ [Back](#2-example-of-ui-components-using-stylesheet)

## 3. Understanding how resolving of class names works

1. each `'${placeholder}'` property gets replaced with its assigned representation, e.g. when `{ '${placeholder}': 'var-is-$variable' }` resolves as `'var-is-$variable'`;
2. every `$variable` property then gets replaced with its value cast as string, e.g. when `{ '$variable': true }` resolves as `'var-is-true'`;
3. object is *enhanced* with `toString()` method that joins all the previous `$` class list values.

> *Extending vs. Resolving styles:*
>
> - Use `extendStyleSheet()` when you need to pass extra class names forward with received class names;
> - Use `resolveStyleSheet()` when you want to extend and resolve placeholders and variables.


```ts
import { createStyleSheet, extendStyleSheet } from '@contember/admin'

// Pass 1:  Create basic className
const classNamePass1 = createcreateStyleSheet('${template}')

// Pass 2: Add placeholder:template definition:
// Same as calling `createStyleSheet()` with two parameters.
const classNamePass2 = extendStyleSheet(classNamePass1, { '${template}': 'foo--$variable' });
//    ^ { $: ProcessedStyleSheetClassName; "${template}": string; }
//    ^ createStyleSheet({ '$': '${template}', '${template}': 'foo--$variable' })

// Pass 3: Extended with variable values and resolve in the same step.
// Same as calling `extendStyleSheet()` and `esolveStyleSheet()` in sequence.
'' + resolveStyleSheet(className, { $variable: true }) === 'foo--true'; // true
'' + resolveStyleSheet(className, { $variable: false }) === 'foo--false'; // true
'' + resolveStyleSheet(className, { $variable: 123 }) === 'foo--123'; // true
'' + resolveStyleSheet(className, { $variable: 'bar' }) === 'foo--bar'; // true
'' + resolveStyleSheet(className, { $variable: null }) === ''; // true
'' + resolveStyleSheet(className, { $variable: undefined }) === ''; // true
```

## 4. API

`style` can be almost any unprocessed (or previously processed class name) value:
- `string`, e.g. `"some space separated class name string"`
- `string[]`, e.g. `["class", "names", "separated", "as", "words"]`
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
