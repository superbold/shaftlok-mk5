import { Resend } from 'resend'
import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'
import { getApplicableWarnings } from '~/utils/quoteItemWarnings'
import { formatQuoteValidUntil } from '~/utils/quoteValidity'
import { formatQuoteNumber, quoteNumberFor } from '~/utils/quoteNumber'
import { clampDiscountPercent, isDiscountLine, parseLineQty, quotedItemsNetTotal } from '~/utils/quoteLineItem'
import { buildSailorQuoteHtml } from '~/utils/sailorQuoteHtml'

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

  const lineItems = Array.isArray(quote.line_items)
    ? (quote.line_items as { product_slug: string; product_name: string; detail: string | null; qty?: number | null; price?: number | null }[])
        .filter((item) => item?.product_slug)
    : []

  const productItems = lineItems.filter((item) => !isDiscountLine(item))
  const productUnitPrice = (item: { price?: number | null }) => {
    if (item.price === null || item.price === undefined || item.price === '') return null
    const n = Number(item.price)
    return Number.isFinite(n) ? n : null
  }

  const productsPrice = quotedItemsNetTotal(lineItems, productUnitPrice)

  if (
    !productItems.length
    || productsPrice == null
    || quote.shipping_price == null
    || !String(quote.shipping_notes || '').trim()
    || !quote.quote_notes
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Set a price on each quoted item, shipping (details and price), and quote message before sending.'
    })
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

  const shippingPrice = Number(quote.shipping_price)
  const sentAt = new Date().toISOString()
  const validUntilLabel = formatQuoteValidUntil(sentAt)
  const quoteNumber = quoteNumberFor(quote, quote.name) || formatQuoteNumber(sentAt, quote.name)

  const normalizedLineItems = lineItems.map((item) => (
    isDiscountLine(item)
      ? {
          product_slug: item.product_slug,
          product_name: item.product_name || 'Discount',
          detail: item.detail || null,
          qty: 1,
          price: clampDiscountPercent(item.price) as number
        }
      : {
          product_slug: item.product_slug,
          product_name: item.product_name ?? '',
          detail: item.detail || null,
          qty: parseLineQty(item.qty),
          price: productUnitPrice(item) as number
        }
  ))

  const attachmentIds = Array.isArray(quote.attachment_ids)
    ? (quote.attachment_ids as string[]).filter(Boolean)
    : []

  const emailAttachments: { filename: string; content: Buffer }[] = []

  if (attachmentIds.length) {
    const { data: docs, error: docsError } = await supabase
      .from('library_documents')
      .select('id, title, file_name, storage_path')
      .in('id', attachmentIds)

    if (docsError) {
      console.error('Error loading library documents for quote:', docsError)
      throw createError({ statusCode: 500, statusMessage: 'Could not load library attachments.' })
    }

    const byId = new Map((docs || []).map((doc) => [doc.id, doc]))
    if (byId.size !== attachmentIds.length) {
      throw createError({
        statusCode: 400,
        statusMessage: 'One or more selected library documents are missing. Re-check attachments and try again.'
      })
    }

    for (const id of attachmentIds) {
      const doc = byId.get(id)!
      const { data: blob, error: downloadError } = await supabase.storage
        .from('shaft-lok-library')
        .download(doc.storage_path)

      if (downloadError || !blob) {
        console.error('Error downloading library file for quote:', doc.id, downloadError)
        throw createError({
          statusCode: 500,
          statusMessage: `Could not attach “${doc.file_name}”. Try again or remove it from the quote.`
        })
      }

      emailAttachments.push({
        filename: doc.file_name,
        content: Buffer.from(await blob.arrayBuffer())
      })
    }
  }

  const html = buildSailorQuoteHtml({
    name: quote.name,
    email: quote.email,
    company: quote.company,
    phone: quote.phone,
    phone_region: quote.phone_region,
    address: quote.address,
    yacht_type: quote.yacht_type,
    yacht_name: quote.yacht_name,
    displacement: quote.displacement,
    max_hull_speed: quote.max_hull_speed,
    shaft_diameter: quote.shaft_diameter,
    prop_diameter: quote.prop_diameter,
    prop_pitch: quote.prop_pitch,
    num_blades: quote.num_blades,
    num_propellers: quote.num_propellers,
    prop_type: quote.prop_type,
    engine: quote.engine,
    transmission: quote.transmission,
    locking_system: quote.locking_system,
    cable_length: quote.cable_length,
    notes: quote.notes,
    quote_notes: quote.quote_notes,
    quote_number: quoteNumber,
    shipping_notes: String(quote.shipping_notes).trim(),
    shipping_price: shippingPrice,
    products_price: productsPrice,
    line_items: normalizedLineItems,
    warnings: getApplicableWarnings(normalizedLineItems),
    valid_until_label: validUntilLabel
  })

  await resend.emails.send({
    from: 'Shaft Lok Quotes <quote@contact.shaftlok.com>',
    to: quote.email,
    replyTo: senderEmail,
    cc: ccEmails,
    subject: quoteNumber ? `Your Shaft Lok Quote ${quoteNumber}` : 'Your Shaft Lok Quote',
    html,
    ...(emailAttachments.length ? { attachments: emailAttachments } : {})
  })

  const { error: updateError } = await supabase
    .from('quotes')
    .update({
      status: 'sent',
      quoted_price: productsPrice,
      line_items: normalizedLineItems,
      attachment_ids: attachmentIds,
      sent_at: sentAt,
      sent_html: html,
      quote_number: quoteNumber,
      sent_quoted_price: productsPrice,
      sent_quote_notes: quote.quote_notes,
      sent_line_items: normalizedLineItems,
      sent_shipping_price: quote.shipping_price,
      sent_shipping_notes: quote.shipping_notes,
      sent_attachment_ids: attachmentIds,
      updated_at: sentAt
    })
    .eq('id', quoteId)

  if (updateError) {
    console.error('Error updating quote after send:', updateError)
    throw createError({ statusCode: 500, statusMessage: 'Quote email sent, but failed to update status.' })
  }

  return { ok: true }
})
