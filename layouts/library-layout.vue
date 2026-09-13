<template>
  <div>
    <LibraryNav
      :document-count="documentCount"
      @upload="openUploadModal"
      @refresh="refreshData"
      @sign-out="handleSignOut"
    />
    <slot />
  </div>
</template>

<script setup>
const supabase = useSupabaseClient()
const documentCount = ref(0)
const refreshCallback = ref(null)

const setDocumentCount = (count) => {
  documentCount.value = count
}

const setRefreshCallback = (cb) => {
  refreshCallback.value = cb
}

const refreshData = () => {
  refreshCallback.value?.()
}

const openUploadModal = () => {
  uploadOpenCallback.value?.()
}

const uploadOpenCallback = ref(null)
const setUploadOpenCallback = (cb) => {
  uploadOpenCallback.value = cb
}

provide('libraryNav', {
  setDocumentCount,
  setRefreshCallback,
  setUploadOpenCallback
})

const handleSignOut = async () => {
  await supabase.auth.signOut()
  await navigateTo('/adminaccess')
}
</script>
