<template>
  <div class="yacht-form">
    <div class="form-row">
      <div class="form-group">
        <label for="yacht-name">Yacht Name *</label>
        <input 
          id="yacht-name" 
          :value="modelValue.name" 
          @input="updateField('name', $event.target.value)"
          type="text" 
          required 
          class="form-control"
        >
      </div>
      <div class="form-group">
        <label for="yacht-length">Length</label>
        <input 
          id="yacht-length" 
          :value="modelValue.length" 
          @input="updateField('length', $event.target.value)"
          type="text" 
          class="form-control"
        >
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label for="yacht-transmission">Transmission</label>
        <input 
          id="yacht-transmission" 
          :value="modelValue.transmission" 
          @input="updateField('transmission', $event.target.value)"
          type="text" 
          class="form-control"
        >
      </div>
      <div class="form-group">
        <label for="yacht-propeller">Propeller</label>
        <input 
          id="yacht-propeller" 
          :value="modelValue.propeller" 
          @input="updateField('propeller', $event.target.value)"
          type="text" 
          class="form-control"
        >
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label for="yacht-diameter">Diameter</label>
        <input 
          id="yacht-diameter" 
          :value="modelValue.diameter" 
          @input="updateField('diameter', $event.target.value)"
          type="text" 
          class="form-control"
        >
      </div>
      <div class="form-group">
        <label for="yacht-pitch">Pitch</label>
        <input 
          id="yacht-pitch" 
          :value="modelValue.pitch" 
          @input="updateField('pitch', $event.target.value)"
          type="text" 
          class="form-control"
        >
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label for="yacht-blades">Blades</label>
        <input 
          id="yacht-blades" 
          :value="modelValue.blades" 
          @input="updateField('blades', $event.target.value)"
          type="text" 
          class="form-control"
        >
      </div>
      <div class="form-group">
        <label for="yacht-shaft">Shaft</label>
        <input 
          id="yacht-shaft" 
          :value="modelValue.shaft" 
          @input="updateField('shaft', $event.target.value)"
          type="text" 
          class="form-control"
        >
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
.yacht-form {
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
  font-weight: 500;
  color: var(--federal-blue);
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-control:focus {
  outline: none;
  border-color: var(--honolulu-blue);
  box-shadow: 0 0 0 3px rgba(202, 240, 248, 0.3);
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

@media (max-width: 480px) {
  .form-control {
    padding: 0.875rem;
    font-size: 1.05rem;
  }
}
</style>