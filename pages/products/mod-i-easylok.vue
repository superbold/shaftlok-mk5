<template>
  <div>
    <BreadcrumbNav :items="[
      { name: 'Products', href: '/products' },
      { name: 'Mod I EasyLok' }
    ]" />
    
    <div class="product-container">
      <div class="product-detail">
        <div class="product-card">
          <h1 class="page-title">Mod I EasyLok</h1>
          <h2 class="page-description">Small sailboats with engine room space restrictions</h2>
          <div class="product-content">
            <div class="product-image-container">
              <img src="/assets/images/shaftlok-mod-black.jpg" alt="Shaft Lok Mod I EasyLok marine propeller control system - original compact design for small sailboats with engine room space restrictions since 1979" class="product-image" loading="lazy">
            </div>
            <div class="product-description">
              <div class="features-grid">
                <div class="feature-item">
                  <h3 class="feature-title">
                    <i class="fas fa-ruler feature-icon"></i>
                    Max Bore Size
                  </h3>
                  <p class="feature-description">1.77" (45mm)</p>
                </div>
                <div class="feature-item">
                  <h3 class="feature-title">
                    <i class="fas fa-compress-alt feature-icon"></i>
                    Compact Design
                  </h3>
                  <p class="feature-description">Compact design for tight spaces</p>
                </div>
                <div class="feature-item">
                  <h3 class="feature-title">
                    <i class="fas fa-shield-alt feature-icon"></i>
                    Maintenance-Free
                  </h3>
                  <p class="feature-description"><span class="shaftlok-font">Shaft Lok</span> uses double bearing shields</p>
                </div>
                <div class="feature-item">
                  <h3 class="feature-title">
                    <i class="fas fa-medal feature-icon"></i>
                    Premium Construction
                  </h3>
                  <p class="feature-description">316 Stainless Steel construction</p>
                </div>
              </div>
              <div class="details-text">
                <p>Boats with engine room space restrictions.</p>
                <p>Maximum Bore: 45mm, 1.77"</p>
                <p>This a standard stocked unit. About half the size of the Mod II Easy Lok Unit.</p>
                <p>It is the smallest physical size but can handle yachts with a maximum propeller shaft diameter of (45mm) 1.771 inches. One of the most popular propeller sizes is 1 ¾" so our new Mod I can handle it.</p>
                <p>This was the first unit to hit the market in 1979.</p>
                <p>In late 2023 Shaft Lok Inc. upgraded the Mod I with a larger deep-groove ball bearing 6911ZZ by Nachi to include maintenance free double bearing shields. The Basic Dynamic Load Rating is 3,600 Pounds.</p>
                <p>The Mod I Housing, is made of hard marine urethane which is imperious to salt air. The unit's housing will last decades.</p>
                <p>The Mod I Easy Lok unit has a 316 Stainless Steel rotating 4.08" (103.6mm) diameter disc with a 45 degree locking ramp. The hub of the unit, in which the propeller shaft is contained is also made of the best material to fight salt air 316 Stainless Steel.</p>
                <p>The length of the unit is 7.08" (180mm). The width at the Spring Adjustment Screw is 3.346" (85mm). The required propeller shaft space is equal to length through the bore 1.57" (40.0mm).</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'Mod I EasyLok',
  meta: [
    { name: 'description', content: 'Shaft Lok Mod I EasyLok - original marine propeller control system since 1979. Easy installation, reliable locking, proven performance for small sailboats.' },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: 'Shaft Lok Mod I EasyLok - Original Marine Propeller Control System' },
    { property: 'og:description', content: 'Shaft Lok Mod I EasyLok - The original marine shaft locking system. Easy installation, reliable and proven performance for vessels of all sizes.' },
    { property: 'og:image', content: 'https://shaftlok.com/assets/images/shaftlok-mod-black.jpg' },
    { property: 'og:url', content: 'https://shaftlok.com/products/mod-i-easylok' },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'Shaft Lok Inc.' },
    { property: 'og:locale', content: 'en_US' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Shaft Lok Mod I EasyLok - Original Marine Propeller Control System' },
    { name: 'twitter:description', content: 'Shaft Lok Mod I EasyLok - The original marine shaft locking system. Easy installation, reliable and proven performance.' },
    { name: 'twitter:image', content: 'https://shaftlok.com/assets/images/Logo_ShaftLok_whiteBG-landscape.png' }
  ],
  link: [
    { rel: 'canonical', href: 'https://shaftlok.com/products/mod-i-easylok' }
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
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Mod I EasyLok',
            item: 'https://shaftlok.com/products/mod-i-easylok'
          }
        ]
      })
    },
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: 'Mod I EasyLok',
        description: 'The original marine propeller control system. Compact design for small sailboats with engine room space restrictions. Easy installation, reliable security, and proven performance since 1979.',
        brand: {
          '@type': 'Brand',
          name: 'Shaft Lok'
        },
        manufacturer: {
          '@type': 'Organization',
          name: 'Shaft Lok Inc.',
          url: 'https://shaftlok.com'
        },
        image: 'https://shaftlok.com/assets/images/shaftlok-mod-black.jpg',
        url: 'https://shaftlok.com/products/mod-i-easylok',
        category: 'Marine Equipment',
        additionalProperty: [
          {
            '@type': 'PropertyValue',
            name: 'Max Bore Size',
            value: '1.77" (45mm)'
          },
          {
            '@type': 'PropertyValue',
            name: 'Length',
            value: '7.08" (180mm)'
          },
          {
            '@type': 'PropertyValue',
            name: 'Width',
            value: '3.346" (85mm)'
          },
          {
            '@type': 'PropertyValue',
            name: 'Suitable For',
            value: 'Small sailboats with engine room space restrictions'
          },
          {
            '@type': 'PropertyValue',
            name: 'Material',
            value: '316 Stainless Steel construction'
          },
          {
            '@type': 'PropertyValue',
            name: 'Bearing Type',
            value: 'Deep-groove ball bearing 6911ZZ by Nachi'
          },
          {
            '@type': 'PropertyValue',
            name: 'Dynamic Load Rating',
            value: '3,600 Pounds'
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
.product-container {
  margin-top: 8rem;
  min-height: 100vh;
  background: linear-gradient(to bottom, var(--light-cyan), white);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.product-detail {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.product-card {
  background-color: white;
  border: 2px solid var(--federal-blue);
  border-radius: 15px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  animation: fadeIn 1s ease-out forwards;
  opacity: 0;
  position: relative;
}

.page-title {
  text-align: center;
  color: var(--federal-blue);
  font-family: 'DeVinneOrnamentDRegular', serif;
  font-size: var(--font-size-title);
  margin-top: 1rem;
  margin-bottom: 0;
  animation: fadeIn 1s ease-out forwards;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  position: relative;
  z-index: 2;
}

.page-description {
  font-size: var(--font-size-subtitle);
  color: var(--federal-blue);
  max-width: 1200px;
  margin: 0 auto;
  margin-bottom: 2rem;
  animation: fadeIn 1s ease-out 0.5s forwards;
  opacity: 0;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  position: relative;
  z-index: 2;
  text-align: center;
}

.product-content {
  display: flex;
  gap: 2rem;
  padding-top: 2rem;
}

.product-image-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 600px;
}

.product-image {
  width: 100%;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.product-description {
  flex: 2;
  color: #333;
  line-height: 1.6;
  font-size: var(--font-size-description);
  animation: fadeIn 1s ease-out 0.5s forwards;
  opacity: 0;
  height: 600px;
  display: flex;
  flex-direction: column;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: .5rem;
  margin-bottom: 1rem;
}

.feature-item {
  text-align: left;
}

.feature-title {
  font-weight: bold;
  color: #333;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: var(--font-size-subtitle);
  margin: 0;
}

.feature-icon {
  color: var(--honolulu-blue);
  font-size: var(--font-size-icon);
}

.feature-description {
  color: #666;
  font-size: var(--font-size-description);
  margin-top: 0;
  margin-bottom: 0;
  margin-left: 2rem;
}

.shaftlok-font {
  font-family: 'DeVinneOrnamentDRegular', serif;
  color: var(--federal-blue);
}

.details-text {
  flex: 1;
  overflow-y: auto;
  padding-right: 1rem;
  margin-top: 1rem;
  color: #333;
  line-height: 1.2;
}

.details-text::-webkit-scrollbar {
  width: 8px;
}

.details-text::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

.details-text::-webkit-scrollbar-thumb {
  background: var(--honolulu-blue);
  border-radius: 4px;
}

.details-text::-webkit-scrollbar-thumb:hover {
  background: var(--federal-blue);
}

.details-text p {
  margin-bottom: 1rem;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .product-detail {
    padding: 0.5rem;
  }

  .product-card {
    padding: 1.5rem;
    gap: 1.5rem;
  }

  .product-content {
    flex-direction: column;
    gap: 1.5rem;
  }

  .product-image-container {
    width: 100%;
    height: auto;
  }

  .product-description {
    width: 100%;
    height: auto;
  }

  .features-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .feature-description {
    margin-left: 0;
    padding-left: 0;
  }

  .feature-icon {
    display: none;
  }
}
</style>