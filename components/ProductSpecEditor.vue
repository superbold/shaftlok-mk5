<template>
  <div class="structured-editor">
    <div v-if="!modelValue.length" class="empty-state">
      No detail bullets yet. Add rows for construction, compatibility, ordering notes, and similar specs.
    </div>

    <div
      v-for="(spec, index) in modelValue"
      :key="index"
      class="editor-row glass-card"
    >
      <div class="row-header">
        <span class="row-label">Bullet {{ index + 1 }}</span>
        <button type="button" class="btn-icon-danger" @click="removeRow(index)" aria-label="Remove bullet">
          <i class="fas fa-trash"></i>
        </button>
      </div>

      <div class="row-grid">
        <div class="form-group">
          <label :for="`spec-name-${index}`">Label</label>
          <input
            :id="`spec-name-${index}`"
            :value="spec.name"
            type="text"
            class="form-control"
            placeholder="Housing"
            @input="updateRow(index, 'name', ($event.target as HTMLInputElement).value)"
          >
        </div>

        <div class="form-group">
          <label :for="`spec-value-${index}`">Text</label>
          <input
            :id="`spec-value-${index}`"
            :value="spec.value"
            type="text"
            class="form-control"
            placeholder="Durable marine urethane"
            @input="updateRow(index, 'value', ($event.target as HTMLInputElement).value)"
          >
        </div>
      </div>
    </div>

    <button type="button" class="btn-add" @click="addRow">
      <i class="fas fa-plus"></i> Add detail bullet
    </button>
  </div>
</template>

<script setup lang="ts">
import type { ProductSpec } from '~~/utils/productDisplay'

const props = defineProps<{
  modelValue: ProductSpec[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: ProductSpec[]]
}>()

const emptySpec = (): ProductSpec => ({
  name: '',
  value: ''
})

const updateRows = (rows: ProductSpec[]) => {
  emit('update:modelValue', rows)
}

const updateRow = (index: number, field: keyof ProductSpec, value: string) => {
  const rows = props.modelValue.map((row, rowIndex) =>
    rowIndex === index ? { ...row, [field]: value } : row
  )
  updateRows(rows)
}

const addRow = () => {
  updateRows([...props.modelValue, emptySpec()])
}

const removeRow = (index: number) => {
  updateRows(props.modelValue.filter((_, rowIndex) => rowIndex !== index))
}
</script>

<style scoped>
.structured-editor {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.empty-state {
  padding: 0.9rem 1rem;
  border: 1px dashed var(--line-strong);
  border-radius: var(--radius-sm);
  color: var(--text-low);
  font-size: 0.9rem;
  line-height: 1.45;
}

.editor-row {
  padding: 1rem;
  border-radius: var(--radius-sm);
  background: rgba(13, 27, 54, 0.45);
  border: 1px solid var(--line);
}

.row-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.85rem;
}

.row-label {
  font-family: var(--font-display);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--text-mid);
}

.row-grid {
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 0.75rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.35rem;
  font-family: var(--font-display);
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--text-mid);
}

.form-control {
  width: 100%;
  padding: 0.65rem 0.8rem;
  background: rgba(13, 27, 54, 0.65);
  border: 1px solid var(--line-strong);
  border-radius: var(--radius-sm);
  color: var(--text-hi);
  font-family: var(--font-body);
  font-size: 0.95rem;
}

.form-control:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.18);
}

.btn-add,
.btn-icon-danger {
  border: 1px solid transparent;
  border-radius: 999px;
  cursor: pointer;
  font-family: var(--font-display);
  transition: all 0.2s ease;
}

.btn-add {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.55rem 1rem;
  background: rgba(56, 189, 248, 0.1);
  border-color: rgba(56, 189, 248, 0.35);
  color: var(--accent);
  font-size: 0.85rem;
  font-weight: 600;
}

.btn-add:hover {
  background: rgba(56, 189, 248, 0.18);
}

.btn-icon-danger {
  width: 2rem;
  height: 2rem;
  background: rgba(248, 113, 113, 0.12);
  border-color: rgba(248, 113, 113, 0.35);
  color: #FCA5A5;
}

.btn-icon-danger:hover {
  background: rgba(248, 113, 113, 0.22);
}

@media (max-width: 768px) {
  .row-grid {
    grid-template-columns: 1fr;
  }
}
</style>
