import classNames from 'classnames'
import { AnchorHTMLAttributes, MouseEvent, ReactNode } from 'react'
import { useComponentClassName } from '../../auxiliary'
import { toEnumViewClass, toFeatureClass } from '../../utils'
import { VisuallyDependentControlProps } from '../Forms'
import { useInputClassName } from '../Forms/useInputClassName'
import { Label } from '../Typography'

type LinkCompatibleProps<E extends HTMLDivElement | HTMLAnchorElement> = E extends HTMLDivElement
  ? {
    href?: string
    active?: boolean
    onClick?: (e?: MouseEvent<HTMLDivElement>) => void
  }
  : Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
    href: string
    active: boolean
    onClick: (e?: MouseEvent<HTMLAnchorElement>) => void
  }

export type CardProps<E extends HTMLDivElement | HTMLAnchorElement> =
  Omit<VisuallyDependentControlProps, 'active' | 'type'> &
  LinkCompatibleProps<E> & {
    onRemove?: () => void
    onEdit?: () => void
    src?: string | null
    children?: ReactNode
    layout?: 'label-below' | 'label-inside'
  }

export const Card = <E extends HTMLDivElement | HTMLAnchorElement>({
  children,
  href,
  layout = 'label-below',
  onClick,
  src,
  ...props
}: CardProps<E>) => {
  const componentClassName = useComponentClassName('card')
  const isLink = onClick || href
  const Container = isLink ? 'a' : 'div'

  return <Container
    onClick={onClick as any}
    href={href}
    className={classNames(
      componentClassName,
      toEnumViewClass(layout),
      (isLink
        ? ['hover', 'press', 'focus']
        : undefined
      )?.map(feature => toFeatureClass(feature, true)),
      useInputClassName(props as VisuallyDependentControlProps),
    )}
  >
    <div className={`${componentClassName}-inner`}>
      <div
        className={`${componentClassName}-thumbnail`}
        style={{ backgroundImage: src ? `url(${src})` : undefined }}
      />
      <div className={`${componentClassName}-content`}>
        <Label>{children}</Label>
      </div>
    </div>
  </Container>
}
