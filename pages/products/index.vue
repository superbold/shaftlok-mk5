<template>
  <div class="page-shell">
    <BreadcrumbNav :items="[{ name: 'Products' }]" />

    <div class="section-head" v-reveal>
      <span class="eyebrow"><i class="fas fa-fan"></i> Product catalog</span>
      <h1><span class="shaftlok-font grad-text">Shaft Lok</span> Products</h1>
      <p>Eight locking systems and two control accessories — covering every shaft from 45&nbsp;mm sailboats to 200&nbsp;mm mega-yachts.</p>
    </div>

    <div v-if="productsError" class="fetch-error">
      <i class="fas fa-exclamation-triangle"></i>
      Unable to load the product catalog right now. Please try again later.
    </div>

    <h2 class="group-title" v-reveal><i class="fas fa-lock"></i> Locking Units</h2>
    <div class="products-grid">
      <NuxtLink
        v-for="(product, i) in lockingUnits"
        :key="product.to"
        :to="product.to"
        class="product-card glass-card hoverable"
        v-reveal="(i % 3) * 100"
      >
        <div class="card-media">
          <img :src="product.image" :alt="product.alt" loading="lazy">
          <span v-if="product.badge" class="card-badge">{{ product.badge }}</span>
        </div>
        <div class="card-body">
          <div class="card-top">
            <h3>{{ product.name }}</h3>
            <span v-if="product.bore" class="bore-tag">{{ product.bore }}</span>
          </div>
          <p>{{ product.blurb }}</p>
          <span class="card-link">Read more <i class="fas fa-arrow-right"></i></span>
        </div>
      </NuxtLink>
    </div>

    <h2 class="group-title" v-reveal><i class="fas fa-sliders"></i> Controls &amp; Accessories</h2>
    <div class="products-grid">
      <NuxtLink
        v-for="(product, i) in accessories"
        :key="product.to"
        :to="product.to"
        class="product-card glass-card hoverable"
        v-reveal="(i % 3) * 100"
      >
        <div class="card-media">
          <img :src="product.image" :alt="product.alt" loading="lazy">
        </div>
        <div class="card-body">
          <div class="card-top">
            <h3>{{ product.name }}</h3>
          </div>
          <p>{{ product.blurb }}</p>
          <span class="card-link">Read more <i class="fas fa-arrow-right"></i></span>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient()

const { data: products, error: productsError } = await useAsyncData('products', async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('display', true)
    .order('id', { ascending: true })

  if (error) throw error
  return data || []
})

const mapProduct = (product) => ({
  ...product,
  to: `/products/${product.slug}`,
  image: product.image_url,
  bore: product.max_bore_size_mm
    ? `${Math.round(product.max_bore_size_mm)}mm`
    : (product.category === 'Locking Units' ? 'Custom' : null),
  blurb: product.summary || product.description
})

const lockingUnits = computed(() =>
  (products.value || []).filter(p => p.category === 'Locking Units').map(mapProduct)
)

const accessories = computed(() =>
  (products.value || []).filter(p => p.category === 'Controls & Accessories').map(mapProduct)
)

useHead({
  title: 'Shaft Lok - Products',
  meta: [
    { name: 'description', content: 'Shaft Lok marine propeller control systems - complete range from Mod I to Mod VI EasyLok. Find the perfect propeller locking system for your vessel. Expert installation support.' },
    { property: 'og:title', content: 'Shaft Lok Products - Marine Propeller Control Systems' },
    { property: 'og:description', content: 'Explore ShaftLok\'s complete range of marine propeller control systems. From Mod I EasyLok to high-torque solutions, find the perfect propeller locking system for improved sailing performance.' },
    { property: 'og:image', content: 'https://shaftlok.com/assets/images/Logo_propeller_only.png' },
    { property: 'og:url', content: 'https://shaftlok.com/products' },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'Shaft Lok Inc.' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Shaft Lok Products - Marine Propeller Control Systems' },
    { name: 'twitter:description', content: 'Explore ShaftLok\'s complete range of marine propeller control systems. From Mod I EasyLok to high-torque solutions.' },
    { name: 'twitter:image', content: 'https://shaftlok.com/assets/images/Logo_ShaftLok_whiteBG-landscape.png' }
  ],
  link: [
    { rel: 'canonical', href: 'https://shaftlok.com/products' }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://shaftlok.com/'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Products',
            item: 'https://shaftlok.com/products'
          }
        ]
      })
    }
  ]
})

definePageMeta({
  layout: 'default'
})
</script>

<style scoped>
.fetch-error {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background: rgba(248, 113, 113, 0.1);
  border: 1px solid rgba(248, 113, 113, 0.35);
  color: #FCA5A5;
  padding: 1rem;
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
  margin: 1.5rem 0;
}

.group-title {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1.35rem;
  margin: 3rem 0 1.5rem;
}

.group-title i {
  color: var(--accent);
  font-size: 1.05rem;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.4rem;
}

.product-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  text-decoration: none;
  border-radius: var(--radius-lg);
}

.card-media {
  position: relative;
  background: #fff;
  height: 200px;
}

.card-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.card-badge {
  position: absolute;
  top: 0.9rem;
  left: 0.9rem;
  font-family: var(--font-display);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #04121F;
  background: var(--grad-accent);
  border-radius: 999px;
  padding: 0.35rem 0.9rem;
  box-shadow: 0 6px 18px -6px rgba(56, 189, 248, 0.65);
}

.card-body {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 1.4rem 1.5rem 1.5rem;
}

.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
  margin-bottom: 0.5rem;
}

.card-body h3 {
  font-size: 1.12rem;
  margin: 0;
}

.bore-tag {
  flex-shrink: 0;
  font-family: var(--font-display);
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--accent);
  background: rgba(56, 189, 248, 0.1);
  border: 1px solid rgba(56, 189, 248, 0.3);
  border-radius: 999px;
  padding: 0.22rem 0.7rem;
}

.card-body p {
  color: var(--text-mid);
  font-size: 0.93rem;
  margin: 0 0 1.2rem;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-display);
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--accent);
  transition: gap 0.25s ease;
}

.product-card:hover .card-link { gap: 0.85rem; }

@media (max-width: 920px) {
  .products-grid { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 580px) {
  .products-grid { grid-template-columns: 1fr; }
}
</style>
