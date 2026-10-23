import { useState } from 'react'
import { SectionSeal } from '../ui/Shamrock'
import { Reveal } from '../ui/Reveal'
import { isPlaceholder, showPlaceholders } from '../../lib/placeholders'
import data from '../../data/reviews.json'

/** Chapter 8. Large serif quotes, sourced only from reviews.json. */
export function Reviews() {
  const reviews = data.reviews.filter((r) => showPlaceholders || !isPlaceholder(r.quote))
  const [i, setI] = useState(0)
  if (!reviews.length) return null
  const r = reviews[i]
  const pending = isPlaceholder(r.quote)
  const ratingPending = isPlaceholder(data.googleRating)

  return (
    <section id="reviews" data-section="reviews" className="celtic bg-green-950 py-24 md:py-36" aria-labelledby="reviews-title">
      <div className="mx-auto max-w-[1200px] px-5 text-center md:px-10">
        <SectionSeal className="justify-center" />
        <h2 id="reviews-title" className="eyebrow mt-6">
          What people say
        </h2>
        {(!ratingPending || showPlaceholders) && (
          <p className="mt-3 text-sm text-muted-dark">
            Google rating:{' '}
            <span className={ratingPending ? 'rounded border border-dashed border-brass-500/50 px-1.5 font-mono text-xs text-brass-300' : 'text-cream-50'}>
              {data.googleRating}
            </span>
          </p>
        )}
        <Reveal key={r.id}>
          <figure className="mx-auto mt-10 max-w-[30ch] md:mt-14">
            <blockquote
              className={`font-display text-[clamp(1.9rem,4.6vw,4rem)] leading-[1.12] text-cream-50 ${
                pending ? 'rounded-xl border border-dashed border-brass-500/40 px-6 py-10 font-mono text-[clamp(1.2rem,2.6vw,2rem)]! text-brass-300' : ''
              }`}
            >
              {pending ? r.quote : <>&ldquo;{r.quote}&rdquo;</>}
            </blockquote>
            {r.author && (
              <figcaption className="mt-6 text-sm text-muted-dark">
                {r.author} · {r.source}
              </figcaption>
            )}
          </figure>
        </Reveal>
        {reviews.length > 1 && (
          <div className="mt-10 flex items-center justify-center gap-5">
            <button type="button" className="btn btn-ghost px-4!" onClick={() => setI((i - 1 + reviews.length) % reviews.length)} aria-label="Previous review">
              ←
            </button>
            <div className="flex gap-2" role="tablist" aria-label="Choose review">
              {reviews.map((rv, idx) => (
                <button
                  key={rv.id}
                  type="button"
                  role="tab"
                  aria-selected={idx === i}
                  aria-label={`Review ${idx + 1}`}
                  onClick={() => setI(idx)}
                  className="grid h-6 w-6 place-items-center"
                >
                  <span className={`block h-1.5 rounded-full transition-all duration-500 ${idx === i ? 'w-6 bg-brass-500' : 'w-1.5 bg-cream-50/30'}`} />
                </button>
              ))}
            </div>
            <button type="button" className="btn btn-ghost px-4!" onClick={() => setI((i + 1) % reviews.length)} aria-label="Next review">
              →
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
