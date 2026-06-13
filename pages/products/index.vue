<template>
  <div class="page-shell">
    <BreadcrumbNav :items="[{ name: 'Products' }]" />

    <div class="section-head" v-reveal>
      <span class="eyebrow"><i class="fas fa-fan"></i> Product catalog</span>
      <h1><span class="shaftlok-font grad-text">Shaft Lok</span> Products</h1>
      <p>Eight locking systems and two control accessories — covering every shaft from 45&nbsp;mm sailboats to 200&nbsp;mm mega-yachts.</p>
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
          <span class="card-link">View details <i class="fas fa-arrow-right"></i></span>
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
          <span class="card-link">View details <i class="fas fa-arrow-right"></i></span>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
const lockingUnits = [
  {
    name: 'Mod I EasyLok',
    to: '/products/mod-i-easylok',
    image: '/assets/images/shaftlok-mod-red.jpg',
    alt: 'Shaft Lok Mod I EasyLok marine propeller control system - compact design for small sailboats with engine room space restrictions',
    bore: '45mm',
    blurb: 'Entry-level propeller control system for smaller vessels with tight engine rooms.'
  },
  {
    name: 'Mod II EasyLok',
    to: '/products/mod-ii-easylok',
    image: '/assets/images/shaftlok-mod-orange.jpg',
    alt: 'Shaft Lok Mod II EasyLok marine propeller control system - enhanced design for medium-duty sailboats 20-100 feet with 70% market share',
    bore: '57mm',
    badge: 'Most popular',
    blurb: 'The standard for most sailboat applications — 70% of all units shipped since 1979.'
  },
  {
    name: 'Mod II EasyLok High Torque',
    to: '/products/mod-ii-easylok-high-torque',
    image: '/assets/images/shaftlok-mod-purple.jpg',
    alt: 'Shaft Lok Mod II EasyLok High Torque marine propeller control system - heavy-duty design for high-torque applications and commercial vessels',
    bore: '57mm',
    blurb: 'Enhanced version for demanding applications on sailboats 45 to 130 feet.'
  },
  {
    name: 'Mod III EasyLok',
    to: '/products/mod-iii-easylok',
    image: '/assets/images/shaftlok-mod-black.jpg',
    alt: 'Shaft Lok Mod III EasyLok marine propeller control system - advanced design for large vessels with maximum torque handling and rotating disc assembly',
    bore: '80mm',
    blurb: 'Advanced propeller control for larger vessels with ample engine room space.'
  },
  {
    name: 'Mod III EasyLok High Torque',
    to: '/products/mod-iii-easylok-high-torque',
    image: '/assets/images/shaftlok-mod-red.jpg',
    alt: 'Shaft Lok Mod III EasyLok High Torque marine propeller control system - ultimate high-torque design for large vessels with maximum reliability and performance',
    bore: '80mm',
    blurb: 'Large sailboats with no engine room space restrictions and big fixed props.'
  },
  {
    name: 'Mod IV',
    to: '/products/mod-iv',
    image: '/assets/images/shaftlok-mod-purple.jpg',
    alt: 'Shaft Lok Mod IV marine propeller control system - professional-grade design for specialty applications and large motor vessels with custom installation support',
    bore: '110mm',
    blurb: 'Mega-yachts with large propeller shafts — engineered to order.'
  },
  {
    name: 'Mod V',
    to: '/products/mod-v',
    image: '/assets/images/shaftlok-mod-purple.jpg',
    alt: 'Shaft Lok Mod V marine propeller control system - ultimate design for largest yachts and extreme torque requirements with performance-grade locking technology',
    bore: '150mm',
    blurb: 'The largest yachts and extreme torque requirements, custom-built.'
  },
  {
    name: 'Mod VI',
    to: '/products/mod-vi',
    image: '/assets/images/shaftlok-mod-purple.jpg',
    alt: 'Shaft Lok Mod VI marine propeller control system - custom design for specialized applications and unique vessel requirements with extreme environment capabilities',
    bore: '165mm',
    blurb: 'Our premium model for specialized applications requiring the highest precision.'
  }
]

const accessories = [
  {
    name: 'Simple Spring Locking System',
    to: '/products/simple-spring-locking-system',
    image: '/assets/images/SpringLockingSystem_withHandle.jpg',
    alt: 'Shaft Lok Simple Spring Locking System - cost-effective marine propeller control solution with manual operation and easy installation for smaller vessels',
    blurb: 'Locks the prop from the engine room — inexpensive, compact, reliable.'
  },
  {
    name: 'Marine Control Cable',
    to: '/products/marine-control-cable',
    image: '/assets/images/marine-control-cable.png',
    alt: 'Shaft Lok Marine Control Cable - durable marine-grade control cables for convenient cockpit operation of propeller locking systems without engine room access',
    blurb: 'Operate your Shaft Lok from the cockpit — no engine room access needed.'
  }
]

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
      children: JSON.stringify({
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
