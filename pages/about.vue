<template>
  <div class="page-shell">
    <BreadcrumbNav :items="[{ name: 'About' }]" />

    <div class="section-head" v-reveal>
      <span class="eyebrow"><i class="fas fa-compass"></i> Company history</span>
      <h1><span class="shaftlok-font grad-text">Shaft Lok</span> History</h1>
      <p>By Kenneth R. Nigel | July 28, 2023</p>
    </div>

    <!-- Stats band -->
    <div class="stats-band glass-card" v-reveal>
      <div class="stat">
        <span class="stat-number">1979</span>
        <span class="stat-label">Since</span>
      </div>
      <div class="stat">
        <span class="stat-number">1,390+</span>
        <span class="stat-label">Units Shipped</span>
      </div>
      <div class="stat">
        <span class="stat-number">50+</span>
        <span class="stat-label">Boat Types</span>
      </div>
      <div class="stat">
        <span class="stat-number">23+</span>
        <span class="stat-label">Transmissions</span>
      </div>
      <div class="stat">
        <span class="stat-number">2</span>
        <span class="stat-label">Patents</span>
      </div>
    </div>

    <div class="story-grid">
      <div class="story-card glass-card hoverable prose" v-reveal>
        <h2><i class="fas fa-sailboat"></i> The Beginning</h2>
        <p>In 1978, Dick Badzinski and George Nigel, both sailboat owners, faced a common problem: their propellers
          would rotate freely while sailing without engine power. This freewheeling caused:</p>
        <ul class="check-list">
          <li>Reduced boat speed</li>
          <li>Unwanted vibration and noise</li>
          <li>Unnecessary drive train wear</li>
        </ul>
        <p class="quote">As Kenneth Nigel describes, "Both sailors said it was like a dripping faucet which just got
          on one's nerves."</p>
      </div>

      <div class="story-card glass-card hoverable prose" v-reveal="100">
        <h2><i class="fas fa-lightbulb"></i> The Invention</h2>
        <p>Working at Rex Chain Belt in Milwaukee, Wisconsin as a Product Marketing Manager, Kenneth encouraged them
          to pursue the invention that could be marketed worldwide. After finalizing the concept design, they built a
          working model and secured three patents with the help of a family connection in Boston.</p>
        <p>During this period, they were advised to maintain confidentiality until all patent documents were properly
          filed with the government.</p>
      </div>

      <div class="story-card glass-card hoverable prose" v-reveal>
        <h2><i class="fas fa-trophy"></i> Early Success</h2>
        <p>The founders pooled their resources to:</p>
        <ul class="check-list">
          <li>Publish a four-color bulletin</li>
          <li>Build a website</li>
          <li>Begin advertising</li>
        </ul>
        <p>Their breakthrough came at the Chicago Boat Show, where they approached Borg Warner, a manufacturer of
          transmissions for sailboats under 100 feet. The response from Borg Warner's east and west coast dealers was
          overwhelmingly positive, leading to the first shipments of Mod I units in 1979.</p>
      </div>

      <div class="story-card glass-card hoverable prose" v-reveal="100">
        <h2><i class="fas fa-flask"></i> Innovation &amp; Patents</h2>
        <p>The company evolved from a 2V design to the Easy Lok concept, significantly improving the locking
          mechanism's ease of use.</p>
        <p>U.S. Patent &amp; Trademark Office Recognition:</p>
        <ul class="check-list">
          <li>Patent Numbers:
            <a href="https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/4389199" target="_blank" rel="noopener">#4389199</a>
            and
            <a href="https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/D271583" target="_blank" rel="noopener">#D271583</a>
          </li>
        </ul>
      </div>
    </div>

    <div class="features-card glass-card prose" v-reveal>
      <h2><i class="fas fa-star"></i> <span class="shaftlok-font">Shaft Lok</span> Noteworthy Features</h2>
      <ul class="check-list">
        <li>No power is required…save the batteries…no electrical wires or hydraulic hoses.</li>
        <li>Simple design, few moving parts, easy to install. Two patents awarded in 1981.</li>
        <li>The "Engine" is a stainless steel compression spring with thousands of life cycles, which will never need
          replacing… Guaranteed!</li>
        <li>The Marine Hard Polyurethane unit which is light weight and proven that it will easily tolerate salt water
          environment including the drive train's vibrations will last longer than the both of us.</li>
        <li>The propeller shaft Hub, Anti-Torque Bracket and all fasteners are made of Stainless Steel.</li>
        <li>The single deep groove double shielded ball bearing does not need any maintenance.</li>
        <li>The long locking pin that contacts the rotating disc's 45 degree locking ramp and the short pin that holds
          the long pin in the locked or unlocked position are key unit components. These pins are made of Acetron AF
          POM-H acetal is a unique thermoplastic material for use in moving parts in which low friction and long wear
          life are important. It is a combination of Teflon fibers uniformly dispersed in Delrin acetal resin. A
          material that has strength, toughness, dimensional stability and good machinability with excellent
          sliding/friction properties. The natural color is dark brown. Data provided by Quadrant Engineering Plastic
          Products from tests on stock shapes and parts produced by Quadrant EPP.</li>
      </ul>
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
.stats-band {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
  padding: 2rem 1.5rem;
  margin-bottom: 2.5rem;
  text-align: center;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.stat-number {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 700;
  background: var(--grad-text);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  line-height: 1.1;
}

.stat-label {
  font-size: 0.8rem;
  color: var(--text-low);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.story-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.4rem;
  margin-bottom: 1.4rem;
}

.story-card,
.features-card {
  padding: 2rem 2.1rem;
}

.story-card h2,
.features-card h2 {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  font-size: 1.25rem;
  margin: 0 0 1rem;
}

.story-card h2 i,
.features-card h2 i {
  color: var(--accent);
  font-size: 1.05rem;
  background: rgba(56, 189, 248, 0.1);
  border: 1px solid rgba(56, 189, 248, 0.28);
  border-radius: var(--radius-sm);
  width: 2.3rem;
  height: 2.3rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.quote {
  font-style: italic;
  color: var(--gold);
  border-left: 2px solid rgba(245, 198, 107, 0.4);
  padding-left: 0.9rem;
}

.check-list { margin-bottom: 1rem; }

@media (max-width: 860px) {
  .story-grid { grid-template-columns: 1fr; }
  .stats-band { grid-template-columns: repeat(3, 1fr); row-gap: 1.5rem; }
}

@media (max-width: 520px) {
  .stats-band { grid-template-columns: repeat(2, 1fr); }
}
</style>
