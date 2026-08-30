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
        <label for="product-bore-mm">Max Bore Size (mm)</label>
        <input
          id="product-bore-mm"
          :value="modelValue.max_bore_size_mm"
          @input="updateField('max_bore_size_mm', $event.target.value)"
          type="number"
          step="0.01"
          class="form-control"
        >
      </div>
      <div class="form-group">
        <label for="product-bore-inch">Max Bore Size (display)</label>
        <input
          id="product-bore-inch"
          :value="modelValue.max_bore_size_inch"
          @input="updateField('max_bore_size_inch', $event.target.value)"
          type="text"
          class="form-control"
          placeholder='1.77" (45mm)'
        >
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <div class="field-label-row" :class="{ 'is-open': openHelpId === 'price' }">
          <label for="product-price">Price (USD)</label>
          <div class="field-info">
            <button
              type="button"
              class="field-info-btn"
              aria-label="About quote-only pricing"
              :aria-expanded="openHelpId === 'price'"
              aria-controls="product-price-help"
              @click.stop="toggleHelp('price')"
            >
              <i class="fas fa-circle-info" aria-hidden="true"></i>
            </button>
          </div>
          <div
            id="product-price-help"
            class="field-info-tooltip"
            role="tooltip"
          >
            If you leave Price empty, the product is treated as quote-only — no dollar amount is stored or shown on the public product page. Customers see the usual “Request Price & Delivery” flow instead of a listed price.
          </div>
        </div>
        <input
          id="product-price"
          :value="modelValue.price"
          @input="updateField('price', $event.target.value)"
          type="number"
          step="0.01"
          min="0"
          class="form-control"
        >
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <div class="field-label-row" :class="{ 'is-open': openHelpId === 'tagline' }">
          <label for="product-tagline">Tagline</label>
          <div class="field-info">
            <button
              type="button"
              class="field-info-btn"
              aria-label="About Tagline and copy formatting"
              :aria-expanded="openHelpId === 'tagline'"
              aria-controls="product-tagline-help"
              @click.stop="toggleHelp('tagline')"
            >
              <i class="fas fa-circle-info" aria-hidden="true"></i>
            </button>
          </div>
          <div id="product-tagline-help" class="field-info-tooltip" role="tooltip">
            <p class="field-info-intro">Short subtitle under the product title on the public product page. Leave blank to fall back to Card Summary.</p>
            <FieldHelpFormattingReminders />
          </div>
        </div>
        <input
          id="product-tagline"
          :value="modelValue.tagline"
          @input="updateField('tagline', $event.target.value)"
          type="text"
          class="form-control"
          placeholder="e.g. The Mod II is Shaft Lok's most widely utilized model..."
        >
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <div class="field-label-row" :class="{ 'is-open': openHelpId === 'summary' }">
          <label for="product-summary">Card Summary</label>
          <div class="field-info">
            <button
              type="button"
              class="field-info-btn"
              aria-label="About Card Summary and copy formatting"
              :aria-expanded="openHelpId === 'summary'"
              aria-controls="product-summary-help"
              @click.stop="toggleHelp('summary')"
            >
              <i class="fas fa-circle-info" aria-hidden="true"></i>
            </button>
          </div>
          <div id="product-summary-help" class="field-info-tooltip" role="tooltip">
            <p class="field-info-intro">Short blurb on the /products catalog card. Also used as the page subtitle when Tagline is blank.</p>
            <FieldHelpFormattingReminders />
          </div>
        </div>
        <textarea
          id="product-summary"
          :value="modelValue.summary"
          @input="updateField('summary', $event.target.value)"
          rows="2"
          class="form-control"
          placeholder="Short text for the product catalog card"
        ></textarea>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <div class="field-label-row" :class="{ 'is-open': openHelpId === 'description' }">
          <label for="product-description">Search &amp; Social Preview</label>
          <div class="field-info">
            <button
              type="button"
              class="field-info-btn"
              aria-label="About search and social preview text"
              :aria-expanded="openHelpId === 'description'"
              aria-controls="product-description-help"
              @click.stop="toggleHelp('description')"
            >
              <i class="fas fa-circle-info" aria-hidden="true"></i>
            </button>
          </div>
          <div id="product-description-help" class="field-info-tooltip" role="tooltip">
            <p class="field-info-intro">This is <strong>not</strong> shown on the product page. It is the short blurb Google, email, Facebook, X, and other apps may show under the product name when someone searches or shares a link.</p>
            <p class="field-info-heading">What to write</p>
            <ul class="field-info-list">
              <li>One or two plain sentences only — product name, who it is for, and one key fact (such as max shaft size).</li>
              <li>Do <strong>not</strong> paste the full Product Details text here.</li>
              <li>Tagline and Card Summary control what visitors read on the site; this field is for search engines and link previews only.</li>
            </ul>
            <p class="field-info-example"><strong>Example:</strong> Shaft Lok Mod II EasyLok — our most popular shaft lock for boats with moderate engine room space. Handles shafts up to 2.25" (57.15 mm).</p>
          </div>
        </div>
        <textarea
          id="product-description"
          :value="modelValue.description"
          @input="updateField('description', $event.target.value)"
          rows="2"
          class="form-control"
          placeholder="1–2 sentences for Google, email, and social media (not shown on the product page)"
        ></textarea>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <div class="field-label-row" :class="{ 'is-open': openHelpId === 'details' }">
          <label for="product-details">Product Details</label>
          <div class="field-info">
            <button
              type="button"
              class="field-info-btn"
              aria-label="About Product Details and copy formatting"
              :aria-expanded="openHelpId === 'details'"
              aria-controls="product-details-help"
              @click.stop="toggleHelp('details')"
            >
              <i class="fas fa-circle-info" aria-hidden="true"></i>
            </button>
          </div>
          <div id="product-details-help" class="field-info-tooltip" role="tooltip">
            <p class="field-info-intro">Main body copy in the Details section on the public product page. List specs and construction as separate lines starting with <strong>-</strong> (Housing, Shaft collar, Rotating disc).</p>
            <FieldHelpFormattingReminders />
          </div>
        </div>
        <textarea
          id="product-details"
          :value="modelValue.details"
          @input="updateField('details', $event.target.value)"
          rows="8"
          class="form-control"
          placeholder="Intro paragraph, blank line, then bullet lines for specs and construction"
        ></textarea>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group display-toggle">
        <span class="display-toggle-label">Visibility</span>
        <label class="toggle-label">
          <input
            type="checkbox"
            :checked="modelValue.display !== false"
            @change="updateField('display', $event.target.checked)"
            class="toggle-input"
          >
          <span class="toggle-track" aria-hidden="true">
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

const openHelpId = ref(null)

const toggleHelp = (id) => {
  openHelpId.value = openHelpId.value === id ? null : id
}

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

.form-group > label:not(.toggle-label) {
  display: block;
  margin-bottom: 0.5rem;
  font-family: var(--font-display);
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--text-mid);
}

.field-label-row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.45rem;
  margin-bottom: 0.5rem;
}

.field-label-row label {
  margin-bottom: 0;
}

.field-info {
  display: inline-flex;
}

.field-info-btn {
  background: rgba(56, 189, 248, 0.1);
  border: 1px solid rgba(56, 189, 248, 0.3);
  color: var(--accent);
  width: 1.35rem;
  height: 1.35rem;
  border-radius: 999px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.72rem;
  padding: 0;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.field-info-btn:hover,
.field-info-btn:focus-visible {
  background: rgba(56, 189, 248, 0.2);
  border-color: var(--accent);
  outline: none;
}

.field-info-tooltip {
  position: absolute;
  top: calc(100% + 0.45rem);
  left: 0;
  right: 0;
  width: auto;
  padding: 0.75rem 0.9rem;
  background: rgba(13, 27, 54, 0.98);
  border: 1px solid var(--line-strong);
  border-radius: var(--radius-sm);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
  color: var(--text-mid);
  font-family: var(--font-body);
  font-size: 0.82rem;
  font-weight: 400;
  letter-spacing: normal;
  line-height: 1.45;
  text-transform: none;
  z-index: 30;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: opacity 0.15s ease, visibility 0.15s ease;
}

.field-label-row.is-open .field-info-tooltip {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}

.field-info-intro {
  margin: 0 0 0.65rem;
}

.field-info-tooltip :deep(.field-info-heading) {
  margin: 0 0 0.4rem;
  font-family: var(--font-display);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--text-hi);
  text-transform: uppercase;
}

.field-info-tooltip :deep(.field-info-list) {
  margin: 0;
  padding-left: 1.1rem;
}

.field-info-tooltip :deep(.field-info-list li) {
  margin-bottom: 0.35rem;
}

.field-info-tooltip :deep(.field-info-list li:last-child) {
  margin-bottom: 0;
}

.field-info-tooltip .field-info-example {
  margin: 0.65rem 0 0;
  font-size: 0.8rem;
  color: var(--text-low);
  line-height: 1.45;
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

  .form-group > label:not(.toggle-label) {
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
  flex-direction: column;
  gap: 0.5rem;
}

.display-toggle-label {
  font-family: var(--font-display);
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--text-mid);
}

.toggle-label {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  user-select: none;
  width: fit-content;
}

.toggle-input {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
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
