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
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 15px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 2px solid var(--federal-blue);
  background: var(--federal-blue);
  color: white;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-family: 'DeVinneOrnamentDRegular', serif;
  font-weight: bold;
  color: white;
}

.modal-close {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.modal-body {
  padding: 1.5rem;
  font-size: 1.1rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background-color: var(--federal-blue);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--honolulu-blue);
  transform: translateY(-1px);
}

.btn-secondary {
  background-color: #6b7280;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #4b5563;
  transform: translateY(-1px);
}

.btn-danger {
  background-color: #dc2626;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background-color: #b91c1c;
  transform: translateY(-1px);
}

.delete-confirmation {
  text-align: center;
}

.delete-confirmation p {
  font-weight: bold;
  color: var(--honolulu-blue);
  font-size: 1.3rem;
  margin-bottom: 1rem;
}

.entity-details {
  background-color: #f8fafc;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  text-align: left;
}

@media (max-width: 768px) {
  .modal-content {
    width: 95%;
    max-height: 90vh;
    margin: 20px;
    border-radius: 10px;
  }
  
  .modal-header {
    padding: 1rem;
  }
  
  .modal-header h2 {
    font-size: 1.25rem;
  }
  
  .modal-body {
    padding: 1rem;
  }
  
  .modal-actions {
    flex-direction: column;
    gap: 0.75rem;
    margin-top: 1.5rem;
  }
  
  .btn {
    width: 100%;
    justify-content: center;
    padding: 1rem 1.5rem;
    font-size: 1.1rem;
  }
  
  .delete-confirmation p {
    font-size: 1rem;
  }
  
  .entity-details {
    padding: 0.75rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .modal-content {
    width: 98%;
    max-height: 95vh;
    margin: 10px;
  }
  
  .modal-header {
    padding: 0.75rem;
  }
  
  .modal-header h2 {
    font-size: 1.1rem;
  }
  
  .modal-body {
    padding: 0.75rem;
  }
}
</style>