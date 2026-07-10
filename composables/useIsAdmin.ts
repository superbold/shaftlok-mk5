export const useIsAdmin = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  const isAdmin = ref(false)

  const checkAdminStatus = async () => {
    if (!user.value) {
      isAdmin.value = false
      return
    }

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.value.sub)
        .single()

      isAdmin.value = profile?.role === 'admin'
    } catch (error) {
      console.error('Error checking admin status:', error)
      isAdmin.value = false
    }
  }

  watch(user, checkAdminStatus, { immediate: true })

  return { isAdmin: readonly(isAdmin), checkAdminStatus }
}
