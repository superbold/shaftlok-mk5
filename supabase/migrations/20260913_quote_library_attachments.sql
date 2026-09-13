-- Library document IDs selected on a quote for email attachments.

ALTER TABLE public.quotes
  ADD COLUMN IF NOT EXISTS attachment_ids uuid[] NOT NULL DEFAULT '{}';

ALTER TABLE public.quotes
  ADD COLUMN IF NOT EXISTS sent_attachment_ids uuid[];
