-- Optional company name on a quote inquiry (shipyards, architects, contractors).
ALTER TABLE public.quotes
  ADD COLUMN IF NOT EXISTS company text;
