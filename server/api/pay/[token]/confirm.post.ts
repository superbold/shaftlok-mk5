import { loadQuoteByPaymentToken, publicPayPayload, syncQuoteFromCheckoutSession } from '~~/server/utils/stripePay'

export default defineEventHandler(async (event) => {
  const token = getRouterParam(event, 'token')?.trim()
  if (!token) {
    throw createError({ statusCode: 400, statusMessage: 'Missing payment token.' })
  }

  const body = await readBody<{ session_id?: string }>(event).catch(() => null)
  const sessionId = String(body?.session_id || getQuery(event).session_id || '').trim()

  const quote = await loadQuoteByPaymentToken(event, token)
  if (!quote?.sent_at) {
    throw createError({ statusCode: 404, statusMessage: 'This payment link is not valid.' })
  }

  const synced = await syncQuoteFromCheckoutSession(event, quote, token, sessionId || null)
  return publicPayPayload(synced)
})
