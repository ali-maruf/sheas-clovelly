import hours from '../data/hours.json'

export type DayHours = (typeof hours.days)[number]

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

export function formatTime(hhmm: string) {
  const mins = toMinutes(hhmm)
  if (mins === 1440 || mins === 0) return 'midnight'
  if (mins === 720) return 'midday'
  const h = Math.floor(mins / 60)
  const m = mins % 60
  const suffix = h >= 12 ? 'pm' : 'am'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return m ? `${h12}:${String(m).padStart(2, '0')}${suffix}` : `${h12}${suffix}`
}

/** Current day (0 = Sunday) and minutes past midnight in Australia/Sydney. */
export function sydneyNow(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-AU', {
    timeZone: hours.timezone,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? ''
  const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'))
  return { day: weekday < 0 ? date.getDay() : weekday, minutes: Number(get('hour')) * 60 + Number(get('minute')) }
}

export type OpenStatus = {
  isOpen: boolean
  today: DayHours
  dayIndex: number
  isSunday: boolean
  /** e.g. "Open now · until midnight" / "Closed · opens 8am Fri" */
  label: string
}

export function getOpenStatus(date = new Date()): OpenStatus {
  const { day, minutes } = sydneyNow(date)
  const today = hours.days[day]
  const open = toMinutes(today.open)
  const close = toMinutes(today.close)
  const isOpen = minutes >= open && minutes < close
  let label: string
  if (isOpen) {
    label = `Open now · until ${formatTime(today.close)}`
  } else if (minutes < open) {
    label = `Closed · opens ${formatTime(today.open)} today`
  } else {
    const next = hours.days[(day + 1) % 7]
    label = `Closed · opens ${formatTime(next.open)} tomorrow`
  }
  return { isOpen, today, dayIndex: day, isSunday: day === 0, label }
}

export { hours }
