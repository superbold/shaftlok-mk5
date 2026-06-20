<template>
  <div class="error-page">
    <div class="ocean-depth" ref="oceanDepth">
      <div class="search-beam" :style="beamStyle"></div>

      <div class="particles">
        <div class="particle" v-for="n in 20" :key="n" :style="particleStyles[n - 1]"></div>
      </div>

      <div class="error-content">
        <div class="error-card">

          <div class="error-brand">
            <img src="/assets/images/Logo_propeller_only.png" alt="Shaft Lok" class="brand-mark">
            <span class="brand-name">Shaft Lok</span>
          </div>

          <h1 class="error-title">
            <span class="error-code grad-text">{{ error?.statusCode || 'Error' }}</span>
            <span class="error-label">{{ errorMessage }}</span>
          </h1>

          <p class="error-description">{{ errorDescription }}</p>

          <div class="error-actions">
            <NuxtLink to="/" class="btn btn-primary">
              <i class="fas fa-home"></i> Return to Surface
            </NuxtLink>
            <NuxtLink to="/products" class="btn btn-ghost">
              <i class="fas fa-cogs"></i> View Products
            </NuxtLink>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ error: Object })

const errorMessage = computed(() => {
  if (props.error?.statusCode === 404) return 'Page Not Found'
  if (props.error?.statusCode === 403) return 'Access Denied'
  if (props.error?.statusCode === 500) return 'Server Error'
  return props.error?.statusMessage || 'Something went wrong'
})

const errorDescription = computed(() => {
  if (props.error?.statusCode === 404) return "The page you're looking for has drifted into the depths. Use the links below to navigate back to familiar waters."
  if (props.error?.statusCode === 403) return "You don't have permission to access this area. These depths are restricted to authorized personnel only."
  if (props.error?.statusCode === 500) return 'The server encountered an unexpected condition. Please try again later.'
  return 'An unexpected error occurred while navigating the waters. The links below will guide you back to safety.'
})

useHead({
  title: `${props.error?.statusCode || 'Error'} — ${errorMessage.value} | Shaft Lok`,
  meta: [{ name: 'robots', content: 'noindex, nofollow' }]
})

// Search beam — follows mouse
const mouseX = ref(50)
const oceanDepth = ref(null)

const beamAngle = computed(() => {
  const angle = (mouseX.value - 50) * (30 / 50)
  return Math.max(-30, Math.min(30, -angle))
})

const beamStyle = computed(() => ({
  transform: `translateX(-50%) rotate(${beamAngle.value}deg)`
}))

const onMouseMove = (e) => {
  const rect = oceanDepth.value?.getBoundingClientRect()
  if (!rect) return
  mouseX.value = ((e.clientX - rect.left) / rect.width) * 100
}

onMounted(() => oceanDepth.value?.addEventListener('mousemove', onMouseMove))
onUnmounted(() => oceanDepth.value?.removeEventListener('mousemove', onMouseMove))

// Stable particle styles — generated once on mount to avoid SSR/hydration mismatch
const particleStyles = ref([])
onMounted(() => {
  particleStyles.value = Array.from({ length: 20 }, () => ({
    width:  `${Math.random() * 4 + 2}px`,
    height: `${Math.random() * 4 + 2}px`,
    left:   `${Math.random() * 100}%`,
    animationDelay:    `${Math.random() * 20}s`,
    animationDuration: `${Math.random() * 10 + 15}s`
  }))
})
</script>

<style scoped>
.error-page {
  min-height: 100vh;
  overflow: hidden;
  background: linear-gradient(
    to bottom,
    #071428 0%,
    #050E1F 30%,
    #040A18 65%,
    #020710 100%
  );
}

.ocean-depth {
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
}

/* Search beam */
.search-beam {
  position: absolute;
  top: -50vh;
  left: 50%;
  width: 5rem;
  height: calc(90vh + 75vh);
  background: linear-gradient(
    to bottom,
    rgba(56, 189, 248, 0.85) 0%,
    rgba(56, 189, 248, 0.6) 25%,
    rgba(45, 212, 191, 0.4) 55%,
    rgba(56, 189, 248, 0.15) 80%,
    transparent 100%
  );
  filter: blur(2px);
  transition: transform 0.3s ease-out;
  z-index: 1;
  pointer-events: none;
  box-shadow:
    0 0 30px rgba(56, 189, 248, 0.3),
    0 0 60px rgba(56, 189, 248, 0.15);
  animation: beamPulse 4s ease-in-out infinite;
  transform-origin: top center;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  mask:
    linear-gradient(to bottom, transparent 0%, transparent 20%, black 30%, black 70%, transparent 80%, transparent 100%),
    linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%);
  -webkit-mask:
    linear-gradient(to bottom, transparent 0%, transparent 20%, black 30%, black 70%, transparent 80%, transparent 100%),
    linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%);
  mask-composite: intersect;
  -webkit-mask-composite: source-in;
}

@keyframes beamPulse {
  0%, 100% { opacity: 0.7; }
  50%       { opacity: 1; }
}

/* Particles */
.particles {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
}

.particle {
  position: absolute;
  background: rgba(56, 189, 248, 0.25);
  border-radius: 50%;
  animation: floatUp linear infinite;
}

@keyframes floatUp {
  0%   { transform: translateY(100vh); opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 1; }
  100% { transform: translateY(-100px); opacity: 0; }
}

/* Content */
.error-content {
  position: relative;
  z-index: 10;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.error-card {
  text-align: center;
  max-width: 560px;
  width: 100%;
  background: rgba(8, 18, 38, 0.82);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(56, 189, 248, 0.2);
  border-radius: 24px;
  padding: 2.8rem 2.4rem;
  box-shadow:
    0 8px 40px rgba(2, 8, 23, 0.6),
    0 0 0 1px rgba(56, 189, 248, 0.06) inset;
}

/* Brand */
.error-brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.brand-mark {
  height: 2.8rem;
  width: 2.8rem;
  object-fit: contain;
  background: #fff;
  border-radius: 10px;
  padding: 3px;
  filter: drop-shadow(0 0 12px rgba(56, 189, 248, 0.4));
}

.brand-name {
  font-family: var(--font-brand);
  font-size: 2rem;
  color: var(--text-hi);
}

/* Error title */
.error-title {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  margin: 0 0 1.2rem;
}

.error-code {
  font-family: var(--font-display);
  font-size: clamp(3.5rem, 10vw, 5.5rem);
  font-weight: 700;
  line-height: 1;
}

.grad-text {
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.error-label {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-mid);
}

.error-description {
  color: var(--text-mid);
  font-size: 0.97rem;
  line-height: 1.7;
  margin: 0 0 2rem;
}

/* Actions */
.error-actions {
  display: flex;
  gap: 0.9rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1.5rem;
  border-radius: 999px;
  font-family: var(--font-display);
  font-size: 0.95rem;
  font-weight: 600;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #38BDF8, #2DD4BF);
  color: #04121F;
  box-shadow: 0 4px 18px rgba(56, 189, 248, 0.35);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(56, 189, 248, 0.5);
}

.btn-ghost {
  background: rgba(56, 189, 248, 0.08);
  color: var(--accent, #38BDF8);
  border: 1px solid rgba(56, 189, 248, 0.3);
}

.btn-ghost:hover {
  background: rgba(56, 189, 248, 0.16);
  transform: translateY(-2px);
}

@media (max-width: 560px) {
  .error-card { padding: 2rem 1.4rem; }
  .error-actions { flex-direction: column; align-items: center; }
  .btn { width: 100%; max-width: 260px; justify-content: center; }
}
</style>
