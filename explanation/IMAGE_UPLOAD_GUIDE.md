// ============================================================================
// PRODUCT IMAGE UPLOAD FEATURE - IMPLEMENTATION GUIDE
// ============================================================================
//
// This document explains the new product image upload feature added to the
// Admin Dashboard. Images are uploaded to Supabase Storage and linked to
// products.
//
// ============================================================================

## QUICK START

### Step 1: Set Up Supabase Storage Bucket

1. Open Supabase Dashboard
2. Go to **Storage** > **Buckets**
3. Click **"Create a new bucket"**
4. Configure:
   - Name: `product-images`
   - Privacy: **Public** (uncheck "Private bucket")
5. Click **Create bucket**

### Step 2: Apply SQL Policies

1. Go to **SQL Editor** in Supabase
2. Copy all code from: [PRODUCT_IMAGES_SETUP.sql](./PRODUCT_IMAGES_SETUP.sql)
3. Paste and run the policies
4. This secures the bucket so only admins can upload/delete

### Step 3: Start Using It

1. Run your development server: `npm run dev`
2. Go to Admin Dashboard: `http://localhost:8080/authadmin`
3. Navigate to **Products** > **Add Product**
4. Fill in product details
5. Drag & drop or click the image upload area
6. Click **Create Product** - image uploads automatically

---

## FEATURE DETAILS

### Upload Interface

The product form now includes a dedicated image upload section with:

- **Drag & Drop Zone**: Simply drag an image file and drop it
- **Click Upload**: Click to browse files from your device
- **Live Preview**: See the image before creating the product
- **File Info**: Shows selected filename and file size
- **Remove Option**: Click the X button to deselect an image

### Supported Image Formats

✅ **Supported:**
- JPG / JPEG
- PNG
- GIF
- WebP
- And other standard image formats

❌ **Not Supported:**
- Non-image files (will show error)
- Images larger than 5MB (will show error)

### Image Upload Process

```
1. Select Image
   ├─ File type validation (must be image)
   ├─ File size check (max 5MB)
   └─ Generate preview

2. Submit Form
   ├─ Upload to Supabase Storage
   ├─ Get public URL
   ├─ Save URL to products.images array
   └─ Show success message

3. Image Stored
   ├─ Location: product-images/products/{timestamp}-{filename}
   ├─ Public URL accessible worldwide
   └─ Linked to product record
```

### Generated URLs

Each uploaded image gets a permanent public URL:

```
https://[your-project-id].supabase.co/storage/v1/object/public/product-images/products/1234567890-ceramic-tiles.jpg
```

This URL is:
- ✅ Permanent (won't change)
- ✅ Public (accessible without login)
- ✅ Cacheable (CDN optimized)
- ✅ Secure (direct file access only)

---

## TECHNICAL IMPLEMENTATION

### Code Changes

#### 1. **Products.tsx Component Updates**

Added state variables:
```typescript
const [selectedFile, setSelectedFile] = useState<File | null>(null);
const [imagePreview, setImagePreview] = useState<string | null>(null);
const [uploadingImage, setUploadingImage] = useState(false);
```

Added handlers:
```typescript
// Handle file selection
const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
  // Validates file type and size
  // Creates preview
}

// Upload to Supabase Storage
const uploadImageToStorage = async (file: File): Promise<string | null> => {
  // Uploads file with unique timestamp-based filename
  // Returns public URL
}

// Updated handleSubmit
const handleSubmit = async (e: React.FormEvent) => {
  // If image selected, uploads it first
  // Then saves product with image URL
}
```

#### 2. **Form UI Updates**

Added image upload section with:
- File input with drag & drop
- Live preview with remove button
- File info display
- Loading state during upload

#### 3. **Database Integration**

Uses existing `products.images` column:
- Type: `TEXT[]` (array of strings)
- Stores: Array of image URLs
- Supports: Multiple images per product (currently 1)

---

## DATABASE SCHEMA

### Storage Bucket Structure

```
product-images/
├── products/
│   ├── 1704067200000-ceramic-tiles.jpg
│   ├── 1704067201234-floor-paint.png
│   ├── 1704067202456-wood-finish.jpg
│   └── ...
```

### Products Table Extension

```sql
Column: images
Type: TEXT[] (PostgreSQL array)
Example: 
  ["https://...supabase.co/.../1704067200000-ceramic-tiles.jpg"]
```

---

## SECURITY & POLICIES

### Bucket Access Control

The storage policies restrict:

✅ **Allowed:**
- Public READ: Anyone can view/download images
- Admin UPLOAD: Only authenticated admins can upload
- Admin UPDATE: Only admins can replace images
- Admin DELETE: Only admins can remove images

❌ **Blocked:**
- Non-admins cannot upload
- Non-admins cannot delete
- Anonymous users cannot upload
- Regular users cannot manage images

### Policy Details

```sql
-- Public can read
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Only admins can upload
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images'
  AND auth.role() = 'authenticated'
  AND EXISTS (SELECT 1 FROM user_roles 
             WHERE user_id = auth.uid() AND role = 'admin')
);

-- And similar for UPDATE and DELETE
```

---

## USAGE EXAMPLES

### Adding a Product with Image

1. Click "Add Product" in Products page
2. Fill in details:
   - Product Name: "Premium Ceramic Tiles"
   - Slug: "premium-ceramic-tiles"
   - Price: 15000 RWF
   - Stock: 50
   - Category: Building Materials
3. Click image upload area
4. Select `ceramic-tiles.jpg` from your computer
5. See preview appear
6. Click "Create Product"
7. Image uploads and product is created
8. Success message appears

### Editing a Product

1. Click Edit icon on a product
2. Change any details
3. Upload new image if needed (optional)
4. Click "Update Product"
5. If new image uploaded, old one remains (can delete manually)

---

## ERROR HANDLING

### Common Errors & Solutions

**Error: "Please select a valid image file"**
- ❌ You selected a non-image file
- ✅ Select JPG, PNG, GIF, or WebP file

**Error: "Image size must be less than 5MB"**
- ❌ Your image file is too large
- ✅ Compress the image or select a smaller one
- 💡 Most images are under 2MB when properly formatted

**Error: "Failed to upload image"**
- ❌ Network error or Supabase connectivity issue
- ✅ Check your internet connection
- ✅ Verify Supabase project is running
- ✅ Check Storage bucket exists and is public

**Error: "Bucket does not exist"**
- ❌ Storage bucket wasn't created
- ✅ Follow Step 1 in Quick Start section
- ✅ Verify bucket name is exactly "product-images"

**Error: "Permission denied"**
- ❌ Your user is not an admin
- ✅ Check user_roles table
- ✅ Ensure your user has role="admin"

---

## ADVANCED FEATURES

### Future Enhancements

These features can be added later:

1. **Multiple Images per Product**
   - Store array of URLs
   - Gallery view on product detail page
   - Reorder images

2. **Image Optimization**
   - Auto-generate thumbnails
   - Create multiple sizes (small, medium, large)
   - Automatic WebP conversion

3. **Image Editing**
   - Crop images before upload
   - Apply filters
   - Resize on upload

4. **Batch Operations**
   - Upload multiple images at once
   - Bulk image replacement
   - Auto-cleanup old images

---

## PERFORMANCE CONSIDERATIONS

### Image Optimization Tips

1. **Before Uploading:**
   - Resize to max 1920px width
   - Compress using TinyPNG or similar
   - Use PNG for graphics, JPG for photos

2. **File Size Targets:**
   - Target: 100-200 KB per image
   - Maximum: 5 MB (enforced by system)
   - Most images: 50-500 KB

3. **CDN Benefits:**
   - Supabase uses Cloudflare CDN
   - Images cached globally
   - Fast delivery worldwide

---

## TROUBLESHOOTING CHECKLIST

Before reporting issues:

- [ ] Bucket "product-images" created in Storage
- [ ] Bucket is set to PUBLIC (not Private)
- [ ] Storage policies applied via SQL
- [ ] User has admin role in user_roles
- [ ] Image file is valid format (JPG, PNG, etc)
- [ ] Image size less than 5MB
- [ ] Internet connection is stable
- [ ] Supabase project is active

---

## FILE LOCATION REFERENCE

**Key Files Modified:**
- `src/pages/admin/Products.tsx` - Image upload UI and logic

**SQL Setup File:**
- `PRODUCT_IMAGES_SETUP.sql` - Storage bucket creation and policies

**Configuration:**
- Supabase bucket: `product-images`
- Storage path: `products/{filename}`

---

## SUPPORT

For issues with:

- **Image Upload**: Check PRODUCT_IMAGES_SETUP.sql for bucket setup
- **Policies**: Verify SQL policies are applied in Supabase
- **URLs**: Check that bucket is PUBLIC in Storage settings
- **Permissions**: Verify user has admin role

---

**Last Updated:** December 30, 2025
**Feature Status:** ✅ Production Ready
**Version:** 1.0
