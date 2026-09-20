<template>
  <div class="page-shell">
    <BreadcrumbNav :items="[{ name: 'Order confirmed' }]" />

    <div class="section-head">
      <span class="eyebrow"><i class="fas fa-circle-check"></i> Payment</span>
      <h1>Order <span class="shaftlok-font grad-text">Confirmed</span></h1>
      <p v-if="pay?.quote_number">
        Quote {{ pay.quote_number }}<template v-if="pay.yacht"> · {{ pay.yacht }}</template>
      </p>
    </div>

    <div class="confirm-wrap">
      <div v-if="loadError" class="glass-card confirm-card">
        <p class="confirm-status error"><i class="fas fa-exclamation-triangle"></i> {{ loadError }}</p>
      </div>

      <div v-else class="glass-card confirm-card">
        <p class="thank-you">Thank you for your order. Happy sailing!</p>

        <p v-if="isPaid" class="confirm-meta">
          <template v-if="pay.name">{{ pay.name }} · </template>
          Paid<template v-if="amountLabel"> {{ amountLabel }}</template><template v-if="methodLabel"> by {{ methodLabel }}</template>.
        </p>
        <p v-else-if="isPending" class="confirm-meta pending">
          Bank transfer received. We will mark this quote paid when the funds clear.
        </p>
        <p v-else class="confirm-meta confirming">
          Confirming your payment with Stripe…
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatUsd } from '~~/utils/quotePayment'

definePageMeta({ layout: 'default' })

const route = useRoute()
const token = computed(() => String(route.params.token || ''))
const sessionId = computed(() => String(route.query.session_id || ''))

useHead({
  title: 'Order Confirmed',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' },
    { name: 'description', content: 'Your Shaft Lok order is confirmed.' }
  ]
})

const pay = ref(null)
const loadError = ref('')
const isPaid = computed(() => pay.value?.payment_status === 'paid')
const isPending = computed(() => pay.value?.payment_status === 'pending')

const methodLabel = computed(() => {
  if (pay.value?.payment_method === 'card') return 'credit card'
  if (pay.value?.payment_method === 'bank') return 'bank transfer'
  return ''
})

const amountLabel = computed(() => {
  const amount = pay.value?.amount_charged
  if (amount == null || amount === '') return ''
  return formatUsd(Number(amount))
})

const loadPay = async () => {
  try {
    pay.value = await $fetch(`/api/pay/${encodeURIComponent(token.value)}/confirm`, {
      method: 'POST',
      body: sessionId.value ? { session_id: sessionId.value } : {}
    })
    loadError.value = ''
  } catch (err) {
    loadError.value = err.data?.statusMessage || err.message || 'This payment link is not valid.'
  }
}

await loadPay()

let pollTimer = null

const stopPoll = () => {
  if (pollTimer) {
    clearInterval(pollTimer)
    pollTimer = null
  }
}

onMounted(() => {
  if (isPaid.value || isPending.value || loadError.value) return

  pollTimer = setInterval(async () => {
    await loadPay()
    if (isPaid.value || isPending.value || loadError.value) stopPoll()
  }, 2000)

  setTimeout(stopPoll, 45000)
})

onUnmounted(stopPoll)
</script>

<style scoped>
.confirm-wrap {
  max-width: 640px;
  margin: 0 auto;
}

.confirm-card {
  padding: 2rem 2.1rem;
}

.thank-you {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 600;
  color: var(--text-hi);
  line-height: 1.45;
}

.confirm-meta {
  margin: 1rem 0 0;
  color: var(--text-mid);
  font-size: 1rem;
  line-height: 1.6;
}

.confirm-meta.pending,
.confirm-meta.confirming {
  color: var(--gold);
}

.confirm-status {
  margin: 0;
  color: var(--text-mid);
}

.confirm-status.error { color: #FCA5A5; }

@media (max-width: 600px) {
  .confirm-card { padding: 1.5rem 1.3rem; }
  .thank-you { font-size: 1.2rem; }
}
</style>
