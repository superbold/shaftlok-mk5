export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = useSupabaseUser()
  const supabase = useSupabaseClient()

  // useSupabaseUser() holds decoded JWT claims (id field is `sub`, not `id`),
  // and can also lag briefly right after sign-in since it updates via an
  // async auth-state listener — fall back to asking the client directly
  // rather than bouncing a just-signed-in admin back out.
  let userId = user.value?.sub
  if (!userId) {
    const { data } = await supabase.auth.getUser()
    userId = data.user?.id
  }

  if (!userId) {
    return navigateTo('/adminaccess')
  }

  // Check if user has admin role
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single()

  if (error || profile?.role !== 'admin') {
    // Not an admin, redirect to home with message
    throw createError({
      statusCode: 403,
      statusMessage: 'Access denied. Admin privileges required.'
    })
  }
})