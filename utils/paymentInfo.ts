import {
  CARD_SURCHARGE_PERCENT_LABEL,
  formatUsd,
  quotePaymentTotals
} from '~/utils/quotePayment'

export const PAYMENT_INFO = {
  intro: 'Orders are to be paid in advance through Stripe. You can pay by bank transfer at the quoted total, or by credit card with a 3% processing fee.',
  method: 'Use Pay by Bank Transfer or Pay by Credit Card below. You will see both amounts again before you are sent to Stripe.',
  support: 'Questions about paying? Reply to this email and we will help.'
}

export const paymentCopyForTotal = (productsPrice: number, shippingPrice = 0) => {
  const totals = quotePaymentTotals(productsPrice, shippingPrice)
  return {
    intro: `Orders are to be paid in advance. Pay by bank transfer for ${formatUsd(totals.grandTotal)} (no extra fee), or by credit card for ${formatUsd(totals.cardTotal)}.`,
    surchargeWarning: `Card payments include a ${CARD_SURCHARGE_PERCENT_LABEL} processing fee of ${formatUsd(totals.surcharge)}. That fee is added on our site before you go to Stripe — Stripe will not add another charge. Bank transfer is charged at the quoted total.`,
    method: PAYMENT_INFO.method,
    support: PAYMENT_INFO.support,
    totals
  }
}
