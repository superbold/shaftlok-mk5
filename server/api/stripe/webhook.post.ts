import Stripe from 'stripe'
import { serverSupabaseServiceRole } from '#supabase/server'
import { centsToDollars } from '~/utils/quotePayment'
import { getStripe } from '~~/server/utils/stripePay'

const toPaymentMethod = (value: unknown) =>
  value === 'card' || value === 'bank' ? value : null

const quoteIdFrom = (obj?: { metadata?: Stripe.Metadata | null; client_reference_id?: string | null } | null) =>
  obj?.metadata?.quote_id || obj?.client_reference_id || null

const paymentIntentId = (value: Stripe.Checkout.Session['payment_intent']) => {
  if (!value) return null
  return typeof value === 'string' ? value : value.id
}

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

  const supabase = serverSupabaseServiceRole(event)

  const loadQuote = async (quoteId: string | null, sessionId?: string | null, intentId?: string | null) => {
    if (quoteId) {
      const { data } = await supabase.from('quotes').select('id, status, payment_status, decided_at').eq('id', quoteId).maybeSingle()
      if (data) return data
    }
    if (sessionId) {
      const { data } = await supabase
        .from('quotes')
        .select('id, status, payment_status, decided_at')
        .eq('stripe_checkout_session_id', sessionId)
        .maybeSingle()
      if (data) return data
    }
    if (intentId) {
      const { data } = await supabase
        .from('quotes')
        .select('id, status, payment_status, decided_at')
        .eq('stripe_payment_intent_id', intentId)
        .maybeSingle()
      if (data) return data
    }
    return null
  }

  const markPaid = async (params: {
    quoteId: string | null
    sessionId?: string | null
    paymentIntentId?: string | null
    method?: string | null
    amountCents?: number | null
    surchargeCents?: number | null
  }) => {
    const quote = await loadQuote(params.quoteId, params.sessionId, params.paymentIntentId)
    if (!quote) {
      console.error('Stripe webhook paid event with no matching quote', params)
      return
    }
    if (quote.payment_status === 'paid') return

    const now = new Date().toISOString()
    const method = toPaymentMethod(params.method)
    await supabase
      .from('quotes')
      .update({
        payment_status: 'paid',
        paid_at: now,
        status: 'won',
        decided_at: quote.decided_at || now,
        ...(method ? { payment_method: method } : {}),
        ...(params.amountCents == null ? {} : { amount_charged: centsToDollars(params.amountCents) }),
        ...(params.surchargeCents == null ? {} : { surcharge_amount: centsToDollars(params.surchargeCents) }),
        ...(params.sessionId ? { stripe_checkout_session_id: params.sessionId } : {}),
        ...(params.paymentIntentId ? { stripe_payment_intent_id: params.paymentIntentId } : {}),
        updated_at: now
      })
      .eq('id', quote.id)
  }

  const markStatus = async (
    status: 'pending' | 'failed' | 'expired',
    params: { quoteId: string | null; sessionId?: string | null; paymentIntentId?: string | null; method?: string | null }
  ) => {
    const quote = await loadQuote(params.quoteId, params.sessionId, params.paymentIntentId)
    if (!quote || quote.payment_status === 'paid') return
    if (status === 'expired' && quote.payment_status === 'pending') return

    const method = toPaymentMethod(params.method)
    await supabase
      .from('quotes')
      .update({
        payment_status: status,
        ...(method ? { payment_method: method } : {}),
        ...(params.sessionId ? { stripe_checkout_session_id: params.sessionId } : {}),
        ...(params.paymentIntentId ? { stripe_payment_intent_id: params.paymentIntentId } : {}),
        updated_at: new Date().toISOString()
      })
      .eq('id', quote.id)
  }

  switch (stripeEvent.type) {
    case 'checkout.session.completed': {
      const session = stripeEvent.data.object as Stripe.Checkout.Session
      const method = toPaymentMethod(session.metadata?.payment_method)
      const surchargeCents = Number(session.metadata?.surcharge_cents || 0)
      const common = {
        quoteId: quoteIdFrom(session),
        sessionId: session.id,
        paymentIntentId: paymentIntentId(session.payment_intent),
        method
      }
      if (session.payment_status === 'paid') {
        await markPaid({
          ...common,
          amountCents: session.amount_total,
          surchargeCents: method === 'card' ? surchargeCents : 0
        })
      } else {
        await markStatus('pending', common)
      }
      break
    }
    case 'checkout.session.async_payment_succeeded': {
      const session = stripeEvent.data.object as Stripe.Checkout.Session
      const method = toPaymentMethod(session.metadata?.payment_method)
      await markPaid({
        quoteId: quoteIdFrom(session),
        sessionId: session.id,
        paymentIntentId: paymentIntentId(session.payment_intent),
        method,
        amountCents: session.amount_total,
        surchargeCents: method === 'card' ? Number(session.metadata?.surcharge_cents || 0) : 0
      })
      break
    }
    case 'checkout.session.async_payment_failed': {
      const session = stripeEvent.data.object as Stripe.Checkout.Session
      await markStatus('failed', {
        quoteId: quoteIdFrom(session),
        sessionId: session.id,
        method: toPaymentMethod(session.metadata?.payment_method)
      })
      break
    }
    case 'checkout.session.expired': {
      const session = stripeEvent.data.object as Stripe.Checkout.Session
      await markStatus('expired', {
        quoteId: quoteIdFrom(session),
        sessionId: session.id,
        method: toPaymentMethod(session.metadata?.payment_method)
      })
      break
    }
    case 'payment_intent.succeeded': {
      const intent = stripeEvent.data.object as Stripe.PaymentIntent
      const method = toPaymentMethod(intent.metadata?.payment_method)
      await markPaid({
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
      await markStatus('failed', {
        quoteId: intent.metadata?.quote_id || null,
        paymentIntentId: intent.id,
        method: toPaymentMethod(intent.metadata?.payment_method)
      })
      break
    }
    default:
      break
  }

  return { received: true }
})
