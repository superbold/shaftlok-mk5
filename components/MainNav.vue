<template>
  <header v-if="!isAuthPage">
    <div class="header-container">
      <div class="header-content">
        <div class="logo-container">
          <NuxtLink to="/">
            <img 
              src="/assets/images/Logo_ShaftLok_whiteBG-landscape.png" 
              alt="Shaft Lok Logo" 
              loading="lazy"
              class="logo-desktop"
            >
            <img 
              src="/assets/images/Logo_propeller_only.png" 
              alt="Shaft Lok Logo" 
              loading="lazy"
              class="logo-mobile"
            >
          </NuxtLink>
        </div>
        <!-- Center navigation buttons - progressively shown based on screen size -->
        <nav class="nav-center">
          <NuxtLink to="/products" class="nav-link"><i class="fas fa-cogs"></i><span>Products</span></NuxtLink>
          <NuxtLink to="/installation" class="nav-link"><i class="fas fa-wrench"></i><span>Installation</span></NuxtLink>
          <NuxtLink to="/yacht-list" class="nav-link"><i class="fas fa-ship"></i><span>Yacht List</span></NuxtLink>
          <NuxtLink to="/contact" class="nav-link"><i class="fas fa-envelope"></i><span>Contact</span></NuxtLink>
        </nav>
        
        <!-- Auth section - only shown on largest screens -->
        <div class="auth-section">
          <button v-if="user" @click="handleSignOut" class="signin-button signout-button">
            <i class="fas fa-sign-out-alt"></i>
            <span>Sign Out</span>
          </button>
        </div>

        <div class="hamburger-menu">
          <input type="checkbox" id="hamburger-toggle" class="hamburger-checkbox">
          <label for="hamburger-toggle" class="hamburger-label">
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
          </label>
          <div class="hamburger-dropdown">
            <NuxtLink to="/products" class="dropdown-link"><i class="fas fa-cogs"></i> Products</NuxtLink>
            <NuxtLink to="/installation" class="dropdown-link"><i class="fas fa-wrench"></i> Installation</NuxtLink>
            <NuxtLink to="/yacht-list" class="dropdown-link"><i class="fas fa-ship"></i> Yacht List</NuxtLink>
            <NuxtLink to="/faq" class="dropdown-link"><i class="fas fa-question-circle"></i> FAQ</NuxtLink>
            <NuxtLink to="/testimonials" class="dropdown-link"><i class="fas fa-star"></i> Testimonials</NuxtLink>
            <NuxtLink to="/about" class="dropdown-link"><i class="fas fa-info-circle"></i> About</NuxtLink>
            <NuxtLink to="/contact" class="dropdown-link"><i class="fas fa-envelope"></i> Contact</NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
// Hide MainNav on auth pages
const route = useRoute()
const isAuthPage = computed(() => route.path.startsWith('/auth'))

// Authentication state
const user = useSupabaseUser()
const supabase = useSupabaseClient()

// Handle sign out
const handleSignOut = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    
    // Redirect to home page after sign out
    await navigateTo('/')
  } catch (error) {
    console.error('Error signing out:', error)
    alert('Error signing out: ' + error.message)
  }
}


// MainNav: General site navigation component
</script>

<style scoped>
header {
  background-color: white;
  border: 2px solid var(--federal-blue);
  border-radius: 50px;
  position: fixed;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  width: 90%;
  max-width: 1200px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.header-container {
  padding: 0.75rem 1.5rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 2.5rem;
  position: relative;
}

.logo-container {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.logo-desktop {
  height: 2.5rem;
  width: auto;
  vertical-align: middle;
}

.logo-mobile {
  display: none;
  height: 2.5rem;
  width: auto;
  vertical-align: middle;
}

/* Center navigation - progressively shown based on screen size */
.nav-center {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  justify-content: center;
}

/* Auth section - only shown on largest screens */
.auth-section {
  display: none;
  align-items: center;
  flex-shrink: 0;
}

/* Mobile styles - logo + hamburger only */
@media (max-width: 599px) {
  .header-container {
    padding: 0.75rem 1rem;
  }

  .nav-center {
    display: none;
  }

  .auth-section {
    display: none;
  }

  .logo-desktop {
    display: block;
    height: 2rem;
  }

  .logo-mobile {
    display: none;
  }
}

/* Small screens - logo + Products + hamburger */
@media (min-width: 600px) and (max-width: 799px) {
  .nav-center .nav-link:nth-child(1) {
    display: flex;
  }
  .nav-center .nav-link:nth-child(2),
  .nav-center .nav-link:nth-child(3),
  .nav-center .nav-link:nth-child(4) {
    display: none;
  }

  .auth-section {
    display: none;
  }
}

/* Medium screens - logo + Products + Yacht List + hamburger */
@media (min-width: 800px) and (max-width: 999px) {
  .nav-center .nav-link:nth-child(1),
  .nav-center .nav-link:nth-child(3) {
    display: flex;
  }
  .nav-center .nav-link:nth-child(2),
  .nav-center .nav-link:nth-child(4) {
    display: none;
  }

  .auth-section {
    display: none;
  }
}

/* Large screens - logo + Products + Installation + Yacht List + hamburger */
@media (min-width: 1000px) and (max-width: 1199px) {
  .nav-center .nav-link:nth-child(1),
  .nav-center .nav-link:nth-child(2),
  .nav-center .nav-link:nth-child(3) {
    display: flex;
  }
  .nav-center .nav-link:nth-child(4) {
    display: none;
  }

  .auth-section {
    display: none;
  }
}

/* Extra large screens - show all navigation + auth */
@media (min-width: 1200px) {
  .nav-center .nav-link {
    display: flex;
  }

  .nav-center {
    gap: 2rem;
  }

  .auth-section {
    display: flex;
  }
}

.nav-link {
  color: var(--federal-blue);
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
}

.nav-link i {
  font-size: 1.2rem;
  min-width: 1.2rem;
  text-align: center;
}

.nav-link span {
  transition: all 0.3s ease;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: white;
  background-color: var(--federal-blue);
  border-radius: 50px;
}


.auth-section {
  display: flex;
  align-items: center;
  margin-left: 1rem;
}

.signin-button {
  background: linear-gradient(135deg, var(--federal-blue), var(--honolulu-blue));
  color: white;
  border: none;
  font-weight: 500;
  transition: all 0.3s ease;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  white-space: nowrap;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.signin-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(31, 81, 147, 0.3);
}

.signin-button i {
  font-size: 1rem;
}

.signout-button {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
}

.signout-button:hover {
  background: linear-gradient(135deg, #b91c1c, #991b1b);
  box-shadow: 0 4px 8px rgba(220, 38, 38, 0.3);
}

/* Hamburger menu - always visible */
.hamburger-menu {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.hamburger-checkbox {
  display: none;
}

.hamburger-label {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 45px;
  cursor: pointer;
  border-radius: 50px;
  transition: all 0.3s ease;
}

.hamburger-label:hover {
  background-color: var(--federal-blue);
}

.hamburger-line {
  width: 20px;
  height: 3px;
  background-color: var(--federal-blue);
  border-radius: 2px;
  transition: all 0.3s ease;
  margin: 2px 0;
}

.hamburger-label:hover .hamburger-line {
  background-color: white;
}

.hamburger-checkbox:checked ~ .hamburger-label .hamburger-line:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.hamburger-checkbox:checked ~ .hamburger-label .hamburger-line:nth-child(2) {
  opacity: 0;
}

.hamburger-checkbox:checked ~ .hamburger-label .hamburger-line:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
}

.hamburger-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border: 2px solid var(--federal-blue);
  border-radius: 15px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  z-index: 1000;
  margin-top: 10px;
  max-height: 80vh;
  overflow-y: auto;
}

.hamburger-checkbox:checked ~ .hamburger-dropdown {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 12px 20px;
  color: var(--federal-blue);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  border-bottom: 1px solid #f0f0f0;
}

.dropdown-link:last-child {
  border-bottom: none;
}

.dropdown-link:hover,
.dropdown-link.router-link-active {
  background-color: var(--federal-blue);
  color: white;
}

.dropdown-link i {
  margin-right: 10px;
  width: 16px;
}

.dropdown-link:first-child {
  border-top-left-radius: 13px;
  border-top-right-radius: 13px;
}

.dropdown-link:last-child {
  border-bottom-left-radius: 13px;
  border-bottom-right-radius: 13px;
}


/* Mobile specific adjustments */
@media (max-width: 599px) {
  header {
    top: 0.5rem;
    left: 50%;
    transform: translateX(-50%);
    width: 95%;
  }

  .hamburger-dropdown {
    right: -10px;
    left: auto;
    min-width: 180px;
  }
}

@media (max-width: 480px) {
  .hamburger-dropdown {
    right: -20px;
    left: auto;
    min-width: 160px;
  }
}
</style>