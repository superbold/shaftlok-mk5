<template>
  <header :class="{ 'menu-open': menuOpen }">
    <div class="nav-inner">
      <NuxtLink to="/" class="brand" title="Public website">
        <img src="/assets/images/Logo_propeller_only.png" alt="Shaft Lok propeller logo" class="brand-mark">
        <span class="brand-name">
          <span class="brand-shaft">Shaft Lok</span>
          <span class="brand-inc">LIBRARY</span>
        </span>
      </NuxtLink>

      <div class="library-nav-section">
        <p class="doc-count">{{ props.documentCount }} {{ props.documentCount === 1 ? 'document' : 'documents' }}</p>
        <div class="admin-actions">
          <button type="button" class="admin-btn refresh-btn" title="Refresh" @click="emit('refresh')">
            <i class="fas fa-sync-alt"></i>
          </button>
          <button type="button" class="admin-btn add-btn" title="Upload document" @click="emit('upload')">
            <i class="fas fa-upload"></i>
            <span class="btn-text">Upload</span>
          </button>
        </div>
      </div>

      <button
        class="menu-toggle admin-ring"
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
      <nav v-if="menuOpen" class="mobile-menu" aria-label="Admin">
        <NuxtLink to="/qms" class="mobile-link" @click="menuOpen = false">
          <i class="fas fa-file-invoice-dollar"></i> Quote Management
        </NuxtLink>
        <NuxtLink to="/products/manage" class="mobile-link" @click="menuOpen = false">
          <i class="fas fa-cogs"></i> Product Management
        </NuxtLink>
        <NuxtLink to="/yacht-list" class="mobile-link" @click="menuOpen = false">
          <i class="fas fa-ship"></i> Yacht List
        </NuxtLink>
        <button type="button" class="mobile-link mobile-signout" @click="emit('sign-out')">
          <i class="fas fa-sign-out-alt"></i> Sign Out
        </button>
      </nav>
    </Transition>
  </header>
</template>

<script setup>
const props = defineProps({
  documentCount: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['upload', 'refresh', 'sign-out'])
const menuOpen = ref(false)
</script>

<style scoped>
header {
  position: sticky;
  top: 0;
  z-index: 40;
  background: rgba(4, 10, 24, 0.92);
  border-bottom: 1px solid rgba(56, 189, 248, 0.15);
  backdrop-filter: blur(12px);
}

.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  max-width: 1100px;
  margin: 0 auto;
  padding: 0.75rem 1.25rem;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  text-decoration: none;
  color: var(--text-hi);
}

.brand-mark {
  width: 2rem;
  height: 2rem;
  object-fit: contain;
}

.brand-name {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.brand-shaft {
  font-family: var(--font-display);
  font-size: 0.95rem;
  font-weight: 700;
}

.brand-inc {
  font-family: var(--font-display);
  font-size: 0.68rem;
  letter-spacing: 0.12em;
  color: var(--accent);
}

.library-nav-section {
  display: none;
  align-items: center;
  gap: 1rem;
}

.doc-count {
  margin: 0;
  font-size: 0.85rem;
  color: var(--text-mid);
}

.admin-actions {
  display: flex;
  gap: 0.5rem;
}

.admin-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.85rem;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(56, 189, 248, 0.25);
  background: rgba(13, 27, 54, 0.8);
  color: var(--text-hi);
  cursor: pointer;
  font-family: var(--font-display);
  font-size: 0.82rem;
  font-weight: 600;
}

.admin-btn.add-btn {
  background: rgba(56, 189, 248, 0.15);
  border-color: rgba(56, 189, 248, 0.4);
  color: var(--accent);
}

.admin-btn:hover {
  border-color: var(--accent);
}

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

.menu-toggle.admin-ring {
  border-color: rgba(248, 113, 113, 0.55);
}

.menu-toggle.admin-ring:hover { border-color: #F87171; }

.menu-toggle.admin-ring .bar { background: #FCA5A5; }

.menu-toggle .bar {
  display: block;
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
  padding: 0.5rem 1.25rem 1rem;
  border-top: 1px solid rgba(56, 189, 248, 0.12);
}

.mobile-link {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.75rem 0.25rem;
  color: var(--text-mid);
  text-decoration: none;
  background: none;
  border: none;
  font: inherit;
  cursor: pointer;
  text-align: left;
}

.mobile-link:hover,
.mobile-signout:hover {
  color: var(--text-hi);
}

.drop-enter-active,
.drop-leave-active {
  transition: opacity 0.15s ease;
}

.drop-enter-from,
.drop-leave-to {
  opacity: 0;
}

@media (min-width: 768px) {
  .library-nav-section {
    display: flex;
  }
}
</style>
