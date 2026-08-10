-- Snapshot of quoted_price/quote_notes/line_items as they were at the moment
-- of the last send, alongside the already-existing sent_html/sent_at. Lets
-- the "Already Sent" re-send confirmation on pages/qms/[id].vue tell whether
-- the admin's current draft actually differs from what the sailor already
-- received, vs. re-sending the identical quote. Null until first send;
-- overwritten on every re-send (same "most recent send wins" behavior as
-- sent_html/sent_at).
ALTER TABLE public.quotes ADD COLUMN sent_quoted_price numeric;
ALTER TABLE public.quotes ADD COLUMN sent_quote_notes text;
ALTER TABLE public.quotes ADD COLUMN sent_line_items jsonb;
