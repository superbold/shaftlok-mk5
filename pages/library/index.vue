<template>
  <div>
    <div class="yacht-container">
      <BreadcrumbNav admin :items="[{ name: 'Shaft Lok Library' }]" />

      <div class="library-intro-block">
        <p class="library-intro">
          This library is for installation guides, drawings, and other documents.
          These files may be added as attachments to quotes in the Quote Management System (QMS).
        </p>
        <p class="accepts-row">
          <span class="accepts-label">Accepts:</span>
          <span v-for="type in acceptedTypes" :key="type" class="type-badge">{{ type }}</span>
          <span class="type-badge type-badge-muted">Max 20 MB per file</span>
        </p>
      </div>

      <div v-if="loading" class="loading-indicator">
        <i class="fas fa-spinner fa-spin"></i>
        Loading library...
      </div>

      <div v-else-if="error" class="error-message">
        <i class="fas fa-exclamation-triangle"></i>
        {{ error }}
        <button type="button" class="retry-button" @click="loadDocuments">Retry</button>
      </div>

      <template v-else>
        <div class="toolbar">
          <button type="button" class="btn btn-primary upload-btn-mobile" @click="showUploadModal = true">
            <i class="fas fa-upload"></i> Upload document
          </button>
        </div>

        <div v-if="documents.length === 0" class="empty-state glass-card">
          <i class="fas fa-folder-open"></i>
          <h2>No documents yet</h2>
          <p>Upload a PDF or common doc to start the Shaft Lok Library.</p>
          <button type="button" class="btn btn-primary" @click="showUploadModal = true">
            <i class="fas fa-upload"></i> Upload document
          </button>
        </div>

        <div v-else class="table-container">
          <table class="yacht-table">
            <thead>
              <tr>
                <th>TITLE</th>
                <th>FILE</th>
                <th>SIZE</th>
                <th>ADDED</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="doc in documents" :key="doc.id">
                <td>
                  <strong>{{ doc.title }}</strong>
                  <p v-if="doc.description" class="doc-desc">{{ doc.description }}</p>
                </td>
                <td><code class="file-code">{{ doc.file_name }}</code></td>
                <td>{{ formatBytes(doc.file_size) }}</td>
                <td>{{ formatDate(doc.created_at) }}</td>
                <td class="actions-cell">
                  <button
                    type="button"
                    class="action-btn"
                    title="Download"
                    :disabled="busyId === doc.id"
                    @click="downloadDocument(doc)"
                  >
                    <i class="fas fa-download"></i>
                  </button>
                  <button
                    type="button"
                    class="action-btn delete-btn"
                    title="Delete"
                    :disabled="busyId === doc.id"
                    @click="confirmDelete(doc)"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </div>

    <div v-if="showUploadModal" class="modal" @click="closeUploadModal">
      <div class="modal-content glass-card" @click.stop>
        <h2 class="modal-title">Upload to Shaft Lok Library</h2>
        <form class="upload-form" @submit.prevent="uploadDocument">
          <div class="form-group">
            <label for="lib-title">Title</label>
            <input
              id="lib-title"
              v-model="uploadForm.title"
              type="text"
              class="form-control"
              placeholder="e.g. Installation Guide"
              required
            >
          </div>
          <div class="form-group">
            <label for="lib-desc">Description <span class="optional">(optional)</span></label>
            <textarea
              id="lib-desc"
              v-model="uploadForm.description"
              class="form-control"
              rows="2"
              placeholder="When to attach this for a sailor…"
            />
          </div>
          <div class="form-group">
            <label for="lib-file">File</label>
            <input
              id="lib-file"
              ref="fileInput"
              type="file"
              class="form-control file-input"
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.webp,application/pdf,image/*"
              required
              @change="onFileChange"
            >
            <p class="field-hint accepts-row">
              <span class="accepts-label">Accepts:</span>
              <span v-for="type in acceptedTypes" :key="type" class="type-badge">{{ type }}</span>
              <span class="type-badge type-badge-muted">Max 20 MB per file</span>
            </p>
          </div>
          <p v-if="uploadError" class="form-error">{{ uploadError }}</p>
          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" :disabled="uploading" @click="closeUploadModal">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary" :disabled="uploading || !uploadForm.file">
              <i v-if="uploading" class="fas fa-spinner fa-spin"></i>
              <i v-else class="fas fa-upload"></i>
              {{ uploading ? 'Uploading…' : 'Upload' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="deleteTarget" class="modal" @click="deleteTarget = null">
      <div class="modal-content glass-card" @click.stop>
        <h2 class="modal-title">Delete document?</h2>
        <p class="modal-text">
          Remove <strong>{{ deleteTarget.title }}</strong> ({{ deleteTarget.file_name }}) from the library?
          This cannot be undone.
        </p>
        <p v-if="deleteError" class="form-error">{{ deleteError }}</p>
        <div class="modal-actions">
          <button type="button" class="btn btn-secondary" :disabled="deleting" @click="deleteTarget = null">
            Cancel
          </button>
          <button type="button" class="btn btn-danger" :disabled="deleting" @click="deleteDocument">
            <i v-if="deleting" class="fas fa-spinner fa-spin"></i>
            {{ deleting ? 'Deleting…' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'library-layout',
  middleware: 'admin'
})

const LIBRARY_BUCKET = 'shaft-lok-library'
const MAX_BYTES = 20 * 1024 * 1024
const acceptedTypes = ['PDF', 'Word', 'Text', 'JPEG', 'PNG', 'WebP']

const supabase = useSupabaseClient()
const libraryNav = inject('libraryNav', null)

const documents = ref([])
const loading = ref(true)
const error = ref(null)
const busyId = ref(null)

const showUploadModal = ref(false)
const uploading = ref(false)
const uploadError = ref('')
const fileInput = ref(null)
const uploadForm = ref({
  title: '',
  description: '',
  file: null
})

const deleteTarget = ref(null)
const deleting = ref(false)
const deleteError = ref('')

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'

const formatBytes = (bytes) => {
  const n = Number(bytes)
  if (!Number.isFinite(n) || n < 0) return '—'
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / (1024 * 1024)).toFixed(1)} MB`
}

const safeFileName = (name) =>
  String(name || 'document')
    .replace(/[^\w.\-()+ ]+/g, '_')
    .replace(/\s+/g, '-')
    .slice(0, 120)

const loadDocuments = async () => {
  try {
    loading.value = true
    error.value = null

    const { data, error: fetchError } = await supabase
      .from('library_documents')
      .select('*')
      .order('created_at', { ascending: false })

    if (fetchError) throw fetchError

    documents.value = data || []
    libraryNav?.setDocumentCount(documents.value.length)
  } catch (err) {
    console.error('Error loading library:', err)
    error.value = err.message || 'Failed to load Shaft Lok Library.'
  } finally {
    loading.value = false
  }
}

const onFileChange = (event) => {
  const file = event.target.files?.[0] || null
  uploadForm.value.file = file
  if (file && !uploadForm.value.title.trim()) {
    uploadForm.value.title = file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ')
  }
}

const closeUploadModal = () => {
  if (uploading.value) return
  showUploadModal.value = false
  uploadError.value = ''
  uploadForm.value = { title: '', description: '', file: null }
  if (fileInput.value) fileInput.value.value = ''
}

const uploadDocument = async () => {
  const file = uploadForm.value.file
  const title = uploadForm.value.title.trim()
  if (!file || !title) return

  if (file.size > MAX_BYTES) {
    uploadError.value = 'File is too large (max 20 MB).'
    return
  }

  uploading.value = true
  uploadError.value = ''

  const path = `${crypto.randomUUID()}-${safeFileName(file.name)}`

  try {
    const { error: storageError } = await supabase.storage
      .from(LIBRARY_BUCKET)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type || undefined
      })

    if (storageError) throw storageError

    const { data: userData } = await supabase.auth.getUser()

    const { error: insertError } = await supabase
      .from('library_documents')
      .insert({
        title,
        description: uploadForm.value.description.trim() || null,
        file_name: file.name,
        storage_path: path,
        content_type: file.type || null,
        file_size: file.size,
        created_by: userData.user?.id ?? null
      })

    if (insertError) {
      await supabase.storage.from(LIBRARY_BUCKET).remove([path])
      throw insertError
    }

    showUploadModal.value = false
    uploadError.value = ''
    uploadForm.value = { title: '', description: '', file: null }
    if (fileInput.value) fileInput.value.value = ''
    await loadDocuments()
  } catch (err) {
    console.error('Error uploading library document:', err)
    uploadError.value = err.message || 'Upload failed.'
  } finally {
    uploading.value = false
  }
}

const downloadDocument = async (doc) => {
  busyId.value = doc.id
  try {
    const { data, error: signedError } = await supabase.storage
      .from(LIBRARY_BUCKET)
      .createSignedUrl(doc.storage_path, 120)

    if (signedError) throw signedError
    if (data?.signedUrl) {
      window.open(data.signedUrl, '_blank', 'noopener,noreferrer')
    }
  } catch (err) {
    console.error('Error downloading library document:', err)
    alert(err.message || 'Could not download that file.')
  } finally {
    busyId.value = null
  }
}

const confirmDelete = (doc) => {
  deleteError.value = ''
  deleteTarget.value = doc
}

const deleteDocument = async () => {
  const doc = deleteTarget.value
  if (!doc) return

  deleting.value = true
  deleteError.value = ''

  try {
    const { error: storageError } = await supabase.storage
      .from(LIBRARY_BUCKET)
      .remove([doc.storage_path])

    if (storageError) throw storageError

    const { error: deleteRowError } = await supabase
      .from('library_documents')
      .delete()
      .eq('id', doc.id)

    if (deleteRowError) throw deleteRowError

    deleteTarget.value = null
    await loadDocuments()
  } catch (err) {
    console.error('Error deleting library document:', err)
    deleteError.value = err.message || 'Delete failed.'
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  libraryNav?.setRefreshCallback(loadDocuments)
  libraryNav?.setUploadOpenCallback(() => {
    showUploadModal.value = true
  })
  loadDocuments()
})

useHead({
  title: 'Shaft Lok Library',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }]
})
</script>

<style scoped>
.yacht-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 1.5rem 1.25rem 3rem;
}

.library-intro-block {
  margin: 0 0 1.25rem;
}

.library-intro {
  margin: 0;
  color: var(--text-mid);
  line-height: 1.55;
  max-width: 42rem;
}

.accepts-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem;
  margin: 0.75rem 0 0;
}

.accepts-label {
  margin-right: 0.15rem;
  font-family: var(--font-display);
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--text-mid);
}

.type-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  border: 1px solid rgba(56, 189, 248, 0.28);
  background: rgba(56, 189, 248, 0.1);
  color: var(--accent);
  font-family: var(--font-display);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.type-badge-muted {
  border-color: rgba(148, 197, 255, 0.18);
  background: rgba(13, 27, 54, 0.55);
  color: var(--text-low);
}

.field-hint.accepts-row {
  margin-top: 0.5rem;
}

.loading-indicator,
.error-message {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 1.25rem;
  color: var(--text-mid);
}

.error-message {
  color: #fca5a5;
  flex-wrap: wrap;
}

.retry-button {
  margin-left: 0.5rem;
  padding: 0.35rem 0.75rem;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(252, 165, 165, 0.4);
  background: transparent;
  color: inherit;
  cursor: pointer;
}

.toolbar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
}

.upload-btn-mobile {
  display: inline-flex;
}

@media (min-width: 768px) {
  .upload-btn-mobile {
    display: none;
  }
}

.empty-state {
  text-align: center;
  padding: 2.5rem 1.5rem;
}

.empty-state i {
  font-size: 2rem;
  color: var(--accent);
  margin-bottom: 0.75rem;
}

.empty-state h2 {
  margin: 0 0 0.5rem;
  font-family: var(--font-display);
  color: var(--text-hi);
}

.empty-state p {
  margin: 0 0 1.25rem;
  color: var(--text-mid);
}

.table-container {
  overflow-x: auto;
  border: 1px solid rgba(56, 189, 248, 0.18);
  border-radius: var(--radius-md, 12px);
  background: rgba(8, 18, 38, 0.65);
}

.yacht-table {
  width: 100%;
  border-collapse: collapse;
}

.yacht-table th,
.yacht-table td {
  padding: 0.85rem 1rem;
  text-align: left;
  border-bottom: 1px solid rgba(56, 189, 248, 0.1);
  vertical-align: top;
}

.yacht-table th {
  font-family: var(--font-display);
  font-size: 0.75rem;
  letter-spacing: 0.06em;
  color: var(--text-mid);
}

.yacht-table td {
  color: var(--text-hi);
  font-size: 0.92rem;
}

.doc-desc {
  margin: 0.35rem 0 0;
  font-size: 0.82rem;
  color: var(--text-low);
  line-height: 1.4;
}

.file-code {
  font-size: 0.8rem;
  color: var(--accent);
}

.actions-cell {
  white-space: nowrap;
  text-align: right;
}

.action-btn {
  background: none;
  border: 1px solid transparent;
  color: var(--text-mid);
  cursor: pointer;
  padding: 0.4rem 0.5rem;
  border-radius: var(--radius-sm);
}

.action-btn:hover:not(:disabled) {
  color: var(--text-hi);
  border-color: rgba(56, 189, 248, 0.3);
}

.action-btn.delete-btn:hover:not(:disabled) {
  color: #fca5a5;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.modal {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(4, 10, 24, 0.72);
}

.modal-content {
  width: 100%;
  max-width: 28rem;
  padding: 1.5rem;
}

.modal-title {
  margin: 0 0 1rem;
  font-family: var(--font-display);
  font-size: 1.2rem;
  color: var(--text-hi);
}

.modal-text {
  margin: 0 0 1.25rem;
  color: var(--text-mid);
  line-height: 1.5;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.35rem;
  font-family: var(--font-display);
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-mid);
}

.optional {
  font-weight: 400;
  color: var(--text-low);
}

.form-control {
  width: 100%;
  padding: 0.65rem 0.85rem;
  background: rgba(13, 27, 54, 0.65);
  border: 1px solid var(--line-strong, rgba(148, 197, 255, 0.2));
  border-radius: var(--radius-sm);
  color: var(--text-hi);
  font: inherit;
  box-sizing: border-box;
}

.file-input {
  padding: 0.45rem;
}

.field-hint {
  margin: 0.4rem 0 0;
  font-size: 0.78rem;
  color: var(--text-low);
}

.form-error {
  margin: 0 0 0.85rem;
  color: #fca5a5;
  font-size: 0.88rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.65rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.6rem 1rem;
  border-radius: var(--radius-sm);
  border: 1px solid transparent;
  font-family: var(--font-display);
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: rgba(56, 189, 248, 0.18);
  border-color: rgba(56, 189, 248, 0.4);
  color: var(--accent);
}

.btn-secondary {
  background: rgba(13, 27, 54, 0.8);
  border-color: rgba(148, 197, 255, 0.2);
  color: var(--text-mid);
}

.btn-danger {
  background: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.4);
  color: #fca5a5;
}
</style>
