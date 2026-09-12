/** Quotes stay valid for this many calendar months after send. */
export const QUOTE_VALIDITY_MONTHS = 1

export const getQuoteValidUntilDate = (sentAt: string | Date): Date | null => {
  const base = sentAt instanceof Date ? new Date(sentAt.getTime()) : new Date(sentAt)
  if (Number.isNaN(base.getTime())) return null
  const validUntil = new Date(base.getTime())
  validUntil.setMonth(validUntil.getMonth() + QUOTE_VALIDITY_MONTHS)
  return validUntil
}

export const formatQuoteValidUntil = (
  sentAt: string | Date,
  options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' }
) => {
  const validUntil = getQuoteValidUntilDate(sentAt)
  if (!validUntil) return ''
  return validUntil.toLocaleDateString('en-US', options)
}
