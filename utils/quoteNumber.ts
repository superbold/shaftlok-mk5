const SHAFT_LOK_TZ = 'America/Chicago'
export const QUOTE_NUMBER_LETTERS = 5

export const quoteNameLetters = (name: string, length = QUOTE_NUMBER_LETTERS) =>
  String(name || '').toUpperCase().replace(/[^A-Z]/g, '').slice(0, length)

export const formatQuoteNumber = (date: Date | string, name: string) => {
  const when = date instanceof Date ? date : new Date(date)
  const letters = quoteNameLetters(name)
  if (Number.isNaN(when.getTime()) || !letters) return ''

  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: SHAFT_LOK_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(when)

  const year = parts.find((part) => part.type === 'year')?.value
  const month = parts.find((part) => part.type === 'month')?.value
  const day = parts.find((part) => part.type === 'day')?.value
  if (!year || !month || !day) return ''

  return `${year}-${month}${day}-${letters}`
}

export const quoteNumberFor = (
  quote: { quote_number?: string | null; sent_at?: string | null; created_at?: string | null } | null | undefined,
  name?: string | null
) => {
  const stored = quote?.quote_number?.trim()
  if (stored) return stored
  return formatQuoteNumber(quote?.sent_at || quote?.created_at || new Date(), name || '')
}
