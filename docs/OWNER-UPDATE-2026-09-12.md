# Shaft Lok website updates — September 12, 2026

A plain-language summary of what we shipped for Sean / Shaft Lok Inc. (including related updates from this work session).

---

## What changed

### 1. Shipping is its own line on a quote
Sean can enter shipping details (for example, method or notes) and a shipping price separately from the product prices.

### 2. Quote total always equals products + shipping
The system adds product prices and shipping together for the grand total. No more guessing whether shipping was mixed into the product number.

### 3. Shipping must be filled in before a quote can be emailed
Sean cannot send a quote until shipping details and a shipping price are set. Zero dollars is allowed when shipping is included (as long as the notes explain that).

### 4. The sailor’s email shows a clear money breakdown
The emailed quote lists **Products**, **Shipping**, and **Total** so the customer can see how the number is built.

### 5. Quote list and pipeline dollars use the full total
On the quote management overview, dollar amounts for each status include shipping, not just product prices alone.

### 6. Catalog prices pull onto each quote line automatically
When Sean picks a product for a quote, the price from Product Management fills in automatically (including length-based cable pricing when that applies).

### 7. Sean can still edit each line’s price on the quote
After a price is pulled in, Sean can change it for that quote (for example, twin units, a discount, or a special situation). He can also reset a line back to the catalog price when needed.

### 8. The sailor’s email shows itemized product prices
Each product on the quote appears with its own dollar amount, not just a single products total.

### 9. Quotes are valid for one month from the send date
Every emailed quote states that it is valid until one month after Sean sends it. After that date, prices and terms may change. This protects Shaft Lok if manufacturing costs rise. Status (Followed up, Dead, and so on) stays under Sean’s control — old quotes are not auto-closed.

### 10. Custom Bore is a real product and can feed into quotes
- There is a **Custom Bore** product card on the public Products page.
- On **Get a Quote**, sailors can check “I may need a custom bore,” with a note that it can be removed later if it is not the right fit.
- When they check that box, Sean sees the interest in Quote Management and a Custom Bore line is started on the quote for him to price, keep, or remove after he talks with the customer.

### 11. Updated the public phone number
The site contact number was updated to **1-414-630-4548** (replacing the older number) everywhere customers see it — contact page, footer, FAQ, installation, and related listings.

### 12. Shaft Lok Library (shared document store for admins)
Sean and other admins have a shared place to keep installation guides, drawings, and other files that sailors may need offline.

**Where to open it**
- After sign-in at **Admin Access**, choose **Shaft Lok Library**, or go directly to `/library`.
- It is also linked from the Quote Management and Product Management mobile menus.

**What you can do there**
- **Upload** — PDF, Word, plain text, JPEG, PNG, or WebP, up to **20 MB** per file. Give each file a clear title (and optional description).
- **Download** — open or save any document already in the library.
- **Delete** — remove a document from the library (file and listing both go away). Confirm in the popup first.

Files are stored privately in Supabase Storage; only admins can see or manage them.

### 13. Attach library documents to a sailor’s quote email
When preparing a quote in Quote Management, Sean can attach one or more library files to that email.

**How it works**
1. Upload the documents once in **Shaft Lok Library** (step 12).
2. Open the quote in QMS.
3. Under **Email Attachments (from Shaft Lok Library)**, check the files that should go with this quote.
4. **Save** and/or **Send Quote to Sailor** as usual.

**What the sailor gets**
- The same quote email as before (totals, message, payment info), plus the checked files as email attachments.
- A short “Attached Documents” list in the email body so they know what was included.

**Notes**
- Attachments are optional. Existing quotes start with none selected and behave as before until Sean checks something.
- If a library file was deleted after it was checked on a quote, send will fail with a clear message — uncheck it (or pick another file) and send again.
- Very large selections may be too big for email; the form warns if the total size looks too high.

---

## Yet to do

1. Change the banking information on quotes to Sean’s Shaft Lok bank account.