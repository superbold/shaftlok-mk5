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
  return value.filter((item): item is ProductFeature =>
    !!item
    && typeof item === 'object'
    && typeof (item as ProductFeature).icon === 'string'
    && typeof (item as ProductFeature).title === 'string'
    && typeof (item as ProductFeature).text === 'string'
  )
}

export const parseProductSpecs = (value: ProductRow['specs']): ProductSpec[] | null => {
  if (!Array.isArray(value)) return null
  return value.filter((item): item is ProductSpec =>
    !!item
    && typeof item === 'object'
    && typeof (item as ProductSpec).name === 'string'
    && typeof (item as ProductSpec).value === 'string'
  )
}

export const defaultProductFeatures = (product: ProductRow): ProductFeature[] => {
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
