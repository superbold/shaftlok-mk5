<template>
  <div class="page-shell">
    <BreadcrumbNav :items="[{ name: 'Products' }]" />

    <div class="section-head" v-reveal>
      <span class="eyebrow"><i class="fas fa-fan"></i> Product catalog</span>
      <h1><span class="shaftlok-font grad-text">Shaft Lok</span> Products</h1>
      <p>Eight locking systems and two control accessories — covering every shaft from 45&nbsp;mm sailboats to 200&nbsp;mm mega-yachts.</p>
      <button v-if="isAdmin" @click="openCreateModal" class="admin-add-btn">
        <i class="fas fa-plus"></i> Add Product
      </button>
    </div>

    <div v-if="productsError" class="fetch-error">
      <i class="fas fa-exclamation-triangle"></i>
      Unable to load the product catalog right now. Please try again later.
    </div>

    <h2 class="group-title" v-reveal><i class="fas fa-lock"></i> Locking Units</h2>
    <div class="products-grid">
      <NuxtLink
        v-for="(product, i) in lockingUnits"
        :key="product.to"
        :to="product.to"
        class="product-card glass-card hoverable"
        v-reveal="(i % 3) * 100"
      >
        <div class="card-media">
          <img :src="product.image" :alt="product.alt" loading="lazy">
          <span v-if="product.badge" class="card-badge">{{ product.badge }}</span>
          <div v-if="isAdmin" class="admin-card-actions">
            <button @click.stop.prevent="openEditModal(product)" class="admin-card-btn edit-btn" title="Edit product">
              <i class="fas fa-edit"></i>
            </button>
            <button @click.stop.prevent="openDeleteModal(product)" class="admin-card-btn delete-btn" title="Delete product">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
        <div class="card-body">
          <div class="card-top">
            <h3>{{ product.name }}</h3>
            <span v-if="product.bore" class="bore-tag">{{ product.bore }}</span>
          </div>
          <p>{{ product.blurb }}</p>
          <span class="card-link">View details <i class="fas fa-arrow-right"></i></span>
        </div>
      </NuxtLink>
    </div>

    <h2 class="group-title" v-reveal><i class="fas fa-sliders"></i> Controls &amp; Accessories</h2>
    <div class="products-grid">
      <NuxtLink
        v-for="(product, i) in accessories"
        :key="product.to"
        :to="product.to"
        class="product-card glass-card hoverable"
        v-reveal="(i % 3) * 100"
      >
        <div class="card-media">
          <img :src="product.image" :alt="product.alt" loading="lazy">
          <div v-if="isAdmin" class="admin-card-actions">
            <button @click.stop.prevent="openEditModal(product)" class="admin-card-btn edit-btn" title="Edit product">
              <i class="fas fa-edit"></i>
            </button>
            <button @click.stop.prevent="openDeleteModal(product)" class="admin-card-btn delete-btn" title="Delete product">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
        <div class="card-body">
          <div class="card-top">
            <h3>{{ product.name }}</h3>
          </div>
          <p>{{ product.blurb }}</p>
          <span class="card-link">View details <i class="fas fa-arrow-right"></i></span>
        </div>
      </NuxtLink>
    </div>

    <CrudModal
      :show="showCrudModal"
      :mode="crudMode"
      :selected-item="selectedProductForModal"
      :form-data="productForm"
      :loading="isCrudLoading"
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

const { data: products, error: productsError, refresh: refreshProducts } = await useAsyncData('products', async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('id', { ascending: true })

  if (error) throw error
  return data || []
})

const mapProduct = (product) => ({
  ...product,
  to: `/products/${product.slug}`,
  image: product.image_url,
  bore: product.max_bore_size_mm ? `${Math.round(product.max_bore_size_mm)}mm` : null,
  blurb: product.description
})

const lockingUnits = computed(() =>
  (products.value || []).filter(p => p.category === 'Locking Units').map(mapProduct)
)

const accessories = computed(() =>
  (products.value || []).filter(p => p.category === 'Controls & Accessories').map(mapProduct)
)

// Admin state
const user = useSupabaseUser()
const isAdmin = ref(false)

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
  } catch (err) {
    console.error('Error checking admin status:', err)
    isAdmin.value = false
  }
}

watch(user, checkAdminStatus, { immediate: true })

// Product CRUD state
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
  badge: '',
  description: ''
})

const productForm = ref(emptyProductForm())

const openCreateModal = () => {
  crudMode.value = 'create'
  selectedProductForModal.value = null
  productForm.value = emptyProductForm()
  showCrudModal.value = true
}

const openEditModal = (product) => {
  crudMode.value = 'edit'
  selectedProductForModal.value = product
  productForm.value = {
    name: product.name,
    slug: product.slug,
    category: product.category,
    image_url: product.image_url,
    alt: product.alt,
    max_bore_size_mm: product.max_bore_size_mm,
    badge: product.badge,
    description: product.description
  }
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
}

const saveProduct = async () => {
  try {
    isCrudLoading.value = true

    const payload = {
      name: productForm.value.name,
      slug: productForm.value.slug,
      category: productForm.value.category,
      image_url: productForm.value.image_url,
      alt: productForm.value.alt,
      max_bore_size_mm: productForm.value.max_bore_size_mm === '' || productForm.value.max_bore_size_mm === null
        ? null
        : Number(productForm.value.max_bore_size_mm),
      badge: productForm.value.badge || null,
      description: productForm.value.description
    }

    if (crudMode.value === 'create') {
      const { error } = await supabase.from('products').insert([payload])
      if (error) throw error
    } else if (crudMode.value === 'edit') {
      const { error } = await supabase
        .from('products')
        .update(payload)
        .eq('id', selectedProductForModal.value.id)
      if (error) throw error
    }

    closeCrudModal()
    await refreshProducts()
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
    await refreshProducts()
  } catch (err) {
    console.error('Error deleting product:', err)
    alert('Error deleting product: ' + err.message)
  } finally {
    isCrudLoading.value = false
  }
}

useHead({
  title: 'Shaft Lok - Products',
  meta: [
    { name: 'description', content: 'Shaft Lok marine propeller control systems - complete range from Mod I to Mod VI EasyLok. Find the perfect propeller locking system for your vessel. Expert installation support.' },
    { property: 'og:title', content: 'Shaft Lok Products - Marine Propeller Control Systems' },
    { property: 'og:description', content: 'Explore ShaftLok\'s complete range of marine propeller control systems. From Mod I EasyLok to high-torque solutions, find the perfect propeller locking system for improved sailing performance.' },
    { property: 'og:image', content: 'https://shaftlok.com/assets/images/Logo_propeller_only.png' },
    { property: 'og:url', content: 'https://shaftlok.com/products' },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'Shaft Lok Inc.' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Shaft Lok Products - Marine Propeller Control Systems' },
    { name: 'twitter:description', content: 'Explore ShaftLok\'s complete range of marine propeller control systems. From Mod I EasyLok to high-torque solutions.' },
    { name: 'twitter:image', content: 'https://shaftlok.com/assets/images/Logo_ShaftLok_whiteBG-landscape.png' }
  ],
  link: [
    { rel: 'canonical', href: 'https://shaftlok.com/products' }
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
            name: 'Products',
            item: 'https://shaftlok.com/products'
          }
        ]
      })
    }
  ]
})

definePageMeta({
  layout: 'default'
})
</script>

<style scoped>
.fetch-error {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background: rgba(248, 113, 113, 0.1);
  border: 1px solid rgba(248, 113, 113, 0.35);
  color: #FCA5A5;
  padding: 1rem;
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
  margin: 1.5rem 0;
}

.group-title {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1.35rem;
  margin: 3rem 0 1.5rem;
}

.group-title i {
  color: var(--accent);
  font-size: 1.05rem;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.4rem;
}

.product-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  text-decoration: none;
  border-radius: var(--radius-lg);
}

.card-media {
  position: relative;
  background: #fff;
  height: 200px;
}

.card-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.admin-add-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.4rem;
  padding: 0.6rem 1.3rem;
  border: 1px solid rgba(45, 212, 191, 0.4);
  border-radius: 999px;
  background: rgba(45, 212, 191, 0.12);
  color: #5EEAD4;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: transform 0.2s ease, background 0.2s ease;
}

.admin-add-btn:hover {
  background: rgba(45, 212, 191, 0.24);
  transform: translateY(-1px);
}

.admin-card-actions {
  position: absolute;
  top: 0.9rem;
  right: 0.9rem;
  display: flex;
  gap: 0.5rem;
  z-index: 2;
}

.admin-card-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 50%;
  border: 1px solid var(--line-strong);
  background: rgba(4, 10, 24, 0.7);
  color: var(--text-hi);
  font-size: 0.85rem;
  cursor: pointer;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  transition: transform 0.2s ease, background 0.2s ease, color 0.2s ease;
}

.admin-card-btn:hover {
  transform: translateY(-1px) scale(1.05);
}

.admin-card-btn.edit-btn:hover {
  background: rgba(245, 198, 107, 0.35);
  color: var(--gold);
}

.admin-card-btn.delete-btn:hover {
  background: rgba(248, 113, 113, 0.35);
  color: #FCA5A5;
}

.card-badge {
  position: absolute;
  top: 0.9rem;
  left: 0.9rem;
  font-family: var(--font-display);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #04121F;
  background: var(--grad-accent);
  border-radius: 999px;
  padding: 0.35rem 0.9rem;
  box-shadow: 0 6px 18px -6px rgba(56, 189, 248, 0.65);
}

.card-body {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 1.4rem 1.5rem 1.5rem;
}

.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
  margin-bottom: 0.5rem;
}

.card-body h3 {
  font-size: 1.12rem;
  margin: 0;
}

.bore-tag {
  flex-shrink: 0;
  font-family: var(--font-display);
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--accent);
  background: rgba(56, 189, 248, 0.1);
  border: 1px solid rgba(56, 189, 248, 0.3);
  border-radius: 999px;
  padding: 0.22rem 0.7rem;
}

.card-body p {
  color: var(--text-mid);
  font-size: 0.93rem;
  margin: 0 0 1.2rem;
  flex: 1;
}

.card-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-display);
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--accent);
  transition: gap 0.25s ease;
}

.product-card:hover .card-link { gap: 0.85rem; }

@media (max-width: 920px) {
  .products-grid { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 580px) {
  .products-grid { grid-template-columns: 1fr; }
}
</style>
