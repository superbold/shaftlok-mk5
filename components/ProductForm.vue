<template>
  <div class="product-form">
    <div class="form-row">
      <div class="form-group">
        <label for="product-name">Product Name *</label>
        <input
          id="product-name"
          :value="modelValue.name"
          @input="updateField('name', $event.target.value)"
          type="text"
          required
          class="form-control"
        >
      </div>
      <div class="form-group">
        <label for="product-slug">Slug *</label>
        <input
          id="product-slug"
          :value="modelValue.slug"
          @input="updateField('slug', $event.target.value)"
          type="text"
          required
          class="form-control"
          placeholder="mod-i-easylok"
        >
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label for="product-category">Category *</label>
        <select
          id="product-category"
          :value="modelValue.category"
          @change="updateField('category', $event.target.value)"
          required
          class="form-control"
        >
          <option value="" disabled>Select a category</option>
          <option value="Locking Units">Locking Units</option>
          <option value="Controls & Accessories">Controls &amp; Accessories</option>
        </select>
      </div>
      <div class="form-group">
        <label for="product-badge">Badge</label>
        <input
          id="product-badge"
          :value="modelValue.badge"
          @input="updateField('badge', $event.target.value)"
          type="text"
          class="form-control"
          placeholder="Most popular"
        >
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label for="product-image">Image URL</label>
        <input
          id="product-image"
          :value="modelValue.image_url"
          @input="updateField('image_url', $event.target.value)"
          type="text"
          class="form-control"
          placeholder="/assets/images/shaftlok-mod-red.jpg"
        >
      </div>
      <div class="form-group">
        <label for="product-bore">Max Bore Size (mm)</label>
        <input
          id="product-bore"
          :value="modelValue.max_bore_size_mm"
          @input="updateField('max_bore_size_mm', $event.target.value)"
          type="number"
          step="0.01"
          class="form-control"
        >
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label for="product-alt">Image Alt Text</label>
        <input
          id="product-alt"
          :value="modelValue.alt"
          @input="updateField('alt', $event.target.value)"
          type="text"
          class="form-control"
        >
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label for="product-description">Description</label>
        <textarea
          id="product-description"
          :value="modelValue.description"
          @input="updateField('description', $event.target.value)"
          rows="4"
          class="form-control"
        ></textarea>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group display-toggle">
        <label class="toggle-label">
          <input
            type="checkbox"
            :checked="modelValue.display !== false"
            @change="updateField('display', $event.target.checked)"
            class="toggle-input"
          >
          <span class="toggle-track">
            <span class="toggle-thumb"></span>
          </span>
          <span class="toggle-text">
            {{ modelValue.display !== false ? 'Visible on site' : 'Hidden from site' }}
          </span>
        </label>
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
.product-form {
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
  font-family: var(--font-body);
  font-size: 1rem;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

textarea.form-control {
  resize: vertical;
  min-height: 6rem;
}

select.form-control {
  cursor: pointer;
}

.form-control:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.18);
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }

  .form-group label {
    font-size: 0.9rem;
  }

  .form-control {
    padding: 0.75rem;
    font-size: 1rem;
    border-radius: 6px;
  }
}

.display-toggle {
  display: flex;
  align-items: center;
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  user-select: none;
}

.toggle-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-track {
  position: relative;
  width: 2.6rem;
  height: 1.4rem;
  background: rgba(13, 27, 54, 0.65);
  border: 1px solid var(--line-strong);
  border-radius: 999px;
  transition: background 0.25s ease, border-color 0.25s ease;
  flex-shrink: 0;
}

.toggle-input:checked + .toggle-track {
  background: rgba(56, 189, 248, 0.2);
  border-color: var(--accent);
}

.toggle-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 1rem;
  height: 1rem;
  background: var(--text-low);
  border-radius: 50%;
  transition: transform 0.25s ease, background 0.25s ease;
}

.toggle-input:checked + .toggle-track .toggle-thumb {
  transform: translateX(1.2rem);
  background: var(--accent);
}

.toggle-text {
  font-family: var(--font-display);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-mid);
}

@media (max-width: 480px) {
  .form-control {
    padding: 0.875rem;
    font-size: 1.05rem;
  }
}
</style>
