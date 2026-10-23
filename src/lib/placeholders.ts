/** True for unresolved template tokens like "{{REVIEW_1}}". */
export const isPlaceholder = (v: string | undefined | null) => !v || /^\{\{[A-Z0-9_.]+\}\}$/.test(v.trim())

/**
 * Placeholders render as clearly-marked slots by default so the team can see
 * what is missing. Set VITE_HIDE_PLACEHOLDERS=true to hide unfilled slots.
 */
export const showPlaceholders = import.meta.env.VITE_HIDE_PLACEHOLDERS !== 'true'
