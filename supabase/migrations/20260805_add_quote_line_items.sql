-- Add line_items to quotes: structured list of products being quoted, purely
-- descriptive (not itemized pricing — quoted_price remains one lump total set
-- by the admin). Shape: array of objects, e.g.
--   [{ "product_slug": "marine-control-cable", "product_name": "Marine Control Cable", "detail": "15 ft" }]
-- product_slug/product_name are a snapshot at quote-send time (not live-joined
-- against products), so a later product rename/archival doesn't alter history.
ALTER TABLE public.quotes ADD COLUMN line_items jsonb NOT NULL DEFAULT '[]'::jsonb;
