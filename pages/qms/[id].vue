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
          <span class="status-badge" :class="`status-${quote.status}`">{{ statusLabel(quote.status) }}</span>
        </div>

        <div class="detail-grid">
          <div class="summary-column">
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
          </div>

          <div class="action-column">
            <div class="glass-card action-card">
              <h2 class="section-label"><i class="fas fa-file-invoice-dollar"></i> Quote</h2>

              <div class="form-group">
                <label for="status" class="status-label">
                  Status
                  <QuoteStatusLegend />
                </label>
                <select id="status" v-model="editForm.status" class="form-control">
                  <option value="new">New</option>
                  <option value="quoted">Drafting Quote</option>
                  <option value="in_review">In Review</option>
                  <option value="sent">Quote Sent</option>
                  <option value="won">Won</option>
                  <option value="lost">Lost</option>
                </select>
              </div>

              <div class="form-group">
                <label for="quoted-price">Price ($)</label>
                <input id="quoted-price" v-model="editForm.quoted_price" type="number" step="0.01" min="0" class="form-control" placeholder="e.g. 850.00" />
              </div>

              <div class="form-group">
                <label for="quote-notes">Message to Sailor</label>
                <textarea id="quote-notes" v-model="editForm.quote_notes" rows="6" class="form-control" placeholder="What's included, lead time, anything else the sailor should know..."></textarea>
              </div>

              <div v-if="saveMessage" class="save-message" :class="{ 'save-error': saveError }">{{ saveMessage }}</div>

              <div class="action-buttons">
                <button @click="saveQuote" class="btn btn-secondary" :disabled="saving">
                  <i class="fas fa-spinner fa-spin" v-if="saving"></i>
                  {{ saving ? 'Saving...' : 'Save' }}
                </button>
                <button @click="sendQuote" class="btn btn-primary" :disabled="sending || !editForm.quoted_price || !editForm.quote_notes">
                  <i class="fas fa-spinner fa-spin" v-if="sending"></i>
                  <i class="fas fa-paper-plane" v-else></i>
                  {{ sending ? 'Sending...' : 'Send Quote to Sailor' }}
                </button>
              </div>

              <div v-if="['sent', 'won', 'lost'].includes(quote.status)" class="decision-buttons">
                <button @click="markDecision('won')" class="btn btn-won" :disabled="deciding">Mark Won</button>
                <button @click="markDecision('lost')" class="btn btn-lost" :disabled="deciding">Mark Lost</button>
              </div>
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

const editForm = ref({ status: 'new', quoted_price: '', quote_notes: '' })

const statusLabels = {
  new: 'New', in_review: 'In Review', quoted: 'Quoted', sent: 'Quote Sent', won: 'Won', lost: 'Lost'
}
const statusLabel = (status) => statusLabels[status] || status
const formatDate = (value) => value ? new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'

const lockingSystemLabel = computed(() => {
  if (!quote.value) return ''
  if (quote.value.locking_system === 'cable') {
    return `Marine Control Cable${quote.value.cable_length ? ` — ${quote.value.cable_length} ft` : ''}`
  }
  if (quote.value.locking_system === 'spring') return 'Simple Spring Locking System'
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
      icon: 'fas fa-cog',
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
      quote_notes: data.quote_notes ?? ''
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
    await supabase
      .from('quotes')
      .update({
        quoted_price: editForm.value.quoted_price === '' ? null : editForm.value.quoted_price,
        quote_notes: editForm.value.quote_notes || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', quote.value.id)

    await $fetch('/api/qms/send-quote', { method: 'POST', body: { quoteId: quote.value.id } })

    await loadQuote()
    saveMessage.value = 'Quote sent to sailor.'
  } catch (err) {
    console.error('Error sending quote:', err)
    saveError.value = true
    saveMessage.value = err.data?.statusMessage || 'Failed to send quote.'
  } finally {
    sending.value = false
  }
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

onMounted(loadQuote)

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

.detail-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 1.5rem;
  align-items: start;
}

.summary-column {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.summary-card, .action-card {
  padding: 1.5rem 1.7rem;
}

.action-card {
  position: sticky;
  top: calc(var(--nav-height) + 1.5rem);
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

.save-message {
  font-size: 0.85rem;
  color: #5EEAD4;
  margin-bottom: 1rem;
}

.save-message.save-error { color: #FCA5A5; }

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

.status-new { background: rgba(56, 189, 248, 0.16); color: #38BDF8; }
.status-in_review { background: rgba(245, 198, 107, 0.16); color: var(--gold); }
.status-quoted { background: rgba(148, 197, 255, 0.16); color: #94C5FF; }
.status-sent { background: rgba(45, 212, 191, 0.16); color: #5EEAD4; }
.status-won { background: rgba(74, 222, 128, 0.18); color: #4ADE80; }
.status-lost { background: rgba(248, 113, 113, 0.16); color: #FCA5A5; }

@media (max-width: 900px) {
  .detail-grid { grid-template-columns: 1fr; }
  .action-card { position: static; }
}
</style>
