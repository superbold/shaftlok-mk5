<template>
  <header>
    <div class="header-container">
      <div class="header-content">
        <div class="logo-container">
          <NuxtLink to="/">
            <img 
              src="/assets/images/Logo_ShaftLok_whiteBG-landscape.png" 
              alt="Shaft Lok Logo" 
              loading="lazy"
              class="logo-desktop"
            >
            <img 
              src="/assets/images/Logo_propeller_only.png" 
              alt="Shaft Lok Logo" 
              loading="lazy"
              class="logo-mobile"
            >
          </NuxtLink>
        </div>
        
        <div class="yacht-nav-section">
          <div class="search-wrapper">
            <div class="search-input-wrapper">
              <input
                :value="props.searchTerm"
                @input="handleSearchInput"
                @focus="clearErrorState"
                type="text"
                :placeholder="searchPlaceholder"
                :class="['search-input', { 'error-placeholder': isErrorState && !isRedError }, { 'error-placeholder-red': isErrorState && isRedError }]"
              />
              <button
                v-if="props.searchTerm"
                @click="emit('clear-search')"
                class="search-action-button"
                aria-label="Clear search"
              >
                <i class="fas fa-times"></i>
              </button>
              <button
                v-else
                @click="emit('refresh-data')"
                class="search-action-button"
                aria-label="Refresh data"
                title="Refresh data"
              >
                <i class="fas fa-sync-alt"></i>
              </button>
            </div>
          </div>

          <div v-if="isAdmin" class="admin-actions">
            <button @click="emit('add-yacht')" class="admin-btn add-btn" title="Add Yacht">
              <i class="fas fa-plus"></i>
              <span class="btn-text">Add Yacht</span>
            </button>
            <button
              @click="handleEditClick"
              class="admin-btn edit-btn"
              :title="selectedYacht ? `Edit ${selectedYacht.name}` : 'Edit Yacht (Select a yacht first)'"
            >
              <i class="fas fa-edit"></i>
              <span class="btn-text">Edit Yacht</span>
            </button>
            <button @click="handleDeleteClick" class="admin-btn delete-btn" title="Delete Yacht">
              <i class="fas fa-trash"></i>
              <span class="btn-text">Delete Yacht</span>
            </button>
          </div>
        </div>
        
        <div class="hamburger-menu">
          <input type="checkbox" id="hamburger-toggle" class="hamburger-checkbox">
          <label for="hamburger-toggle" class="hamburger-label" :class="{ 'admin-hover': isAdmin }">
            <span class="hamburger-line" :class="{ 'admin-red': isAdmin }"></span>
            <span class="hamburger-line" :class="{ 'admin-red': isAdmin }"></span>
            <span class="hamburger-line" :class="{ 'admin-red': isAdmin }"></span>
          </label>
          <div class="hamburger-dropdown">
            <NuxtLink to="/products" class="dropdown-link"><i class="fas fa-cogs"></i> Products</NuxtLink>
            <NuxtLink to="/installation" class="dropdown-link"><i class="fas fa-wrench"></i> Installation</NuxtLink>
            <NuxtLink to="/faq" class="dropdown-link"><i class="fas fa-question-circle"></i> FAQ</NuxtLink>
            <NuxtLink to="/testimonials" class="dropdown-link"><i class="fas fa-star"></i> Testimonials</NuxtLink>
            <NuxtLink to="/about" class="dropdown-link"><i class="fas fa-info-circle"></i> About</NuxtLink>
            <NuxtLink to="/contact" class="dropdown-link"><i class="fas fa-envelope"></i> Contact</NuxtLink>
            <div v-if="isAdmin" class="dropdown-divider"></div>
            <button v-if="isAdmin" @click="$emit('sign-out')" class="dropdown-link sign-out-link">
              <i class="fas fa-sign-out-alt"></i> Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, watch, onMounted, computed, inject } from 'vue'
const props = defineProps({
  searchTerm: {
    type: String,
    default: ''
  },
  yachtCount: {
    type: Number,
    default: 0
  }
})

// Authentication state
const user = useSupabaseUser()
const supabase = useSupabaseClient()
const isAdmin = ref(false)

// Get yacht selection from context
const yachtSearch = inject('yachtSearch')
const selectedYacht = computed(() => yachtSearch?.selectedYacht?.value)

// Error state for placeholder text
const isErrorState = ref(false)
const errorMessage = ref('')
const isRedError = ref(false)

// Computed placeholder text
const searchPlaceholder = computed(() => {
  if (isErrorState.value) {
    return errorMessage.value
  }
  return `Search ${props.yachtCount || 0} yachts...`
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
      .eq('id', user.value.id)
      .single()
    
    isAdmin.value = profile?.role === 'admin'
  } catch (error) {
    console.error('Error checking admin status:', error)
    isAdmin.value = false
  }
}

// Watch for user changes to update admin status
watch(user, async () => {
  await checkAdminStatus()
}, { immediate: true })

// Handle admin button clicks
const handleEditClick = () => {
  if (selectedYacht.value) {
    // Open edit modal with selected yacht
    emit('edit-yacht', selectedYacht.value)
  } else {
    isErrorState.value = true
    isRedError.value = false
    errorMessage.value = 'Please find a yacht then re-click EDIT.'
  }
}

const handleDeleteClick = () => {
  isErrorState.value = true
  isRedError.value = true
  errorMessage.value = 'Feature coming soon!'
}

// Handle search input
const emit = defineEmits(['show-modal', 'update:searchTerm', 'clear-search', 'refresh-data', 'add-yacht', 'edit-yacht', 'sign-out'])

const handleSearchInput = (event) => {
  clearErrorState()
  // Clear yacht selection when user starts searching
  if (selectedYacht.value) {
    yachtSearch?.setSelectedYacht(null)
  }
  emit('update:searchTerm', event.target.value)
}

// Clear error state
const clearErrorState = () => {
  isErrorState.value = false
  isRedError.value = false
  errorMessage.value = ''
}

// Watch for yacht selection changes to clear error state
watch(selectedYacht, (newYacht) => {
  if (newYacht && isErrorState.value) {
    clearErrorState()
  }
})

onMounted(async () => {
  await checkAdminStatus()
})
</script>

<style scoped>
header {
  background-color: white;
  border: 2px solid var(--federal-blue);
  border-radius: 50px;
  position: fixed;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  width: 80%;
  max-width: 900px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.header-container {
  padding: 0.75rem 1.5rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 2.5rem;
}

.logo-container {
  display: flex;
  align-items: center;
  margin-right: 2rem;
}

.logo-desktop {
  height: 2.5rem;
  width: auto;
  vertical-align: middle;
}

.logo-mobile {
  display: none;
  height: 2.5rem;
  width: auto;
  vertical-align: middle;
}

.yacht-nav-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  margin: 0 2rem;
}



.search-wrapper {
  flex: 1;
  max-width: 300px;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  padding: 0.5rem;
  padding-right: 2.5rem;
  border: 1px solid var(--federal-blue);
  border-radius: 25px;
  background: white;
  color: var(--federal-blue);
  width: 100%;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--honolulu-blue);
  box-shadow: 0 0 0 2px rgba(202, 240, 248, 0.5);
}

.search-input::placeholder {
  color: rgba(31, 81, 147, 0.6);
}

.search-input.error-placeholder::placeholder {
  color: #f97316;
  font-weight: 500;
}

.search-input.error-placeholder-red::placeholder {
  color: #ef4444;
  font-weight: 500;
}

.search-action-button {
  position: absolute;
  right: 0.5rem;
  background: none;
  border: none;
  color: rgba(31, 81, 147, 0.6);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 3px;
  font-size: 0.8rem;
  transition: all 0.2s ease;
}

.search-action-button:hover {
  color: var(--federal-blue);
  background: rgba(31, 81, 147, 0.1);
}

.admin-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: 1rem;
}

.admin-btn {
  background: var(--federal-blue);
  color: white;
  border: none;
  border-radius: 1rem;
  padding: 0 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  white-space: nowrap;
  width: 2rem;
  height: 2rem;
  position: relative;
}

.admin-btn i {
  font-size: 0.9rem;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.admin-btn .btn-text {
  font-size: 0.8rem;
  font-weight: 500;
  opacity: 0;
  max-width: 0;
  margin-left: 0;
  transition: all 0.3s ease;
  overflow: hidden;
}

.admin-btn:hover {
  width: auto;
  padding: 0 1rem;
}

.admin-btn:hover .btn-text {
  opacity: 1;
  max-width: 6rem;
  margin-left: 0.5rem;
}

.admin-btn:hover i {
  margin-right: 0;
}

.admin-btn.disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.admin-btn.disabled:hover {
  background: #9ca3af;
  width: 2rem;
  padding: 0 1rem;
}

.admin-btn.disabled:hover .btn-text {
  opacity: 0;
  max-width: 0;
  margin-left: 0;
}

.add-btn {
  background: #22c55e;
}

.add-btn:hover {
  background: #16a34a;
}

.edit-btn {
  background: #f97316;
}

.edit-btn:hover {
  background: #ea580c;
}

.delete-btn {
  background: #ef4444;
}

.delete-btn:hover {
  background: #dc2626;
}



.hamburger-menu {
  position: relative;
  display: block;
}

.hamburger-checkbox {
  display: none;
}

.hamburger-label {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 45px;
  cursor: pointer;
  border-radius: 50px;
  transition: all 0.3s ease;
}

.hamburger-label:hover {
  background-color: var(--federal-blue);
}

.hamburger-label.admin-hover:hover {
  background-color: #dc2626;
}

.hamburger-line {
  width: 20px;
  height: 3px;
  background-color: var(--federal-blue);
  border-radius: 2px;
  transition: all 0.3s ease;
  margin: 2px 0;
}

.hamburger-line.admin-red {
  background-color: #dc2626;
}

.hamburger-label:hover .hamburger-line {
  background-color: white;
}

.hamburger-checkbox:checked ~ .hamburger-label .hamburger-line:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.hamburger-checkbox:checked ~ .hamburger-label .hamburger-line:nth-child(2) {
  opacity: 0;
}

.hamburger-checkbox:checked ~ .hamburger-label .hamburger-line:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
}

.hamburger-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border: 2px solid var(--federal-blue);
  border-radius: 15px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  z-index: 1000;
  margin-top: 10px;
}

.hamburger-checkbox:checked ~ .hamburger-dropdown {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 12px 20px;
  color: var(--federal-blue);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  border-bottom: 1px solid #f0f0f0;
}

.dropdown-link:last-child {
  border-bottom: none;
}

.dropdown-link:hover,
.dropdown-link.router-link-active {
  background-color: var(--federal-blue);
  color: white;
}

.dropdown-link i {
  margin-right: 10px;
  width: 16px;
}

.dropdown-link:first-child {
  border-top-left-radius: 13px;
  border-top-right-radius: 13px;
}

.dropdown-link:last-child {
  border-bottom-left-radius: 13px;
  border-bottom-right-radius: 13px;
}

.dropdown-divider {
  height: 1px;
  background-color: #e2e8f0;
  margin: 0.5rem 0;
}

.sign-out-link {
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  color: #dc2626;
  cursor: pointer;
  font-weight: 500;
  font-size: inherit;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sign-out-link:hover {
  background-color: #dc2626;
  color: white;
}

@media (max-width: 1024px) {
  .yacht-nav-section {
    gap: 0.5rem;
    margin: 0 1rem;
  }
  
  .search-wrapper {
    max-width: 200px;
  }
  
  .search-input {
    font-size: 0.8rem;
  }
}

@media (max-width: 768px) {
  header {
    top: 0.5rem;
    right: 0.5rem;
    width: calc(90% - 60px);
  }
  
  .header-content {
    height: auto;
    flex-direction: column;
    gap: 1rem;
    padding: 0.5rem 0;
  }
  
  .yacht-nav-section {
    order: 2;
    width: 100%;
    justify-content: center;
    margin: 0;
  }
  
  .search-wrapper {
    max-width: none;
    flex: 1;
  }
  
  .hamburger-menu {
    order: 3;
    align-self: flex-end;
  }
  
  .logo-container {
    order: 1;
    margin-right: 0;
  }
  
  .logo-desktop {
    display: none;
  }
  
  .logo-mobile {
    display: block;
  }
  
}
</style>