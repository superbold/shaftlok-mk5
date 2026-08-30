import type { Database } from '~~/types/supabase'

type ProductRow = Database['public']['Tables']['products']['Row']

export interface ProductFeature {
  icon: string
  title: string
  text: string
}

export interface ProductSpec {
  name: string
  value: string
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isProductFeature = (value: unknown): value is ProductFeature =>
  isRecord(value)
  && typeof value.icon === 'string'
  && typeof value.title === 'string'
  && typeof value.text === 'string'

const isProductSpec = (value: unknown): value is ProductSpec =>
  isRecord(value)
  && typeof value.name === 'string'
  && typeof value.value === 'string'

export const formatProductBore = (product: Pick<ProductRow, 'max_bore_size_mm' | 'max_bore_size_inch'>) => {
  if (product.max_bore_size_inch) {
    return product.max_bore_size_inch
  }
  if (product.max_bore_size_mm != null) {
    const mm = Math.round(Number(product.max_bore_size_mm))
    const inches = (Number(product.max_bore_size_mm) / 25.4).toFixed(2)
    return `${inches}" (${mm}mm)`
  }
  return undefined
}

export const parseProductFeatures = (value: ProductRow['features']): ProductFeature[] | null => {
  if (!Array.isArray(value)) return null
  return (value as unknown[]).filter(isProductFeature)
}

export const parseProductSpecs = (value: ProductRow['specs']): ProductSpec[] | null => {
  if (!Array.isArray(value)) return null
  return (value as unknown[]).filter(isProductSpec)
}

export const defaultProductFeatures = (product: Pick<ProductRow, 'max_bore_size_mm' | 'max_bore_size_inch' | 'category'>): ProductFeature[] => {
  const features: ProductFeature[] = []
  const bore = formatProductBore(product)

  if (bore) {
    features.push({
      icon: 'fas fa-ruler',
      title: 'Max Bore Size',
      text: bore
    })
  }

  if (product.category) {
    features.push({
      icon: 'fas fa-fan',
      title: 'Category',
      text: product.category
    })
  }

  return features
}

export const formatProductPrice = (price: number | null | undefined) => {
  if (price === null || price === undefined) return null
  const amount = Number(price)
  if (Number.isNaN(amount)) return null
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

export type ProductDetailBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] }

export const getProductTagline = (
  product: Pick<ProductRow, 'tagline' | 'summary'>
): string => {
  const tagline = product.tagline?.trim()
  if (tagline) return tagline
  return product.summary?.trim() || ''
}

export const getProductDetailsText = (
  product: Pick<ProductRow, 'details' | 'description'>
): string | null | undefined => {
  if (product.details?.trim()) return product.details
  return product.description
}

export const parseProductDetails = (details: string | null | undefined): ProductDetailBlock[] => {
  if (!details?.trim()) return []

  return details
    .trim()
    .split(/\n{2,}/)
    .flatMap((block) => {
      const lines = block.split('\n').map(line => line.trim()).filter(Boolean)
      const bulletLines = lines.filter(line => /^-\s/.test(line))

      if (bulletLines.length > 0) {
        const proseLines = lines.filter(line => !/^-\s/.test(line))
        const blocks: ProductDetailBlock[] = []

        if (proseLines.length > 0) {
          blocks.push({ type: 'paragraph', text: proseLines.join(' ') })
        }

        blocks.push({
          type: 'list',
          items: bulletLines.map(line => line.replace(/^-+\s*/, ''))
        })

        return blocks
      }

      return [{
        type: 'paragraph' as const,
        text: lines.join(' ')
      }]
    })
}

export const formatSpecBullet = (spec: ProductSpec) =>
  spec.name.trim() ? `${spec.name.trim()}: ${spec.value.trim()}` : spec.value.trim()

export const splitLegacyDetails = (details: string | null | undefined) => {
  const introParts: string[] = []
  const specs: ProductSpec[] = []

  for (const block of parseProductDetails(details)) {
    if (block.type === 'paragraph') {
      introParts.push(block.text)
      continue
    }

    for (const item of block.items) {
      const colonIndex = item.indexOf(':')
      if (colonIndex > 0) {
        specs.push({
          name: item.slice(0, colonIndex).trim(),
          value: item.slice(colonIndex + 1).trim()
        })
      } else {
        specs.push({ name: '', value: item })
      }
    }
  }

  return {
    intro: introParts.join('\n\n'),
    specs
  }
}

export const sanitizeProductFeatures = (features: ProductFeature[]) =>
  features
    .map(feature => ({
      icon: feature.icon.trim() || 'fas fa-circle-info',
      title: feature.title.trim(),
      text: feature.text.trim()
    }))
    .filter(feature => feature.title || feature.text)

export const sanitizeProductSpecs = (specs: ProductSpec[]) =>
  specs
    .map(spec => ({
      name: spec.name.trim(),
      value: spec.value.trim()
    }))
    .filter(spec => spec.name || spec.value)

export const getProductFeaturesForDisplay = (
  product: Pick<ProductRow, 'features' | 'max_bore_size_mm' | 'max_bore_size_inch' | 'category'>
): ProductFeature[] => {
  const parsed = parseProductFeatures(product.features)
  if (parsed?.length) return parsed
  return defaultProductFeatures(product)
}

export const buildProductDetailBlocks = (
  product: Pick<ProductRow, 'details' | 'description' | 'specs'>
): ProductDetailBlock[] => {
  const parsedSpecs = parseProductSpecs(product.specs)
  const intro = product.details?.trim() || ''

  if (parsedSpecs?.length) {
    const blocks: ProductDetailBlock[] = []
    if (intro) {
      blocks.push({ type: 'paragraph', text: intro })
    }
    blocks.push({
      type: 'list',
      items: parsedSpecs.map(formatSpecBullet)
    })
    return blocks
  }

  return parseProductDetails(getProductDetailsText(product))
}

export const hydrateProductFormContent = (
  product: Pick<ProductRow, 'details' | 'description' | 'features' | 'specs' | 'max_bore_size_mm' | 'max_bore_size_inch' | 'category'>
) => {
  const storedFeatures = parseProductFeatures(product.features) ?? []
  const storedSpecs = parseProductSpecs(product.specs) ?? []
  const rawDetails = product.details ?? product.description ?? ''

  if (storedSpecs.length) {
    return {
      details: product.details?.trim() || '',
      features: storedFeatures.length ? storedFeatures : defaultProductFeatures(product),
      specs: storedSpecs
    }
  }

  const legacy = splitLegacyDetails(rawDetails)
  return {
    details: legacy.intro,
    features: storedFeatures.length ? storedFeatures : defaultProductFeatures(product),
    specs: legacy.specs
  }
}

export const PRODUCT_FEATURE_ICONS = [
  { value: 'fas fa-ruler', label: 'Size / bore' },
  { value: 'fas fa-arrows-left-right', label: 'Dimensions' },
  { value: 'fas fa-shield-halved', label: 'Construction' },
  { value: 'fas fa-link', label: 'Compatibility' },
  { value: 'fas fa-gears', label: 'Engineering' },
  { value: 'fas fa-clipboard-list', label: 'Ordering' },
  { value: 'fas fa-fan', label: 'Category' },
  { value: 'fas fa-circle-info', label: 'General info' }
] as const
