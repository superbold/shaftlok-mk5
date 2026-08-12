-- The 'finished' status was added to the app's QUOTE_STATUSES list (utils/quoteStatus.ts)
-- but the DB check constraint was never updated to match, so saving a quote as
-- "Quote Finished" failed with a quotes_status_check violation.
ALTER TABLE public.quotes DROP CONSTRAINT quotes_status_check;

ALTER TABLE public.quotes ADD CONSTRAINT quotes_status_check
  CHECK (status = ANY (ARRAY['new'::text, 'quoted'::text, 'in_review'::text, 'finished'::text, 'sent'::text, 'won'::text, 'lost'::text]));
