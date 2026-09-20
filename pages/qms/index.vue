<template>
  <div>
    <div class="yacht-container">
      <BreadcrumbNav admin :items="[{ name: 'Quote Management' }]" />

      <div v-if="loading" class="loading-indicator">
        <i class="fas fa-spinner fa-spin"></i>
        Loading quotes...
      </div>

      <div v-else-if="error" class="error-message">
        <i class="fas fa-exclamation-triangle"></i>
        {{ error }}
        <button @click="loadQuotes" class="retry-button">Retry</button>
      </div>

      <template v-else>
        <div class="pipeline-strip" role="group" aria-label="Quote dollars by status">
          <button
            v-for="stage in statusPipeline"
            :key="stage.value"
            type="button"
            class="pipeline-card glass-card"
            :class="{ 'is-active': statusFilter === stage.value }"
            :title="`Filter by ${stage.label}`"
            @click="toggleStatusFilter(stage.value)"
          >
            <span class="status-badge" :class="`status-${stage.value}`">{{ stage.label }}</span>
            <span class="pipeline-count">{{ stage.count }} {{ stage.count === 1 ? 'quote' : 'quotes' }}</span>
            <span class="pipeline-total">{{ formatPipelinePrice(stage.total) }}</span>
          </button>
        </div>

        <div class="qms-toolbar">
          <div class="status-filter">
            <label for="status-filter">Status</label>
            <select id="status-filter" v-model="statusFilter" class="form-control">
              <option value="all">All</option>
              <option v-for="s in QUOTE_STATUSES" :key="s.value" :value="s.value">{{ s.label }}</option>
            </select>
            <QuoteStatusLegend />
          </div>
        </div>

        <div class="table-container">
          <table class="yacht-table">
            <thead>
              <tr>
                <th @click="sortBy('quote_number')" class="sortable">
                  QUOTE #
                  <i class="fas fa-sort" :class="getSortIcon('quote_number')"></i>
                </th>
                <th class="sortable sailor-sort-th">
                  <button
                    type="button"
                    class="sailor-sort-trigger"
                    aria-haspopup="menu"
                    :aria-expanded="sailorSortOpen"
                    title="Sort by Sailor or Company"
                    @click.stop="toggleSailorSortMenu"
                  >
                    SAILOR
                    <i class="fas fa-sort" :class="sailorSortIcon"></i>
                  </button>
                </th>
                <th>YACHT</th>
                <th @click="sortBy('created_at')" class="sortable">
                  SUBMITTED
                  <i class="fas fa-sort" :class="getSortIcon('created_at')"></i>
                </th>
                <th @click="sortBy('sent_at')" class="sortable">
                  SENT
                  <i class="fas fa-sort" :class="getSortIcon('sent_at')"></i>
                </th>
                <th @click="sortBy('status')" class="sortable">
                  STATUS
                  <i class="fas fa-sort" :class="getSortIcon('status')"></i>
                </th>
                <th>TOTAL</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="quote in filteredQuotes"
                :key="quote.id"
                @click="openQuote(quote)"
                class="quote-row"
                :class="{ 'needs-attention': !quote.read_at }"
                :title="quote.read_at ? undefined : 'Unread inquiry'"
              >
                <td :data-cell="'quote #'">{{ quoteNumberOf(quote) || '—' }}</td>
                <td :data-cell="'sailor'">
                  <span class="sailor-stack">
                    <span class="sailor-name">{{ quote.name }}</span>
                    <span v-if="companyOf(quote)" class="sailor-company">{{ companyOf(quote) }}</span>
                  </span>
                </td>
                <td :data-cell="'yacht'">{{ [quote.yacht_type, quote.yacht_name].filter(Boolean).join(' — ') || '—' }}</td>
                <td :data-cell="'submitted'">{{ formatDate(quote.created_at) }}</td>
                <td :data-cell="'sent'">{{ formatDate(quote.sent_at) }}</td>
                <td :data-cell="'status'">
                  <span class="status-cell">
                    <span class="status-badge" :class="`status-${quote.status}`" :title="quoteStatusDescription(quote.status)">{{ statusLabel(quote.status) }}</span>
                    <span
                      v-if="quote.payment_token || quote.sent_html"
                      class="status-badge"
                      :class="`payment-${quote.payment_status || 'unpaid'}`"
                      :title="paymentStatusDescription(quote.payment_status || 'unpaid')"
                    >{{ paymentStatusLabel(quote.payment_status || 'unpaid') }}</span>
                  </span>
                </td>
                <td :data-cell="'price'">{{ formatQuoteTotal(quote) }}</td>
                <td :data-cell="'actions'" class="actions-cell">
                  <button @click.stop="qmsCrud?.openDeleteModal(quote)" class="delete-icon-btn" title="Delete quote" aria-label="Delete quote">
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
              <tr v-if="filteredQuotes.length === 0 && !loading">
                <td :colspan="7" class="no-results">
                  <i class="fas fa-search"></i>
                  No quotes found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </div>

    <Teleport to="body">
      <div v-if="sailorSortOpen" class="sort-bubble-backdrop" @click="sailorSortOpen = false">
        <div
          class="sort-bubble glass-card"
          role="menu"
          aria-label="Sort by Sailor or Company"
          :style="sailorSortBubbleStyle"
          @click.stop
        >
          <p class="sort-bubble-label">Sort by</p>
          <button
            type="button"
            role="menuitem"
            class="sort-bubble-option"
            :class="{ 'is-active': sortColumn === 'name' }"
            @click="sortBySailorField('name')"
          >
            Sailor
            <i v-if="sortColumn === 'name'" class="fas" :class="sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down'"></i>
          </button>
          <button
            type="button"
            role="menuitem"
            class="sort-bubble-option"
            :class="{ 'is-active': sortColumn === 'company' }"
            @click="sortBySailorField('company')"
          >
            Company
            <i v-if="sortColumn === 'company'" class="fas" :class="sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down'"></i>
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue'
import { quoteNumberFor } from '~~/utils/quoteNumber'
import { paymentStatusDescription, paymentStatusLabel } from '~~/utils/quotePayment'

definePageMeta({
  layout: 'qms-layout',
  middleware: 'admin'
})

const supabase = useSupabaseClient()
const qmsSearch = inject('qmsSearch')
const qmsCrud = inject('qmsCrud')
const searchTerm = computed(() => qmsSearch?.searchTerm.value || '')

const quotes = ref([])
const loading = ref(true)
const error = ref(null)
const statusFilter = ref('all')
const sortColumn = ref('created_at')
const sortDirection = ref('desc')
const sailorSortOpen = ref(false)
const sailorSortBubbleStyle = ref({})

const companyOf = (quote) => String(quote?.company || '').trim()

const sailorSortIcon = computed(() => {
  if (sortColumn.value !== 'name' && sortColumn.value !== 'company') return ''
  return sortDirection.value === 'asc' ? 'fa-sort-up' : 'fa-sort-down'
})

const statusLabel = quoteStatusLabel

const formatDate = (value) => value ? new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'
const formatPrice = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
const formatPipelinePrice = (value) => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
}).format(value || 0)

const quoteNumberOf = (quote) => quoteNumberFor(quote, quote?.name)

const quoteGrandTotal = (quote) => {
  const products = Number(quote?.quoted_price)
  const shipping = Number(quote?.shipping_price)
  const hasProducts = Number.isFinite(products)
  const hasShipping = Number.isFinite(shipping)
  if (!hasProducts && !hasShipping) return null
  return (hasProducts ? products : 0) + (hasShipping ? shipping : 0)
}

const formatQuoteTotal = (quote) => {
  const total = quoteGrandTotal(quote)
  return total == null ? '—' : formatPrice(total)
}

const statusPipeline = computed(() =>
  QUOTE_STATUSES.map((s) => {
    const inStage = quotes.value.filter((q) => q.status === s.value)
    const total = inStage.reduce((sum, q) => sum + (quoteGrandTotal(q) || 0), 0)
    return {
      value: s.value,
      label: s.label,
      count: inStage.length,
      total
    }
  })
)

const toggleStatusFilter = (value) => {
  statusFilter.value = statusFilter.value === value ? 'all' : value
}

const filteredQuotes = computed(() => {
  let filtered = quotes.value

  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(q => q.status === statusFilter.value)
  }

  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase()
    filtered = filtered.filter(q =>
      (q.name || '').toLowerCase().includes(search) ||
      (q.email || '').toLowerCase().includes(search) ||
      (q.yacht_type || '').toLowerCase().includes(search) ||
      (q.yacht_name || '').toLowerCase().includes(search) ||
      (q.company || '').toLowerCase().includes(search) ||
      quoteNumberOf(q).toLowerCase().includes(search)
    )
  }

  filtered = [...filtered].sort((a, b) => {
    if (sortColumn.value === 'company') {
      const aCo = companyOf(a)
      const bCo = companyOf(b)
      if (!aCo && !bCo) {
        return (a.name || '').localeCompare(b.name || '', undefined, { numeric: true, sensitivity: 'base' })
      }
      if (!aCo) return 1
      if (!bCo) return -1
      const byCompany = aCo.localeCompare(bCo, undefined, { numeric: true, sensitivity: 'base' })
      const ordered = sortDirection.value === 'asc' ? byCompany : -byCompany
      if (ordered !== 0) return ordered
      return (a.name || '').localeCompare(b.name || '', undefined, { numeric: true, sensitivity: 'base' })
    }

    const aVal = sortColumn.value === 'quote_number' ? quoteNumberOf(a) : (a[sortColumn.value] || '')
    const bVal = sortColumn.value === 'quote_number' ? quoteNumberOf(b) : (b[sortColumn.value] || '')
    const result = aVal.toString().localeCompare(bVal.toString(), undefined, { numeric: true })
    return sortDirection.value === 'asc' ? result : -result
  })

  return filtered
})

const loadQuotes = async () => {
  try {
    loading.value = true
    error.value = null

    const { data, error: fetchError } = await supabase
      .from('quotes')
      .select('*')
      .order('created_at', { ascending: false })

    if (fetchError) throw fetchError

    quotes.value = data || []
    qmsSearch?.setQuoteCount(quotes.value.length)
  } catch (err) {
    console.error('Error loading quotes:', err)
    error.value = `Failed to load quotes: ${err.message}`
  } finally {
    loading.value = false
  }
}

const sortBy = (column) => {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortColumn.value = column
    sortDirection.value = 'asc'
  }
}

const toggleSailorSortMenu = (event) => {
  sailorSortOpen.value = !sailorSortOpen.value
  if (!sailorSortOpen.value) return
  const rect = event.currentTarget.getBoundingClientRect()
  sailorSortBubbleStyle.value = {
    top: `${Math.round(rect.bottom + 6)}px`,
    left: `${Math.round(rect.left)}px`
  }
}

const sortBySailorField = (column) => {
  sortBy(column)
  sailorSortOpen.value = false
}

const getSortIcon = (column) => {
  if (sortColumn.value !== column) return ''
  return sortDirection.value === 'asc' ? 'fa-sort-up' : 'fa-sort-down'
}

const openQuote = (quote) => {
  navigateTo(`/qms/${quote.id}`)
}

onMounted(() => {
  loadQuotes()
  qmsSearch?.setRefreshCallback(loadQuotes)
})

useHead({
  title: 'Quote Management',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }]
})
</script>

<style scoped>
.pipeline-strip {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.pipeline-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.45rem;
  padding: 0.95rem 1.05rem;
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  background: var(--glass);
  cursor: pointer;
  text-align: left;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.pipeline-card:hover {
  border-color: var(--line-strong);
  transform: translateY(-2px);
}

.pipeline-card.is-active {
  border-color: var(--accent);
  box-shadow: 0 0 0 1px rgba(56, 189, 248, 0.35), var(--shadow-card);
}

.pipeline-count {
  font-family: var(--font-display);
  font-size: 0.78rem;
  font-weight: 500;
  color: var(--text-mid);
  letter-spacing: 0.02em;
}

.pipeline-total {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-hi);
  letter-spacing: -0.02em;
}

.qms-toolbar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
}

.status-filter {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.status-filter label {
  font-family: var(--font-display);
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-mid);
}

.status-filter .form-control {
  padding: 0.5rem 0.9rem;
  background: rgba(13, 27, 54, 0.65);
  border: 1px solid var(--line-strong);
  border-radius: var(--radius-sm);
  color: var(--text-hi);
  font-size: 0.9rem;
}

.quote-row {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

/* Unread inquiry — owner has not opened this quote yet */
.quote-row.needs-attention td:first-child {
  box-shadow: inset 3px 0 0 var(--accent);
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.7rem;
  border-radius: 999px;
  font-family: var(--font-display);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.04em;
}

.status-new { background: var(--status-new-bg); color: var(--status-new-fg); }
.status-sent { background: var(--status-sent-bg); color: var(--status-sent-fg); }
.status-followed_up { background: var(--status-followed_up-bg); color: var(--status-followed_up-fg); }
.status-won { background: var(--status-won-bg); color: var(--status-won-fg); }
.status-dead { background: var(--status-dead-bg); color: var(--status-dead-fg); }

.status-cell {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.payment-unpaid { background: var(--payment-unpaid-bg); color: var(--payment-unpaid-fg); }
.payment-pending { background: var(--payment-pending-bg); color: var(--payment-pending-fg); }
.payment-paid { background: var(--payment-paid-bg); color: var(--payment-paid-fg); }
.payment-failed { background: var(--payment-failed-bg); color: var(--payment-failed-fg); }
.payment-expired { background: var(--payment-expired-bg); color: var(--payment-expired-fg); }

.actions-cell { width: 1%; }

.delete-icon-btn {
  background: rgba(248, 113, 113, 0.1);
  border: 1px solid rgba(248, 113, 113, 0.35);
  color: #FCA5A5;
  width: 2.1rem;
  height: 2.1rem;
  border-radius: var(--radius-sm);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
}

.delete-icon-btn:hover { background: rgba(248, 113, 113, 0.22); }

.sailor-sort-th {
  position: relative;
}

.sailor-sort-trigger {
  display: inline-flex;
  align-items: center;
  background: none;
  border: none;
  padding: 0;
  color: inherit;
  font: inherit;
  letter-spacing: inherit;
  cursor: pointer;
}

.sailor-stack {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.12rem;
  min-width: 0;
}

.sailor-name {
  color: var(--text-hi);
  font-weight: 500;
}

.sailor-company {
  font-size: 0.82rem;
  font-weight: 400;
  color: var(--text-low);
  line-height: 1.25;
}

.sort-bubble-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1200;
}

.sort-bubble {
  position: fixed;
  z-index: 1201;
  min-width: 11.5rem;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.sort-bubble-label {
  margin: 0 0.55rem 0.2rem;
  font-family: var(--font-display);
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-mid);
}

.sort-bubble-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.85rem;
  width: 100%;
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  color: var(--text-hi);
  font-family: var(--font-display);
  font-size: 0.88rem;
  font-weight: 600;
  padding: 0.5rem 0.65rem;
  cursor: pointer;
  text-align: left;
}

.sort-bubble-option:hover,
.sort-bubble-option.is-active {
  background: rgba(56, 189, 248, 0.12);
}

.sort-bubble-option.is-active {
  color: var(--accent);
}

@media (max-width: 960px) {
  .pipeline-strip {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 520px) {
  .pipeline-strip {
    grid-template-columns: 1fr;
  }
}
</style>
