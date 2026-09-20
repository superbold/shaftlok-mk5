import { loadQuoteByPaymentToken, publicPayPayload } from '~~/server/utils/stripePay'

export default defineEventHandler(async (event) => {
  const token = getRouterParam(event, 'token')?.trim()
  if (!token) {
    throw createError({ statusCode: 400, statusMessage: 'Missing payment token.' })
  }

  const quote = await loadQuoteByPaymentToken(event, token)
  if (!quote?.sent_at) {
    throw createError({ statusCode: 404, statusMessage: 'This payment link is not valid.' })
  }

  return publicPayPayload(quote)
})
