-- Create payment_proofs storage bucket
-- This bucket stores payment proof images/documents uploaded by customers

INSERT INTO storage.buckets (id, name, public)
VALUES ('payment_proofs', 'payment_proofs', true)
ON CONFLICT DO NOTHING;

-- Create RLS policy to allow authenticated users to upload
CREATE POLICY "Authenticated users can upload payment proofs"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'payment_proofs'
  AND auth.role() = 'authenticated'
);

-- Create RLS policy to allow public read access
CREATE POLICY "Public can read payment proofs"
ON storage.objects
FOR SELECT
USING (bucket_id = 'payment_proofs');

-- Create RLS policy to allow admins to delete payment proofs
CREATE POLICY "Admins can delete payment proofs"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'payment_proofs'
  AND EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);
