<template>
  <div>
    <div class="nav-wrapper">
      <YachtListNav
        :search-term="searchTerm"
        :yacht-count="yachtCount"
        @show-modal="showModal = true"
        @update:search-term="searchTerm = $event"
        @clear-search="clearSearch"
        @refresh-data="refreshData"
        @add-yacht="openCreateModal"
        @edit-yacht="openEditModal"
        @sign-out="handleSignOut"
      />
      <button @click="showModal = true" class="discount-circle" title="$50 Discount Info">
        <span class="discount-text-desktop">$50 off</span>
        <span class="discount-text-mobile">$50</span>
      </button>
    </div>
    <slot />
    
    <!-- Info Modal Window -->
    <div v-if="showModal" class="modal" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2 class="shaftlok-font">Yacht Information Guide</h2>
          <button @click="showModal = false" class="modal-close" aria-label="Close modal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <p>We appreciate you taking time to check out yachts that have installed a unit or two (in some cases). Should you find your vessel here that means your boat probably has the space in the engine room necessary to fit your own <span class="shaftlok-font">Shaft Lok</span>.</p>

          <p>Thank you, sean.nigel@shaftlok.com</p>

          <p>When contacting <span class="shaftlok-font">Shaft Lok</span> Inc. have the following boat information available:</p>

          <ul class="boat-info-list">
            <li><i class="fas fa-check"></i>Yacht Type & Length (i.e., Morgan 41)?</li>
            <li><i class="fas fa-check"></i>Yacht Name on stern?</li>
            <li><i class="fas fa-check"></i>Propeller Shaft Diameter?</li>
            <li><i class="fas fa-check"></i>Propeller Diameter?</li>
            <li><i class="fas fa-check"></i>Number of Blades?</li>
            <li><i class="fas fa-check"></i>Is it Fixed, Folding or Feathering?</li>
            <li><i class="fas fa-check"></i>Max hull speed?</li>
            <li><i class="fas fa-check"></i>Displacement?</li>
            <li><i class="fas fa-check"></i>Engine(s) make and HP?</li>
            <li><i class="fas fa-check"></i>Transmission make and ratio?</li>
          </ul>

          <div class="discount-box">
            <p class="discount-text">Ask for the $50.00 "I got all the info" discount!</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- CRUD Modal Window -->
    <CrudModal
      :show="showCrudModal"
      :mode="crudMode"
      :selected-item="selectedYachtForModal"
      :form-data="yachtForm"
      :loading="isLoading"
      entity-name="Yacht"
      @close="closeCrudModal"
      @save="saveYacht"
      @delete="deleteYacht"
    >
      <template #form="{ formData }">
        <YachtForm v-model="yachtForm" />
      </template>
      <template #delete-preview="{ item }">
        <strong>{{ item?.name }}</strong><br>
        Length: {{ item?.length }} | Transmission: {{ item?.transmission }}
      </template>
    </CrudModal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const supabase = useSupabaseClient()
const showModal = ref(false)
const searchTerm = ref('')
const yachtCount = ref(0)
const selectedYacht = ref(null)

// CRUD Modal State
const showCrudModal = ref(false)
const crudMode = ref('create') // 'create', 'edit', 'delete'
const selectedYachtForModal = ref(null)
const isLoading = ref(false)
const yachtForm = ref({
  name: '',
  length: '',
  transmission: '',
  propeller: '',
  diameter: '',
  pitch: '',
  blades: '',
  shaft: ''
})

const closeModal = (event) => {
  if (event.target === event.currentTarget) {
    showModal.value = false
  }
}

const closeCrudModal = () => {
  showCrudModal.value = false
  selectedYachtForModal.value = null
  resetForm()
}

const resetForm = () => {
  yachtForm.value = {
    name: '',
    length: '',
    transmission: '',
    propeller: '',
    diameter: '',
    pitch: '',
    blades: '',
    shaft: ''
  }
}

const openCreateModal = () => {
  crudMode.value = 'create'
  resetForm()
  showCrudModal.value = true
}

const openEditModal = (yacht) => {
  crudMode.value = 'edit'
  selectedYachtForModal.value = yacht
  yachtForm.value = { ...yacht }
  showCrudModal.value = true
}

const openDeleteModal = (yacht) => {
  crudMode.value = 'delete'
  selectedYachtForModal.value = yacht
  showCrudModal.value = true
}

const saveYacht = async () => {
  try {
    isLoading.value = true
    
    if (crudMode.value === 'create') {
      const { error } = await supabase
        .from('yachts')
        .insert([yachtForm.value])
      
      if (error) throw error
    } else if (crudMode.value === 'edit') {
      const { id, ...updateData } = yachtForm.value
      const { error } = await supabase
        .from('yachts')
        .update(updateData)
        .eq('id', selectedYachtForModal.value.id)
      
      if (error) throw error
    }
    
    closeCrudModal()
    refreshCallback.value?.()
  } catch (error) {
    console.error('Error saving yacht:', error)
    alert('Error saving yacht: ' + error.message)
  } finally {
    isLoading.value = false
  }
}

const deleteYacht = async () => {
  try {
    isLoading.value = true
    
    const { error } = await supabase
      .from('yachts')
      .delete()
      .eq('id', selectedYachtForModal.value.id)
    
    if (error) throw error
    
    closeCrudModal()
    refreshCallback.value?.()
  } catch (error) {
    console.error('Error deleting yacht:', error)
    alert('Error deleting yacht: ' + error.message)
  } finally {
    isLoading.value = false
  }
}

const clearSearch = () => {
  searchTerm.value = ''
}

const refreshData = () => {
  // This will be called from the navbar, pass it to yacht-list page
  refreshCallback.value?.()
}

const refreshCallback = ref(null)

// Handle sign out
const handleSignOut = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    
    // Redirect to home page after sign out
    await navigateTo('/')
  } catch (error) {
    console.error('Error signing out:', error)
    alert('Error signing out: ' + error.message)
  }
}

// Provide search functionality and count to child components
provide('yachtSearch', {
  searchTerm: readonly(searchTerm),
  yachtCount: readonly(yachtCount),
  selectedYacht: readonly(selectedYacht),
  clearSearch,
  setYachtCount: (count) => { yachtCount.value = count },
  setRefreshCallback: (callback) => { refreshCallback.value = callback },
  setSelectedYacht: (yacht) => { selectedYacht.value = yacht }
})

// Provide CRUD functionality to child components
provide('yachtCrud', {
  openCreateModal,
  openEditModal,
  openDeleteModal
})
</script>

<style>
.nav-wrapper {
  position: relative;
}

.discount-circle {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(120deg, #38BDF8, #2DD4BF);
  color: #04121F;
  border: none;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.92rem;
  cursor: pointer;
  box-shadow: 0 14px 36px -10px rgba(56, 189, 248, 0.75);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  animation: discount-pulse 3s ease-in-out infinite;
}

.discount-circle:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 18px 44px -10px rgba(56, 189, 248, 0.9);
}

@keyframes discount-pulse {
  0%, 100% { box-shadow: 0 14px 36px -10px rgba(56, 189, 248, 0.75), 0 0 0 0 rgba(56, 189, 248, 0.45); }
  50% { box-shadow: 0 14px 36px -10px rgba(56, 189, 248, 0.75), 0 0 0 14px rgba(56, 189, 248, 0); }
}

.discount-text-mobile { display: none; }

.discount-box {
  background: rgba(245, 198, 107, 0.08);
  border: 1px solid rgba(245, 198, 107, 0.4);
  border-radius: var(--radius-md);
  padding: 0.9rem;
  margin-top: 1.5rem;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.boat-info-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem 1rem;
  margin: 1rem 0;
  padding-left: 0;
  list-style: none;
}

.boat-info-list li {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  color: var(--text-mid);
}

.boat-info-list li i {
  color: #5EEAD4;
  margin-right: 0.75rem;
  font-size: 0.9rem;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .discount-circle {
    width: 56px;
    height: 56px;
    font-size: 0.8rem;
    bottom: 1rem;
    right: 1rem;
  }

  .discount-text-desktop { display: none; }
  .discount-text-mobile { display: inline; }
}

@media (max-width: 600px) {
  .boat-info-list { grid-template-columns: 1fr; }
}
</style>
