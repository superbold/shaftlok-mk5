/** Card processing fee Shaft Lok adds before creating a Stripe Checkout Session. */
export const CARD_SURCHARGE_RATE = 0.03
export const CARD_SURCHARGE_PERCENT_LABEL = '3%'

export type QuotePaymentStatus = 'unpaid' | 'pending' | 'paid' | 'failed' | 'expired'
export type QuotePaymentMethod = 'card' | 'bank'

export const PAYMENT_STATUSES: { value: QuotePaymentStatus; label: string; description: string }[] = [
  { value: 'unpaid', label: 'Unpaid', description: 'Quote emailed — sailor has not paid yet.' },
  { value: 'pending', label: 'Pending', description: 'Bank transfer started — waiting for funds to clear.' },
  { value: 'paid', label: 'Paid', description: 'Stripe confirmed payment.' },
  { value: 'failed', label: 'Failed', description: 'The last payment attempt did not go through.' },
  { value: 'expired', label: 'Expired', description: 'The last Stripe checkout window expired — they can try again.' }
]

const PAYMENT_STATUS_LABELS: Record<string, string> = Object.fromEntries(
  PAYMENT_STATUSES.map((s) => [s.value, s.label])
)

const PAYMENT_STATUS_DESCRIPTIONS: Record<string, string> = Object.fromEntries(
  PAYMENT_STATUSES.map((s) => [s.value, s.description])
)

export const paymentStatusLabel = (status?: string | null) =>
  PAYMENT_STATUS_LABELS[status || ''] || 'Unpaid'

export const paymentStatusDescription = (status?: string | null) =>
  PAYMENT_STATUS_DESCRIPTIONS[status || ''] || PAYMENT_STATUS_DESCRIPTIONS.unpaid

export const formatUsd = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value) || 0)

export const dollarsToCents = (amount: number) => Math.round(Number((Number(amount) || 0).toFixed(2)) * 100)

export const centsToDollars = (cents: number) => Number(((Number(cents) || 0) / 100).toFixed(2))

export const quoteGrandTotalCents = (productsPrice: number, shippingPrice: number) =>
  dollarsToCents(productsPrice) + dollarsToCents(shippingPrice)

export const cardSurchargeCents = (grandTotalCents: number) =>
  Math.round(grandTotalCents * CARD_SURCHARGE_RATE)

export const cardTotalCents = (grandTotalCents: number) =>
  grandTotalCents + cardSurchargeCents(grandTotalCents)

export type QuotePaymentTotals = {
  grandTotal: number
  grandTotalCents: number
  surcharge: number
  surchargeCents: number
  cardTotal: number
  cardTotalCents: number
}

export const quotePaymentTotals = (productsPrice: number, shippingPrice = 0): QuotePaymentTotals => {
  const grandTotalCents = quoteGrandTotalCents(productsPrice, shippingPrice)
  const surchargeCents = cardSurchargeCents(grandTotalCents)
  return {
    grandTotal: centsToDollars(grandTotalCents),
    grandTotalCents,
    surcharge: centsToDollars(surchargeCents),
    surchargeCents,
    cardTotal: centsToDollars(grandTotalCents + surchargeCents),
    cardTotalCents: grandTotalCents + surchargeCents
  }
}

export const canStartQuoteCheckout = (status?: string | null) => {
  const value = status || 'unpaid'
  return value === 'unpaid' || value === 'failed' || value === 'expired'
}
