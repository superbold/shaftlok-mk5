export interface QuoteStatusInfo {
  value: string
  label: string
  description: string
}

export const QUOTE_STATUSES: QuoteStatusInfo[] = [
  { value: 'new', label: 'New', description: 'Just submitted or still being drafted — not emailed yet.' },
  { value: 'sent', label: 'Quote Sent', description: 'The priced quote has been emailed to the sailor.' },
  { value: 'followed_up', label: 'Followed up', description: 'You checked in after sending — waiting on the sailor.' },
  { value: 'won', label: 'Won', description: 'The sailor accepted the quote.' },
  { value: 'dead', label: 'Dead', description: 'The sailor declined, went elsewhere, or the lead went cold.' }
]

/** Statuses that mean the quote has already gone out (or is past that). */
export const POST_SEND_STATUSES = ['sent', 'followed_up', 'won', 'dead'] as const

const QUOTE_STATUS_LABELS: Record<string, string> = Object.fromEntries(
  QUOTE_STATUSES.map((s) => [s.value, s.label])
)

const QUOTE_STATUS_DESCRIPTIONS: Record<string, string> = Object.fromEntries(
  QUOTE_STATUSES.map((s) => [s.value, s.description])
)

export const quoteStatusLabel = (status: string): string => QUOTE_STATUS_LABELS[status] || status

export const quoteStatusDescription = (status: string): string => QUOTE_STATUS_DESCRIPTIONS[status] || ''
