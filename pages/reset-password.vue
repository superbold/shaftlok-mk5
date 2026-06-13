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
  background: linear-gradient(135deg, var(--federal-blue), var(--honolulu-blue));
  color: white;
  text-align: center;
  padding: 3rem 1.5rem;
  margin-bottom: 2rem;
  border-radius: 15px;
}

.hero-content h1 {
  font-size: 2.5rem;
  font-weight: bold;
  margin: 0 0 1rem 0;
}

.hero-content p {
  font-size: 1.1rem;
  margin: 0;
  opacity: 0.9;
}

.signin-form-container {
  width: 100%;
}

.form-card {
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;
}

.form-header h2 {
  color: var(--federal-blue);
  font-size: 1.8rem;
  margin: 0 0 0.5rem 0;
}

.form-header p {
  color: #6b7280;
  margin: 0;
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
  font-weight: 500;
  color: var(--federal-blue);
}

.form-control {
  width: 100%;
  padding: 0.875rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

.form-control:focus {
  outline: none;
  border-color: var(--honolulu-blue);
  box-shadow: 0 0 0 3px rgba(202, 240, 248, 0.3);
}

.form-control:disabled {
  background-color: #f9fafb;
  cursor: not-allowed;
}

.form-actions {
  margin: 2rem 0 1rem 0;
}

.btn {
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  text-decoration: none;
}

.btn-primary {
  background: linear-gradient(135deg, var(--federal-blue), var(--honolulu-blue));
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(31, 81, 147, 0.3);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.status-message {
  text-align: center;
  color: #6b7280;
  padding: 2rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.error-message {
  background: #fee2e2;
  color: #dc2626;
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  font-size: 0.9rem;
}

.success-message {
  background: #dcfce7;
  color: #166534;
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  font-size: 0.9rem;
}

.form-footer {
  text-align: center;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
  margin-top: 1.5rem;
}

.logo-button {
  display: inline-block;
  margin-top: 1rem;
  transition: transform 0.3s ease;
}

.logo-button:hover {
  transform: translateY(-2px);
}

.footer-logo {
  height: 3.1rem;
  width: auto;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .signin-hero {
    padding: 2rem 1rem;
    margin-bottom: 1.5rem;
  }

  .hero-content h1 {
    font-size: 2rem;
  }

  .form-card {
    padding: 1.5rem;
  }

  .form-header h2 {
    font-size: 1.5rem;
  }
}
</style>
