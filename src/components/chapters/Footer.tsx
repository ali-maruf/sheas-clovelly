import { Logo } from '../ui/Logo'
import { Shamrock } from '../ui/Shamrock'
import { hours } from '../../lib/hours'
import business from '../../data/business.json'

export function Footer() {
  return (
    <footer className="celtic bg-green-950 pb-[calc(var(--mobilebar-h)+40px)] pt-20 md:pb-16" data-section="footer">
      <div className="hairline mx-auto max-w-[1400px]" />
      <div className="mx-auto grid max-w-[1400px] gap-12 px-5 pt-16 sm:grid-cols-2 md:px-10 lg:grid-cols-4">
        <div>
          <Logo width={150} height={75} />
          <p className="mt-4 text-sm text-muted-dark">Come for the food, stay for the craic.</p>
        </div>
        <div>
          <h2 className="eyebrow">Find us</h2>
          <address className="mt-4 text-sm not-italic leading-relaxed text-cream-50">
            {business.address.street}
            <br />
            {business.address.locality} {business.address.region} {business.address.postcode}
          </address>
          <a href={business.links.directions} className="link-arrow mt-2 text-sm" target="_blank" rel="noopener" data-cta="directions_footer">
            Directions
          </a>
        </div>
        <div>
          <h2 className="eyebrow">Contact</h2>
          <a href={business.phone.href} className="mt-4 block text-sm text-cream-50 hover:text-brass-500" data-cta="call_footer">
            {business.phone.display}
          </a>
          <p className="mt-2 text-sm text-muted-dark">Bookings by phone. Sundays walk-ins only.</p>
          <div className="mt-4 flex gap-5 text-sm">
            <a href={business.links.instagram} className="link-arrow" target="_blank" rel="noopener" data-cta="social_instagram_footer">
              Instagram
            </a>
            <a href={business.links.facebook} className="link-arrow" target="_blank" rel="noopener" data-cta="social_facebook_footer">
              Facebook
            </a>
          </div>
        </div>
        <div>
          <h2 className="eyebrow">Hours</h2>
          <dl className="mt-4 space-y-2 text-sm">
            {hours.summary.map((h) => (
              <div key={h.label} className="flex justify-between gap-4">
                <dt className="text-muted-dark">{h.label}</dt>
                <dd className="text-cream-50">{h.hours}</dd>
              </div>
            ))}
          </dl>
          <a href={business.links.giftCards} className="link-arrow mt-4 text-sm" target="_blank" rel="noopener" data-cta="gift_card_footer">
            Gift cards
          </a>
        </div>
      </div>
      <div className="mx-auto mt-16 flex max-w-[1400px] items-center justify-between gap-4 px-5 text-xs text-cream-50/60 md:px-10">
        <p>© {new Date().getFullYear()} {business.name}</p>
        <Shamrock size={16} className="text-brass-500" />
      </div>
    </footer>
  )
}
