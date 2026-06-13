<template>
  <div class="signin-page">
    <div class="signin-hero">
      <div class="hero-content">
        <h1>Reset Password</h1>
        <p>Set a new password for your admin account.</p>
      </div>
    </div>

    <div class="signin-form-container">
      <div class="form-card">
        <div v-if="initializing" class="status-message">
          <i class="fas fa-spinner fa-spin"></i>
          Verifying your reset link...
        </div>

        <template v-else-if="sessionReady">
          <div class="form-header">
            <h2>New Password</h2>
            <p>Choose a strong password for your account.</p>
          </div>

          <form @submit.prevent="handleResetPassword" class="signin-form">
            <div class="form-group">
              <label for="password">New password</label>
              <input
                id="password"
                v-model="form.password"
                type="password"
                required
                minlength="8"
                class="form-control"
                placeholder="Enter new password"
                :disabled="loading"
              >
            </div>

            <div class="form-group">
              <label for="confirmPassword">Confirm password</label>
              <input
                id="confirmPassword"
                v-model="form.confirmPassword"
                type="password"
                required
                minlength="8"
                class="form-control"
                placeholder="Confirm new password"
                :disabled="loading"
              >
            </div>

            <div class="form-actions">
              <button type="submit" class="btn btn-primary" :disabled="loading">
                <i class="fas fa-spinner fa-spin" v-if="loading"></i>
                {{ loading ? 'Updating...' : 'Update Password' }}
              </button>
            </div>

            <div v-if="error" class="error-message">
              <i class="fas fa-exclamation-triangle"></i>
              {{ error }}
            </div>

            <div v-if="success" class="success-message">
              <i class="fas fa-check-circle"></i>
              {{ success }}
            </div>
          </form>
        </template>

        <template v-else>
          <div class="form-header">
            <h2>Link Invalid or Expired</h2>
            <p>Request a new password reset email from the admin sign-in page.</p>
          </div>

          <div v-if="error" class="error-message">
            <i class="fas fa-exclamation-triangle"></i>
            {{ error }}
          </div>

          <div class="form-actions">
            <NuxtLink to="/adminaccess" class="btn btn-primary">
              Back to Admin Sign In
            </NuxtLink>
          </div>
        </template>

        <div class="form-footer">
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
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'auth-layout'
})

const supabase = useSupabaseClient()
const router = useRouter()
const route = useRoute()

const initializing = ref(true)
const sessionReady = ref(false)
const loading = ref(false)
const error = ref('')
const success = ref('')
const form = ref({
  password: '',
  confirmPassword: ''
})

const establishRecoverySession = async () => {
  const hash = window.location.hash.substring(1)
  if (hash) {
    const params = new URLSearchParams(hash)

    if (params.get('error')) {
      const errorCode = params.get('error_code')
      history.replaceState(null, '', window.location.pathname)

      if (errorCode === 'otp_expired') {
        throw new Error('This reset link has expired. Please request a new one.')
      }

      throw new Error(params.get('error_description') || 'This reset link is invalid. Please request a new one.')
    }

    if (params.get('type') === 'recovery') {
      const accessToken = params.get('access_token')
      const refreshToken = params.get('refresh_token')

      if (accessToken && refreshToken) {
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken
        })

        if (sessionError) {
          throw sessionError
        }

        history.replaceState(null, '', window.location.pathname)
        return true
      }
    }
  }

  const code = route.query.code
  if (typeof code === 'string') {
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    if (exchangeError) {
      throw exchangeError
    }

    await router.replace({ path: '/reset-password', query: {} })
    return true
  }

  const { data: { session } } = await supabase.auth.getSession()
  return !!session
}

onMounted(async () => {
  try {
    sessionReady.value = await establishRecoverySession()
    if (!sessionReady.value) {
      error.value = 'This reset link is invalid or has expired. Please request a new one.'
    }
  } catch (err) {
    console.error('Recovery session error:', err)
    error.value = err.message || 'Unable to verify your reset link. Please request a new one.'
    sessionReady.value = false
  } finally {
    initializing.value = false
  }
})

const handleResetPassword = async () => {
  try {
    loading.value = true
    error.value = ''
    success.value = ''

    if (form.value.password !== form.value.confirmPassword) {
      error.value = 'Passwords do not match.'
      return
    }

    if (form.value.password.length < 8) {
      error.value = 'Password must be at least 8 characters.'
      return
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: form.value.password
    })

    if (updateError) {
      throw updateError
    }

    success.value = 'Password updated successfully. Redirecting to sign in...'
    await supabase.auth.signOut()

    setTimeout(() => {
      router.push('/adminaccess')
    }, 2000)
  } catch (err) {
    console.error('Password reset error:', err)
    error.value = err.message || 'Failed to update password. Please try again.'
  } finally {
    loading.value = false
  }
}

useHead({
  title: 'Reset Password - Shaft Lok',
  meta: [
    { name: 'description', content: 'Reset your Shaft Lok admin account password.' },
    { name: 'robots', content: 'noindex, nofollow' }
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

.status-message {
  text-align: center;
  color: var(--text-mid);
  padding: 2rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
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
</style>
