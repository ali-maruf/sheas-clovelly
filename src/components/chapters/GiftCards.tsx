import { useRef } from 'react'
import { Logo } from '../ui/Logo'
import { Shamrock, SectionSeal } from '../ui/Shamrock'
import { Reveal } from '../ui/Reveal'
import { useScrollProgress } from '../../lib/scroll'
import { useMotionMode } from '../../lib/motion'
import business from '../../data/business.json'

const clamp = (v: number) => Math.min(1, Math.max(0, v))

/** Chapter 6. A 3D gift card turns as you scroll and flips to "Give the craic". */
export function GiftCards() {
  const mode = useMotionMode()
  const section = useRef<HTMLElement>(null)
  const card = useRef<HTMLDivElement>(null)

  useScrollProgress(
    section,
    (p) => {
      if (!card.current || mode === 'still') return
      const t = clamp((p - 0.18) / 0.42)
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
      const rotY = -28 + eased * 208
      const rotX = 10 - eased * 10
      card.current.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`
    },
    'top bottom',
    'bottom top',
  )

  const still = mode === 'still'
  return (
    <section ref={section} id="gift-cards" data-section="gift-cards" className="celtic overflow-hidden bg-stout-900 py-24 md:py-36" aria-labelledby="gift-title">
      <div className="mx-auto grid max-w-[1400px] items-center gap-16 px-5 md:grid-cols-2 md:px-10">
        <div className="flex justify-center" style={{ perspective: '1600px' }}>
          <div
            ref={card}
            className="relative aspect-[1.586] w-full max-w-[460px]"
            style={{ transformStyle: 'preserve-3d', transform: still ? 'rotateY(180deg)' : 'rotateX(10deg) rotateY(-28deg)' }}
          >
            {/* front */}
            <div
              className="absolute inset-0 flex flex-col justify-between overflow-hidden rounded-[18px] p-6 md:p-8"
              style={{
                backfaceVisibility: 'hidden',
                background: 'linear-gradient(135deg, #18402f 0%, #0f2a20 60%, #18402f 100%)',
                boxShadow: 'inset 0 0 0 1px rgba(201,164,92,.55), 0 40px 60px -30px rgba(0,0,0,.8)',
              }}
              aria-hidden="true"
            >
              <span className="absolute inset-3 rounded-[12px] border border-brass-500/40" />
              <span className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brass-500/10 blur-2xl" />
              <Logo width={150} height={75} />
              <span className="flex items-end justify-between">
                <span className="eyebrow">Gift card</span>
                <span className="text-xs text-cream-50/70">Clovelly</span>
              </span>
            </div>
            {/* back */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-[18px] p-6 text-center"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                background: 'radial-gradient(circle at 50% 30%, #2a1d12, #120e0b 70%)',
                boxShadow: 'inset 0 0 0 1px rgba(201,164,92,.7), 0 40px 60px -30px rgba(0,0,0,.8)',
              }}
              aria-hidden="true"
            >
              <Shamrock size={28} className="text-brass-500" />
              <span className="font-display text-4xl text-cream-50 md:text-5xl">Give the craic</span>
              <span className="hairline w-24" />
            </div>
          </div>
        </div>
        <Reveal>
          <SectionSeal />
          <p className="eyebrow mt-6">Gift cards</p>
          <h2 id="gift-title" className="h-section mt-3 text-cream-50">
            Give the craic.
          </h2>
          <p className="mt-4 max-w-[42ch] leading-relaxed text-muted-dark">
            A Shea&rsquo;s eGift card for breakfast, a long lunch or a night of live music. Sent straight to their inbox.
          </p>
          <a
            href={business.links.giftCards}
            className="btn btn-brass mt-8"
            data-cta="gift_card"
            target="_blank"
            rel="noopener"
          >
            Buy a gift card <span aria-hidden="true">→</span>
          </a>
        </Reveal>
      </div>
    </section>
  )
}
