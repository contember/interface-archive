import { memo, ReactNode } from 'react'
import { useClassNamePrefix } from '../../../auxiliary'
import type { NativeProps, Size } from '../../../types'
import { toThemeClass } from '../../../utils'
import { Stack, StackProps } from '../../Stack'
import { ComponentStyleSheet, SubComponentsStyleSheet, useResolveStyleSheet } from '../../StyleSheet'
import { Description } from '../../Typography/Description'
import { Label } from '../../Typography/Label'
import { ErrorList, ErrorListProps } from '../ErrorList'
import type { FieldContainerLabelPosition } from './Types'

export interface FieldContainerProps extends ErrorListProps, Pick<NativeProps<HTMLDivElement>, 'className' | 'style'> {
	children: ReactNode // The actual field
	description?: ReactNode // Can explain e.g. the kinds of values to be filled
	direction?: StackProps['direction']
	gap?: Size | 'none'
	label: ReactNode
	labelDescription?: ReactNode // Expands on the label e.g. to provide the additional explanation
	labelPosition?: FieldContainerLabelPosition
	width?: 'column' | 'fluid' | 'none'
	required?: boolean
	size?: Size
	useLabelElement?: boolean
}

export const FieldContainer = memo(
	({
		children,
		className: classNameProp,
		description,
		direction = 'vertical',
		errors,
		gap = 'small',
		label,
		labelDescription,
		labelPosition,
		width = 'column',
		required,
		size,
		useLabelElement = true,
		style,
	}: FieldContainerProps) => {
		const LabelElement = useLabelElement ? 'label' : 'div'
		const isLabelInline = labelPosition === 'labelInlineLeft' || labelPosition === 'labelInlineRight'

		const [className, styleSheet] = useResolveStyleSheet(fieldContainerStyleSheet, {
			$prefix: useClassNamePrefix(),
			$name: 'field-container',
			$size: size,
			$labelPosition: labelPosition,
			$width: width,
			$dangerTheme: errors?.length ? toThemeClass(null, 'danger') : null,
		}, classNameProp)

		return (
			<div className={className} style={style}>
				<LabelElement className={styleSheet.label}>
					{(label || labelDescription) && <span className={styleSheet.header}>
						{label && <Label className={styleSheet.headerLabel}>
							{label}
							<span className={styleSheet.requiredAsterisk}>{required && '*'}</span>
						</Label>}
						{labelDescription && <Description>{labelDescription}</Description>}
					</span>
					}
					{(children || (!isLabelInline && description)) && <div className={styleSheet.body}>
						{children && <Stack
							className={styleSheet.bodyContent}
							direction={direction}
							gap={gap}
						>
							{children}
						</Stack>}
						{!isLabelInline && description && <span className={styleSheet.bodyContentDescription}>{description}</span>}
					</div>}
				</LabelElement>
				{isLabelInline && description && <span className={styleSheet.bodyContentDescription}>{description}</span>}

				{!!errors && errors.length > 0 && (
					<div className={styleSheet.errors}>
						<ErrorList errors={errors} />
					</div>
				)}
			</div>
		)
	},
)
FieldContainer.displayName = 'FieldContainer'

type SubComponents =
	| 'label'
	| 'header'
	| 'headerLabel'
	| 'requiredAsterisk'
	| 'body'
	| 'bodyContent'
	| 'bodyContentDescription'
	| 'errors'

type FieldContainerStyleSheet = ComponentStyleSheet<SubComponentsStyleSheet<SubComponents>> & Partial<{
	'${componentClassName}': string
	'${size}': string
	'${labelPosition}': string
	'${width}': string
	'$dangerTheme': string | null
	$prefix: string
	$name: string
	$direction: StackProps['direction']
	$gap: Size | 'none'
	$labelPosition: FieldContainerLabelPosition
	$required: boolean
	$size: Size
	$width: 'column' | 'fluid' | 'none'
}>

const fieldContainerStyleSheet: FieldContainerStyleSheet = {
	...{
		'${componentClassName}': '$prefix$name',
		'${size}': 'view-$size',
		'${labelPosition}': 'view-$labelPosition',
		'${width}': 'width-$width',
	},
	$direction: 'vertical',
	$gap: 'small',
	$width: 'column',
	$prefix: 'cui-',
	$name: 'field-container',
	$: [
		'${componentClassName}',
		'${size}',
		'${labelPosition}',
		'${width}',
		'$dangerTheme',
	],
	label: '${componentClassName}-label',
	header: '${componentClassName}-header',
	headerLabel: '${componentClassName}-header-label',
	requiredAsterisk: ['${componentClassName}-required-asterisk', toThemeClass('danger', 'danger')],
	body: '${componentClassName}-body',
	bodyContent: '${componentClassName}-body-content',
	bodyContentDescription: '${componentClassName}-body-content-description',
	errors: '${componentClassName}-errors',
}
