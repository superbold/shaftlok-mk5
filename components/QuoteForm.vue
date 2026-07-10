<template>
  <div class="quote-form-fields">
    <div class="form-row">
      <div class="form-group">
        <label for="quote-name">Name *</label>
        <input
          id="quote-name"
          :value="modelValue.name"
          @input="updateField('name', $event.target.value)"
          type="text"
          required
          class="form-control"
        >
      </div>
      <div class="form-group">
        <label for="quote-email">Email *</label>
        <input
          id="quote-email"
          :value="modelValue.email"
          @input="updateField('email', $event.target.value)"
          type="email"
          required
          class="form-control"
        >
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label for="quote-phone">Phone</label>
        <input
          id="quote-phone"
          :value="modelValue.phone"
          @input="updateField('phone', $event.target.value)"
          type="tel"
          class="form-control"
        >
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label for="quote-notes">Notes</label>
        <textarea
          id="quote-notes"
          :value="modelValue.notes"
          @input="updateField('notes', $event.target.value)"
          rows="4"
          class="form-control"
          placeholder="What did they ask for on the phone?"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue'])

const updateField = (field, value) => {
  emit('update:modelValue', {
    ...props.modelValue,
    [field]: value
  })
}
</script>

<style scoped>
.quote-form-fields {
  width: 100%;
}

.form-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group {
  flex: 1;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-family: var(--font-display);
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--text-mid);
}

.form-control {
  width: 100%;
  padding: 0.7rem 0.9rem;
  background: rgba(13, 27, 54, 0.65);
  border: 1px solid var(--line-strong);
  border-radius: var(--radius-sm);
  color: var(--text-hi);
  font-size: 1rem;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form-control:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.18);
}

textarea.form-control {
  resize: vertical;
  min-height: 90px;
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }
}
</style>
