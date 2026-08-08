<template>
  <div class="email-frame-shell">
    <iframe ref="frameEl" :title="title" class="email-frame"></iframe>
  </div>
</template>

<script setup>
const props = defineProps({
  html: { type: String, required: true },
  title: { type: String, default: 'Email preview' }
})

const frameEl = ref(null)

onMounted(() => {
  frameEl.value.srcdoc = props.html
  frameEl.value.addEventListener('load', () => {
    const doc = frameEl.value.contentDocument
    frameEl.value.style.height = Math.max(doc.documentElement.scrollHeight + 20, 400) + 'px'
  })
})

watch(() => props.html, (html) => {
  if (frameEl.value) frameEl.value.srcdoc = html
})
</script>

<style scoped>
.email-frame-shell {
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--line);
}

.email-frame {
  width: 100%;
  border: none;
  display: block;
  background: #040A18;
}
</style>
