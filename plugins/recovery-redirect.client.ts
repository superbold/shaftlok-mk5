export default defineNuxtPlugin(() => {
  if (import.meta.server) {
    return
  }

  const hash = window.location.hash.substring(1)
  if (hash) {
    const params = new URLSearchParams(hash)
    if (params.get('type') === 'recovery' && window.location.pathname !== '/reset-password') {
      window.location.replace(`/reset-password${window.location.hash}`)
      return
    }
  }

  const searchParams = new URLSearchParams(window.location.search)
  const isRecoveryQuery = searchParams.get('type') === 'recovery' || searchParams.has('code')
  if (isRecoveryQuery && window.location.pathname !== '/reset-password') {
    window.location.replace(`/reset-password${window.location.search}`)
  }
})
