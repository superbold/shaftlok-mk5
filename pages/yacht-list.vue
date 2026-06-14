<template>
  <div>
    <div class="yacht-container">
      <BreadcrumbNav :items="[{ name: 'Yacht List' }]" />

      <div v-if="loading" class="loading-indicator">
        <i class="fas fa-spinner fa-spin"></i>
        Loading yachts...
      </div>
      
      <div v-else-if="error" class="error-message">
        <i class="fas fa-exclamation-triangle"></i>
        {{ error }}
        <button @click="loadYachts" class="retry-button">Retry</button>
      </div>
      
      <div v-else class="table-container">
        <table class="yacht-table">
          <thead>
            <tr>
              <th @click="sortBy('name')" class="sortable">
                YACHT
                <i class="fas fa-sort" :class="getSortIcon('name')"></i>
              </th>
              <th @click="sortBy('length')" class="sortable">
                LENGTH
                <i class="fas fa-sort" :class="getSortIcon('length')"></i>
              </th>
              <th @click="sortBy('transmission')" class="sortable">
                TRANSMISSION
                <i class="fas fa-sort" :class="getSortIcon('transmission')"></i>
              </th>
              <th @click="sortBy('propeller')" class="sortable">
                PROPELLER
                <i class="fas fa-sort" :class="getSortIcon('propeller')"></i>
              </th>
              <th @click="sortBy('diameter')" class="sortable">
                DIAMETER
                <i class="fas fa-sort" :class="getSortIcon('diameter')"></i>
              </th>
              <th @click="sortBy('pitch')" class="sortable">
                PITCH
                <i class="fas fa-sort" :class="getSortIcon('pitch')"></i>
              </th>
              <th @click="sortBy('blades')" class="sortable">
                BLADES
                <i class="fas fa-sort" :class="getSortIcon('blades')"></i>
              </th>
              <th @click="sortBy('shaft')" class="sortable">
                SHAFT
                <i class="fas fa-sort" :class="getSortIcon('shaft')"></i>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="yacht in filteredYachts"
              :key="yacht.id"
              @click="selectYacht(yacht)"
              :class="[
                'yacht-row',
                { 'selected-row': selectedYacht?.id === yacht.id },
                { 'admin-clickable': isAdmin }
              ]"
            >
              <td :data-cell="'yacht'">{{ yacht.name }}</td>
              <td :data-cell="'length'">{{ yacht.length }}</td>
              <td :data-cell="'transmission'">{{ yacht.transmission }}</td>
              <td :data-cell="'propeller'">{{ yacht.propeller }}</td>
              <td :data-cell="'diameter'">{{ yacht.diameter }}</td>
              <td :data-cell="'pitch'">{{ yacht.pitch }}</td>
              <td :data-cell="'blades'">{{ yacht.blades }}</td>
              <td :data-cell="'shaft'">{{ yacht.shaft }}</td>
            </tr>
            <tr v-if="filteredYachts.length === 0 && !loading">
              <td :colspan="8" class="no-results">
                <i class="fas fa-search"></i>
                No yachts found matching your search.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div v-if="filteredYachts.length > 0" class="pagination">
        <button 
          @click="currentPage--" 
          :disabled="currentPage <= 1"
          class="pagination-button"
        >
          <i class="fas fa-chevron-left"></i>
        </button>
        <span class="page-info">
          Page {{ currentPage }} of {{ totalPages }} ({{ filteredYachts.length }} of {{ totalFilteredCount }} yachts)
        </span>
        <button 
          @click="currentPage++" 
          :disabled="currentPage >= totalPages"
          class="pagination-button"
        >
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
      
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject, watch } from 'vue'

const supabase = useSupabaseClient()
const yachtSearch = inject('yachtSearch')
const yachtCrud = inject('yachtCrud')
const yachts = ref([])
const loading = ref(true)
const error = ref(null)

// Authentication state
const user = useSupabaseUser()
const isAdmin = ref(false)
const searchTerm = computed(() => yachtSearch?.searchTerm.value || '')
const sortColumn = ref('name')
const sortDirection = ref('asc')
const currentPage = ref(1)
const itemsPerPage = 50
const selectedYacht = ref(null)

const yachtCount = computed(() => yachts.value.length)

const filteredYachts = computed(() => {
  let filtered = yachts.value
  
  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase()
    filtered = filtered.filter(yacht => 
      (yacht.name || '').toLowerCase().includes(search) ||
      (yacht.length || '').toString().toLowerCase().includes(search) ||
      (yacht.transmission || '').toLowerCase().includes(search) ||
      (yacht.propeller || '').toLowerCase().includes(search) ||
      (yacht.diameter || '').toString().toLowerCase().includes(search) ||
      (yacht.pitch || '').toString().toLowerCase().includes(search) ||
      (yacht.blades || '').toString().toLowerCase().includes(search) ||
      (yacht.shaft || '').toString().toLowerCase().includes(search)
    )
  }
  
  filtered.sort((a, b) => {
    const aVal = a[sortColumn.value] || ''
    const bVal = b[sortColumn.value] || ''
    
    if (sortDirection.value === 'asc') {
      return aVal.toString().localeCompare(bVal.toString(), undefined, { numeric: true })
    } else {
      return bVal.toString().localeCompare(aVal.toString(), undefined, { numeric: true })
    }
  })
  
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filtered.slice(start, end)
})

const totalFilteredCount = computed(() => {
  return yachts.value.filter(yacht => {
    if (!searchTerm.value) return true
    const search = searchTerm.value.toLowerCase()
    return (yacht.name || '').toLowerCase().includes(search) ||
           (yacht.length || '').toString().toLowerCase().includes(search) ||
           (yacht.transmission || '').toLowerCase().includes(search) ||
           (yacht.propeller || '').toLowerCase().includes(search) ||
           (yacht.diameter || '').toString().toLowerCase().includes(search) ||
           (yacht.pitch || '').toString().toLowerCase().includes(search) ||
           (yacht.blades || '').toString().toLowerCase().includes(search) ||
           (yacht.shaft || '').toString().toLowerCase().includes(search)
  }).length
})

const totalPages = computed(() => {
  return Math.ceil(totalFilteredCount.value / itemsPerPage)
})

// Check if current user is admin
const checkAdminStatus = async () => {
  if (!user.value) {
    isAdmin.value = false
    return
  }

  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.value.sub)
      .single()
    
    isAdmin.value = profile?.role === 'admin'
  } catch (error) {
    console.error('Error checking admin status:', error)
    isAdmin.value = false
  }
}

const loadYachts = async () => {
  try {
    loading.value = true
    error.value = null
    
    const { data, error: fetchError } = await supabase
      .from('yachts')
      .select('*')
      .order('name', { ascending: true })
    
    if (fetchError) {
      throw fetchError
    }
    
    yachts.value = data || []
    yachtSearch?.setYachtCount(yachts.value.length)
    
  } catch (err) {
    console.error('Error loading yachts:', err)
    error.value = `Failed to load yachts: ${err.message}`
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
  currentPage.value = 1
}

const getSortIcon = (column) => {
  if (sortColumn.value !== column) return ''
  return sortDirection.value === 'asc' ? 'fa-sort-up' : 'fa-sort-down'
}

const selectYacht = (yacht) => {
  if (isAdmin.value) {
    selectedYacht.value = selectedYacht.value?.id === yacht.id ? null : yacht
    // Provide selected yacht to the search context
    yachtSearch?.setSelectedYacht(selectedYacht.value)
  }
}


// Watch for search changes from navbar
watch(searchTerm, () => {
  currentPage.value = 1
}, { immediate: false })

onMounted(async () => {
  await checkAdminStatus()
  loadYachts()
  // Register refresh callback with layout
  yachtSearch?.setRefreshCallback(loadYachts)
})

// Watch for user changes to update admin status
watch(user, async () => {
  await checkAdminStatus()
}, { immediate: true })

useHead({
  title: 'Yacht List',
  meta: [
    { name: 'description', content: 'Shaft Lok yacht list - comprehensive database of vessels equipped with our marine propeller control systems. Find boats with proven Shaft Lok technology.' },
    { property: 'og:title', content: 'Shaft Lok Yacht List - Vessels with Marine Propeller Control Systems' },
    { property: 'og:description', content: 'Browse our comprehensive yacht list featuring vessels equipped with Shaft Lok marine shaft locking systems.' },
    { property: 'og:image', content: 'https://shaftlok.com/assets/images/Logo_propeller_only.png' },
    { property: 'og:url', content: 'https://shaftlok.com/yacht-list' },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'Shaft Lok Inc.' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Shaft Lok Yacht List - Vessels with Marine Propeller Control Systems' },
    { name: 'twitter:description', content: 'Browse our comprehensive yacht list featuring vessels equipped with Shaft Lok marine shaft locking systems.' },
    { name: 'twitter:image', content: 'https://shaftlok.com/assets/images/Logo_ShaftLok_whiteBG-landscape.png' }
  ],
  link: [
    { rel: 'canonical', href: 'https://shaftlok.com/yacht-list' }
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://shaftlok.com/'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Yacht List',
            item: 'https://shaftlok.com/yacht-list'
          }
        ]
      })
    }
  ]
})

definePageMeta({
  layout: 'yacht-list-layout'
})

</script>

<style scoped>
.yacht-row {
  transition: background-color 0.2s ease;
}

.yacht-row.admin-clickable {
  cursor: pointer;
}

.selected-row td {
  background-color: rgba(56, 189, 248, 0.08) !important;
}

.selected-row td:first-child {
  box-shadow: inset 3px 0 0 var(--accent);
}

.selected-row:hover td {
  background-color: rgba(56, 189, 248, 0.14) !important;
}
</style>

