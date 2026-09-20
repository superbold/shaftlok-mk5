import { createQuoteCheckoutSession, loadQuoteByPaymentToken } from '~~/server/utils/stripePay'

export default defineEventHandler(async (event) => {
  const token = getRouterParam(event, 'token')?.trim()
  if (!token) {
    throw createError({ statusCode: 400, statusMessage: 'Missing payment token.' })
  }

  const body = await readBody<{ method?: string }>(event)
  const method = body?.method === 'card' || body?.method === 'bank' ? body.method : null
  if (!method) {
    throw createError({ statusCode: 400, statusMessage: 'Choose card or bank transfer.' })
  }

  const quote = await loadQuoteByPaymentToken(event, token)
  if (!quote?.sent_at) {
    throw createError({ statusCode: 404, statusMessage: 'This payment link is not valid.' })
  }

  return await createQuoteCheckoutSession(event, quote, method)
})
