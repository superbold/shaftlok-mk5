<template>
  <div>
    <!-- ===================== HERO ===================== -->
    <section class="hero">
      <div class="hero-inner">
        <div class="hero-copy">
          <span class="eyebrow" v-reveal><i class="fas fa-anchor"></i> Marine engineering since 1979</span>
          <h1 v-reveal="100">
            Lock the shaft.<br>
            <span class="grad-text">Free the sail.</span>
          </h1>
          <p class="hero-sub" v-reveal="200">
            <span class="shaftlok-font">Shaft Lok</span> properly positions, locks and automatically
            unlocks your propeller — quickly and easily, without leaving the cockpit.
          </p>
          <div class="hero-actions" v-reveal="300">
            <NuxtLink to="/products" class="btn btn-primary">
              Explore Products <i class="fas fa-arrow-right"></i>
            </NuxtLink>
            <NuxtLink to="/yacht-list" class="btn btn-ghost">
              <i class="fas fa-ship"></i> View Yacht List
            </NuxtLink>
          </div>
          <div class="hero-stats" v-reveal="400">
            <div class="hero-stat">
              <span class="stat-value">1979</span>
              <span class="stat-label">Founded</span>
            </div>
            <div class="hero-stat">
              <span class="stat-value">1,390+</span>
              <span class="stat-label">Units shipped</span>
            </div>
            <div class="hero-stat">
              <span class="stat-value">8</span>
              <span class="stat-label">Models</span>
            </div>
            <div class="hero-stat">
              <span class="stat-value">2</span>
              <span class="stat-label">US patents</span>
            </div>
          </div>
        </div>

        <div class="hero-visual" v-reveal="250">
          <div class="visual-ring" aria-hidden="true"></div>
          <div class="visual-card">
            <img
              src="/assets/images/Traditional-ShaftLok-Brochure.png"
              alt="Shaft Lok marine propeller control system brochure showing traditional blue transmission housing design for sailboats"
              loading="eager"
            >
          </div>
          <div class="visual-chip chip-top" aria-hidden="true">
            <i class="fas fa-lock"></i> Locks in the most efficient position
          </div>
          <div class="visual-chip chip-bottom" aria-hidden="true">
            <i class="fas fa-bolt"></i> Zero power required
          </div>
        </div>
      </div>

      <div class="hero-marquee" aria-label="Compatible transmissions">
        <span class="marquee-label">Compatible with</span>
        <div class="marquee-track">
          <span v-for="(brand, i) in [...brands, ...brands]" :key="i" class="marquee-item">
            <i class="fas fa-gear"></i>{{ brand }}
          </span>
        </div>
      </div>
    </section>

    <!-- ===================== WHY / BENTO ===================== -->
    <section id="about" class="bento-section">
      <div class="section-head" v-reveal>
        <span class="eyebrow"><i class="fas fa-water"></i> Why lock the shaft</span>
        <h2>A freewheeling propeller is a <span class="grad-text">dripping faucet</span></h2>
        <p>It steals speed, makes noise and grinds away your drive train. One press of a knob fixes all three.</p>
      </div>

      <div class="bento-grid">
        <div class="bento-card bento-wide glass-card hoverable" v-reveal>
          <i class="fas fa-wind bento-icon"></i>
          <h3>Sail faster</h3>
          <p>A locked shaft means reduced drag from a spinning propeller. The blade locks in the most efficient
            position — one blade vertical — to optimize boat speed.</p>
        </div>
        <div class="bento-card glass-card hoverable" v-reveal="100">
          <i class="fas fa-ear-deaf bento-icon"></i>
          <h3>Sail quietly</h3>
          <p>Transmission noise is eliminated — no more clunking from a free-wheeling prop.</p>
        </div>
        <div class="bento-card glass-card hoverable" v-reveal="200">
          <i class="fas fa-shield-halved bento-icon"></i>
          <h3>Protect the drive train</h3>
          <p>Prevents transmission and propeller shaft bearing wear while under sail.</p>
        </div>
        <div class="bento-card glass-card hoverable" v-reveal="100">
          <i class="fas fa-plug-circle-xmark bento-icon"></i>
          <h3>No power needed</h3>
          <p>Saves your batteries — no electrical wires or hydraulic hoses. A stainless steel spring is the engine.</p>
        </div>
        <div class="bento-card bento-wide glass-card hoverable" v-reveal="200">
          <i class="fas fa-rotate-left bento-icon"></i>
          <h3>Automatic unlock</h3>
          <p>Start the engine, engage the transmission, and <span class="shaftlok-font">Shaft Lok</span> releases
            on its own. No trip to the engine room, no manual steps — it simply gets out of the way.</p>
        </div>
      </div>
    </section>

    <!-- ===================== HISTORY ===================== -->
    <section class="history-section">
      <div class="section-head" v-reveal>
        <span class="eyebrow"><i class="fas fa-compass"></i> Our story</span>
        <h2>Four decades of <span class="grad-text">marine excellence</span></h2>
        <p>By Kenneth R. Nigel — July 28, 2023</p>
      </div>

      <div class="timeline">
        <div class="timeline-item" v-reveal>
          <div class="timeline-marker">1978</div>
          <div class="timeline-card glass-card hoverable">
            <h3><i class="fas fa-sailboat"></i> The Beginning</h3>
            <p>Dick Badzinski and George Nigel, both sailboat owners, faced a common problem: propellers spinning
              freely while sailing, causing reduced speed, noise, and drive train wear.</p>
            <p class="quote">"It was like a dripping faucet which just got on one's nerves." — Kenneth Nigel</p>
          </div>
        </div>
        <div class="timeline-item" v-reveal="100">
          <div class="timeline-marker"><i class="fas fa-lightbulb"></i></div>
          <div class="timeline-card glass-card hoverable">
            <h3><i class="fas fa-lightbulb"></i> The Invention</h3>
            <p>Kenneth, working at Rex Chain Belt in Milwaukee, encouraged pursuing the invention for worldwide
              marketing. They built a working model and secured three patents through a Boston connection,
              maintaining confidentiality during the patent filing process.</p>
          </div>
        </div>
        <div class="timeline-item" v-reveal="100">
          <div class="timeline-marker">1979</div>
          <div class="timeline-card glass-card hoverable">
            <h3><i class="fas fa-trophy"></i> Early Success</h3>
            <p>The breakthrough came at the Chicago Boat Show with Borg Warner, leading to overwhelmingly positive
              dealer response and the first Mod I shipments in 1979.</p>
          </div>
        </div>
        <div class="timeline-item" v-reveal="100">
          <div class="timeline-marker">1981</div>
          <div class="timeline-card glass-card hoverable">
            <h3><i class="fas fa-flask"></i> Innovation &amp; Patents</h3>
            <p>The company evolved from a 2V design to the Easy Lok concept, improving ease of use.
              U.S. Patents awarded:
              <a href="https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/4389199" target="_blank" rel="noopener">#4389199</a>
              and
              <a href="https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/D271583" target="_blank" rel="noopener">#D271583</a>
            </p>
          </div>
        </div>
      </div>

      <div class="history-cta" v-reveal>
        <NuxtLink to="/about" class="btn btn-ghost">Read the full story <i class="fas fa-arrow-right"></i></NuxtLink>
      </div>
    </section>

    <!-- ===================== ENGINEERING ===================== -->
    <section class="engineering-section">
      <div class="engineering-inner">
        <div class="engineering-copy" v-reveal>
          <span class="eyebrow"><i class="fas fa-gears"></i> Built for salt water</span>
          <h2>Engineered to outlast <span class="grad-text">the boat</span></h2>
          <ul class="check-list">
            <li>No power required — saves batteries, no wires or hoses</li>
            <li>Simple design with few moving parts, easy installation</li>
            <li>Stainless steel spring "engine" with thousands of life cycles</li>
            <li>Marine-grade polyurethane housing for saltwater environments</li>
            <li>All-stainless steel hub, bracket and fasteners</li>
            <li>Maintenance-free double-shielded ball bearing system</li>
          </ul>
          <NuxtLink to="/installation" class="btn btn-primary engineering-btn">
            <i class="fas fa-wrench"></i> Installation Guide
          </NuxtLink>
        </div>
        <div class="engineering-visual" v-reveal="150">
          <div class="engineering-img glass-card">
            <img src="/assets/images/shaftlok-mods.jpg" alt="Shaft Lok Mod series propeller locking units lineup" loading="lazy">
          </div>
          <div class="engineering-img engineering-img-offset glass-card">
            <img src="/assets/images/shaftlok-install.jpg" alt="Shaft Lok unit installed on a sailboat propeller shaft" loading="lazy">
          </div>
        </div>
      </div>
    </section>

    <!-- ===================== CTA ===================== -->
    <section class="cta-section" v-reveal>
      <div class="cta-card glass-card">
        <h2>Find the right <span class="shaftlok-font grad-text">Shaft Lok</span> for your vessel</h2>
        <p>From 20-foot sailboats to mega-yachts — eight models cover every shaft from 45&nbsp;mm to 200&nbsp;mm.</p>
        <div class="cta-actions">
          <NuxtLink to="/products" class="btn btn-primary">Browse All Products</NuxtLink>
          <NuxtLink to="/contact" class="btn btn-ghost">Talk to Us</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const brands = ['Borg Warner', 'Paragon', 'Hurth', 'Volvo Penta', 'Yanmar', 'Perkins','Mercedes', 'Velvet Drive', 'Cummins']
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
      innerHTML: JSON.stringify({
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
      innerHTML: JSON.stringify({
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
      innerHTML: JSON.stringify({
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
/* ===================== HERO ===================== */
.hero {
  position: relative;
  padding-top: calc(var(--nav-height) + 3.5rem);
  overflow: hidden;
}

.hero-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem 3rem;
  display: grid;
  grid-template-columns: 1.15fr 1fr;
  gap: 3.5rem;
  align-items: center;
}

.hero-copy h1 {
  font-size: clamp(2.8rem, 6vw, 5rem);
  font-weight: 700;
  margin: 0 0 1.4rem;
}

.hero-sub {
  font-size: clamp(1.05rem, 1.8vw, 1.3rem);
  color: var(--text-mid);
  max-width: 46ch;
  margin: 0 0 2.2rem;
}

.hero-sub .shaftlok-font { color: var(--text-hi); }

.hero-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 2.8rem;
}

.hero-stats {
  display: flex;
  gap: 2.5rem;
  flex-wrap: wrap;
  border-top: 1px solid var(--line);
  padding-top: 1.8rem;
}

.hero-stat {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-family: var(--font-display);
  font-size: 1.9rem;
  font-weight: 700;
  background: var(--grad-text);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  line-height: 1.1;
}

.stat-label {
  font-size: 0.82rem;
  color: var(--text-low);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-top: 0.3rem;
}

/* Hero visual */
.hero-visual {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.visual-ring {
  position: absolute;
  inset: -8%;
  border-radius: 50%;
  background: conic-gradient(from 180deg, transparent 0%, rgba(56, 189, 248, 0.25) 25%, transparent 55%, rgba(45, 212, 191, 0.2) 80%, transparent 100%);
  filter: blur(34px);
  animation: spin 14s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.visual-card {
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--line-strong);
  box-shadow: var(--shadow-card), var(--glow-accent);
  max-width: 430px;
  background: #fff;
}

.visual-card img {
  display: block;
  width: 100%;
  height: auto;
}

.visual-chip {
  position: absolute;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-display);
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-hi);
  background: rgba(8, 18, 38, 0.85);
  border: 1px solid var(--line-strong);
  border-radius: 999px;
  padding: 0.55rem 1.1rem;
  backdrop-filter: blur(10px);
  box-shadow: var(--shadow-card);
  white-space: nowrap;
}

.visual-chip i { color: var(--accent-2); }

.chip-top { top: 6%; left: -4%; animation: float 5s ease-in-out infinite; }
.chip-bottom { bottom: 8%; right: -3%; animation: float 5s ease-in-out 1.4s infinite; }

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-9px); }
}

/* Marquee */
.hero-marquee {
  position: relative;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  background: rgba(8, 18, 38, 0.4);
  display: flex;
  align-items: center;
  overflow: hidden;
}

.marquee-label {
  position: relative;
  z-index: 2;
  flex-shrink: 0;
  font-family: var(--font-display);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-low);
  padding: 1.1rem 1.6rem;
  background: var(--abyss-soft);
  border-right: 1px solid var(--line);
}

.marquee-track {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 3.5rem;
  padding-left: 2.5rem;
  animation: marquee 26s linear infinite;
  white-space: nowrap;
}

.marquee-item {
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  font-family: var(--font-display);
  font-size: 1.02rem;
  font-weight: 500;
  color: var(--text-mid);
}

.marquee-item i { color: var(--accent); opacity: 0.7; }

@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

/* ===================== BENTO ===================== */
.bento-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 6rem 1.5rem 3rem;
}

.bento-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.4rem;
}

.bento-card {
  padding: 2rem;
}

.bento-wide { grid-column: span 2; }

.bento-icon {
  font-size: 1.5rem;
  color: var(--accent);
  background: rgba(56, 189, 248, 0.1);
  border: 1px solid rgba(56, 189, 248, 0.3);
  border-radius: var(--radius-sm);
  width: 3rem;
  height: 3rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.2rem;
}

.bento-card h3 {
  font-size: 1.3rem;
  margin: 0 0 0.6rem;
}

.bento-card p {
  color: var(--text-mid);
  margin: 0;
  font-size: 1rem;
}

.bento-card .shaftlok-font { color: var(--text-hi); }

/* ===================== HISTORY ===================== */
.history-section {
  max-width: 1000px;
  margin: 0 auto;
  padding: 5rem 1.5rem 3rem;
}

.timeline {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding-left: 1rem;
}

.timeline::before {
  content: '';
  position: absolute;
  top: 1.5rem;
  bottom: 1.5rem;
  left: 2.6rem;
  width: 2px;
  background: linear-gradient(180deg, rgba(56, 189, 248, 0.5), rgba(45, 212, 191, 0.15));
}

.timeline-item {
  display: flex;
  align-items: flex-start;
  gap: 1.6rem;
}

.timeline-marker {
  flex-shrink: 0;
  width: 3.4rem;
  height: 3.4rem;
  border-radius: 50%;
  background: var(--abyss-soft);
  border: 1px solid var(--line-strong);
  color: var(--accent);
  font-family: var(--font-display);
  font-size: 0.82rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
  box-shadow: 0 0 0 5px var(--abyss), var(--glow-accent);
}

.timeline-card {
  flex: 1;
  padding: 1.7rem 1.9rem;
}

.timeline-card h3 {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  font-size: 1.18rem;
  margin: 0 0 0.7rem;
}

.timeline-card h3 i { color: var(--accent-2); font-size: 1rem; }

.timeline-card p {
  color: var(--text-mid);
  margin: 0 0 0.6rem;
  font-size: 0.98rem;
}

.timeline-card p:last-child { margin-bottom: 0; }

.timeline-card .quote {
  font-style: italic;
  color: var(--gold);
  border-left: 2px solid rgba(245, 198, 107, 0.4);
  padding-left: 0.9rem;
}

.timeline-card a { color: var(--accent); }

.history-cta {
  text-align: center;
  margin-top: 2.6rem;
}

/* ===================== ENGINEERING ===================== */
.engineering-section {
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  background: rgba(8, 18, 38, 0.35);
  padding: 5.5rem 1.5rem;
  margin-top: 3rem;
}

.engineering-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.engineering-copy h2 {
  font-size: clamp(1.9rem, 3.4vw, 2.8rem);
  margin: 0 0 1.6rem;
}

.engineering-btn { margin-top: 1.8rem; }

.engineering-visual {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.2rem;
  align-items: start;
}

.engineering-img {
  overflow: hidden;
  border-radius: var(--radius-lg);
}

.engineering-img img {
  display: block;
  width: 100%;
  height: 280px;
  object-fit: cover;
}

.engineering-img-offset { margin-top: 3rem; }

/* ===================== CTA ===================== */
.cta-section {
  max-width: 1000px;
  margin: 0 auto;
  padding: 5.5rem 1.5rem;
}

.cta-card {
  text-align: center;
  padding: 3.5rem 2.5rem;
  position: relative;
  overflow: hidden;
}

.cta-card::before {
  content: '';
  position: absolute;
  top: -80px;
  left: 50%;
  transform: translateX(-50%);
  width: 480px;
  height: 200px;
  background: radial-gradient(closest-side, rgba(56, 189, 248, 0.22), transparent);
  pointer-events: none;
}

.cta-card h2 {
  font-size: clamp(1.8rem, 3.4vw, 2.6rem);
  margin: 0 0 0.9rem;
  position: relative;
}

.cta-card p {
  color: var(--text-mid);
  font-size: 1.1rem;
  margin: 0 0 2rem;
  position: relative;
}

.cta-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  position: relative;
}

/* ===================== RESPONSIVE ===================== */
@media (max-width: 980px) {
  .hero-inner {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .hero-visual { order: -1; }
  .visual-card { max-width: 330px; }

  .engineering-inner {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .bento-grid { grid-template-columns: 1fr 1fr; }
  .bento-wide { grid-column: span 2; }
}

@media (max-width: 640px) {
  .bento-grid { grid-template-columns: 1fr; }
  .bento-wide { grid-column: span 1; }

  .hero-stats { gap: 1.6rem; }
  .stat-value { font-size: 1.5rem; }

  .timeline::before { left: 2.2rem; }
  .timeline-marker { width: 2.8rem; height: 2.8rem; font-size: 0.7rem; }

  .chip-top { left: 2%; }
  .chip-bottom { right: 2%; }

  .marquee-label { display: none; }
  .marquee-track { padding: 1.1rem 0 1.1rem 1rem; }

  .engineering-visual { grid-template-columns: 1fr; }
  .engineering-img-offset { margin-top: 0; }
  .engineering-img img { height: 220px; }
}
</style>
