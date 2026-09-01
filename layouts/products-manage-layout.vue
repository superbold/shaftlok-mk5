<template>
  <div>
    <ProductsManageNav
      :search-term="searchTerm"
      :product-count="productCount"
      @update:search-term="searchTerm = $event"
      @clear-search="clearSearch"
      @refresh-data="refreshData"
      @add-product="openCreateModal"
      @sign-out="handleSignOut"
    />
    <slot />

    <CrudModal
      :show="showCrudModal"
      :mode="crudMode"
      :selected-item="selectedProductForModal"
      :form-data="productForm"
      :loading="isCrudLoading"
      :save-disabled="isSaveDisabled"
      entity-name="Product"
      @close="closeCrudModal"
      @save="saveProduct"
      @delete="deleteProduct"
    >
      <template #form>
        <ProductForm v-model="productForm" />
      </template>
      <template #delete-preview="{ item }">
        <strong>{{ item?.name }}</strong><br>
        Slug: {{ item?.slug }} | Category: {{ item?.category }}
      </template>
    </CrudModal>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient()
const searchTerm = ref('')
const productCount = ref(0)

const showCrudModal = ref(false)
const crudMode = ref('create')
const selectedProductForModal = ref(null)
const isCrudLoading = ref(false)

const emptyProductForm = () => ({
  name: '',
  slug: '',
  category: '',
  image_url: '',
  alt: '',
  max_bore_size_mm: '',
  max_bore_size_inch: '',
  badge: '',
  tagline: '',
  summary: '',
  description: '',
  details: '',
  features: [],
  specs: [],
  price: '',
  price_tiers: [],
  display: true
})

const productForm = ref(emptyProductForm())
const productFormSnapshot = ref(null)

const normalizeProductForm = (form) => ({
  name: (form.name ?? '').trim(),
  slug: (form.slug ?? '').trim(),
  category: form.category ?? '',
  image_url: form.image_url ?? '',
  alt: form.alt ?? '',
  max_bore_size_mm: form.max_bore_size_mm === '' || form.max_bore_size_mm == null
    ? ''
    : String(Number(form.max_bore_size_mm)),
  max_bore_size_inch: form.max_bore_size_inch ?? '',
  badge: form.badge ?? '',
  tagline: (form.tagline ?? '').trim(),
  summary: (form.summary ?? '').trim(),
  description: form.description ?? '',
  details: (form.details ?? '').trim(),
  features: sanitizeProductFeatures(form.features ?? []),
  specs: sanitizeProductSpecs(form.specs ?? []),
  price: form.price === '' || form.price == null ? '' : String(Number(form.price)),
  price_tiers: sanitizeProductPriceTiers(form.price_tiers ?? []),
  display: form.display !== false
})

const captureProductFormSnapshot = () => {
  productFormSnapshot.value = normalizeProductForm(productForm.value)
}

const isSaveDisabled = computed(() => {
  if (crudMode.value === 'create') {
    const form = normalizeProductForm(productForm.value)
    return !(form.name && form.slug && form.category)
  }

  if (crudMode.value === 'edit') {
    if (!productFormSnapshot.value) return true
    return JSON.stringify(normalizeProductForm(productForm.value)) === JSON.stringify(productFormSnapshot.value)
  }

  return false
})

const openCreateModal = () => {
  crudMode.value = 'create'
  selectedProductForModal.value = null
  productForm.value = emptyProductForm()
  captureProductFormSnapshot()
  showCrudModal.value = true
}

const openEditModal = (product) => {
  crudMode.value = 'edit'
  selectedProductForModal.value = product
  const hydrated = hydrateProductFormContent(product)
  productForm.value = {
    name: product.name,
    slug: product.slug,
    category: product.category,
    image_url: product.image_url,
    alt: product.alt,
    max_bore_size_mm: product.max_bore_size_mm,
    max_bore_size_inch: product.max_bore_size_inch,
    badge: product.badge,
    tagline: product.tagline ?? '',
    summary: product.summary ?? '',
    description: product.description,
    details: hydrated.details,
    features: hydrated.features,
    specs: hydrated.specs,
    price: product.price ?? '',
    price_tiers: parseProductPriceTiers(product.price_tiers)
      ?? (product.slug === MARINE_CONTROL_CABLE_SLUG ? [...DEFAULT_MARINE_CONTROL_CABLE_TIERS] : []),
    display: product.display !== false
  }
  captureProductFormSnapshot()
  showCrudModal.value = true
}

const openDeleteModal = (product) => {
  crudMode.value = 'delete'
  selectedProductForModal.value = product
  showCrudModal.value = true
}

const closeCrudModal = () => {
  showCrudModal.value = false
  selectedProductForModal.value = null
  productFormSnapshot.value = null
}

const buildPayload = () => {
  const normalized = normalizeProductForm(productForm.value)

  return {
    name: normalized.name,
    slug: normalized.slug,
    category: normalized.category,
    image_url: normalized.image_url,
    alt: normalized.alt,
    max_bore_size_mm: normalized.max_bore_size_mm === ''
      ? null
      : Number(normalized.max_bore_size_mm),
    max_bore_size_inch: normalized.max_bore_size_inch || null,
    badge: normalized.badge || null,
    tagline: normalized.tagline || null,
    summary: normalized.summary || null,
    description: normalized.description || null,
    details: normalized.details || null,
    features: normalized.features.length ? normalized.features : null,
    specs: normalized.specs.length ? normalized.specs : null,
    price: normalized.price === '' ? null : Number(normalized.price),
    price_tiers: normalized.price_tiers.length ? normalized.price_tiers : null,
    display: normalized.display !== false
  }
}

const saveProduct = async () => {
  try {
    isCrudLoading.value = true
    const payload = buildPayload()

    if (crudMode.value === 'create') {
      const { data, error } = await supabase
        .from('products')
        .insert([payload])
        .select('id, slug')
      if (error) throw error
      if (!data?.length) {
        throw new Error(
          'Create did not save — Supabase returned no rows. Run supabase/migrations/20260829_products_admin_write_policies.sql in the Supabase SQL editor, then try again.'
        )
      }
      clearNuxtData(`product-detail-${data[0].slug}`)
    } else if (crudMode.value === 'edit') {
      const { data, error } = await supabase
        .from('products')
        .update(payload)
        .eq('id', selectedProductForModal.value.id)
        .select('id, slug')

      if (error) throw error
      if (!data?.length) {
        throw new Error(
          'Update did not save — Supabase returned no rows. Run supabase/migrations/20260829_products_admin_write_policies.sql in the Supabase SQL editor, then try again.'
        )
      }
      clearNuxtData(`product-detail-${data[0].slug}`)
    }

    closeCrudModal()
    refreshCallback.value?.()
  } catch (err) {
    console.error('Error saving product:', err)
    alert('Error saving product: ' + err.message)
  } finally {
    isCrudLoading.value = false
  }
}

const deleteProduct = async () => {
  try {
    isCrudLoading.value = true

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', selectedProductForModal.value.id)
    if (error) throw error

    closeCrudModal()
    refreshCallback.value?.()
  } catch (err) {
    console.error('Error deleting product:', err)
    alert('Error deleting product: ' + err.message)
  } finally {
    isCrudLoading.value = false
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
  } catch (err) {
    console.error('Error signing out:', err)
    alert('Error signing out: ' + err.message)
  }
}

provide('productSearch', {
  searchTerm: readonly(searchTerm),
  clearSearch,
  setProductCount: (count) => { productCount.value = count },
  setRefreshCallback: (callback) => { refreshCallback.value = callback }
})

provide('productCrud', {
  openCreateModal,
  openEditModal,
  openDeleteModal
})
</script>
