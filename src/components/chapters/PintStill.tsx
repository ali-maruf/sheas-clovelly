import { SHAMROCK_LEAF_PATH } from '../ui/Shamrock'

/** Baked still of the finished pint: the poster, and the reduced-motion / low-power fallback. */
export function PintStill({ className = '' }: { className?: string }) {
  const glass = 'M62 380 L58 300 L52 200 C48 150 40 110 38 70 L40 40 L160 40 L162 70 C160 110 152 150 148 200 L142 300 L138 380 Z'
  return (
    <svg viewBox="0 0 200 420" className={className} role="img" aria-label="A freshly poured pint of stout with a shamrock drawn in the cream head">
      <defs>
        <linearGradient id="ps-body" x1="0" x2="1">
          <stop offset="0" stopColor="#3a120b" />
          <stop offset="0.25" stopColor="#140a06" />
          <stop offset="0.75" stopColor="#120806" />
          <stop offset="1" stopColor="#4a170e" />
        </linearGradient>
        <linearGradient id="ps-head" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fbf3e0" />
          <stop offset="1" stopColor="#e6d4ad" />
        </linearGradient>
        <linearGradient id="ps-shine" x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.5" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <clipPath id="ps-clip">
          <path d={glass} />
        </clipPath>
        <radialGradient id="ps-glow" cx="0.5" cy="0.6" r="0.6">
          <stop offset="0" stopColor="#C9A45C" stopOpacity="0.28" />
          <stop offset="1" stopColor="#C9A45C" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="100" cy="230" rx="110" ry="190" fill="url(#ps-glow)" />
      <g clipPath="url(#ps-clip)">
        <rect x="0" y="40" width="200" height="360" fill="url(#ps-body)" />
        <rect x="0" y="40" width="200" height="34" fill="url(#ps-head)" />
        <rect x="0" y="72" width="200" height="4" fill="#d9c49a" opacity="0.6" />
      </g>
      <ellipse cx="100" cy="42" rx="60" ry="9" fill="#f6ecd4" />
      <g transform="translate(100 42) scale(0.38 0.12) translate(-32 -31)" fill="#a8835a" opacity="0.85">
        <path d={SHAMROCK_LEAF_PATH} />
        <path d={SHAMROCK_LEAF_PATH} transform="rotate(115 32 31)" />
        <path d={SHAMROCK_LEAF_PATH} transform="rotate(-115 32 31)" />
      </g>
      <path d={glass} fill="none" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="1.5" />
      <path d="M48 80 C50 140 56 200 62 300" stroke="url(#ps-shine)" strokeWidth="5" strokeLinecap="round" opacity="0.7" />
      <path d="M150 90 C148 140 144 200 140 290" stroke="#fff" strokeOpacity="0.12" strokeWidth="2" />
      <rect x="20" y="380" width="160" height="6" rx="3" fill="#C9A45C" opacity="0.6" />
    </svg>
  )
}
