import { useState } from 'react'
import { Shamrock, SectionSeal } from '../ui/Shamrock'
import { Reveal } from '../ui/Reveal'
import { useStatus } from '../ui/status'
import { useInView } from '../../lib/useInView'
import { formatTime, hours } from '../../lib/hours'
import events from '../../data/events.json'

type Event = { title: string; time?: string; kind?: string }

const order = [1, 2, 3, 4, 5, 6, 0] // Mon → Sun, indexes into hours.days

function BeerMat({ dayIndex, index, isToday, flipNow }: { dayIndex: number; index: number; isToday: boolean; flipNow: boolean }) {
  const day = hours.days[dayIndex]
  const entry = events.days.find((d) => d.day === day.day)
  const list = (entry?.events ?? []) as Event[]
  const walkIns = Boolean(day.walkInsOnly)
  const [manual, setManual] = useState<boolean | null>(null)
  const flipped = manual ?? flipNow

  return (
    <li className={`mat ${flipped ? 'is-flipped' : ''} w-[200px] shrink-0 snap-center lg:w-auto`}>
      <button
        type="button"
        className="mat-inner block aspect-square w-full text-left"
        style={{ transitionDelay: manual === null ? `${index * 110}ms` : '0ms' }}
        onClick={() => setManual(!flipped)}
        aria-pressed={flipped}
        aria-label={`${day.day}${walkIns ? ', walk-ins only' : ''}. ${list.length ? list.map((e) => `${e.title} ${e.time ?? ''}`).join(', ') : 'Events to be announced'}. Open ${formatTime(day.open)} to ${formatTime(day.close)}.`}
      >
        {/* front */}
        <span
          className={`mat-face absolute inset-0 flex flex-col items-center justify-center rounded-[22px] p-4 text-center ${
            isToday ? 'ring-2 ring-brass-500' : ''
          }`}
          style={{ background: 'radial-gradient(circle at 50% 40%, #2e6b4e, #18402f 70%)', boxShadow: '0 18px 30px -18px rgba(18,14,11,.6)' }}
          aria-hidden="true"
        >
          <span className="absolute inset-3 rounded-[16px] border border-brass-500/50" />
          <Shamrock size={26} className="text-brass-500" />
          <span className="font-display mt-2 text-3xl text-cream-50">{day.short}</span>
          {isToday && <span className="mt-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brass-300">Today</span>}
          {walkIns && (
            <span className="mt-2 rounded-full bg-brass-500 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-stout-900">
              Walk-ins only
            </span>
          )}
        </span>
        {/* back */}
        <span
          className="mat-face mat-back flex flex-col rounded-[22px] bg-cream-50 p-5 text-stout-900"
          style={{ boxShadow: 'inset 0 0 0 1px rgba(18,14,11,.12), 0 18px 30px -18px rgba(18,14,11,.5)' }}
          aria-hidden="true"
        >
          <span className="flex items-center justify-between">
            <span className="font-display text-xl">{day.day}</span>
            {isToday && <span className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[#7a5c22]">Today</span>}
          </span>
          <span className="mt-auto block">
            {list.length ? (
              list.map((e, i) => (
                <span key={i} className="block text-sm font-semibold leading-snug">
                  {e.title}
                  {e.time && <span className="font-normal text-muted-light"> · {e.time}</span>}
                </span>
              ))
            ) : (
              <span className="block text-sm text-muted-light">What&rsquo;s on: to be announced</span>
            )}
          </span>
          <span className="mt-3 block border-t border-stout-900/15 pt-2 text-xs text-muted-light">
            {formatTime(day.open)} – {formatTime(day.close)}
          </span>
          {walkIns && (
            <span className="mt-2 inline-block self-start rounded-full bg-green-950 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-cream-50">
              Walk-ins only
            </span>
          )}
        </span>
      </button>
    </li>
  )
}

/** Chapter 4. The craic: a week of beer mats that flip as they come into view. */
export function TheCraic() {
  const { dayIndex } = useStatus()
  const [ref, inView] = useInView<HTMLUListElement>('0px 0px -20% 0px', true)
  return (
    <section id="the-craic" data-section="craic" className="on-light celtic bg-cream-50 py-24 text-stout-900 md:py-36" aria-labelledby="craic-title">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <Reveal className="max-w-[640px]">
          <SectionSeal className="text-[#7a5c22]!" />
          <p className="eyebrow mt-6">The craic</p>
          <h2 id="craic-title" className="h-section mt-3">
            Something on, every day of the week.
          </h2>
          <p className="mt-4 max-w-[48ch] leading-relaxed text-muted-light">
            Live music and sport on the screens. Tap a mat to flip it. Sundays are walk-ins only.
          </p>
        </Reveal>
        <div className="relative mt-12">
          <div className="hairline absolute inset-x-0 top-1/2 hidden lg:block" aria-hidden="true" />
          <ul
            ref={ref}
            className="no-scrollbar relative -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 lg:mx-0 lg:grid lg:grid-cols-7 lg:gap-4 lg:overflow-visible lg:px-0 xl:gap-6"
            aria-label="This week at Shea's"
          >
            {order.map((d, i) => (
              <BeerMat key={d} dayIndex={d} index={i} isToday={d === dayIndex} flipNow={inView} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
