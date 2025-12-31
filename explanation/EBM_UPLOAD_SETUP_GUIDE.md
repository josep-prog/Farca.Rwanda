# EBM Document Upload Feature - Complete Setup Guide

## Overview
This feature allows admins to upload EBM (proof of purchase) documents for client access, and clients can view/download them from their order page.

## Step 1: Create the Supabase Storage Bucket

### Option A: Using SQL (Recommended)
1. Go to **Supabase Dashboard** → **SQL Editor** → **New Query**
2. Open the file: `/EBM_BUCKET_SETUP.sql`
3. Copy and paste ALL the SQL code into the SQL Editor
4. Click **Execute**
5. Verify the bucket was created:
   - Go to **Storage** in Supabase Dashboard
   - You should see a new bucket named `ebm_documents`

### Option B: Manual Setup via UI
If SQL fails, create manually:

1. **Create Bucket:**
   - Go to **Supabase Dashboard** → **Storage**
   - Click **New Bucket**
   - Name: `ebm_documents`
   - Set to **Public** (allow public read access)

2. **Create Policies:**
   - Select `ebm_documents` bucket
   - Go to **Policies** tab
   - Add these policies:
     - **INSERT:** "Enable insert for authenticated users" → Authenticated users can upload
     - **SELECT:** "Enable select for public" → Public can view/download
     - **UPDATE:** "Enable update for authenticated users" → Authenticated users can update
     - **DELETE:** "Enable delete for authenticated users" → Authenticated users can delete

## Step 2: Update Orders Table

The `ebm_document` column should already exist, but if it doesn't, run this SQL:

```sql
ALTER TABLE orders ADD COLUMN ebm_document TEXT DEFAULT NULL;
```

## Step 3: Integrate Upload Component in Admin Order Details

In your admin Orders Management page, add the EBM upload component to the order details modal.

### Example Integration:

```tsx
import { EBMDocumentUpload } from "@/components/admin/EBMDocumentUpload";

// Inside your order details modal:
<EBMDocumentUpload
  orderId={selectedOrder.id}
  currentEBMDocument={selectedOrder.ebm_document}
  onUploadSuccess={(documentUrl) => {
    // Update local state or refetch order
    setSelectedOrder({
      ...selectedOrder,
      ebm_document: documentUrl,
    });
  }}
/>
```

## Step 4: Verify Client-Side Display

The client MyOrders page already shows the EBM document status:
- ✅ If admin uploaded → Shows "Download" button
- ❌ If not uploaded yet → Shows "NOT YET" badge

## Features

### Admin Side:
- ✅ Select and upload EBM documents (PDF, Images, Word Docs)
- ✅ File size validation (max 10MB)
- ✅ File type validation
- ✅ Real-time upload status with loading indicator
- ✅ Success/error notifications
- ✅ View current document
- ✅ Remove/delete documents
- ✅ Automatic database update

### Client Side:
- ✅ View EBM document status in orders table
- ✅ Download uploaded documents
- ✅ View full document in modal (supports PDF, images, Word)
- ✅ "NOT YET" indicator when not uploaded

## File Structure

```
src/
├── components/
│   └── admin/
│       └── EBMDocumentUpload.tsx          (New upload component)
└── pages/
    └── MyOrders.tsx                        (Already updated to show EBM column)

supabase/
├── config.toml
└── migrations/
    └── EBM_BUCKET_SETUP.sql               (New migration)
```

## Supported File Formats

- **PDF:** `.pdf`
- **Images:** `.jpg`, `.jpeg`, `.png`, `.webp`
- **Documents:** `.doc`, `.docx`
- **Max Size:** 10MB

## Environment Variables

No additional environment variables needed. Uses existing Supabase client configuration.

## Testing

### Test as Admin:
1. Log in as admin
2. Go to Orders Management
3. Open any order details
4. Upload an EBM document
5. Verify file uploads and success message appears

### Test as Client:
1. Log in as regular user
2. Go to "My Orders" page
3. Check the EBM Document column
4. Click "Download" button to view/download the document
5. If not uploaded, you should see "NOT YET" badge

## Troubleshooting

### Issue: "Permission denied" on bucket creation
**Solution:** This is expected. Make sure the SQL policies are created below the bucket creation.

### Issue: File upload fails
**Possible causes:**
- File size exceeds 10MB
- Unsupported file type
- Supabase bucket policies not set up correctly
- Check browser console for detailed error

### Issue: Admin can't see upload field
**Solution:** 
- Make sure the component is imported correctly
- Verify user role is "admin"
- Check browser console for import errors

### Issue: Client can't download document
**Possible causes:**
- Document URL is not being saved to database
- Storage policies not allowing public read access
- Check Supabase Storage policies

## Database Schema

### Orders Table Column:
```sql
ebm_document TEXT DEFAULT NULL  -- Stores the public URL of the EBM document
```

## Next Steps

1. Run the SQL migration: `/EBM_BUCKET_SETUP.sql`
2. Integrate `EBMDocumentUpload` component in your admin order details modal
3. Test the upload and download flow
4. Deploy to production

---

For questions or issues, check the Supabase Storage documentation:
https://supabase.com/docs/guides/storage
