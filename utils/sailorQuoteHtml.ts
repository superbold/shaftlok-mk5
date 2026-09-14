import { PAYMENT_INFO } from '~/utils/paymentInfo'
import { TERMS_AND_CONDITIONS } from '~/utils/termsAndConditions'

const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
}

const escapeHtml = (value: unknown) => {
  if (value == null) return ''
  return String(value).replace(/[&<>"']/g, (char) => HTML_ESCAPES[char] ?? char)
}

const money = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value) || 0)

const card = (title: string, body: string) => `
      <div style="background:rgba(148,197,255,0.06);border:1px solid rgba(148,197,255,0.18);border-radius:10px;padding:18px 20px;margin-bottom:24px">
        <p style="margin:0 0 10px;font-family:sans-serif;font-size:13px;letter-spacing:0.06em;text-transform:uppercase;color:#38BDF8">${escapeHtml(title)}</p>
        ${body}
      </div>`

const field = (label: string, value: unknown) => {
  const text = String(value ?? '').trim()
  if (!text) return ''
  return `<p style="margin:0 0 8px;font-family:sans-serif;font-size:13px;color:#A8BEDC;line-height:1.6"><span style="color:#6B7FA8">${escapeHtml(label)}: </span><span style="color:#EFF6FF">${escapeHtml(text)}</span></p>`
}

const lockingLabel = (lockingSystem?: string | null, cableLength?: string | null) => {
  if (lockingSystem === 'cable') {
    return `Marine Control Cable${cableLength ? ` — ${cableLength} ft` : ''}`
  }
  if (lockingSystem === 'spring') return 'Simple Spring Locking System'
  if (lockingSystem === 'unsure') return 'Not sure — needs guidance'
  return ''
}

const phoneLabel = (phone?: string | null, region?: string | null) => {
  if (!phone?.trim()) return ''
  return `${phone.trim()}${region === 'europe' ? ' (Europe / International)' : ' (US / Canada)'}`
}

export type SailorQuoteLineItem = {
  product_name: string
  detail?: string | null
  price: number
}

export type SailorQuoteWarning = {
  title: string
  paragraphs: string[]
}

export type SailorQuoteInput = {
  name: string
  phone?: string | null
  phone_region?: string | null
  address?: string | null
  yacht_type?: string | null
  yacht_name?: string | null
  displacement?: string | null
  max_hull_speed?: string | null
  shaft_diameter?: string | null
  prop_diameter?: string | null
  prop_pitch?: string | null
  num_blades?: string | null
  num_propellers?: string | null
  prop_type?: string | null
  engine?: string | null
  transmission?: string | null
  locking_system?: string | null
  cable_length?: string | null
  notes?: string | null
  quote_notes: string
  shipping_notes: string
  shipping_price: number
  products_price: number
  line_items: SailorQuoteLineItem[]
  attachment_labels: string[]
  warnings: SailorQuoteWarning[]
  valid_until_label: string
}

export const buildSailorQuoteHtml = (input: SailorQuoteInput) => {
  const safeName = escapeHtml(input.name)
  const vesselLine = escapeHtml([input.yacht_type, input.yacht_name].filter(Boolean).join(' — '))
  const grandTotal = Number(input.products_price || 0) + Number(input.shipping_price || 0)
  const shippingNotes = escapeHtml(String(input.shipping_notes || '').trim())

  const contactHtml = [
    field('Phone', phoneLabel(input.phone, input.phone_region)),
    field('Address', input.address)
  ].join('')

  const vesselHtml = [
    field('Yacht Type & Length', input.yacht_type),
    field('Yacht Name', input.yacht_name),
    field('Displacement', input.displacement),
    field('Max Hull Speed', input.max_hull_speed)
  ].join('')

  const propellerHtml = [
    field('Shaft Diameter', input.shaft_diameter),
    field('Propeller Diameter', input.prop_diameter),
    field('Propeller Pitch', input.prop_pitch),
    field('Number of Blades', input.num_blades),
    field('Number of Propellers / Shafts', input.num_propellers),
    field('Fixed / Folding / Feathering', input.prop_type)
  ].join('')

  const engineHtml = [
    field('Engine Make & HP', input.engine),
    field('Transmission Make & Ratio', input.transmission)
  ].join('')

  const lockingHtml = field('Interested In', lockingLabel(input.locking_system, input.cable_length))
  const notesHtml = input.notes?.trim()
    ? `<p style="margin:0;font-family:sans-serif;font-size:13px;color:#EFF6FF;line-height:1.6;white-space:pre-wrap">${escapeHtml(input.notes)}</p>`
    : ''

  const inquiryHtml = [
    contactHtml ? card('Contact', contactHtml) : '',
    vesselHtml ? card('Vessel', vesselHtml) : '',
    propellerHtml ? card('Propeller', propellerHtml) : '',
    engineHtml ? card('Engine & Transmission', engineHtml) : '',
    lockingHtml ? card('Locking System', lockingHtml) : '',
    notesHtml ? card('Notes', notesHtml) : ''
  ].join('')

  const itemsHtml = card(
    'Items Quoted',
    `<table style="width:100%;border-collapse:collapse;font-family:sans-serif;font-size:14px;color:#EFF6FF">
          ${input.line_items.map((item) => `
          <tr>
            <td style="padding:0 12px 10px 0;vertical-align:top;color:#EFF6FF">${escapeHtml(item.product_name)}${item.detail ? ` — ${escapeHtml(item.detail)}` : ''}</td>
            <td style="padding:0 0 10px;text-align:right;white-space:nowrap;vertical-align:top">${money(item.price)}</td>
          </tr>`).join('')}
        </table>`
  )

  const attachmentsHtml = input.attachment_labels.length
    ? card(
      'Attached Documents',
      `<ul style="margin:0;padding:0 0 0 18px;font-family:sans-serif;font-size:14px;color:#EFF6FF;line-height:1.7">
          ${input.attachment_labels.map((label) => `<li style="margin:0 0 4px">${escapeHtml(label)}</li>`).join('')}
        </ul>
        <p style="margin:10px 0 0;font-family:sans-serif;font-size:13px;color:#A8BEDC;line-height:1.6">These files are attached to this email for offline use.</p>`
    )
    : ''

  const warningsHtml = input.warnings.map((warning) =>
    card(
      warning.title,
      warning.paragraphs
        .map((p) => `<p style="margin:0 0 12px;font-family:sans-serif;font-size:13px;color:#A8BEDC;line-height:1.7">${p}</p>`)
        .join('')
    )
  ).join('')

  const termsHtml = card(
    'Terms and Conditions',
    TERMS_AND_CONDITIONS.map((term, index) =>
      `<p style="margin:0 0 ${index === TERMS_AND_CONDITIONS.length - 1 ? '0' : '10px'};font-family:sans-serif;font-size:13px;color:#A8BEDC;line-height:1.7">${index + 1}. ${escapeHtml(term)}</p>`
    ).join('')
  )

  const paymentHtml = card(
    'Payment',
    `<p style="margin:0 0 12px;font-family:sans-serif;font-size:13px;color:#EFF6FF;line-height:1.6">${PAYMENT_INFO.intro}</p>
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
        <p style="margin:0;font-family:sans-serif;font-size:13px;color:#A8BEDC;line-height:1.6">${PAYMENT_INFO.support}</p>`
  )

  const totalHtml = `
      <div style="background:rgba(56,189,248,0.08);border:1px solid rgba(56,189,248,0.25);border-radius:10px;padding:18px 20px;margin-bottom:24px">
        <p style="margin:0 0 12px;font-family:sans-serif;font-size:13px;letter-spacing:0.06em;text-transform:uppercase;color:#38BDF8">Quote Total</p>
        <table style="width:100%;border-collapse:collapse;font-family:sans-serif;font-size:14px;color:#EFF6FF">
          <tr>
            <td style="padding:0 0 8px;color:#A8BEDC">Products</td>
            <td style="padding:0 0 8px;text-align:right">${money(input.products_price)}</td>
          </tr>
          <tr>
            <td style="padding:0 0 8px;color:#A8BEDC">Shipping${shippingNotes ? ` — ${shippingNotes}` : ''}</td>
            <td style="padding:0 0 8px;text-align:right">${money(input.shipping_price)}</td>
          </tr>
          <tr>
            <td style="padding:10px 0 0;border-top:1px solid rgba(56,189,248,0.25);font-weight:700">Total</td>
            <td style="padding:10px 0 0;border-top:1px solid rgba(56,189,248,0.25);text-align:right;font-size:22px;font-weight:700">${money(grandTotal)}</td>
          </tr>
        </table>
        <p style="margin:14px 0 0;font-family:sans-serif;font-size:13px;color:#A8BEDC;line-height:1.6">
          This quote is valid until <strong style="color:#EFF6FF">${escapeHtml(input.valid_until_label)}</strong>. After that date, prices and terms may change.
        </p>
      </div>`

  return `<!DOCTYPE html>
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

      <p style="font-family:sans-serif;font-size:14px;color:#EFF6FF;line-height:1.6;margin:0 0 24px;white-space:pre-wrap">${escapeHtml(input.quote_notes)}</p>
      ${inquiryHtml}
      ${itemsHtml}
      ${attachmentsHtml}
      ${warningsHtml}
      ${termsHtml}
      ${paymentHtml}
      ${totalHtml}

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
}
