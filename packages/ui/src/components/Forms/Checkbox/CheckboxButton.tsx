import classNames from 'classnames'
import { useComponentClassName } from '../../../auxiliary'
import { toStateClass } from '../../../utils'
import { AllVisuallyDependententControlProps } from '../Types'
import { useInputClassName } from '../useInputClassName'

export interface CheckboxButtonProps extends AllVisuallyDependententControlProps {
  checked?: boolean
  indeterminate?: boolean
}

export const CheckboxButton = ({
  checked,
  indeterminate,
  ...props
}: CheckboxButtonProps) => {
  const componentClassName = useComponentClassName('checkbox-button')

  return <span
    className={classNames(
      componentClassName,
      toStateClass('checked', checked),
      toStateClass('indeterminate', indeterminate),
      useInputClassName(props),
    )}
    children={indeterminate
      ? <span aria-hidden="true" className={`${componentClassName}-questionmark`}>?</span>
      : undefined}
  />
}
