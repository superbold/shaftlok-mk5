<template>
  <div class="page-shell">
    <BreadcrumbNav :items="[{ name: 'Get a Quote' }]" />

    <div class="section-head" v-reveal>
      <span class="eyebrow"><i class="fas fa-ruler-combined"></i> Request a Quote</span>
      <h1>Get a <span class="shaftlok-font grad-text">Quote</span></h1>
      <p>Tell us about your vessel and we'll find the right Shaft Lok solution for you.</p>
    </div>

    <div class="quote-wrap">
      <form v-if="!submitted" class="quote-form glass-card" @submit.prevent="submitForm">

        <div class="form-section">
          <h2 class="section-label"><i class="fas fa-user"></i> Your Contact Info</h2>
          <div class="form-row">
            <div class="form-group">
              <label for="name">Your Name</label>
              <input id="name" v-model="form.name" type="text" class="form-control" placeholder="Jane Smith" required />
            </div>
            <div class="form-group">
              <label for="email">Your Email</label>
              <input id="email" v-model="form.email" type="email" class="form-control" placeholder="you@example.com" required />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="phone">Phone Number</label>
              <input id="phone" v-model="form.phone" type="tel" class="form-control" placeholder="e.g. (954) 555-0142" />
            </div>
            <div class="form-group">
              <label>Phone Region</label>
              <div class="radio-group">
                <label class="radio-option">
                  <input type="radio" v-model="form.phoneRegion" value="us" name="phoneRegion" />
                  <span>US / Canada</span>
                </label>
                <label class="radio-option">
                  <input type="radio" v-model="form.phoneRegion" value="europe" name="phoneRegion" />
                  <span>Europe / International</span>
                </label>
              </div>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group full-width">
              <label for="address">Address <span class="optional">(optional)</span></label>
              <textarea id="address" v-model="form.address" class="form-control" rows="2" placeholder="Street, City, State/Province, Postal Code, Country"></textarea>
            </div>
          </div>
        </div>

        <div class="form-section">
          <h2 class="section-label"><i class="fas fa-ship"></i> Your Vessel</h2>
          <div class="form-row">
            <div class="form-group">
              <label for="yachtType">Yacht Type &amp; Length</label>
              <input id="yachtType" v-model="form.yachtType" type="text" class="form-control" placeholder="e.g. Morgan 41" />
            </div>
            <div class="form-group">
              <label for="yachtName">Yacht Name (on stern)</label>
              <input id="yachtName" v-model="form.yachtName" type="text" class="form-control" placeholder='e.g. "Saltwater Gypsy"' />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="displacement">Displacement</label>
              <input id="displacement" v-model="form.displacement" type="text" class="form-control" placeholder="e.g. 20 tons" />
            </div>
            <div class="form-group">
              <label for="maxHullSpeed">Max Hull Speed</label>
              <input id="maxHullSpeed" v-model="form.maxHullSpeed" type="text" class="form-control" placeholder="e.g. 6–10 knots under sail" />
            </div>
          </div>
        </div>

        <div class="form-section">
          <h2 class="section-label"><i class="fas fa-cog"></i> Propeller</h2>
          <div class="form-row three-col">
            <div class="form-group">
              <label for="shaftDiameter">Shaft Diameter</label>
              <input id="shaftDiameter" v-model="form.shaftDiameter" type="text" class="form-control" placeholder="e.g. 1.5 inches" />
            </div>
            <div class="form-group">
              <label for="propDiameter">Propeller Diameter</label>
              <input id="propDiameter" v-model="form.propDiameter" type="text" class="form-control" placeholder="e.g. 26 inches" />
            </div>
            <div class="form-group">
              <label for="numBlades">Number of Blades</label>
              <input id="numBlades" v-model="form.numBlades" type="text" class="form-control" placeholder="e.g. 3 blades" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="numPropellers">Number of Propellers / Shafts</label>
              <input id="numPropellers" v-model="form.numPropellers" type="text" class="form-control" placeholder="e.g. 1 (2 for twin-shaft boats)" />
            </div>
            <div class="form-group">
              <label for="propType">Fixed, Folding, or Feathering?</label>
              <input id="propType" v-model="form.propType" type="text" class="form-control" placeholder="e.g. Feathering – Brunton Autoprop" />
            </div>
          </div>
        </div>

        <div class="form-section">
          <h2 class="section-label"><i class="fas fa-tachometer-alt"></i> Engine &amp; Transmission</h2>
          <div class="form-row">
            <div class="form-group">
              <label for="engine">Engine Make &amp; HP</label>
              <input id="engine" v-model="form.engine" type="text" class="form-control" placeholder="e.g. Diesel 80HP at 3500 rpm" />
            </div>
            <div class="form-group">
              <label for="transmission">Transmission Make &amp; Ratio</label>
              <input id="transmission" v-model="form.transmission" type="text" class="form-control" placeholder="e.g. ZF 63A – ratio 2.04" />
            </div>
          </div>
        </div>

        <div class="form-section">
          <h2 class="section-label"><i class="fas fa-lock"></i> Locking System</h2>
          <div class="form-row">
            <div class="form-group full-width">
              <label>Are you interested in the Simple Spring Locking System or the Marine Control Cable?</label>
              <div class="radio-group">
                <label class="radio-option">
                  <input type="radio" v-model="form.lockingSystem" value="spring" name="lockingSystem" />
                  <span>Simple Spring Locking System</span>
                </label>
                <label class="radio-option">
                  <input type="radio" v-model="form.lockingSystem" value="cable" name="lockingSystem" />
                  <span>Marine Control Cable</span>
                </label>
              </div>
            </div>
          </div>
          <div class="form-row" v-if="form.lockingSystem === 'cable'">
            <div class="form-group">
              <label for="cableLength">Cable Length Needed (feet)</label>
              <input id="cableLength" v-model="form.cableLength" type="text" class="form-control" placeholder="e.g. 12 ft" />
            </div>
          </div>
          <p v-if="form.lockingSystem === 'cable'" class="hint-note">
            The Marine Control Cable adds to the base quote — Sean will factor the length above into your pricing.
          </p>
        </div>

        <div class="form-section no-border">
          <div class="form-group full-width">
            <label for="notes">Additional Notes <span class="optional">(optional)</span></label>
            <textarea id="notes" v-model="form.notes" class="form-control" rows="4" placeholder="Anything else you'd like us to know…"></textarea>
          </div>
        </div>

        <div v-if="error" class="form-error" role="alert">
          <i class="fas fa-exclamation-circle"></i> {{ error }}
        </div>

        <p class="privacy-note">
          Your information is used solely to respond to your quote request.
          See our <NuxtLink to="/privacy">Privacy Policy</NuxtLink>.
        </p>

        <button type="submit" class="btn btn-primary submit-btn" :disabled="loading">
          <span v-if="loading"><i class="fas fa-spinner fa-spin"></i> Sending…</span>
          <span v-else><i class="fas fa-paper-plane"></i> Send Quote Request</span>
        </button>
      </form>

      <div v-else class="success-card glass-card" v-reveal>
        <div class="success-icon-wrap">
          <i class="fas fa-check-circle"></i>
        </div>
        <h2>Request Sent!</h2>
        <p>Thank you, <strong>{{ form.name }}</strong>. Sean will review your vessel details and get back to you at <strong>{{ form.email }}</strong>.</p>
        <NuxtLink to="/" class="btn btn-ghost">Back to Home</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
const form = reactive({
  name: '',
  email: '',
  phone: '',
  phoneRegion: 'us',
  address: '',
  yachtType: '',
  yachtName: '',
  displacement: '',
  maxHullSpeed: '',
  shaftDiameter: '',
  propDiameter: '',
  numBlades: '',
  numPropellers: '',
  propType: '',
  engine: '',
  transmission: '',
  lockingSystem: '',
  cableLength: '',
  notes: ''
})

const loading = ref(false)
const submitted = ref(false)
const error = ref('')

async function submitForm() {
  loading.value = true
  error.value = ''
  try {
    await $fetch('/api/quote', { method: 'POST', body: form })
    submitted.value = true
  } catch {
    error.value = 'Something went wrong. Please try again or email sean.nigel@shaftlok.com directly.'
  } finally {
    loading.value = false
  }
}

useHead({
  title: 'Get a Quote',
  meta: [
    { name: 'description', content: "Request a Shaft Lok quote. Tell us about your vessel's propeller, engine, and hull details and we'll find the right solution for you." },
    { property: 'og:title', content: 'Get a Quote – Shaft Lok Inc.' },
    { property: 'og:description', content: 'Request a personalized Shaft Lok quote. Provide your vessel details and Sean will get back to you.' },
    { property: 'og:url', content: 'https://shaftlok.com/quote' }
  ],
  link: [{ rel: 'canonical', href: 'https://shaftlok.com/quote' }]
})

definePageMeta({ layout: 'default' })
</script>

<style scoped>
.quote-wrap {
  max-width: 760px;
  margin: 0 auto;
}

.quote-form {
  padding: 2.2rem 2.4rem;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.form-section {
  padding-bottom: 1.8rem;
  margin-bottom: 1.8rem;
  border-bottom: 1px solid var(--line);
}

.form-section.no-border {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.section-label {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-family: var(--font-display);
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--accent);
  margin: 0 0 1.2rem;
}

.section-label i {
  font-size: 0.85rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-row.three-col {
  grid-template-columns: 1fr 1fr 1fr;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-family: var(--font-display);
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--text-mid);
  letter-spacing: 0.04em;
}

.optional {
  font-weight: 400;
  color: var(--text-low);
}

.form-control {
  width: 100%;
  padding: 0.65rem 0.9rem;
  background: rgba(13, 27, 54, 0.65);
  border: 1px solid var(--line-strong);
  border-radius: var(--radius-sm);
  color: var(--text-hi);
  font-family: var(--font-body);
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  box-sizing: border-box;
}

.form-control::placeholder { color: var(--text-low); }

.form-control:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.12);
}

textarea.form-control { resize: vertical; min-height: 100px; }

.radio-group {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  height: 100%;
  min-height: 2.6rem;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: var(--text-mid);
  cursor: pointer;
}

.radio-option input[type='radio'] {
  accent-color: var(--accent);
  width: 1rem;
  height: 1rem;
  cursor: pointer;
}

.hint-note {
  font-size: 0.82rem;
  color: var(--text-low);
  margin: 0.9rem 0 0;
  line-height: 1.5;
}

.form-error {
  background: rgba(252, 165, 165, 0.1);
  border: 1px solid rgba(252, 165, 165, 0.3);
  border-radius: var(--radius-sm);
  padding: 0.8rem 1rem;
  color: #FCA5A5;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.submit-btn {
  margin-top: 1.6rem;
  align-self: flex-start;
  padding: 0.75rem 2rem;
  font-size: 1rem;
}

.privacy-note {
  font-size: 0.82rem;
  color: var(--text-low);
  margin: 1.4rem 0 0;
  line-height: 1.5;
}

.privacy-note a {
  color: var(--text-mid);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.privacy-note a:hover { color: var(--accent); }

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Success state */
.success-card {
  text-align: center;
  padding: 3.5rem 2.4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.success-icon-wrap {
  font-size: 3rem;
  color: var(--accent-2);
  line-height: 1;
}

.success-card h2 {
  font-size: 1.6rem;
  margin: 0;
}

.success-card p {
  color: var(--text-mid);
  max-width: 400px;
  margin: 0;
  line-height: 1.6;
}

.success-card strong { color: var(--text-hi); }

@media (max-width: 680px) {
  .quote-form { padding: 1.6rem 1.4rem; }
  .form-row, .form-row.three-col { grid-template-columns: 1fr; }
}
</style>
