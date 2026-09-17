-- Human quote number: YYYY-MMDD-XXXXX (Chicago date + first five letters of name).
ALTER TABLE public.quotes
  ADD COLUMN IF NOT EXISTS quote_number text;

CREATE UNIQUE INDEX IF NOT EXISTS quotes_quote_number_key
  ON public.quotes (quote_number)
  WHERE quote_number IS NOT NULL;
