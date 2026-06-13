<template>
  <div>
    <div class="landing-container">
      <div class="hero-section">
        <div class="hero-content">
          <div class="hero-title">
            <h1><span>Shaft Lok:</span> Advanced Propeller Control</h1>
          </div>
          <div class="hero-subtitle">
            <p>
              Properly Positions, Locks and Automatically Unlocks the Propeller
              Quickly and Easily Without Leaving the Cockpit!
            </p>
          </div>
          <div class="button-group">
            <NuxtLink to="/products" class="button button-primary">Products</NuxtLink>
            <NuxtLink to="/yacht-list" class="button button-primary">View Yacht List</NuxtLink>
            <a href="#about" class="button button-primary">Learn More</a>
          </div>
          <div class="features-grid">
            <div class="feature-item">
              <h3 class="feature-title">
                <i class="fas fa-wind feature-icon"></i>
                Sail Faster
              </h3>
              <p class="feature-description">A locked shaft means reduced drag from spinning propeller</p>
            </div>
            <div class="feature-item">
              <h3 class="feature-title">
                <i class="fas fa-ear-deaf feature-icon"></i>
                Sail Quietly
              </h3>
              <p class="feature-description">A locked shaft means transmission noise is eliminated</p>
            </div>
            <div class="feature-item">
              <h3 class="feature-title">
                <i class="fas fa-anchor-circle-check feature-icon"></i>
                Marine-Grade
              </h3>
              <p class="feature-description">Built for harsh marine environments</p>
            </div>
          </div>
          <div class="compatibility-text">
            Compatible with Borg Warner, Paragon, Hurth and Volvo Penta Transmissions
          </div>
        </div>
      </div>
      <div class="brochure-section">
        <div class="brochure-container">
          <div class="brochure-glow"></div>
          <img src="/assets/images/Traditional-ShaftLok-Brochure.png" alt="Shaft Lok marine propeller control system brochure showing traditional blue transmission housing design for sailboats" loading="lazy">
        </div>
      </div>
    </div>

    <!-- About Section -->
    <section id="about" class="about-section">
      <div class="about-container">
        <h1 class="about-title"><span class="shaft-lok-text">Shaft Lok</span> History</h1>
        <p class="about-subtitle">By Kenneth R. Nigel | July 28, 2023</p>
      </div>
      <div class="about-content">
        <div class="about-card" style="animation-delay: 0.2s; width: 50%; align-self: flex-start;">
          <h2 class="beginning">The Beginning</h2>
          <p>In 1978, Dick Badzinski and George Nigel, both sailboat owners, faced a common problem: propellers spinning freely while sailing, causing reduced speed, noise, and drive train wear.</p>
          <p><em>"It was like a dripping faucet which just got on one's nerves."</em> - Kenneth Nigel</p>
        </div>

        <div class="about-card" style="animation-delay: 0.4s; width: 50%; align-self: flex-end;">
          <h2 class="invention">The Invention</h2>
          <p>Kenneth, working at Rex Chain Belt in Milwaukee, encouraged pursuing the invention for worldwide marketing. They built a working model and secured three patents through a Boston connection, maintaining confidentiality during the patent filing process.</p>
        </div>

        <div class="about-card" style="animation-delay: 0.6s; width: 50%; align-self: flex-start;">
          <h2 class="success">Early Success</h2>
          <p>The founders pooled resources for marketing materials and advertising. Their breakthrough came at the Chicago Boat Show with Borg Warner, leading to overwhelmingly positive dealer response and the first Mod I shipments in 1979.</p>
        </div>

        <div class="about-card" style="animation-delay: 0.8s; width: 50%; align-self: flex-end;">
          <h2 class="innovation">Innovation & Patents</h2>
          <p>The company evolved from a 2V design to the Easy Lok concept, improving ease of use. U.S. Patents awarded: <a href="https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/4389199">#4389199</a> and <a href="https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/D271583">#D271583</a></p>
        </div>
      </div>
    </section>

    <!-- Statistics Section -->
    <section class="stats-section">
      <div class="stats-container">
        <h2 class="stats-title">By The Numbers</h2>
        <p class="stats-subtitle">Four decades of marine excellence and innovation</p>
        
        <div class="stats-grid-main">
          <div class="stat-item-main">
            <span class="stat-number-main">1979</span>
            <span class="stat-label-main">Since</span>
          </div>
          <div class="stat-item-main">
            <span class="stat-number-main">1390+</span>
            <span class="stat-label-main">Units Shipped</span>
          </div>
          <div class="stat-item-main">
            <span class="stat-number-main">8</span>
            <span class="stat-label-main">Models Available</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
      <div class="features-container">
        <h2 class="features-title">Noteworthy Features</h2>
        <p class="features-subtitle">Advanced engineering for marine excellence</p>
        
        <div class="features-grid-section">
          <div class="feature-card">
            <ul class="features-list">
              <li>No power required - saves batteries, no wires or hoses</li>
              <li>Simple design with few moving parts, easy installation</li>
              <li>Stainless steel spring "engine" with thousands of life cycles</li>
            </ul>
          </div>
          <div class="feature-card">
            <ul class="features-list">
              <li>Marine-grade polyurethane housing for saltwater environments</li>
              <li>All-stainless steel hub, bracket and fasteners</li>
              <li>Maintenance-free ball bearing system</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
useHead({
  title: 'Welcome',
  meta: [
    { name: 'description', content: 'Shaft Lok marine propeller control systems - premium quality, easy installation, reliable locking for improved sailing performance. Trusted by sailors worldwide since 1979.' },
    { property: 'og:title', content: 'Shaft Lok - Advanced Propeller Control Systems' },
    { property: 'og:description', content: 'Discover ShaftLok\'s innovative marine propeller control systems. Premium quality, easy installation, and reliable propeller locking for improved sailing performance. Trusted by sailors worldwide.' },
    { property: 'og:image', content: 'https://shaftlok.com/assets/images/Logo_propeller_only.png' },
    { property: 'og:url', content: 'https://shaftlok.com/' },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'Shaft Lok Inc.' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Shaft Lok - Advanced Propeller Control Systems' },
    { name: 'twitter:description', content: 'Discover ShaftLok\'s innovative marine propeller control systems. Premium quality, easy installation, and reliable propeller locking for improved sailing performance.' },
    { name: 'twitter:image', content: 'https://shaftlok.com/assets/images/Logo_ShaftLok_whiteBG-landscape.png' }
  ],
  link: [
    { rel: 'canonical', href: 'https://shaftlok.com/' }
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
          }
        ]
      })
    },
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Shaft Lok - Advanced Marine Shaft Locking Systems for Sailboats and Industrial Vessels',
        description: 'Shaft Lok marine shaft locking systems - premium quality, easy installation, reliable propeller control for improved sailing performance. Trusted by sailors worldwide since 1979.',
        url: 'https://shaftlok.com/',
        isPartOf: {
          '@type': 'WebSite',
          name: 'Shaft Lok Inc.',
          url: 'https://shaftlok.com'
        },
        about: {
          '@type': 'Product',
          name: 'Marine Shaft Locking Systems',
          description: 'Engine room shaft locks that prevent propeller shaft spinning for improved sailboat performance and industrial vessel MTBF optimization',
          category: 'Marine Equipment',
          brand: 'Shaft Lok'
        },
        mainEntity: {
          '@type': 'Organization',
          name: 'Shaft Lok Inc.'
        }
      })
    },
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Shaft Lok Inc.',
        legalName: 'Shaft Lok Inc.',
        url: 'https://shaftlok.com',
        logo: 'https://shaftlok.com/assets/images/Logo_ShaftLok_whiteBG-landscape.png',
        foundingDate: '1979',
        description: 'Leading manufacturer of innovative marine propeller control systems since 1979. Providing premium quality, easy installation, and reliable propeller locking solutions for improved sailing performance.',
        industry: 'Marine Equipment Manufacturing',
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'US'
        },
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'Customer Service',
          url: 'https://shaftlok.com/contact'
        },
        sameAs: [],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Marine Propeller Control Systems',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Product',
                name: 'Mod I EasyLok',
                category: 'Marine Equipment'
              }
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Product',
                name: 'Mod II EasyLok',
                category: 'Marine Equipment'
              }
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Product',
                name: 'Mod III EasyLok',
                category: 'Marine Equipment'
              }
            }
          ]
        }
      })
    }
  ]
})

definePageMeta({
  layout: 'default'
})

</script>

<style scoped>
html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  padding: 0;
  background: linear-gradient(to bottom, var(--light-cyan), white);
  min-height: 100vh;
}

.landing-container {
  display: flex;
  min-height: 100vh;
  background: linear-gradient(to bottom, var(--light-cyan), white);
  overflow: hidden;
  margin: 0;
  padding: 0;
  margin-top: 2rem;
}

.hero-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 2rem;
  color: #333;
  position: relative;
  min-width: 0;
  width: 50%;
  height: 100vh;
  align-items: center;
  justify-content: center;
  margin: 0;
}

.hero-content {
  width: 90%;
  max-width: 800px;
  position: relative;
}

.hero-title {
  margin-bottom: 1.5rem;
}

.hero-title h1 {
  font-size: var(--font-size-title);
  font-weight: bold;
  line-height: 1.2;
  margin: 0;
  animation: slideDown 1s ease-out forwards;
  opacity: 0;
}

.hero-title h1 span {
  color: var(--federal-blue);
  font-family: 'DeVinneOrnamentDRegular', serif;
}

.hero-subtitle {
  margin-bottom: 2rem;
  position: relative;
}

.hero-subtitle p {
  font-size: var(--font-size-subtitle);
  line-height: 1.6;
  color: #333;
  animation: riseFromDepth 2s ease-out 0.5s forwards;
  opacity: 0;
  margin: 0;
}

.button-group {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  margin-bottom: 2rem;
  justify-content: flex-start;
  width: 100%;
}

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.8rem 2rem;
  border-radius: 50px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  text-align: center;
  margin: 0;
}

.button-primary {
  background-color: var(--federal-blue);
  color: white;
  border: 2px solid transparent;
}

.button-primary:hover {
  background-color: white;
  color: var(--federal-blue);
  border: 2px solid var(--federal-blue);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.feature-item {
  text-align: left;
}

.feature-title {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: var(--font-size-subtitle);
  white-space: nowrap;
  flex-wrap: nowrap;
}

.feature-icon {
  color: var(--honolulu-blue);
  font-size: var(--font-size-icon);
}

.feature-description {
  color: #666;
  font-size: var(--font-size-description);
  margin-left: 2rem;
}

.compatibility-text {
  font-size: var(--font-size-small);
  color: #666;
  margin-top: 2rem;
}

.brochure-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  width: 50%;
  z-index: 1;
}

.brochure-container {
  position: relative;
  width: 100%;
  max-width: 510px;
  margin-top: 4rem;
}

.brochure-glow {
  position: absolute;
  inset: -1rem;
  background: rgba(0, 180, 216, 0.2);
  border-radius: 9999px;
  filter: blur(1rem);
}

.brochure-section img {
  position: relative;
  width: 100%;
  height: auto;
  border-radius: 1rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  animation: fadeIn 1s ease-out forwards;
}

@keyframes slideDown {
  from {
    transform: translateY(-50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes riseFromDepth {
  0% {
    transform: translateY(100px) scale(0.8);
    opacity: 0;
    filter: blur(5px);
  }
  100% {
    transform: translateY(0) scale(1);
    opacity: 1;
    filter: blur(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .landing-container {
    margin-top: 8rem;
    flex-direction: column;
  }
  
  .hero-section {
    width: 100%;
    height: auto;
    min-height: auto;
    padding: 2rem 1rem;
  }
  
  .hero-content {
    width: 100%;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .brochure-section {
    width: 100%;
    padding: 1rem;
    min-height: auto;
  }

  .brochure-container {
    max-width: 100%;
  }

  .brochure-section img {
    max-width: 100%;
    height: auto;
  }

  .button-group {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
  }
}

/* About Section Styles */
.about-section {
  min-height: 100vh;
  padding: 4rem 2rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden;
  background: linear-gradient(to bottom, white, var(--light-cyan));
}

.about-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('/assets/images/shaftlok-canvasback.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat, no-repeat;
  transform: scaleX(-1);
  opacity: 0.3;
  z-index: 0;
}

.about-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.about-title {
  text-align: center;
  color: var(--federal-blue);
  font-family: 'DeVinneOrnamentDRegular', serif;
  font-size: var(--font-size-title);
  margin-bottom: 1rem;
  animation: fadeIn 1s ease-out forwards;
}

.about-subtitle {
  font-size: var(--font-size-subtitle);
  color: #666;
  max-width: 1200px;
  margin: 0 auto;
  margin-bottom: 3rem;
  animation: fadeIn 1s ease-out 0.5s forwards;
  opacity: 0;
  text-align: center;
}

.about-content {
  max-width: 900px;
  width: 100%;
  margin-left: calc((100% - 900px) / 4);
  margin-right: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
  z-index: 2;
}

.about-card {
  background-color: rgba(255, 255, 255, 0.95);
  border: 2px solid var(--federal-blue);
  border-radius: 15px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.8s ease-out forwards;
  opacity: 0;
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.about-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
}

.about-card h2 {
  color: var(--federal-blue);
  font-size: var(--font-size-subtitle);
  margin-top: 0;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.about-card h2::before {
  font-family: 'Font Awesome 6 Free';
  font-weight: 900;
  color: var(--honolulu-blue);
  font-size: var(--font-size-icon);
}

.about-card h2.beginning::before { content: '\f1da'; }
.about-card h2.invention::before { content: '\f0eb'; }
.about-card h2.success::before { content: '\f091'; }
.about-card h2.innovation::before { content: '\f0c3'; }

.about-card p {
  color: #333;
  font-size: var(--font-size-description);
  margin-top: 0;
  margin-bottom: 0.5rem;
}

.shaft-lok-text {
  font-family: 'DeVinneOrnamentDRegular', serif;
  color: var(--federal-blue);
  font-weight: bold;
}

@media (max-width: 768px) {
  .about-section {
    padding: 2rem 1rem;
  }

  .about-content {
    max-width: 100%;
    margin-left: auto;
    margin-right: auto;
  }

  .about-card {
    padding: 1.5rem;
    width: 100% !important;
    align-self: stretch !important;
  }

  .about-title {
    font-size: calc(var(--font-size-title) * 0.8);
  }

  .about-subtitle {
    font-size: calc(var(--font-size-subtitle) * 0.9);
  }
}

/* Statistics Section Styles */
.stats-section {
  background: linear-gradient(135deg, var(--federal-blue) 0%, var(--honolulu-blue) 100%);
  padding: 4rem 2rem;
  color: white;
  position: relative;
  overflow: hidden;
}

.stats-section::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: var(--light-cyan);
  z-index: 3;
}

.stats-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('/assets/images/shaftlok-mods.jpg');
  background-size: cover;
  background-position: top;
  background-repeat: no-repeat;
  opacity: 0.1;
  z-index: 0;
}

.stats-container {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  text-align: center;
}

.stats-title {
  font-size: var(--font-size-title);
  font-family: 'DeVinneOrnamentDRegular', serif;
  color: var(--light-cyan);
  margin-bottom: 1rem;
  animation: fadeIn 1s ease-out forwards;
}

.stats-subtitle {
  font-size: var(--font-size-subtitle);
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 3rem;
  animation: fadeIn 1s ease-out 0.3s forwards;
  opacity: 0;
}

.stats-grid-main {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 2rem;
}

.stat-item-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  animation: fadeIn 0.8s ease-out forwards;
  opacity: 0;
}

.stat-item-main:nth-child(1) { animation-delay: 0.4s; }
.stat-item-main:nth-child(2) { animation-delay: 0.6s; }
.stat-item-main:nth-child(3) { animation-delay: 0.8s; }

.stat-item-main:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.stat-number-main {
  font-size: 3rem;
  font-weight: bold;
  color: var(--light-cyan);
  margin-bottom: 1rem;
  line-height: 1;
}

.stat-label-main {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  font-weight: 500;
}

@media (max-width: 768px) {
  .stats-section {
    padding: 3rem 1rem;
  }
  
  .stats-grid-main {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .stat-item-main {
    padding: 1.5rem 0.5rem;
  }
  
  .stat-number-main {
    font-size: 2.5rem;
  }
  
  .stat-label-main {
    font-size: 1rem;
  }
}

/* Features Section Styles */
.features-section {
  background: linear-gradient(to bottom, var(--light-cyan), white);
  padding: 2rem 2rem 4rem;
  position: relative;
  overflow: hidden;
}

.features-section::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: var(--federal-blue);
  z-index: 3;
}

.features-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('/assets/images/shaftlok-install.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0.3;
  z-index: 0;
}

.features-container {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  z-index: 2;
}

.features-title {
  font-size: var(--font-size-title);
  color: var(--federal-blue);
  margin-bottom: 1rem;
  animation: fadeIn 1s ease-out forwards;
}

.features-subtitle {
  font-size: var(--font-size-subtitle);
  color: #666;
  margin-bottom: 3rem;
  animation: fadeIn 1s ease-out 0.3s forwards;
  opacity: 0;
}

.features-grid-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.feature-card {
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid var(--federal-blue);
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  animation: fadeIn 0.8s ease-out forwards;
  opacity: 0;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
}

.feature-card:nth-child(1) { animation-delay: 0.4s; }
.feature-card:nth-child(2) { animation-delay: 0.6s; }

.features-list {
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: left;
}

.features-list li {
  margin-bottom: 1rem;
  padding-left: 2rem;
  position: relative;
  color: #333;
  line-height: 1.6;
}

.features-list li::before {
  content: '\f00c';
  font-family: 'Font Awesome 6 Free';
  font-weight: 900;
  color: var(--honolulu-blue);
  position: absolute;
  left: 0;
  top: 0;
}

@media (max-width: 768px) {
  .features-section {
    padding: 3rem 1rem;
  }
  
  .features-grid-section {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .feature-card {
    padding: 1.5rem;
  }
}
</style>