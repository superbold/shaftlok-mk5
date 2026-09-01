-- Length-based pricing tiers (e.g. Marine Control Cable by foot range).
-- Stored as JSON array: [{ "minFeet": 1, "maxFeet": 5, "price": 210 }, ...]

ALTER TABLE public.products ADD COLUMN IF NOT EXISTS price_tiers jsonb;

UPDATE public.products
SET price_tiers = '[
  {"minFeet": 1, "maxFeet": 5, "price": 210},
  {"minFeet": 6, "maxFeet": 10, "price": 215},
  {"minFeet": 11, "maxFeet": 15, "price": 221},
  {"minFeet": 16, "maxFeet": 20, "price": 230},
  {"minFeet": 21, "maxFeet": 25, "price": 265},
  {"minFeet": 26, "maxFeet": 30, "price": 273}
]'::jsonb
WHERE slug = 'marine-control-cable';
