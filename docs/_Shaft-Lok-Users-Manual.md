# Shaft Lok Users Manual

How to use the Shaft Lok website.

## Signing in

Go to [shaftlok.com/adminaccess](https://shaftlok.com/adminaccess) and sign in. After sign-in, choose an area:

- **Quote Management** — inquiries, quotes, and sending email to sailors
- **Yacht List Management** — the public yacht list
- **Product Management** — product pages, prices, and whether a product is visible on the site
- **Shaft Lok Library** — files you can attach to a quote email
- **Users Manual** — this guide

Admin pages use a red house icon and red menu so they are easy to tell apart from the public site. The house returns to the area picker. The Shaft Lok logo returns to the public homepage.

## A new quote

A sailor’s request from **Get a Quote** appears in Quote Management as **New**. A cyan bar on the list means you have not opened that inquiry yet. Opening it clears the bar.

On the quote, fill in:

- **Items quoted**, with a price on every line. Picking a product fills the catalog price. You can change that price for this quote, or reset it back to the catalog price.
- **Shipping** details and a shipping price. Zero is allowed when shipping is included, as long as the details say so.
- A **message** to the sailor.

The total the sailor sees is products plus shipping. **Send Quote** stays unavailable until those fields are filled in.

The right side of the quote is a live preview of the email **Send** will use. After a quote has been sent once, that pane also has **Last Sent**, which is the copy that already went out. Edits on the left are not in Last Sent until you send again.

## Sending the email

The first time you send, the site asks you to confirm. If you send again after something changed, it asks you to confirm the updated version. If nothing changed, it warns you that you are about to resend the same quote.

Each emailed quote is valid for one calendar month from the day you send it. The email says that date. After it, prices and terms may change. The quote does not close itself. You still set **Followed up** or **Dead** yourself.

**Followed up** stays unavailable until the quote has been emailed.

You can attach files from the Shaft Lok Library before you send. The sailor receives those files with the email.

## Payments

Payment is through Stripe. Old bank-wire instructions are no longer included in quotes.

**Hide Payment** is on for every quote until you change it. While it is selected, the email has no Payment section and no pay buttons. Use this when you want to send a quote only.

Choose **Include Payment** when you want the sailor to pay from that email. The email then shows:

- Bank transfer at the quoted total
- Credit card at the quoted total plus a 3% processing fee
- **Pay by Bank Transfer** and **Pay by Credit Card**

That 3% is added by Shaft Lok before the sailor reaches Stripe. Stripe does not add another fee. The sailor sees the fee in the email and again on the Shaft Lok pay page before checkout.

Checkout itself expires in about 24 hours. The quote stays payable for the month it is valid. If a sailor’s checkout window expires, they can start again from the pay link.

## After the sailor pays

Stripe sends the sailor to **Order Confirmed**. That page is for the sailor. It shows the quote number and “Thank you for your order. Happy sailing!”

The site knows the quote is paid because Stripe reports that the checkout finished. Quote Management then shows **Paid**, and the quote status becomes **Won**. You do not have to mark it Won yourself when Stripe confirms payment.

Money can show in Stripe before it reaches the bank. A card payment is usually **Paid** right away. The deposit into the bank account can still take a few days. That delay is Stripe’s payout, not a sign that the payment failed.

A bank transfer can stay **Pending** until the funds clear inside Stripe. The sailor’s Order Confirmed page says the transfer was received and will be marked paid when the funds clear. When Stripe clears it, the quote becomes **Paid** and **Won**.

If the sailor cancels checkout, they return to the pay page and can try again. Opening a pay link after the quote is already paid shows Order Confirmed again. It does not ask them to pay a second time.

## Quote statuses

| What you see | What it means |
|---|---|
| New | You are still preparing the quote |
| Quote Sent | The email went out |
| Followed up | You have chased it after it was sent |
| Won | The sailor accepted, or Stripe marked it paid |
| Dead | Declined, went elsewhere, or went cold |

## Products, the library, and the yacht list

**Product Management** is where product names, descriptions, prices, and visibility live. Hidden products stay available when you build a quote. They do not appear on the public product pages.

**Shaft Lok Library** is where shared files live (PDFs and common images). Upload them once, then check the ones that should go with a particular quote.

**Yacht List Management** is the list sailors can browse on the public site.
