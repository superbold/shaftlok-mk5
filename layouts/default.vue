<template>
  <div class="site-frame">
    <MainNav />
    <main>
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
.site-frame {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main { flex: 1; }
</style>
