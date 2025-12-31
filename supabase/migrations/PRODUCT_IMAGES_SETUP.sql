-- ============================================================================
-- SUPABASE STORAGE BUCKET SETUP FOR PRODUCT IMAGES
-- ============================================================================
-- 
-- This SQL script sets up the storage bucket and policies for product images.
-- Execute this in your Supabase SQL Editor to create the bucket and configure
-- access policies.
--
-- ============================================================================

-- ============================================================================
-- STEP 1: CREATE STORAGE BUCKET (Run via Supabase Dashboard)
-- ============================================================================
-- 
-- In Supabase Dashboard:
-- 1. Go to Storage > Buckets
-- 2. Click "Create a new bucket"
-- 3. Name: "product-images"
-- 4. Uncheck "Private bucket" (make it public for direct image access)
-- 5. Click "Create bucket"
--
-- Once bucket is created, run the following policies:

-- ============================================================================
-- STEP 2: CREATE STORAGE POLICIES
-- ============================================================================

-- Policy 1: Allow public read access to all product images
CREATE POLICY "Allow public read access to product images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'product-images');

-- Policy 2: Allow authenticated admin users to upload product images
CREATE POLICY "Allow admin users to upload product images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'product-images'
  AND auth.role() = 'authenticated'
  AND EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);

-- Policy 3: Allow admin users to update product images (change file content)
CREATE POLICY "Allow admin users to update product images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'product-images'
  AND auth.role() = 'authenticated'
  AND EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
)
WITH CHECK (
  bucket_id = 'product-images'
  AND auth.role() = 'authenticated'
  AND EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);

-- Policy 4: Allow admin users to delete product images
CREATE POLICY "Allow admin users to delete product images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'product-images'
  AND auth.role() = 'authenticated'
  AND EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);

-- ============================================================================
-- STEP 3: UPDATE PRODUCTS TABLE (if not already done)
-- ============================================================================
--
-- The products table should already have an 'images' column as TEXT[] (array)
-- If it doesn't, run this ALTER statement:

-- ALTER TABLE products 
-- ADD COLUMN images TEXT[] DEFAULT NULL;

-- ============================================================================
-- BUCKET INFORMATION
-- ============================================================================
--
-- Bucket Name: product-images
-- Bucket Type: Public
-- 
-- Folder Structure:
-- └── product-images/
--     └── products/
--         └── {timestamp}-{filename}
--
-- Example Image URLs:
-- https://[your-supabase-url]/storage/v1/object/public/product-images/products/1234567890-ceramic-tiles.jpg
--
-- ============================================================================
-- USAGE INSTRUCTIONS
-- ============================================================================
--
-- 1. UPLOADING IMAGES:
--    - Go to Admin Dashboard > Products > Add Product
--    - Click the image upload area and select an image from your device
--    - Image will automatically upload to Supabase Storage
--    - Image URL will be stored in the products.images array
--
-- 2. SUPPORTED FORMATS:
--    - JPG/JPEG
--    - PNG
--    - GIF
--    - WebP
--    - Max file size: 5MB
--
-- 3. ACCESSING IMAGES:
--    - Public URL format: 
--      https://[your-project-id].supabase.co/storage/v1/object/public/product-images/products/{filename}
--    - Images are publicly accessible without authentication
--
-- 4. MANAGING IMAGES:
--    - Edit Product: Upload a new image to replace the old one
--    - Delete Product: Associated images in storage can be manually deleted via Supabase Dashboard
--    - Bulk Delete: Use Supabase Storage dashboard to manage files
--
-- ============================================================================
-- SECURITY NOTES
-- ============================================================================
--
-- ✓ Only authenticated admins can upload, update, or delete images
-- ✓ Public read access allows serving images to all users
-- ✓ File names include timestamps to prevent overwrites and collisions
-- ✓ Images are stored outside the products table for better performance
-- ✓ Max file size limit (5MB) enforced in frontend
-- ✓ File type validation (images only) enforced in frontend and backend
--
-- ============================================================================
-- TROUBLESHOOTING
-- ============================================================================
--
-- Issue: "Bucket does not exist"
-- Solution: Create the bucket first via Supabase Dashboard (see STEP 1)
--
-- Issue: "Permission denied" when uploading
-- Solution: Check that user has admin role in user_roles table
--
-- Issue: "Image not loading" after upload
-- Solution: Check the image URL format and ensure bucket is public (not private)
--
-- Issue: "File size exceeds limit"
-- Solution: Reduce image size to less than 5MB before uploading
--
-- ============================================================================
-- DATABASE SCHEMA REFERENCE
-- ============================================================================
--
-- Table: storage.objects (Supabase built-in)
-- Columns:
--   - id: UUID (Primary Key)
--   - bucket_id: TEXT (Foreign Key to storage.buckets)
--   - name: TEXT (File path in bucket)
--   - owner: UUID (User who uploaded)
--   - created_at: TIMESTAMP
--   - updated_at: TIMESTAMP
--   - metadata: JSONB (File metadata)
--
-- Table: products
-- Columns:
--   - images: TEXT[] (Array of public image URLs)
--
-- ============================================================================
-- ADVANCED CONFIGURATION (Optional)
-- ============================================================================
--
-- If you want to add automatic cleanup of old images:
-- 1. Enable object versioning in Storage settings
-- 2. Create a PostgreSQL function with pg_cron for scheduled cleanup
-- 3. Delete old images after a retention period
--
-- If you want image compression:
-- 1. Use Supabase Edge Functions to process images
-- 2. Generate thumbnails and optimized sizes
-- 3. Store multiple sizes for different use cases
--
-- ============================================================================
