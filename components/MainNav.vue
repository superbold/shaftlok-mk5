<template>
  <header v-if="!isAuthPage" :class="{ scrolled: isScrolled, 'menu-open': menuOpen }">
    <div class="nav-inner">
      <NuxtLink to="/" class="brand" @click="menuOpen = false">
        <img src="/assets/images/Logo_propeller_only.png" alt="Shaft Lok propeller logo" class="brand-mark">
        <span class="brand-name"><span class="brand-shaft">Shaft Lok</span><span class="brand-inc">INC.</span></span>
      </NuxtLink>

      <nav class="nav-links" aria-label="Primary">
        <NuxtLink v-for="link in links" :key="link.to" :to="link.to" class="nav-link">
          {{ link.label }}
        </NuxtLink>
      </nav>

      <div class="nav-actions">
        <button v-if="user" @click="handleSignOut" class="signout-button" title="Sign out">
          <i class="fas fa-sign-out-alt"></i><span>Sign Out</span>
        </button>
        <NuxtLink to="/contact" class="btn btn-primary nav-cta">Get a Quote</NuxtLink>
        <button
          class="menu-toggle"
          :aria-expanded="menuOpen"
          aria-label="Toggle navigation menu"
          @click="menuOpen = !menuOpen"
        >
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
        </button>
      </div>
    </div>

    <Transition name="drop">
      <nav v-if="menuOpen" class="mobile-menu" aria-label="Mobile">
        <NuxtLink
          v-for="link in allLinks"
          :key="link.to"
          :to="link.to"
          class="mobile-link"
          @click="menuOpen = false"
        >
          <i :class="link.icon"></i>{{ link.label }}
        </NuxtLink>
        <button v-if="user" @click="handleSignOut" class="mobile-link mobile-signout">
          <i class="fas fa-sign-out-alt"></i>Sign Out
        </button>
      </nav>
    </Transition>
  </header>
</template>

<script setup>
const route = useRoute()
const isAuthPage = computed(() => route.path.startsWith('/auth'))

const links = [
  { to: '/products', label: 'Products' },
  { to: '/installation', label: 'Installation' },
  { to: '/yacht-list', label: 'Yacht List' },
  { to: '/about', label: 'About' }
]

const allLinks = [
  { to: '/products', label: 'Products', icon: 'fas fa-cogs' },
  { to: '/installation', label: 'Installation', icon: 'fas fa-wrench' },
  { to: '/yacht-list', label: 'Yacht List', icon: 'fas fa-ship' },
  { to: '/faq', label: 'FAQ', icon: 'fas fa-question-circle' },
  { to: '/testimonials', label: 'Testimonials', icon: 'fas fa-star' },
  { to: '/about', label: 'About', icon: 'fas fa-info-circle' },
  { to: '/contact', label: 'Contact', icon: 'fas fa-envelope' }
]

const menuOpen = ref(false)
const isScrolled = ref(false)

const onScroll = () => { isScrolled.value = window.scrollY > 12 }

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => window.removeEventListener('scroll', onScroll))

// Close menu when navigating
watch(() => route.path, () => { menuOpen.value = false })

// Authentication state
const user = useSupabaseUser()
const supabase = useSupabaseClient()

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
  max-width: 1200px;
  margin: 0 auto;
  height: var(--nav-height);
  padding: 0 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  text-decoration: none;
  flex-shrink: 0;
}

.brand-mark {
  height: 2.4rem;
  width: 2.4rem;
  object-fit: contain;
  background: #fff;
  border-radius: 10px;
  padding: 3px;
  filter: drop-shadow(0 0 12px rgba(56, 189, 248, 0.35));
}

.brand-name {
  display: flex;
  flex-direction: column;
  line-height: 1;
}

.brand-shaft {
  font-family: var(--font-brand);
  font-size: 1.45rem;
  color: var(--text-hi);
}

.brand-inc {
  font-family: var(--font-display);
  font-size: 0.58rem;
  font-weight: 600;
  letter-spacing: 0.46em;
  color: var(--accent);
  margin-top: 0.18rem;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.nav-link {
  font-family: var(--font-display);
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--text-mid);
  text-decoration: none;
  padding: 0.55rem 1rem;
  border-radius: 999px;
  transition: color 0.25s ease, background 0.25s ease;
  white-space: nowrap;
}

.nav-link:hover {
  color: var(--text-hi);
  background: rgba(148, 197, 255, 0.08);
}

.nav-link.router-link-active {
  color: var(--accent);
  background: rgba(56, 189, 248, 0.1);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  flex-shrink: 0;
}

.nav-cta {
  padding: 0.6rem 1.4rem;
  font-size: 0.92rem;
}

.signout-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(248, 113, 113, 0.1);
  border: 1px solid rgba(248, 113, 113, 0.4);
  color: #FCA5A5;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.85rem;
  padding: 0.55rem 1.1rem;
  border-radius: 999px;
  cursor: pointer;
  transition: background 0.25s ease, transform 0.25s ease;
}

.signout-button:hover {
  background: rgba(248, 113, 113, 0.2);
  transform: translateY(-1px);
}

.menu-toggle {
  display: none;
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

.mobile-menu {
  display: flex;
  flex-direction: column;
  padding: 0.75rem 1.25rem 1.25rem;
  border-top: 1px solid var(--line);
  max-height: calc(100vh - var(--nav-height));
  overflow-y: auto;
}

.mobile-link {
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
  cursor: pointer;
  text-align: left;
  transition: color 0.2s ease, background 0.2s ease;
}

.mobile-link i {
  width: 1.4rem;
  text-align: center;
  color: var(--accent);
}

.mobile-link:hover,
.mobile-link.router-link-active {
  color: var(--text-hi);
  background: rgba(56, 189, 248, 0.1);
}

.mobile-signout { color: #FCA5A5; }
.mobile-signout i { color: #FCA5A5; }

.drop-enter-active, .drop-leave-active { transition: opacity 0.25s ease, transform 0.25s ease; }
.drop-enter-from, .drop-leave-to { opacity: 0; transform: translateY(-8px); }

@media (max-width: 920px) {
  .nav-links { display: none; }
  .menu-toggle { display: flex; }
  .signout-button span { display: none; }
}

@media (max-width: 560px) {
  .nav-cta { display: none; }
  .nav-inner { padding: 0 1rem; }
}

@media (min-width: 921px) {
  .mobile-menu { display: none; }
}
</style>
