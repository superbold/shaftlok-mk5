<template>
  <div v-if="show" class="modal" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>{{ getTitle() }}</h2>
        <button @click="close" class="modal-close" aria-label="Close modal">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="modal-body">
        <!-- Delete confirmation -->
        <div v-if="mode === 'delete'" class="delete-confirmation">
          <p>Are you sure you want to delete this {{ entityName.toLowerCase() }}?</p>
          <div class="entity-details">
            <slot name="delete-preview" :item="selectedItem"></slot>
          </div>
          <div class="modal-actions">
            <button @click="close" class="btn btn-secondary">Cancel</button>
            <button @click="handleDelete" class="btn btn-danger" :disabled="loading">
              <i class="fas fa-spinner fa-spin" v-if="loading"></i>
              {{ loading ? 'Deleting...' : 'Delete' }}
            </button>
          </div>
        </div>
        
        <!-- Create/Edit form -->
        <form v-else @submit.prevent="handleSave">
          <slot name="form" :form-data="formData" :mode="mode"></slot>
          <div class="modal-actions">
            <button type="button" @click="close" class="btn btn-secondary">Cancel</button>
            <button type="submit" class="btn btn-primary" :disabled="loading">
              <i class="fas fa-spinner fa-spin" v-if="loading"></i>
              {{ loading ? 'Saving...' : (mode === 'create' ? 'Create' : 'Update') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  mode: {
    type: String,
    validator: (value) => ['create', 'edit', 'delete'].includes(value),
    default: 'create'
  },
  selectedItem: {
    type: Object,
    default: null
  },
  formData: {
    type: Object,
    default: () => ({})
  },
  entityName: {
    type: String,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'save', 'delete'])

const getTitle = () => {
  const { mode, entityName } = props
  if (mode === 'create') return `Add New ${entityName}`
  if (mode === 'edit') return `Edit ${entityName}`
  if (mode === 'delete') return `Delete ${entityName}`
  return entityName
}

const close = () => emit('close')

const closeModal = (event) => {
  if (event.target === event.currentTarget) {
    close()
  }
}

const handleSave = () => emit('save')
const handleDelete = () => emit('delete')
</script>

<style scoped>
.modal {
  position: fixed;
  inset: 0;
  background: rgba(2, 8, 23, 0.72);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: var(--abyss-soft);
  border: 1px solid var(--line-strong);
  border-radius: var(--radius-lg);
  max-width: 620px;
  width: 92%;
  max-height: 82vh;
  overflow-y: auto;
  box-shadow: var(--shadow-card), var(--glow-accent);
  color: var(--text-hi);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.4rem 1.6rem;
  border-bottom: 1px solid var(--line);
  background: rgba(13, 27, 54, 0.7);
}

.modal-header h2 {
  margin: 0;
  font-size: 1.35rem;
  font-family: var(--font-display);
  font-weight: 600;
  color: var(--text-hi);
}

.modal-close {
  background: rgba(148, 197, 255, 0.08);
  border: 1px solid var(--line-strong);
  border-radius: 999px;
  width: 2.4rem;
  height: 2.4rem;
  color: var(--text-hi);
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close:hover {
  background: rgba(148, 197, 255, 0.18);
  transform: scale(1.06);
}

.modal-body {
  padding: 1.6rem;
  font-size: 1rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 1.2rem;
  border-top: 1px solid var(--line);
}

.btn {
  padding: 0.7rem 1.6rem;
  border: 1px solid transparent;
  border-radius: 999px;
  font-family: var(--font-display);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.btn-primary {
  background: linear-gradient(120deg, #38BDF8, #2DD4BF);
  color: #04121F;
  box-shadow: 0 8px 24px -8px rgba(56, 189, 248, 0.55);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 12px 30px -8px rgba(56, 189, 248, 0.7);
}

.btn-secondary {
  background: rgba(148, 197, 255, 0.07);
  border-color: var(--line-strong);
  color: var(--text-mid);
}

.btn-secondary:hover:not(:disabled) {
  background: rgba(148, 197, 255, 0.14);
  color: var(--text-hi);
  transform: translateY(-1px);
}

.btn-danger {
  background: rgba(248, 113, 113, 0.14);
  border-color: rgba(248, 113, 113, 0.5);
  color: #FCA5A5;
}

.btn-danger:hover:not(:disabled) {
  background: rgba(248, 113, 113, 0.28);
  transform: translateY(-1px);
}

.delete-confirmation {
  text-align: center;
}

.delete-confirmation p {
  font-weight: 600;
  color: #FCA5A5;
  font-size: 1.15rem;
  margin-bottom: 1rem;
}

.entity-details {
  background: rgba(13, 27, 54, 0.6);
  border: 1px solid var(--line);
  color: var(--text-mid);
  padding: 1rem 1.2rem;
  border-radius: var(--radius-sm);
  margin: 1rem 0;
  text-align: left;
}

@media (max-width: 768px) {
  .modal-content {
    width: 95%;
    max-height: 90vh;
  }

  .modal-header { padding: 1rem 1.2rem; }
  .modal-header h2 { font-size: 1.2rem; }
  .modal-body { padding: 1.2rem; }

  .modal-actions {
    flex-direction: column;
    gap: 0.75rem;
    margin-top: 1.5rem;
  }

  .btn {
    width: 100%;
    justify-content: center;
    padding: 0.9rem 1.5rem;
  }
}
</style>
