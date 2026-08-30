<template>
  <div class="auth-layout" data-layout="auth">
    <main class="auth-main">
      <div class="auth-container">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup>
useHead({
  bodyAttrs: {
    class: 'auth-page'
  }
})
</script>

<style scoped>
.auth-layout {
  min-height: 100vh;
  background:
    radial-gradient(900px 480px at 85% -10%, rgba(45, 212, 191, 0.12), transparent 60%),
    radial-gradient(1100px 600px at 8% 0%, rgba(56, 189, 248, 0.15), transparent 60%),
    var(--abyss);
  display: flex;
  flex-direction: column;
}

.auth-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.5rem;
}

.auth-container {
  width: 100%;
  max-width: 500px;
}

@media (max-width: 768px) {
  .auth-main {
    padding: 1.5rem 1rem;
  }

  .auth-container {
    max-width: 100%;
  }
}

@media (max-width: 480px) {
  .auth-main {
    padding: 1rem 0.75rem;
  }
}
</style>