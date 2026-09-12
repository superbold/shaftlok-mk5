-- Simplify quote statuses to: new, sent, followed_up, won, dead
-- Remap legacy values, then replace the CHECK constraint.

UPDATE public.quotes SET status = 'new'
WHERE status IN ('quoted', 'in_review', 'finished');

UPDATE public.quotes SET status = 'dead'
WHERE status = 'lost';

ALTER TABLE public.quotes DROP CONSTRAINT IF EXISTS quotes_status_check;

ALTER TABLE public.quotes ADD CONSTRAINT quotes_status_check
  CHECK (status = ANY (ARRAY[
    'new'::text,
    'sent'::text,
    'followed_up'::text,
    'won'::text,
    'dead'::text
  ]));
