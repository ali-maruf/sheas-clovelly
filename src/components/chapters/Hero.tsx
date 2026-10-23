import { lazy, useRef, useState } from 'react'
import { Logo } from '../ui/Logo'
import { BookCta, StatusChip } from '../ui/status'
import { SceneGate } from '../ui/SceneGate'
import { PintStill } from './PintStill'
import { useScrollProgress } from '../../lib/scroll'
import business from '../../data/business.json'

const PintScene = lazy(() => import('../../three/PintScene'))

const STEPS = [
  { at: 0.0, label: 'Tilt the glass' },
  { at: 0.12, label: 'Pour to three-quarters' },
  { at: 0.42, label: 'Let it settle' },
  { at: 0.64, label: 'Top it up' },
  { at: 0.85, label: 'Sláinte' },
]

/** Chapter 1. The perfect pour (pinned ~250vh, scroll-scrubbed). */
export function Hero() {
  const section = useRef<HTMLElement>(null)
  const bar = useRef<HTMLDivElement>(null)
  const [step, setStep] = useState(0)
  const progress = useScrollProgress(section, (p) => {
    if (bar.current) bar.current.style.transform = `scaleX(${p})`
    let s = 0
    STEPS.forEach((st, i) => p >= st.at && (s = i))
    setStep((prev) => (prev === s ? prev : s))
  })

  return (
    <section ref={section} id="top" data-section="hero" className="pin-section" style={{ height: '250vh' }} aria-labelledby="hero-title">
      <div
        className="pin-stage celtic"
        style={{ background: 'radial-gradient(120% 90% at 68% 38%, #18402f 0%, #0f2a20 48%, #120e0b 100%)' }}
      >
        {/* top bar inside the hero; the sticky glass header takes over after */}
        <div className="absolute inset-x-0 top-0 z-20 mx-auto flex max-w-[1600px] items-center justify-between px-5 pt-4 md:px-10 md:pt-6">
          <a href="#top" aria-label="Shea's Clovelly, home" data-cta="logo_hero">
            <Logo width={112} height={56} priority />
          </a>
          <a href={business.phone.href} className="hidden text-sm font-medium text-cream-50/85 hover:text-brass-500 sm:block" data-cta="call_hero_top">
            {business.phone.display}
          </a>
        </div>

        {/* the pint */}
        <div className="absolute inset-x-0 top-[8%] bottom-[38%] md:inset-y-0 md:left-[40%] md:right-0 md:top-0 md:bottom-0">
          <SceneGate
            deferUntilInteraction
            still={
              <div className="flex h-full items-center justify-center pt-6 md:pt-10">
                <PintStill className="h-[78%] max-h-[620px] w-auto drop-shadow-[0_40px_60px_rgba(0,0,0,0.5)]" />
              </div>
            }
            render={(active, onReady) => <PintScene progress={progress} active={active} onReady={onReady} />}
          />
        </div>

        {/* copy */}
        <div className="pointer-events-none absolute inset-0 z-10 mx-auto flex max-w-[1600px] flex-col justify-end px-5 pb-[calc(var(--mobilebar-h)+28px)] md:justify-center md:px-10 md:pb-0">
          <div className="pointer-events-auto max-w-[620px] bg-gradient-to-t from-[#0f2a20] via-[#0f2a20]/85 to-transparent pt-10 md:bg-none md:pt-0">
            <p className="eyebrow">Irish bar &amp; restaurant · Clovelly</p>
            <h1 id="hero-title" className="h-display mt-4 text-cream-50">
              Come for the food, <em className="font-display italic text-brass-300">stay for the craic.</em>
            </h1>
            <p className="mt-5 max-w-[46ch] text-base leading-relaxed text-muted-dark md:text-lg">
              Pub classics made with traditional Irish recipes and locally sourced ingredients. Breakfast, steaks, live music and sport on the
              screens.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <BookCta cta="book_table_hero" />
              <a href={business.links.menu} className="btn btn-ghost" data-cta="menu_hero" target="_blank" rel="noopener">
                See the Menu
              </a>
            </div>
            <StatusChip className="mt-6" />
          </div>
        </div>

        {/* pour steps */}
        <div className="absolute bottom-6 right-5 z-10 hidden w-[220px] md:right-10 md:block" aria-hidden="true">
          <p key={step} className="eyebrow animate-[fadein_700ms_var(--ease-settle)_both] text-right">
            {String(step + 1).padStart(2, '0')} · {STEPS[step].label}
          </p>
          <div className="mt-3 h-px w-full bg-cream-50/15">
            <div ref={bar} className="h-px origin-left bg-brass-500" style={{ transform: 'scaleX(0)' }} />
          </div>
          <p className="mt-3 text-right text-xs text-cream-50/60">Scroll to pour</p>
        </div>
      </div>
    </section>
  )
}
