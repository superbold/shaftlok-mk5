-- Shipping as its own line on quotes (details + price).
-- quoted_price remains the products total; grand total = quoted_price + shipping_price.

ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS shipping_price numeric;
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS shipping_notes text;

ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS sent_shipping_price numeric;
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS sent_shipping_notes text;
