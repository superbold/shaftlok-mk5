<template>
  <div class="signin-page">
    <!-- Admin Login Header -->
    <div class="signin-hero">
      <Transition name="fade" mode="out-in">
        <div class="hero-content" :key="showForgotPassword ? 'forgot' : 'signin'">
          <template v-if="showForgotPassword">
            <h1>Reset Password</h1>
            <p>Enter your email and we'll send a link to reset your password.</p>
          </template>
          <template v-else>
            <h1>Admin Access</h1>
            <p>Restricted access for authorized personnel only.</p>
          </template>
        </div>
      </Transition>
    </div>

    <!-- Sign In / Forgot Password Form -->
    <div class="signin-form-container">
      <div class="form-card">
        <Transition
          name="collapse"
          @enter="onCollapseEnter"
          @after-enter="onCollapseAfterEnter"
          @leave="onCollapseLeave"
        >
          <div v-if="!showForgotPassword" key="signin">
            <div class="form-header">
              <h2>Sign In</h2>
              <p>Enter your credentials to continue</p>
            </div>

            <form @submit.prevent="handleSignIn" class="signin-form">
              <div class="form-group">
                <label for="email">Email</label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  required
                  class="form-control"
                  placeholder="Enter your email"
                  :disabled="loading"
                >
              </div>

              <div class="form-group">
                <label for="password">Password</label>
                <input
                  id="password"
                  v-model="form.password"
                  type="password"
                  required
                  class="form-control"
                  placeholder="Enter your password"
                  :disabled="loading"
                >
              </div>

              <div class="form-actions">
                <button type="submit" class="btn btn-primary" :disabled="loading">
                  <i class="fas fa-spinner fa-spin" v-if="loading"></i>
                  {{ loading ? 'Signing In...' : 'Sign In' }}
                </button>
              </div>
            </form>
          </div>

          <div v-else key="forgot">
            <div class="form-header">
              <h2>Reset Your Password</h2>
              <p>Enter your email address below</p>
            </div>

            <form @submit.prevent="handleForgotPassword" class="signin-form">
              <div class="form-group">
                <label for="reset-email">Email</label>
                <input
                  id="reset-email"
                  v-model="form.email"
                  type="email"
                  required
                  class="form-control"
                  placeholder="Enter your email"
                  :disabled="resetEmailSending"
                >
              </div>

              <div class="form-actions">
                <button type="submit" class="btn btn-primary" :disabled="resetEmailSending">
                  <i class="fas fa-spinner fa-spin" v-if="resetEmailSending"></i>
                  {{ resetEmailSending ? 'Sending...' : 'Send Reset Link' }}
                </button>
              </div>
            </form>
          </div>
        </Transition>

        <div class="forgot-password">
          <button
            type="button"
            class="link-button"
            :disabled="loading || resetEmailSending"
            @click="toggleForgotPassword"
          >
            {{ showForgotPassword ? 'Back to Sign In' : 'Forgot password?' }}
          </button>
        </div>

        <div v-if="resetMessage" class="success-message">
          <i class="fas fa-check-circle"></i>
          {{ resetMessage }}
        </div>

        <div v-if="error" class="error-message">
          <i class="fas fa-exclamation-triangle"></i>
          {{ error }}
        </div>

        <div class="form-footer">
          <p>For authorized personnel only</p>
          <p class="help-text">Contact your system administrator for access</p>
          <NuxtLink to="/" class="logo-button">
            <img
              src="/assets/images/Logo_ShaftLok_whiteBG-landscape.png"
              alt="Shaft Lok Logo - Return to Site"
              loading="lazy"
              class="footer-logo"
            >
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Admin Dashboard Selection Modal -->
    <div v-if="showAdminModal" class="modal-overlay" @click="showAdminModal = false">
      <div class="admin-modal" @click.stop>
        <div class="admin-modal-header">
          <h3>Welcome, Admin!</h3>
          <p>Which area would you like to manage today?</p>
        </div>

        <div class="admin-modal-body">
          <div class="radio-group">
            <label class="radio-option">
              <input
                type="radio"
                v-model="adminChoice"
                value="yacht-list"
                name="admin-choice"
              >
              <span class="radio-custom"></span>
              <div class="option-content">
                <i class="fas fa-ship"></i>
                <span>Yacht List Management</span>
              </div>
            </label>

            <label class="radio-option disabled">
              <input
                type="radio"
                v-model="adminChoice"
                value="products"
                name="admin-choice"
                disabled
              >
              <span class="radio-custom"></span>
              <div class="option-content">
                <i class="fas fa-cogs"></i>
                <span>Products Management</span>
                <small>(Coming Soon)</small>
              </div>
            </label>
          </div>
        </div>

        <div class="admin-modal-footer">
          <button @click="showAdminModal = false" class="btn btn-secondary">
            Cancel
          </button>
          <button @click="proceedToAdminArea" class="btn btn-primary">
            Continue
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'auth-layout'
})

const supabase = useSupabaseClient()
const router = useRouter()

const loading = ref(false)
const resetEmailSending = ref(false)
const error = ref('')
const resetMessage = ref('')
const showForgotPassword = ref(false)
const form = ref({
  email: '',
  password: ''
})

const toggleForgotPassword = () => {
  showForgotPassword.value = !showForgotPassword.value
  error.value = ''
  resetMessage.value = ''
}

const onCollapseEnter = (el) => {
  el.style.height = '0px'
  el.style.opacity = '0'
  void el.offsetHeight
  el.style.height = `${el.scrollHeight}px`
  el.style.opacity = '1'
}

const onCollapseAfterEnter = (el) => {
  el.style.height = 'auto'
}

const onCollapseLeave = (el) => {
  el.style.height = `${el.scrollHeight}px`
  el.style.opacity = '1'
  void el.offsetHeight
  el.style.height = '0px'
  el.style.opacity = '0'
}

const handleForgotPassword = async () => {
  try {
    resetEmailSending.value = true
    error.value = ''
    resetMessage.value = ''

    if (!form.value.email) {
      error.value = 'Enter your email address.'
      return
    }

    const redirectTo = `${window.location.origin}/reset-password`
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(form.value.email, {
      redirectTo
    })

    if (resetError) {
      throw resetError
    }

    resetMessage.value = 'Password reset email sent. Check your inbox and follow the link.'
  } catch (err) {
    console.error('Password reset email error:', err)
    error.value = err.message || 'Failed to send reset email. Please try again.'
  } finally {
    resetEmailSending.value = false
  }
}

const showAdminModal = ref(false)
const adminChoice = ref('yacht-list')

const handleSignIn = async () => {
  try {
    loading.value = true
    error.value = ''

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: form.value.email,
      password: form.value.password,
    })

    if (signInError) {
      throw signInError
    }

    // Check if user has admin role
    await checkAdminRoleAndRedirect(data.user)
  } catch (err) {
    console.error('Sign in error:', err)
    error.value = err.message || 'Failed to sign in. Please try again.'
  } finally {
    loading.value = false
  }
}

const checkAdminRoleAndRedirect = async (user) => {
  try {
    // Check if user has admin role in profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || !profile || profile.role !== 'admin') {
      error.value = 'Access denied. Administrative privileges required.'
      await supabase.auth.signOut()
      return
    }

    // User is admin, show dashboard selection
    showAdminModal.value = true
  } catch (error) {
    console.error('Error checking admin role:', error)
    error.value = 'Access verification failed. Please try again.'
    await supabase.auth.signOut()
  }
}

const proceedToAdminArea = () => {
  showAdminModal.value = false
  if (adminChoice.value === 'yacht-list') {
    router.push('/yacht-list')
  } else {
    // Products page not implemented yet
    alert('Products management is coming soon!')
    router.push('/adminaccess')
  }
}

useHead({
  title: 'Admin Access - Shaft Lok',
  meta: [
    { name: 'description', content: 'Administrative access for Shaft Lok authorized personnel only.' },
    { name: 'robots', content: 'noindex, nofollow' },
    { property: 'og:title', content: 'Admin Access - Shaft Lok' }
  ]
})
</script>

<style scoped>
.signin-page {
  width: 100%;
}

.signin-hero {
  text-align: center;
  padding: 0 1rem 2rem;
}

.hero-content h1 {
  font-family: var(--font-display);
  font-size: clamp(2rem, 5vw, 2.75rem);
  font-weight: 700;
  margin: 0 0 0.6rem;
  background: var(--grad-text);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

.hero-content p {
  font-size: 1rem;
  color: var(--text-mid);
  margin: 0;
}

.signin-form-container {
  width: 100%;
}

.form-card {
  background: var(--glass);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  box-shadow: var(--shadow-card);
  padding: 2rem;
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;
}

.form-header h2 {
  font-family: var(--font-display);
  color: var(--text-hi);
  font-size: 1.6rem;
  font-weight: 600;
  margin: 0 0 0.4rem;
}

.form-header p {
  color: var(--text-mid);
  margin: 0;
  font-size: 0.95rem;
}

.signin-form {
  width: 100%;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-family: var(--font-display);
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--text-mid);
}

.form-control {
  width: 100%;
  padding: 0.875rem;
  background: rgba(13, 27, 54, 0.65);
  border: 1px solid var(--line-strong);
  border-radius: var(--radius-sm);
  color: var(--text-hi);
  font-family: var(--font-body);
  font-size: 1rem;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form-control::placeholder {
  color: var(--text-low);
}

.form-control:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.18);
}

.form-control:disabled {
  background: rgba(13, 27, 54, 0.35);
  color: var(--text-low);
  cursor: not-allowed;
}

.form-actions {
  margin: 2rem 0 1rem 0;
}

.btn {
  width: 100%;
  padding: 1rem;
  border: 1px solid transparent;
  border-radius: 999px;
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  text-decoration: none;
}

.btn-primary {
  background: var(--grad-accent);
  color: #04121F;
  box-shadow: 0 8px 24px -8px rgba(56, 189, 248, 0.55);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px -8px rgba(56, 189, 248, 0.7);
}

.btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  transform: none !important;
}

.forgot-password {
  text-align: center;
  margin-top: 0.75rem;
}

.link-button {
  background: none;
  border: none;
  color: var(--accent);
  cursor: pointer;
  font-family: var(--font-display);
  font-size: 0.92rem;
  font-weight: 500;
  padding: 0;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: color 0.2s ease;
}

.link-button:hover:not(:disabled) {
  color: var(--accent-2);
  text-decoration: underline;
}

.link-button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.error-message {
  background: rgba(248, 113, 113, 0.1);
  border: 1px solid rgba(248, 113, 113, 0.35);
  color: #FCA5A5;
  padding: 1rem;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-top: 1rem;
  font-size: 0.9rem;
}

.success-message {
  background: rgba(45, 212, 191, 0.1);
  border: 1px solid rgba(45, 212, 191, 0.35);
  color: #5EEAD4;
  padding: 1rem;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-top: 1rem;
  font-size: 0.9rem;
}

.form-footer {
  text-align: center;
  padding-top: 1.5rem;
  border-top: 1px solid var(--line);
  margin-top: 1.5rem;
}

.form-footer p {
  color: var(--text-mid);
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
}

.help-text {
  color: var(--text-low);
  font-size: 0.85rem;
  margin: 0.25rem 0 1rem 0;
}

.logo-button {
  display: inline-block;
  margin-top: 1rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.logo-button:hover {
  transform: translateY(-2px);
}

.footer-logo {
  height: 3.1rem;
  width: auto;
  border-radius: 8px;
  box-shadow: 0 4px 16px -6px rgba(56, 189, 248, 0.35);
  transition: box-shadow 0.3s ease;
}

.logo-button:hover .footer-logo {
  box-shadow: 0 6px 22px -6px rgba(56, 189, 248, 0.55);
}

.collapse-enter-active,
.collapse-leave-active {
  transition: height 0.35s ease, opacity 0.25s ease;
  overflow: hidden;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .signin-hero {
    padding: 0 0.5rem 1.5rem;
  }

  .form-card {
    padding: 1.5rem;
  }

  .form-header h2 {
    font-size: 1.4rem;
  }
}

@media (max-width: 480px) {
  .hero-content p {
    font-size: 0.95rem;
  }

  .form-card {
    padding: 1.25rem;
    border-radius: var(--radius-md);
  }
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(2, 8, 23, 0.72);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1rem;
}

.admin-modal {
  background: var(--abyss-soft);
  border: 1px solid var(--line-strong);
  border-radius: var(--radius-lg);
  max-width: 500px;
  width: 92%;
  box-shadow: var(--shadow-card), var(--glow-accent);
  color: var(--text-hi);
}

.admin-modal-header {
  text-align: center;
  padding: 1.8rem 2rem 1.2rem;
  border-bottom: 1px solid var(--line);
  background: rgba(13, 27, 54, 0.7);
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
}

.admin-modal-header h3 {
  margin: 0 0 0.4rem 0;
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--text-hi);
}

.admin-modal-header p {
  margin: 0;
  color: var(--text-mid);
  font-size: 0.95rem;
}

.admin-modal-body {
  padding: 2rem;
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.radio-option {
  display: flex;
  align-items: center;
  padding: 1rem 1.2rem;
  border: 1px solid var(--line-strong);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.25s ease;
  position: relative;
  background: rgba(13, 27, 54, 0.4);
}

.radio-option:not(.disabled):hover {
  border-color: var(--accent);
  background: rgba(56, 189, 248, 0.08);
}

.radio-option.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.radio-option input[type="radio"] {
  opacity: 0;
  position: absolute;
}

.radio-custom {
  width: 20px;
  height: 20px;
  border: 2px solid var(--line-strong);
  border-radius: 50%;
  margin-right: 1rem;
  position: relative;
  flex-shrink: 0;
  transition: border-color 0.25s ease;
}

.radio-option input:checked + .radio-custom {
  border-color: var(--accent);
}

.radio-option input:checked + .radio-custom::after {
  content: '';
  width: 10px;
  height: 10px;
  background: var(--grad-accent);
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.option-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.option-content i {
  font-size: 1.4rem;
  color: var(--accent);
  width: 2rem;
  text-align: center;
}

.option-content span {
  font-family: var(--font-display);
  font-weight: 500;
  color: var(--text-hi);
}

.option-content small {
  color: var(--text-low);
  font-style: italic;
  margin-left: 0.5rem;
}

.admin-modal-footer {
  display: flex;
  gap: 1rem;
  padding: 1.5rem 2rem 2rem 2rem;
  justify-content: flex-end;
  border-top: 1px solid var(--line);
}

.btn-secondary {
  background: rgba(148, 197, 255, 0.07);
  border-color: var(--line-strong);
  color: var(--text-mid);
}

.btn-secondary:hover {
  background: rgba(148, 197, 255, 0.14);
  color: var(--text-hi);
  transform: translateY(-1px);
  box-shadow: none;
}

@media (max-width: 768px) {
  .admin-modal {
    margin: 1rem;
  }

  .admin-modal-header {
    padding: 1.4rem 1.5rem 1rem;
  }

  .admin-modal-body {
    padding: 1.5rem;
  }

  .admin-modal-footer {
    padding: 1rem 1.5rem 1.5rem;
  }
}
</style>
