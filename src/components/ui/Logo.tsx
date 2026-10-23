import { useState } from 'react'

type Props = { width: number; height: number; className?: string; priority?: boolean }

/**
 * The ORIGINAL Shea's logo (white script with S flourish and shamrock).
 * Rendered as-is: no recolouring, filters or redrawing. Dark backgrounds only.
 * Box is fixed-size with object-fit: contain so there is no layout shift.
 */
export function Logo({ width, height, className = '', priority = false }: Props) {
  const [missing, setMissing] = useState(false)
  if (missing) {
    // Neutral text fallback until /assets/logo-sheas.png is supplied. Deliberately not a script face.
    return (
      <span
        className={`inline-flex items-center justify-center text-[0.8rem] font-semibold uppercase tracking-[0.3em] text-cream-50 ${className}`}
        style={{ width, height }}
      >
        Shea&rsquo;s
      </span>
    )
  }
  return (
    <img
      src="/assets/logo-sheas.png"
      alt="Shea's"
      width={width}
      height={height}
      className={className}
      style={{ width, height, objectFit: 'contain' }}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
      onError={() => setMissing(true)}
    />
  )
}
