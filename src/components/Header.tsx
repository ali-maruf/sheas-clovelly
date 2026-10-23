import { useEffect, useState, type MouseEvent } from 'react'
import { Logo } from './ui/Logo'
import { BookCta } from './ui/status'
import { scrollToId } from '../lib/scroll'
import business from '../data/business.json'

/** Sticky glass header, revealed once the hero has been scrolled past. */
export function Header() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const hero = document.getElementById('top')
    if (!hero) return
    const onScroll = () => setShow(window.scrollY > hero.offsetHeight - window.innerHeight * 0.9)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const jump = (id: string) => (e: MouseEvent) => {
    e.preventDefault()
    scrollToId(id)
  }

  return (
    <header
      className="glass fixed inset-x-0 top-0 z-50 border-b border-brass-500/20 transition-[transform,opacity] duration-700"
      style={{
        height: 'var(--header-h)',
        transform: show ? 'none' : 'translateY(-100%)',
        opacity: show ? 1 : 0,
        transitionTimingFunction: 'var(--ease-settle)',
      }}
      inert={!show}
    >
      <div className="mx-auto flex h-full max-w-[1600px] items-center justify-between gap-6 px-5 md:px-10">
        <a href="#top" onClick={jump('top')} aria-label="Shea's Clovelly, back to top" data-cta="logo_header">
          <Logo width={92} height={46} />
        </a>
        <nav aria-label="Main" className="flex items-center gap-1 md:gap-2">
          <a href={business.links.menu} target="_blank" rel="noopener" className="hidden rounded-full px-3 py-2 text-sm text-cream-50/90 hover:text-brass-500 md:block" data-cta="nav_menu">
            Menu
          </a>
          <a href="#the-craic" onClick={jump('the-craic')} className="hidden rounded-full px-3 py-2 text-sm text-cream-50/90 hover:text-brass-500 md:block" data-cta="nav_craic">
            The Craic
          </a>
          <a href="#gift-cards" onClick={jump('gift-cards')} className="hidden rounded-full px-3 py-2 text-sm text-cream-50/90 hover:text-brass-500 md:block" data-cta="nav_gift_cards">
            Gift Cards
          </a>
          <BookCta cta="book_table_header" className="btn btn-brass ml-2 min-h-10! px-4! text-sm!" />
        </nav>
      </div>
    </header>
  )
}
