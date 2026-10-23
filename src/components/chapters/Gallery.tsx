import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { SectionSeal } from '../ui/Shamrock'
import { ScrollTrigger, useScrollProgress } from '../../lib/scroll'
import { useMotionMode } from '../../lib/motion'
import gallery from '../../data/gallery.json'

type Item = (typeof gallery.items)[number]

const TINTS: Record<string, string> = {
  food: 'radial-gradient(120% 90% at 30% 30%, #7a4e2a, #2a170c 70%)',
  terrace: 'radial-gradient(120% 90% at 70% 20%, #2e6b4e, #0f2a20 70%)',
  music: 'radial-gradient(120% 90% at 50% 80%, #6e1a12, #120e0b 70%)',
  match: 'radial-gradient(120% 90% at 40% 30%, #18402f, #120e0b 75%)',
  bar: 'radial-gradient(120% 90% at 60% 40%, #8f6f33, #1d140d 70%)',
}

function Frame({ item, innerRef }: { item: Item; innerRef: (el: HTMLDivElement | null) => void }) {
  const [failed, setFailed] = useState(false)
  return (
    <figure className="relative h-[62vh] max-h-[640px] w-[78vw] shrink-0 sm:w-[56vw] lg:w-[40vw] 3xl:w-[34vw]">
      <div className="absolute inset-0 overflow-hidden rounded-[6px] p-[10px]" style={{ background: 'linear-gradient(135deg, #e2c891, #8f6f33 45%, #c9a45c 70%, #6f5426)' }}>
        <div className="relative h-full w-full overflow-hidden rounded-[2px] bg-stout-900">
          <div ref={innerRef} className="absolute -inset-x-[12%] inset-y-0 will-change-transform">
            {!failed ? (
              <img
                src={item.src}
                alt={`${item.title}: ${item.caption}`}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
                onError={() => setFailed(true)}
              />
            ) : (
              <div className="celtic flex h-full w-full items-end p-8" style={{ background: TINTS[item.id] ?? TINTS.bar }} role="img" aria-label={`${item.title} (photo coming soon)`}>
                <span className="font-display text-[clamp(3rem,8vw,7rem)] leading-none text-cream-50/10">{item.title}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <figcaption className="absolute -bottom-12 left-0 flex items-baseline gap-3">
        <span className="font-display text-xl text-cream-50">{item.title}</span>
        <span className="text-sm text-muted-dark">{item.caption}</span>
      </figcaption>
    </figure>
  )
}

/** Chapter 5. Horizontal pinned gallery with brass frames and parallax depth. */
export function Gallery() {
  const mode = useMotionMode()
  const section = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const inners = useRef<(HTMLDivElement | null)[]>([])
  const [distance, setDistance] = useState(0)
  const pinned = mode === 'full'

  useLayoutEffect(() => {
    if (!pinned) return
    const measure = () => setDistance(Math.max(0, (track.current?.scrollWidth ?? 0) - window.innerWidth))
    measure()
    const ro = new ResizeObserver(measure)
    if (track.current) ro.observe(track.current)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [pinned])

  useScrollProgress(section, (p) => {
    if (!pinned || !track.current) return
    track.current.style.transform = `translate3d(${-p * distance}px,0,0)`
    const n = inners.current.length
    inners.current.forEach((el, i) => {
      if (el) el.style.transform = `translate3d(${(p - i / Math.max(1, n - 1)) * 9}%,0,0)`
    })
  })

  useEffect(() => {
    // re-measure triggers once the section height changes
    ScrollTrigger.refresh()
  }, [distance])

  return (
    <section
      ref={section}
      id="gallery"
      data-section="gallery"
      className="pin-section bg-green-950"
      style={{ height: pinned ? `calc(100vh + ${distance}px)` : undefined }}
      aria-labelledby="gallery-title"
    >
      <div className={pinned ? 'pin-stage flex flex-col justify-center' : 'py-24'}>
        <div className="mx-auto w-full max-w-[1600px] px-5 md:px-10">
          <SectionSeal />
          <div className="mt-5 flex items-end justify-between gap-6">
            <h2 id="gallery-title" className="h-section text-cream-50">
              A night at Shea&rsquo;s.
            </h2>
            <p className="hidden max-w-[32ch] text-sm text-muted-dark md:block">Food, the terrace, live music and match days.</p>
          </div>
        </div>
        <div className={pinned ? 'mt-10' : 'no-scrollbar mt-10 snap-x snap-mandatory overflow-x-auto pb-16'}>
          <div ref={track} className="flex w-max gap-6 px-5 pb-14 will-change-transform md:gap-10 md:px-10">
            {gallery.items.map((item, i) => (
              <Frame key={item.id} item={item} innerRef={(el) => void (inners.current[i] = el)} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
