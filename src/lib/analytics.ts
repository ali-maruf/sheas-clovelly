/**
 * Analytics stub. Every conversion element carries a `data-cta` attribute;
 * a single delegated listener reports clicks here. Swap the body of `track`
 * for GA4 / Plausible / Vercel Analytics when ready.
 */
export type CtaEvent = { cta: string; href?: string; label?: string; section?: string }

declare global {
  interface Window {
    dataLayer?: unknown[]
  }
}

export function track(event: string, payload: Record<string, unknown> = {}) {
  const entry = { event, ...payload, ts: Date.now() }
  window.dataLayer = window.dataLayer ?? []
  window.dataLayer.push(entry)
  if (import.meta.env.DEV) console.info('[analytics]', entry)
}

export function initCtaTracking() {
  const onClick = (e: MouseEvent) => {
    const el = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-cta]')
    if (!el) return
    const section = el.closest<HTMLElement>('[data-section]')?.dataset.section
    const payload: CtaEvent = {
      cta: el.dataset.cta ?? 'unknown',
      href: el.getAttribute('href') ?? undefined,
      label: el.textContent?.trim().slice(0, 60),
      section,
    }
    track('cta_click', payload)
  }
  document.addEventListener('click', onClick, { capture: true })
  return () => document.removeEventListener('click', onClick, { capture: true })
}
