<template>
  <div class="error-page">
    <!-- Ocean depth layers -->
    <div class="ocean-depth">
      <!-- Search beam effect that follows mouse -->
      <div class="search-beam" ref="searchBeam"></div>
      
      <!-- Floating particles for depth effect -->
      <div class="particles">
        <div class="particle" v-for="n in 20" :key="n" :style="getParticleStyle(n)"></div>
      </div>
      
      <!-- Error content positioned in bottom third -->
      <div class="error-content">
        <div class="error-message">
          <div class="error-logo">
            <div class="logo-text">
              <h2 class="company-name">Shaft Lok</h2>
              <p class="company-tagline">The only way to lock the prop!</p>
            </div>
          </div>
          <h1 class="error-title">
            <span class="error-code">{{ error?.statusCode || 'Error' }}</span>
            <span class="error-text">{{ getErrorMessage() }}</span>
          </h1>
          <p class="error-description">
            {{ getErrorDescription() }}
          </p>
          
          <div class="error-actions">
            <NuxtLink to="/" class="button button-primary">
              <i class="fas fa-home"></i>
              Return to Surface
            </NuxtLink>
            <button @click="refreshPage" class="button button-secondary">
              <i class="fas fa-redo"></i>
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Access the error object passed by Nuxt
const props = defineProps({
  error: Object
})

// Search beam ref and mouse tracking
const searchBeam = ref(null)
const mousePosition = ref({ x: 50, y: 50 }) // Start in center

// Calculate beam angle based on mouse position
const getBeamAngle = () => {
  const centerX = 50; // Center of viewport
  const mouseX = mousePosition.value.x
  const maxAngle = 30; // Maximum angle in degrees
  const angle = (mouseX - centerX) * (maxAngle / 50); // Scale to max angle
  return Math.max(-maxAngle, Math.min(maxAngle, -angle)) // Invert the angle
}

// Helper functions
const getErrorMessage = () => {
  if (props.error?.statusCode === 500) return 'Server Error'
  if (props.error?.statusCode === 404) return 'Page Not Found'
  if (props.error?.statusCode === 403) return 'Access Denied'
  return props.error?.statusMessage || 'Something went wrong'
}

const getErrorDescription = () => {
  if (props.error?.statusCode === 500) return 'The server encountered an unexpected condition.\nPlease try again later.'
  if (props.error?.statusCode === 404) return 'The page you\'re looking for has drifted away into the depths.\nUse the search beam above to navigate back to familiar waters.'
  if (props.error?.statusCode === 403) return 'You don\'t have permission to access this area.\nThe depths are restricted to authorized personnel only.'
  return 'An unexpected error occurred while navigating the waters.\nThe search beam will help guide you back to safety.'
}

// Set page meta
useHead({
  title: `${props.error?.statusCode || 'Error'} - ${getErrorMessage()} | Shaft Lok Marine`,
  meta: [
    { name: 'description', content: `${getErrorDescription()} Return to Shaft Lok marine propeller control systems and find what you need.` },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

const refreshPage = () => {
  window.location.reload()
}

// Mouse tracking for search beam
const updateMousePosition = (event) => {
  const rect = event.currentTarget.getBoundingClientRect()
  const x = ((event.clientX - rect.left) / rect.width) * 100
  const y = ((event.clientY - rect.top) / rect.height) * 100
  mousePosition.value = { x, y }
}

// Lifecycle hooks
onMounted(() => {
  try {
    const oceanDepth = document.querySelector('.ocean-depth')
    if (oceanDepth) {
      oceanDepth.addEventListener('mousemove', updateMousePosition)
    }
  } catch (error) {
    console.warn('Error setting up mouse tracking:', error)
  }
})

onUnmounted(() => {
  const oceanDepth = document.querySelector('.ocean-depth')
  if (oceanDepth) {
    oceanDepth.removeEventListener('mousemove', updateMousePosition)
  }
})

// Generate random particle positions
const getParticleStyle = (index) => {
  const size = Math.random() * 4 + 2
  const left = Math.random() * 100
  const animationDelay = Math.random() * 20
  const animationDuration = Math.random() * 10 + 15
  
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${left}%`,
    animationDelay: `${animationDelay}s`,
    animationDuration: `${animationDuration}s`
  }
}
</script>

<style scoped>
.error-page {
  min-height: 100vh;
  overflow: hidden;
  position: relative;
  background: linear-gradient(
    to bottom,
    #0088ee 0%,     /* Light blue at surface */
    #0077dd 10%,    /* Ocean blue */
    #0066cc 25%,    /* Deep blue */
    #0055aa 40%,    /* Deeper blue */
    #004488 55%,    /* Dark blue */
    #003366 70%,    /* Medium dark blue */
    #002244 85%,    /* Dark blue */
    #001122 100%    /* Very dark blue at bottom */
  );
}

.ocean-depth {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

/* Search beam effect - triangular shape with alpha mask */
.search-beam {
  position: absolute;
  top: -50vh; /* Apex above viewport */
  left: 50%;
  width: 5rem; /* Base width at bottom */
  height: calc(90vh + 75vh); /* Extended to reach from above - 1.5x original */
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.9) 0%,
    rgba(255, 255, 255, 0.8) 20%,
    rgba(240, 248, 255, 0.7) 40%,
    rgba(200, 230, 255, 0.6) 60%,
    rgba(150, 200, 255, 0.4) 80%,
    rgba(100, 170, 255, 0.2) 100%
  );
  filter: blur(1px);
  transition: transform 0.3s ease-out;
  z-index: 1;
  pointer-events: none;
  box-shadow: 
    0 0 20px rgba(255, 255, 255, 0.5),
    0 0 40px rgba(240, 248, 255, 0.3),
    0 0 60px rgba(200, 230, 255, 0.2);
  animation: searchBeamPulse 4s ease-in-out infinite;
  transform-origin: top center;
  transform: translateX(-50%) rotate(v-bind('getBeamAngle() + "deg"'));
  /* Triangle shape using clip-path */
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  /* Add alpha mask to soften edges */
  mask: 
    linear-gradient(
      to bottom,
      transparent 0%,
      transparent 20%,
      black 30%,
      black 70%,
      transparent 80%,
      transparent 100%
    ),
    linear-gradient(
      to right,
      transparent 0%,
      black 5%,
      black 95%,
      transparent 100%
    );
  -webkit-mask: 
    linear-gradient(
      to bottom,
      transparent 0%,
      transparent 20%,
      black 30%,
      black 70%,
      transparent 80%,
      transparent 100%
    ),
    linear-gradient(
      to right,
      transparent 0%,
      black 5%,
      black 95%,
      transparent 100%
    );
  mask-composite: intersect;
  -webkit-mask-composite: source-in;
}



@keyframes searchBeamPulse {
  0%, 100% {
    opacity: 0.7;
    transform: translateX(-50%) rotate(v-bind('getBeamAngle() + "deg"')) scaleX(1);
  }
  50% {
    opacity: 1;
    transform: translateX(-50%) rotate(v-bind('getBeamAngle() + "deg"')) scaleX(1.1);
  }
}

/* Floating particles */
.particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
}

.particle {
  position: absolute;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  animation: floatUp linear infinite;
}

@keyframes floatUp {
  0% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) rotate(360deg);
    opacity: 0;
  }
}

/* Error content positioned in bottom third */
.error-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  min-height: 40vh; /* Increased height to ensure visibility */
  display: flex;
  align-items: flex-end; /* Align to bottom of container */
  justify-content: center;
  z-index: 10;
  padding: 2rem;
  padding-bottom: 4rem; /* Extra padding at bottom */
}

.error-message {
  text-align: center;
  color: white;
  max-width: 600px;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.error-logo {
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo-text {
  text-align: center;
  margin-bottom: 0;
}

.company-name {
  font-family: 'DeVinneOrnamentDRegular', serif;
  font-size: 2.5rem;
  font-weight: normal;
  color: var(--light-cyan);
  margin: 0 0 0.5rem 0;
  text-shadow: 
    0 0 10px rgba(202, 240, 248, 0.5),
    0 0 20px rgba(202, 240, 248, 0.3),
    0 0 30px rgba(202, 240, 248, 0.2);
  letter-spacing: 0.1em;
}

.company-tagline {
  font-size: 1rem;
  color: var(--non-photo-blue);
  margin: 0;
  font-style: italic;
  opacity: 0.9;
  text-shadow: 0 0 8px rgba(144, 224, 239, 0.4);
  letter-spacing: 0.05em;
}

.error-title {
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 700;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.error-code {
  color: var(--light-cyan);
  text-shadow: 0 0 20px rgba(202, 240, 248, 0.5);
  font-family: 'DeVinneOrnamentDRegular', serif;
}

.error-text {
  color: var(--non-photo-blue);
  font-size: 0.7em;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.error-description {
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  opacity: 0.9;
  color: rgba(255, 255, 255, 0.9);
  white-space: pre-line; /* Allow line breaks from \n */
}

.error-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  cursor: pointer;
  font-size: 1rem;
}

.button-primary {
  background: linear-gradient(135deg, var(--light-cyan), var(--non-photo-blue));
  color: var(--federal-blue);
  border-color: var(--light-cyan);
  box-shadow: 0 4px 15px rgba(202, 240, 248, 0.3);
}

.button-primary:hover {
  background: linear-gradient(135deg, var(--non-photo-blue), var(--pacific-cyan));
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(202, 240, 248, 0.4);
}

.button-secondary {
  background: transparent;
  color: white;
  border-color: rgba(255, 255, 255, 0.5);
}

.button-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 255, 255, 0.2);
}

/* Responsive design */
@media (max-width: 768px) {
  .error-content {
    min-height: 50vh; /* Increased for mobile */
    padding: 1rem;
    padding-bottom: 2rem; /* Ensure bottom padding on mobile */
  }
  
  .error-message {
    padding: 1.5rem;
    margin-bottom: 1rem; /* Add margin to separate from bottom */
  }
  
  .error-actions {
    flex-direction: column;
    align-items: center;
    gap: 0.75rem; /* Reduce gap on mobile */
  }
  
  .button {
    width: 100%;
    max-width: 250px;
    justify-content: center;
  }
  
  .search-beam {
    width: 100px;
  }
}

@media (max-width: 480px) {
  .error-content {
    min-height: 55vh; /* Even more height on small screens */
    padding-bottom: 1.5rem;
  }
  
  .error-title {
    font-size: 2.5rem;
  }
  
  .error-description {
    font-size: 1rem;
  }
  
  .error-message {
    padding: 1rem;
  }
}
</style>
