import { useEffect, useState } from 'react'

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Heuristic for devices that should get baked stills instead of live WebGL. */
export function isLowPower() {
  if (typeof window === 'undefined') return true
  const params = new URLSearchParams(window.location.search)
  if (params.get('3d') === '1') return false
  if (params.get('3d') === '0') return true
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } }
  if (nav.connection?.saveData) return true
  if (nav.deviceMemory !== undefined && nav.deviceMemory < 4) return true
  if (nav.hardwareConcurrency !== undefined && nav.hardwareConcurrency < 4) return true
  return !hasWebGL()
}

function hasWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

export type MotionMode = 'full' | 'still'

/** 'still' when reduced motion is requested or the device is low power. */
export function useMotionMode(): MotionMode {
  const [mode, setMode] = useState<MotionMode>(() => (prefersReducedMotion() || isLowPower() ? 'still' : 'full'))
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setMode(mq.matches || isLowPower() ? 'still' : 'full')
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return mode
}

/**
 * Resolves true once the user has interacted (scroll, pointer, key, touch),
 * or after `idleMs` on wide screens. Keeps heavy WebGL out of the critical path.
 */
export function useDeferredStart(idleMs = 2500) {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    let done = false
    const go = () => {
      if (done) return
      done = true
      setReady(true)
      cleanup()
    }
    const events = ['scroll', 'wheel', 'pointerdown', 'pointermove', 'keydown', 'touchstart'] as const
    events.forEach((ev) => window.addEventListener(ev, go, { passive: true, once: true }))
    const wide = window.matchMedia('(min-width: 1024px) and (pointer: fine)').matches
    const timer = wide ? window.setTimeout(go, idleMs) : undefined
    function cleanup() {
      events.forEach((ev) => window.removeEventListener(ev, go))
      if (timer) window.clearTimeout(timer)
    }
    return cleanup
  }, [idleMs])
  return ready
}
