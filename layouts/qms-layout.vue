<template>
  <div>
    <QmsNav
      :search-term="searchTerm"
      :quote-count="quoteCount"
      @update:search-term="searchTerm = $event"
      @clear-search="clearSearch"
      @refresh-data="refreshData"
      @add-quote="openCreateModal"
      @sign-out="handleSignOut"
    />
    <slot />

    <CrudModal
      :show="showCrudModal"
      :mode="crudMode"
      :selected-item="selectedQuoteForModal"
      :form-data="quoteForm"
      :loading="isLoading"
      entity-name="Quote"
      @close="closeCrudModal"
      @save="saveQuote"
      @delete="deleteQuote"
    >
      <template #form="{ formData }">
        <QuoteForm v-model="quoteForm" />
      </template>
      <template #delete-preview="{ item }">
        <strong>{{ item?.name }}</strong><br>
        {{ item?.email }}
      </template>
    </CrudModal>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient()
const searchTerm = ref('')
const quoteCount = ref(0)

const showCrudModal = ref(false)
const crudMode = ref('create')
const selectedQuoteForModal = ref(null)
const isLoading = ref(false)
const quoteForm = ref({
  name: '',
  email: '',
  phone: '',
  notes: ''
})

const resetForm = () => {
  quoteForm.value = {
    name: '',
    email: '',
    phone: '',
    notes: ''
  }
}

const openCreateModal = () => {
  crudMode.value = 'create'
  resetForm()
  showCrudModal.value = true
}

const openDeleteModal = (quote) => {
  crudMode.value = 'delete'
  selectedQuoteForModal.value = quote
  showCrudModal.value = true
}

const closeCrudModal = () => {
  showCrudModal.value = false
  selectedQuoteForModal.value = null
  resetForm()
}

const saveQuote = async () => {
  try {
    isLoading.value = true

    const { error } = await supabase
      .from('quotes')
      .insert([{ ...quoteForm.value, status: 'new' }])

    if (error) throw error

    closeCrudModal()
    refreshCallback.value?.()
  } catch (error) {
    console.error('Error saving quote:', error)
    alert('Error saving quote: ' + error.message)
  } finally {
    isLoading.value = false
  }
}

const deleteQuote = async () => {
  try {
    isLoading.value = true

    const { error } = await supabase
      .from('quotes')
      .delete()
      .eq('id', selectedQuoteForModal.value.id)

    if (error) throw error

    closeCrudModal()
    refreshCallback.value?.()
  } catch (error) {
    console.error('Error deleting quote:', error)
    alert('Error deleting quote: ' + error.message)
  } finally {
    isLoading.value = false
  }
}

const clearSearch = () => {
  searchTerm.value = ''
}

const refreshCallback = ref(null)

const refreshData = () => {
  refreshCallback.value?.()
}

const handleSignOut = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    await navigateTo('/')
  } catch (error) {
    console.error('Error signing out:', error)
    alert('Error signing out: ' + error.message)
  }
}

provide('qmsSearch', {
  searchTerm: readonly(searchTerm),
  clearSearch,
  setQuoteCount: (count) => { quoteCount.value = count },
  setRefreshCallback: (callback) => { refreshCallback.value = callback }
})

provide('qmsCrud', {
  openCreateModal,
  openDeleteModal
})
</script>
