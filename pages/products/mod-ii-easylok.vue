<template>
  <div>
    <BreadcrumbNav :items="[{ name: 'Products', to: '/products' }, { name: 'Mod II EasyLok' }]" />
    
    <div class="product-container">
      <div class="product-detail">
        <div class="product-card">
          <h1 class="page-title">Mod II EasyLok</h1>
          <h2 class="page-description">Sailboats: 20 to 100 feet with some engine room space restrictions</h2>
          <div class="product-content">
            <div class="product-image-container">
              <img src="/assets/images/shaftlok-mod-orange.jpg" alt="Shaft Lok Mod II EasyLok marine propeller control system - enhanced design for medium-duty sailboats 20-100 feet with 70% market share and improved locking features" class="product-image" loading="lazy">
            </div>
            <div class="product-description">
              <div class="features-grid">
                <div class="feature-item">
                  <h3 class="feature-title">
                    <i class="fas fa-ruler feature-icon"></i>
                    Max Bore Size
                  </h3>
                  <p class="feature-description">2.25" (57.15mm)</p>
                </div>
                <div class="feature-item">
                  <h3 class="feature-title">
                    <i class="fas fa-trophy feature-icon"></i>
                    Most Popular Unit
                  </h3>
                  <p class="feature-description">70% of all units sold since 1979 are Mod II units</p>
                </div>
                <div class="feature-item">
                  <h3 class="feature-title">
                    <i class="fas fa-screwdriver feature-icon"></i>
                    Installation
                  </h3>
                  <p class="feature-description"><span class="shaftlok-font">Shaft Lok</span> is quick and easy to install</p>
                </div>
                <div class="feature-item">
                  <h3 class="feature-title">
                    <i class="fas fa-medal feature-icon"></i>
                    Premium Construction
                  </h3>
                  <p class="feature-description"><span class="shaftlok-font">Shaft Lok</span> uses stainless steel fasteners</p>
                </div>
              </div>
              <div class="details-text">
                <p>Boats with some engine room space restrictions.</p>
                <p>The maximum Mod II Easy Lok bore size is 2.25" or 57.15mm.</p>
                <p>The width of the unit is 2.00" or 50.8mm.</p>
                <p>The Mod II Easy Lok unit is Shaft Lok's most popular unit. Out of approximately 1400 units shipped since 1979 about 70% are Mod II units. This means the components are usually in stock.</p>
                <p>A question frequently asked: "How is the unit secured to the propeller shaft?" There are four 3/8" 9.525mm diameter x 24 thread stainless steel cup pointed set screws in the stainless steel hub that are fastened to the shaft. The shaft needs to be dimpled for which a drill bit is provided. This Mod II unit is about twice the size of the Mod I Easy Lok unit and about half the size of the Mod III Easy Lok unit. Feathering propellers produce more speed when sailing and result in more drive train life.</p>
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
  title: 'Mod II EasyLok',
  meta: [
    { name: 'description', content: 'Shaft Lok Mod II EasyLok - enhanced marine propeller control system with improved locking features. Perfect for medium-duty sailboats 20-100 feet. 70% market share.' },
    { property: 'og:title', content: 'Shaft Lok Mod II EasyLok - Enhanced Marine Propeller Control System' },
    { property: 'og:description', content: 'Shaft Lok Mod II EasyLok - Enhanced marine propeller control system with improved locking features. Perfect for medium-duty and performance applications requiring reliable propeller control.' },
    { property: 'og:image', content: 'https://shaftlok.com/assets/images/shaftlok-mod-orange.jpg' },
    { property: 'og:url', content: 'https://shaftlok.com/products/mod-ii-easylok' },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'Shaft Lok Inc.' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Shaft Lok Mod II EasyLok - Enhanced Marine Propeller Control System' },
    { name: 'twitter:description', content: 'Shaft Lok Mod II EasyLok - Enhanced marine propeller control system with improved locking features. Perfect for medium-duty and performance applications.' },
    { name: 'twitter:image', content: 'https://shaftlok.com/assets/images/Logo_ShaftLok_whiteBG-landscape.png' }
  ],
  link: [
    { rel: 'canonical', href: 'https://shaftlok.com/products/mod-ii-easylok' }
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
            name: 'Mod II EasyLok',
            item: 'https://shaftlok.com/products/mod-ii-easylok'
          }
        ]
      })
    },
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Mod II EasyLok - Enhanced Marine Shaft Locking System for Medium-Duty Sailboats',
            description: 'Shaft Lok Mod II EasyLok - enhanced marine shaft locking system for medium-duty sailboats 20-100 feet with 70% market share and improved locking features',
            url: 'https://shaftlok.com/products/mod-ii-easylok',
            isPartOf: {
              '@type': 'WebSite',
              name: 'Shaft Lok Inc.',
              url: 'https://shaftlok.com'
            },
            about: {
              '@type': 'Product',
              name: 'Marine Shaft Locking Systems',
              description: 'Engine room shaft locks that prevent propeller shaft spinning for improved sailboat performance and quieter engine room operation',
              category: 'Marine Equipment',
              brand: 'Shaft Lok'
            },
            mainEntity: {
              '@type': 'Product',
              name: 'Mod II EasyLok'
            }
          })
        },
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
        name: 'Mod II EasyLok',
        description: 'Enhanced marine propeller control system with improved locking features. Perfect for medium-duty and performance applications requiring reliable propeller control. Suitable for sailboats 20 to 100 feet with some engine room space restrictions.',
        brand: {
          '@type': 'Brand',
          name: 'Shaft Lok'
        },
        manufacturer: {
          '@type': 'Organization',
          name: 'Shaft Lok Inc.',
          url: 'https://shaftlok.com'
        },
        image: 'https://shaftlok.com/assets/images/shaftlok-mod-orange.jpg',
        url: 'https://shaftlok.com/products/mod-ii-easylok',
        category: 'Marine Equipment',
        additionalProperty: [
          {
            '@type': 'PropertyValue',
            name: 'Max Bore Size',
            value: '2.25" (57.15mm)'
          },
          {
            '@type': 'PropertyValue',
            name: 'Width',
            value: '2.00" (50.8mm)'
          },
          {
            '@type': 'PropertyValue',
            name: 'Suitable For',
            value: 'Sailboats: 20 to 100 feet'
          },
          {
            '@type': 'PropertyValue',
            name: 'Market Share',
            value: '70% of all units sold since 1979'
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
  gap: 0.5rem;
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

.shaftlok-font {
  font-family: 'DeVinneOrnamentDRegular', serif;
  color: var(--federal-blue);
  font-weight: bold;
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