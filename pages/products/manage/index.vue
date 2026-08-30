<template>
  <div>
    <div class="yacht-container">
      <BreadcrumbNav :items="[{ name: 'Product Management' }]" />

      <div v-if="loading" class="loading-indicator">
        <i class="fas fa-spinner fa-spin"></i>
        Loading products...
      </div>

      <div v-else-if="error" class="error-message">
        <i class="fas fa-exclamation-triangle"></i>
        {{ error }}
        <button @click="loadProducts" class="retry-button">Retry</button>
      </div>

      <div v-else class="table-container">
        <table class="yacht-table">
          <thead>
            <tr>
              <th @click="sortBy('name')" class="sortable">
                PRODUCT
                <i class="fas fa-sort" :class="getSortIcon('name')"></i>
              </th>
              <th @click="sortBy('slug')" class="sortable">
                SLUG
                <i class="fas fa-sort" :class="getSortIcon('slug')"></i>
              </th>
              <th @click="sortBy('category')" class="sortable">
                CATEGORY
                <i class="fas fa-sort" :class="getSortIcon('category')"></i>
              </th>
              <th @click="sortBy('max_bore_size_mm')" class="sortable">
                MAX BORE
                <i class="fas fa-sort" :class="getSortIcon('max_bore_size_mm')"></i>
              </th>
              <th @click="sortBy('price')" class="sortable">
                PRICE
                <i class="fas fa-sort" :class="getSortIcon('price')"></i>
              </th>
              <th @click="sortBy('display')" class="sortable">
                VISIBLE
                <i class="fas fa-sort" :class="getSortIcon('display')"></i>
              </th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="product in filteredProducts"
              :key="product.id"
              class="product-row"
              @click="editProduct(product)"
            >
              <td>{{ product.name }}</td>
              <td><code class="slug-code">{{ product.slug }}</code></td>
              <td>{{ product.category }}</td>
              <td>{{ formatBore(product.max_bore_size_mm) }}</td>
              <td>{{ formatPrice(product.price) }}</td>
              <td>
                <span :class="['visibility-badge', product.display !== false ? 'visible' : 'hidden']">
                  {{ product.display !== false ? 'Yes' : 'No' }}
                </span>
              </td>
              <td class="actions-cell" @click.stop>
                <div class="row-actions">
                  <NuxtLink
                    :to="`/products/${product.slug}`"
                    class="action-btn view-btn"
                    title="View public page"
                    target="_blank"
                  >
                    <i class="fas fa-external-link-alt"></i>
                  </NuxtLink>
                  <button
                    @click="productCrud?.openDeleteModal(product)"
                    class="action-btn delete-btn"
                    title="Delete product"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredProducts.length === 0">
              <td :colspan="7" class="no-results">
                <i class="fas fa-search"></i>
                No products found matching your search.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p v-if="!loading && !error" class="catalog-link">
        <NuxtLink to="/products"><i class="fas fa-store"></i> View public product catalog</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'products-manage-layout',
  middleware: 'admin'
})

const supabase = useSupabaseClient()
const productSearch = inject('productSearch')
const productCrud = inject('productCrud')
const searchTerm = computed(() => productSearch?.searchTerm.value || '')

const products = ref([])
const loading = ref(true)
const error = ref(null)
const sortColumn = ref('id')
const sortDirection = ref('asc')

const formatBore = (mm) => {
  if (mm === null || mm === undefined || mm === '') return '—'
  return `${Math.round(Number(mm))}mm`
}

const formatPrice = (price) => formatProductPrice(price) ?? '—'

const filteredProducts = computed(() => {
  let filtered = products.value

  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase()
    filtered = filtered.filter(p =>
      (p.name || '').toLowerCase().includes(search) ||
      (p.slug || '').toLowerCase().includes(search) ||
      (p.category || '').toLowerCase().includes(search) ||
      (p.summary || '').toLowerCase().includes(search)
    )
  }

  filtered = [...filtered].sort((a, b) => {
    const aVal = a[sortColumn.value]
    const bVal = b[sortColumn.value]

    if (sortColumn.value === 'display') {
      const aDisplay = a.display !== false ? 1 : 0
      const bDisplay = b.display !== false ? 1 : 0
      return sortDirection.value === 'asc' ? aDisplay - bDisplay : bDisplay - aDisplay
    }

    if (sortColumn.value === 'max_bore_size_mm') {
      const aNum = aVal === null || aVal === undefined ? -1 : Number(aVal)
      const bNum = bVal === null || bVal === undefined ? -1 : Number(bVal)
      return sortDirection.value === 'asc' ? aNum - bNum : bNum - aNum
    }

    if (sortColumn.value === 'price') {
      const aNum = aVal === null || aVal === undefined ? -1 : Number(aVal)
      const bNum = bVal === null || bVal === undefined ? -1 : Number(bVal)
      return sortDirection.value === 'asc' ? aNum - bNum : bNum - aNum
    }

    const result = (aVal ?? '').toString().localeCompare((bVal ?? '').toString(), undefined, { numeric: true })
    return sortDirection.value === 'asc' ? result : -result
  })

  return filtered
})

const loadProducts = async () => {
  try {
    loading.value = true
    error.value = null

    const { data, error: fetchError } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true })

    if (fetchError) throw fetchError

    products.value = data || []
    productSearch?.setProductCount(products.value.length)
  } catch (err) {
    console.error('Error loading products:', err)
    error.value = `Failed to load products: ${err.message}`
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

const editProduct = (product) => {
  productCrud?.openEditModal(product)
}

onMounted(() => {
  loadProducts()
  productSearch?.setRefreshCallback(loadProducts)
})

useHead({
  title: 'Product Management',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }]
})
</script>

<style scoped>
.slug-code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.82rem;
  color: var(--accent);
  background: rgba(56, 189, 248, 0.08);
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
}

.visibility-badge {
  display: inline-block;
  padding: 0.25rem 0.7rem;
  border-radius: 999px;
  font-family: var(--font-display);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.04em;
}

.visibility-badge.visible {
  background: rgba(45, 212, 191, 0.15);
  color: #5EEAD4;
}

.visibility-badge.hidden {
  background: rgba(148, 163, 184, 0.15);
  color: var(--text-low);
}

.actions-cell { width: 1%; white-space: nowrap; }

.product-row {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.product-row:hover td:first-child {
  box-shadow: inset 3px 0 0 var(--accent);
}

.row-actions {
  display: flex;
  gap: 0.65rem;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.1rem;
  height: 2.1rem;
  border-radius: var(--radius-sm);
  cursor: pointer;
  border: 1px solid var(--line-strong);
  background: rgba(13, 27, 54, 0.5);
  color: var(--text-mid);
  text-decoration: none;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.action-btn:hover { color: var(--text-hi); }

.view-btn:hover {
  background: rgba(56, 189, 248, 0.18);
  color: var(--accent);
}

.delete-btn:hover {
  background: rgba(248, 113, 113, 0.18);
  color: #FCA5A5;
}

.catalog-link {
  margin-top: 1.5rem;
  text-align: center;
}

.catalog-link a {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-mid);
  text-decoration: none;
  font-family: var(--font-display);
  font-size: 0.92rem;
  transition: color 0.2s ease;
}

.catalog-link a:hover { color: var(--accent); }
</style>
