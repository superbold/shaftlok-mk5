-- Custom Bore is a quote add-on, not a public catalog product.
-- Keep the row for QMS Items Quoted; hide it from /products and the nav.

UPDATE public.products
SET display = false
WHERE slug = 'custom-bore';
