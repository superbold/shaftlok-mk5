-- Custom Bore: catalog/QMS product + quote-form interest flag.

ALTER TABLE public.quotes
  ADD COLUMN IF NOT EXISTS custom_bore_requested boolean NOT NULL DEFAULT false;

INSERT INTO public.products (
  name,
  slug,
  category,
  display,
  badge,
  tagline,
  summary,
  description,
  details,
  price,
  image_url,
  alt,
  features,
  specs
)
SELECT
  'Custom Bore',
  'custom-bore',
  'Controls & Accessories',
  true,
  'Quote add-on',
  'Machined to your shaft',
  'When your propeller shaft isn’t a stock bore size, we can machine a custom fit — often needed on larger Mods. Quoted separately after we confirm your shaft diameter.',
  'Custom bore machining sizes the Shaft Lok collar to your exact propeller shaft. Stock Mods cover common shaft ranges; a custom bore covers non-stock diameters and other special fits. Extra machining cost may apply, especially on larger units — Sean will confirm whether you need it before finalizing your quote.',
  'Custom bore is an add-on to a Shaft Lok Mod, not a standalone locking unit. Provide your shaft diameter on the quote form (or when Sean calls). We can remove this line from your quote if a stock bore is the better fit.',
  NULL,
  '/assets/images/Logo_propeller_only.png',
  'Shaft Lok custom bore machining',
  '[
    {"icon": "fas fa-ruler-combined", "title": "Fit to your shaft", "text": "Machined for non-stock propeller shaft diameters after we confirm measurements."},
    {"icon": "fas fa-dollar-sign", "title": "Quoted separately", "text": "Custom machining can add cost — especially on larger Mods — and is confirmed before you buy."},
    {"icon": "fas fa-check", "title": "Easy to remove", "text": "If a stock bore fits, Sean will drop this add-on from your quote."}
  ]'::jsonb,
  '[
    {"name": "Used with", "value": "Any Shaft Lok Mod (I–VI) as needed"},
    {"name": "Pricing", "value": "Quoted per job after shaft diameter is confirmed"}
  ]'::jsonb
WHERE NOT EXISTS (
  SELECT 1 FROM public.products WHERE slug = 'custom-bore'
);
