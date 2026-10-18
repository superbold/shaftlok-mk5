import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const token = getRouterParam(event, 'token')?.trim() || ''
  if (!/^[a-f0-9]{64}$/i.test(token)) {
    throw createError({ statusCode: 404, statusMessage: 'This quote link is not available.' })
  }

  const supabase = serverSupabaseServiceRole(event)
  const { data, error } = await supabase
    .from('quotes')
    .select('sent_html')
    .eq('view_token', token)
    .maybeSingle()

  if (error) {
    console.error('Error loading quote by view token:', error)
    throw createError({ statusCode: 500, statusMessage: 'Could not load this quote.' })
  }

  if (!data?.sent_html) {
    throw createError({ statusCode: 404, statusMessage: 'This quote link is not available.' })
  }

  return { html: data.sent_html }
})
