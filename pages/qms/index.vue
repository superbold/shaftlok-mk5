<template>
  <div>
    <div class="yacht-container">
      <BreadcrumbNav :items="[{ name: 'Quote Management' }]" />

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
        <div class="qms-toolbar">
          <div class="status-filter">
            <label for="status-filter">Status</label>
            <select id="status-filter" v-model="statusFilter" class="form-control">
              <option value="all">All</option>
              <option value="new">New</option>
              <option value="quoted">Drafting Quote</option>
              <option value="in_review">In Review</option>
              <option value="sent">Quote Sent</option>
              <option value="won">Won</option>
              <option value="lost">Lost</option>
            </select>
            <QuoteStatusLegend />
          </div>
        </div>

        <div class="table-container">
          <table class="yacht-table">
            <thead>
              <tr>
                <th @click="sortBy('name')" class="sortable">
                  SAILOR
                  <i class="fas fa-sort" :class="getSortIcon('name')"></i>
                </th>
                <th>YACHT</th>
                <th @click="sortBy('created_at')" class="sortable">
                  SUBMITTED
                  <i class="fas fa-sort" :class="getSortIcon('created_at')"></i>
                </th>
                <th @click="sortBy('status')" class="sortable">
                  STATUS
                  <i class="fas fa-sort" :class="getSortIcon('status')"></i>
                </th>
                <th>PRICE</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="quote in filteredQuotes"
                :key="quote.id"
                @click="openQuote(quote)"
                class="quote-row"
                :class="{ 'needs-attention': ['new', 'in_review'].includes(quote.status) }"
              >
                <td :data-cell="'sailor'">{{ quote.name }}</td>
                <td :data-cell="'yacht'">{{ [quote.yacht_type, quote.yacht_name].filter(Boolean).join(' — ') || '—' }}</td>
                <td :data-cell="'submitted'">{{ formatDate(quote.created_at) }}</td>
                <td :data-cell="'status'">
                  <span class="status-badge" :class="`status-${quote.status}`">{{ statusLabel(quote.status) }}</span>
                </td>
                <td :data-cell="'price'">{{ quote.quoted_price ? formatPrice(quote.quoted_price) : '—' }}</td>
                <td :data-cell="'actions'" class="actions-cell">
                  <button @click.stop="qmsCrud?.openDeleteModal(quote)" class="delete-icon-btn" title="Delete quote" aria-label="Delete quote">
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
              <tr v-if="filteredQuotes.length === 0 && !loading">
                <td :colspan="6" class="no-results">
                  <i class="fas fa-search"></i>
                  No quotes found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue'

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

const statusLabels = {
  new: 'New',
  quoted: 'Drafting Quote',
  in_review: 'In Review',
  sent: 'Quote Sent',
  won: 'Won',
  lost: 'Lost'
}
const statusLabel = (status) => statusLabels[status] || status

const formatDate = (value) => value ? new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'
const formatPrice = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)

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
      (q.yacht_name || '').toLowerCase().includes(search)
    )
  }

  filtered = [...filtered].sort((a, b) => {
    const aVal = a[sortColumn.value] || ''
    const bVal = b[sortColumn.value] || ''
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

.status-new { background: rgba(56, 189, 248, 0.16); color: #38BDF8; }
.status-in_review { background: rgba(245, 198, 107, 0.16); color: var(--gold); }
.status-quoted { background: rgba(148, 197, 255, 0.16); color: #94C5FF; }
.status-sent { background: rgba(45, 212, 191, 0.16); color: #5EEAD4; }
.status-won { background: rgba(74, 222, 128, 0.18); color: #4ADE80; }
.status-lost { background: rgba(248, 113, 113, 0.16); color: #FCA5A5; }

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
</style>
