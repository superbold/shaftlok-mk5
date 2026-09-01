export interface ProductPriceTier {
  minFeet: number
  maxFeet: number
  price: number
}

export const MARINE_CONTROL_CABLE_SLUG = 'marine-control-cable'

export const DEFAULT_MARINE_CONTROL_CABLE_TIERS: ProductPriceTier[] = [
  { minFeet: 1, maxFeet: 5, price: 210 },
  { minFeet: 6, maxFeet: 10, price: 215 },
  { minFeet: 11, maxFeet: 15, price: 221 },
  { minFeet: 16, maxFeet: 20, price: 230 },
  { minFeet: 21, maxFeet: 25, price: 265 },
  { minFeet: 26, maxFeet: 30, price: 273 }
]

type PricedProduct = {
  slug?: string | null
  price?: number | null
  price_tiers?: unknown
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isProductPriceTier = (value: unknown): value is ProductPriceTier =>
  isRecord(value)
  && typeof value.minFeet === 'number'
  && typeof value.maxFeet === 'number'
  && typeof value.price === 'number'

export const parseProductPriceTiers = (value: unknown): ProductPriceTier[] | null => {
  if (!Array.isArray(value)) return null
  const tiers = (value as unknown[]).filter(isProductPriceTier)
  return tiers.length ? tiers : null
}

export const sanitizeProductPriceTiers = (tiers: ProductPriceTier[]) =>
  tiers
    .map((tier) => ({
      minFeet: Number(tier.minFeet),
      maxFeet: Number(tier.maxFeet),
      price: Number(tier.price)
    }))
    .filter((tier) =>
      Number.isFinite(tier.minFeet)
      && Number.isFinite(tier.maxFeet)
      && Number.isFinite(tier.price)
      && tier.minFeet > 0
      && tier.maxFeet >= tier.minFeet
      && tier.price >= 0
    )
    .sort((a, b) => a.minFeet - b.minFeet)

export const parseCableLengthFeet = (input: string | null | undefined): number | null => {
  if (!input?.trim()) return null
  const trimmed = input.trim()
  const match = trimmed.match(/(\d+(?:\.\d+)?)\s*(?:ft|feet|')?\b/i)
    ?? trimmed.match(/^(\d+(?:\.\d+)?)$/)
  if (!match) return null
  const feet = Number(match[1])
  return Number.isFinite(feet) && feet > 0 ? feet : null
}

export const getPriceFromTiers = (
  tiers: ProductPriceTier[] | null | undefined,
  lengthFeet: number
): number | null => {
  if (!tiers?.length) return null
  const tier = tiers.find((entry) => lengthFeet >= entry.minFeet && lengthFeet <= entry.maxFeet)
  return tier?.price ?? null
}

export const formatPriceTierRange = (tier: ProductPriceTier) =>
  `${tier.minFeet}–${tier.maxFeet}′`

export const formatPriceTierLabel = (tier: ProductPriceTier) =>
  `${formatPriceTierRange(tier)} — $${tier.price}`

export const getTierForLength = (
  tiers: ProductPriceTier[] | null | undefined,
  lengthFeet: number
): ProductPriceTier | null =>
  tiers?.find((entry) => lengthFeet >= entry.minFeet && lengthFeet <= entry.maxFeet) ?? null

export const getResolvedProductPriceTiers = (
  product: PricedProduct | null | undefined
): ProductPriceTier[] | null => {
  const tiers = parseProductPriceTiers(product?.price_tiers)
  if (tiers?.length) return tiers
  if (product?.slug === MARINE_CONTROL_CABLE_SLUG) return DEFAULT_MARINE_CONTROL_CABLE_TIERS
  return null
}

export const getTierLengthBounds = (tiers: ProductPriceTier[]) => ({
  minFeet: tiers[0]?.minFeet ?? 1,
  maxFeet: tiers[tiers.length - 1]?.maxFeet ?? 30
})

export const getProductLineItemPrice = (
  product: PricedProduct | null | undefined,
  detail: string | null | undefined,
  quoteCableLength?: string | null
): number | null => {
  if (!product) return null

  const tiers = getResolvedProductPriceTiers(product)
  if (tiers?.length) {
    const fromDetail = parseCableLengthFeet(detail)
    if (fromDetail != null) {
      return getPriceFromTiers(tiers, fromDetail)
    }
    if (product.slug === MARINE_CONTROL_CABLE_SLUG && quoteCableLength) {
      const fromQuote = parseCableLengthFeet(quoteCableLength)
      if (fromQuote != null) {
        return getPriceFromTiers(tiers, fromQuote)
      }
    }
    return null
  }

  if (product.price == null || product.price === '') return null
  const amount = Number(product.price)
  return Number.isNaN(amount) ? null : amount
}

export const productUsesLengthPricing = (product: PricedProduct | null | undefined) =>
  Boolean(getResolvedProductPriceTiers(product)?.length)

export const getProductPriceRangeLabel = (tiers: ProductPriceTier[]) => {
  if (!tiers.length) return null
  const prices = tiers.map((tier) => tier.price)
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  if (min === max) return `$${min}`
  return `$${min}–$${max}`
}

export const getProductPriceRangeFromProduct = (product: PricedProduct | null | undefined) => {
  const tiers = getResolvedProductPriceTiers(product)
  return tiers ? getProductPriceRangeLabel(tiers) : null
}
