<template>
  <div class="breadcrumb-container" aria-label="Breadcrumb">
    <nav class="breadcrumb">
      <span class="breadcrumb-item">
        <NuxtLink to="/" class="breadcrumb-link">Home</NuxtLink>
      </span>
      <span v-for="(item, index) in items" :key="index" class="breadcrumb-item">
        <NuxtLink v-if="item.to" :to="item.to" class="breadcrumb-link">{{ item.name }}</NuxtLink>
        <span v-else class="breadcrumb-current">{{ item.name }}</span>
      </span>
    </nav>
  </div>
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
.breadcrumb-container {
  background-color: var(--federal-blue);
  border-radius: 25px;
  padding: 0.5rem 1rem;
  position: fixed;
  top: 5rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999;
  width: fit-content;
  max-width: 90%;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.breadcrumb {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.25rem;
  font-size: 0.85em;
  color: var(--light-cyan);
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  gap: 0.25em;
}

.breadcrumb-item:not(:last-child)::after {
  content: '›';
  color: var(--light-cyan);
  font-weight: bold;
  margin-left: 0.25em;
  font-size: 1.1em;
}

.breadcrumb-link {
  color: var(--light-cyan);
  text-decoration: none;
  transition: all 0.3s ease;
  padding: 0.25em 0.5em;
  border-radius: 15px;
  opacity: 0.8;
}

.breadcrumb-link:hover {
  color: white;
  background-color: rgba(255, 255, 255, 0.2);
  opacity: 1;
}

.breadcrumb-current {
  color: white;
  font-weight: 600;
  padding: 0.25em 0.5em;
  border-radius: 15px;
  background-color: var(--honolulu-blue);
}

/* Mobile Responsive Breadcrumbs */
@media (max-width: 768px) {
  .breadcrumb-container {
    top: 4.5rem;
    padding: 0.4rem 0.8rem;
  }
  
  .breadcrumb {
    font-size: 0.75rem;
    gap: 0.2em;
  }
  
  .breadcrumb-item:not(:last-child)::after {
    margin-left: 0.2em;
  }
}
</style>