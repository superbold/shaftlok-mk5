-- Track whether the owner has opened an inquiry in QMS.
-- NULL = unread (new sailor submissions). Opening /qms/:id stamps read_at.

ALTER TABLE public.quotes
  ADD COLUMN IF NOT EXISTS read_at timestamptz;

-- Quotes already past intake have been seen. Leave current New (unsent) inbox unread.
UPDATE public.quotes
SET read_at = COALESCE(updated_at, created_at)
WHERE read_at IS NULL
  AND (status IS DISTINCT FROM 'new' OR sent_at IS NOT NULL);
