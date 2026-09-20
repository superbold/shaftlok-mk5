import type { H3Event } from 'h3'
import Stripe from 'stripe'
import { randomBytes } from 'node:crypto'
import { serverSupabaseServiceRole } from '#supabase/server'
import {
  canStartQuoteCheckout,
  centsToDollars,
  dollarsToCents,
  quotePaymentTotals,
  type QuotePaymentMethod
} from '~/utils/quotePayment'
import {
  clampDiscountPercent,
  CUSTOM_ITEM_LINE_NAME,
  discountLineAmount,
  isCustomLine,
  isDiscountLine,
  lineItemAmount,
  parseLineQty
} from '~/utils/quoteLineItem'
import { formatQuoteValidUntil, isQuoteStillValid } from '~/utils/quoteValidity'

export const newPaymentToken = () => randomBytes(32).toString('hex')

export const getSiteUrl = () => {
  const config = useRuntimeConfig()
  return String(config.public.siteUrl || 'https://shaftlok.com').replace(/\/$/, '')
}

export const quotePayUrl = (token: string) => `${getSiteUrl()}/pay/${encodeURIComponent(token)}`

export const getStripe = () => {
  const key = String(useRuntimeConfig().stripeSecretKey || process.env.STRIPE_SECRET_KEY || '')
  if (!key) {
    throw createError({ statusCode: 500, statusMessage: 'Stripe is not configured. Add STRIPE_SECRET_KEY.' })
  }
  return new Stripe(key)
}

export type QuoteLineForPay = {
  product_slug?: string | null
  product_name?: string | null
  detail?: string | null
  qty?: number | null
  price?: number | null
}

export const parseQuoteLineItems = (raw: unknown): QuoteLineForPay[] => {
  if (!Array.isArray(raw)) return []
  return raw.filter((item) => item && typeof item === 'object') as QuoteLineForPay[]
}

export type PayableQuote = {
  id: string
  name: string
  email: string
  yacht_type: string | null
  yacht_name: string | null
  quote_number: string | null
  sent_at: string | null
  sent_quoted_price: number | null
  sent_shipping_price: number | null
  sent_shipping_notes: string | null
  sent_line_items: unknown
  payment_token: string | null
  payment_status: string
  payment_method: string | null
  paid_at: string | null
  amount_charged: number | null
  surcharge_amount: number | null
  stripe_customer_id: string | null
  stripe_checkout_session_id: string | null
  stripe_payment_intent_id: string | null
  status: string
}

const PAYABLE_QUOTE_COLUMNS = [
  'id',
  'name',
  'email',
  'yacht_type',
  'yacht_name',
  'quote_number',
  'sent_at',
  'sent_quoted_price',
  'sent_shipping_price',
  'sent_shipping_notes',
  'sent_line_items',
  'payment_token',
  'payment_status',
  'payment_method',
  'paid_at',
  'amount_charged',
  'surcharge_amount',
  'stripe_customer_id',
  'stripe_checkout_session_id',
  'stripe_payment_intent_id',
  'status'
].join(', ')

export const loadQuoteByPaymentToken = async (event: H3Event, token: string) => {
  const supabase = serverSupabaseServiceRole(event)
  const { data, error } = await supabase
    .from('quotes')
    .select(PAYABLE_QUOTE_COLUMNS)
    .eq('payment_token', token)
    .maybeSingle()

  if (error) {
    console.error('Error loading quote by payment token:', error)
    throw createError({ statusCode: 500, statusMessage: 'Could not load this quote.' })
  }

  return (data as PayableQuote | null) || null
}

export const toQuotePaymentMethod = (value: unknown): QuotePaymentMethod | null =>
  value === 'card' || value === 'bank' ? value : null

export const checkoutPaymentIntentId = (value: Stripe.Checkout.Session['payment_intent']) => {
  if (!value) return null
  return typeof value === 'string' ? value : value.id
}

export const quoteIdFromStripeObject = (
  obj?: { metadata?: Stripe.Metadata | null; client_reference_id?: string | null } | null
) => obj?.metadata?.quote_id || obj?.client_reference_id || null

type QuotePaymentRow = {
  id: string
  status: string
  payment_status: string
  decided_at: string | null
}

export const loadQuoteForPaymentUpdate = async (
  event: H3Event,
  params: { quoteId?: string | null; sessionId?: string | null; paymentIntentId?: string | null }
) => {
  const supabase = serverSupabaseServiceRole(event)
  if (params.quoteId) {
    const { data } = await supabase.from('quotes').select('id, status, payment_status, decided_at').eq('id', params.quoteId).maybeSingle()
    if (data) return data as QuotePaymentRow
  }
  if (params.sessionId) {
    const { data } = await supabase
      .from('quotes')
      .select('id, status, payment_status, decided_at')
      .eq('stripe_checkout_session_id', params.sessionId)
      .maybeSingle()
    if (data) return data as QuotePaymentRow
  }
  if (params.paymentIntentId) {
    const { data } = await supabase
      .from('quotes')
      .select('id, status, payment_status, decided_at')
      .eq('stripe_payment_intent_id', params.paymentIntentId)
      .maybeSingle()
    if (data) return data as QuotePaymentRow
  }
  return null
}

export const markQuotePaid = async (
  event: H3Event,
  params: {
    quoteId?: string | null
    sessionId?: string | null
    paymentIntentId?: string | null
    method?: string | null
    amountCents?: number | null
    surchargeCents?: number | null
  }
) => {
  const quote = await loadQuoteForPaymentUpdate(event, params)
  if (!quote) {
    console.error('Stripe paid event with no matching quote', params)
    return
  }
  if (quote.payment_status === 'paid') return

  const now = new Date().toISOString()
  const method = toQuotePaymentMethod(params.method)
  const supabase = serverSupabaseServiceRole(event)
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

export const markQuotePaymentStatus = async (
  event: H3Event,
  status: 'pending' | 'failed' | 'expired',
  params: { quoteId?: string | null; sessionId?: string | null; paymentIntentId?: string | null; method?: string | null }
) => {
  const quote = await loadQuoteForPaymentUpdate(event, params)
  if (!quote || quote.payment_status === 'paid') return
  if (status === 'expired' && quote.payment_status === 'pending') return

  const method = toQuotePaymentMethod(params.method)
  const supabase = serverSupabaseServiceRole(event)
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

export const checkoutSessionMatchesQuote = (
  session: Stripe.Checkout.Session,
  quote: PayableQuote,
  token: string
) => {
  if (quote.stripe_checkout_session_id && session.id === quote.stripe_checkout_session_id) return true
  return session.metadata?.payment_token === token || quoteIdFromStripeObject(session) === quote.id
}

export const applyCompleteCheckoutSession = async (event: H3Event, session: Stripe.Checkout.Session) => {
  if (session.status !== 'complete') return
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
}

export const syncQuoteFromCheckoutSession = async (
  event: H3Event,
  quote: PayableQuote,
  token: string,
  sessionId?: string | null
) => {
  if (quote.payment_status === 'paid' || quote.payment_status === 'pending') return quote
  const id = String(sessionId || quote.stripe_checkout_session_id || '').trim()
  if (!id) return quote

  const stripe = getStripe()
  let session: Stripe.Checkout.Session
  try {
    session = await stripe.checkout.sessions.retrieve(id)
  } catch (error) {
    console.error('Could not retrieve Stripe checkout session', id, error)
    return quote
  }

  if (!checkoutSessionMatchesQuote(session, quote, token)) {
    throw createError({ statusCode: 403, statusMessage: 'This checkout does not match this quote.' })
  }

  await applyCompleteCheckoutSession(event, session)
  return (await loadQuoteByPaymentToken(event, token)) || quote
}

export const publicPayPayload = (quote: PayableQuote) => {
  const productsPrice = Number(quote.sent_quoted_price) || 0
  const shippingPrice = Number(quote.sent_shipping_price) || 0
  const totals = quotePaymentTotals(productsPrice, shippingPrice)
  const lineItems = parseQuoteLineItems(quote.sent_line_items)
  const productItems = lineItems.filter((item) => !isDiscountLine(item))
  const productsGross = Number(
    productItems.reduce((sum, item) => {
      const qty = parseLineQty(item.qty)
      const unit = Number(item.price) || 0
      return sum + lineItemAmount(unit, qty)
    }, 0).toFixed(2)
  )

  const valid = isQuoteStillValid(quote.sent_at)
  const checkoutOk = canStartQuoteCheckout(quote.payment_status)
  let blockReason: 'paid' | 'pending' | 'expired' | 'unavailable' | null = null
  if (quote.payment_status === 'paid') blockReason = 'paid'
  else if (quote.payment_status === 'pending') blockReason = 'pending'
  else if (!quote.sent_at || !valid) blockReason = 'expired'
  else if (!checkoutOk) blockReason = 'unavailable'

  return {
    quote_number: quote.quote_number,
    name: quote.name,
    yacht: [quote.yacht_type, quote.yacht_name].filter(Boolean).join(' — ') || null,
    valid_until: quote.sent_at ? formatQuoteValidUntil(quote.sent_at) : '',
    payment_status: quote.payment_status || 'unpaid',
    payment_method: quote.payment_method,
    paid_at: quote.paid_at,
    amount_charged: quote.amount_charged,
    line_items: lineItems.map((item) => {
      if (isDiscountLine(item)) {
        const percent = clampDiscountPercent(item.price)
        const amount = percent == null ? null : discountLineAmount(productsGross, percent)
        return {
          name: item.product_name || 'Discount',
          detail: item.detail || null,
          qty: null,
          unit_label: percent == null ? '—' : `${percent}%`,
          total: amount == null ? null : -amount
        }
      }
      const qty = parseLineQty(item.qty)
      const unit = Number(item.price) || 0
      const name = isCustomLine(item)
        ? (String(item.product_name || '').trim() || CUSTOM_ITEM_LINE_NAME)
        : (item.product_name || 'Item')
      return {
        name,
        detail: item.detail || null,
        qty,
        unit_label: null,
        unit,
        total: lineItemAmount(unit, qty)
      }
    }),
    products_price: productsPrice,
    shipping_price: shippingPrice,
    shipping_notes: quote.sent_shipping_notes,
    grand_total: totals.grandTotal,
    surcharge: totals.surcharge,
    card_total: totals.cardTotal,
    can_pay: blockReason == null,
    block_reason: blockReason
  }
}

const lineName = (item: QuoteLineForPay) => {
  if (isCustomLine(item)) {
    return String(item.product_name || '').trim() || CUSTOM_ITEM_LINE_NAME
  }
  return String(item.product_name || '').trim() || 'Shaft Lok item'
}

export const createQuoteCheckoutSession = async (
  event: H3Event,
  quote: PayableQuote,
  method: QuotePaymentMethod
) => {
  if (quote.payment_status === 'paid') {
    throw createError({ statusCode: 409, statusMessage: 'This quote has already been paid.' })
  }
  if (quote.payment_status === 'pending') {
    throw createError({
      statusCode: 409,
      statusMessage: 'A bank transfer is already in progress for this quote.'
    })
  }
  if (!quote.sent_at || !isQuoteStillValid(quote.sent_at)) {
    throw createError({ statusCode: 410, statusMessage: 'This quote has expired. Reply to your quote email for an updated total.' })
  }
  if (!canStartQuoteCheckout(quote.payment_status)) {
    throw createError({ statusCode: 409, statusMessage: 'This quote cannot be paid right now.' })
  }

  const productsPrice = Number(quote.sent_quoted_price)
  const shippingPrice = Number(quote.sent_shipping_price)
  if (!Number.isFinite(productsPrice) || !Number.isFinite(shippingPrice)) {
    throw createError({ statusCode: 400, statusMessage: 'This quote does not have a payable total.' })
  }

  const totals = quotePaymentTotals(productsPrice, shippingPrice)
  if (totals.grandTotalCents < 50) {
    throw createError({ statusCode: 400, statusMessage: 'This quote total is too small to check out online.' })
  }

  const stripe = getStripe()
  const supabase = serverSupabaseServiceRole(event)
  const token = quote.payment_token
  if (!token) {
    throw createError({ statusCode: 500, statusMessage: 'This quote is missing a payment link.' })
  }

  let customerId = quote.stripe_customer_id
  if (!customerId) {
    const customer = await stripe.customers.create({
      name: quote.name,
      email: quote.email,
      metadata: {
        quote_id: quote.id,
        quote_number: quote.quote_number || ''
      }
    })
    customerId = customer.id
    await supabase.from('quotes').update({ stripe_customer_id: customerId }).eq('id', quote.id)
  }

  if (quote.stripe_checkout_session_id) {
    try {
      await stripe.checkout.sessions.expire(quote.stripe_checkout_session_id)
    } catch (error) {
      console.warn('Could not expire previous Checkout session:', error)
    }
  }

  const lineItems = parseQuoteLineItems(quote.sent_line_items)
  const productItems = lineItems.filter((item) => !isDiscountLine(item))
  const discountItem = lineItems.find((item) => isDiscountLine(item))
  const productsGross = Number(
    productItems.reduce((sum, item) => sum + lineItemAmount(Number(item.price) || 0, item.qty), 0).toFixed(2)
  )
  const discountPercent = discountItem ? clampDiscountPercent(discountItem.price) : null
  const discountCents = discountPercent == null ? 0 : dollarsToCents(discountLineAmount(productsGross, discountPercent))

  const stripeLineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = productItems.map((item) => {
    const qty = parseLineQty(item.qty)
    const unitCents = dollarsToCents(Number(item.price) || 0)
    const description = String(item.detail || '').trim()
    return {
      quantity: qty,
      price_data: {
        currency: 'usd',
        unit_amount: unitCents,
        product_data: {
          name: lineName(item).slice(0, 250),
          ...(description ? { description: description.slice(0, 500) } : {})
        }
      }
    }
  })

  const shippingCents = dollarsToCents(shippingPrice)
  if (shippingCents > 0) {
    const shippingNotes = String(quote.sent_shipping_notes || '').trim()
    stripeLineItems.push({
      quantity: 1,
      price_data: {
        currency: 'usd',
        unit_amount: shippingCents,
        product_data: {
          name: 'Shipping',
          ...(shippingNotes ? { description: shippingNotes.slice(0, 500) } : {})
        }
      }
    })
  }

  if (method === 'card' && totals.surchargeCents > 0) {
    stripeLineItems.push({
      quantity: 1,
      price_data: {
        currency: 'usd',
        unit_amount: totals.surchargeCents,
        product_data: {
          name: 'Card processing fee (3%)',
          description: 'Added by Shaft Lok before checkout. Stripe does not add a further fee.'
        }
      }
    })
  }

  const discounts: Stripe.Checkout.SessionCreateParams.Discount[] = []
  if (discountCents > 0) {
    const coupon = await stripe.coupons.create({
      amount_off: discountCents,
      currency: 'usd',
      duration: 'once',
      max_redemptions: 1,
      name: discountItem?.product_name || 'Discount'
    })
    discounts.push({ coupon: coupon.id })
  }

  const expectedCents = method === 'card' ? totals.cardTotalCents : totals.grandTotalCents
  const metadata = {
    quote_id: quote.id,
    quote_number: quote.quote_number || '',
    payment_method: method,
    payment_token: token,
    expected_amount_cents: String(expectedCents),
    surcharge_cents: String(method === 'card' ? totals.surchargeCents : 0)
  }

  const payPath = quotePayUrl(token)
  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    mode: 'payment',
    customer: customerId,
    client_reference_id: quote.id,
    success_url: `${payPath}/confirmed?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${payPath}?checkout=cancel`,
    line_items: stripeLineItems,
    metadata,
    payment_intent_data: { metadata },
    expires_at: Math.floor(Date.now() / 1000) + (24 * 60 * 60) - 60
  }

  if (discounts.length) sessionParams.discounts = discounts

  if (method === 'card') {
    sessionParams.payment_method_types = ['card']
  } else {
    sessionParams.payment_method_types = ['us_bank_account', 'customer_balance']
    sessionParams.payment_method_options = {
      customer_balance: {
        funding_type: 'bank_transfer',
        bank_transfer: { type: 'us_bank_transfer' }
      }
    }
  }

  let session: Stripe.Checkout.Session
  try {
    session = await stripe.checkout.sessions.create(sessionParams)
  } catch (error) {
    if (method === 'bank') {
      sessionParams.payment_method_types = ['customer_balance']
      try {
        session = await stripe.checkout.sessions.create(sessionParams)
      } catch (retryError) {
        console.error('Stripe Checkout create failed (bank):', retryError)
        throw createError({
          statusCode: 502,
          statusMessage: 'Could not start bank transfer checkout. Confirm Bank transfers are enabled in Stripe.'
        })
      }
    } else {
      console.error('Stripe Checkout create failed (card):', error)
      throw createError({
        statusCode: 502,
        statusMessage: 'Could not start card checkout. Confirm cards are enabled in Stripe.'
      })
    }
  }

  if (!session.url) {
    throw createError({ statusCode: 502, statusMessage: 'Stripe did not return a checkout URL.' })
  }

  await supabase
    .from('quotes')
    .update({
      stripe_customer_id: customerId,
      stripe_checkout_session_id: session.id,
      payment_method: method,
      surcharge_amount: method === 'card' ? totals.surcharge : 0,
      updated_at: new Date().toISOString()
    })
    .eq('id', quote.id)

  return { url: session.url, sessionId: session.id }
}
