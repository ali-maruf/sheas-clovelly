import { useStatus } from './ui/status'
import business from '../data/business.json'

/** Mobile conversion bar. Bookings are by phone, so Call is primary. */
export function MobileBar() {
  const { isSunday } = useStatus()
  return (
    <nav
      aria-label="Quick actions"
      className="glass fixed inset-x-0 bottom-0 z-50 border-t border-brass-500/25 md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="grid grid-cols-[1.4fr_1fr_1fr] gap-2 p-3">
        <a href={business.phone.href} className="btn btn-brass min-h-12! px-3! text-sm!" data-cta={isSunday ? 'mobile_call_walkins' : 'mobile_call_to_book'}>
          {isSunday ? 'Walk-ins today · Call' : 'Call to Book'}
        </a>
        <a href={business.links.directions} target="_blank" rel="noopener" className="btn btn-ghost min-h-12! px-2! text-sm!" data-cta="mobile_directions">
          Directions
        </a>
        <a href={business.links.menu} target="_blank" rel="noopener" className="btn btn-ghost min-h-12! px-2! text-sm!" data-cta="mobile_menu">
          Menu
        </a>
      </div>
    </nav>
  )
}
