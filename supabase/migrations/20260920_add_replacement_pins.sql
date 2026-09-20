-- Replacement Pins: public catalog card + QMS Items Quoted picker.
-- Sold as a pair (long locking pin + short holding pin).

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
  'Replacement Pins',
  'replacement-pins',
  'Controls & Accessories',
  true,
  NULL,
  'A spare pair for your Shaft Lok',
  'A replacement pair of long and short locking pins for the Shaft Lok mechanism.',
  'Replacement locking pins for Shaft Lok marine propeller locking systems. Sold as a pair (long locking pin and short holding pin), quoted to your Mod.',
  'The locking mechanism uses a long pin that engages the rotating disc and a short pin that holds it locked or unlocked. Those pins can wear over time. Replacement Pins come as a pair so you can service the unit without replacing the whole housing. Tell us which Mod you have so we send the correct pair.',
  NULL,
  '/assets/images/replacement-pins.png',
  'Shaft Lok replacement locking pins',
  '[
    {"icon": "fas fa-link", "title": "Fits Shaft Lok Mods", "text": "Sold as a spare pair for existing units — tell us which Mod so we match the set."},
    {"icon": "fas fa-gears", "title": "Long and short pins", "text": "Each pair includes the long pin that contacts the rotating disc and the short pin that holds it locked or unlocked."},
    {"icon": "fas fa-clipboard-list", "title": "Quoted as a pair", "text": "Price depends on which Mod you need."}
  ]'::jsonb,
  '[
    {"name": "Used with", "value": "Existing Shaft Lok Mods as spare parts"},
    {"name": "Includes", "value": "Long locking pin and short holding pin (sold as a pair)"},
    {"name": "Pricing", "value": "Quoted as a pair after we confirm your Mod"}
  ]'::jsonb
WHERE NOT EXISTS (
  SELECT 1 FROM public.products WHERE slug = 'replacement-pins'
);

UPDATE public.products
SET
  name = 'Replacement Pins',
  category = 'Controls & Accessories',
  display = true,
  badge = NULL,
  tagline = 'A spare pair for your Shaft Lok',
  summary = 'A replacement pair of long and short locking pins for the Shaft Lok mechanism.',
  description = 'Replacement locking pins for Shaft Lok marine propeller locking systems. Sold as a pair (long locking pin and short holding pin), quoted to your Mod.',
  details = 'The locking mechanism uses a long pin that engages the rotating disc and a short pin that holds it locked or unlocked. Those pins can wear over time. Replacement Pins come as a pair so you can service the unit without replacing the whole housing. Tell us which Mod you have so we send the correct pair.',
  image_url = '/assets/images/replacement-pins.png',
  alt = 'Shaft Lok replacement locking pins',
  features = '[
    {"icon": "fas fa-link", "title": "Fits Shaft Lok Mods", "text": "Sold as a spare pair for existing units — tell us which Mod so we match the set."},
    {"icon": "fas fa-gears", "title": "Long and short pins", "text": "Each pair includes the long pin that contacts the rotating disc and the short pin that holds it locked or unlocked."},
    {"icon": "fas fa-clipboard-list", "title": "Quoted as a pair", "text": "Price depends on which Mod you need."}
  ]'::jsonb,
  specs = '[
    {"name": "Used with", "value": "Existing Shaft Lok Mods as spare parts"},
    {"name": "Includes", "value": "Long locking pin and short holding pin (sold as a pair)"},
    {"name": "Pricing", "value": "Quoted as a pair after we confirm your Mod"}
  ]'::jsonb
WHERE slug = 'replacement-pins';
