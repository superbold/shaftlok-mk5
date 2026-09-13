<template>
  <div class="page-shell">
    <BreadcrumbNav :items="[{ name: 'Terms and Conditions' }]" />

    <div class="section-head" v-reveal>
      <span class="eyebrow"><i class="fas fa-file-contract"></i> Legal</span>
      <h1>Terms and <span class="shaftlok-font grad-text">Conditions</span></h1>
      <p>Last updated: September 2026</p>
    </div>

    <div class="terms-wrap">
      <div class="terms-body glass-card prose" v-reveal>
        <p>These terms apply to Shaft Lok Inc. quotes and orders. They are included with every quote we send.</p>

        <ol class="terms-list">
          <li v-for="term in TERMS_AND_CONDITIONS" :key="term">{{ term }}</li>
        </ol>

        <p>Questions about these terms can be directed to <a href="mailto:sean.nigel@shaftlok.com">sean.nigel@shaftlok.com</a>.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'Terms and Conditions',
  meta: [
    { name: 'description', content: 'Shaft Lok Inc. terms and conditions for quotes and orders — payment, cancellation, design ownership, and returns.' },
    { name: 'robots', content: 'index, follow' }
  ],
  link: [{ rel: 'canonical', href: 'https://shaftlok.com/terms' }]
})

definePageMeta({ layout: 'default' })
</script>

<style scoped>
.terms-wrap {
  max-width: 720px;
  margin: 0 auto;
}

.terms-body {
  padding: 2.4rem 2.8rem;
}

.terms-body p {
  color: var(--text-mid);
  line-height: 1.75;
  font-size: 0.97rem;
}

.terms-body a {
  color: var(--accent);
  text-decoration: none;
}

.terms-body a:hover { color: var(--accent-2); }

.terms-list {
  margin: 1.4rem 0 1.6rem;
  padding-left: 1.4rem;
  color: var(--text-mid);
  font-size: 0.97rem;
  line-height: 1.75;
}

.terms-list li { margin-bottom: 0.7rem; }

.terms-list li:last-child { margin-bottom: 0; }

@media (max-width: 600px) {
  .terms-body { padding: 1.6rem 1.4rem; }
}
</style>
