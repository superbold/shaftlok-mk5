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

  if (quote.status !== 'finished') {
    throw createError({ statusCode: 400, statusMessage: 'Mark the quote as Quote Finished before sending.' })
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw createError({ statusCode: 500, statusMessage: 'Email service is not configured.' })
  }

  const resend = new Resend(apiKey)

  // Whichever admin sends the quote becomes the reply-to (so sailor replies
  // land with whoever actually handled it); the other admin is cc'd.
  const ADMIN_EMAILS = ['sean.nigel@shaftlok.com', 'shaftlok@att.net']
  const senderEmail = ADMIN_EMAILS.includes(user.email ?? '') ? user.email! : ADMIN_EMAILS[0]
  const ccEmails = ADMIN_EMAILS.filter((adminEmail) => adminEmail !== senderEmail)

  const formattedPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(quote.quoted_price)
  const vesselLine = escapeHtml([quote.yacht_type, quote.yacht_name].filter(Boolean).join(' — '))
  const safeName = escapeHtml(quote.name)
  const safeQuoteNotes = escapeHtml(quote.quote_notes)

  const lineItems = Array.isArray(quote.line_items)
    ? (quote.line_items as { product_slug: string; product_name: string; detail: string | null }[])
    : []

  const itemsHtml = lineItems.length
    ? `
      <div style="background:rgba(148,197,255,0.06);border:1px solid rgba(148,197,255,0.18);border-radius:10px;padding:18px 20px;margin-bottom:24px">
        <p style="margin:0 0 10px;font-family:sans-serif;font-size:13px;letter-spacing:0.06em;text-transform:uppercase;color:#38BDF8">Items Quoted</p>
        ${lineItems.map((item) => `<p style="margin:0 0 6px;font-family:sans-serif;font-size:13px;color:#EFF6FF;line-height:1.6">${escapeHtml(item.product_name)}${item.detail ? ` — ${escapeHtml(item.detail)}` : ''}</p>`).join('')}
      </div>`
    : ''

  const warningsHtml = getApplicableWarnings(lineItems)
    .map((warning) => `
      <div style="background:rgba(148,197,255,0.06);border:1px solid rgba(148,197,255,0.18);border-radius:10px;padding:18px 20px;margin-bottom:24px">
        <p style="margin:0 0 10px;font-family:sans-serif;font-size:13px;letter-spacing:0.06em;text-transform:uppercase;color:#38BDF8">${escapeHtml(warning.title)}</p>
        ${warning.paragraphs.map((p) => `<p style="margin:0 0 12px;font-family:sans-serif;font-size:13px;color:#A8BEDC;line-height:1.7">${p}</p>`).join('')}
      </div>`)
    .join('')

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
        Hi ${safeName}, thanks for your interest${vesselLine ? ` in outfitting <strong style="color:#EFF6FF">${vesselLine}</strong>` : ''}. Here's your quote:
      </p>

      <div style="background:rgba(56,189,248,0.08);border:1px solid rgba(56,189,248,0.25);border-radius:10px;padding:18px 20px;margin-bottom:24px">
        <p style="margin:0;font-family:sans-serif;font-size:13px;letter-spacing:0.06em;text-transform:uppercase;color:#38BDF8">Quoted Price</p>
        <p style="margin:6px 0 0;font-family:sans-serif;font-size:28px;font-weight:700;color:#EFF6FF">${formattedPrice}</p>
      </div>
      ${itemsHtml}
      <p style="font-family:sans-serif;font-size:14px;color:#EFF6FF;line-height:1.6;margin:0 0 24px;white-space:pre-wrap">${safeQuoteNotes}</p>
      ${warningsHtml}
      <div style="background:rgba(148,197,255,0.06);border:1px solid rgba(148,197,255,0.18);border-radius:10px;padding:18px 20px;margin-bottom:24px">
        <p style="margin:0 0 10px;font-family:sans-serif;font-size:13px;letter-spacing:0.06em;text-transform:uppercase;color:#38BDF8">Payment</p>
        <p style="margin:0 0 12px;font-family:sans-serif;font-size:13px;color:#EFF6FF;line-height:1.6">${PAYMENT_INFO.intro}</p>
        <p style="margin:0 0 12px;font-family:sans-serif;font-size:13px;color:#EFF6FF;line-height:1.6">${PAYMENT_INFO.method}</p>
        <p style="margin:0 0 12px;font-family:sans-serif;font-size:13px;color:#A8BEDC;line-height:1.7">
          Bank: ${PAYMENT_INFO.bank.name}, Phone ${PAYMENT_INFO.bank.phone.replace(/ /g, '&nbsp;')}<br>
          Swift ${PAYMENT_INFO.bank.swift} &nbsp;&nbsp; ABA Routing No: ${PAYMENT_INFO.bank.routing}<br>
          ${PAYMENT_INFO.bank.address}
        </p>
        <p style="margin:0 0 12px;font-family:sans-serif;font-size:13px;color:#A8BEDC;line-height:1.7">
          Beneficiary:<br>
          Account Number: ${PAYMENT_INFO.beneficiary.accountNumber}, ${PAYMENT_INFO.beneficiary.accountType}<br>
          Name: ${PAYMENT_INFO.beneficiary.name}, ${PAYMENT_INFO.beneficiary.address}
        </p>
        <p style="margin:0;font-family:sans-serif;font-size:13px;color:#A8BEDC;line-height:1.6">${PAYMENT_INFO.support}</p>
      </div>

      <p style="margin:0;font-family:sans-serif;font-size:14px;color:#A8BEDC">
        Questions? Just reply to this email and we'll help you out.
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
    replyTo: senderEmail,
    cc: ccEmails,
    subject: 'Your Shaft Lok Quote',
    html
  })

  const sentAt = new Date().toISOString()
  const { error: updateError } = await supabase
    .from('quotes')
    .update({ status: 'sent', sent_at: sentAt, sent_html: html, updated_at: sentAt })
    .eq('id', quoteId)

  if (updateError) {
    console.error('Error updating quote after send:', updateError)
    throw createError({ statusCode: 500, statusMessage: 'Quote email sent, but failed to update status.' })
  }

  return { ok: true }
})
