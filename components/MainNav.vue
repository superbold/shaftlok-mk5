<template>
  <header v-if="!isAuthPage" :class="{ scrolled: isScrolled, 'menu-open': menuOpen }">
    <div class="nav-inner">
      <button
        class="menu-toggle"
        :aria-expanded="menuOpen"
        aria-label="Toggle navigation menu"
        @click="toggleMenu"
      >
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
      </button>

      <NuxtLink to="/" class="brand" @click="closeMenu">
        <img src="/assets/images/Logo_propeller_only.png" alt="Shaft Lok propeller logo" class="brand-mark">
        <span class="brand-name"><span class="brand-shaft">Shaft Lok</span><span class="brand-inc">INC.</span></span>
      </NuxtLink>

      <NuxtLink to="/quote" class="btn btn-primary nav-cta" @click="closeMenu">Get a Quote</NuxtLink>
    </div>
  </header>

  <template v-if="!isAuthPage">
    <Transition name="fade">
      <div v-if="menuOpen" class="nav-backdrop" @click="closeMenu"></div>
    </Transition>

    <Transition name="drawer">
      <nav v-if="menuOpen" class="nav-panel" aria-label="Primary">
        <div class="panel-track" :class="{ 'show-products': panelView === 'products' }">
          <div class="panel-screen">
            <template v-for="link in mainLinks" :key="link.label">
              <button v-if="link.expand" class="panel-link panel-expand" @click="panelView = 'products'">
                <i :class="link.icon"></i>
                <span>{{ link.label }}</span>
                <i class="fas fa-chevron-right arrow"></i>
              </button>
              <NuxtLink v-else :to="link.to" class="panel-link" @click="closeMenu">
                <i :class="link.icon"></i>
                <span>{{ link.label }}</span>
              </NuxtLink>
            </template>

            <button v-if="user" @click="handleSignOut" class="panel-link panel-signout">
              <i class="fas fa-sign-out-alt"></i><span>Sign Out</span>
            </button>

            <NuxtLink to="/quote" class="btn btn-primary panel-cta" @click="closeMenu">Get a Quote</NuxtLink>
          </div>

          <div class="panel-screen">
            <button class="panel-back" @click="panelView = 'main'">
              <i class="fas fa-chevron-left arrow"></i>
              <span>All Products</span>
            </button>

            <NuxtLink
              v-for="product in navProducts"
              :key="product.slug"
              :to="`/products/${product.slug}`"
              class="panel-link panel-product"
              @click="closeMenu"
            >
              {{ product.name }}
            </NuxtLink>
          </div>
        </div>
      </nav>
    </Transition>
  </template>
</template>

<script setup>
const route = useRoute()
const isAuthPage = computed(() => route.path.startsWith('/auth'))

const mainLinks = [
  { label: 'Products', icon: 'fas fa-cogs', expand: true },
  { to: '/installation', label: 'Installation', icon: 'fas fa-wrench' },
  { to: '/yacht-list', label: 'Yacht List', icon: 'fas fa-ship' },
  { to: '/faq', label: 'FAQ', icon: 'fas fa-question-circle' },
  { to: '/testimonials', label: 'Testimonials', icon: 'fas fa-star' },
  { to: '/about', label: 'About', icon: 'fas fa-info-circle' },
  { to: '/contact', label: 'Contact', icon: 'fas fa-envelope' }
]

const menuOpen = ref(false)
const panelView = ref('main')
const isScrolled = ref(false)

const toggleMenu = () => { menuOpen.value = !menuOpen.value }
const closeMenu = () => { menuOpen.value = false }

const onScroll = () => { isScrolled.value = window.scrollY > 12 }

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => window.removeEventListener('scroll', onScroll))

// Close menu when navigating
watch(() => route.path, () => { menuOpen.value = false })

// Lock body scroll while the panel is open, and reset to the main panel on close
watch(menuOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
  if (!open) panelView.value = 'main'
})

// Authentication state
const user = useSupabaseUser()
const supabase = useSupabaseClient()

const handleSignOut = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    closeMenu()
    await navigateTo('/')
  } catch (error) {
    console.error('Error signing out:', error)
    alert('Error signing out: ' + error.message)
  }
}

// Products list for the slide-out panel
const { data: navProducts } = await useAsyncData('nav-products', async () => {
  const { data, error } = await supabase
    .from('products')
    .select('name, slug')
    .order('id', { ascending: true })

  if (error) throw error
  return data || []
}, { default: () => [] })
</script>

<style scoped>
header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  border-bottom: 1px solid transparent;
  transition: background 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease;
}

header.scrolled,
header.menu-open {
  background: rgba(4, 10, 24, 0.78);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border-bottom-color: var(--line);
  box-shadow: 0 12px 40px -18px rgba(2, 8, 23, 0.9);
}

.nav-inner {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  height: var(--nav-height);
  padding: 0 1.5rem;
  display: flex;
  align-items: center;
}

.brand {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  gap: 0.7rem;
  text-decoration: none;
}

.brand-mark {
  height: 3.1rem;
  width: 3.1rem;
  object-fit: contain;
  background: #fff;
  border-radius: 10px;
  padding: 3px;
  filter: drop-shadow(0 0 12px rgba(56, 189, 248, 0.35));
}

.brand-name {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  line-height: 1;
}

.brand-shaft {
  font-family: var(--font-brand);
  font-size: 2.1rem;
  color: var(--text-hi);
}

.brand-inc {
  font-family: var(--font-display);
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.42em;
  color: var(--accent);
  margin-top: 0.3rem;
}

.nav-cta {
  margin-left: auto;
  padding: 0.6rem 1.4rem;
  font-size: 0.92rem;
}

@media (max-width: 560px) {
  .nav-cta { display: none; }
}

.menu-toggle {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 2.8rem;
  height: 2.8rem;
  padding: 0 0.6rem;
  background: rgba(148, 197, 255, 0.06);
  border: 1px solid var(--line);
  border-radius: 12px;
  cursor: pointer;
  transition: border-color 0.25s ease;
}

.menu-toggle:hover { border-color: var(--accent); }

.menu-toggle .bar {
  height: 2px;
  width: 100%;
  background: var(--text-hi);
  border-radius: 2px;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.menu-open .menu-toggle .bar:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.menu-open .menu-toggle .bar:nth-child(2) { opacity: 0; }
.menu-open .menu-toggle .bar:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

/* Backdrop */
.nav-backdrop {
  position: fixed;
  top: var(--nav-height);
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(2, 8, 23, 0.6);
  z-index: 999;
}

.fade-enter-active,
.fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from,
.fade-leave-to { opacity: 0; }

/* Sliding panel */
.nav-panel {
  position: fixed;
  top: var(--nav-height);
  left: 0;
  bottom: 0;
  width: min(360px, 85vw);
  background: rgba(4, 10, 24, 0.92);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border-right: 1px solid var(--line);
  box-shadow: 12px 0 40px -18px rgba(2, 8, 23, 0.9);
  z-index: 1000;
  overflow: hidden;
}

.drawer-enter-active,
.drawer-leave-active { transition: transform 0.35s ease; }
.drawer-enter-from,
.drawer-leave-to { transform: translateX(-100%); }

.panel-track {
  display: flex;
  width: 200%;
  height: 100%;
  transition: transform 0.35s ease;
}

.panel-track.show-products { transform: translateX(-50%); }

.panel-screen {
  width: 50%;
  flex-shrink: 0;
  height: 100%;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.panel-link {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  padding: 0.85rem 1rem;
  font-family: var(--font-display);
  font-size: 1.02rem;
  font-weight: 500;
  color: var(--text-mid);
  text-decoration: none;
  border-radius: var(--radius-sm);
  background: none;
  border: none;
  width: 100%;
  cursor: pointer;
  text-align: left;
  transition: color 0.2s ease, background 0.2s ease;
}

.panel-link i:not(.arrow) {
  width: 1.4rem;
  text-align: center;
  color: var(--accent);
}

.panel-link span { flex: 1; }

.panel-link:hover,
.panel-link.router-link-active {
  color: var(--text-hi);
  background: rgba(56, 189, 248, 0.1);
}

.panel-expand .arrow {
  flex: none;
  font-size: 0.8rem;
  color: var(--text-mid);
  transition: transform 0.2s ease, color 0.2s ease;
}

.panel-expand:hover .arrow {
  color: var(--accent);
  transform: translateX(3px);
}

.panel-back {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.85rem 1rem;
  margin-bottom: 0.5rem;
  font-family: var(--font-display);
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--accent);
  background: none;
  border: none;
  border-bottom: 1px solid var(--line);
  border-radius: var(--radius-sm);
  cursor: pointer;
  text-align: left;
  transition: background 0.2s ease;
}

.panel-back .arrow { font-size: 0.8rem; }

.panel-back:hover { background: rgba(56, 189, 248, 0.08); }

.panel-product { padding-left: 1.25rem; }

.panel-signout {
  margin-top: 0.5rem;
  color: #FCA5A5;
  border-top: 1px solid var(--line);
  border-radius: 0;
  padding-top: 1rem;
}

.panel-signout i { color: #FCA5A5; }

.panel-cta {
  margin-top: auto;
  display: block;
  text-align: center;
}
</style>
