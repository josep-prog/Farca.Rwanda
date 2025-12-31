-- ============================================
-- EBM DOCUMENTS BUCKET SETUP FOR SUPABASE
-- ============================================
-- Run this in your Supabase SQL Editor
-- Go to: Dashboard > SQL Editor > New Query
-- Copy & paste ALL the code below, then Execute

-- ============================================
-- 1. CREATE THE STORAGE BUCKET FOR EBM DOCS
-- ============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('ebm_documents', 'ebm_documents', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 2. CREATE STORAGE POLICIES
-- ============================================
-- DROP existing policies to avoid conflicts
DROP POLICY IF EXISTS "Enable insert for admin EBM uploads" ON storage.objects;
DROP POLICY IF EXISTS "Enable read for public EBM access" ON storage.objects;
DROP POLICY IF EXISTS "Enable update for admin EBM docs" ON storage.objects;
DROP POLICY IF EXISTS "Enable delete for admin EBM docs" ON storage.objects;

-- POLICY 1: Allow authenticated users (admin) to upload EBM documents
-- ============================================
CREATE POLICY "Enable insert for admin EBM uploads"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'ebm_documents');

-- POLICY 2: Allow public read access to view/download EBM documents
-- ============================================
CREATE POLICY "Enable read for public EBM access"
ON storage.objects
FOR SELECT
USING (bucket_id = 'ebm_documents');

-- POLICY 3: Allow authenticated users (admin) to update EBM documents
-- ============================================
CREATE POLICY "Enable update for admin EBM docs"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'ebm_documents')
WITH CHECK (bucket_id = 'ebm_documents');

-- POLICY 4: Allow authenticated users (admin) to delete EBM documents
-- ============================================
CREATE POLICY "Enable delete for admin EBM docs"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'ebm_documents');

-- ============================================
-- 3. VERIFY TABLE STRUCTURE
-- ============================================
-- Check if orders table has ebm_document column:
-- SELECT column_name FROM information_schema.columns 
-- WHERE table_name = 'orders' AND column_name = 'ebm_document';

-- If the column doesn't exist, run the ALTER TABLE command below:
-- ALTER TABLE orders ADD COLUMN ebm_document TEXT DEFAULT NULL;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these AFTER executing the above to verify setup:

-- Check if bucket was created:
-- SELECT id, name, public FROM storage.buckets WHERE id = 'ebm_documents';

-- Check all policies are created:
-- SELECT policyname FROM pg_policies 
-- WHERE tablename = 'objects' AND schemaname = 'storage'
-- AND policyname LIKE '%ebm%' OR policyname LIKE '%EBM%';

-- ============================================
-- SUCCESS INDICATORS
-- ============================================
-- After running, you should see:
-- ✅ "ebm_documents" bucket in Storage > Buckets
-- ✅ 4 policies created (insert, select, update, delete)
-- ✅ ebm_document column exists in orders table
-- ✅ Admin can upload, clients can view/download
