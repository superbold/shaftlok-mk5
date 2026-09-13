<template>
  <nav class="breadcrumb" :class="{ 'is-admin': admin }" aria-label="Breadcrumb">
    <span class="breadcrumb-item">
      <NuxtLink
        :to="admin ? '/adminaccess' : '/'"
        class="breadcrumb-link"
        :title="admin ? 'Admin Access' : 'Home'"
      >
        <i class="fas fa-house"></i>
        <span class="sr-only">{{ admin ? 'Admin Access' : 'Home' }}</span>
      </NuxtLink>
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

withDefaults(defineProps<{
  items: BreadcrumbItem[]
  admin?: boolean
}>(), {
  admin: false
})
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

.breadcrumb.is-admin {
  background: rgba(60, 18, 24, 0.55);
  border-color: rgba(248, 113, 113, 0.4);
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

.breadcrumb.is-admin .breadcrumb-link { color: #FCA5A5; }
.breadcrumb.is-admin .breadcrumb-link:hover { color: #F87171; }

.breadcrumb-link i { font-size: 0.78rem; }

.breadcrumb-current {
  color: var(--accent);
  font-weight: 600;
}

.breadcrumb.is-admin .breadcrumb-current { color: #FCA5A5; }

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
