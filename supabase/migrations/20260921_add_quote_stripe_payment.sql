-- Stripe payment on quotes: unguessable pay-page token, Checkout session, and
-- paid/pending status. Associated Bank wire details are OBE — sailors pay on Stripe.

ALTER TABLE public.quotes
  ADD COLUMN IF NOT EXISTS payment_token text,
  ADD COLUMN IF NOT EXISTS stripe_customer_id text,
  ADD COLUMN IF NOT EXISTS stripe_checkout_session_id text,
  ADD COLUMN IF NOT EXISTS stripe_payment_intent_id text,
  ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'unpaid',
  ADD COLUMN IF NOT EXISTS payment_method text,
  ADD COLUMN IF NOT EXISTS amount_charged numeric,
  ADD COLUMN IF NOT EXISTS surcharge_amount numeric,
  ADD COLUMN IF NOT EXISTS paid_at timestamptz;

ALTER TABLE public.quotes
  DROP CONSTRAINT IF EXISTS quotes_payment_status_check;

ALTER TABLE public.quotes
  ADD CONSTRAINT quotes_payment_status_check
  CHECK (payment_status IN ('unpaid', 'pending', 'paid', 'failed', 'expired'));

ALTER TABLE public.quotes
  DROP CONSTRAINT IF EXISTS quotes_payment_method_check;

ALTER TABLE public.quotes
  ADD CONSTRAINT quotes_payment_method_check
  CHECK (payment_method IS NULL OR payment_method IN ('card', 'bank'));

CREATE UNIQUE INDEX IF NOT EXISTS quotes_payment_token_key
  ON public.quotes (payment_token)
  WHERE payment_token IS NOT NULL;
