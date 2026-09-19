<template>
  <div class="quote-form-fields">
    <p v-if="showInboxNote" class="inbox-note">
      This creates a quote in Quote Management only. It does
      <strong>not</strong> send anything to your email inbox — there is no customer
      RFQ email for quotes you add here. Fill in what you have now; you can add the
      rest later on the quote.
    </p>

    <div class="form-row">
      <div class="form-group">
        <label :for="fid('name')">Name *</label>
        <input
          :id="fid('name')"
          :value="modelValue.name"
          type="text"
          required
          class="form-control"
          @input="updateField('name', $event.target.value)"
        >
      </div>
      <div class="form-group">
        <label :for="fid('email')">Email *</label>
        <input
          :id="fid('email')"
          :value="modelValue.email"
          type="email"
          required
          class="form-control"
          @input="updateField('email', $event.target.value)"
        >
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label :for="fid('company')">Company</label>
        <input
          :id="fid('company')"
          :value="modelValue.company"
          type="text"
          class="form-control"
          placeholder="Shipyard, architect, or contractor"
          @input="updateField('company', $event.target.value)"
        >
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label :for="fid('phone')">Phone</label>
        <input
          :id="fid('phone')"
          :value="modelValue.phone"
          type="tel"
          class="form-control"
          placeholder="e.g. (954) 555-0142"
          @input="updateField('phone', $event.target.value)"
        >
      </div>
      <div class="form-group">
        <span class="field-legend">Phone Region</span>
        <div class="radio-group">
          <label class="radio-option">
            <input
              type="radio"
              :name="fid('phone-region')"
              value="us"
              :checked="modelValue.phone_region !== 'europe'"
              @change="updateField('phone_region', 'us')"
            >
            <span>US / Canada</span>
          </label>
          <label class="radio-option">
            <input
              type="radio"
              :name="fid('phone-region')"
              value="europe"
              :checked="modelValue.phone_region === 'europe'"
              @change="updateField('phone_region', 'europe')"
            >
            <span>Europe / International</span>
          </label>
        </div>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label :for="fid('address')">Address</label>
        <textarea
          :id="fid('address')"
          :value="modelValue.address"
          class="form-control"
          rows="2"
          placeholder="Street, City, State/Province, Postal Code, Country"
          @input="updateField('address', $event.target.value)"
        ></textarea>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label :for="fid('yacht-type')">Yacht Type &amp; Length</label>
        <input
          :id="fid('yacht-type')"
          :value="modelValue.yacht_type"
          type="text"
          class="form-control"
          placeholder="e.g. Morgan 41"
          @input="updateField('yacht_type', $event.target.value)"
        >
      </div>
      <div class="form-group">
        <label :for="fid('yacht-name')">Yacht Name</label>
        <input
          :id="fid('yacht-name')"
          :value="modelValue.yacht_name"
          type="text"
          class="form-control"
          placeholder='e.g. "Saltwater Gypsy"'
          @input="updateField('yacht_name', $event.target.value)"
        >
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label :for="fid('displacement')">Displacement</label>
        <input
          :id="fid('displacement')"
          :value="modelValue.displacement"
          type="text"
          class="form-control"
          placeholder="e.g. 20 tons"
          @input="updateField('displacement', $event.target.value)"
        >
      </div>
      <div class="form-group">
        <label :for="fid('max-hull-speed')">Max Hull Speed</label>
        <input
          :id="fid('max-hull-speed')"
          :value="modelValue.max_hull_speed"
          type="text"
          class="form-control"
          placeholder="e.g. 6–10 knots under sail"
          @input="updateField('max_hull_speed', $event.target.value)"
        >
      </div>
    </div>
    <div class="form-row three-col">
      <div class="form-group">
        <label :for="fid('shaft-diameter')">Shaft Diameter</label>
        <input
          :id="fid('shaft-diameter')"
          :value="modelValue.shaft_diameter"
          type="text"
          class="form-control"
          placeholder="e.g. 1.5 inches"
          @input="updateField('shaft_diameter', $event.target.value)"
        >
      </div>
      <div class="form-group">
        <label :for="fid('prop-diameter')">Propeller Diameter</label>
        <input
          :id="fid('prop-diameter')"
          :value="modelValue.prop_diameter"
          type="text"
          class="form-control"
          placeholder="e.g. 26 inches"
          @input="updateField('prop_diameter', $event.target.value)"
        >
      </div>
      <div class="form-group">
        <label :for="fid('prop-pitch')">Propeller Pitch</label>
        <input
          :id="fid('prop-pitch')"
          :value="modelValue.prop_pitch"
          type="text"
          class="form-control"
          placeholder="e.g. 18 inches"
          @input="updateField('prop_pitch', $event.target.value)"
        >
      </div>
    </div>
    <div class="form-row three-col">
      <div class="form-group">
        <label :for="fid('num-blades')">Number of Blades</label>
        <input
          :id="fid('num-blades')"
          :value="modelValue.num_blades"
          type="text"
          class="form-control"
          placeholder="e.g. 3 blades"
          @input="updateField('num_blades', $event.target.value)"
        >
      </div>
      <div class="form-group">
        <label :for="fid('num-propellers')">Number of Propellers / Shafts</label>
        <input
          :id="fid('num-propellers')"
          :value="modelValue.num_propellers"
          type="text"
          class="form-control"
          placeholder="e.g. 1 (2 for twin-shaft boats)"
          @input="updateField('num_propellers', $event.target.value)"
        >
      </div>
      <div class="form-group">
        <label :for="fid('prop-type')">Fixed / Folding / Feathering</label>
        <input
          :id="fid('prop-type')"
          :value="modelValue.prop_type"
          type="text"
          class="form-control"
          placeholder="e.g. Feathering – Brunton Autoprop"
          @input="updateField('prop_type', $event.target.value)"
        >
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label :for="fid('engine')">Engine Make &amp; HP</label>
        <input
          :id="fid('engine')"
          :value="modelValue.engine"
          type="text"
          class="form-control"
          placeholder="e.g. Diesel 80HP at 3500 rpm"
          @input="updateField('engine', $event.target.value)"
        >
      </div>
      <div class="form-group">
        <label :for="fid('transmission')">Transmission Make &amp; Ratio</label>
        <input
          :id="fid('transmission')"
          :value="modelValue.transmission"
          type="text"
          class="form-control"
          placeholder="e.g. ZF 63A – ratio 2.04"
          @input="updateField('transmission', $event.target.value)"
        >
      </div>
    </div>
    <div class="radio-stack">
      <span class="field-legend">Locking System</span>
      <label class="radio-option">
        <input
          type="radio"
          :name="fid('locking-system')"
          value="spring"
          :checked="modelValue.locking_system === 'spring'"
          @change="updateField('locking_system', 'spring')"
        >
        <span>Simple Spring Locking System</span>
      </label>
      <label class="radio-option">
        <input
          type="radio"
          :name="fid('locking-system')"
          value="cable"
          :checked="modelValue.locking_system === 'cable'"
          @change="updateField('locking_system', 'cable')"
        >
        <span>Marine Control Cable</span>
      </label>
      <label class="radio-option">
        <input
          type="radio"
          :name="fid('locking-system')"
          value="unsure"
          :checked="modelValue.locking_system === 'unsure'"
          @change="updateField('locking_system', 'unsure')"
        >
        <span>Not sure — needs guidance</span>
      </label>
    </div>
    <div v-if="modelValue.locking_system === 'cable'" class="form-row">
      <div class="form-group">
        <label :for="fid('cable-length')">Cable Length Needed (feet)</label>
        <input
          :id="fid('cable-length')"
          :value="modelValue.cable_length"
          type="text"
          class="form-control"
          placeholder="e.g. 12 ft"
          @input="updateField('cable_length', $event.target.value)"
        >
      </div>
    </div>
    <div class="form-group">
      <label :for="fid('notes')">Notes</label>
      <textarea
        :id="fid('notes')"
        :value="modelValue.notes"
        rows="4"
        class="form-control"
        :placeholder="notesPlaceholder"
        @input="updateField('notes', $event.target.value)"
      ></textarea>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  },
  idPrefix: {
    type: String,
    default: 'add-quote'
  },
  showInboxNote: {
    type: Boolean,
    default: false
  },
  notesPlaceholder: {
    type: String,
    default: 'What did they ask for on the phone?'
  }
})

const emit = defineEmits(['update:modelValue'])

const fid = (suffix) => `${props.idPrefix}-${suffix}`

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

.inbox-note {
  margin: 0 0 1.2rem;
  padding: 0.8rem 1rem;
  background: rgba(245, 198, 107, 0.1);
  border: 1px solid rgba(245, 198, 107, 0.35);
  border-radius: var(--radius-sm);
  color: var(--gold);
  font-size: 0.88rem;
  line-height: 1.5;
}

.form-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.85rem;
}

.form-row.three-col {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.form-group {
  flex: 1;
  min-width: 0;
}

.form-group label,
.field-legend {
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
  background: rgba(4, 10, 24, 0.72);
  border: 1px solid rgba(148, 197, 255, 0.42);
  border-radius: var(--radius-sm);
  color: var(--text-hi);
  font-size: 1rem;
  box-sizing: border-box;
  cursor: text;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form-control:hover {
  border-color: var(--accent);
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

.radio-group,
.radio-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.2rem;
  min-height: 2.6rem;
  align-items: center;
}

.radio-stack {
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 0.85rem;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.9rem;
  color: var(--text-mid);
  cursor: pointer;
}

.radio-option input {
  accent-color: var(--accent);
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 0.75rem;
  }

  .form-row.three-col {
    display: flex;
    flex-direction: column;
  }
}
</style>
