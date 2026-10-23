import { useEffect, useRef, type RefObject } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { prefersReducedMotion } from './motion'

gsap.registerPlugin(ScrollTrigger)

let lenis: Lenis | null = null

export function initSmoothScroll() {
  if (prefersReducedMotion() || new URLSearchParams(location.search).get('smooth') === '0') return () => {}
  lenis = new Lenis({ duration: 1.15, smoothWheel: true, easing: (t) => 1 - Math.pow(1 - t, 3) })
  lenis.on('scroll', ScrollTrigger.update)
  const tick = (time: number) => lenis?.raf(time * 1000)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)
  return () => {
    gsap.ticker.remove(tick)
    lenis?.destroy()
    lenis = null
  }
}

export function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  if (lenis) lenis.scrollTo(el, { offset: -8 })
  else el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
}

/**
 * Scroll-scrubbed progress (0..1) for a tall pinned section. Stored in a ref
 * so WebGL scenes can read it every frame without re-rendering React.
 * Reversible by construction: progress simply follows scroll position.
 */
export function useScrollProgress(
  target: RefObject<HTMLElement | null>,
  onUpdate?: (p: number) => void,
  start = 'top top',
  end = 'bottom bottom',
) {
  const progress = useRef(0)
  const cb = useRef(onUpdate)
  cb.current = onUpdate
  useEffect(() => {
    const el = target.current
    if (!el) return
    const st = ScrollTrigger.create({
      trigger: el,
      start,
      end,
      scrub: true,
      onUpdate: (self) => {
        progress.current = self.progress
        cb.current?.(self.progress)
      },
    })
    progress.current = st.progress
    cb.current?.(st.progress)
    return () => st.kill()
  }, [target, start, end])
  return progress
}

export { gsap, ScrollTrigger }
