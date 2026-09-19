<template>
  <div class="page-shell">
    <BreadcrumbNav :items="[{ name: 'Emergency Shaft Lok' }]" />

    <div class="section-head" v-reveal>
      <span class="eyebrow"><i class="fas fa-file-contract"></i> Shipyards, architects &amp; contractors</span>
      <h1>Emergency Shaft Lok for a <span class="grad-text">bent shaft</span> or damaged reduction gear</h1>
      <p>
        <span class="shaftlok-font">Shaft Lok</span> is a provision to lock and secure the propeller shaft from rotation —
        for sailing, and for an emergency that leaves the shaft or gearbox compromised.
      </p>
    </div>

    <blockquote class="spec-quote glass-card" v-reveal>
      <p class="spec-kicker">Typical specification language</p>
      <p>
        The contractor shall include a provision to lock/secure the shaft from rotation in an emergency
        resulting from a bent shaft or damaged reduction gear. The system shall be capable of locking
        the shaft at a minimum of 5 knots. Any additional gear or rigging that is necessary to operate
        the system shall be provided with dedicated, labeled stowage. Instructions, diagrams and any
        performance limitations shall be clearly identified in a local placard.
      </p>
    </blockquote>

    <div class="req-grid">
      <div class="req-card glass-card hoverable prose" v-reveal>
        <h2><i class="fas fa-lock"></i> Lock the shaft from rotation</h2>
        <p>
          Shaft Lok engages the propeller shaft so it cannot freewheel. That is the same mechanical job
          a specification calls for after a bent shaft or a damaged reduction gear: keep the shaft from
          rotating until the vessel can be brought in under control.
        </p>
      </div>

      <div class="req-card glass-card hoverable prose" v-reveal="80">
        <h2><i class="fas fa-water"></i> Underway, including 5 knots</h2>
        <p>
          The lock is designed to hold the shaft while the vessel is sailing or otherwise underway.
          If the contract requires locking at a minimum of 5 knots, send the vessel, shaft, and
          propulsion details with the quote so we can confirm the correct model for that duty.
        </p>
      </div>

      <div class="req-card glass-card hoverable prose" v-reveal>
        <h2><i class="fas fa-box-open"></i> Operating gear and stowage</h2>
        <p>
          Operation is from the cockpit with a Marine Control Cable, or in the engine room with the
          Simple Spring Locking System. Any extra gear or rigging needed to operate the system can be
          quoted with dedicated, labeled stowage when the specification requires it.
        </p>
      </div>

      <div class="req-card glass-card hoverable prose" v-reveal="80">
        <h2><i class="fas fa-clipboard-list"></i> Instructions, diagrams, placard</h2>
        <p>
          Installation instructions and diagrams ship with the unit. Performance limitations belong
          on a local placard next to the gear — we can include that wording and a placard with the
          order when the contract calls for it.
        </p>
      </div>
    </div>

    <div class="cta-band glass-card" v-reveal>
      <div>
        <h2>Bidding a spec that calls for a Shaft Lok?</h2>
        <p>
          Put the specification text in the quote notes, with shaft diameter, gearbox, and vessel type.
          We will match a model and note any placard or stowage items the contract lists.
        </p>
      </div>
      <div class="cta-actions">
        <NuxtLink to="/quote" class="btn btn-primary">Get a Quote</NuxtLink>
        <NuxtLink to="/contact" class="btn btn-ghost">Contact Us</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
const pageUrl = 'https://shaftlok.com/emergency-shaft-lok'
const pageTitle = 'Emergency Shaft Lok for Bent Shaft or Damaged Reduction Gear'
const pageDescription = 'Shaft Lok locks and secures the propeller shaft from rotation in an emergency from a bent shaft or damaged reduction gear. For contractors specifying a Shaft Lok at 5 knots, with labeled stowage, instructions, diagrams, and a local placard.'

useHead({
  title: 'Emergency Shaft Lok',
  meta: [
    { name: 'description', content: pageDescription },
    { property: 'og:title', content: `${pageTitle} - Shaft Lok` },
    { property: 'og:description', content: pageDescription },
    { property: 'og:image', content: 'https://shaftlok.com/assets/images/Logo_propeller_only.png' },
    { property: 'og:url', content: pageUrl },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'Shaft Lok Inc.' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: `${pageTitle} - Shaft Lok` },
    { name: 'twitter:description', content: pageDescription },
    { name: 'twitter:image', content: 'https://shaftlok.com/assets/images/Logo_ShaftLok_whiteBG-landscape.png' }
  ],
  link: [
    { rel: 'canonical', href: pageUrl }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://shaftlok.com/' },
          { '@type': 'ListItem', position: 2, name: 'Emergency Shaft Lok', item: pageUrl }
        ]
      })
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: pageTitle,
        description: pageDescription,
        url: pageUrl,
        isPartOf: {
          '@type': 'WebSite',
          name: 'Shaft Lok Inc.',
          url: 'https://shaftlok.com'
        },
        about: {
          '@type': 'Product',
          name: 'Shaft Lok',
          description: 'Marine shaft locking system to lock and secure the propeller shaft from rotation after a bent shaft or damaged reduction gear.'
        }
      })
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Does Shaft Lok lock and secure the shaft from rotation in an emergency?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. Shaft Lok is a provision to lock and secure the propeller shaft from rotation, including after a bent shaft or damaged reduction gear, so the shaft cannot freewheel.'
            }
          },
          {
            '@type': 'Question',
            name: 'Can Shaft Lok lock the shaft at a minimum of 5 knots?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Shaft Lok is designed to hold the shaft while the vessel is sailing or underway. If a specification requires locking at a minimum of 5 knots, include vessel, shaft, and propulsion details with the quote so the correct model can be confirmed.'
            }
          },
          {
            '@type': 'Question',
            name: 'Does Shaft Lok include labeled stowage, instructions, diagrams, and a local placard?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Installation instructions and diagrams ship with the unit. Dedicated labeled stowage and a local placard identifying instructions, diagrams, and performance limitations can be included with the quote when the contract requires them.'
            }
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
.spec-quote {
  max-width: 52rem;
  margin: 0 auto 2.5rem;
  padding: 1.6rem 1.8rem;
  border-left: 3px solid var(--gold);
}

.spec-kicker {
  margin: 0 0 0.7rem;
  font-family: var(--font-display);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--gold);
}

.spec-quote p:last-child {
  margin: 0;
  color: var(--text-mid);
  line-height: 1.7;
}

.req-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.4rem;
  margin-bottom: 1.6rem;
}

.req-card {
  padding: 2rem 2.1rem;
}

.req-card h2 {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  font-size: 1.2rem;
  margin: 0 0 1rem;
}

.req-card h2 i {
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

.cta-band {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  flex-wrap: wrap;
  padding: 2rem 2.2rem;
}

.cta-band h2 {
  font-size: 1.3rem;
  margin: 0 0 0.4rem;
}

.cta-band p {
  color: var(--text-mid);
  margin: 0;
  max-width: 40rem;
  line-height: 1.6;
}

.cta-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

@media (max-width: 860px) {
  .req-grid { grid-template-columns: 1fr; }
}
</style>
