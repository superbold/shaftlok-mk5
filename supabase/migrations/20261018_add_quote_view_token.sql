-- Unguessable link to the quote that was emailed, so it can be opened in a
-- browser when the message lands in junk. Distinct from payment_token: a quote
-- can be viewed even when payment is hidden.

ALTER TABLE public.quotes
  ADD COLUMN IF NOT EXISTS view_token text;

CREATE UNIQUE INDEX IF NOT EXISTS quotes_view_token_key
  ON public.quotes (view_token)
  WHERE view_token IS NOT NULL;
