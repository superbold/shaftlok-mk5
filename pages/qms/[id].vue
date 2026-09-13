<template>
  <div>
    <div class="yacht-container narrow">
      <BreadcrumbNav admin :items="[{ name: 'Quote Management', to: '/qms' }, { name: quote?.name || 'Quote' }]" />

      <div v-if="loading" class="loading-indicator">
        <i class="fas fa-spinner fa-spin"></i>
        Loading quote...
      </div>

      <div v-else-if="error" class="error-message">
        <i class="fas fa-exclamation-triangle"></i>
        {{ error }}
      </div>

      <template v-else-if="quote">
        <div class="detail-head glass-card">
          <div>
            <h1>{{ quote.name }}</h1>
            <p class="detail-sub">{{ quote.email }} · submitted {{ formatDate(quote.created_at) }}</p>
          </div>
          <span class="status-badge" :class="`status-${quote.status}`" :title="quoteStatusDescription(quote.status)">{{ statusLabel(quote.status) }}</span>
        </div>

        <section id="inquiry-section" class="detail-section">
          <h2 class="section-heading">Inquiry</h2>

          <div v-for="section in sections" :key="section.title" class="glass-card summary-card">
            <h2 class="section-label"><i :class="section.icon"></i> {{ section.title }}</h2>
            <dl>
              <template v-for="[label, value] in section.fields" :key="label">
                <div class="field-row">
                  <dt>{{ label }}</dt>
                  <dd>{{ value || '—' }}</dd>
                </div>
              </template>
            </dl>
          </div>

          <div v-if="quote.notes" class="glass-card summary-card">
            <h2 class="section-label"><i class="fas fa-sticky-note"></i> Sailor's Notes</h2>
            <p class="notes-text">{{ quote.notes }}</p>
          </div>
        </section>

        <section id="quote-section" class="detail-section">
          <h2 class="section-heading section-heading-quote">Quote</h2>

          <div class="glass-card action-card">
            <div class="form-group">
              <label for="status" class="status-label">
                Status
                <QuoteStatusLegend />
              </label>
              <select
                id="status"
                :value="editForm.status"
                class="form-control"
                @change="onStatusChange($event)"
              >
                <option
                  v-for="s in QUOTE_STATUSES"
                  :key="s.value"
                  :value="s.value"
                  :disabled="s.value === 'followed_up' && !canMarkFollowedUp"
                >
                  {{ s.label }}{{ s.value === 'followed_up' && !canMarkFollowedUp ? ' (send quote first)' : '' }}
                </option>
              </select>
              <p v-if="needsPrice || needsShippingPrice || needsShippingNotes || needsMessage" class="field-hint">
                Set item prices, shipping, and message below before sending.
              </p>
              <p v-else-if="editForm.status === 'new'" class="field-hint field-hint-ready">
                Ready to send — items, shipping, and message are filled in.
              </p>
            </div>

            <div class="form-group">
              <label>Items Quoted</label>
              <div v-for="(item, i) in editForm.line_items" :key="i" class="line-item-row">
                <div class="line-item-product">
                  <select
                    class="form-control"
                    :value="item.product_slug"
                    @change="onLineItemProductChange(i, $event.target.value)"
                  >
                    <option value="" disabled>Select a product…</option>
                    <option v-for="p in pickableProducts" :key="p.slug" :value="p.slug">
                      {{ productOptionLabel(p) }}
                    </option>
                  </select>
                  <p v-if="lineItemPriceHint(item)" class="line-item-hint" :class="{ 'line-item-hint-ready': getCatalogLinePrice(item) != null && !item.price_manual }">
                    {{ lineItemPriceHint(item) }}
                  </p>
                  <button
                    v-if="item.price_manual && getCatalogLinePrice(item) != null"
                    type="button"
                    class="btn-link-recalc"
                    @click="resetLineItemPrice(i)"
                  >
                    Reset from catalog
                  </button>
                </div>
                <input
                  v-model="item.detail"
                  type="text"
                  class="form-control line-item-detail"
                  :placeholder="detailPlaceholder(item.product_slug)"
                  @input="onLineItemDetailInput(i)"
                />
                <div class="line-item-price">
                  <input
                    v-model="item.price"
                    type="number"
                    step="0.01"
                    min="0"
                    class="form-control"
                    :class="{ 'form-control-attention': item.product_slug && parseMoneyField(item.price) == null }"
                    placeholder="Price"
                    aria-label="Item price"
                    @input="onLineItemPriceInput(i)"
                  />
                </div>
                <button type="button" class="btn btn-secondary btn-icon" @click="removeLineItem(i)" aria-label="Remove item">
                  <i class="fas fa-times"></i>
                </button>
              </div>
              <button type="button" class="btn btn-secondary" @click="addLineItem">
                <i class="fas fa-plus"></i> Add Item
              </button>
              <p v-if="needsPrice" class="field-hint">Each item needs a price before send.</p>
            </div>

            <div class="form-group">
              <div class="quote-subtotal-row" :class="{ 'is-incomplete': needsPrice }">
                <span>Products</span>
                <strong>{{ needsPrice ? '—' : formatMoney(editForm.quoted_price) }}</strong>
              </div>
              <p v-if="!needsPrice" class="field-hint field-hint-ready">
                Sum of item prices{{ hasLengthPricedLineItem ? ' (length tiers apply when seeded)' : '' }}.
              </p>
            </div>

            <div class="form-group shipping-section">
              <label class="section-sublabel">Shipping</label>
              <div class="shipping-fields">
                <div class="shipping-notes-field">
                  <label for="shipping-notes">Details</label>
                  <input
                    id="shipping-notes"
                    v-model="editForm.shipping_notes"
                    type="text"
                    class="form-control"
                    :class="{ 'form-control-attention': needsShippingNotes }"
                    placeholder="e.g. UPS Ground, 5–7 days — or Included / TBD notes"
                  />
                </div>
                <div class="shipping-price-field">
                  <label for="shipping-price">Price ($)</label>
                  <input
                    id="shipping-price"
                    v-model="editForm.shipping_price"
                    type="number"
                    step="0.01"
                    min="0"
                    class="form-control"
                    :class="{ 'form-control-attention': needsShippingPrice }"
                    placeholder="e.g. 85.00"
                  />
                </div>
              </div>
              <p v-if="needsShippingPrice || needsShippingNotes" class="field-hint">
                Shipping details and price are required before send (use 0 if shipping is included).
              </p>
            </div>

            <div class="form-group quote-total-block">
              <div class="quote-total-row">
                <span>Total</span>
                <strong>{{ formatMoney(quoteGrandTotal) }}</strong>
              </div>
              <p class="field-hint field-hint-ready">Products + shipping</p>
            </div>

            <div class="form-group">
              <label for="quote-notes">Message to Sailor</label>
              <textarea
                id="quote-notes"
                v-model="editForm.quote_notes"
                rows="6"
                class="form-control"
                :class="{ 'form-control-attention': needsMessage }"
                placeholder="What's included, lead time, anything else the sailor should know..."
              ></textarea>
              <p v-if="needsMessage" class="field-hint">Required before send.</p>
            </div>

            <div class="form-group">
              <label>Email Attachments (from Shaft Lok Library)</label>
              <p class="field-hint field-hint-ready">
                Optional. Checked files are attached when you send.
                <NuxtLink to="/library" class="inline-link">Manage library</NuxtLink>
              </p>
              <div v-if="libraryDocs.length" class="attach-list">
                <label
                  v-for="doc in libraryDocs"
                  :key="doc.id"
                  class="attach-row"
                >
                  <input
                    type="checkbox"
                    :checked="editForm.attachment_ids.includes(doc.id)"
                    @change="toggleAttachment(doc.id, $event.target.checked)"
                  />
                  <span class="attach-meta">
                    <span class="attach-title">{{ doc.title || doc.file_name }}</span>
                    <span class="attach-sub">{{ doc.file_name }} · {{ formatBytes(doc.file_size) }}</span>
                  </span>
                </label>
              </div>
              <p v-else class="preview-empty">
                No documents in the library yet.
                <NuxtLink to="/library" class="inline-link">Upload files</NuxtLink>
                to attach them here.
              </p>
              <p v-if="selectedAttachmentCount" class="field-hint">
                {{ selectedAttachmentCount }} selected
                <template v-if="selectedAttachmentBytes"> · {{ formatBytes(selectedAttachmentBytes) }} total</template>
                <template v-if="attachmentsMayBeTooLarge"> — email may be too large; remove some files.</template>
              </p>
            </div>

            <div class="form-group">
              <label>Warnings That Will Be Included</label>
              <div v-if="applicableWarnings.length" class="preview-stack">
                <div v-for="warning in applicableWarnings" :key="warning.title" class="preview-block">
                  <p class="preview-title">{{ warning.title }}</p>
                  <p v-for="(p, i) in warning.paragraphs" :key="i" class="preview-text">{{ p }}</p>
                </div>
              </div>
              <p v-else class="preview-empty">No item-specific warnings for the currently selected items.</p>
            </div>

            <div class="form-group">
              <label>Payment Info Sent With Every Quote</label>
              <div class="preview-block">
                <p class="preview-text">{{ PAYMENT_INFO.intro }}</p>
                <p class="preview-text">{{ PAYMENT_INFO.method }}</p>
                <p class="preview-text">{{ PAYMENT_INFO.bank.name }}, {{ PAYMENT_INFO.bank.phone }} · Swift {{ PAYMENT_INFO.bank.swift }} · Routing {{ PAYMENT_INFO.bank.routing }}</p>
                <p class="preview-text">{{ PAYMENT_INFO.bank.address }}</p>
                <p class="preview-text">{{ PAYMENT_INFO.beneficiary.name }} — {{ PAYMENT_INFO.beneficiary.accountType }} #{{ PAYMENT_INFO.beneficiary.accountNumber }}</p>
              </div>
            </div>

            <div class="form-group">
              <label>Terms and Conditions Sent With Every Quote</label>
              <div class="preview-block">
                <ol class="preview-terms">
                  <li v-for="term in TERMS_AND_CONDITIONS" :key="term">{{ term }}</li>
                </ol>
              </div>
            </div>

            <div v-if="saveMessage" class="save-message" :class="{ 'save-error': saveError }">{{ saveMessage }}</div>

            <div class="action-buttons">
              <button @click="saveQuote" class="btn btn-secondary" :disabled="saving">
                <i class="fas fa-spinner fa-spin" v-if="saving"></i>
                {{ saving ? 'Saving...' : 'Save' }}
              </button>
              <button
                @click="handleSendClick"
                class="btn btn-primary"
                :disabled="sending || missingSendRequirements.length > 0"
                :title="sendRequirementsHint"
              >
                <i class="fas fa-spinner fa-spin" v-if="sending"></i>
                <i class="fas fa-paper-plane" v-else></i>
                {{ sending ? 'Sending...' : 'Send Quote to Sailor' }}
              </button>
            </div>
            <p v-if="missingSendRequirements.length" class="send-hint">{{ sendRequirementsHint }}</p>

            <div v-if="postSendStatuses.includes(quote.status)" class="decision-buttons">
              <button @click="markDecision('won')" class="btn btn-won" :disabled="deciding">Mark Won</button>
              <button @click="markDecision('dead')" class="btn btn-lost" :disabled="deciding">Mark Dead</button>
            </div>
          </div>
        </section>

        <section v-if="quote.sent_html" id="sent-section" class="detail-section">
          <h2 class="section-heading">Sent to Sailor</h2>
          <p class="section-sub">
            Exactly what {{ quote.name }} received{{ quote.sent_at ? ` on ${formatDate(quote.sent_at)}` : '' }}.
            <template v-if="quoteValidUntilLabel"> Valid until {{ quoteValidUntilLabel }}.</template>
          </p>
          <EmailFrame :html="quote.sent_html" :title="`Quote sent to ${quote.name}`" />
        </section>

        <div v-if="showFirstSendModal" class="modal" @click="showFirstSendModal = false">
          <div class="modal-content" @click.stop>
            <h2 class="modal-title">Send Quote to Sailor</h2>
            <p class="modal-text">
              Send this quote to {{ quote.name }} at {{ quote.email }}? The sailor will receive the products/shipping total, your message, payment instructions, and terms and conditions by email.
              <template v-if="selectedAttachmentCount"> {{ selectedAttachmentCount }} library document{{ selectedAttachmentCount === 1 ? '' : 's' }} will be attached.</template>
            </p>
            <div class="modal-actions">
              <button @click="showFirstSendModal = false" class="btn btn-secondary">Cancel</button>
              <button @click="confirmSend" class="btn btn-primary" :disabled="sending">
                <i class="fas fa-spinner fa-spin" v-if="sending"></i>
                <i class="fas fa-paper-plane" v-else></i>
                {{ sending ? 'Sending...' : 'Send Quote' }}
              </button>
            </div>
          </div>
        </div>

        <div v-if="showAlreadySentModal" class="modal" @click="showAlreadySentModal = false">
          <div class="modal-content" @click.stop>
            <h2 class="modal-title">Already Sent</h2>
            <p class="modal-text" v-if="quoteContentUnchanged">Nothing has changed since this quote was sent to {{ quote.name }} on {{ formatDate(quote.sent_at) }}. Sending now will resend the exact same quote — continue?</p>
            <p class="modal-text" v-else>This quote was already sent to {{ quote.name }} on {{ formatDate(quote.sent_at) }}. Send the updated version instead?</p>
            <div class="modal-actions">
              <button @click="showAlreadySentModal = false" class="btn btn-secondary">Cancel</button>
              <button @click="confirmSend" class="btn btn-primary" :disabled="sending">
                <i class="fas fa-spinner fa-spin" v-if="sending"></i>
                <i class="fas fa-paper-plane" v-else></i>
                {{ sending ? 'Sending...' : 'Send Updated Quote' }}
              </button>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  getProductLineItemPrice,
  getProductPriceRangeFromProduct,
  getResolvedProductPriceTiers,
  getTierLengthBounds,
  MARINE_CONTROL_CABLE_SLUG,
  parseCableLengthFeet,
  productUsesLengthPricing
} from '~~/utils/productPricing'
import { formatQuoteValidUntil } from '~~/utils/quoteValidity'

definePageMeta({
  layout: 'qms-layout',
  middleware: 'admin'
})

const route = useRoute()
const supabase = useSupabaseClient()

const quote = ref(null)
const loading = ref(true)
const error = ref(null)
const saving = ref(false)
const sending = ref(false)
const deciding = ref(false)
const saveMessage = ref('')
const saveError = ref(false)
const showAlreadySentModal = ref(false)
const showFirstSendModal = ref(false)

const editForm = ref({
  status: 'new',
  quoted_price: '',
  shipping_price: '',
  shipping_notes: '',
  quote_notes: '',
  line_items: [],
  attachment_ids: []
})
const pickableProducts = ref([])
const libraryDocs = ref([])

/** Soft cap: Resend total email size is ~40MB; leave room for HTML. */
const ATTACHMENT_WARN_BYTES = 35 * 1024 * 1024

const formatBytes = (bytes) => {
  const n = Number(bytes) || 0
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / (1024 * 1024)).toFixed(1)} MB`
}

const normalizeAttachmentIds = (ids) =>
  [...(Array.isArray(ids) ? ids : [])].map(String).filter(Boolean).sort()

const sameAttachmentIds = (a, b) =>
  JSON.stringify(normalizeAttachmentIds(a)) === JSON.stringify(normalizeAttachmentIds(b))

const selectedAttachmentCount = computed(() => editForm.value.attachment_ids.length)

const selectedAttachmentBytes = computed(() => {
  const selected = new Set(editForm.value.attachment_ids)
  return libraryDocs.value
    .filter((doc) => selected.has(doc.id))
    .reduce((sum, doc) => sum + (Number(doc.file_size) || 0), 0)
})

const attachmentsMayBeTooLarge = computed(() =>
  selectedAttachmentBytes.value > ATTACHMENT_WARN_BYTES
)

const toggleAttachment = (id, checked) => {
  const ids = editForm.value.attachment_ids
  if (checked) {
    if (!ids.includes(id)) ids.push(id)
  } else {
    editForm.value.attachment_ids = ids.filter((existing) => existing !== id)
  }
}

const statusLabel = quoteStatusLabel
const formatDate = (value) => value ? new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'
const formatMoney = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value) || 0)
const quoteValidUntilLabel = computed(() =>
  quote.value?.sent_at ? formatQuoteValidUntil(quote.value.sent_at, { month: 'short', day: 'numeric', year: 'numeric' }) : ''
)

const parseMoneyField = (value) => {
  if (value === '' || value == null) return null
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

const getProductBySlug = (slug) =>
  pickableProducts.value.find((p) => p.slug === slug)

/** Catalog list/tier price for a line (not the editable stored price). */
const getCatalogLinePrice = (item) => {
  if (!item?.product_slug) return null
  return getProductLineItemPrice(
    getProductBySlug(item.product_slug),
    item.detail,
    quote.value?.cable_length
  )
}

const productOptionLabel = (product) => {
  if (productUsesLengthPricing(product)) {
    const range = getProductPriceRangeFromProduct(product)
    return range ? `${product.name} — length-priced (${range})` : `${product.name} — length-priced`
  }
  const formatted = formatProductPrice(product.price)
  return formatted ? `${product.name} — ${formatted}` : product.name
}

const selectedLineItems = () =>
  editForm.value.line_items.filter((item) => item.product_slug)

const syncQuotedPriceFromLineItems = () => {
  const selected = selectedLineItems()
  if (!selected.length || selected.some((item) => parseMoneyField(item.price) == null)) {
    editForm.value.quoted_price = ''
    return
  }
  const total = selected.reduce((sum, item) => sum + parseMoneyField(item.price), 0)
  editForm.value.quoted_price = Number(total.toFixed(2))
}

const seedLineItemPrice = (i, { force = false } = {}) => {
  const item = editForm.value.line_items[i]
  if (!item?.product_slug) return
  if (item.price_manual && !force) return
  const catalog = getCatalogLinePrice(item)
  if (catalog != null) {
    item.price = Number(catalog.toFixed(2))
    item.price_manual = false
  } else if (force || parseMoneyField(item.price) == null) {
    item.price = ''
    item.price_manual = false
  }
  syncQuotedPriceFromLineItems()
}

const hydrateLineItemPrices = (items) => {
  for (const item of items) {
    if (!item.product_slug) {
      item.price = item.price ?? ''
      item.price_manual = false
      continue
    }
    const stored = parseMoneyField(item.price)
    const catalog = getCatalogLinePrice(item)
    if (stored == null && catalog != null) {
      item.price = Number(catalog.toFixed(2))
      item.price_manual = false
    } else if (stored != null) {
      item.price = Number(stored.toFixed(2))
      item.price_manual = catalog == null || stored !== Number(catalog.toFixed(2))
    } else {
      item.price = ''
      item.price_manual = false
    }
  }
}

const hasLengthPricedLineItem = computed(() =>
  editForm.value.line_items.some((item) => productUsesLengthPricing(getProductBySlug(item.product_slug)))
)

const lineItemPriceHint = (item) => {
  if (!item.product_slug) return ''
  const product = getProductBySlug(item.product_slug)
  const catalog = getCatalogLinePrice(item)
  if (item.price_manual && catalog != null) {
    return `Edited — catalog is ${formatProductPrice(catalog)}.`
  }
  if (catalog != null && !item.price_manual) {
    const feet = parseCableLengthFeet(item.detail) ?? parseCableLengthFeet(quote.value?.cable_length)
    return feet && productUsesLengthPricing(product)
      ? `From catalog: ${formatProductPrice(catalog)} (${feet}′ tier)`
      : `From catalog: ${formatProductPrice(catalog)}`
  }
  if (productUsesLengthPricing(product)) {
    const tiers = getResolvedProductPriceTiers(product)
    const bounds = tiers ? getTierLengthBounds(tiers) : { minFeet: 1, maxFeet: 30 }
    const feet = parseCableLengthFeet(item.detail) ?? parseCableLengthFeet(quote.value?.cable_length)
    if (feet != null) {
      return `Length ${feet}′ is outside the ${bounds.minFeet}–${bounds.maxFeet}′ catalog range — enter price manually.`
    }
    return `Enter length in feet (${bounds.minFeet}–${bounds.maxFeet}′) for tier pricing, or enter price manually.`
  }
  if (product?.price == null || product?.price === '') {
    return 'No list price in Product Management — enter price manually.'
  }
  return ''
}

const addLineItem = () => {
  editForm.value.line_items.push({
    product_slug: '',
    product_name: '',
    detail: '',
    price: '',
    price_manual: false
  })
}
const removeLineItem = (i) => {
  editForm.value.line_items.splice(i, 1)
  syncQuotedPriceFromLineItems()
}
const onLineItemProductChange = (i, slug) => {
  const product = pickableProducts.value.find((p) => p.slug === slug)
  const item = editForm.value.line_items[i]
  item.product_slug = slug
  item.product_name = product?.name ?? ''
  item.price_manual = false
  if (slug === MARINE_CONTROL_CABLE_SLUG && quote.value?.cable_length && !item.detail?.trim()) {
    item.detail = `${quote.value.cable_length} ft`
  }
  seedLineItemPrice(i, { force: true })
}

const onLineItemDetailInput = (i) => {
  seedLineItemPrice(i)
}

const onLineItemPriceInput = (i) => {
  editForm.value.line_items[i].price_manual = true
  syncQuotedPriceFromLineItems()
}

const resetLineItemPrice = (i) => {
  editForm.value.line_items[i].price_manual = false
  seedLineItemPrice(i, { force: true })
}

const serializeLineItems = (items) => (Array.isArray(items) ? items : [])
  .filter((li) => li?.product_slug)
  .map((li) => ({
    product_slug: li.product_slug,
    product_name: li.product_name ?? '',
    detail: li.detail?.trim() ? li.detail.trim() : null,
    price: parseMoneyField(li.price)
  }))

const detailPlaceholder = (slug) =>
  slug === 'marine-control-cable' ? 'e.g. 15 ft' : 'e.g. x2 (optional)'

const applicableWarnings = computed(() => getApplicableWarnings(editForm.value.line_items))

const needsPrice = computed(() => {
  const selected = selectedLineItems()
  if (!selected.length) return true
  return selected.some((item) => parseMoneyField(item.price) == null)
})
const needsShippingPrice = computed(() => editForm.value.shipping_price === '' || editForm.value.shipping_price == null)
const needsShippingNotes = computed(() => !editForm.value.shipping_notes?.trim())
const needsMessage = computed(() => !editForm.value.quote_notes?.trim())
const quoteGrandTotal = computed(() =>
  (parseMoneyField(editForm.value.quoted_price) ?? 0) + (parseMoneyField(editForm.value.shipping_price) ?? 0)
)
/** Exposed for template — Followed up / Won / Dead decision buttons. */
const postSendStatuses = POST_SEND_STATUSES
const canMarkFollowedUp = computed(() =>
  Boolean(quote.value?.sent_html) || postSendStatuses.includes(editForm.value.status)
)

const onStatusChange = (event) => {
  const next = event.target.value
  if (next === 'followed_up' && !canMarkFollowedUp.value) return
  editForm.value.status = next
}

const missingSendRequirements = computed(() => {
  const missing = []
  if (needsPrice.value) {
    missing.push(selectedLineItems().length ? 'a price on each quoted item' : 'at least one quoted item with a price')
  }
  if (needsShippingNotes.value) missing.push('shipping details')
  if (needsShippingPrice.value) missing.push('a shipping price')
  if (needsMessage.value) missing.push('a message to the sailor')
  return missing
})

const sendRequirementsHint = computed(() => {
  const missing = missingSendRequirements.value
  if (missing.length === 0) return ''
  if (missing.length === 1) return `Before sending, you still need ${missing[0]}.`
  const last = missing[missing.length - 1]
  const rest = missing.slice(0, -1)
  return `Before sending, you still need ${rest.join(', ')} and ${last}.`
})

const normalizeLineItems = (items) => serializeLineItems(items)

// Legacy quotes sent before the sent_* snapshot columns existed have
// sent_quoted_price === null even though sent_html is set — treat those as
// "unknown" rather than "unchanged" so we don't under-warn on old data.
const quoteContentUnchanged = computed(() => {
  const q = quote.value
  if (!q || !q.sent_html || q.sent_quoted_price == null) return false

  const currentPrice = parseMoneyField(editForm.value.quoted_price)
  const sentPrice = Number(q.sent_quoted_price)
  if (currentPrice !== sentPrice) return false

  const currentShipping = parseMoneyField(editForm.value.shipping_price)
  const sentShipping = q.sent_shipping_price == null ? null : Number(q.sent_shipping_price)
  if (currentShipping !== sentShipping) return false

  if ((editForm.value.shipping_notes || null) !== (q.sent_shipping_notes || null)) return false
  if ((editForm.value.quote_notes || null) !== (q.sent_quote_notes || null)) return false
  if (!sameAttachmentIds(editForm.value.attachment_ids, q.sent_attachment_ids)) return false

  return JSON.stringify(normalizeLineItems(editForm.value.line_items)) === JSON.stringify(normalizeLineItems(q.sent_line_items))
})

const lockingSystemLabel = computed(() => {
  if (!quote.value) return ''
  if (quote.value.locking_system === 'cable') {
    return `Marine Control Cable${quote.value.cable_length ? ` — ${quote.value.cable_length} ft` : ''}`
  }
  if (quote.value.locking_system === 'spring') return 'Simple Spring Locking System'
  if (quote.value.locking_system === 'unsure') return 'Not sure — needs guidance'
  return ''
})

const phoneLabel = computed(() => {
  if (!quote.value?.phone) return ''
  return `${quote.value.phone}${quote.value.phone_region === 'europe' ? ' (Europe / International)' : ' (US / Canada)'}`
})

const sections = computed(() => {
  if (!quote.value) return []
  const q = quote.value
  return [
    {
      title: 'Contact',
      icon: 'fas fa-user',
      fields: [
        ['Email', q.email],
        ['Phone', phoneLabel.value],
        ['Address', q.address]
      ]
    },
    {
      title: 'Vessel',
      icon: 'fas fa-ship',
      fields: [
        ['Yacht Type & Length', q.yacht_type],
        ['Yacht Name', q.yacht_name],
        ['Displacement', q.displacement],
        ['Max Hull Speed', q.max_hull_speed]
      ]
    },
    {
      title: 'Propeller',
      icon: 'fas fa-fan',
      fields: [
        ['Shaft Diameter', q.shaft_diameter],
        ['Propeller Diameter', q.prop_diameter],
        ['Propeller Pitch', q.prop_pitch],
        ['Custom Bore Interest', q.custom_bore_requested ? 'Yes — may need custom bore (confirm or remove in Items Quoted)' : 'No'],
        ['Number of Blades', q.num_blades],
        ['Number of Propellers / Shafts', q.num_propellers],
        ['Fixed / Folding / Feathering', q.prop_type]
      ]
    },
    {
      title: 'Engine & Transmission',
      icon: 'fas fa-tachometer-alt',
      fields: [
        ['Engine Make & HP', q.engine],
        ['Transmission Make & Ratio', q.transmission]
      ]
    },
    {
      title: 'Locking System',
      icon: 'fas fa-lock',
      fields: [
        ['Interested In', lockingSystemLabel.value]
      ]
    }
  ]
})

const loadQuote = async () => {
  try {
    loading.value = true
    error.value = null

    const { data, error: fetchError } = await supabase
      .from('quotes')
      .select('*')
      .eq('id', route.params.id)
      .single()

    if (fetchError) throw fetchError

    if (!data.read_at) {
      const now = new Date().toISOString()
      const { error: readError } = await supabase
        .from('quotes')
        .update({ read_at: now })
        .eq('id', data.id)
        .is('read_at', null)

      if (!readError) data.read_at = now
    }

    quote.value = data
    const lineItems = Array.isArray(data.line_items)
      ? data.line_items.map((item) => ({
          product_slug: item.product_slug ?? '',
          product_name: item.product_name ?? '',
          detail: item.detail ?? '',
          price: item.price ?? '',
          price_manual: false
        }))
      : []
    if (data.locking_system === 'cable' && data.cable_length) {
      for (const item of lineItems) {
        if (item.product_slug === MARINE_CONTROL_CABLE_SLUG && !item.detail?.trim()) {
          item.detail = `${data.cable_length} ft`
        }
      }
    }
    hydrateLineItemPrices(lineItems)
    editForm.value = {
      status: data.status,
      quoted_price: data.quoted_price ?? '',
      shipping_price: data.shipping_price ?? '',
      shipping_notes: data.shipping_notes ?? '',
      quote_notes: data.quote_notes ?? '',
      line_items: lineItems,
      attachment_ids: Array.isArray(data.attachment_ids) ? [...data.attachment_ids] : []
    }
    syncQuotedPriceFromLineItems()
  } catch (err) {
    console.error('Error loading quote:', err)
    error.value = `Failed to load quote: ${err.message}`
  } finally {
    loading.value = false
  }
}

const saveQuote = async () => {
  try {
    saving.value = true
    saveMessage.value = ''
    saveError.value = false

    syncQuotedPriceFromLineItems()

    const { error: updateError } = await supabase
      .from('quotes')
      .update({
        status: editForm.value.status,
        quoted_price: editForm.value.quoted_price === '' ? null : editForm.value.quoted_price,
        shipping_price: editForm.value.shipping_price === '' ? null : editForm.value.shipping_price,
        shipping_notes: editForm.value.shipping_notes?.trim() || null,
        quote_notes: editForm.value.quote_notes || null,
        line_items: serializeLineItems(editForm.value.line_items),
        attachment_ids: editForm.value.attachment_ids,
        updated_at: new Date().toISOString()
      })
      .eq('id', quote.value.id)

    if (updateError) throw updateError

    await loadQuote()
    saveMessage.value = 'Saved.'
  } catch (err) {
    console.error('Error saving quote:', err)
    saveError.value = true
    saveMessage.value = `Failed to save: ${err.message}`
  } finally {
    saving.value = false
  }
}

const sendQuote = async () => {
  try {
    sending.value = true
    saveMessage.value = ''
    saveError.value = false

    syncQuotedPriceFromLineItems()

    // Persist any pending edits before sending
    const { error: updateError } = await supabase
      .from('quotes')
      .update({
        status: editForm.value.status,
        quoted_price: editForm.value.quoted_price === '' ? null : editForm.value.quoted_price,
        shipping_price: editForm.value.shipping_price === '' ? null : editForm.value.shipping_price,
        shipping_notes: editForm.value.shipping_notes?.trim() || null,
        quote_notes: editForm.value.quote_notes || null,
        line_items: serializeLineItems(editForm.value.line_items),
        attachment_ids: editForm.value.attachment_ids,
        updated_at: new Date().toISOString()
      })
      .eq('id', quote.value.id)

    if (updateError) throw updateError

    await $fetch('/api/qms/send-quote', { method: 'POST', body: { quoteId: quote.value.id } })

    await loadQuote()
    saveMessage.value = 'Quote sent to sailor.'
  } catch (err) {
    console.error('Error sending quote:', err)
    saveError.value = true
    saveMessage.value = err.data?.statusMessage || err.message || 'Failed to send quote.'
  } finally {
    sending.value = false
  }
}

const handleSendClick = () => {
  if (quote.value?.sent_html) {
    showFirstSendModal.value = false
    showAlreadySentModal.value = true
  } else {
    showAlreadySentModal.value = false
    showFirstSendModal.value = true
  }
}

const confirmSend = () => {
  showAlreadySentModal.value = false
  showFirstSendModal.value = false
  sendQuote()
}

const markDecision = async (decision) => {
  try {
    deciding.value = true

    const { error: updateError } = await supabase
      .from('quotes')
      .update({ status: decision, decided_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq('id', quote.value.id)

    if (updateError) throw updateError

    await loadQuote()
  } catch (err) {
    console.error('Error marking decision:', err)
    alert('Error updating quote: ' + err.message)
  } finally {
    deciding.value = false
  }
}

const loadPickableProducts = async () => {
  const { data } = await supabase
    .from('products')
    .select('id, name, slug, price, price_tiers')
    .eq('display', true)
    .order('id', { ascending: true })

  pickableProducts.value = data || []
}

const loadLibraryDocs = async () => {
  const { data, error: fetchError } = await supabase
    .from('library_documents')
    .select('id, title, file_name, file_size, content_type, created_at')
    .order('title', { ascending: true })

  if (fetchError) {
    console.error('Error loading library documents:', fetchError)
    libraryDocs.value = []
    return
  }

  libraryDocs.value = data || []
}

onMounted(async () => {
  await Promise.all([loadPickableProducts(), loadLibraryDocs()])
  await loadQuote()
})

useHead({
  title: 'Quote Detail',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }]
})
</script>

<style scoped>
.narrow { max-width: 1000px; }

.detail-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.6rem 1.8rem;
  margin-bottom: 1.5rem;
}

.detail-head h1 {
  margin: 0 0 0.3rem;
  font-family: var(--font-display);
  font-size: 1.5rem;
  color: var(--text-hi);
}

.detail-sub {
  margin: 0;
  color: var(--text-mid);
  font-size: 0.9rem;
}

.detail-section {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-bottom: 2rem;
  scroll-margin-top: calc(var(--nav-height) + 1.5rem);
}

.section-heading {
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--text-hi);
  margin: 0;
}

.section-heading-quote {
  color: var(--gold);
}

.section-sub {
  margin: -0.75rem 0 0;
  color: var(--text-mid);
  font-size: 0.9rem;
}

.summary-card, .action-card {
  padding: 1.5rem 1.7rem;
}

.action-card {
  background: rgba(245, 198, 107, 0.05);
  border-color: rgba(245, 198, 107, 0.3);
}

.section-label {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-family: var(--font-display);
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--accent);
  margin: 0 0 1rem;
}

dl { margin: 0; }

.field-row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--line);
}

.field-row:last-child { border-bottom: none; }

.field-row dt {
  color: var(--text-low);
  font-size: 0.85rem;
  flex-shrink: 0;
}

.field-row dd {
  margin: 0;
  color: var(--text-hi);
  font-size: 0.9rem;
  text-align: right;
}

.notes-text {
  margin: 0;
  color: var(--text-mid);
  line-height: 1.6;
  white-space: pre-wrap;
}

.form-group { margin-bottom: 1.2rem; }

.form-group label {
  display: block;
  margin-bottom: 0.4rem;
  font-family: var(--font-display);
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-mid);
}

.status-label {
  display: flex !important;
  align-items: center;
  gap: 0.5rem;
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
  box-sizing: border-box;
}

.form-control:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.18);
}

.form-control-attention {
  border-color: rgba(245, 198, 107, 0.65);
  box-shadow: 0 0 0 2px rgba(245, 198, 107, 0.12);
}

.form-control-attention:focus {
  border-color: var(--gold);
  box-shadow: 0 0 0 3px rgba(245, 198, 107, 0.2);
}

.field-hint {
  margin: 0.45rem 0 0;
  font-size: 0.82rem;
  color: var(--gold);
  line-height: 1.4;
}

.field-hint-ready {
  color: #5EEAD4;
}

textarea.form-control { resize: vertical; }

.line-item-row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  align-items: flex-start;
}

.line-item-product {
  flex: 2.2;
  min-width: 0;
}

.line-item-detail {
  flex: 1;
  min-width: 5rem;
}

.line-item-price {
  flex: 0 0 6.5rem;
}

.line-item-hint {
  margin: 0.35rem 0 0;
  font-size: 0.78rem;
  color: var(--gold);
  line-height: 1.35;
}

.line-item-hint-ready {
  color: #5EEAD4;
}

.line-item-row select.form-control { width: 100%; }

.quote-subtotal-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem 1rem;
  background: rgba(13, 27, 54, 0.45);
  border: 1px solid var(--line-strong);
  border-radius: var(--radius-sm);
  color: var(--text-hi);
  font-family: var(--font-display);
  font-size: 0.92rem;
}

.quote-subtotal-row.is-incomplete {
  border-color: rgba(245, 198, 107, 0.45);
}

.quote-subtotal-row strong {
  font-size: 1.05rem;
  font-weight: 700;
}

.btn-link-recalc {
  margin-top: 0.35rem;
  padding: 0;
  border: none;
  background: none;
  color: var(--accent);
  font-family: var(--font-display);
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.btn-link-recalc:hover {
  color: var(--text-hi);
}

.section-sublabel {
  display: block;
  margin-bottom: 0.55rem;
  font-family: var(--font-display);
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-mid);
}

.shipping-fields {
  display: grid;
  grid-template-columns: 1fr minmax(7rem, 8.5rem);
  gap: 0.65rem;
  align-items: end;
}

.shipping-fields label {
  margin-bottom: 0.3rem;
  font-size: 0.78rem;
}

.quote-total-block {
  margin-top: -0.35rem;
}

.quote-total-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.85rem 1rem;
  background: rgba(56, 189, 248, 0.08);
  border: 1px solid rgba(56, 189, 248, 0.22);
  border-radius: var(--radius-sm);
  color: var(--text-hi);
  font-family: var(--font-display);
  font-size: 0.95rem;
}

.quote-total-row strong {
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: 0.01em;
}

@media (max-width: 640px) {
  .line-item-row {
    flex-wrap: wrap;
  }

  .line-item-product {
    flex: 1 1 100%;
  }

  .line-item-detail {
    flex: 1 1 calc(100% - 8rem);
  }

  .line-item-price {
    flex: 0 0 6.5rem;
  }

  .shipping-fields {
    grid-template-columns: 1fr;
  }
}

.btn-icon {
  flex: none;
  padding: 0.65rem 0.9rem;
}

.preview-stack {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.preview-block {
  padding: 0.9rem 1rem;
  background: rgba(245, 198, 107, 0.06);
  border: 1px solid rgba(245, 198, 107, 0.2);
  border-radius: var(--radius-sm);
}

.preview-title {
  margin: 0 0 0.4rem;
  font-family: var(--font-display);
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--gold);
}

.preview-text {
  margin: 0 0 0.5rem;
  color: var(--text-mid);
  font-size: 0.87rem;
  line-height: 1.55;
}

.preview-text:last-child { margin-bottom: 0; }

.preview-terms {
  margin: 0;
  padding-left: 1.25rem;
  color: var(--text-mid);
  font-size: 0.87rem;
  line-height: 1.55;
}

.preview-terms li { margin-bottom: 0.45rem; }

.preview-terms li:last-child { margin-bottom: 0; }

.preview-empty {
  margin: 0;
  color: var(--text-low);
  font-size: 0.87rem;
  font-style: italic;
}

.inline-link {
  color: var(--accent);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.attach-list {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  max-height: 16rem;
  overflow: auto;
  padding: 0.15rem 0;
}

.attach-row {
  display: flex;
  align-items: flex-start;
  gap: 0.7rem;
  margin: 0;
  padding: 0.65rem 0.75rem;
  background: rgba(56, 189, 248, 0.05);
  border: 1px solid rgba(56, 189, 248, 0.16);
  border-radius: var(--radius-sm);
  cursor: pointer;
  color: var(--text-hi);
  font-weight: 400;
}

.attach-row input {
  margin-top: 0.2rem;
  flex: none;
}

.attach-meta {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
}

.attach-title {
  font-size: 0.9rem;
  color: var(--text-hi);
}

.attach-sub {
  font-size: 0.78rem;
  color: var(--text-mid);
  word-break: break-word;
}

.save-message {
  font-size: 0.85rem;
  color: #5EEAD4;
  margin-bottom: 1rem;
}

.save-message.save-error { color: #FCA5A5; }

.send-hint {
  font-size: 0.85rem;
  color: var(--text-low);
  margin: -0.3rem 0 0;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

.btn {
  padding: 0.75rem 1.4rem;
  border: 1px solid transparent;
  border-radius: 999px;
  font-family: var(--font-display);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn:disabled { opacity: 0.55; cursor: not-allowed; }

.btn-primary {
  background: var(--grad-accent);
  color: #04121F;
  box-shadow: 0 8px 24px -8px rgba(56, 189, 248, 0.55);
}

.btn-secondary {
  background: rgba(148, 197, 255, 0.07);
  border-color: var(--line-strong);
  color: var(--text-mid);
}

.btn-secondary:hover:not(:disabled) { background: rgba(148, 197, 255, 0.14); color: var(--text-hi); }

.decision-buttons {
  display: flex;
  gap: 0.7rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--line);
}

.btn-won {
  flex: 1;
  background: rgba(74, 222, 128, 0.14);
  border-color: rgba(74, 222, 128, 0.4);
  color: #4ADE80;
}

.btn-won:hover:not(:disabled) { background: rgba(74, 222, 128, 0.26); }

.btn-lost {
  flex: 1;
  background: rgba(248, 113, 113, 0.1);
  border-color: rgba(248, 113, 113, 0.4);
  color: #FCA5A5;
}

.btn-lost:hover:not(:disabled) { background: rgba(248, 113, 113, 0.22); }

.status-badge {
  display: inline-block;
  padding: 0.35rem 0.9rem;
  border-radius: 999px;
  font-family: var(--font-display);
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  flex-shrink: 0;
}

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
  max-width: 480px;
  width: 92%;
  padding: 1.6rem 1.8rem;
  box-shadow: var(--shadow-card), var(--glow-accent);
  color: var(--text-hi);
}

.modal-title {
  margin: 0 0 0.75rem;
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--gold);
}

.modal-text {
  margin: 0;
  color: var(--text-mid);
  line-height: 1.6;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.6rem;
}

.status-new { background: var(--status-new-bg); color: var(--status-new-fg); }
.status-sent { background: var(--status-sent-bg); color: var(--status-sent-fg); }
.status-followed_up { background: var(--status-followed_up-bg); color: var(--status-followed_up-fg); }
.status-won { background: var(--status-won-bg); color: var(--status-won-fg); }
.status-dead { background: var(--status-dead-bg); color: var(--status-dead-fg); }

</style>
