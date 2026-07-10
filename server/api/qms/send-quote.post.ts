import { Resend } from 'resend'
import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'

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
    .select('*')
    .eq('id', quoteId)
    .single()

  if (fetchError || !quote) {
    throw createError({ statusCode: 404, statusMessage: 'Quote not found.' })
  }

  if (!quote.quoted_price || !quote.quote_notes) {
    throw createError({ statusCode: 400, statusMessage: 'Set a price and quote message before sending.' })
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw createError({ statusCode: 500, statusMessage: 'Email service is not configured.' })
  }

  const resend = new Resend(apiKey)

  const formattedPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(quote.quoted_price)
  const vesselLine = [quote.yacht_type, quote.yacht_name].filter(Boolean).join(' — ')

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="background:#040A18;margin:0;padding:32px 16px">
  <div style="max-width:600px;margin:0 auto;background:#081226;border:1px solid rgba(56,189,248,0.2);border-radius:16px;overflow:hidden">
    <div style="background:linear-gradient(135deg,#0D1B36,#071020);padding:28px 32px;border-bottom:1px solid rgba(56,189,248,0.15)">
      <p style="margin:0 0 4px;font-family:sans-serif;font-size:12px;letter-spacing:0.12em;color:#38BDF8;text-transform:uppercase">Shaft Lok Inc.</p>
      <h1 style="margin:0;font-family:sans-serif;font-size:22px;color:#EFF6FF">Your Shaft Lok Quote</h1>
    </div>

    <div style="padding:28px 32px">
      <p style="margin:0 0 20px;font-family:sans-serif;font-size:14px;color:#A8BEDC">
        Hi ${quote.name}, thanks for your interest${vesselLine ? ` in outfitting <strong style="color:#EFF6FF">${vesselLine}</strong>` : ''}. Here's your quote:
      </p>

      <div style="background:rgba(56,189,248,0.08);border:1px solid rgba(56,189,248,0.25);border-radius:10px;padding:18px 20px;margin-bottom:24px">
        <p style="margin:0;font-family:sans-serif;font-size:13px;letter-spacing:0.06em;text-transform:uppercase;color:#38BDF8">Quoted Price</p>
        <p style="margin:6px 0 0;font-family:sans-serif;font-size:28px;font-weight:700;color:#EFF6FF">${formattedPrice}</p>
      </div>

      <p style="font-family:sans-serif;font-size:14px;color:#EFF6FF;line-height:1.6;margin:0 0 24px;white-space:pre-wrap">${quote.quote_notes}</p>

      <p style="margin:0;font-family:sans-serif;font-size:14px;color:#A8BEDC">
        Questions? Just reply to this email and Sean will help you out.
      </p>
    </div>

    <div style="padding:16px 32px;border-top:1px solid rgba(56,189,248,0.1);background:rgba(4,10,24,0.5)">
      <p style="margin:0;font-family:sans-serif;font-size:12px;color:#6B7FA8">Sent via Shaft Lok Inc. · shaftlok.com</p>
    </div>
  </div>
</body>
</html>`

  await resend.emails.send({
    from: 'Shaft Lok Quotes <quote@contact.shaftlok.com>',
    to: quote.email,
    replyTo: 'sean.nigel@shaftlok.com',
    subject: 'Your Shaft Lok Quote',
    html
  })

  const sentAt = new Date().toISOString()
  const { error: updateError } = await supabase
    .from('quotes')
    .update({ status: 'sent', sent_at: sentAt, updated_at: sentAt })
    .eq('id', quoteId)

  if (updateError) {
    console.error('Error updating quote after send:', updateError)
    throw createError({ statusCode: 500, statusMessage: 'Quote email sent, but failed to update status.' })
  }

  return { ok: true }
})
