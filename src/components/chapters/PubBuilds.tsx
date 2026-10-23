import { lazy, useRef, useState } from 'react'
import { SceneGate } from '../ui/SceneGate'
import { SectionSeal } from '../ui/Shamrock'
import { useScrollProgress } from '../../lib/scroll'

const PubScene = lazy(() => import('../../three/PubScene'))

const SPACES = [
  { key: 'restaurant', label: 'Cosy restaurant', at: 0.48, text: 'A warm dining room for breakfast through to dinner.' },
  { key: 'terrace', label: 'Outdoor terrace', at: 0.64, text: 'Fresh air and a pint in the sun.' },
  { key: 'bar', label: 'The bar', at: 0.3, text: 'Live music and sport on the screens.' },
]

function PubStill() {
  return (
    <div className="grid h-full content-center gap-4 p-6 sm:grid-cols-3 md:p-12">
      {SPACES.map((s) => (
        <div key={s.key} className="rounded-2xl border border-brass-500/30 bg-green-800/60 p-6">
          <p className="eyebrow">{s.label}</p>
          <p className="mt-3 text-sm leading-relaxed text-muted-dark">{s.text}</p>
        </div>
      ))}
    </div>
  )
}

/** Chapter 2. The pub builds itself (pinned ~300vh). */
export function PubBuilds() {
  const section = useRef<HTMLElement>(null)
  const [labels, setLabels] = useState([false, false, false])
  const progress = useScrollProgress(section, (p) => {
    const next = SPACES.map((s) => p >= s.at)
    setLabels((prev) => (prev.every((v, i) => v === next[i]) ? prev : next))
  })

  return (
    <section ref={section} id="the-pub" data-section="pub" className="pin-section" style={{ height: '300vh' }} aria-labelledby="pub-title">
      <div className="pin-stage celtic" style={{ background: 'radial-gradient(100% 80% at 60% 55%, #18402f 0%, #0f2a20 60%, #0b1f17 100%)' }}>
        <div className="absolute inset-x-0 bottom-0 top-[30%] md:inset-y-0 md:left-[34%] md:right-0">
          <SceneGate
            still={<PubStill />}
            render={(active, onReady) => <PubScene progress={progress} active={active} labels={labels} onReady={onReady} />}
          />
        </div>
        <div className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col px-5 pt-24 md:justify-center md:px-10 md:pt-0">
          <div className="max-w-[420px]">
            <SectionSeal />
            <p className="eyebrow mt-6">The pub</p>
            <h2 id="pub-title" className="h-section mt-3 text-cream-50">
              Your Irish local, built in real life.
            </h2>
            <p className="mt-4 max-w-[40ch] leading-relaxed text-muted-dark">
              A family-friendly neighbourhood bar and restaurant on Clovelly Road, with takeaway too.
            </p>
            <ul className="mt-8 hidden space-y-4 md:block">
              {SPACES.map((s, i) => (
                <li
                  key={s.key}
                  className="flex items-baseline gap-4 transition-all duration-700"
                  style={{ opacity: labels[i] ? 1 : 0.35, transform: labels[i] ? 'none' : 'translateX(-6px)' }}
                >
                  <span className="h-px w-8 translate-y-[-4px] bg-brass-500" aria-hidden="true" />
                  <span>
                    <span className="font-display text-xl text-cream-50">{s.label}</span>
                    <span className="block text-sm text-muted-dark">{s.text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
