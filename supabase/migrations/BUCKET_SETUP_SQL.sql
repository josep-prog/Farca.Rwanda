-- ============================================
-- PAYMENT PROOFS BUCKET SETUP FOR SUPABASE
-- ============================================
-- Run this in your Supabase SQL Editor
-- Go to: Dashboard > SQL Editor > New Query
-- Copy & paste ALL the code below, then Execute

-- ============================================
-- 1. CREATE THE STORAGE BUCKET
-- ============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment_proofs', 'payment_proofs', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 2. CREATE STORAGE POLICIES (FIXED VERSION)
-- ============================================
-- NOTE: RLS is already enabled by default on storage.objects
-- No need to alter the table (you don't have permission anyway)

-- DROP existing policies to avoid conflicts
DROP POLICY IF EXISTS "Authenticated users can upload payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "Public can view payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update their own payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access to payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "Allow admins to manage payment proofs" ON storage.objects;

-- POLICY 1: Allow authenticated users to upload files to payment_proofs bucket
-- ============================================
CREATE POLICY "Enable insert for authenticated users"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'payment_proofs');

-- POLICY 2: Allow public read access to view/download files
-- ============================================
CREATE POLICY "Enable read for public"
ON storage.objects
FOR SELECT
USING (bucket_id = 'payment_proofs');

-- POLICY 3: Allow authenticated users to delete files
-- ============================================
CREATE POLICY "Enable delete for authenticated users"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'payment_proofs');

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these AFTER executing the above to verify setup:

-- Check if bucket was created:
-- SELECT id, name, public FROM storage.buckets WHERE id = 'payment_proofs';

-- Check all policies are created:
-- SELECT policyname FROM pg_policies 
-- WHERE tablename = 'objects' AND schemaname = 'storage'
-- AND policyname LIKE '%payment%' OR policyname LIKE '%insert%' OR policyname LIKE '%read%' OR policyname LIKE '%delete%';

-- ============================================
-- TROUBLESHOOTING
-- ============================================
-- If you get "permission denied" error on ALTER TABLE:
-- This is EXPECTED and OK! Just means:
-- - RLS is already enabled by default
-- - Your user role isn't an owner, which is fine
-- - Skip that line and continue with the policies

-- If you get "policy already exists" error:
-- This is OK! Just means the policies are already set up
-- You can ignore these errors and continue

-- If bucket creation fails with conflict:
-- The bucket already exists, which is fine
-- Make sure RLS policies below are created

-- ============================================
-- SUCCESS INDICATORS
-- ============================================
-- After running, you should see:
-- ✅ "payment_proofs" bucket in Storage > Buckets
-- ✅ 3 policies created (check Policies tab)
-- ✅ File uploads work in your app

-- ============================================
