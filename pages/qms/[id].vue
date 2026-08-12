<template>
  <div>
    <div class="yacht-container narrow">
      <BreadcrumbNav :items="[{ name: 'Quote Management', to: '/qms' }, { name: quote?.name || 'Quote' }]" />

      <div v-if="loading" class="loading-indicator">
        <i class="fas fa-spinner fa-spin"></i>
        Loading quote...
      </div>

      <div v-else-if="error" class="error-message">
        <i class="fas fa-exclamation-triangle"></i>
        {{ error }}
      </div>

      <template v-else-if="quote">
        <div class="detail-head glass-card">
          <div>
            <h1>{{ quote.name }}</h1>
            <p class="detail-sub">{{ quote.email }} · submitted {{ formatDate(quote.created_at) }}</p>
          </div>
          <span class="status-badge" :class="`status-${quote.status}`" :title="quoteStatusDescription(quote.status)">{{ statusLabel(quote.status) }}</span>
        </div>

        <section id="inquiry-section" class="detail-section">
          <h2 class="section-heading">Inquiry</h2>

          <div v-for="section in sections" :key="section.title" class="glass-card summary-card">
            <h2 class="section-label"><i :class="section.icon"></i> {{ section.title }}</h2>
            <dl>
              <template v-for="[label, value] in section.fields" :key="label">
                <div class="field-row">
                  <dt>{{ label }}</dt>
                  <dd>{{ value || '—' }}</dd>
                </div>
              </template>
            </dl>
          </div>

          <div v-if="quote.notes" class="glass-card summary-card">
            <h2 class="section-label"><i class="fas fa-sticky-note"></i> Sailor's Notes</h2>
            <p class="notes-text">{{ quote.notes }}</p>
          </div>
        </section>

        <section id="quote-section" class="detail-section">
          <h2 class="section-heading section-heading-quote">Quote</h2>

          <div class="glass-card action-card">
            <div class="form-group">
              <label for="status" class="status-label">
                Status
                <QuoteStatusLegend />
              </label>
              <select id="status" v-model="editForm.status" class="form-control">
                <option v-for="s in QUOTE_STATUSES" :key="s.value" :value="s.value">{{ s.label }}</option>
              </select>
            </div>

            <div class="form-group">
              <label for="quoted-price">Price ($)</label>
              <input id="quoted-price" v-model="editForm.quoted_price" type="number" step="0.01" min="0" class="form-control" placeholder="e.g. 850.00" />
            </div>

            <div class="form-group">
              <label>Items Quoted</label>
              <div v-for="(item, i) in editForm.line_items" :key="i" class="line-item-row">
                <select
                  class="form-control"
                  :value="item.product_slug"
                  @change="onLineItemProductChange(i, $event.target.value)"
                >
                  <option value="" disabled>Select a product…</option>
                  <option v-for="p in pickableProducts" :key="p.slug" :value="p.slug">{{ p.name }}</option>
                </select>
                <input
                  v-model="item.detail"
                  type="text"
                  class="form-control"
                  :placeholder="detailPlaceholder(item.product_slug)"
                />
                <button type="button" class="btn btn-secondary btn-icon" @click="removeLineItem(i)" aria-label="Remove item">
                  <i class="fas fa-times"></i>
                </button>
              </div>
              <button type="button" class="btn btn-secondary" @click="addLineItem">
                <i class="fas fa-plus"></i> Add Item
              </button>
            </div>

            <div class="form-group">
              <label for="quote-notes">Message to Sailor</label>
              <textarea id="quote-notes" v-model="editForm.quote_notes" rows="6" class="form-control" placeholder="What's included, lead time, anything else the sailor should know..."></textarea>
            </div>

            <div class="form-group">
              <label>Warnings That Will Be Included</label>
              <div v-if="applicableWarnings.length" class="preview-stack">
                <div v-for="warning in applicableWarnings" :key="warning.title" class="preview-block">
                  <p class="preview-title">{{ warning.title }}</p>
                  <p v-for="(p, i) in warning.paragraphs" :key="i" class="preview-text">{{ p }}</p>
                </div>
              </div>
              <p v-else class="preview-empty">No item-specific warnings for the currently selected items.</p>
            </div>

            <div class="form-group">
              <label>Payment Info Sent With Every Quote</label>
              <div class="preview-block">
                <p class="preview-text">{{ PAYMENT_INFO.intro }}</p>
                <p class="preview-text">{{ PAYMENT_INFO.method }}</p>
                <p class="preview-text">{{ PAYMENT_INFO.bank.name }}, {{ PAYMENT_INFO.bank.phone }} · Swift {{ PAYMENT_INFO.bank.swift }} · Routing {{ PAYMENT_INFO.bank.routing }}</p>
                <p class="preview-text">{{ PAYMENT_INFO.bank.address }}</p>
                <p class="preview-text">{{ PAYMENT_INFO.beneficiary.name }} — {{ PAYMENT_INFO.beneficiary.accountType }} #{{ PAYMENT_INFO.beneficiary.accountNumber }}</p>
              </div>
            </div>

            <div v-if="saveMessage" class="save-message" :class="{ 'save-error': saveError }">{{ saveMessage }}</div>

            <div class="action-buttons">
              <button @click="saveQuote" class="btn btn-secondary" :disabled="saving">
                <i class="fas fa-spinner fa-spin" v-if="saving"></i>
                {{ saving ? 'Saving...' : 'Save' }}
              </button>
              <button
                @click="handleSendClick"
                class="btn btn-primary"
                :disabled="sending || missingSendRequirements.length > 0"
                :title="sendRequirementsHint"
              >
                <i class="fas fa-spinner fa-spin" v-if="sending"></i>
                <i class="fas fa-paper-plane" v-else></i>
                {{ sending ? 'Sending...' : 'Send Quote to Sailor' }}
              </button>
            </div>
            <p v-if="missingSendRequirements.length" class="send-hint">{{ sendRequirementsHint }}</p>

            <div v-if="['sent', 'won', 'lost'].includes(quote.status)" class="decision-buttons">
              <button @click="markDecision('won')" class="btn btn-won" :disabled="deciding">Mark Won</button>
              <button @click="markDecision('lost')" class="btn btn-lost" :disabled="deciding">Mark Lost</button>
            </div>
          </div>
        </section>

        <section v-if="quote.sent_html" id="sent-section" class="detail-section">
          <h2 class="section-heading">Sent to Sailor</h2>
          <p class="section-sub">Exactly what {{ quote.name }} received{{ quote.sent_at ? ` on ${formatDate(quote.sent_at)}` : '' }}.</p>
          <EmailFrame :html="quote.sent_html" :title="`Quote sent to ${quote.name}`" />
        </section>

        <div v-if="showAlreadySentModal" class="modal" @click="showAlreadySentModal = false">
          <div class="modal-content" @click.stop>
            <h2 class="modal-title">Already Sent</h2>
            <p class="modal-text" v-if="quoteContentUnchanged">Nothing has changed since this quote was sent to {{ quote.name }} on {{ formatDate(quote.sent_at) }}. Sending now will resend the exact same quote — continue?</p>
            <p class="modal-text" v-else>This quote was already sent to {{ quote.name }} on {{ formatDate(quote.sent_at) }}. Send the updated version instead?</p>
            <div class="modal-actions">
              <button @click="showAlreadySentModal = false" class="btn btn-secondary">Cancel</button>
              <button @click="confirmSend" class="btn btn-primary" :disabled="sending">
                <i class="fas fa-spinner fa-spin" v-if="sending"></i>
                <i class="fas fa-paper-plane" v-else></i>
                {{ sending ? 'Sending...' : 'Send Updated Quote' }}
              </button>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

definePageMeta({
  layout: 'qms-layout',
  middleware: 'admin'
})

const route = useRoute()
const supabase = useSupabaseClient()

const quote = ref(null)
const loading = ref(true)
const error = ref(null)
const saving = ref(false)
const sending = ref(false)
const deciding = ref(false)
const saveMessage = ref('')
const saveError = ref(false)
const showAlreadySentModal = ref(false)

const editForm = ref({ status: 'new', quoted_price: '', quote_notes: '', line_items: [] })
const pickableProducts = ref([])

const statusLabel = quoteStatusLabel
const formatDate = (value) => value ? new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'

const addLineItem = () => {
  editForm.value.line_items.push({ product_slug: '', product_name: '', detail: '' })
}
const removeLineItem = (i) => {
  editForm.value.line_items.splice(i, 1)
}
const onLineItemProductChange = (i, slug) => {
  const product = pickableProducts.value.find((p) => p.slug === slug)
  editForm.value.line_items[i].product_slug = slug
  editForm.value.line_items[i].product_name = product?.name ?? ''
}
const detailPlaceholder = (slug) =>
  slug === 'marine-control-cable' ? 'e.g. 15 ft' : 'e.g. x2 (optional)'

const applicableWarnings = computed(() => getApplicableWarnings(editForm.value.line_items))

const missingSendRequirements = computed(() => {
  const missing = []
  if (editForm.value.status !== 'finished') missing.push('the status set to "Quote Finished"')
  if (!editForm.value.quoted_price) missing.push('a price')
  if (!editForm.value.quote_notes) missing.push('a message to the sailor')
  return missing
})

const sendRequirementsHint = computed(() => {
  const missing = missingSendRequirements.value
  if (missing.length === 0) return ''
  if (missing.length === 1) return `Before sending, you still need ${missing[0]}.`
  const last = missing[missing.length - 1]
  const rest = missing.slice(0, -1)
  return `Before sending, you still need ${rest.join(', ')} and ${last}.`
})

const normalizeLineItems = (items) => (Array.isArray(items) ? items : [])
  .filter((li) => li?.product_slug)
  .map((li) => ({ product_slug: li.product_slug, product_name: li.product_name ?? '', detail: li.detail || null }))

// Legacy quotes sent before the sent_* snapshot columns existed have
// sent_quoted_price === null even though sent_html is set — treat those as
// "unknown" rather than "unchanged" so we don't under-warn on old data.
const quoteContentUnchanged = computed(() => {
  const q = quote.value
  if (!q || !q.sent_html || q.sent_quoted_price == null) return false

  const currentPrice = editForm.value.quoted_price === '' ? null : Number(editForm.value.quoted_price)
  const sentPrice = Number(q.sent_quoted_price)
  if (currentPrice !== sentPrice) return false

  if ((editForm.value.quote_notes || null) !== (q.sent_quote_notes || null)) return false

  return JSON.stringify(normalizeLineItems(editForm.value.line_items)) === JSON.stringify(normalizeLineItems(q.sent_line_items))
})

const lockingSystemLabel = computed(() => {
  if (!quote.value) return ''
  if (quote.value.locking_system === 'cable') {
    return `Marine Control Cable${quote.value.cable_length ? ` — ${quote.value.cable_length} ft` : ''}`
  }
  if (quote.value.locking_system === 'spring') return 'Simple Spring Locking System'
  if (quote.value.locking_system === 'unsure') return 'Not sure — needs guidance'
  return ''
})

const phoneLabel = computed(() => {
  if (!quote.value?.phone) return ''
  return `${quote.value.phone}${quote.value.phone_region === 'europe' ? ' (Europe / International)' : ' (US / Canada)'}`
})

const sections = computed(() => {
  if (!quote.value) return []
  const q = quote.value
  return [
    {
      title: 'Contact',
      icon: 'fas fa-user',
      fields: [
        ['Email', q.email],
        ['Phone', phoneLabel.value],
        ['Address', q.address]
      ]
    },
    {
      title: 'Vessel',
      icon: 'fas fa-ship',
      fields: [
        ['Yacht Type & Length', q.yacht_type],
        ['Yacht Name', q.yacht_name],
        ['Displacement', q.displacement],
        ['Max Hull Speed', q.max_hull_speed]
      ]
    },
    {
      title: 'Propeller',
      icon: 'fas fa-fan',
      fields: [
        ['Shaft Diameter', q.shaft_diameter],
        ['Propeller Diameter', q.prop_diameter],
        ['Number of Blades', q.num_blades],
        ['Number of Propellers / Shafts', q.num_propellers],
        ['Fixed / Folding / Feathering', q.prop_type]
      ]
    },
    {
      title: 'Engine & Transmission',
      icon: 'fas fa-tachometer-alt',
      fields: [
        ['Engine Make & HP', q.engine],
        ['Transmission Make & Ratio', q.transmission]
      ]
    },
    {
      title: 'Locking System',
      icon: 'fas fa-lock',
      fields: [
        ['Interested In', lockingSystemLabel.value]
      ]
    }
  ]
})

const loadQuote = async () => {
  try {
    loading.value = true
    error.value = null

    const { data, error: fetchError } = await supabase
      .from('quotes')
      .select('*')
      .eq('id', route.params.id)
      .single()

    if (fetchError) throw fetchError

    quote.value = data
    editForm.value = {
      status: data.status,
      quoted_price: data.quoted_price ?? '',
      quote_notes: data.quote_notes ?? '',
      line_items: Array.isArray(data.line_items) ? data.line_items : []
    }
  } catch (err) {
    console.error('Error loading quote:', err)
    error.value = `Failed to load quote: ${err.message}`
  } finally {
    loading.value = false
  }
}

const saveQuote = async () => {
  try {
    saving.value = true
    saveMessage.value = ''
    saveError.value = false

    const { error: updateError } = await supabase
      .from('quotes')
      .update({
        status: editForm.value.status,
        quoted_price: editForm.value.quoted_price === '' ? null : editForm.value.quoted_price,
        quote_notes: editForm.value.quote_notes || null,
        line_items: editForm.value.line_items.filter((li) => li.product_slug),
        updated_at: new Date().toISOString()
      })
      .eq('id', quote.value.id)

    if (updateError) throw updateError

    await loadQuote()
    saveMessage.value = 'Saved.'
  } catch (err) {
    console.error('Error saving quote:', err)
    saveError.value = true
    saveMessage.value = `Failed to save: ${err.message}`
  } finally {
    saving.value = false
  }
}

const sendQuote = async () => {
  try {
    sending.value = true
    saveMessage.value = ''
    saveError.value = false

    // Persist any pending edits before sending
    const { error: updateError } = await supabase
      .from('quotes')
      .update({
        status: editForm.value.status,
        quoted_price: editForm.value.quoted_price === '' ? null : editForm.value.quoted_price,
        quote_notes: editForm.value.quote_notes || null,
        line_items: editForm.value.line_items.filter((li) => li.product_slug),
        updated_at: new Date().toISOString()
      })
      .eq('id', quote.value.id)

    if (updateError) throw updateError

    await $fetch('/api/qms/send-quote', { method: 'POST', body: { quoteId: quote.value.id } })

    await loadQuote()
    saveMessage.value = 'Quote sent to sailor.'
  } catch (err) {
    console.error('Error sending quote:', err)
    saveError.value = true
    saveMessage.value = err.data?.statusMessage || err.message || 'Failed to send quote.'
  } finally {
    sending.value = false
  }
}

const handleSendClick = () => {
  if (quote.value?.sent_html) {
    showAlreadySentModal.value = true
  } else {
    sendQuote()
  }
}

const confirmSend = () => {
  showAlreadySentModal.value = false
  sendQuote()
}

const markDecision = async (decision) => {
  try {
    deciding.value = true

    const { error: updateError } = await supabase
      .from('quotes')
      .update({ status: decision, decided_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq('id', quote.value.id)

    if (updateError) throw updateError

    await loadQuote()
  } catch (err) {
    console.error('Error marking decision:', err)
    alert('Error updating quote: ' + err.message)
  } finally {
    deciding.value = false
  }
}

const loadPickableProducts = async () => {
  const { data } = await supabase
    .from('products')
    .select('id, name, slug')
    .eq('display', true)
    .order('id', { ascending: true })

  pickableProducts.value = data || []
}

onMounted(() => {
  loadQuote()
  loadPickableProducts()
})

useHead({
  title: 'Quote Detail',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }]
})
</script>

<style scoped>
.narrow { max-width: 1000px; }

.detail-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.6rem 1.8rem;
  margin-bottom: 1.5rem;
}

.detail-head h1 {
  margin: 0 0 0.3rem;
  font-family: var(--font-display);
  font-size: 1.5rem;
  color: var(--text-hi);
}

.detail-sub {
  margin: 0;
  color: var(--text-mid);
  font-size: 0.9rem;
}

.detail-section {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-bottom: 2rem;
  scroll-margin-top: calc(var(--nav-height) + 1.5rem);
}

.section-heading {
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--text-hi);
  margin: 0;
}

.section-heading-quote {
  color: var(--gold);
}

.section-sub {
  margin: -0.75rem 0 0;
  color: var(--text-mid);
  font-size: 0.9rem;
}

.summary-card, .action-card {
  padding: 1.5rem 1.7rem;
}

.action-card {
  background: rgba(245, 198, 107, 0.05);
  border-color: rgba(245, 198, 107, 0.3);
}

.section-label {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-family: var(--font-display);
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--accent);
  margin: 0 0 1rem;
}

dl { margin: 0; }

.field-row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--line);
}

.field-row:last-child { border-bottom: none; }

.field-row dt {
  color: var(--text-low);
  font-size: 0.85rem;
  flex-shrink: 0;
}

.field-row dd {
  margin: 0;
  color: var(--text-hi);
  font-size: 0.9rem;
  text-align: right;
}

.notes-text {
  margin: 0;
  color: var(--text-mid);
  line-height: 1.6;
  white-space: pre-wrap;
}

.form-group { margin-bottom: 1.2rem; }

.form-group label {
  display: block;
  margin-bottom: 0.4rem;
  font-family: var(--font-display);
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-mid);
}

.status-label {
  display: flex !important;
  align-items: center;
  gap: 0.5rem;
}

.form-control {
  width: 100%;
  padding: 0.65rem 0.9rem;
  background: rgba(13, 27, 54, 0.65);
  border: 1px solid var(--line-strong);
  border-radius: var(--radius-sm);
  color: var(--text-hi);
  font-family: var(--font-body);
  font-size: 0.95rem;
  box-sizing: border-box;
}

.form-control:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.18);
}

textarea.form-control { resize: vertical; }

.line-item-row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.6rem;
}

.line-item-row select.form-control { flex: 2; }
.line-item-row input.form-control { flex: 1; }

.btn-icon {
  flex: none;
  padding: 0.65rem 0.9rem;
}

.preview-stack {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.preview-block {
  padding: 0.9rem 1rem;
  background: rgba(245, 198, 107, 0.06);
  border: 1px solid rgba(245, 198, 107, 0.2);
  border-radius: var(--radius-sm);
}

.preview-title {
  margin: 0 0 0.4rem;
  font-family: var(--font-display);
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--gold);
}

.preview-text {
  margin: 0 0 0.5rem;
  color: var(--text-mid);
  font-size: 0.87rem;
  line-height: 1.55;
}

.preview-text:last-child { margin-bottom: 0; }

.preview-empty {
  margin: 0;
  color: var(--text-low);
  font-size: 0.87rem;
  font-style: italic;
}

.save-message {
  font-size: 0.85rem;
  color: #5EEAD4;
  margin-bottom: 1rem;
}

.save-message.save-error { color: #FCA5A5; }

.send-hint {
  font-size: 0.85rem;
  color: var(--text-low);
  margin: -0.3rem 0 0;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

.btn {
  padding: 0.75rem 1.4rem;
  border: 1px solid transparent;
  border-radius: 999px;
  font-family: var(--font-display);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn:disabled { opacity: 0.55; cursor: not-allowed; }

.btn-primary {
  background: var(--grad-accent);
  color: #04121F;
  box-shadow: 0 8px 24px -8px rgba(56, 189, 248, 0.55);
}

.btn-secondary {
  background: rgba(148, 197, 255, 0.07);
  border-color: var(--line-strong);
  color: var(--text-mid);
}

.btn-secondary:hover:not(:disabled) { background: rgba(148, 197, 255, 0.14); color: var(--text-hi); }

.decision-buttons {
  display: flex;
  gap: 0.7rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--line);
}

.btn-won {
  flex: 1;
  background: rgba(74, 222, 128, 0.14);
  border-color: rgba(74, 222, 128, 0.4);
  color: #4ADE80;
}

.btn-won:hover:not(:disabled) { background: rgba(74, 222, 128, 0.26); }

.btn-lost {
  flex: 1;
  background: rgba(248, 113, 113, 0.1);
  border-color: rgba(248, 113, 113, 0.4);
  color: #FCA5A5;
}

.btn-lost:hover:not(:disabled) { background: rgba(248, 113, 113, 0.22); }

.status-badge {
  display: inline-block;
  padding: 0.35rem 0.9rem;
  border-radius: 999px;
  font-family: var(--font-display);
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  flex-shrink: 0;
}

.modal {
  position: fixed;
  inset: 0;
  background: rgba(2, 8, 23, 0.72);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: var(--abyss-soft);
  border: 1px solid var(--line-strong);
  border-radius: var(--radius-lg);
  max-width: 480px;
  width: 92%;
  padding: 1.6rem 1.8rem;
  box-shadow: var(--shadow-card), var(--glow-accent);
  color: var(--text-hi);
}

.modal-title {
  margin: 0 0 0.75rem;
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--gold);
}

.modal-text {
  margin: 0;
  color: var(--text-mid);
  line-height: 1.6;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.6rem;
}

.status-new { background: var(--status-new-bg); color: var(--status-new-fg); }
.status-in_review { background: var(--status-in_review-bg); color: var(--status-in_review-fg); }
.status-quoted { background: var(--status-quoted-bg); color: var(--status-quoted-fg); }
.status-finished { background: var(--status-finished-bg); color: var(--status-finished-fg); }
.status-sent { background: var(--status-sent-bg); color: var(--status-sent-fg); }
.status-won { background: var(--status-won-bg); color: var(--status-won-fg); }
.status-lost { background: var(--status-lost-bg); color: var(--status-lost-fg); }

</style>
