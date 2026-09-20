export const parseLineQty = (value: unknown): number => {
  const n = Number(value)
  if (!Number.isFinite(n) || n < 1) return 1
  return Math.min(999, Math.floor(n))
}

export const lineItemAmount = (unitPrice: number, qty?: unknown): number =>
  Number((Number(unitPrice) * parseLineQty(qty)).toFixed(2))

/** Reserved line-item slugs — not catalog products. */
export const DISCOUNT_SLUG = 'quote-discount'
export const DISCOUNT_LINE_NAME = 'Discount'
export const DISCOUNT_WARN_PERCENT = 30

export const CUSTOM_ITEM_SLUG = 'quote-custom'
export const CUSTOM_ITEM_LINE_NAME = 'Custom Item'

export type QuoteLineLike = {
  product_slug?: string | null
  product_name?: string | null
  qty?: unknown
  price?: unknown
}

export const isDiscountLine = (item: QuoteLineLike | null | undefined) =>
  item?.product_slug === DISCOUNT_SLUG

export const isCustomLine = (item: QuoteLineLike | null | undefined) =>
  item?.product_slug === CUSTOM_ITEM_SLUG

export const isReservedLineSlug = (slug: string | null | undefined) =>
  slug === DISCOUNT_SLUG || slug === CUSTOM_ITEM_SLUG

export const customLineNeedsName = (item: QuoteLineLike | null | undefined) => {
  if (!isCustomLine(item)) return false
  const name = String(item?.product_name ?? '').trim()
  if (!name) return true
  return name.toLowerCase() === CUSTOM_ITEM_LINE_NAME.toLowerCase()
}

export const parseDiscountPercent = (value: unknown): number | null => {
  if (value === '' || value == null) return null
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

export const clampDiscountPercent = (value: unknown): number | null => {
  const n = parseDiscountPercent(value)
  if (n == null) return null
  if (n < 0) return 0
  if (n > 100) return 100
  return Number(n.toFixed(2))
}

export const discountLineAmount = (gross: number, percent: number) =>
  Number((Number(gross) * percent / 100).toFixed(2))

export const quotedItemsNetTotal = (
  items: QuoteLineLike[],
  productUnitPrice: (item: QuoteLineLike) => number | null
): number | null => {
  const selected = (Array.isArray(items) ? items : []).filter((item) => item?.product_slug)
  const products = selected.filter((item) => !isDiscountLine(item))
  const discount = selected.find(isDiscountLine)
  if (!products.length) return null
  if (products.some((item) => productUnitPrice(item) == null)) return null
  const gross = Number(
    products.reduce((sum, item) => sum + lineItemAmount(productUnitPrice(item) as number, item.qty), 0).toFixed(2)
  )
  if (!discount) return gross
  const percent = clampDiscountPercent(discount.price)
  if (percent == null) return null
  return Number((gross - discountLineAmount(gross, percent)).toFixed(2))
}
