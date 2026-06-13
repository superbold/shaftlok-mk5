<template>
  <div>
    <BreadcrumbNav :items="[{ name: 'Products', to: '/products' }, { name: 'Mod II EasyLok High Torque' }]" />
    
    <div class="product-container">
      <div class="product-detail">
        <div class="product-card">
          <h1 class="page-title">Mod II EasyLok High Torque</h1>
          <h2 class="page-description">Sailboats: 45 to 130 feet with fewer engine room space restrictions</h2>
          <div class="product-content">
            <div class="product-image-container">
              <img src="/assets/images/shaftlok-mod-purple.jpg" alt="Shaft Lok Mod II EasyLok High Torque marine propeller control system - heavy-duty design for high-torque applications and commercial vessels with enhanced locking mechanism" class="product-image" loading="lazy">
            </div>
            <div class="product-description">
              <div class="features-grid">
                <div class="feature-item">
                  <h3 class="feature-title">
                    <i class="fas fa-ruler feature-icon"></i>
                    Max Bore Size
                  </h3>
                  <p class="feature-description">2.25" (57mm)</p>
                </div>
                <div class="feature-item">
                  <h3 class="feature-title">
                    <i class="fas fa-cog feature-icon"></i>
                    High Torque Capability
                  </h3>
                  <p class="feature-description">Enhanced locking mechanism for demanding applications</p>
                </div>
                <div class="feature-item">
                  <h3 class="feature-title">
                    <i class="fas fa-anchor feature-icon"></i>
                    Ideal For
                  </h3>
                  <p class="feature-description">Fixed bladed propellers</p>
                </div>
                <div class="feature-item">
                  <h3 class="feature-title">
                    <i class="fas fa-lock feature-icon"></i>
                    Enhanced System
                  </h3>
                  <p class="feature-description">Superior locking mechanism design</p>
                </div>
              </div>
              <div class="details-text">
                <p>Enhanced version for demanding applications requiring superior torque handling capabilities.</p>
                <p>Perfect for larger sailing vessels with fixed blade propellers that need reliable shaft locking performance.</p>
                <p>Built with enhanced materials and engineering to handle the increased stresses of larger vessel applications.</p>
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
  title: 'Mod II EasyLok High Torque',
  meta: [
    { name: 'description', content: 'ShaftLok Mod II EasyLok High Torque - Heavy-duty marine propeller control system designed for high-torque applications. Maximum propeller control for commercial vessels.' },
    { property: 'og:title', content: 'Shaft Lok Mod II EasyLok High Torque - Heavy-Duty Marine Propeller Control' },
    { property: 'og:description', content: 'Shaft Lok Mod II EasyLok High Torque - Heavy-duty marine propeller control system designed for high-torque applications. Maximum propeller control for commercial vessels.' },
    { property: 'og:image', content: 'https://shaftlok.com/assets/images/shaftlok-mod-purple.jpg' },
    { property: 'og:url', content: 'https://shaftlok.com/products/mod-ii-easylok-high-torque' },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'Shaft Lok Inc.' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Shaft Lok Mod II EasyLok High Torque - Heavy-Duty Marine Propeller Control' },
    { name: 'twitter:description', content: 'Shaft Lok Mod II EasyLok High Torque - Heavy-duty marine propeller control system designed for high-torque applications.' },
    { name: 'twitter:image', content: 'https://shaftlok.com/assets/images/Logo_ShaftLok_whiteBG-landscape.png' }
  ],
  link: [
    { rel: 'canonical', href: 'https://shaftlok.com/products/mod-ii-easylok-high-torque' }
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
            name: 'Mod II EasyLok High Torque',
            item: 'https://shaftlok.com/products/mod-ii-easylok-high-torque'
          }
        ]
      })
    },
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: 'Mod II EasyLok High Torque',
        description: 'Heavy-duty marine propeller control system designed for high-torque applications. Enhanced locking mechanism for demanding applications requiring superior torque handling capabilities.',
        brand: {
          '@type': 'Brand',
          name: 'Shaft Lok'
        },
        manufacturer: {
          '@type': 'Organization',
          name: 'Shaft Lok Inc.',
          url: 'https://shaftlok.com'
        },
        image: 'https://shaftlok.com/assets/images/shaftlok-mod-purple.jpg',
        url: 'https://shaftlok.com/products/mod-ii-easylok-high-torque',
        category: 'Marine Equipment',
        additionalProperty: [
          {
            '@type': 'PropertyValue',
            name: 'Max Bore Size',
            value: '2.25" (57mm)'
          },
          {
            '@type': 'PropertyValue',
            name: 'Suitable For',
            value: 'Sailboats: 45 to 130 feet with fewer engine room space restrictions'
          },
          {
            '@type': 'PropertyValue',
            name: 'Torque Capability',
            value: 'High torque for demanding applications'
          },
          {
            '@type': 'PropertyValue',
            name: 'Propeller Type',
            value: 'Fixed bladed propellers'
          },
          {
            '@type': 'PropertyValue',
            name: 'Locking System',
            value: 'Enhanced locking mechanism design'
          },
          {
            '@type': 'PropertyValue',
            name: 'Application',
            value: 'Larger sailing vessels requiring superior performance'
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