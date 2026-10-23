import { SectionSeal } from '../ui/Shamrock'
import { Reveal } from '../ui/Reveal'
import { useStatus, StatusChip } from '../ui/status'
import { useInView } from '../../lib/useInView'
import { formatTime, hours } from '../../lib/hours'
import business from '../../data/business.json'

const weekOrder = [1, 2, 3, 4, 5, 6, 0]

function LazyMap() {
  const [ref, near] = useInView<HTMLDivElement>('300px 0px', true)
  return (
    <div ref={ref} className="relative aspect-[4/3] w-full overflow-hidden rounded-[6px] bg-green-800 p-[8px] md:aspect-auto md:h-full md:min-h-[460px]" style={{ background: 'linear-gradient(135deg, #e2c891, #8f6f33 45%, #c9a45c 70%, #6f5426)' }}>
      <div className="relative h-full w-full overflow-hidden rounded-[2px] bg-green-800">
        {near ? (
          <iframe
            title="Map showing Shea's at 211 Clovelly Road, Clovelly"
            src={business.links.mapEmbed}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 h-full w-full border-0 grayscale-[0.3] sepia-[0.15]"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-sm text-muted-dark">Loading map…</div>
        )}
      </div>
    </div>
  )
}

/** Chapter 9. Visit: address, hours (today highlighted), reservations, map, socials. */
export function Visit() {
  const { dayIndex, isSunday } = useStatus()
  return (
    <section id="visit" data-section="visit" className="bg-stout-900 py-24 md:py-36" aria-labelledby="visit-title">
      <div className="mx-auto grid max-w-[1400px] gap-14 px-5 md:grid-cols-2 md:px-10">
        <Reveal>
          <SectionSeal />
          <p className="eyebrow mt-6">Visit</p>
          <h2 id="visit-title" className="h-section mt-3 text-cream-50">
            Find us on Clovelly Road.
          </h2>
          <address className="mt-6 not-italic leading-relaxed text-cream-50">
            {business.address.street}
            <br />
            {business.address.locality} {business.address.region} {business.address.postcode}
          </address>
          <p className="mt-2">
            <a href={business.phone.href} className="link-arrow" data-cta="call_visit">
              {business.phone.display}
            </a>
          </p>
          <StatusChip className="mt-6" />

          <h3 className="eyebrow mt-10">Opening hours</h3>
          <table className="mt-4 w-full max-w-[420px] text-sm">
            <caption className="sr-only">Opening hours, Australia/Sydney time</caption>
            <tbody>
              {weekOrder.map((d) => {
                const day = hours.days[d]
                const today = d === dayIndex
                return (
                  <tr key={d} className={`border-b border-cream-50/10 ${today ? 'text-brass-300' : 'text-muted-dark'}`} aria-current={today ? 'date' : undefined}>
                    <th scope="row" className="py-2.5 text-left font-medium">
                      {day.day}
                      {today && <span className="ml-2 rounded-full bg-brass-500 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-stout-900">Today</span>}
                    </th>
                    <td className="py-2.5 text-right tabular-nums">
                      {formatTime(day.open)} – {formatTime(day.close)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          <h3 className="eyebrow mt-10">Reservations</h3>
          <p className="mt-3 max-w-[44ch] leading-relaxed text-muted-dark">
            Book a table by phone on <a href={business.phone.href} className="text-cream-50 underline decoration-brass-500/60 underline-offset-4" data-cta="call_reservations">{business.phone.local}</a>.{' '}
            <strong className="font-semibold text-cream-50">Sundays are walk-ins only.</strong>
            {isSunday && <span className="mt-2 block text-brass-300">It&rsquo;s Sunday: walk-ins today, just come on down.</span>}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href={business.links.directions} className="btn btn-brass" target="_blank" rel="noopener" data-cta="directions_visit">
              Get directions
            </a>
            <a href={business.links.menu} className="btn btn-ghost" target="_blank" rel="noopener" data-cta="menu_visit">
              See the menu
            </a>
          </div>
          <div className="mt-8 flex gap-6 text-sm">
            <a href={business.links.instagram} className="link-arrow" target="_blank" rel="noopener" data-cta="social_instagram">
              Instagram
            </a>
            <a href={business.links.facebook} className="link-arrow" target="_blank" rel="noopener" data-cta="social_facebook">
              Facebook
            </a>
          </div>
        </Reveal>
        <LazyMap />
      </div>
    </section>
  )
}
