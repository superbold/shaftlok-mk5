<template>
  <nav class="breadcrumb" aria-label="Breadcrumb">
    <span class="breadcrumb-item">
      <NuxtLink to="/" class="breadcrumb-link"><i class="fas fa-house"></i><span class="sr-only">Home</span></NuxtLink>
    </span>
    <span v-for="(item, index) in items" :key="index" class="breadcrumb-item">
      <NuxtLink v-if="item.to" :to="item.to" class="breadcrumb-link">{{ item.name }}</NuxtLink>
      <span v-else class="breadcrumb-current" aria-current="page">{{ item.name }}</span>
    </span>
  </nav>
</template>

<script setup lang="ts">
interface BreadcrumbItem {
  name: string
  to?: string
}

defineProps<{
  items: BreadcrumbItem[]
}>()
</script>

<style scoped>
.breadcrumb {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.15rem;
  font-family: var(--font-display);
  font-size: 0.82rem;
  background: rgba(13, 27, 54, 0.6);
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 0.35rem 0.9rem;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  margin-bottom: 2rem;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
}

.breadcrumb-item:not(:last-child)::after {
  content: '/';
  color: var(--text-low);
  margin: 0 0.5rem;
  font-size: 0.75rem;
}

.breadcrumb-link {
  color: var(--text-mid);
  text-decoration: none;
  transition: color 0.2s ease;
}

.breadcrumb-link:hover { color: var(--accent); }

.breadcrumb-link i { font-size: 0.78rem; }

.breadcrumb-current {
  color: var(--accent);
  font-weight: 600;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
</style>
