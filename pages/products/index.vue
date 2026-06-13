<template>
  <div>
    <BreadcrumbNav :items="[{ name: 'Products' }]" />

    <div class="products-container">
      <div class="products-header">
        <h1>Shaft Lok Products</h1>
        <p>Discover our range of innovative products designed to enhance your boating experience</p>
      </div>

      <div class="products-grid">
        <div class="product-card">
          <img src="/assets/images/shaftlok-mod-red.jpg" alt="Shaft Lok Mod I EasyLok marine propeller control system - compact design for small sailboats with engine room space restrictions" class="product-image" loading="lazy">
          <div class="product-content">
            <h3>Mod I EasyLok</h3>
            <p>Entry-level propeller control system for smaller vessels</p>
            <NuxtLink to="/products/mod-i-easylok" class="product-link">Details</NuxtLink>
          </div>
        </div>

        <div class="product-card">
          <img src="/assets/images/shaftlok-mod-orange.jpg" alt="Shaft Lok Mod II EasyLok marine propeller control system - enhanced design for medium-duty sailboats 20-100 feet with 70% market share" class="product-image" loading="lazy">
          <div class="product-content">
            <h3>Mod II EasyLok</h3>
            <p>Standard propeller control for most sailboat applications</p>
            <NuxtLink to="/products/mod-ii-easylok" class="product-link">Details</NuxtLink>
          </div>
        </div>

        <div class="product-card">
          <img src="/assets/images/shaftlok-mod-purple.jpg" alt="Shaft Lok Mod II EasyLok High Torque marine propeller control system - heavy-duty design for high-torque applications and commercial vessels" class="product-image" loading="lazy">
          <div class="product-content">
            <h3>Mod II EasyLok High Torque</h3>
            <p>Enhanced version for demanding applications</p>
            <NuxtLink to="/products/mod-ii-easylok-high-torque" class="product-link">Details</NuxtLink>
          </div>
        </div>

        <div class="product-card">
          <img src="/assets/images/shaftlok-mod-black.jpg" alt="Shaft Lok Mod III EasyLok marine propeller control system - advanced design for large vessels with maximum torque handling and rotating disc assembly" class="product-image" loading="lazy">
          <div class="product-content">
            <h3>Mod III EasyLok</h3>
            <p>Advanced propeller control for larger vessels</p>
            <NuxtLink to="/products/mod-iii-easylok" class="product-link">Details</NuxtLink>
          </div>
        </div>

        <div class="product-card">
          <img src="/assets/images/shaftlok-mod-red.jpg" alt="Shaft Lok Mod III EasyLok High Torque marine propeller control system - ultimate high-torque design for large vessels with maximum reliability and performance" class="product-image" loading="lazy">
          <div class="product-content">
            <h3>Mod III EasyLok High Torque</h3>
            <p>Large Sailboats with no engine room space restrictions.</p>
            <NuxtLink to="/products/mod-iii-easylok-high-torque" class="product-link">Details</NuxtLink>
          </div>
        </div>

        <div class="product-card">
          <img src="/assets/images/shaftlok-mod-purple.jpg" alt="Shaft Lok Mod IV marine propeller control system - professional-grade design for specialty applications and large motor vessels with custom installation support" class="product-image" loading="lazy">
          <div class="product-content">
            <h3>Mod IV</h3>
            <p>Million $$$ Yachts with large propeller shafts.</p>
            <NuxtLink to="/products/mod-iv" class="product-link">Details</NuxtLink>
          </div>
        </div>

        <div class="product-card">
          <img src="/assets/images/shaftlok-mod-purple.jpg" alt="Shaft Lok Mod V marine propeller control system - ultimate design for largest yachts and extreme torque requirements with performance-grade locking technology" class="product-image" loading="lazy">
          <div class="product-content">
            <h3>Mod V</h3>
            <p>Million $$$ Yachts with custom requirements.</p>
            <NuxtLink to="/products/mod-v" class="product-link">Details</NuxtLink>
          </div>
        </div>

        <div class="product-card">
          <img src="/assets/images/shaftlok-mod-purple.jpg" alt="Shaft Lok Mod VI marine propeller control system - custom design for specialized applications and unique vessel requirements with extreme environment capabilities" class="product-image" loading="lazy">
          <div class="product-content">
            <h3>Mod VI</h3>
            <p>Our premium model, designed for specialized applications requiring the highest level of precision and security.</p>
            <NuxtLink to="/products/mod-vi" class="product-link">Details</NuxtLink>
          </div>
        </div>

        <div class="product-card">
          <img src="/assets/images/SpringLockingSystem_withHandle.jpg" alt="Shaft Lok Simple Spring Locking System - cost-effective marine propeller control solution with manual operation and easy installation for smaller vessels" class="product-image" loading="lazy">
          <div class="product-content">
            <h3>Simple Spring Locking System</h3>
            <p>Locks Prop from the Engine Room.</p>
            <NuxtLink to="/products/simple-spring-locking-system" class="product-link">Details</NuxtLink>
          </div>
        </div>

        <div class="product-card">
          <img src="/assets/images/marine-control-cable.png" alt="Shaft Lok Marine Control Cable - durable marine-grade control cables for convenient cockpit operation of propeller locking systems without engine room access" class="product-image" loading="lazy">
          <div class="product-content">
            <h3>Marine Control Cable</h3>
            <p>Standard control cable for propeller locking systems.</p>
            <NuxtLink to="/products/marine-control-cable" class="product-link">Details</NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
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
.products-container {
  margin-top: 6rem;
  min-height: 100vh;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.products-header {
  text-align: center;
  margin-bottom: 0;
  color: #333;
}

.products-header h1 {
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

.products-header p {
  font-size: var(--font-size-subtitle);
  color: var(--federal-blue);
  max-width: 1200px;
  margin: 0 auto;
  margin-bottom: 3rem;
  animation: fadeIn 1s ease-out 0.5s forwards;
  opacity: 0;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  position: relative;
  z-index: 2;
  text-align: center;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.product-card {
  background-color: white;
  border: 2px solid var(--federal-blue);
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  animation: fadeIn 0.8s ease-out forwards;
  opacity: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 5px;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.product-content {
  padding: 0.5rem;
  color: #333;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.product-content h3 {
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
  color: var(--federal-blue);
}

.product-content p {
  font-size: 1rem;
  line-height: 1.3;
  color: #333;
  margin-bottom: 0.75rem;
}

.product-link {
  display: block;
  width: 100%;
  padding: 0.75rem 1.5rem;
  margin-top: auto;
  background-color: var(--federal-blue);
  color: white;
  text-align: center;
  text-decoration: none;
  border-radius: 8px;
  font-weight: bold;
  transition: all 0.3s ease;
  border: 2px solid var(--federal-blue);
}

.product-link:hover {
  background-color: transparent;
  color: var(--federal-blue);
  transform: translateY(-2px);
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
  .products-container {
    padding: 1rem;
  }

  .products-grid {
    grid-template-columns: 1fr;
  }

  .product-card {
    margin: 0 auto;
    max-width: 400px;
  }
}
</style>