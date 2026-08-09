export interface QuoteStatusInfo {
  value: string
  label: string
  description: string
}

export const QUOTE_STATUSES: QuoteStatusInfo[] = [
  { value: 'new', label: 'New', description: 'Just submitted by the sailor, not yet reviewed.' },
  { value: 'quoted', label: 'Drafting Quote', description: "Pricing is being worked out, hasn't been sent yet." },
  { value: 'in_review', label: 'In Review', description: 'Double-checking details before finalizing the price.' },
  { value: 'finished', label: 'Quote Finished', description: 'Reviewed and ready to send — sending unlocks once a quote reaches this status.' },
  { value: 'sent', label: 'Quote Sent', description: 'The priced quote has been emailed to the sailor.' },
  { value: 'won', label: 'Won', description: 'The sailor accepted the quote.' },
  { value: 'lost', label: 'Lost', description: 'The sailor declined or went elsewhere.' }
]

const QUOTE_STATUS_LABELS: Record<string, string> = Object.fromEntries(
  QUOTE_STATUSES.map((s) => [s.value, s.label])
)

const QUOTE_STATUS_DESCRIPTIONS: Record<string, string> = Object.fromEntries(
  QUOTE_STATUSES.map((s) => [s.value, s.description])
)

export const quoteStatusLabel = (status: string): string => QUOTE_STATUS_LABELS[status] || status

export const quoteStatusDescription = (status: string): string => QUOTE_STATUS_DESCRIPTIONS[status] || ''
