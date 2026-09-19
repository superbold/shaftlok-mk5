<template>
  <div class="email-frame-shell" :class="{ 'email-frame-flush': flush }">
    <iframe ref="frameEl" :title="title" class="email-frame"></iframe>
  </div>
</template>

<script setup>
const props = defineProps({
  html: { type: String, required: true },
  title: { type: String, default: 'Email preview' },
  flush: { type: Boolean, default: false }
})

const frameEl = ref(null)
let htmlTimer = null

const FLUSH_CSS = `
html, body {
  background: transparent !important;
  margin: 0 !important;
  padding: 0 !important;
  height: auto !important;
}
body > div {
  max-width: none !important;
  margin: 0 !important;
  border: none !important;
  border-radius: 0 !important;
}
`

const flushPreview = () => {
  const doc = frameEl.value?.contentDocument
  if (!doc?.head || !props.flush) return
  let style = doc.getElementById('email-frame-flush')
  if (!style) {
    style = doc.createElement('style')
    style.id = 'email-frame-flush'
    doc.head.appendChild(style)
  }
  style.textContent = FLUSH_CSS
}

const fitFrameHeight = () => {
  const frame = frameEl.value
  if (!frame) return
  flushPreview()
  const doc = frame.contentDocument
  if (!doc) return
  // Collapse first so scrollHeight is the content, not the previous iframe box.
  // Otherwise each srcdoc reload ratchets height upward (scrollHeight ≈ old height + padding).
  frame.style.height = '0px'
  const contentHeight = Math.max(
    doc.documentElement?.scrollHeight ?? 0,
    doc.body?.scrollHeight ?? 0
  )
  frame.style.height = Math.max(contentHeight, 400) + 'px'
}

const writeHtml = (html) => {
  if (frameEl.value) frameEl.value.srcdoc = html
}

onMounted(() => {
  frameEl.value.addEventListener('load', fitFrameHeight)
  writeHtml(props.html)
})

watch(() => props.html, (html) => {
  clearTimeout(htmlTimer)
  htmlTimer = setTimeout(() => writeHtml(html), 120)
})

onUnmounted(() => {
  clearTimeout(htmlTimer)
  frameEl.value?.removeEventListener('load', fitFrameHeight)
})
</script>

<style scoped>
.email-frame-shell {
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--line);
}

.email-frame-flush {
  border: none;
  border-radius: 0;
  overflow: visible;
}

.email-frame {
  width: 100%;
  border: none;
  display: block;
  background: #040A18;
}

.email-frame-flush .email-frame {
  background: transparent;
}
</style>
