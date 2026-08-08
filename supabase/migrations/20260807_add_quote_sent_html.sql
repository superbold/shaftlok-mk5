-- Stores the exact HTML that was emailed to the sailor at send time, so a
-- historical quote reflects what was actually sent even if the payment
-- details, warning text, or template styling change later. Null until the
-- quote has been sent at least once; overwritten on every re-send (most
-- recent send wins, matching how sent_at already behaves).
ALTER TABLE public.quotes ADD COLUMN sent_html text;
