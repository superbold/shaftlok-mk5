-- Shaft Lok Library: shared document metadata + private storage bucket (admin-only).

CREATE TABLE IF NOT EXISTS public.library_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  file_name text NOT NULL,
  storage_path text NOT NULL UNIQUE,
  content_type text,
  file_size bigint,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS library_documents_created_at_idx
  ON public.library_documents (created_at DESC);

ALTER TABLE public.library_documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can select library documents" ON public.library_documents;
DROP POLICY IF EXISTS "Admins can insert library documents" ON public.library_documents;
DROP POLICY IF EXISTS "Admins can update library documents" ON public.library_documents;
DROP POLICY IF EXISTS "Admins can delete library documents" ON public.library_documents;

CREATE POLICY "Admins can select library documents"
ON public.library_documents
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can insert library documents"
ON public.library_documents
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can update library documents"
ON public.library_documents
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can delete library documents"
ON public.library_documents
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'shaft-lok-library',
  'shaft-lok-library',
  false,
  20971520,
  ARRAY[
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ]::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Admins can upload library files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can read library files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update library files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete library files" ON storage.objects;

CREATE POLICY "Admins can upload library files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'shaft-lok-library'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can read library files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'shaft-lok-library'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can update library files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'shaft-lok-library'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
)
WITH CHECK (
  bucket_id = 'shaft-lok-library'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can delete library files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'shaft-lok-library'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);
