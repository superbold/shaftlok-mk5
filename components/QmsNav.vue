<template>
  <header :class="{ 'menu-open': menuOpen }">
    <div class="nav-inner">
      <NuxtLink to="/" class="brand">
        <img src="/assets/images/Logo_propeller_only.png" alt="Shaft Lok propeller logo" class="brand-mark">
        <span class="brand-name"><span class="brand-shaft">Shaft Lok</span><span class="brand-inc">QUOTES</span></span>
      </NuxtLink>

      <div class="qms-nav-section">
        <div class="search-input-wrapper">
          <i class="fas fa-magnifying-glass search-glyph"></i>
          <input
            :value="props.searchTerm"
            @input="emit('update:searchTerm', $event.target.value)"
            type="text"
            :placeholder="`Search ${props.quoteCount || 0} quotes...`"
            class="search-input"
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

        <div v-if="isAdmin" class="admin-actions">
          <button @click="emit('add-quote')" class="admin-btn add-btn" title="Add Quote">
            <i class="fas fa-plus"></i>
            <span class="btn-text">Add</span>
          </button>
        </div>
      </div>

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

    <Transition name="drop">
      <nav v-if="menuOpen" class="mobile-menu" aria-label="Site">
        <NuxtLink to="/yacht-list" class="mobile-link" @click="menuOpen = false"><i class="fas fa-ship"></i> Yacht List</NuxtLink>
        <NuxtLink to="/products" class="mobile-link" @click="menuOpen = false"><i class="fas fa-cogs"></i> Products</NuxtLink>
        <button @click="emit('sign-out')" class="mobile-link mobile-signout">
          <i class="fas fa-sign-out-alt"></i> Sign Out
        </button>
      </nav>
    </Transition>
  </header>
</template>

<script setup>
const props = defineProps({
  searchTerm: {
    type: String,
    default: ''
  },
  quoteCount: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['update:searchTerm', 'clear-search', 'refresh-data', 'add-quote', 'sign-out'])

const menuOpen = ref(false)
const { isAdmin } = useIsAdmin()
</script>

<style scoped>
header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(4, 10, 24, 0.82);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border-bottom: 1px solid var(--line);
  box-shadow: 0 12px 40px -18px rgba(2, 8, 23, 0.9);
}

.nav-inner {
  max-width: 1280px;
  margin: 0 auto;
  height: var(--nav-height);
  padding: 0 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.25rem;
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
  letter-spacing: 0.34em;
  color: var(--accent);
  margin-top: 0.18rem;
}

.qms-nav-section {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  flex: 1;
  justify-content: center;
  min-width: 0;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: min(420px, 100%);
}

.search-glyph {
  position: absolute;
  left: 1rem;
  color: var(--text-low);
  font-size: 0.85rem;
  pointer-events: none;
}

.search-input {
  width: 100%;
  background: rgba(13, 27, 54, 0.65);
  border: 1px solid var(--line-strong);
  border-radius: 999px;
  color: var(--text-hi);
  font-family: var(--font-body);
  font-size: 0.95rem;
  padding: 0.62rem 2.8rem 0.62rem 2.5rem;
  outline: none;
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
}

.search-input::placeholder { color: var(--text-low); }

.search-input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.18);
}

.search-action-button {
  position: absolute;
  right: 0.45rem;
  background: rgba(56, 189, 248, 0.12);
  border: none;
  color: var(--accent);
  width: 1.9rem;
  height: 1.9rem;
  border-radius: 999px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  transition: background 0.25s ease;
}

.search-action-button:hover { background: rgba(56, 189, 248, 0.25); }

.admin-actions {
  display: flex;
  gap: 0.5rem;
}

.admin-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-family: var(--font-display);
  font-size: 0.82rem;
  font-weight: 600;
  border-radius: 999px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border: 1px solid transparent;
  transition: transform 0.2s ease, background 0.2s ease;
}

.admin-btn:hover { transform: translateY(-1px); }

.add-btn {
  background: rgba(45, 212, 191, 0.12);
  border-color: rgba(45, 212, 191, 0.4);
  color: #5EEAD4;
}

.add-btn:hover { background: rgba(45, 212, 191, 0.24); }

.menu-toggle {
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
  flex-shrink: 0;
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

@media (max-width: 760px) {
  .brand-name { display: none; }
  .admin-btn .btn-text { display: none; }
  .admin-btn { padding: 0.5rem 0.7rem; }
  .nav-inner { padding: 0 1rem; gap: 0.75rem; }
}
</style>
