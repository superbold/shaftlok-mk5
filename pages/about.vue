<template>
  <div>
    <BreadcrumbNav :items="[{ name: 'About' }]" />
    
    <div class="product-container">
      <div class="product-detail">
        <h1 class="page-title"><span class="shaft-lok-text">Shaft Lok</span> History</h1>
        <p class="page-description">By Kenneth R. Nigel | July 28, 2023</p>
      </div>
      <div class="about-content">
        <div class="about-card" style="animation-delay: 0.2s">
          <h2 class="beginning">The Beginning</h2>
          <p>In 1978, Dick Badzinski and George Nigel, both sailboat owners, faced a common problem: their propellers would rotate freely while sailing without engine power. This freewheeling caused:</p>
          <ul class="about-features">
            <li>Reduced boat speed</li>
            <li>Unwanted vibration and noise</li>
            <li>Unnecessary drive train wear</li>
          </ul>
          <p>As Kenneth Nigel describes, "Both sailors said it was like a dripping faucet which just got on one's nerves."</p>
        </div>

        <div class="about-card" style="animation-delay: 0.4s">
          <h2 class="invention">The Invention</h2>
          <p>Working at Rex Chain Belt in Milwaukee, Wisconsin as a Product Marketing Manager, Kenneth encouraged them to pursue the invention that could be marketed worldwide. After finalizing the concept design, they built a working model and secured three patents with the help of a family connection in Boston.</p>
          <p>During this period, they were advised to maintain confidentiality until all patent documents were properly filed with the government.</p>
        </div>

        <div class="about-card" style="animation-delay: 0.6s">
          <h2 class="success">Early Success</h2>
          <p>The founders pooled their resources to:</p>
          <ul class="about-features">
            <li>Publish a four-color bulletin</li>
            <li>Build a website</li>
            <li>Begin advertising</li>
          </ul>
          <p>Their breakthrough came at the Chicago Boat Show, where they approached Borg Warner, a manufacturer of transmissions for sailboats under 100 feet. The response from Borg Warner's east and west coast dealers was overwhelmingly positive, leading to the first shipments of Mod I units in 1979.</p>
        </div>

        <div class="about-card" style="animation-delay: 0.8s">
          <h2 class="innovation">Innovation & Patents</h2>
          <p>The company evolved from a 2V design to the Easy Lok concept, significantly improving the locking mechanism's ease of use.</p>
          <p>U.S. Patent & Trademark Office Recognition:</p>
          <ul class="about-features">
            <li>Patent Numbers: <a href="https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/4389199" target="_blank" rel="noopener">#4389199</a> and <a href="https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/D271583" target="_blank" rel="noopener">#D271583</a></li>
          </ul>
        </div>

        <div class="about-card" style="animation-delay: 1.0s">
          <h2 class="numbers">By The Numbers</h2>
          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-number">1979</span>
              <span class="stat-label">Since</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">1390+</span>
              <span class="stat-label">Units Shipped</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">50+</span>
              <span class="stat-label">Boat Types</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">23+</span>
              <span class="stat-label">Transmissions</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">2</span>
              <span class="stat-label">Patents</span>
            </div>
          </div>
        </div>

        <div class="about-card" style="animation-delay: 1.2s">
          <h2 class="features"><span class="shaft-lok-text">Shaft Lok</span> Noteworthy Features</h2>
          <ul class="about-features">
            <li>No power is required…save the batteries…no electrical wires or hydraulic hoses.</li>
            <li>Simple design, few moving parts, easy to install. Two patents awarded in 1981.</li>
            <li>The "Engine" is a stainless steel compression spring with thousands of life cycles, which will never need replacing… Guaranteed!</li>
            <li>The Marine Hard Polyurethane unit which is light weight and proven that it will easily tolerate salt water environment including the drive train's vibrations will last longer than the both of us.</li>
            <li>The propeller shaft Hub, Anti-Torque Bracket and all fasteners are made of Stainless Steel.</li>
            <li>The single deep groove double shielded ball bearing does not need any maintenance.</li>
            <li>The long locking pin that contacts the rotating disc's 45 degree locking ramp and the short pin that holds the long pin in the locked or unlocked position are key unit components. These pins are made of Acetron AF POM-H acetal is a unique thermoplastic material for use in moving parts in which low friction and long wear life are important. It is a combination of Teflon fibers uniformly dispersed in Delrin acetal resin. A material that has strength, toughness, dimensional stability and good machinability with excellent sliding/friction properties. The natural color is dark brown. Data provided by Quadrant Engineering Plastic Products from tests on stock shapes and parts produced by Quadrant EPP.</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'About',
  meta: [
    { name: 'description', content: 'Learn about Shaft Lok\'s commitment to innovation in marine locking systems. Over 30 years of experience in developing reliable shaft locking systems for the marine industry.' },
    { property: 'og:title', content: 'About Shaft Lok - Marine Innovation Since 1979' },
    { property: 'og:description', content: 'Learn about Shaft Lok\'s commitment to marine safety and innovation. Over 30 years of experience in developing reliable shaft locking systems for the marine industry.' },
    { property: 'og:image', content: 'https://shaftlok.com/assets/images/Logo_propeller_only.png' },
    { property: 'og:url', content: 'https://shaftlok.com/about' },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'Shaft Lok Inc.' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'About Shaft Lok - Marine Innovation Since 1979' },
    { name: 'twitter:description', content: 'Learn about Shaft Lok\'s commitment to marine safety and innovation. Over 30 years of experience in developing reliable shaft locking systems.' },
    { name: 'twitter:image', content: 'https://shaftlok.com/assets/images/Logo_ShaftLok_whiteBG-landscape.png' }
  ],
  link: [
    { rel: 'canonical', href: 'https://shaftlok.com/about' }
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
            name: 'About',
            item: 'https://shaftlok.com/about'
          }
        ]
      })
    },
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'About Shaft Lok - Marine Shaft Locking System Innovation Since 1979',
        description: 'Learn about Shaft Lok\'s commitment to innovation in marine shaft locking systems. Over 30 years of experience in developing reliable shaft locking systems for the marine industry.',
        url: 'https://shaftlok.com/about',
        isPartOf: {
          '@type': 'WebSite',
          name: 'Shaft Lok Inc.',
          url: 'https://shaftlok.com'
        },
        about: {
          '@type': 'Organization',
          name: 'Shaft Lok Inc.',
          description: 'Leading manufacturer of marine shaft locking systems that prevent propeller shaft spinning for improved sailboat performance and industrial vessel MTBF optimization'
        },
        mainEntity: {
          '@type': 'Article',
          headline: 'Shaft Lok History - The Story of Marine Shaft Locking Innovation'
        }
      })
    },
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'Shaft Lok History - The Story of Marine Propeller Control Innovation',
        description: 'The complete history of Shaft Lok Inc., from its founding in 1978 by Dick Badzinski and George Nigel to becoming the leading manufacturer of marine propeller control systems. Learn about the invention, early success, and continued innovation in marine technology.',
        author: {
          '@type': 'Person',
          name: 'Kenneth R. Nigel',
          jobTitle: 'Company Representative',
          worksFor: {
            '@type': 'Organization',
            name: 'Shaft Lok Inc.'
          }
        },
        publisher: {
          '@type': 'Organization',
          name: 'Shaft Lok Inc.',
          url: 'https://shaftlok.com',
          logo: {
            '@type': 'ImageObject',
            url: 'https://shaftlok.com/assets/images/Logo_ShaftLok_whiteBG-landscape.png'
          }
        },
        datePublished: '2023-07-28',
        dateModified: '2024-12-19',
        mainEntityOfPage: 'https://shaftlok.com/about',
        articleBody: 'In 1978, Dick Badzinski and George Nigel, both sailboat owners, faced a common problem: their propellers would rotate freely while sailing without engine power. This freewheeling caused reduced boat speed, unwanted vibration and noise, and unnecessary drive train wear. Working at Rex Chain Belt in Milwaukee, Wisconsin as a Product Marketing Manager, Kenneth encouraged them to pursue the invention that could be marketed worldwide. After finalizing the concept design, they built a working model and secured three patents. The founders pooled their resources to establish Shaft Lok Inc. in 1979, focusing on manufacturing and marketing their innovative marine propeller control systems. Today, Shaft Lok continues to lead the industry with over 40 years of experience in marine technology innovation.',
        wordCount: 1200,
        articleSection: 'Company History',
        keywords: ['Shaft Lok history', 'marine propeller control', 'sailboat innovation', 'marine technology', 'propeller locking system', 'Dick Badzinski', 'George Nigel', 'Kenneth Nigel', 'marine equipment', 'sailing technology'],
        about: {
          '@type': 'Thing',
          name: 'Marine Propeller Control Systems',
          description: 'Innovative systems for controlling marine propellers during sailing'
        },
        mentions: [
          {
            '@type': 'Person',
            name: 'Dick Badzinski'
          },
          {
            '@type': 'Person',
            name: 'George Nigel'
          },
          {
            '@type': 'Organization',
            name: 'Rex Chain Belt'
          }
        ],
        image: 'https://shaftlok.com/assets/images/Logo_propeller_only.png',
        url: 'https://shaftlok.com/about',
        inLanguage: 'en-US',
        isPartOf: {
          '@type': 'WebSite',
          name: 'Shaft Lok Inc.',
          url: 'https://shaftlok.com'
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
.product-container {
  margin-top: 8rem;
  min-height: 100vh;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.product-container::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('/assets/images/shaftlok-canvasback.png');
  background-size: 120%;
  background-position-x: -15rem;
  background-repeat: no-repeat;
  background-attachment: fixed;
  transform: scaleX(-1);
  z-index: 0;
}

.product-container::after {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, 
    rgba(202, 240, 248, 0.65) 0%,
    rgba(0, 119, 182, 0.75) 50%,
    rgba(3, 4, 94, 0.85) 100%);
  z-index: 1;
}

.product-detail {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.page-title {
  text-align: center;
  color: var(--light-cyan);
  font-family: 'DeVinneOrnamentDRegular', serif;
  font-size: var(--font-size-title);
  margin-top: 1rem;
  margin-bottom: 0;
  animation: fadeIn 1s ease-out forwards;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  position: relative;
  z-index: 2;
}

.page-description {
  font-size: var(--font-size-subtitle);
  color: var(--light-cyan);
  max-width: 1200px;
  margin: 0 auto;
  margin-bottom: 3rem;
  animation: fadeIn 1s ease-out 0.5s forwards;
  opacity: 0;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  position: relative;
  z-index: 2;
  text-align: center;
}

.about-content {
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
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
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.8s ease-out forwards;
  opacity: 0;
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.about-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
}

.about-card h2 {
  color: var(--federal-blue);
  font-size: var(--font-size-subtitle);
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

.about-card h2.beginning::before {
  content: '\f1da';
}

.about-card h2.invention::before {
  content: '\f0eb';
}

.about-card h2.success::before {
  content: '\f091';
}

.about-card h2.innovation::before {
  content: '\f0c3';
}

.about-card h2.numbers::before {
  content: '\f080';
}

.about-card h2.features::before {
  content: '\f005';
}

.about-card h2.features {
  margin-top: 0;
}

.about-card h2.success + p + .about-features {
  margin-bottom: 0;
}

.about-card p {
  color: #333;
  font-size: var(--font-size-description);
  margin-top: 0;
  margin-bottom: 0.5rem;
}

.about-features {
  list-style: none;
  padding: 0;
  margin: 1rem 0;
}

.about-features li {
  margin-bottom: 1rem;
  padding-left: 2rem;
  position: relative;
  color: #333;
  line-height: 1.6;
}

.about-features li::before {
  content: '\f00c';
  font-family: 'Font Awesome 6 Free';
  font-weight: 900;
  color: var(--honolulu-blue);
  position: absolute;
  left: 0;
  top: 0;
}

.about-card a {
  color: var(--honolulu-blue);
  text-decoration: none;
  transition: all 0.3s ease;
  font-weight: bold;
}

.about-card a:hover {
  color: var(--federal-blue);
  text-decoration: underline;
}

.shaft-lok-text {
  font-family: 'DeVinneOrnamentDRegular', serif;
  color: var(--federal-blue);
  font-weight: bold;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
  margin-top: 0;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.stat-number {
  font-size: 2rem;
  font-weight: bold;
  color: var(--honolulu-blue);
  margin-bottom: 0.5rem;
}

.stat-label {
  color: #333;
  font-size: 1rem;
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
  .product-container {
    padding: 1rem;
    margin-top: 6rem;
  }

  .about-content {
    max-width: 100%;
  }

  .about-card {
    padding: 1.5rem;
  }

  .page-title {
    font-size: calc(var(--font-size-title) * 0.8);
  }

  .page-description {
    font-size: calc(var(--font-size-subtitle) * 0.9);
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
}
</style>