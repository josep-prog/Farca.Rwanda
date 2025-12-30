# 🔧 Fix: RLS Policy Error on Payment Proof Upload

## Problem
```
Error: Failed to upload payment proof: new row violates row-level security policy
```

This error means Supabase is blocking file uploads due to misconfigured Row-Level Security (RLS) policies.

---

## Solution: Step-by-Step Fix

### Step 1: Go to Supabase Dashboard

1. Open [Supabase Dashboard](https://supabase.com)
2. Select your project
3. Go to **SQL Editor** (left sidebar)
4. Click **"New Query"**

### Step 2: Clear Existing Policies

Copy and paste this SQL to remove conflicting policies:

```sql
-- Drop all existing payment_proofs related policies
DROP POLICY IF EXISTS "Authenticated users can upload payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "Public can view payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update their own payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access to payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "Allow admins to manage payment proofs" ON storage.objects;
```

Click **Execute** (you may see "No rows returned" which is fine).

### Step 3: Create New (Correct) Policies

Create a **new query** and paste this:

```sql
-- Ensure RLS is enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- POLICY 1: Allow authenticated users to upload files
CREATE POLICY "Allow authenticated users to upload payment proofs"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'payment_proofs');

-- POLICY 2: Allow public to view/download files
CREATE POLICY "Allow public read access to payment proofs"
ON storage.objects
FOR SELECT
USING (bucket_id = 'payment_proofs');

-- POLICY 3: Allow authenticated users to delete their own files
CREATE POLICY "Allow authenticated users to delete payment proofs"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'payment_proofs');
```

Click **Execute**.

### Step 4: Verify Policies

Create another **new query** and paste:

```sql
-- Verify policies are created
SELECT tablename, policyname, permissive, roles, qual, with_check 
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
AND policyname LIKE '%payment%'
ORDER BY policyname;
```

You should see 3 rows:
- ✅ Allow authenticated users to upload payment proofs
- ✅ Allow public read access to payment proofs
- ✅ Allow authenticated users to delete payment proofs

### Step 5: Verify Bucket Exists

Create another **new query**:

```sql
-- Check if bucket exists
SELECT id, name, public FROM storage.buckets WHERE id = 'payment_proofs';
```

You should see 1 row with `payment_proofs` bucket marked as public.

---

## Verification Checklist

✅ **In Supabase Dashboard → Storage → Buckets**
- [ ] See `payment_proofs` bucket listed
- [ ] It shows as public

✅ **In Supabase Dashboard → SQL Editor**
- [ ] 3 policies show in query results above
- [ ] No errors in the SQL Editor

---

## Test the Fix

1. Go back to your app: `http://localhost:8080/checkout`
2. Fill out the checkout form:
   - Full Name: Your name
   - Account/Contact: Your mobile money/bank account
   - Delivery Address: Your address
   - Payment Proof: Select any JPG/PNG image
3. Click **[Place Order]**
4. Should now upload successfully! ✅

---

## Why This Happened

Supabase storage has **RLS enabled by default** on the `storage.objects` table. This means:
- Without policies, NO uploads are allowed
- With incorrect policies, uploads are blocked
- We need policies that explicitly allow authenticated users to upload

The original policies had some syntax issues. The fixed version:
- ✅ Allows any authenticated user to upload to `payment_proofs` bucket
- ✅ Allows public read access (to view images)
- ✅ Allows users to delete their own uploads

---

## Still Having Issues?

If you still get the error after following these steps:

### Option 1: Disable RLS Temporarily (Not Recommended for Production)

```sql
-- ONLY for development testing!
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;
```

Then try uploading. If it works, the issue was RLS policies. Re-enable and use steps above.

### Option 2: Check User Authentication

In your browser console, verify user is logged in:
```javascript
// Open browser DevTools → Console
// Type:
import { supabase } from '@/integrations/supabase/client';
const { data } = await supabase.auth.getSession();
console.log(data.session); // Should show user info, NOT null
```

If `null`, user isn't logged in. Login first before checkout.

### Option 3: Check Bucket Exists

In Supabase → Storage → Buckets, verify:
- [ ] Bucket named `payment_proofs` exists
- [ ] It's marked as **Public** (not private)

---

## References

- [Supabase Storage RLS Documentation](https://supabase.com/docs/guides/storage/security/access-control)
- [Supabase Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
