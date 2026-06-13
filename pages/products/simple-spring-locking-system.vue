<template>
  <div>
    <BreadcrumbNav :items="[{ name: 'Products', to: '/products' }, { name: 'Simple Spring Locking System' }]" />
    
    <div class="product-container">
      <div class="product-detail">
        <div class="product-card">
          <h1 class="page-title">Simple Spring Locking System</h1>
          <h2 class="page-description">Simple, reliable, manual locking system for Shaft Lok</h2>
          <div class="product-content">
            <div class="product-image-container">
              <img src="/assets/images/SpringLockingSystem_withHandle.jpg" alt="Shaft Lok Simple Spring Locking System - cost-effective marine propeller control solution with manual operation and easy installation for smaller vessels" class="product-image" loading="lazy">
            </div>
            <div class="product-description">
              <div class="features-grid">
                <div class="feature-item">
                  <h3 class="feature-title">
                    <i class="fas fa-wrench feature-icon"></i>
                    Replaces Cable
                  </h3>
                  <p class="feature-description">Replaces standard marine control cable</p>
                </div>
                <div class="feature-item">
                  <h3 class="feature-title">
                    <i class="fas fa-hand-point-down feature-icon"></i>
                    Simple Operation
                  </h3>
                  <p class="feature-description">Simple and intuitive operation</p>
                </div>
                <div class="feature-item">
                  <h3 class="feature-title">
                    <i class="fas fa-compress-arrows-alt feature-icon"></i>
                    Durable Spring
                  </h3>
                  <p class="feature-description">Durable spring mechanism</p>
                </div>
                <div class="feature-item">
                  <h3 class="feature-title">
                    <i class="fas fa-tools feature-icon"></i>
                    Easy Maintenance
                  </h3>
                  <p class="feature-description">Easy installation and maintenance</p>
                </div>
                <div class="feature-item">
                  <h3 class="feature-title">
                    <i class="fas fa-check-circle feature-icon"></i>
                    Compatible
                  </h3>
                  <p class="feature-description">Compatible with all Shaft Lok systems</p>
                </div>
              </div>
              <div class="details-text">
                <p>This S.S.L.S is one of the two devices that lock all the Mod I thru Mod III Shaft Lok Units. It is mounted on top of the Shaft Lok Unit. Just push down on the black knob to lock.</p>
                <p>SSLS is inexpensive, easy to install and compact.</p>
                <p>To operate the SSLS one must enter the engine room, which may be difficult on some yachts. However, to LOCK the Shaft Lok unit, the propeller must be rotating slowly.</p>
                <p>Shaft Lok is an excellent LOCK but as a brake "not so much".</p>
                <p>The SSLS operator should be able to see the propeller shaft easily. Over time the operator will become aware of what shaft rotation speed is required to lock the unit. The sailor can inform the captain if more or less speed is necessary. The Shaft Lok unit automatically unlocks when the engine is started and put into gear. The locking pin, that holds the rotating disc, travels up into the housing allowing the disc to rotate should the captain want to use the motor to move the vessel. The short pin in the housing holds the locking pin in the unlocked position. When the unit is locked the short pin also holds in the locked position. See the Patent Drawing attached: 2 pages down.</p>
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
  title: 'Simple Spring Locking System',
  meta: [
    { name: 'description', content: 'Shaft Lok Simple Spring Locking System - cost-effective marine propeller control solution. Easy installation, reliable locking for smaller vessels. Inexpensive alternative.' },
    { property: 'og:title', content: 'Shaft Lok Simple Spring Locking System - Cost-Effective Marine Propeller Control' },
    { property: 'og:description', content: 'Shaft Lok Simple Spring Locking System - Cost-effective marine propeller control solution. Easy installation and reliable propeller control for smaller vessels.' },
    { property: 'og:image', content: 'https://shaftlok.com/assets/images/SpringLockingSystem_withHandle.jpg' },
    { property: 'og:url', content: 'https://shaftlok.com/products/simple-spring-locking-system' },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'Shaft Lok Inc.' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Shaft Lok Simple Spring Locking System - Cost-Effective Marine Propeller Control' },
    { name: 'twitter:description', content: 'Shaft Lok Simple Spring Locking System - Cost-effective marine propeller control solution. Easy installation and reliable propeller control for smaller vessels.' },
    { name: 'twitter:image', content: 'https://shaftlok.com/assets/images/Logo_ShaftLok_whiteBG-landscape.png' }
  ],
  link: [
    { rel: 'canonical', href: 'https://shaftlok.com/products/simple-spring-locking-system' }
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
            name: 'Simple Spring Locking System',
            item: 'https://shaftlok.com/products/simple-spring-locking-system'
          }
        ]
      })
    },
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: 'Simple Spring Locking System',
        description: 'Cost-effective marine propeller control solution for ShaftLok systems. Simple, reliable manual locking system with easy installation and maintenance. Compatible with all ShaftLok Mod I through Mod III units.',
        brand: {
          '@type': 'Brand',
          name: 'Shaft Lok'
        },
        manufacturer: {
          '@type': 'Organization',
          name: 'Shaft Lok Inc.',
          url: 'https://shaftlok.com'
        },
        image: 'https://shaftlok.com/assets/images/SpringLockingSystem_withHandle.jpg',
        url: 'https://shaftlok.com/products/simple-spring-locking-system',
        category: 'Marine Equipment',
        additionalProperty: [
          {
            '@type': 'PropertyValue',
            name: 'Compatibility',
            value: 'Compatible with all ShaftLok Mod I through Mod III units'
          },
          {
            '@type': 'PropertyValue',
            name: 'Operation',
            value: 'Simple and intuitive manual operation'
          },
          {
            '@type': 'PropertyValue',
            name: 'Installation',
            value: 'Easy installation and maintenance'
          },
          {
            '@type': 'PropertyValue',
            name: 'Mechanism',
            value: 'Durable spring mechanism'
          },
          {
            '@type': 'PropertyValue',
            name: 'Access',
            value: 'Requires engine room access for operation'
          },
          {
            '@type': 'PropertyValue',
            name: 'Cost',
            value: 'Inexpensive alternative to marine control cable'
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
  line-height: 1.6;
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