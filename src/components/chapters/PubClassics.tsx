import { lazy, useRef, useState } from 'react'
import { SceneGate } from '../ui/SceneGate'
import { SectionSeal } from '../ui/Shamrock'
import { useScrollProgress } from '../../lib/scroll'
import { PLATE_WINDOWS } from '../../three/passTiming'
import menu from '../../data/menu.json'

const PassScene = lazy(() => import('../../three/PassScene'))

function PassStill() {
  return (
    <div className="flex h-full items-center justify-center gap-4 px-6 md:gap-10">
      {menu.onThePass.map((d) => (
        <div
          key={d.id}
          className="aspect-square w-[28%] max-w-[260px] rounded-full shadow-[0_30px_40px_-20px_rgba(0,0,0,0.7)]"
          style={{ background: 'radial-gradient(circle, #fbf7ee 0 58%, #efe6d2 60% 70%, #fbf7ee 71%)' }}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}

/** Chapter 3. Pub classics on the pass (pinned ~250vh). */
export function PubClassics() {
  const section = useRef<HTMLElement>(null)
  const [arrived, setArrived] = useState(0)
  const progress = useScrollProgress(section, (p) => {
    const n = PLATE_WINDOWS.filter(([a, b]) => p >= a + (b - a) * 0.7).length
    setArrived((prev) => (prev === n ? prev : n))
  })
  const current = Math.max(0, arrived - 1)

  return (
    <section ref={section} id="food" data-section="food" className="pin-section" style={{ height: '250vh' }} aria-labelledby="food-title">
      <div className="pin-stage" style={{ background: 'linear-gradient(180deg, #120e0b 0%, #1d140d 55%, #120e0b 100%)' }}>
        <div className="relative z-10 mx-auto max-w-[1600px] px-5 pt-20 text-center md:px-10 md:pt-24">
          <SectionSeal className="justify-center" />
          <p className="eyebrow mt-5">From the kitchen</p>
          <h2 id="food-title" className="h-section mt-3 text-cream-50">
            Pub classics on the pass.
          </h2>
          <p className="mx-auto mt-3 max-w-[52ch] text-sm leading-relaxed text-muted-dark md:text-base">{menu.intro}</p>
        </div>
        <div className="absolute inset-x-0 bottom-[16%] top-[34%] md:bottom-[14%] md:top-[30%]">
          <SceneGate
            still={<PassStill />}
            render={(active, onReady) => <PassScene progress={progress} active={active} onReady={onReady} />}
          />
        </div>
        <ul className="absolute inset-x-0 bottom-[calc(var(--mobilebar-h)+12px)] z-10 mx-auto grid max-w-[1100px] grid-cols-1 px-5 md:bottom-10 md:grid-cols-3 md:gap-6 md:px-10">
          {menu.onThePass.map((d, i) => (
            <li
              key={d.id}
              className={`text-center transition-all duration-700 ${i === current ? 'block' : 'hidden md:block'}`}
              style={{ opacity: i < arrived ? 1 : 0.0, transform: i < arrived ? 'none' : 'translateY(10px)' }}
            >
              <p className="eyebrow">{d.category}</p>
              <h3 className="font-display mt-1 text-2xl text-cream-50">{d.name}</h3>
              <a href={menu.menuUrl} className="link-arrow mt-1 text-sm" data-cta={`menu_plate_${d.id}`} target="_blank" rel="noopener">
                See the menu <span aria-hidden="true">→</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
