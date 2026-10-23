import type { ElementType, ReactNode } from 'react'
import { useInView } from '../../lib/useInView'

/** "Pour-in" reveal: content rises, then settles. */
export function Reveal({
  as: Tag = 'div',
  delay = 0,
  className = '',
  children,
}: {
  as?: ElementType
  delay?: number
  className?: string
  children: ReactNode
}) {
  const [ref, inView] = useInView<HTMLDivElement>('0px 0px -12% 0px', true)
  return (
    <Tag ref={ref} className={`pour-in ${inView ? 'is-in' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </Tag>
  )
}
