-- Product detail page content (editable via /products/manage)
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS tagline text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS details text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS features jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS specs jsonb;

-- Bridge existing rows: show current description on detail pages until details is filled in
UPDATE public.products
SET details = description
WHERE details IS NULL AND description IS NOT NULL;

UPDATE public.products
SET tagline = summary
WHERE tagline IS NULL AND summary IS NOT NULL;
