-- Safety switch: Hide Payment defaults ON so quote emails omit the Payment
-- section (Stripe pay buttons) until Sean turns it off on that quote.

ALTER TABLE public.quotes
  ADD COLUMN IF NOT EXISTS hide_payment boolean NOT NULL DEFAULT true;
