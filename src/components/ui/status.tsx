import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { getOpenStatus, type OpenStatus } from '../../lib/hours'
import business from '../../data/business.json'

const StatusContext = createContext<OpenStatus>(getOpenStatus())

/** Live open/closed status in Australia/Sydney, refreshed every 30s. */
export function StatusProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState(getOpenStatus)
  useEffect(() => {
    const id = window.setInterval(() => setStatus(getOpenStatus()), 30_000)
    return () => window.clearInterval(id)
  }, [])
  return <StatusContext.Provider value={status}>{children}</StatusContext.Provider>
}

export const useStatus = () => useContext(StatusContext)

export function StatusChip({ className = '' }: { className?: string }) {
  const { isOpen, label } = useStatus()
  return (
    <p
      className={`inline-flex items-center gap-2.5 rounded-full bg-black/25 px-3.5 py-1.5 text-[0.8rem] font-medium text-cream-50 ring-1 ring-brass-500/40 backdrop-blur ${className}`}
      aria-live="polite"
    >
      <span
        className="h-2 w-2 rounded-full"
        style={{
          background: isOpen ? '#7fd1a0' : '#c98a5c',
          animation: isOpen ? 'pulse-dot 2.4s ease-in-out infinite' : undefined,
        }}
        aria-hidden="true"
      />
      {label}
    </p>
  )
}

/**
 * Primary booking CTA. Bookings are by phone, so it is a tel: link.
 * On Sundays (walk-ins only) it becomes "Walk-ins today" pointing to Visit.
 */
export function BookCta({
  className = 'btn btn-brass',
  cta = 'book_table',
  children,
}: {
  className?: string
  cta?: string
  children?: ReactNode
}) {
  const { isSunday } = useStatus()
  if (isSunday) {
    return (
      <a href="#visit" className={className} data-cta={`${cta}_walkins`}>
        Walk-ins today
      </a>
    )
  }
  return (
    <a href={business.phone.href} className={className} data-cta={cta} aria-label={`Book a table, call ${business.phone.display}`}>
      {children ?? 'Book a Table'}
    </a>
  )
}
