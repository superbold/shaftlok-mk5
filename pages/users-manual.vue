<template>
  <div>
    <div class="yacht-container manual-page">
      <BreadcrumbNav admin :items="[{ name: 'Users Manual' }]" />
      <article class="glass-card manual" v-html="html" />
    </div>
  </div>
</template>

<script setup>
import manualSource from '~~/docs/_Shaft-Lok-Users-Manual.md?raw'
import { renderSimpleMarkdown } from '~~/utils/simpleMarkdown'

definePageMeta({
  layout: 'manual-layout',
  middleware: 'admin'
})

const html = renderSimpleMarkdown(manualSource)

useHead({
  title: 'Users Manual',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' },
    { name: 'description', content: 'How to use the Shaft Lok website.' }
  ]
})
</script>

<style scoped>
.manual-page {
  padding-bottom: 3rem;
}

.manual {
  padding: 1.6rem 1.8rem 2rem;
  max-width: 760px;
}

.manual :deep(h1) {
  margin: 0 0 0.8rem;
  font-family: var(--font-display);
  font-size: 1.8rem;
  color: var(--text-hi);
}

.manual :deep(h2) {
  margin: 1.8rem 0 0.6rem;
  font-family: var(--font-display);
  font-size: 1.15rem;
  color: var(--accent);
}

.manual :deep(p),
.manual :deep(li) {
  color: var(--text-mid);
  line-height: 1.65;
}

.manual :deep(p) {
  margin: 0 0 0.85rem;
}

.manual :deep(ul) {
  margin: 0 0 1rem;
  padding-left: 1.2rem;
}

.manual :deep(li) {
  margin: 0.25rem 0;
}

.manual :deep(strong) {
  color: var(--text-hi);
}

.manual :deep(a) {
  color: var(--accent);
}

.manual :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 0.4rem 0 1rem;
  font-size: 0.95rem;
}

.manual :deep(th),
.manual :deep(td) {
  text-align: left;
  padding: 0.55rem 0.7rem 0.55rem 0;
  border-bottom: 1px solid var(--line);
  vertical-align: top;
}

.manual :deep(th) {
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--accent);
}

@media (max-width: 600px) {
  .manual { padding: 1.3rem 1.15rem 1.6rem; }
  .manual :deep(h1) { font-size: 1.45rem; }
}
</style>
