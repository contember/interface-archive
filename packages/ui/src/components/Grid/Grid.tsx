import classNames from 'classnames'
import { CSSProperties, forwardRef, memo, useLayoutEffect, useMemo, useState } from 'react'
import { useComponentClassName } from '../../auxiliary'
import { NativeProps } from '../../types'
import { useFallbackRef } from '../../utils/useFallbackRef'

export interface GridOwnProps {
  columnWidth: number
  itemsCount?: number | null
}

function columns(width: number, columnWidth: number, itemsCount?: number | null) {
  const columns = Math.floor(width / columnWidth)

  if (!itemsCount) {
    return columns
  }

  if (itemsCount < 0) {
    throw new Error('Total count must be a non-negative number')
  }

  if (itemsCount % columns === 0) {
    return columns
  }

  let offset = 1

  while (columns + offset < itemsCount) {
    if (itemsCount % (columns + offset) === 0) {
      return columns + offset
    }

    offset += 1
  }

  return itemsCount
}

export interface GridProps extends GridOwnProps, NativeProps<HTMLDivElement> {}

export const Grid = memo(
  forwardRef<HTMLDivElement, GridProps>(
    ({
      className,
      columnWidth,
      itemsCount,
      children,
      ...rest
    }: GridProps, forwardedRef) => {
      if (columnWidth < 0) {
        throw new Error('Column width must be a non-negative number larger than 0')
      }

      const ref = useFallbackRef(forwardedRef)

      const componentClassName = useComponentClassName('grid')
      const [width, setWidth] = useState(0)

      const style: CSSProperties | undefined = useMemo(() => width && columnWidth ? ({
        ['--cui-grid-columns' as any]: columns(width, columnWidth, itemsCount),
      }) : undefined, [columnWidth, itemsCount, width])

      useLayoutEffect(() => {
        if (typeof ref !== 'object' || !ref.current) {
          return
        }

        const element = ref.current

        function updateWidthCallback() {
          setWidth(element.offsetWidth)
        }

        updateWidthCallback()
        window.addEventListener('resize', updateWidthCallback, { passive: true })

        return () => {
          window.removeEventListener('resize', updateWidthCallback)
        }
      }, [ref])

      return <div
        ref={ref}
        className={classNames(
          componentClassName,
          className,
        )}
        style={style}
      >
        {width > 0 && children}
      </div>
    },
  ),
)
