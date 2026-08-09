<template>
  <div class="status-legend">
    <button
      type="button"
      class="legend-toggle"
      @click="open = !open"
      aria-label="What do these statuses mean?"
      title="What do these statuses mean?"
    >
      <i class="fas fa-circle-info"></i>
    </button>

    <Transition name="fade">
      <div v-if="open" class="legend-backdrop" @click="open = false">
        <div class="legend-panel glass-card" @click.stop>
          <h3>Quote Statuses</h3>
          <ul>
            <li v-for="item in QUOTE_STATUSES" :key="item.value">
              <span class="legend-badge" :class="`status-${item.value}`">{{ item.label }}</span>
              <span class="legend-desc">{{ item.description }}</span>
            </li>
          </ul>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
const open = ref(false)
</script>

<style scoped>
.status-legend {
  position: relative;
  display: inline-flex;
}

.legend-toggle {
  background: rgba(56, 189, 248, 0.1);
  border: 1px solid rgba(56, 189, 248, 0.3);
  color: var(--accent);
  width: 2rem;
  height: 2rem;
  border-radius: 999px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  transition: background-color 0.2s ease;
}

.legend-toggle:hover { background: rgba(56, 189, 248, 0.2); }

.legend-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1200;
}

.legend-panel {
  position: absolute;
  top: 2.6rem;
  right: 0;
  width: min(340px, 90vw);
  padding: 1.2rem 1.4rem;
  z-index: 1201;
}

.legend-panel h3 {
  margin: 0 0 0.9rem;
  font-family: var(--font-display);
  font-size: 0.95rem;
  color: var(--text-hi);
}

.legend-panel ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

.legend-panel li {
  display: flex;
  align-items: baseline;
  gap: 0.7rem;
}

.legend-badge {
  flex-shrink: 0;
  display: inline-block;
  padding: 0.25rem 0.7rem;
  border-radius: 999px;
  font-family: var(--font-display);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  white-space: nowrap;
}

.legend-desc {
  color: var(--text-mid);
  font-size: 0.85rem;
  line-height: 1.4;
}

.status-new { background: var(--status-new-bg); color: var(--status-new-fg); }
.status-quoted { background: var(--status-quoted-bg); color: var(--status-quoted-fg); }
.status-in_review { background: var(--status-in_review-bg); color: var(--status-in_review-fg); }
.status-finished { background: var(--status-finished-bg); color: var(--status-finished-fg); }
.status-sent { background: var(--status-sent-bg); color: var(--status-sent-fg); }
.status-won { background: var(--status-won-bg); color: var(--status-won-fg); }
.status-lost { background: var(--status-lost-bg); color: var(--status-lost-fg); }

.fade-enter-active, .fade-leave-active { transition: opacity 0.15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
