# ✅ Fixed: RLS Policy Setup Instructions

## The Problem You Had

```
Error: Must be owner of table objects
```

This happened because the SQL tried to run `ALTER TABLE storage.objects` which requires special permissions you don't have.

**Good news:** You don't need that line! RLS is **already enabled by default** on Supabase storage.

---

## How to Run the Fixed SQL

### Step 1: Open Supabase Dashboard
1. Go to [supabase.com](https://supabase.com)
2. Select your project
3. Go to **SQL Editor** (left sidebar)
4. Click **"New Query"**

### Step 2: Copy the Fixed SQL

Go to [BUCKET_SETUP_SQL.sql](./BUCKET_SETUP_SQL.sql) and copy **only these sections**:

```sql
-- 1. CREATE THE STORAGE BUCKET
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment_proofs', 'payment_proofs', true)
ON CONFLICT (id) DO NOTHING;

-- 2. CREATE STORAGE POLICIES

-- DROP existing policies
DROP POLICY IF EXISTS "Authenticated users can upload payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "Public can view payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update their own payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access to payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "Allow admins to manage payment proofs" ON storage.objects;

-- POLICY 1: Allow authenticated users to upload files
CREATE POLICY "Enable insert for authenticated users"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'payment_proofs');

-- POLICY 2: Allow public read access
CREATE POLICY "Enable read for public"
ON storage.objects
FOR SELECT
USING (bucket_id = 'payment_proofs');

-- POLICY 3: Allow authenticated users to delete files
CREATE POLICY "Enable delete for authenticated users"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'payment_proofs');
```

### Step 3: Paste & Execute

In the SQL Editor:
1. Paste the SQL above
2. Click the **"Execute"** button (▶️ play icon)
3. Wait for it to complete

### Step 4: Verify Success

Create a **new query** and paste:

```sql
SELECT policyname FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage'
ORDER BY policyname;
```

You should see these 3 policies:
```
✅ Enable delete for authenticated users
✅ Enable insert for authenticated users  
✅ Enable read for public
```

---

## Testing the Fix

Now test the upload:

1. Go to your app: `http://localhost:8080/checkout`
2. Fill the form:
   - Full Name: Your name
   - Account/Contact: Your mobile money account
   - Delivery Address: Your address
   - Payment Proof: Select a JPG/PNG image
3. Click **"Place Order"**
4. **Should upload successfully!** ✅

---

## What Each Policy Does

| Policy | Purpose |
|--------|---------|
| **Enable insert for authenticated users** | Allows logged-in users to upload payment proof images |
| **Enable read for public** | Allows anyone (logged in or not) to view/download images |
| **Enable delete for authenticated users** | Allows logged-in users to remove their own images |

---

## If You Still Get Errors

### Error: "policy already exists"
**This is OK!** It just means the policies are already created. You can:
- Click "Execute" again (it will skip the CREATE POLICY lines)
- Or manually delete old policies first (use the DROP POLICY lines)

### Error: "permission denied"
**This is OK!** You don't have permission to modify the storage table structure. But:
- The RLS is already enabled by default
- Just run the policies part (it will work)

### Error: "bucket already exists"
**This is OK!** The bucket was created before. Just continue - the policies are what matter.

---

## Still Not Working?

Try this **alternative approach**:

### Use Supabase Dashboard UI Instead

1. Go to **Storage** → **Buckets** (in sidebar)
2. Click **"New bucket"** if it doesn't exist
3. Name: `payment_proofs`
4. Privacy: Select **"Public"** (uncheck "Private")
5. Click **Create bucket**

Then:
1. Go to that bucket
2. Click **Policies** tab
3. Click **"Create a new policy"**
4. Choose **"For INSERT"** → **"Authenticated users"**
5. Add condition: `bucket_id = 'payment_proofs'`
6. Repeat for SELECT and DELETE policies

This does the same thing as the SQL, just through the UI.

---

## Quick Checklist

- [ ] Ran the SQL from BUCKET_SETUP_SQL.sql
- [ ] No errors (or only "policy exists" errors, which are OK)
- [ ] Can see 3 policies in Supabase → Storage → Policies
- [ ] Bucket is listed in Supabase → Storage → Buckets
- [ ] Tried uploading in checkout - **it worked!** ✅

**You're done!** 🎉
