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

          <p>Thank you, kenneth.nigel@shaftlok.com</p>

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
html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  padding: 0;
  background: linear-gradient(to bottom, var(--light-cyan), white);
  min-height: 100vh;
}

.nav-wrapper {
  position: relative;
}

.discount-circle {
  background: var(--federal-blue);
  color: white;
  border: 2px solid white;
  border-radius: 50%;
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  font-weight: bold;
  font-size: 0.9rem;
  position: fixed;
  top: 1rem;
  left: calc(50% - 35rem);
  z-index: 1000;
}

.discount-circle:hover {
  background: var(--honolulu-blue);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(31, 81, 147, 0.3);
}

.discount-text-mobile {
  display: none;
}

/* Info Modal Styles - specific to yacht info modal */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 15px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 2px solid var(--federal-blue);
  background: var(--federal-blue);
  color: white;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.modal-header h2.shaftlok-font {
  color: white;
}

.modal-close {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.modal-body {
  padding: 1.5rem;
  font-size: 1.15rem;
}

.modal-body p {
  line-height: 1.6;
  margin-bottom: 1rem;
}

.modal-body p:first-child {
  margin-top: 0;
}

.modal-body ul {
  margin: 1rem 0;
  padding-left: 2rem;
}

.modal-body li {
  margin-bottom: 0.5rem;
}

.shaftlok-font {
  font-family: 'DeVinneOrnamentDRegular', serif;
  color: var(--federal-blue);
  font-weight: bold;
}

.discount-box {
  background: var(--light-cyan);
  border: 2px solid var(--honolulu-blue);
  border-radius: 10px;
  padding: 0.5rem;
  margin-top: 1.5rem;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 20px;
}

.discount-text {
  font-weight: bold;
  color: var(--federal-blue);
  font-size: 1.3rem;
  margin: 0;
  line-height: 1;
  vertical-align: middle;
  transform: translateY(4px);
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
}

.boat-info-list li i {
  color: #22c55e;
  margin-right: 0.75rem;
  font-size: 0.9rem;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .discount-circle {
    width: 50px;
    height: 50px;
    font-size: 0.7rem;
    top: 0.5rem;
    right: calc(90% + 5px);
  }

  .discount-text-desktop {
    display: none;
  }

  .discount-text-mobile {
    display: inline;
  }
}

@media (max-width: 600px) {
  .boat-info-list {
    grid-template-columns: 1fr;
  }
}

</style>