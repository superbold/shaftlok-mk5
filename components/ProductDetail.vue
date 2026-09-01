<template>
  <div class="page-shell">
    <BreadcrumbNav :items="[{ name: 'Products', to: '/products' }, { name: product.name }]" />

    <div class="product-hero" v-reveal>
      <span class="eyebrow"><i class="fas fa-fan"></i> {{ categoryLabel }}</span>
      <h1>{{ product.name }}</h1>
      <p v-if="tagline" class="tagline">{{ tagline }}</p>
    </div>

    <div class="product-layout">
      <div class="product-media" v-reveal="100">
        <div class="media-frame glass-card">
          <img v-if="image" :src="image" :alt="imageAlt" loading="lazy">
          <div v-else class="media-placeholder">
            <i class="fas fa-image"></i>
            <span>No product image</span>
          </div>
        </div>
        <div class="media-chip">
          <template v-if="formattedPrice">
            <i class="fas fa-tag"></i>
            <span v-if="priceTiers.length">Price by length <strong>{{ formattedPrice }}</strong></span>
            <span v-else>Price <strong>{{ formattedPrice }}</strong></span>
          </template>
          <NuxtLink v-else to="/quote" class="media-chip-link">
            <i class="fas fa-envelope"></i>
            <span>Request Price &amp; Delivery</span>
          </NuxtLink>
        </div>
        <div v-if="priceTiers.length" class="price-tiers glass-card">
          <h3><i class="fas fa-ruler"></i> Pricing by length</h3>
          <ul>
            <li v-for="(tier, i) in priceTiers" :key="i">
              {{ formatPriceTierRange(tier) }} — <strong>{{ formatProductPrice(tier.price) }}</strong>
            </li>
          </ul>
        </div>
      </div>

      <div class="product-info">
        <div v-if="features.length" class="spec-grid" v-reveal="150">
          <div v-for="(feature, i) in features" :key="i" class="spec-card glass-card hoverable">
            <i :class="[feature.icon, 'spec-icon']"></i>
            <h3>{{ feature.title }}</h3>
            <p v-html="feature.text"></p>
          </div>
        </div>

        <div v-if="detailBlocks.length" class="product-body glass-card prose" v-reveal="200">
          <h2><i class="fas fa-circle-info"></i> Details</h2>
          <template v-for="(block, i) in detailBlocks" :key="i">
            <p v-if="block.type === 'paragraph'">{{ block.text }}</p>
            <ul v-else>
              <li v-for="(item, j) in block.items" :key="j">{{ item }}</li>
            </ul>
          </template>
        </div>

        <div class="product-cta" v-reveal="250">
          <NuxtLink to="/quote" class="btn btn-primary">
            <i class="fas fa-envelope"></i> Request Price &amp; Delivery
          </NuxtLink>
          <NuxtLink to="/installation" class="btn btn-ghost">
            <i class="fas fa-wrench"></i> Installation Guide
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Database } from '~~/types/supabase'
import {
  formatPriceTierRange,
  getProductPriceRangeLabel,
  getResolvedProductPriceTiers
} from '~~/utils/productPricing'

type ProductRow = Database['public']['Tables']['products']['Row']

const props = defineProps<{
  slug: string
}>()

const supabase = useSupabaseClient()

const { data: product, error: productError } = await useAsyncData(
  `product-detail-${props.slug}`,
  async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', props.slug)
      .eq('display', true)
      .single()

    if (error) throw error
    return data
  },
  {
    watch: [() => props.slug],
    getCachedData: () => undefined
  }
)

if (productError.value || !product.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Product not found'
  })
}

const productData = computed(() => product.value as ProductRow)

const image = computed(() => productData.value.image_url ?? undefined)
const imageAlt = computed(() => productData.value.alt ?? productData.value.name)
const tagline = computed(() => getProductTagline(productData.value))
const priceTiers = computed(() => getResolvedProductPriceTiers(productData.value) ?? [])
const formattedPrice = computed(() => {
  if (priceTiers.value.length) {
    return getProductPriceRangeLabel(priceTiers.value)
  }
  return formatProductPrice(productData.value.price)
})
const categoryLabel = computed(() => productData.value.category || 'Propeller Control System')
const features = computed(() => getProductFeaturesForDisplay(productData.value))
const specs = computed(() => parseProductSpecs(productData.value.specs) ?? [])
const detailBlocks = computed(() => buildProductDetailBlocks(productData.value))

const metaDescription = computed(() =>
  productData.value.description || productData.value.summary || `${productData.value.name} — Shaft Lok marine propeller control system.`
)

const pageUrl = `https://shaftlok.com/products/${props.slug}`
const ogImage = computed(() =>
  productData.value.image_url ? `https://shaftlok.com${productData.value.image_url}` : 'https://shaftlok.com/assets/images/Logo_propeller_only.png'
)
const ogTitle = computed(() => `Shaft Lok ${productData.value.name} - Marine Propeller Control System`)

useHead({
  title: () => productData.value.name,
  meta: [
    { name: 'description', content: metaDescription },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: () => ogTitle.value },
    { property: 'og:description', content: metaDescription },
    { property: 'og:image', content: ogImage },
    { property: 'og:url', content: pageUrl },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'Shaft Lok Inc.' },
    { property: 'og:locale', content: 'en_US' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: () => ogTitle.value },
    { name: 'twitter:description', content: metaDescription },
    { name: 'twitter:image', content: 'https://shaftlok.com/assets/images/Logo_ShaftLok_whiteBG-landscape.png' }
  ],
  link: [
    { rel: 'canonical', href: pageUrl }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://shaftlok.com/' },
          { '@type': 'ListItem', position: 2, name: 'Products', item: 'https://shaftlok.com/products' },
          { '@type': 'ListItem', position: 3, name: productData.value.name, item: pageUrl }
        ]
      })
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: productData.value.name,
        description: metaDescription.value,
        brand: { '@type': 'Brand', name: 'Shaft Lok' },
        manufacturer: {
          '@type': 'Organization',
          name: 'Shaft Lok Inc.',
          url: 'https://shaftlok.com'
        },
        image: ogImage.value,
        url: pageUrl,
        category: 'Marine Equipment',
        ...(productData.value.price != null
          ? {
              offers: {
                '@type': 'Offer',
                price: productData.value.price,
                priceCurrency: 'USD',
                availability: 'https://schema.org/InStock',
                url: pageUrl
              }
            }
          : {}),
        ...(specs.value.length
          ? {
              additionalProperty: specs.value.map((spec) => ({
                '@type': 'PropertyValue',
                name: spec.name,
                value: spec.value
              }))
            }
          : {})
      })
    }
  ]
})
</script>

<style scoped>
.product-hero {
  text-align: center;
  max-width: 800px;
  margin: 0 auto 3rem;
}

.product-hero h1 {
  font-size: clamp(2.2rem, 4.5vw, 3.6rem);
  margin: 0 0 0.8rem;
  background: var(--grad-text);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.tagline {
  font-size: var(--font-size-subtitle);
  color: var(--text-mid);
  margin: 0;
}

.product-layout {
  display: grid;
  grid-template-columns: 0.85fr 1.15fr;
  gap: 2.5rem;
  align-items: start;
}

.product-media {
  position: sticky;
  top: calc(var(--nav-height) + 1.5rem);
}

.media-frame {
  overflow: hidden;
  border-radius: var(--radius-lg);
  background: #fff;
}

.media-frame img {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 1 / 1;
  object-fit: contain;
  padding: 1.25rem;
}

.media-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  aspect-ratio: 1 / 1;
  color: var(--text-low);
  font-family: var(--font-display);
}

.media-placeholder i {
  font-size: 2rem;
  color: var(--accent);
}

.media-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  margin-top: 1.2rem;
  font-family: var(--font-display);
  font-size: 0.95rem;
  color: var(--text-mid);
  background: rgba(56, 189, 248, 0.08);
  border: 1px solid rgba(56, 189, 248, 0.3);
  border-radius: 999px;
  padding: 0.6rem 1.3rem;
}

.media-chip i { color: var(--accent); }
.media-chip strong { color: var(--accent-2); }

.media-chip-link {
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  color: inherit;
  text-decoration: none;
  transition: color 0.2s ease;
}

.media-chip-link:hover {
  color: var(--text-hi);
}

.media-chip-link:hover i {
  color: var(--accent-2);
}

.price-tiers {
  margin-top: 1rem;
  padding: 1.1rem 1.25rem;
  border-radius: var(--radius-md);
}

.price-tiers h3 {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  margin: 0 0 0.75rem;
  font-size: 0.95rem;
  color: var(--text-hi);
}

.price-tiers h3 i {
  color: var(--accent);
}

.price-tiers ul {
  margin: 0;
  padding-left: 1.1rem;
  color: var(--text-mid);
  line-height: 1.65;
}

.price-tiers strong {
  color: var(--text-hi);
}

.spec-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.1rem;
  margin-bottom: 1.5rem;
}

.spec-card {
  padding: 1.4rem 1.5rem;
  border-radius: var(--radius-md);
}

.spec-icon {
  font-size: 1.15rem;
  color: var(--accent);
  background: rgba(56, 189, 248, 0.1);
  border: 1px solid rgba(56, 189, 248, 0.28);
  border-radius: var(--radius-sm);
  width: 2.5rem;
  height: 2.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.9rem;
}

.spec-card h3 {
  font-size: 1.02rem;
  margin: 0 0 0.35rem;
}

.spec-card p {
  font-size: 0.92rem;
  color: var(--text-mid);
  margin: 0;
}

.spec-card p :deep(.shaftlok-font) { color: var(--text-hi); }

.product-body {
  padding: 2rem 2.2rem;
  border-radius: var(--radius-lg);
}

.product-body h2 {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  font-size: 1.25rem;
  margin: 0 0 1.2rem;
}

.product-body h2 i { color: var(--accent-2); font-size: 1.05rem; }

.product-body p,
.product-body ul {
  color: var(--text-mid);
  line-height: 1.7;
}

.product-body ul {
  margin: 0 0 1rem;
  padding-left: 1.2rem;
}

.product-body li {
  margin-bottom: 0.45rem;
}

.product-cta {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 1.6rem;
}

@media (max-width: 920px) {
  .product-layout { grid-template-columns: 1fr; }
  .product-media { position: static; max-width: 460px; margin: 0 auto; }
}

@media (max-width: 560px) {
  .spec-grid { grid-template-columns: 1fr; }
  .product-body { padding: 1.5rem 1.4rem; }
}
</style>
