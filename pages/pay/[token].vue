<template>
  <div class="page-shell">
    <BreadcrumbNav :items="[{ name: 'Pay quote' }]" />

    <div class="section-head" v-reveal>
      <span class="eyebrow"><i class="fas fa-credit-card"></i> Pay your quote</span>
      <h1>Pay this <span class="shaftlok-font grad-text">Quote</span></h1>
      <p v-if="pay?.quote_number">Quote {{ pay.quote_number }}<template v-if="pay.yacht"> · {{ pay.yacht }}</template></p>
    </div>

    <div v-if="pending" class="pay-wrap">
      <div class="glass-card pay-card">
        <p class="pay-status"><i class="fas fa-spinner fa-spin"></i> Loading your quote…</p>
      </div>
    </div>

    <div v-else-if="loadError" class="pay-wrap">
      <div class="glass-card pay-card">
        <p class="pay-status error"><i class="fas fa-exclamation-triangle"></i> {{ loadError }}</p>
        <p class="pay-copy">If you still have the quote email, reply to it and we will send a fresh payment link.</p>
      </div>
    </div>

    <div v-else-if="pay" class="pay-wrap">
      <div v-if="banner" class="glass-card pay-banner" :class="banner.kind">
        <i :class="banner.icon"></i>
        <span>{{ banner.text }}</span>
      </div>

      <div class="glass-card pay-card" v-reveal>
        <p v-if="pay.name" class="pay-hello">Hi {{ pay.name }}, choose how to pay this Shaft Lok quote.</p>

        <table class="pay-lines">
          <thead>
            <tr>
              <th>Item</th>
              <th class="num">Qty</th>
              <th class="num">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in pay.line_items" :key="i">
              <td>
                {{ item.name }}
                <span v-if="item.detail" class="pay-detail"> — {{ item.detail }}</span>
              </td>
              <td class="num">{{ item.qty ?? '—' }}</td>
              <td class="num">{{ item.total == null ? '—' : formatUsd(item.total) }}</td>
            </tr>
            <tr>
              <td>
                Shipping
                <span v-if="pay.shipping_notes" class="pay-detail"> — {{ pay.shipping_notes }}</span>
              </td>
              <td class="num">—</td>
              <td class="num">{{ formatUsd(pay.shipping_price) }}</td>
            </tr>
          </tbody>
        </table>

        <div class="pay-total-row">
          <span>Quoted total</span>
          <strong>{{ formatUsd(pay.grand_total) }}</strong>
        </div>
        <p v-if="pay.valid_until" class="pay-valid">Valid until {{ pay.valid_until }}.</p>

        <div class="surcharge-warn" role="note">
          <i class="fas fa-circle-info"></i>
          <p>
            Card payments include a <strong>3% processing fee of {{ formatUsd(pay.surcharge) }}</strong>,
            for a card total of <strong>{{ formatUsd(pay.card_total) }}</strong>.
            That fee is added here, before Stripe. Stripe will not add another fee.
            Bank transfer is charged at the quoted total of <strong>{{ formatUsd(pay.grand_total) }}</strong>.
          </p>
        </div>

        <div v-if="pay.can_pay" class="pay-actions">
          <button type="button" class="btn btn-bank" :disabled="starting" @click="startCheckout('bank')">
            <i class="fas fa-spinner fa-spin" v-if="starting === 'bank'"></i>
            <i class="fas fa-building-columns" v-else></i>
            Pay by bank transfer · {{ formatUsd(pay.grand_total) }}
          </button>
          <button type="button" class="btn btn-card" :disabled="starting" @click="startCheckout('card')">
            <i class="fas fa-spinner fa-spin" v-if="starting === 'card'"></i>
            <i class="fas fa-credit-card" v-else></i>
            Pay by card · {{ formatUsd(pay.card_total) }}
          </button>
          <p class="pay-card-hint">Includes the 3% card processing fee of {{ formatUsd(pay.surcharge) }}.</p>
        </div>
        <p v-if="startError" class="pay-status error">{{ startError }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatUsd } from '~~/utils/quotePayment'

definePageMeta({ layout: 'default' })

const route = useRoute()
const token = computed(() => String(route.params.token || ''))

useHead({
  title: 'Pay quote',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' },
    { name: 'description', content: 'Pay your Shaft Lok quote by bank transfer or card.' }
  ]
})

const { data: pay, pending, error, refresh } = await useFetch(
  () => `/api/pay/${encodeURIComponent(token.value)}`,
  { watch: [token] }
)

const loadError = computed(() => {
  if (!error.value) return ''
  return error.value.data?.statusMessage || error.value.statusMessage || 'This payment link is not valid.'
})

const starting = ref(null)
const startError = ref('')

const banner = computed(() => {
  const checkout = route.query.checkout
  if (pay.value?.payment_status === 'paid') {
    return { kind: 'ok', icon: 'fas fa-circle-check', text: 'Thank you — this quote is paid.' }
  }
  if (pay.value?.payment_status === 'pending') {
    return { kind: 'pending', icon: 'fas fa-clock', text: 'Bank transfer received as pending. We will mark this quote paid when the funds clear.' }
  }
  if (pay.value?.block_reason === 'expired') {
    return { kind: 'warn', icon: 'fas fa-hourglass-end', text: 'This quote is no longer valid. Reply to your quote email for an updated total.' }
  }
  if (checkout === 'success' && pay.value?.payment_status !== 'paid') {
    return { kind: 'pending', icon: 'fas fa-clock', text: 'Thanks — Stripe is confirming your payment. This page will update when it is complete.' }
  }
  if (checkout === 'cancel') {
    return { kind: 'warn', icon: 'fas fa-arrow-rotate-left', text: 'Checkout was canceled. You can choose bank transfer or card below.' }
  }
  if (pay.value?.payment_status === 'failed') {
    return { kind: 'warn', icon: 'fas fa-circle-exclamation', text: 'The last payment attempt did not go through. You can try again below.' }
  }
  return null
})

const startCheckout = async (method) => {
  startError.value = ''
  starting.value = method
  try {
    const result = await $fetch(`/api/pay/${encodeURIComponent(token.value)}/checkout`, {
      method: 'POST',
      body: { method }
    })
    if (!result?.url) throw new Error('Stripe did not return a checkout URL.')
    await navigateTo(result.url, { external: true })
  } catch (err) {
    startError.value = err.data?.statusMessage || err.message || 'Could not start checkout.'
    starting.value = null
  }
}

let confirmTimer = null
let confirmStop = null

onMounted(() => {
  if (route.query.checkout === 'success') {
    confirmTimer = setInterval(() => refresh(), 2500)
    confirmStop = setTimeout(() => {
      if (confirmTimer) clearInterval(confirmTimer)
      confirmTimer = null
    }, 20000)
  }
})

onUnmounted(() => {
  if (confirmTimer) clearInterval(confirmTimer)
  if (confirmStop) clearTimeout(confirmStop)
})
</script>

<style scoped>
.pay-wrap {
  max-width: 720px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.pay-card,
.pay-banner {
  padding: 1.6rem 1.8rem;
}

.pay-hello {
  margin: 0 0 1.2rem;
  color: var(--text-mid);
  font-size: 1rem;
}

.pay-lines {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
  color: var(--text-hi);
}

.pay-lines th {
  text-align: left;
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--accent);
  padding: 0 0.6rem 0.6rem 0;
  border-bottom: 1px solid var(--line);
}

.pay-lines td {
  padding: 0.7rem 0.6rem 0.7rem 0;
  border-bottom: 1px solid var(--line);
  vertical-align: top;
  color: var(--text-mid);
}

.pay-lines .num,
.pay-lines th.num {
  text-align: right;
  white-space: nowrap;
}

.pay-detail { color: var(--text-low); }

.pay-total-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-top: 1.1rem;
  font-size: 1.05rem;
  color: var(--text-hi);
}

.pay-total-row strong {
  font-size: 1.45rem;
  font-family: var(--font-display);
}

.pay-valid {
  margin: 0.45rem 0 0;
  color: var(--text-low);
  font-size: 0.9rem;
}

.surcharge-warn {
  display: flex;
  gap: 0.75rem;
  margin: 1.4rem 0 0;
  padding: 1rem 1.1rem;
  border-radius: var(--radius-sm);
  background: rgba(245, 198, 107, 0.1);
  border: 1px solid rgba(245, 198, 107, 0.35);
  color: var(--text-hi);
}

.surcharge-warn i {
  color: var(--gold);
  margin-top: 0.2rem;
}

.surcharge-warn p {
  margin: 0;
  line-height: 1.6;
  color: var(--text-mid);
  font-size: 0.95rem;
}

.surcharge-warn strong { color: var(--text-hi); }

.pay-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.pay-actions .btn {
  width: 100%;
  justify-content: center;
}

.pay-actions .btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-bank {
  background: rgba(56, 189, 248, 0.12);
  border: 1px solid rgba(56, 189, 248, 0.4);
  color: var(--accent);
}

.btn-bank:hover:not(:disabled) { background: rgba(56, 189, 248, 0.22); }

.btn-card {
  background: rgba(245, 198, 107, 0.14);
  border: 1px solid rgba(245, 198, 107, 0.45);
  color: var(--gold);
}

.btn-card:hover:not(:disabled) { background: rgba(245, 198, 107, 0.26); }

.pay-card-hint {
  margin: 0;
  text-align: center;
  color: var(--text-low);
  font-size: 0.88rem;
}

.pay-status {
  margin: 0;
  color: var(--text-mid);
}

.pay-status.error { color: #FCA5A5; }

.pay-copy {
  margin: 0.8rem 0 0;
  color: var(--text-mid);
  line-height: 1.6;
}

.pay-banner {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  font-size: 0.97rem;
  line-height: 1.5;
}

.pay-banner.ok {
  border-color: rgba(74, 222, 128, 0.4);
  color: #4ADE80;
}

.pay-banner.pending {
  border-color: rgba(245, 198, 107, 0.4);
  color: var(--gold);
}

.pay-banner.warn {
  border-color: rgba(248, 113, 113, 0.35);
  color: #FCA5A5;
}

@media (max-width: 600px) {
  .pay-card,
  .pay-banner { padding: 1.3rem 1.2rem; }
}
</style>
