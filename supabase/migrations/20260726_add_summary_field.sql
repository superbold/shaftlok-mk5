-- 1. Add the summary column used for product card excerpts
ALTER TABLE public.products ADD COLUMN summary text;

-- 2. Fix Mod III EasyLok's self-contradicting bore figure (confirmed 80mm is correct)
UPDATE public.products
SET description = REPLACE(description, '64mm and smaller', '80mm and smaller')
WHERE name = 'Mod III EasyLok';

UPDATE public.products
SET max_bore_size_mm = 80
WHERE name = 'Mod III EasyLok';

-- 3. Populate card summaries (opener + key spec)
UPDATE public.products SET summary = 'Compact shaft locking unit for boats with tight engine room clearances — handles shafts up to 45mm (1.77").'
WHERE name = 'Mod I EasyLok';

UPDATE public.products SET summary = 'Our most popular shaft locking unit, built for moderate engine room space restrictions — handles shafts up to 2.25" (57.15mm).'
WHERE name = 'Mod II EasyLok';

UPDATE public.products SET summary = 'For boats with fewer space restrictions — handles shafts up to 80mm (3.149"), with the second-highest torque rating of any stocked unit.'
WHERE name = 'Mod II EasyLok High Torque';

UPDATE public.products SET summary = 'For boats with no engine room space restrictions — our largest complete stocked assembly, handling shafts up to 80mm (3.149").'
WHERE name = 'Mod III EasyLok';

UPDATE public.products SET summary = 'For boats with no engine room restrictions — accommodates up to 80mm, engineered for high torque and fixed-blade propellers.'
WHERE name = 'Mod III EasyLok High Torque';

UPDATE public.products SET summary = 'For large yachts with massive drive train torque requirements — shafts up to 4.330" (110mm).'
WHERE name = 'Mod IV';

UPDATE public.products SET summary = 'For large yachts with massive drive train torque requirements — shaft diameter sized to the specific application.'
WHERE name = 'Mod V';

UPDATE public.products SET summary = 'Our largest unit, for the largest yachts — shafts up to 6.5" (165.1mm).'
WHERE name = 'Mod VI';

UPDATE public.products SET summary = 'Compact, inexpensive hand-operated lock for Mod I–III units — no remote cable needed.'
WHERE name = 'Simple Spring Locking System';

UPDATE public.products SET summary = 'Custom-length remote locking cable for Mod I–III units — routes to your helm or below deck.'
WHERE name = 'Marine Control Cable';
