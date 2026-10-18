import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'
import { getSiteUrl, newPaymentToken } from '~~/server/utils/stripePay'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Not signed in.' })
  }

  const supabase = serverSupabaseServiceRole(event)

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.sub)
    .single()

  if (profile?.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Admin privileges required.' })
  }

  const { quoteId } = await readBody(event)
  if (!quoteId) {
    throw createError({ statusCode: 400, statusMessage: 'quoteId is required.' })
  }

  const { data: quote, error: fetchError } = await supabase
    .from('quotes')
    .select('id, sent_html, view_token')
    .eq('id', quoteId)
    .single()

  if (fetchError || !quote) {
    throw createError({ statusCode: 404, statusMessage: 'Quote not found.' })
  }

  if (!quote.sent_html) {
    throw createError({ statusCode: 400, statusMessage: 'Send the quote before copying a link.' })
  }

  let token = quote.view_token
  if (!token) {
    token = newPaymentToken()
    const { error: updateError } = await supabase
      .from('quotes')
      .update({ view_token: token })
      .eq('id', quoteId)
      .is('view_token', null)

    if (updateError) {
      console.error('Error saving quote view token:', updateError)
      throw createError({ statusCode: 500, statusMessage: 'Could not create a quote link.' })
    }

    const { data: fresh, error: rereadError } = await supabase
      .from('quotes')
      .select('view_token')
      .eq('id', quoteId)
      .single()

    if (rereadError || !fresh?.view_token) {
      throw createError({ statusCode: 500, statusMessage: 'Could not create a quote link.' })
    }
    token = fresh.view_token
  }

  return { url: `${getSiteUrl()}/q/${encodeURIComponent(token)}` }
})
