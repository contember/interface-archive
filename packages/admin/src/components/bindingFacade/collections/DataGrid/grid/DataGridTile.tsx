import { Component, Field, useEntity } from '@contember/binding'
import { Card, CardProps } from '@contember/ui'
import { CheckboxButtonProps } from '@contember/ui/src/components/Forms/Checkbox/CheckboxButton'
import { ComponentType, FunctionComponent, useMemo } from 'react'
import { Link, LinkProps } from '../../../../../routing'

export interface DataGridTileProps extends
  Omit<CardProps<HTMLDivElement | HTMLAnchorElement>, 'src' | 'title' | 'href' | 'active' | 'onClick'>,
  Partial<Omit<CheckboxButtonProps, 'active' | 'type'>>,
  Partial<Pick<LinkProps, 'to'>> {
    checked?: boolean
    thumbnailField?: string
    titleField?: string
    CardComponent?: ComponentType<CardProps<HTMLDivElement | HTMLAnchorElement>>
  }

export const DataGridTile:FunctionComponent<DataGridTileProps> = Component(({
  checked,
  thumbnailField,
  titleField,
  CardComponent = Card,
  to,
  ...props
}) => {
  const entityAccessor = useEntity()

  const src = thumbnailField ? entityAccessor.getField(thumbnailField).value : null
  const title = titleField ? entityAccessor.getField(titleField).value : null

  const cardProps = useMemo(() => ({
    ...props,
    src: src as string,
    children: title,
  }), [props, src, title])

  return to
    ? <Link
      to={to}
      Component={CardComponent as ComponentType<CardProps<HTMLAnchorElement>>}
      {...cardProps}
    />
    : <CardComponent {...cardProps} />
}, ({
  checked,
  thumbnailField,
  titleField,
  CardComponent = Card,
  to,
  ...props
}) => {
  console.log({ thumbnailField })
return <>
    {thumbnailField && <Field field={thumbnailField} />}
    {titleField && <Field field={titleField} />}
  </>
},
)
DataGridTile.displayName = 'DataGridTile'
