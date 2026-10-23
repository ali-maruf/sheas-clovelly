const LEAF = 'M32 30c-3-6-14-8-14-17 0-5 4-8 8-8 3 0 5 2 6 4 1-2 3-4 6-4 4 0 8 3 8 8 0 9-11 11-14 17z'

/** Small shamrock used as the section seal. Decorative. */
export function Shamrock({ size = 22, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" className={className}>
      <g fill="currentColor">
        <path d={LEAF} />
        <path d={LEAF} transform="rotate(115 32 31)" />
        <path d={LEAF} transform="rotate(-115 32 31)" />
      </g>
      <path d="M33 34c2 8 4 14 10 22" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  )
}

/** Brass hairline – shamrock – brass hairline. */
export function SectionSeal({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-4 text-brass-500 ${className}`} aria-hidden="true">
      <span className="hairline w-14" />
      <Shamrock size={18} />
      <span className="hairline w-14" />
    </div>
  )
}

export { LEAF as SHAMROCK_LEAF_PATH }
