import { Resend } from 'resend'
import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const {
    name, email, phone, phoneRegion, address,
    yachtType, yachtName, displacement, maxHullSpeed,
    shaftDiameter, propDiameter, numBlades, numPropellers, propType,
    engine, transmission, lockingSystem, cableLength, notes
  } = body

  const lockingSystemLabel = lockingSystem === 'cable'
    ? `Marine Control Cable${cableLength ? ` — ${escapeHtml(cableLength)} ft` : ''}`
    : lockingSystem === 'spring'
      ? 'Simple Spring Locking System'
      : ''

  if (!name || !email) {
    throw createError({ statusCode: 400, statusMessage: 'Name and email are required.' })
  }

  const supabase = serverSupabaseServiceRole(event)
  const { error: insertError } = await supabase.from('quotes').insert({
    status: 'new',
    name, email, phone,
    phone_region: phoneRegion,
    address,
    yacht_type: yachtType,
    yacht_name: yachtName,
    displacement,
    max_hull_speed: maxHullSpeed,
    shaft_diameter: shaftDiameter,
    prop_diameter: propDiameter,
    num_blades: numBlades,
    num_propellers: numPropellers,
    prop_type: propType,
    engine, transmission,
    locking_system: lockingSystem,
    cable_length: cableLength,
    notes
  })

  if (insertError) {
    console.error('Error saving quote request:', insertError)
    throw createError({ statusCode: 500, statusMessage: 'Failed to save quote request.' })
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw createError({ statusCode: 500, statusMessage: 'Email service is not configured.' })
  }

  const resend = new Resend(apiKey)

  // `value` is expected to already be HTML-safe (escaped, with any <br> tags
  // intentionally inserted) by the time it reaches this helper.
  const row = (label: string, value: string) =>
    `<tr><td style="padding:6px 12px 6px 0;color:#94C5FF;font-family:sans-serif;font-size:14px;white-space:nowrap;vertical-align:top"><strong>${label}</strong></td><td style="padding:6px 0;color:#EFF6FF;font-family:sans-serif;font-size:14px">${value || '<em style="color:#6B7FA8">not provided</em>'}</td></tr>`

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="background:#040A18;margin:0;padding:32px 16px">
  <div style="max-width:600px;margin:0 auto;background:#081226;border:1px solid rgba(56,189,248,0.2);border-radius:16px;overflow:hidden">
    <div style="background:linear-gradient(135deg,#0D1B36,#071020);padding:28px 32px;border-bottom:1px solid rgba(56,189,248,0.15)">
      <p style="margin:0 0 4px;font-family:sans-serif;font-size:12px;letter-spacing:0.12em;color:#38BDF8;text-transform:uppercase">Shaft Lok Inc.</p>
      <h1 style="margin:0;font-family:sans-serif;font-size:22px;color:#EFF6FF">New Quote Request</h1>
    </div>

    <div style="padding:28px 32px">
      <p style="margin:0 0 20px;font-family:sans-serif;font-size:14px;color:#A8BEDC">
        From: <strong style="color:#EFF6FF">${escapeHtml(name)}</strong> &lt;<a href="mailto:${escapeHtml(email)}" style="color:#38BDF8">${escapeHtml(email)}</a>&gt;
      </p>

      <h2 style="margin:0 0 10px;font-family:sans-serif;font-size:14px;letter-spacing:0.08em;text-transform:uppercase;color:#38BDF8;border-bottom:1px solid rgba(56,189,248,0.2);padding-bottom:8px">Contact</h2>
      <table style="width:100%;margin-bottom:24px;border-collapse:collapse">
        ${row('Phone', phone ? `${escapeHtml(phone)}${phoneRegion === 'europe' ? ' (Europe / International)' : ' (US / Canada)'}` : '')}
        ${row('Address', address ? escapeHtml(address).replace(/\n/g, '<br>') : '')}
      </table>

      <h2 style="margin:0 0 10px;font-family:sans-serif;font-size:14px;letter-spacing:0.08em;text-transform:uppercase;color:#38BDF8;border-bottom:1px solid rgba(56,189,248,0.2);padding-bottom:8px">Vessel</h2>
      <table style="width:100%;margin-bottom:24px;border-collapse:collapse">
        ${row('Yacht Type & Length', escapeHtml(yachtType))}
        ${row('Yacht Name (stern)', escapeHtml(yachtName))}
        ${row('Displacement', escapeHtml(displacement))}
        ${row('Max Hull Speed', escapeHtml(maxHullSpeed))}
      </table>

      <h2 style="margin:0 0 10px;font-family:sans-serif;font-size:14px;letter-spacing:0.08em;text-transform:uppercase;color:#38BDF8;border-bottom:1px solid rgba(56,189,248,0.2);padding-bottom:8px">Propeller</h2>
      <table style="width:100%;margin-bottom:24px;border-collapse:collapse">
        ${row('Shaft Diameter', escapeHtml(shaftDiameter))}
        ${row('Propeller Diameter', escapeHtml(propDiameter))}
        ${row('Number of Blades', escapeHtml(numBlades))}
        ${row('Number of Propellers / Shafts', escapeHtml(numPropellers))}
        ${row('Fixed / Folding / Feathering', escapeHtml(propType))}
      </table>

      <h2 style="margin:0 0 10px;font-family:sans-serif;font-size:14px;letter-spacing:0.08em;text-transform:uppercase;color:#38BDF8;border-bottom:1px solid rgba(56,189,248,0.2);padding-bottom:8px">Engine & Transmission</h2>
      <table style="width:100%;margin-bottom:24px;border-collapse:collapse">
        ${row('Engine Make & HP', escapeHtml(engine))}
        ${row('Transmission Make & Ratio', escapeHtml(transmission))}
      </table>

      <h2 style="margin:0 0 10px;font-family:sans-serif;font-size:14px;letter-spacing:0.08em;text-transform:uppercase;color:#38BDF8;border-bottom:1px solid rgba(56,189,248,0.2);padding-bottom:8px">Locking System</h2>
      <table style="width:100%;margin-bottom:24px;border-collapse:collapse">
        ${row('Interested In', lockingSystemLabel)}
      </table>

      ${notes ? `
      <h2 style="margin:0 0 10px;font-family:sans-serif;font-size:14px;letter-spacing:0.08em;text-transform:uppercase;color:#38BDF8;border-bottom:1px solid rgba(56,189,248,0.2);padding-bottom:8px">Additional Notes</h2>
      <p style="font-family:sans-serif;font-size:14px;color:#EFF6FF;line-height:1.6;margin:0 0 24px">${escapeHtml(notes).replace(/\n/g, '<br>')}</p>
      ` : ''}
    </div>

    <div style="padding:16px 32px;border-top:1px solid rgba(56,189,248,0.1);background:rgba(4,10,24,0.5)">
      <p style="margin:0;font-family:sans-serif;font-size:12px;color:#6B7FA8">Sent via the Shaft Lok quote form at shaftlok.com · Reply to this email to respond to ${name}.</p>
    </div>
  </div>
</body>
</html>`

  await resend.emails.send({
    from: 'Shaft Lok Quote Form <quote@contact.shaftlok.com>',
    to: ['sean.nigel@shaftlok.com', 'shaftlok@att.net'],
    replyTo: email,
    subject: `Quote Request — ${yachtType || 'vessel'} from ${name}`,
    html
  })

  return { ok: true }
})
