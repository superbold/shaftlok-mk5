<template>
  <ProductDetail :slug="slug" />
</template>

<script setup>
definePageMeta({
  layout: 'default'
})

const route = useRoute()
const slug = computed(() => String(route.params.slug))
</script>
