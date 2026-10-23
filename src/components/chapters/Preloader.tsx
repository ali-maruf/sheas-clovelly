import { useEffect, useState } from 'react'
import { Logo } from '../ui/Logo'
import { prefersReducedMotion } from '../../lib/motion'

/**
 * Chapter 0. The original logo fades up on green; a separate brass line traces
 * a glint beneath it. The logo artwork itself is never animated or altered.
 * Shown once per session and skipped for reduced motion.
 */
export function Preloader() {
  const [phase, setPhase] = useState<'show' | 'leave' | 'gone'>(() => {
    try {
      if (prefersReducedMotion() || sessionStorage.getItem('sheas-intro')) return 'gone'
    } catch {
      /* storage unavailable */
    }
    return 'show'
  })

  useEffect(() => {
    if (phase !== 'show') return
    try {
      sessionStorage.setItem('sheas-intro', '1')
    } catch {
      /* ignore */
    }
    const t1 = window.setTimeout(() => setPhase('leave'), 1500)
    const t2 = window.setTimeout(() => setPhase('gone'), 2200)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [phase])

  if (phase === 'gone') return null
  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-green-800 transition-opacity duration-700"
      style={{ opacity: phase === 'leave' ? 0 : 1, pointerEvents: phase === 'leave' ? 'none' : 'auto' }}
      aria-hidden="true"
    >
      <div className="animate-[fadein_1s_var(--ease-settle)_both]">
        <Logo width={240} height={120} priority />
      </div>
      <svg width="240" height="24" viewBox="0 0 240 24" className="mt-2" fill="none">
        <path
          d="M4 16 C 60 4, 120 22, 236 8"
          stroke="url(#glint)"
          strokeWidth="1.5"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="1"
          style={{ animation: 'glint 1.2s 0.3s var(--ease-pour) both' }}
        />
        <defs>
          <linearGradient id="glint" x1="0" x2="1">
            <stop offset="0" stopColor="#C9A45C" stopOpacity="0" />
            <stop offset="0.5" stopColor="#E2C891" />
            <stop offset="1" stopColor="#C9A45C" stopOpacity="0.2" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}
