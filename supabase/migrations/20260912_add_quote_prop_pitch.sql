-- Sailor-provided propeller pitch from the public quote form
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS prop_pitch text;
