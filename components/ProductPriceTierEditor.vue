<template>
  <div class="structured-editor">
    <div v-if="!modelValue.length" class="empty-state">
      No length tiers yet. Add rows for each foot range and its price — used on the product page and in Quote Management.
    </div>

    <div
      v-for="(tier, index) in modelValue"
      :key="index"
      class="editor-row glass-card"
    >
      <div class="row-header">
        <span class="row-label">Tier {{ index + 1 }}</span>
        <button type="button" class="btn-icon-danger" @click="removeRow(index)" aria-label="Remove tier">
          <i class="fas fa-trash"></i>
        </button>
      </div>

      <div class="row-grid">
        <div class="form-group">
          <label :for="`tier-min-${index}`">Min feet</label>
          <input
            :id="`tier-min-${index}`"
            :value="tier.minFeet"
            type="number"
            min="1"
            step="1"
            class="form-control"
            placeholder="1"
            @input="updateRow(index, 'minFeet', ($event.target as HTMLInputElement).value)"
          >
        </div>

        <div class="form-group">
          <label :for="`tier-max-${index}`">Max feet</label>
          <input
            :id="`tier-max-${index}`"
            :value="tier.maxFeet"
            type="number"
            min="1"
            step="1"
            class="form-control"
            placeholder="5"
            @input="updateRow(index, 'maxFeet', ($event.target as HTMLInputElement).value)"
          >
        </div>

        <div class="form-group">
          <label :for="`tier-price-${index}`">Price (USD)</label>
          <input
            :id="`tier-price-${index}`"
            :value="tier.price"
            type="number"
            min="0"
            step="0.01"
            class="form-control"
            placeholder="210"
            @input="updateRow(index, 'price', ($event.target as HTMLInputElement).value)"
          >
        </div>
      </div>
    </div>

    <button type="button" class="btn-add" @click="addRow">
      <i class="fas fa-plus"></i> Add length tier
    </button>
  </div>
</template>

<script setup lang="ts">
import type { ProductPriceTier } from '~~/utils/productPricing'

const props = defineProps<{
  modelValue: ProductPriceTier[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: ProductPriceTier[]]
}>()

const emptyTier = (): ProductPriceTier => ({
  minFeet: 1,
  maxFeet: 5,
  price: 0
})

const updateRows = (rows: ProductPriceTier[]) => {
  emit('update:modelValue', rows)
}

const updateRow = (index: number, field: keyof ProductPriceTier, value: string) => {
  const rows = props.modelValue.map((row, rowIndex) =>
    rowIndex === index ? { ...row, [field]: value } : row
  )
  updateRows(rows)
}

const addRow = () => {
  updateRows([...props.modelValue, emptyTier()])
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
  grid-template-columns: repeat(3, 1fr);
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
