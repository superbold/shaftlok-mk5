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
  background: linear-gradient(135deg, var(--light-cyan) 0%, white 50%, #f8fafc 100%);
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

.auth-footer {
  background: white;
  border-top: 1px solid #e2e8f0;
  padding: 1.5rem 0;
  margin-top: auto;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.footer-content p {
  color: #6b7280;
  margin: 0;
  font-size: 0.9rem;
}

.footer-links {
  display: flex;
  gap: 1.5rem;
}

.footer-links a {
  color: var(--federal-blue);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: color 0.3s ease;
}

.footer-links a:hover {
  color: var(--honolulu-blue);
}

@media (max-width: 768px) {
  
  .auth-main {
    padding: 1.5rem 1rem;
  }
  
  .auth-container {
    max-width: 100%;
  }
  
  .footer-content {
    flex-direction: column;
    text-align: center;
    padding: 0 1rem;
  }
  
  .footer-links {
    justify-content: center;
  }
  
}

@media (max-width: 480px) {
  .logo {
    height: 2rem;
  }
  
  .auth-main {
    padding: 1rem 0.75rem;
  }
  
  .footer-links {
    flex-wrap: wrap;
    gap: 1rem;
  }
}
</style>