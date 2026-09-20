<template>
  <div>
    <div class="yacht-container quote-detail">
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
          <div class="detail-head-main">
            <div class="detail-identity">
              <div class="detail-identity-row">
                <h1>{{ editForm.name || quote.name }}</h1>
                <span class="status-badge" :class="`status-${quote.status}`" :title="quoteStatusDescription(quote.status)">{{ statusLabel(quote.status) }}</span>
              </div>
              <p class="detail-sub">
                <span v-if="displayedQuoteNumber">{{ displayedQuoteNumber }} · </span>{{ editForm.email || quote.email }} · submitted {{ formatDate(quote.created_at) }}
              </p>
            </div>

            <div class="quote-actions">
              <div v-if="saveMessage" class="save-message" :class="{ 'save-error': saveError }">{{ saveMessage }}</div>
              <div class="quote-actions-row">
                <button type="button" class="btn btn-secondary" :disabled="saving" @click="saveQuote">
                  <i class="fas fa-spinner fa-spin" v-if="saving"></i>
                  {{ saving ? 'Saving...' : 'Save' }}
                </button>
                <button
                  type="button"
                  class="btn btn-primary"
                  :disabled="sending || missingSendRequirements.length > 0"
                  :title="sendRequirementsHint"
                  @click="handleSendClick"
                >
                  <i class="fas fa-spinner fa-spin" v-if="sending"></i>
                  <i class="fas fa-paper-plane" v-else></i>
                  {{ sending ? 'Sending...' : 'Send Quote' }}
                </button>
                <template v-if="postSendStatuses.includes(quote.status)">
                  <button type="button" class="btn btn-won" :disabled="deciding" @click="markDecision('won')">Mark Won</button>
                  <button type="button" class="btn btn-lost" :disabled="deciding" @click="markDecision('dead')">Mark Dead</button>
                </template>
                <div class="quote-actions-status">
                  <QuoteStatusLegend />
                  <select
                    id="status"
                    :value="editForm.status"
                    class="form-control"
                    aria-label="Status"
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
                </div>
              </div>
            </div>
          </div>
          <p v-if="missingSendRequirements.length" class="send-hint">{{ sendRequirementsHint }}</p>
          <p v-else-if="editForm.status === 'new'" class="field-hint field-hint-ready">
            Ready to send — items, shipping, and message are filled in.
          </p>
        </div>

        <div class="quote-workspace">
          <div class="owner-pane">
        <section id="message-section" class="detail-section">
          <div class="workspace-head message-head">
            <h2 class="section-heading">Message to Sailor</h2>
            <p class="section-sub">
              This is the note at the top of the email, after the greeting.
            </p>
          </div>
          <div class="owner-stack">
          <div class="glass-card action-card message-card">
            <div class="form-group">
              <div class="tabbed-field">
                <span v-if="needsMessage" class="attention-tab">Message</span>
                <textarea
                  id="quote-notes"
                  v-model="editForm.quote_notes"
                  rows="6"
                  class="form-control"
                  :class="{ 'form-control-attention': needsMessage }"
                  placeholder="What's included, lead time, anything else the sailor should know..."
                ></textarea>
              </div>
              <p v-if="needsMessage" class="field-hint">Required before send.</p>
            </div>
          </div>

        <section id="inquiry-section" class="detail-section">
          <div class="workspace-head inquiry-head">
            <h2 class="section-heading">Inquiry</h2>
            <p class="section-sub">
              Click any box to edit. Save writes this quote only — it does not email the sailor or your inbox.
            </p>
          </div>

          <form class="glass-card action-card inquiry-card" @submit.prevent="saveQuote">
            <p v-if="quote.custom_bore_requested" class="field-hint">
              This sailor checked Custom Bore on an older RFQ. Add it under Items Quoted if they still need it.
            </p>
            <QuoteForm
              v-model="editForm"
              id-prefix="inquiry"
              notes-placeholder="Anything from the call or email…"
            />
          </form>
        </section>

        <section id="quote-section" class="detail-section">
          <h2 class="section-heading">Quote</h2>
          <p class="section-sub">
            Items, shipping, and attachments.
          </p>

          <div class="glass-card action-card">
            <div class="form-group">
              <label>Items Quoted</label>
              <div class="line-item-head">
                <span class="line-item-qty">Qty</span>
                <span class="line-item-product">Item</span>
                <span class="line-item-price">Unit Price</span>
                <span class="line-item-total">Total</span>
                <span class="line-item-remove" aria-hidden="true"></span>
              </div>
              <div v-for="(item, i) in editForm.line_items" :key="i" class="line-item-row">
                <div class="line-item-qty">
                  <input
                    v-if="!isDiscountLine(item)"
                    v-model="item.qty"
                    type="number"
                    min="1"
                    step="1"
                    class="form-control"
                    placeholder="Qty"
                    aria-label="Quantity"
                    @input="onLineItemQtyInput(i)"
                    @blur="clampLineItemQty(i)"
                  />
                  <span v-else class="line-item-qty-placeholder" aria-label="Quantity">—</span>
                </div>
                <div class="line-item-product">
                  <div class="tabbed-field">
                    <span v-if="!item.product_slug" class="attention-tab">Item</span>
                    <select
                      class="form-control"
                      :class="{ 'form-control-attention': !item.product_slug }"
                      :value="item.product_slug"
                      @change="onLineItemProductChange(i, $event.target.value)"
                    >
                      <option value="" disabled>Select a product…</option>
                      <option
                        :value="DISCOUNT_SLUG"
                        :disabled="discountAlreadyUsed && !isDiscountLine(item)"
                      >DISCOUNT</option>
                      <option :value="CUSTOM_ITEM_SLUG">Custom Item</option>
                      <option v-for="p in pickableProducts" :key="p.slug" :value="p.slug">
                        {{ productOptionLabel(p) }}
                      </option>
                    </select>
                  </div>
                  <div v-if="isCustomLine(item)" class="tabbed-field">
                    <span v-if="customLineNeedsName(item)" class="attention-tab">Item</span>
                    <input
                      v-model="item.product_name"
                      type="text"
                      class="form-control line-item-custom-name"
                      :class="{ 'form-control-attention': customLineNeedsName(item) }"
                      :placeholder="CUSTOM_ITEM_LINE_NAME"
                      aria-label="Custom item name"
                    />
                  </div>
                  <input
                    v-model="item.detail"
                    type="text"
                    class="form-control line-item-detail"
                    :placeholder="detailPlaceholder(item.product_slug)"
                    aria-label="Item detail"
                    @input="onLineItemDetailInput(i)"
                  />
                  <p v-if="lineItemPriceHint(item)" class="line-item-hint" :class="{ 'line-item-hint-ready': isDiscountLine(item) || (getCatalogLinePrice(item) != null && !item.price_manual) }">
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
                <div class="line-item-price tabbed-field">
                  <template v-if="isDiscountLine(item)">
                    <span
                      v-if="parseDiscountPercent(item.price) == null"
                      class="attention-tab"
                    >Percent</span>
                    <div class="percent-input">
                      <input
                        :value="item.price ?? ''"
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        class="form-control"
                        :class="{ 'form-control-attention': parseDiscountPercent(item.price) == null }"
                        placeholder="e.g. 10"
                        aria-label="Discount percent"
                        @input="onDiscountPercentInput(i, $event.target.value)"
                        @blur="onDiscountPercentBlur(i)"
                      />
                      <span class="percent-suffix">%</span>
                    </div>
                  </template>
                  <template v-else>
                    <span
                      v-if="item.product_slug && parseMoneyField(item.price) == null"
                      class="attention-tab"
                    >Price</span>
                    <input
                      :value="lineItemUnitPrice(item) ?? item.price ?? ''"
                      type="number"
                      step="0.01"
                      min="0"
                      class="form-control"
                      :class="{ 'form-control-attention': item.product_slug && parseMoneyField(item.price) == null }"
                      placeholder="Unit price"
                      aria-label="Unit price"
                      @input="onLineItemUnitPriceInput(i, $event.target.value)"
                    />
                  </template>
                </div>
                <div class="line-item-total" aria-label="Line total">
                  {{ formatLineMoney(lineItemLineTotal(item)) }}
                </div>
                <button type="button" class="btn btn-secondary btn-icon line-item-remove" @click="removeLineItem(i)" aria-label="Remove item">
                  <i class="fas fa-times"></i>
                </button>
              </div>
              <div class="tabbed-field tabbed-field-button">
                <span v-if="!editForm.line_items.length" class="attention-tab">Add item</span>
                <button type="button" class="btn btn-secondary" @click="addLineItem">
                  <i class="fas fa-plus"></i> Add Item
                </button>
              </div>
              <p v-if="needsPrice" class="field-hint">Each item needs a price before send. Discount needs a percent.</p>
              <p v-else-if="needsCustomName" class="field-hint">Name each custom item before send.</p>
              <p v-else-if="discountAlreadyUsed" class="field-hint field-hint-ready">
                Discount is {{ formatDiscountPercent(discountPercent) }} off products (not shipping).
              </p>
            </div>

            <div class="form-group">
              <div class="quote-subtotal-row">
                <span>Products</span>
                <strong>{{ needsPrice ? '—' : formatMoney(productsSubtotal) }}</strong>
              </div>
              <p v-if="!needsPrice" class="field-hint field-hint-ready">
                {{ discountAlreadyUsed ? 'Quoted items after discount.' : 'Sum of item prices (qty × each).' }}
              </p>
            </div>

            <div class="form-group shipping-section">
              <label class="section-sublabel">Shipping</label>
              <div class="shipping-fields">
                <div class="shipping-notes-field">
                  <label for="shipping-notes">Details</label>
                  <div class="tabbed-field">
                    <span v-if="needsShippingNotes" class="attention-tab">Details</span>
                    <input
                      id="shipping-notes"
                      v-model="editForm.shipping_notes"
                      type="text"
                      class="form-control"
                      :class="{ 'form-control-attention': needsShippingNotes }"
                      placeholder="e.g. UPS Ground, 5–7 days — or Included / TBD notes"
                    />
                  </div>
                </div>
                <div class="shipping-price-field">
                  <label for="shipping-price">Price ($)</label>
                  <div class="tabbed-field">
                    <span v-if="needsShippingPrice" class="attention-tab">Amount</span>
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
              <p class="field-hint field-hint-ready">{{ discountAlreadyUsed ? 'Products after discount + shipping' : 'Products + shipping' }}</p>
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
              <label>Terms and Conditions Sent With Every Quote</label>
              <div class="preview-block">
                <ol class="preview-terms">
                  <li v-for="term in TERMS_AND_CONDITIONS" :key="term">{{ term }}</li>
                </ol>
              </div>
            </div>

            <div class="form-group">
              <label>Payment Info Sent With Every Quote</label>
              <div class="preview-block">
                <p class="preview-text">{{ PAYMENT_INFO.intro }}</p>
                <p class="preview-text">{{ PAYMENT_INFO.method }}</p>
                <p class="preview-text">{{ PAYMENT_INFO.bank.name }}, {{ PAYMENT_INFO.bank.phone }} · Swift {{ PAYMENT_INFO.bank.swift }} · Routing {{ PAYMENT_INFO.bank.routing }}</p>
                <p class="preview-text">{{ PAYMENT_INFO.bank.address }}</p>
                <p class="preview-text">{{ PAYMENT_INFO.beneficiary.name }} — {{ PAYMENT_INFO.beneficiary.accountType }} #{{ PAYMENT_INFO.beneficiary.accountNumber }}</p>
                <p class="preview-text">{{ PAYMENT_INFO.support }}</p>
              </div>
            </div>
          </div>
        </section>
          </div>
        </section>
          </div>

          <aside class="customer-col" aria-label="Customer view">
            <div class="customer-pane-head">
              <div v-if="quote.sent_html" class="customer-pane-tabs" role="tablist" aria-label="Customer view">
                <button
                  type="button"
                  role="tab"
                  :aria-selected="customerPaneTab === 'preview'"
                  :class="{ 'is-active': customerPaneTab === 'preview' }"
                  @click="customerPaneTab = 'preview'"
                >
                  Email to Sailor
                </button>
                <button
                  type="button"
                  role="tab"
                  :aria-selected="customerPaneTab === 'sent'"
                  :class="{ 'is-active': customerPaneTab === 'sent' }"
                  @click="customerPaneTab = 'sent'"
                >
                  Last Sent
                </button>
              </div>
              <h2 v-else id="sent-section" class="section-heading">Email to Sailor</h2>
              <p v-if="showingLastSent" class="section-sub">
                Sent{{ quote.sent_at ? ` ${formatDate(quote.sent_at)}` : '' }}<template v-if="quoteValidUntilLabel"> · valid until {{ quoteValidUntilLabel }}</template>.
                Edits on the left are not in this copy until you send again.
              </p>
              <p v-else class="section-sub">
                Live preview of the email Send will use. Cards here are not clickable — edit Inquiry and Quote on the left.
              </p>
            </div>
            <div class="customer-preview">
              <EmailFrame
                flush
                :html="customerPaneHtml"
                :title="showingLastSent ? `Quote sent to ${quote.name}` : `Quote preview for ${editForm.name || quote.name}`"
              />
            </div>
          </aside>
        </div>

        <div v-if="showFirstSendModal" class="modal" @click="showFirstSendModal = false">
          <div class="modal-content" @click.stop>
            <h2 class="modal-title">Send Quote to Sailor</h2>
            <p class="modal-text">
              Send this quote to {{ quote.name }} at {{ quote.email }}? The sailor will receive your message, their inquiry details, items quoted, payment instructions, terms, and the quote total by email.
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

        <div v-if="discountWarn" class="modal" @click="cancelDiscountWarn">
          <div class="modal-content" @click.stop>
            <h2 class="modal-title">Large discount</h2>
            <p class="modal-text">
              This discount is {{ formatDiscountPercent(discountWarn.percent) }}. Percentages of {{ DISCOUNT_WARN_PERCENT }}% or more should be double-checked before quoting.
            </p>
            <div class="modal-actions">
              <button type="button" class="btn btn-secondary" @click="cancelDiscountWarn">Cancel</button>
              <button type="button" class="btn btn-primary" @click="confirmDiscountWarn">Use this discount</button>
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
import { quoteNumberFor } from '~~/utils/quoteNumber'
import { emptyQuoteInquiry, inquiryFromQuote, inquiryColumnsFromForm } from '~~/utils/quoteInquiry'
import {
  clampDiscountPercent,
  CUSTOM_ITEM_LINE_NAME,
  CUSTOM_ITEM_SLUG,
  customLineNeedsName,
  DISCOUNT_LINE_NAME,
  DISCOUNT_SLUG,
  DISCOUNT_WARN_PERCENT,
  discountLineAmount,
  isCustomLine,
  isDiscountLine,
  isReservedLineSlug,
  lineItemAmount,
  parseDiscountPercent,
  parseLineQty,
  quotedItemsNetTotal
} from '~~/utils/quoteLineItem'
import { buildSailorQuoteHtml, restyleSentSailorQuoteHtml } from '~~/utils/sailorQuoteHtml'

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
const discountWarn = ref(null)
const lastConfirmedDiscount = ref({})
const customerPaneTab = ref('preview')

const editForm = ref({
  status: 'new',
  quoted_price: '',
  shipping_price: '',
  shipping_notes: '',
  quote_notes: '',
  line_items: [],
  attachment_ids: [],
  ...emptyQuoteInquiry()
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
  if (!item?.product_slug || isReservedLineSlug(item.product_slug)) return null
  return getProductLineItemPrice(
    getProductBySlug(item.product_slug),
    item.detail,
    editForm.value.cable_length || quote.value?.cable_length
  )
}

const isUnpricedAmount = (stored) => stored == null || stored === 0

const lineItemUnitPrice = (item) => {
  if (isDiscountLine(item)) return null
  const stored = parseMoneyField(item.price)
  if (!isUnpricedAmount(stored)) return stored
  return getCatalogLinePrice(item) ?? stored
}

const productOptionLabel = (product) => {
  const hidden = product.display === false ? ' (not on site)' : ''
  if (productUsesLengthPricing(product)) {
    const range = getProductPriceRangeFromProduct(product)
    return range
      ? `${product.name} — length-priced (${range})${hidden}`
      : `${product.name} — length-priced${hidden}`
  }
  const formatted = formatProductPrice(product.price)
  return formatted ? `${product.name} — ${formatted}${hidden}` : `${product.name}${hidden}`
}

const selectedLineItems = () =>
  editForm.value.line_items.filter((item) => item.product_slug)

const discountAlreadyUsed = computed(() =>
  editForm.value.line_items.some((item) => isDiscountLine(item))
)

const discountPercent = computed(() => {
  const item = editForm.value.line_items.find((line) => isDiscountLine(line))
  return item ? clampDiscountPercent(item.price) : null
})

const formatDiscountPercent = (value) => {
  const n = Number(value)
  if (!Number.isFinite(n)) return '—'
  return `${Number(n.toFixed(2))}%`.replace(/\.00%$/, '%')
}

const productsGrossSubtotal = () => {
  const products = selectedLineItems().filter((item) => !isDiscountLine(item))
  if (!products.length || products.some((item) => lineItemUnitPrice(item) == null)) return null
  return Number(products.reduce((sum, item) => sum + lineItemAmount(lineItemUnitPrice(item), item.qty), 0).toFixed(2))
}

const syncQuotedPriceFromLineItems = () => {
  const total = quotedItemsNetTotal(editForm.value.line_items, lineItemUnitPrice)
  editForm.value.quoted_price = total == null ? '' : total
}

const seedLineItemPrice = (i, { force = false } = {}) => {
  const item = editForm.value.line_items[i]
  if (!item?.product_slug || isReservedLineSlug(item.product_slug)) return
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
    if (isDiscountLine(item)) {
      item.product_name = item.product_name || DISCOUNT_LINE_NAME
      item.qty = 1
      const percent = clampDiscountPercent(item.price)
      item.price = percent ?? (item.price === 0 || item.price === '0' ? 0 : '')
      item.price_manual = true
      continue
    }
    if (isCustomLine(item)) {
      item.product_name = item.product_name ?? ''
      item.qty = parseLineQty(item.qty)
      const stored = parseMoneyField(item.price)
      item.price = stored != null ? Number(stored.toFixed(2)) : ''
      item.price_manual = true
      continue
    }
    if (!item.product_slug) {
      item.price = item.price ?? ''
      item.price_manual = false
      continue
    }
    const stored = parseMoneyField(item.price)
    const catalog = getCatalogLinePrice(item)
    if (isUnpricedAmount(stored) && catalog != null) {
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

const lineItemPriceHint = (item) => {
  if (!item.product_slug) return ''
  if (isDiscountLine(item)) {
    return 'Percent off the quoted products, not shipping.'
  }
  if (isCustomLine(item)) {
    return customLineNeedsName(item) ? 'Name this item as it should appear on the quote.' : ''
  }
  const product = getProductBySlug(item.product_slug)
  const catalog = getCatalogLinePrice(item)
  if (item.price_manual && catalog != null) {
    const qty = parseLineQty(item.qty)
    return qty > 1
      ? `Edited — catalog is ${formatProductPrice(catalog)} each × ${qty}.`
      : `Edited — catalog is ${formatProductPrice(catalog)}.`
  }
  if (catalog != null && !item.price_manual) {
    const feet = parseCableLengthFeet(item.detail) ?? parseCableLengthFeet(editForm.value.cable_length || quote.value?.cable_length)
    const qty = parseLineQty(item.qty)
    const each = feet && productUsesLengthPricing(product)
      ? `From catalog: ${formatProductPrice(catalog)} (${feet}′ tier)`
      : `From catalog: ${formatProductPrice(catalog)}`
    return qty > 1 ? `${each} × ${qty}` : each
  }
  if (productUsesLengthPricing(product)) {
    const tiers = getResolvedProductPriceTiers(product)
    const bounds = tiers ? getTierLengthBounds(tiers) : { minFeet: 1, maxFeet: 30 }
    const feet = parseCableLengthFeet(item.detail) ?? parseCableLengthFeet(editForm.value.cable_length || quote.value?.cable_length)
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
    qty: 1,
    price: '',
    price_manual: false
  })
}
const removeLineItem = (i) => {
  editForm.value.line_items.splice(i, 1)
  syncQuotedPriceFromLineItems()
}
const onLineItemProductChange = (i, slug) => {
  const item = editForm.value.line_items[i]
  if (slug === DISCOUNT_SLUG) {
    item.product_slug = DISCOUNT_SLUG
    item.product_name = DISCOUNT_LINE_NAME
    item.qty = 1
    item.price = ''
    item.price_manual = true
    item.detail = ''
    delete lastConfirmedDiscount.value[i]
    syncQuotedPriceFromLineItems()
    return
  }
  if (slug === CUSTOM_ITEM_SLUG) {
    item.product_slug = CUSTOM_ITEM_SLUG
    item.product_name = ''
    item.qty = item.qty ? parseLineQty(item.qty) : 1
    item.price = ''
    item.price_manual = true
    item.detail = ''
    syncQuotedPriceFromLineItems()
    return
  }
  const product = pickableProducts.value.find((p) => p.slug === slug)
  item.product_slug = slug
  item.product_name = product?.name ?? ''
  item.price_manual = false
  if (slug === MARINE_CONTROL_CABLE_SLUG && (editForm.value.cable_length || quote.value?.cable_length) && !item.detail?.trim()) {
    item.detail = `${editForm.value.cable_length || quote.value.cable_length} ft`
  }
  seedLineItemPrice(i, { force: true })
}

const onLineItemDetailInput = (i) => {
  seedLineItemPrice(i)
}

const onLineItemQtyInput = (i) => {
  syncQuotedPriceFromLineItems()
}

const clampLineItemQty = (i) => {
  const item = editForm.value.line_items[i]
  item.qty = parseLineQty(item.qty)
  syncQuotedPriceFromLineItems()
}

const lineItemLineTotal = (item) => {
  if (isDiscountLine(item)) {
    const percent = clampDiscountPercent(item.price)
    const gross = productsGrossSubtotal()
    if (percent == null || gross == null) return null
    return -discountLineAmount(gross, percent)
  }
  const unit = lineItemUnitPrice(item)
  if (unit == null) return null
  return lineItemAmount(unit, item.qty)
}

const formatLineMoney = (value) => {
  if (value == null || value === '') return '—'
  const amount = Number(value)
  if (!Number.isFinite(amount)) return '—'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

const onLineItemUnitPriceInput = (i, raw) => {
  const item = editForm.value.line_items[i]
  item.price_manual = true
  const entered = parseMoneyField(raw)
  item.price = entered == null ? raw : Number(entered.toFixed(2))
  syncQuotedPriceFromLineItems()
}

const onDiscountPercentInput = (i, raw) => {
  const item = editForm.value.line_items[i]
  item.price = raw === '' ? '' : raw
  syncQuotedPriceFromLineItems()
  maybeWarnDiscount(i)
}

const maybeWarnDiscount = (i) => {
  const item = editForm.value.line_items[i]
  if (!item || !isDiscountLine(item)) return
  const percent = clampDiscountPercent(item.price)
  if (percent == null) return
  if (percent >= DISCOUNT_WARN_PERCENT && lastConfirmedDiscount.value[i] !== percent) {
    discountWarn.value = {
      index: i,
      percent,
      previous: lastConfirmedDiscount.value[i] ?? ''
    }
  }
}

const onDiscountPercentBlur = (i) => {
  const item = editForm.value.line_items[i]
  if (!isDiscountLine(item)) return
  if (item.price === '' || item.price == null) {
    lastConfirmedDiscount.value[i] = ''
    syncQuotedPriceFromLineItems()
    return
  }
  const percent = clampDiscountPercent(item.price)
  if (percent == null) {
    item.price = lastConfirmedDiscount.value[i] ?? ''
    syncQuotedPriceFromLineItems()
    return
  }
  item.price = percent
  syncQuotedPriceFromLineItems()
  maybeWarnDiscount(i)
  if (!discountWarn.value) lastConfirmedDiscount.value[i] = percent
}

const confirmDiscountWarn = () => {
  const warn = discountWarn.value
  if (warn) lastConfirmedDiscount.value[warn.index] = warn.percent
  discountWarn.value = null
}

const cancelDiscountWarn = () => {
  const warn = discountWarn.value
  if (warn) {
    const item = editForm.value.line_items[warn.index]
    if (item && isDiscountLine(item)) item.price = warn.previous
    lastConfirmedDiscount.value[warn.index] = warn.previous
    syncQuotedPriceFromLineItems()
  }
  discountWarn.value = null
}

const resetLineItemPrice = (i) => {
  editForm.value.line_items[i].price_manual = false
  seedLineItemPrice(i, { force: true })
}

const serializeLineItems = (items) => (Array.isArray(items) ? items : [])
  .filter((li) => li?.product_slug)
  .map((li) => (
    isDiscountLine(li)
      ? {
          product_slug: DISCOUNT_SLUG,
          product_name: DISCOUNT_LINE_NAME,
          detail: li.detail?.trim() ? li.detail.trim() : null,
          qty: 1,
          price: clampDiscountPercent(li.price)
        }
      : isCustomLine(li)
        ? {
            product_slug: CUSTOM_ITEM_SLUG,
            product_name: String(li.product_name ?? '').trim(),
            detail: li.detail?.trim() ? li.detail.trim() : null,
            qty: parseLineQty(li.qty),
            price: lineItemUnitPrice(li)
          }
        : {
            product_slug: li.product_slug,
            product_name: li.product_name ?? '',
            detail: li.detail?.trim() ? li.detail.trim() : null,
            qty: parseLineQty(li.qty),
            price: lineItemUnitPrice(li)
          }
  ))

const detailPlaceholder = (slug) => {
  if (slug === DISCOUNT_SLUG) return 'optional reason'
  if (slug === CUSTOM_ITEM_SLUG) return 'optional note'
  if (slug === 'marine-control-cable') return 'e.g. 15 ft'
  if (slug === 'custom-bore') return 'e.g. Mod III / port shaft'
  return 'optional note'
}

const applicableWarnings = computed(() => getApplicableWarnings(editForm.value.line_items))

const displayedQuoteNumber = computed(() =>
  quoteNumberFor(quote.value, editForm.value.name || quote.value?.name)
)

const sailorPreviewHtml = computed(() =>
  buildSailorQuoteHtml({
    name: editForm.value.name || quote.value?.name || '',
    email: editForm.value.email || quote.value?.email || '',
    company: editForm.value.company,
    phone: editForm.value.phone,
    phone_region: editForm.value.phone_region,
    address: editForm.value.address,
    yacht_type: editForm.value.yacht_type,
    yacht_name: editForm.value.yacht_name,
    displacement: editForm.value.displacement,
    max_hull_speed: editForm.value.max_hull_speed,
    shaft_diameter: editForm.value.shaft_diameter,
    prop_diameter: editForm.value.prop_diameter,
    prop_pitch: editForm.value.prop_pitch,
    num_blades: editForm.value.num_blades,
    num_propellers: editForm.value.num_propellers,
    prop_type: editForm.value.prop_type,
    engine: editForm.value.engine,
    transmission: editForm.value.transmission,
    locking_system: editForm.value.locking_system,
    cable_length: editForm.value.cable_length,
    notes: editForm.value.notes,
    quote_notes: editForm.value.quote_notes || '',
    quote_number: displayedQuoteNumber.value,
    shipping_notes: String(editForm.value.shipping_notes || '').trim(),
    shipping_price: parseMoneyField(editForm.value.shipping_price) ?? 0,
    products_price: productsSubtotal.value ?? 0,
    line_items: selectedLineItems().map((item) => (
      isDiscountLine(item)
        ? {
            product_slug: DISCOUNT_SLUG,
            product_name: DISCOUNT_LINE_NAME,
            detail: item.detail || null,
            qty: 1,
            price: clampDiscountPercent(item.price) ?? 0
          }
        : {
            product_slug: item.product_slug,
            product_name: isCustomLine(item)
              ? (String(item.product_name ?? '').trim() || CUSTOM_ITEM_LINE_NAME)
              : (item.product_name ?? ''),
            detail: item.detail || null,
            qty: parseLineQty(item.qty),
            price: lineItemUnitPrice(item) ?? 0
          }
    )),
    warnings: applicableWarnings.value,
    valid_until_label: formatQuoteValidUntil(new Date())
  })
)

const lastSentHtml = computed(() =>
  restyleSentSailorQuoteHtml(quote.value?.sent_html || '', {
    name: quote.value?.name,
    email: quote.value?.email,
    quote_number: displayedQuoteNumber.value
  })
)

const showingLastSent = computed(() =>
  customerPaneTab.value === 'sent' && Boolean(quote.value?.sent_html)
)
const customerPaneHtml = computed(() =>
  showingLastSent.value ? lastSentHtml.value : sailorPreviewHtml.value
)

const productsSubtotal = computed(() =>
  quotedItemsNetTotal(editForm.value.line_items, lineItemUnitPrice)
)

const needsPrice = computed(() => productsSubtotal.value == null)
const needsCustomName = computed(() =>
  editForm.value.line_items.some((item) => customLineNeedsName(item))
)
const needsShippingPrice = computed(() => editForm.value.shipping_price === '' || editForm.value.shipping_price == null)
const needsShippingNotes = computed(() => !editForm.value.shipping_notes?.trim())
const needsMessage = computed(() => !editForm.value.quote_notes?.trim())
const quoteGrandTotal = computed(() =>
  (productsSubtotal.value ?? 0) + (parseMoneyField(editForm.value.shipping_price) ?? 0)
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
    const products = selectedLineItems().filter((item) => !isDiscountLine(item))
    if (!products.length) missing.push('at least one quoted product with a price')
    else if (discountAlreadyUsed.value && discountPercent.value == null) missing.push('a discount percent')
    else missing.push('a price on each quoted item')
  }
  if (needsCustomName.value) missing.push('a name on each custom item')
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
  if (JSON.stringify(inquiryColumnsFromForm(editForm.value)) !== JSON.stringify(inquiryColumnsFromForm(inquiryFromQuote(q)))) {
    return false
  }

  return JSON.stringify(normalizeLineItems(editForm.value.line_items)) === JSON.stringify(normalizeLineItems(q.sent_line_items))
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
          qty: parseLineQty(item.qty),
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
    lastConfirmedDiscount.value = {}
    lineItems.forEach((item, i) => {
      if (isDiscountLine(item)) {
        const percent = clampDiscountPercent(item.price)
        if (percent != null) lastConfirmedDiscount.value[i] = percent
      }
    })
    editForm.value = {
      status: data.status,
      quoted_price: data.quoted_price ?? '',
      shipping_price: data.shipping_price ?? '',
      shipping_notes: data.shipping_notes ?? '',
      quote_notes: data.quote_notes ?? '',
      line_items: lineItems,
      attachment_ids: Array.isArray(data.attachment_ids) ? [...data.attachment_ids] : [],
      ...inquiryFromQuote(data)
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

    const inquiry = inquiryColumnsFromForm(editForm.value)
    if (!inquiry.name || !inquiry.email) {
      saveMessage.value = 'Name and email are required.'
      saveError.value = true
      return
    }

    const { error: updateError } = await supabase
      .from('quotes')
      .update({
        ...inquiry,
        status: editForm.value.status,
        quoted_price: editForm.value.quoted_price === '' ? null : editForm.value.quoted_price,
        shipping_price: editForm.value.shipping_price === '' ? null : editForm.value.shipping_price,
        shipping_notes: editForm.value.shipping_notes?.trim() || null,
        quote_notes: editForm.value.quote_notes || null,
        quote_number: quote.value.quote_number || quoteNumberFor(quote.value, inquiry.name) || null,
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

    const inquiry = inquiryColumnsFromForm(editForm.value)
    if (!inquiry.name || !inquiry.email) {
      saveMessage.value = 'Name and email are required.'
      saveError.value = true
      return
    }

    // Persist any pending edits before sending so the email matches this page.
    const { error: updateError } = await supabase
      .from('quotes')
      .update({
        ...inquiry,
        status: editForm.value.status,
        quoted_price: editForm.value.quoted_price === '' ? null : editForm.value.quoted_price,
        shipping_price: editForm.value.shipping_price === '' ? null : editForm.value.shipping_price,
        shipping_notes: editForm.value.shipping_notes?.trim() || null,
        quote_notes: editForm.value.quote_notes || null,
        quote_number: quote.value.quote_number || quoteNumberFor(quote.value, inquiry.name) || null,
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
    .select('id, name, slug, price, price_tiers, display')
    .order('id', { ascending: true })

  pickableProducts.value = (data || [])
    .filter((p) => p.slug && !isReservedLineSlug(p.slug))
    .slice()
    .sort((a, b) => {
    const vis = (b.display !== false ? 1 : 0) - (a.display !== false ? 1 : 0)
    if (vis) return vis
    return a.id - b.id
  })
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
.quote-detail {
  max-width: 1600px;
}

.quote-workspace {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.owner-pane {
  min-width: 0;
  container-type: inline-size;
}

.owner-stack {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  min-width: 0;
}

.customer-col {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  min-width: 0;
}

.workspace-head,
.customer-pane-head {
  display: flex;
  flex-wrap: nowrap;
  align-items: baseline;
  gap: 0.75rem;
}

.workspace-head .section-heading,
.customer-pane-head .section-heading {
  margin: 0;
  flex-shrink: 0;
  text-align: left;
}

.workspace-head .section-sub,
.customer-pane-head .section-sub {
  flex: 1 1 auto;
  min-width: 0;
  margin: 0;
  font-size: 0.78rem;
  line-height: 1.35;
}

.customer-pane-head {
  align-items: center;
}

.customer-pane-tabs {
  display: flex;
  flex-wrap: nowrap;
  flex-shrink: 0;
  gap: 0.2rem;
  width: fit-content;
  max-width: 100%;
  padding: 0.2rem;
  background: rgba(13, 27, 54, 0.65);
  border: 1px solid var(--line-strong);
  border-radius: 999px;
}

.customer-pane-tabs button {
  margin: 0;
  padding: 0.45rem 0.95rem;
  border: none;
  border-radius: 999px;
  background: transparent;
  color: var(--text-mid);
  font-family: var(--font-display);
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
}

.customer-pane-tabs button:hover {
  color: var(--text-hi);
}

.customer-pane-tabs button.is-active {
  background: var(--grad-accent);
  color: #04121F;
}

@media (min-width: 1100px) {
  .quote-workspace {
    display: grid;
    grid-template-columns: minmax(0, 1.08fr) minmax(24rem, 0.92fr);
    grid-template-areas:
      "message-head customer-head"
      "owner-stack customer-preview";
    column-gap: 1.5rem;
    row-gap: 0.5rem;
    align-items: start;
  }

  .owner-pane,
  #message-section,
  .customer-col {
    display: contents;
  }

  .message-head { grid-area: message-head; }
  .owner-stack { grid-area: owner-stack; min-width: 0; gap: 0.5rem; }
  .customer-pane-head { grid-area: customer-head; }
  .customer-preview { grid-area: customer-preview; min-width: 0; align-self: start; }
}

.detail-head {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.65rem;
  padding: 1.05rem 1.35rem;
  margin-bottom: 1.15rem;
}

.detail-head-main {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem 1.25rem;
}

.detail-identity {
  min-width: 0;
  flex: 1 1 16rem;
}

.detail-identity-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 0.75rem;
}

.detail-head h1 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.35rem;
  color: var(--text-hi);
}

.detail-sub {
  margin: 0.28rem 0 0;
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

.section-sub {
  margin: -0.75rem 0 0;
  color: var(--text-mid);
  font-size: 0.9rem;
}

.summary-card, .action-card {
  padding: 1.5rem 1.7rem;
}

.message-card .form-group {
  margin-bottom: 0;
}

.inquiry-card :deep(.form-control) {
  cursor: text;
  background: rgba(4, 10, 24, 0.72);
  border: 1px solid rgba(148, 197, 255, 0.42);
}

.inquiry-card :deep(.form-control:hover) {
  border-color: var(--accent);
}

.inquiry-card :deep(.radio-option) {
  cursor: pointer;
}

.quote-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.4rem;
}

.quote-actions .save-message {
  margin: 0;
}

.quote-actions-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 0.55rem;
}

.quote-actions-row .btn {
  width: auto;
  padding: 0.55rem 1rem;
  flex: none;
}

.quote-actions-status {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.4rem;
  min-width: 10rem;
  max-width: 12.5rem;
  flex: none;
}

.detail-head .send-hint,
.detail-head .field-hint {
  margin: 0;
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

.tabbed-field {
  position: relative;
  padding-top: 0.15rem;
}

.tabbed-field-button {
  display: inline-block;
}

.attention-tab {
  position: absolute;
  top: 0;
  right: 0.7rem;
  transform: translateY(-58%);
  z-index: 1;
  background: var(--gold);
  color: #04121F;
  font-family: var(--font-display);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  line-height: 1;
  padding: 0.28rem 0.5rem 0.32rem;
  border-radius: 3px 3px 0 0;
  pointer-events: none;
  box-shadow: 0 2px 8px rgba(2, 8, 23, 0.35);
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

textarea.form-control { resize: vertical; field-sizing: fixed; }

.line-item-head,
.line-item-row {
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
}

.line-item-head {
  margin-bottom: 0.35rem;
  font-family: var(--font-display);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-mid);
}

.line-item-head .line-item-qty,
.line-item-head .line-item-price,
.line-item-head .line-item-total {
  text-align: right;
}

.line-item-row {
  margin-bottom: 0.75rem;
  overflow: visible;
}

.line-item-product {
  flex: 2.2;
  min-width: 0;
}

.line-item-product .line-item-detail,
.line-item-product .line-item-custom-name {
  display: block;
  width: 100%;
  margin-top: 0.4rem;
  flex: none;
  min-width: 0;
}

.line-item-qty {
  flex: 0 0 4.25rem;
}

.line-item-qty-placeholder {
  display: block;
  padding: 0.7rem 0.4rem;
  text-align: right;
  color: var(--text-low);
}

.line-item-price {
  flex: 0 0 7.5rem;
}

.percent-input {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.percent-input .form-control {
  min-width: 0;
}

.percent-suffix {
  flex: 0 0 auto;
  color: var(--text-mid);
  font-family: var(--font-display);
  font-weight: 600;
}

.line-item-total {
  flex: 0 0 6.5rem;
  padding-top: 0.7rem;
  text-align: right;
  font-family: var(--font-display);
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-hi);
  white-space: nowrap;
}

.line-item-remove {
  flex: 0 0 2.75rem;
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
  .line-item-head {
    display: none;
  }

  .line-item-row {
    flex-wrap: wrap;
  }

  .line-item-qty {
    flex: 0 0 4.25rem;
  }

  .line-item-product {
    flex: 1 1 calc(100% - 5rem);
  }

  .line-item-price {
    flex: 0 0 7rem;
  }

  .line-item-total {
    flex: 0 0 6.5rem;
    padding-top: 0.7rem;
  }

  .shipping-fields {
    grid-template-columns: 1fr;
  }
}

@container (max-width: 700px) {
  .line-item-head {
    display: none;
  }

  .line-item-row {
    flex-wrap: wrap;
  }

  .line-item-qty {
    flex: 0 0 4.25rem;
  }

  .line-item-product {
    flex: 1 1 calc(100% - 5rem);
  }

  .line-item-price {
    flex: 0 0 7rem;
  }

  .line-item-total {
    flex: 0 0 6.5rem;
    padding-top: 0.7rem;
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
