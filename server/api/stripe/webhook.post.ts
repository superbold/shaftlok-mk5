import Stripe from 'stripe'
import {
  checkoutPaymentIntentId,
  getStripe,
  markQuotePaid,
  markQuotePaymentStatus,
  quoteIdFromStripeObject,
  toQuotePaymentMethod
} from '~~/server/utils/stripePay'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const webhookSecret = String(config.stripeWebhookSecret || process.env.STRIPE_WEBHOOK_SECRET || '')
  const signature = getHeader(event, 'stripe-signature')
  const rawBody = await readRawBody(event)

  if (!webhookSecret || !signature || !rawBody) {
    throw createError({ statusCode: 400, statusMessage: 'Missing Stripe webhook signature.' })
  }

  const stripe = getStripe()
  let stripeEvent: Stripe.Event
  try {
    stripeEvent = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
  } catch (error) {
    console.error('Stripe webhook signature failed:', error)
    throw createError({ statusCode: 400, statusMessage: 'Invalid Stripe signature.' })
  }

  switch (stripeEvent.type) {
    case 'checkout.session.completed': {
      const session = stripeEvent.data.object as Stripe.Checkout.Session
      const method = toQuotePaymentMethod(session.metadata?.payment_method)
      const surchargeCents = Number(session.metadata?.surcharge_cents || 0)
      const common = {
        quoteId: quoteIdFromStripeObject(session),
        sessionId: session.id,
        paymentIntentId: checkoutPaymentIntentId(session.payment_intent),
        method
      }
      if (session.payment_status === 'paid') {
        await markQuotePaid(event, {
          ...common,
          amountCents: session.amount_total,
          surchargeCents: method === 'card' ? surchargeCents : 0
        })
      } else {
        await markQuotePaymentStatus(event, 'pending', common)
      }
      break
    }
    case 'checkout.session.async_payment_succeeded': {
      const session = stripeEvent.data.object as Stripe.Checkout.Session
      const method = toQuotePaymentMethod(session.metadata?.payment_method)
      await markQuotePaid(event, {
        quoteId: quoteIdFromStripeObject(session),
        sessionId: session.id,
        paymentIntentId: checkoutPaymentIntentId(session.payment_intent),
        method,
        amountCents: session.amount_total,
        surchargeCents: method === 'card' ? Number(session.metadata?.surcharge_cents || 0) : 0
      })
      break
    }
    case 'checkout.session.async_payment_failed': {
      const session = stripeEvent.data.object as Stripe.Checkout.Session
      await markQuotePaymentStatus(event, 'failed', {
        quoteId: quoteIdFromStripeObject(session),
        sessionId: session.id,
        method: toQuotePaymentMethod(session.metadata?.payment_method)
      })
      break
    }
    case 'checkout.session.expired': {
      const session = stripeEvent.data.object as Stripe.Checkout.Session
      await markQuotePaymentStatus(event, 'expired', {
        quoteId: quoteIdFromStripeObject(session),
        sessionId: session.id,
        method: toQuotePaymentMethod(session.metadata?.payment_method)
      })
      break
    }
    case 'payment_intent.succeeded': {
      const intent = stripeEvent.data.object as Stripe.PaymentIntent
      const method = toQuotePaymentMethod(intent.metadata?.payment_method)
      await markQuotePaid(event, {
        quoteId: intent.metadata?.quote_id || null,
        paymentIntentId: intent.id,
        method,
        amountCents: intent.amount_received || intent.amount,
        surchargeCents: method === 'card' ? Number(intent.metadata?.surcharge_cents || 0) : 0
      })
      break
    }
    case 'payment_intent.payment_failed': {
      const intent = stripeEvent.data.object as Stripe.PaymentIntent
      await markQuotePaymentStatus(event, 'failed', {
        quoteId: intent.metadata?.quote_id || null,
        paymentIntentId: intent.id,
        method: toQuotePaymentMethod(intent.metadata?.payment_method)
      })
      break
    }
    default:
      break
  }

  return { received: true }
})
