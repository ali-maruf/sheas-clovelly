import { useRef } from 'react'
import { Reveal } from '../ui/Reveal'
import { SectionSeal } from '../ui/Shamrock'
import { useScrollProgress } from '../../lib/scroll'
import { useMotionMode } from '../../lib/motion'
import business from '../../data/business.json'

/** Chapter 7. A small warm moment: the loaf breaks open as you scroll. */
export function FreshLoaf() {
  const mode = useMotionMode()
  const section = useRef<HTMLElement>(null)
  const left = useRef<SVGGElement>(null)
  const right = useRef<SVGGElement>(null)
  const steam = useRef<SVGGElement>(null)

  useScrollProgress(
    section,
    (p) => {
      const t = mode === 'still' ? 1 : Math.min(1, Math.max(0, (p - 0.25) / 0.35))
      const e = 1 - Math.pow(1 - t, 3)
      left.current?.setAttribute('transform', `translate(${-e * 34} ${e * 4}) rotate(${-e * 9} 200 190)`)
      right.current?.setAttribute('transform', `translate(${e * 34} ${e * 4}) rotate(${e * 9} 200 190)`)
      if (steam.current) steam.current.style.opacity = String(e)
    },
    'top bottom',
    'bottom top',
  )

  const crust = 'M60 190 C60 120 130 90 200 90 C270 90 340 120 340 190 C340 220 300 230 200 230 C100 230 60 220 60 190 Z'
  return (
    <section
      ref={section}
      id="fresh-loaf"
      data-section="loaf"
      className="on-light celtic overflow-hidden py-24 text-stout-900 md:py-32"
      style={{ background: 'linear-gradient(180deg, #f6f0e1, #efe3c8)' }}
      aria-labelledby="loaf-title"
    >
      <div className="mx-auto grid max-w-[1300px] items-center gap-12 px-5 md:grid-cols-[1.1fr_1fr] md:px-10">
        <div className="order-2 md:order-1">
          <svg viewBox="0 0 400 280" className="mx-auto w-full max-w-[520px]" role="img" aria-label="A fresh loaf breaking open, steam rising">
            <defs>
              <radialGradient id="crust" cx="0.45" cy="0.3" r="0.8">
                <stop offset="0" stopColor="#d79a55" />
                <stop offset="0.6" stopColor="#a8642c" />
                <stop offset="1" stopColor="#6e3c18" />
              </radialGradient>
              <radialGradient id="crumb" cx="0.5" cy="0.5" r="0.6">
                <stop offset="0" stopColor="#fbf1d9" />
                <stop offset="1" stopColor="#ead3a4" />
              </radialGradient>
              <clipPath id="loaf-l">
                <rect x="0" y="0" width="200" height="280" />
              </clipPath>
              <clipPath id="loaf-r">
                <rect x="200" y="0" width="200" height="280" />
              </clipPath>
            </defs>
            <ellipse cx="200" cy="246" rx="170" ry="12" fill="#120e0b" opacity="0.12" />
            <rect x="40" y="228" width="320" height="14" rx="7" fill="#7a4e2a" />
            {/* crumb revealed between the halves */}
            <ellipse cx="200" cy="168" rx="26" ry="62" fill="url(#crumb)" />
            <g ref={left}>
              <g clipPath="url(#loaf-l)">
                <path d={crust} fill="url(#crust)" />
                <path d="M120 120 q20 -14 40 0 M160 108 q20 -14 40 0" stroke="#f0c78a" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.7" />
              </g>
              <path d="M200 92 C190 130 194 190 200 230 L196 230 C188 190 186 130 196 92 Z" fill="url(#crumb)" />
            </g>
            <g ref={right}>
              <g clipPath="url(#loaf-r)">
                <path d={crust} fill="url(#crust)" />
                <path d="M210 108 q20 -14 40 0 M250 120 q20 -14 40 0" stroke="#f0c78a" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.7" />
              </g>
              <path d="M200 92 C210 130 206 190 200 230 L204 230 C212 190 214 130 204 92 Z" fill="url(#crumb)" />
            </g>
            <g ref={steam} opacity="0" stroke="#a8835a" strokeWidth="3" fill="none" strokeLinecap="round">
              {[180, 200, 220].map((x, i) => (
                <path
                  key={x}
                  d={`M${x} 96 c-10 -14 10 -24 0 -38 c-10 -14 10 -24 0 -38`}
                  style={{ animation: `steam 2.8s ${i * 0.6}s ease-in-out infinite`, transformOrigin: `${x}px 96px` }}
                  opacity="0.5"
                />
              ))}
            </g>
          </svg>
        </div>
        <Reveal className="order-1 md:order-2">
          <SectionSeal className="text-[#7a5c22]!" />
          <p className="eyebrow mt-6">From the oven</p>
          <h2 id="loaf-title" className="h-section mt-3">
            Pre-order your fresh loaf – {business.loaf.price}
          </h2>
          <p className="mt-4 max-w-[40ch] leading-relaxed text-muted-light">
            Call us on {business.loaf.phoneLocal} to put one aside.
          </p>
          <a href={business.loaf.href} className="btn btn-brass mt-8" data-cta="loaf_call">
            Call to order
          </a>
        </Reveal>
      </div>
    </section>
  )
}
