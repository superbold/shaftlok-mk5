<template>
  <div class="page-shell quote-view">
    <div v-if="pending" class="glass-card quote-view-status">
      <p><i class="fas fa-spinner fa-spin"></i> Loading your quote…</p>
    </div>

    <div v-else-if="!html" class="glass-card quote-view-status">
      <p>This quote link is not available.</p>
      <p class="quote-view-sub">Reply to your Shaft Lok email and we will send it again.</p>
    </div>

    <EmailFrame v-else :html="html" title="Your Shaft Lok quote" />
  </div>
</template>

<script setup>
const route = useRoute()
const token = computed(() => String(route.params.token || ''))
const tokenIsValid = computed(() => /^[a-f0-9]{64}$/i.test(token.value))

// A bad link never calls the API. Calling our own API from this page during
// server render wedged the dev server (the request waited on itself).
const { data, pending } = await useAsyncData(
  () => `quote-view-${token.value}`,
  async () => {
    if (!tokenIsValid.value) return null
    try {
      return await $fetch(`/api/q/${encodeURIComponent(token.value)}`)
    } catch {
      return null
    }
  },
  { watch: [token] }
)

const html = computed(() => data.value?.html || '')

useHead({
  title: 'Your Shaft Lok Quote',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }]
})
</script>

<style scoped>
.quote-view {
  max-width: 760px;
}

.quote-view-status {
  padding: 1.5rem 1.4rem;
  color: var(--text-hi);
  line-height: 1.6;
}

.quote-view-status p {
  margin: 0;
}

.quote-view-sub {
  margin-top: 0.6rem !important;
  color: var(--text-mid);
}
</style>
