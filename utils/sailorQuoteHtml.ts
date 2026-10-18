import { paymentCopyForTotal } from '~/utils/paymentInfo'
import {
  clampDiscountPercent,
  CUSTOM_ITEM_LINE_NAME,
  discountLineAmount,
  isCustomLine,
  isDiscountLine,
  lineItemAmount,
  parseLineQty
} from '~/utils/quoteLineItem'
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
      <div style="background:#FFFFFF;border:1px solid #D3DEE9;border-radius:10px;padding:18px 20px;margin-bottom:24px">
        <p style="margin:0 0 10px;font-family:sans-serif;font-size:13px;letter-spacing:0.06em;text-transform:uppercase;color:#075985">${escapeHtml(title)}</p>
        ${body}
      </div>`

const parseMoneyFromHtml = (html: string): number | null => {
  const n = Number(html.replace(/<[^>]+>/g, '').replace(/[^0-9.-]/g, ''))
  return Number.isFinite(n) ? n : null
}

const itemsQuotedTableHtml = (rows: {
  itemHtml: string
  qty: string | number
  unitPriceHtml: string
  totalHtml: string
}[]) =>
  `<table style="width:100%;border-collapse:collapse;font-family:sans-serif;font-size:14px;color:#0A2540">
          <tr>
            <td style="padding:0 12px 8px 0;text-align:right;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:#075985;white-space:nowrap">Qty</td>
            <td style="padding:0 12px 8px 0;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:#075985">Item</td>
            <td style="padding:0 12px 8px 0;text-align:right;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:#075985;white-space:nowrap">Unit Price</td>
            <td style="padding:0 0 8px;text-align:right;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:#075985;white-space:nowrap">Total</td>
          </tr>
          ${rows.map((row) => `
          <tr>
            <td style="padding:0 12px 10px 0;text-align:right;white-space:nowrap;vertical-align:top;color:#475569">${row.qty}</td>
            <td style="padding:0 12px 10px 0;vertical-align:top;color:#0A2540">${row.itemHtml}</td>
            <td style="padding:0 12px 10px 0;text-align:right;white-space:nowrap;vertical-align:top">${row.unitPriceHtml}</td>
            <td style="padding:0 0 10px;text-align:right;white-space:nowrap;vertical-align:top">${row.totalHtml}</td>
          </tr>`).join('')}
        </table>`

const itemsQuotedRow = (itemHtml: string, qtyRaw: string | number, totalHtml: string, unitPriceHtml?: string) => {
  const qty = parseLineQty(String(qtyRaw).replace(/<[^>]+>/g, '').trim() || '1')
  const total = parseMoneyFromHtml(totalHtml)
  const unitFromTotal = total == null ? null : Number((total / qty).toFixed(2))
  return {
    itemHtml,
    qty,
    unitPriceHtml: unitPriceHtml ?? (unitFromTotal == null ? totalHtml : money(unitFromTotal)),
    totalHtml: total == null ? totalHtml : money(total)
  }
}

const field = (label: string, value: unknown) => {
  const text = String(value ?? '').trim()
  if (!text) return ''
  return `<p style="margin:0 0 8px;font-family:sans-serif;font-size:13px;color:#334155;line-height:1.6"><span style="color:#475569">${escapeHtml(label)}: </span><span style="color:#0A2540">${escapeHtml(text)}</span></p>`
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
  product_slug?: string | null
  product_name: string
  detail?: string | null
  qty?: number
  price: number
}

export type SailorQuoteWarning = {
  title: string
  paragraphs: string[]
}

export type SailorQuoteInput = {
  name: string
  email?: string | null
  company?: string | null
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
  quote_number?: string | null
  shipping_notes: string
  shipping_price: number
  products_price: number
  line_items: SailorQuoteLineItem[]
  warnings: SailorQuoteWarning[]
  valid_until_label: string
  pay_url?: string | null
  include_payment?: boolean
  view_url?: string | null
}

const payHrefs = (input: SailorQuoteInput) => {
  const includePayment = input.include_payment !== false
  const payHref = includePayment ? String(input.pay_url || '').trim() : ''
  if (!payHref) return { includePayment, bankHref: '', cardHref: '' }
  const paySep = payHref.includes('?') ? '&' : '?'
  return {
    includePayment,
    bankHref: `${payHref}${paySep}method=bank`,
    cardHref: `${payHref}${paySep}method=card`
  }
}

export const buildSailorQuoteHtml = (input: SailorQuoteInput) => {
  const safeName = escapeHtml(input.name)
  const vesselLine = escapeHtml([input.yacht_type, input.yacht_name].filter(Boolean).join(' — '))
  const grandTotal = Number(input.products_price || 0) + Number(input.shipping_price || 0)
  const shippingNotes = escapeHtml(String(input.shipping_notes || '').trim())

  const inquiryBody = [
    field('Name', input.name),
    field('Email', input.email),
    field('Company', input.company),
    field('Phone', phoneLabel(input.phone, input.phone_region)),
    field('Address', input.address),
    field('Yacht Type & Length', input.yacht_type),
    field('Yacht Name', input.yacht_name),
    field('Displacement', input.displacement),
    field('Max Hull Speed', input.max_hull_speed),
    field('Shaft Diameter', input.shaft_diameter),
    field('Propeller Diameter', input.prop_diameter),
    field('Propeller Pitch', input.prop_pitch),
    field('Number of Blades', input.num_blades),
    field('Number of Propellers / Shafts', input.num_propellers),
    field('Fixed / Folding / Feathering', input.prop_type),
    field('Engine Make & HP', input.engine),
    field('Transmission Make & Ratio', input.transmission),
    field('Interested In', lockingLabel(input.locking_system, input.cable_length)),
    input.notes?.trim()
      ? `<p style="margin:8px 0 0;font-family:sans-serif;font-size:13px;color:#0A2540;line-height:1.6;white-space:pre-wrap">${escapeHtml(input.notes)}</p>`
      : ''
  ].join('')

  const inquiryHtml = inquiryBody ? card('Inquiry', inquiryBody) : ''

  const productItems = input.line_items.filter((item) => !isDiscountLine(item))
  const productsGross = Number(
    productItems.reduce((sum, item) => {
      const qty = parseLineQty(item.qty)
      const unit = Number(item.price) || 0
      return sum + lineItemAmount(unit, qty)
    }, 0).toFixed(2)
  )

  const itemsHtml = card(
    'Items Quoted',
    itemsQuotedTableHtml(input.line_items.map((item) => {
      if (isDiscountLine(item)) {
        const percent = clampDiscountPercent(item.price)
        const amount = percent == null ? null : discountLineAmount(productsGross, percent)
        return {
          itemHtml: `${escapeHtml(item.product_name || 'Discount')}${item.detail ? ` — ${escapeHtml(item.detail)}` : ''}`,
          qty: '—',
          unitPriceHtml: percent == null ? '—' : `${percent}%`,
          totalHtml: amount == null ? '—' : money(-amount)
        }
      }
      const qty = parseLineQty(item.qty)
      const unit = Number(item.price) || 0
      const name = isCustomLine(item)
        ? (String(item.product_name || '').trim() || CUSTOM_ITEM_LINE_NAME)
        : item.product_name
      return {
        itemHtml: `${escapeHtml(name)}${item.detail ? ` — ${escapeHtml(item.detail)}` : ''}`,
        qty,
        unitPriceHtml: money(unit),
        totalHtml: money(lineItemAmount(unit, qty))
      }
    }))
  )

  const warningsHtml = input.warnings.map((warning) =>
    card(
      warning.title,
      warning.paragraphs
        .map((p) => `<p style="margin:0 0 12px;font-family:sans-serif;font-size:13px;color:#334155;line-height:1.7">${p}</p>`)
        .join('')
    )
  ).join('')

  const termsHtml = card(
    'Terms and Conditions',
    TERMS_AND_CONDITIONS.map((term, index) =>
      `<p style="margin:0 0 ${index === TERMS_AND_CONDITIONS.length - 1 ? '0' : '10px'};font-family:sans-serif;font-size:13px;color:#334155;line-height:1.7">${index + 1}. ${escapeHtml(term)}</p>`
    ).join('')
  )

  const { includePayment, bankHref, cardHref } = payHrefs(input)
  const paymentCopy = paymentCopyForTotal(input.products_price, input.shipping_price)
  const payButton = bankHref
    ? `<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:16px 0 4px">
          <tr>
            <td style="border-radius:8px;background:#0369A1">
              <a href="${escapeHtml(bankHref)}" target="_blank" style="display:inline-block;padding:14px 28px;font-family:sans-serif;font-size:15px;font-weight:700;color:#FFFFFF;text-decoration:none">Pay by Bank Transfer · ${money(paymentCopy.totals.grandTotal)}</a>
            </td>
          </tr>
          <tr>
            <td height="12" style="font-size:12px;line-height:12px">&nbsp;</td>
          </tr>
          <tr>
            <td style="border-radius:8px;background:#FFFFFF;border:1px solid #0369A1">
              <a href="${escapeHtml(cardHref)}" target="_blank" style="display:inline-block;padding:14px 28px;font-family:sans-serif;font-size:15px;font-weight:700;color:#0369A1;text-decoration:none">Pay by Credit Card · ${money(paymentCopy.totals.cardTotal)}</a>
            </td>
          </tr>
        </table>
        <p style="margin:8px 0 0;font-family:sans-serif;font-size:12px;color:#475569;line-height:1.6">Credit card includes a 3% processing fee of ${money(paymentCopy.totals.surcharge)}. Bank transfer has no extra fee. You will see these amounts again before Stripe.</p>`
    : ''

  const paymentHtml = includePayment
    ? card(
      'Payment',
      `<p style="margin:0 0 12px;font-family:sans-serif;font-size:13px;color:#0A2540;line-height:1.6">${escapeHtml(paymentCopy.intro)}</p>
        <p style="margin:0 0 12px;font-family:sans-serif;font-size:13px;color:#92400E;line-height:1.6">${escapeHtml(paymentCopy.surchargeWarning)}</p>
        <p style="margin:0 0 12px;font-family:sans-serif;font-size:13px;color:#0A2540;line-height:1.6">${escapeHtml(paymentCopy.method)}</p>
        ${payButton}
        <p style="margin:${payButton ? '12px' : '0'} 0 0;font-family:sans-serif;font-size:13px;color:#334155;line-height:1.6">${escapeHtml(paymentCopy.support)}</p>`
    )
    : ''

  const totalHtml = `
      <div style="background:#F0F7FC;border:1px solid #BAE6FD;border-radius:10px;padding:18px 20px;margin-bottom:24px">
        <p style="margin:0 0 12px;font-family:sans-serif;font-size:13px;letter-spacing:0.06em;text-transform:uppercase;color:#075985">Quote Total</p>
        <table style="width:100%;border-collapse:collapse;font-family:sans-serif;font-size:14px;color:#0A2540">
          <tr>
            <td style="padding:0 0 8px;color:#475569">Products</td>
            <td style="padding:0 0 8px;text-align:right">${money(input.products_price)}</td>
          </tr>
          <tr>
            <td style="padding:0 0 8px;color:#475569">Shipping${shippingNotes ? ` — ${shippingNotes}` : ''}</td>
            <td style="padding:0 0 8px;text-align:right">${money(input.shipping_price)}</td>
          </tr>
          <tr>
            <td style="padding:10px 0 0;border-top:1px solid #BAE6FD;font-weight:700">Total</td>
            <td style="padding:10px 0 0;border-top:1px solid #BAE6FD;text-align:right;font-size:22px;font-weight:700">${money(grandTotal)}</td>
          </tr>
        </table>
        <p style="margin:14px 0 0;font-family:sans-serif;font-size:13px;color:#334155;line-height:1.6">
          This quote is valid until <strong style="color:#0A2540">${escapeHtml(input.valid_until_label)}</strong>. After that date, prices and terms may change.
        </p>
        ${includePayment ? `<p style="margin:10px 0 0;font-family:sans-serif;font-size:13px;color:#92400E;line-height:1.6">
          Bank transfer ${money(grandTotal)}. Credit card ${money(paymentCopy.totals.cardTotal)} (includes a 3% processing fee of ${money(paymentCopy.totals.surcharge)}).
        </p>` : ''}
      </div>`

  const viewUrl = String(input.view_url || '').trim()
  const viewHtml = viewUrl
    ? `<p style="margin:0 0 20px;font-family:sans-serif;font-size:14px;color:#334155;line-height:1.6">You can also open this quote in your browser:<br><a href="${escapeHtml(viewUrl)}" style="color:#0369A1;word-break:break-all">${escapeHtml(viewUrl)}</a></p>`
    : ''

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="background:#FFFFFF;margin:0;padding:32px 16px">
  <div style="max-width:600px;margin:0 auto;background:#FFFFFF;border:1px solid #D3DEE9;border-top:3px solid #0369A1;border-radius:16px;overflow:hidden">
    <div style="background:#FFFFFF;padding:28px 32px;border-bottom:1px solid #D3DEE9">
      <p style="margin:0 0 4px;font-family:sans-serif;font-size:12px;letter-spacing:0.12em;color:#075985;text-transform:uppercase">Shaft Lok Inc.</p>
      <h1 style="margin:0;font-family:sans-serif;font-size:22px;color:#0A2540">Your Shaft Lok Quote</h1>
      ${input.quote_number ? `<p style="margin:8px 0 0;font-family:sans-serif;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:#075985">Quote ${escapeHtml(input.quote_number)}</p>` : ''}
    </div>

    <div style="padding:28px 32px">
      <p style="margin:0 0 20px;font-family:sans-serif;font-size:14px;color:#334155">
        Hi ${safeName}, thanks for your interest${vesselLine ? ` in outfitting <strong style="color:#0A2540">${vesselLine}</strong>` : ''}. Here's your quote:
      </p>

      <p style="font-family:sans-serif;font-size:14px;color:#0A2540;line-height:1.6;margin:0 0 24px;white-space:pre-wrap">${escapeHtml(input.quote_notes)}</p>
      ${inquiryHtml}
      ${itemsHtml}
      ${warningsHtml}
      ${termsHtml}
      ${paymentHtml}
      ${totalHtml}
      ${viewHtml}

      <p style="margin:0;font-family:sans-serif;font-size:14px;color:#334155">
        Questions? Just reply to this email and we'll help you out.
      </p>
    </div>

    <div style="padding:16px 32px;border-top:1px solid #D3DEE9;background:#FFFFFF">
      <p style="margin:0;font-family:sans-serif;font-size:12px;color:#475569">Sent via Shaft Lok Inc. · shaftlok.com</p>
    </div>
  </div>
</body>
</html>`
}

const textLine = (label: string, value: unknown) => {
  const text = String(value ?? '').trim()
  return text ? `${label}: ${text}` : ''
}

export const buildSailorQuoteText = (input: SailorQuoteInput) => {
  const vessel = [input.yacht_type, input.yacht_name].filter(Boolean).join(' — ')
  const grandTotal = Number(input.products_price || 0) + Number(input.shipping_price || 0)
  const shippingNotes = String(input.shipping_notes || '').trim()
  const { includePayment, bankHref, cardHref } = payHrefs(input)
  const paymentCopy = includePayment ? paymentCopyForTotal(input.products_price, input.shipping_price) : null
  const productItems = input.line_items.filter((item) => !isDiscountLine(item))
  const productsGross = Number(
    productItems.reduce((sum, item) => {
      const qty = parseLineQty(item.qty)
      const unit = Number(item.price) || 0
      return sum + lineItemAmount(unit, qty)
    }, 0).toFixed(2)
  )

  const lines: string[] = [
    `Hi ${String(input.name || '').trim() || 'there'},`,
    '',
    `Thanks for your interest${vessel ? ` in outfitting ${vessel}` : ''}. Here is your Shaft Lok quote${input.quote_number ? ` ${input.quote_number}` : ''}.`,
    '',
    String(input.quote_notes || '').trim(),
    '',
    'Items quoted'
  ]

  for (const item of input.line_items) {
    if (isDiscountLine(item)) {
      const percent = clampDiscountPercent(item.price)
      const amount = percent == null ? null : discountLineAmount(productsGross, percent)
      const name = item.product_name || 'Discount'
      lines.push(`- ${name}${item.detail ? ` — ${item.detail}` : ''}: ${percent == null ? '—' : `${percent}%`}${amount == null ? '' : ` (${money(-amount)})`}`)
      continue
    }
    const qty = parseLineQty(item.qty)
    const unit = Number(item.price) || 0
    const name = isCustomLine(item)
      ? (String(item.product_name || '').trim() || CUSTOM_ITEM_LINE_NAME)
      : item.product_name
    lines.push(`- ${name}${item.detail ? ` — ${item.detail}` : ''}: ${qty} x ${money(unit)} = ${money(lineItemAmount(unit, qty))}`)
  }

  lines.push(
    '',
    `Products: ${money(input.products_price)}`,
    `Shipping${shippingNotes ? ` — ${shippingNotes}` : ''}: ${money(input.shipping_price)}`,
    `Total: ${money(grandTotal)}`,
    `This quote is valid until ${input.valid_until_label}. After that date, prices and terms may change.`
  )

  if (includePayment && paymentCopy) {
    lines.push(`Bank transfer ${money(grandTotal)}. Credit card ${money(paymentCopy.totals.cardTotal)} (includes a 3% processing fee of ${money(paymentCopy.totals.surcharge)}).`)
  }

  const inquiry = [
    textLine('Name', input.name),
    textLine('Email', input.email),
    textLine('Company', input.company),
    textLine('Phone', phoneLabel(input.phone, input.phone_region)),
    textLine('Address', input.address),
    textLine('Yacht Type & Length', input.yacht_type),
    textLine('Yacht Name', input.yacht_name),
    textLine('Displacement', input.displacement),
    textLine('Max Hull Speed', input.max_hull_speed),
    textLine('Shaft Diameter', input.shaft_diameter),
    textLine('Propeller Diameter', input.prop_diameter),
    textLine('Propeller Pitch', input.prop_pitch),
    textLine('Number of Blades', input.num_blades),
    textLine('Number of Propellers / Shafts', input.num_propellers),
    textLine('Fixed / Folding / Feathering', input.prop_type),
    textLine('Engine Make & HP', input.engine),
    textLine('Transmission Make & Ratio', input.transmission),
    textLine('Interested In', lockingLabel(input.locking_system, input.cable_length))
  ].filter(Boolean)

  if (inquiry.length || input.notes?.trim()) {
    lines.push('', 'Inquiry', ...inquiry)
    if (input.notes?.trim()) lines.push(input.notes.trim())
  }

  for (const warning of input.warnings) {
    lines.push('', warning.title, ...warning.paragraphs)
  }

  lines.push('', 'Terms and conditions')
  TERMS_AND_CONDITIONS.forEach((term, index) => {
    lines.push(`${index + 1}. ${term}`)
  })

  if (includePayment && paymentCopy) {
    lines.push(
      '',
      'Payment',
      paymentCopy.intro,
      paymentCopy.surchargeWarning,
      paymentCopy.method
    )
    if (bankHref) lines.push(`Pay by Bank Transfer: ${bankHref}`)
    if (cardHref) lines.push(`Pay by Credit Card: ${cardHref}`)
    lines.push(paymentCopy.support)
  }

  const viewUrl = String(input.view_url || '').trim()
  if (viewUrl) {
    lines.push('', `Open this quote in your browser: ${viewUrl}`)
  }

  lines.push(
    '',
    "Questions? Just reply to this email and we'll help you out.",
    '',
    'Shaft Lok Inc.',
    'https://shaftlok.com'
  )

  return lines.join('\n')
}

const SENT_CARD_RE = /<div style="background:rgba\(148,197,255,0\.06\);border:1px solid rgba\(148,197,255,0\.18\);border-radius:10px;padding:18px 20px;margin-bottom:24px">[\s\S]*?<\/div>/g
const SENT_CARD_TITLE_RE = /<p style="margin:0 0 10px;font-family:sans-serif;font-size:13px;letter-spacing:0\.06em;text-transform:uppercase;color:#38BDF8">([^<]+)<\/p>/

const INQUIRY_SECTION_TITLES = [
  'contact',
  'vessel',
  'propeller',
  'engine & transmission',
  'locking system',
  'notes'
]

const decodeCardTitle = (title: string) =>
  title.replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').trim().toLowerCase()

// Previously sent emails were navy. Keep that markup when tidying Last Sent,
// so those previews still match the message the sailor received.
const legacyCard = (title: string, body: string) => `
      <div style="background:rgba(148,197,255,0.06);border:1px solid rgba(148,197,255,0.18);border-radius:10px;padding:18px 20px;margin-bottom:24px">
        <p style="margin:0 0 10px;font-family:sans-serif;font-size:13px;letter-spacing:0.06em;text-transform:uppercase;color:#38BDF8">${escapeHtml(title)}</p>
        ${body}
      </div>`

const legacyField = (label: string, value: unknown) => {
  const text = String(value ?? '').trim()
  if (!text) return ''
  return `<p style="margin:0 0 8px;font-family:sans-serif;font-size:13px;color:#A8BEDC;line-height:1.6"><span style="color:#6B7FA8">${escapeHtml(label)}: </span><span style="color:#EFF6FF">${escapeHtml(text)}</span></p>`
}

const legacyItemsQuotedTableHtml = (rows: {
  itemHtml: string
  qty: string | number
  unitPriceHtml: string
  totalHtml: string
}[]) =>
  `<table style="width:100%;border-collapse:collapse;font-family:sans-serif;font-size:14px;color:#EFF6FF">
          <tr>
            <td style="padding:0 12px 8px 0;text-align:right;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:#38BDF8;white-space:nowrap">Qty</td>
            <td style="padding:0 12px 8px 0;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:#38BDF8">Item</td>
            <td style="padding:0 12px 8px 0;text-align:right;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:#38BDF8;white-space:nowrap">Unit Price</td>
            <td style="padding:0 0 8px;text-align:right;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:#38BDF8;white-space:nowrap">Total</td>
          </tr>
          ${rows.map((row) => `
          <tr>
            <td style="padding:0 12px 10px 0;text-align:right;white-space:nowrap;vertical-align:top;color:#A8BEDC">${row.qty}</td>
            <td style="padding:0 12px 10px 0;vertical-align:top;color:#EFF6FF">${row.itemHtml}</td>
            <td style="padding:0 12px 10px 0;text-align:right;white-space:nowrap;vertical-align:top">${row.unitPriceHtml}</td>
            <td style="padding:0 0 10px;text-align:right;white-space:nowrap;vertical-align:top">${row.totalHtml}</td>
          </tr>`).join('')}
        </table>`

const withInquiryNameEmail = (
  body: string,
  contact?: { name?: string | null; email?: string | null }
) => {
  if (/>Name: <\/span>/.test(body)) return body
  return `${legacyField('Name', contact?.name)}${legacyField('Email', contact?.email)}${body}`
}

const restyleItemsQuotedBody = (body: string) => {
  if (/>Qty</.test(body) && />Unit Price</.test(body) && />Total</.test(body)) return body

  const rows: ReturnType<typeof itemsQuotedRow>[] = []
  for (const match of body.matchAll(/<tr>([\s\S]*?)<\/tr>/g)) {
    const cells = [...match[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map((cell) => cell[1].trim())
    const labels = cells.map((html) => html.replace(/<[^>]+>/g, '').trim().toLowerCase())
    if (labels.includes('item') || labels.includes('qty') || labels.includes('price') || labels.includes('unit price') || labels.includes('total')) continue
    if (cells.length >= 4) {
      rows.push(itemsQuotedRow(cells[1], cells[0], cells[3], cells[2]))
    } else if (cells.length >= 3) {
      rows.push(itemsQuotedRow(cells[0], cells[1], cells[2]))
    } else if (cells.length === 2) {
      rows.push(itemsQuotedRow(cells[0], '1', cells[1]))
    }
  }

  return rows.length ? legacyItemsQuotedTableHtml(rows) : body
}

const quoteNumberLine = (quoteNumber: string) =>
  `<p style="margin:8px 0 0;font-family:sans-serif;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:#38BDF8">Quote ${escapeHtml(quoteNumber)}</p>`

const withQuoteNumberHeader = (html: string, quoteNumber?: string | null) => {
  if (!quoteNumber || /Quote \d{4}-\d{4}-/.test(html)) return html
  return html.replace(
    /(<h1[^>]*>Your Shaft Lok Quote<\/h1>)/,
    `$1\n      ${quoteNumberLine(quoteNumber)}`
  )
}

export function restyleSentSailorQuoteHtml(
  html: string,
  contact?: { name?: string | null; email?: string | null; quote_number?: string | null }
) {
  if (!html) return html

  const matches = [...html.matchAll(SENT_CARD_RE)]
  if (!matches.length) return withQuoteNumberHeader(html, contact?.quote_number)

  const inquiryCards: { full: string; title: string; body: string; index: number }[] = []
  const existingInquiry: { full: string; body: string; index: number }[] = []
  const replacements: { start: number; end: number; html: string }[] = []

  for (const match of matches) {
    const full = match[0]
    const titleMatch = full.match(SENT_CARD_TITLE_RE)
    if (!titleMatch || match.index == null) continue

    const title = titleMatch[1]
    const decoded = decodeCardTitle(title)
    const body = full.slice((titleMatch.index ?? 0) + titleMatch[0].length).replace(/<\/div>\s*$/, '').trim()
    const index = match.index

    if (decoded === 'attached documents') {
      replacements.push({ start: index, end: index + full.length, html: '' })
      continue
    }

    if (decoded === 'items quoted') {
      replacements.push({
        start: index,
        end: index + full.length,
        html: legacyCard('Items Quoted', restyleItemsQuotedBody(body))
      })
      continue
    }

    if (decoded === 'inquiry') {
      existingInquiry.push({ full, body, index })
      continue
    }

    if (INQUIRY_SECTION_TITLES.includes(decoded)) {
      inquiryCards.push({ full, title, body, index })
    }
  }

  if (inquiryCards.length) {
    const orderedBodies = [...inquiryCards]
      .sort((a, b) => {
        const order = INQUIRY_SECTION_TITLES.indexOf(decodeCardTitle(a.title)) - INQUIRY_SECTION_TITLES.indexOf(decodeCardTitle(b.title))
        return order || a.index - b.index
      })
      .map((item) => item.body)
      .join('')

    const first = [...inquiryCards].sort((a, b) => a.index - b.index)[0]
    replacements.push({
      start: first.index,
      end: first.index + first.full.length,
      html: legacyCard('Inquiry', withInquiryNameEmail(orderedBodies, contact))
    })
    for (const item of inquiryCards) {
      if (item.index === first.index) continue
      replacements.push({ start: item.index, end: item.index + item.full.length, html: '' })
    }
  } else if (existingInquiry.length) {
    const target = existingInquiry[0]
    replacements.push({
      start: target.index,
      end: target.index + target.full.length,
      html: legacyCard('Inquiry', withInquiryNameEmail(target.body, contact))
    })
  }

  if (!replacements.length) return withQuoteNumberHeader(html, contact?.quote_number)

  let result = html
  for (const replacement of replacements.sort((a, b) => b.start - a.start)) {
    result = result.slice(0, replacement.start) + replacement.html + result.slice(replacement.end)
  }
  return withQuoteNumberHeader(result, contact?.quote_number)
}
