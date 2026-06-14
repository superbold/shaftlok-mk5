<template>
  <div class="page-shell">
    <BreadcrumbNav :items="[{ name: 'Products', to: '/products' }, { name: name }]" />

    <div class="product-hero" v-reveal>
      <span class="eyebrow"><i class="fas fa-fan"></i> {{ category }}</span>
      <h1>{{ name }}</h1>
      <p class="tagline">{{ tagline }}</p>
    </div>

    <div class="product-layout">
      <div class="product-media" v-reveal="100">
        <div class="media-frame glass-card">
          <img :src="image" :alt="imageAlt" loading="lazy">
        </div>
        <div v-if="bore" class="bore-chip">
          <i class="fas fa-ruler"></i>
          <span>Max bore <strong>{{ bore }}</strong></span>
        </div>
      </div>

      <div class="product-info">
        <div class="spec-grid" v-reveal="150">
          <div v-for="(feature, i) in features" :key="i" class="spec-card glass-card hoverable">
            <i :class="[feature.icon, 'spec-icon']"></i>
            <h3>{{ feature.title }}</h3>
            <p v-html="feature.text"></p>
          </div>
        </div>

        <div class="product-body glass-card prose" v-reveal="200">
          <h2><i class="fas fa-circle-info"></i> Details</h2>
          <slot />
        </div>

        <div class="product-cta" v-reveal="250">
          <NuxtLink to="/contact" class="btn btn-primary">
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
interface Feature {
  icon: string
  title: string
  text: string
}

interface Spec {
  name: string
  value: string
}

const props = withDefaults(defineProps<{
  name: string
  slug: string
  tagline: string
  description: string
  ogTitle?: string
  image: string
  imageAlt: string
  bore?: string
  category?: string
  features: Feature[]
  specs?: Spec[]
}>(), {
  category: 'Propeller Control System'
})

const pageUrl = `https://shaftlok.com/products/${props.slug}`
const ogImage = `https://shaftlok.com${props.image}`
const ogTitle = props.ogTitle || `Shaft Lok ${props.name} - Marine Propeller Control System`

useHead({
  title: props.name,
  meta: [
    { name: 'description', content: props.description },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: ogTitle },
    { property: 'og:description', content: props.description },
    { property: 'og:image', content: ogImage },
    { property: 'og:url', content: pageUrl },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'Shaft Lok Inc.' },
    { property: 'og:locale', content: 'en_US' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: ogTitle },
    { name: 'twitter:description', content: props.description },
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
          { '@type': 'ListItem', position: 3, name: props.name, item: pageUrl }
        ]
      })
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: props.name,
        description: props.description,
        brand: { '@type': 'Brand', name: 'Shaft Lok' },
        manufacturer: {
          '@type': 'Organization',
          name: 'Shaft Lok Inc.',
          url: 'https://shaftlok.com'
        },
        image: ogImage,
        url: pageUrl,
        category: 'Marine Equipment',
        ...(props.specs?.length
          ? {
              additionalProperty: props.specs.map((spec) => ({
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

.bore-chip {
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

.bore-chip i { color: var(--accent); }
.bore-chip strong { color: var(--text-hi); }

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
