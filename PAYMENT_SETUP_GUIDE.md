# Payment Setup Guide

## Overview
The improved payment page now includes:
- ✅ Payment method selection (Bank Transfer / Mobile Money)
- ✅ Account details display for each method
- ✅ Payment proof upload (screenshot/receipt)
- ✅ Clean, simple interface

## Required Setup

### 1. Create Storage Bucket in Supabase

You need to create a storage bucket for payment proofs:

1. Go to your **Supabase Dashboard**
2. Navigate to **Storage** → **Buckets**
3. Click **Create a new bucket**
4. Set the following:
   - **Name**: `payment-proofs`
   - **Public bucket**: ✅ Yes (checked)
5. Click **Create bucket**

### 2. Update Database Schema (Optional)

If your orders table doesn't have these fields, add them:

```sql
ALTER TABLE orders ADD COLUMN payment_method VARCHAR(50);
ALTER TABLE orders ADD COLUMN payment_proof TEXT;
```

Or run this migration if creating fresh:

```sql
CREATE TABLE orders (
  ...existing fields...
  payment_method VARCHAR(50),        -- "bank" or "mobile"
  payment_proof TEXT,                -- URL to uploaded proof
  ...
);
```

## Payment Methods

### Bank Transfer
- **Account Name**: BuildMart Rwanda Ltd
- **Account Number**: 1234567890
- **Bank**: BK Bank Rwanda

👉 **Note**: Update these details in `src/pages/Checkout.tsx` with your actual account information

### Mobile Money
- **MTN**: +250 78X XXX XXX
- **Airtel**: +250 73X XXX XXX

👉 **Note**: Update these contact numbers in `src/pages/Checkout.tsx` with your actual details

## File Upload Features

### What Users Can Upload
- ✅ Screenshots of payment confirmation
- ✅ Bank transfer receipts
- ✅ Mobile money transaction receipts
- ✅ Invoice/proof documents

### File Types Accepted
- PNG, JPG (images)
- PDF (documents)
- Max 5MB per file

### How It Works
1. User selects payment method (radio button)
2. User uploads payment proof (drag & drop or click)
3. File is validated (type & size)
4. On order submission:
   - File is uploaded to Supabase storage
   - File URL is stored in orders table
   - Order is created with payment details

## Payment Flow

```
┌─────────────────────────────────────┐
│  User Selects Payment Method        │
│  [◉ Bank Transfer]  [ ] Mobile Money│
└────────────┬────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│  Account Details Displayed:         │
│  • Account Name                     │
│  • Account Number                   │
│  • Bank/Contact Info                │
└────────────┬────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│  User Uploads Payment Proof         │
│  [📎 Drag drop or click to upload]  │
└────────────┬────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│  User Submits Order                 │
│  [Place Order Button]               │
└────────────┬────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│  • File uploaded to storage         │
│  • Order created with payment info  │
│  • Confirmation displayed           │
└─────────────────────────────────────┘
```

## Code Changes

### State Management
```typescript
const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("bank");
const [paymentProof, setPaymentProof] = useState<File | null>(null);
```

### Form Validation
```typescript
if (!paymentProof) {
  toast.error("Payment proof is required");
  return false;
}
```

### File Upload
```typescript
const { data: uploadData, error: uploadError } = await supabase.storage
  .from("payment-proofs")
  .upload(fileName, paymentProof);
```

### Order Data
```typescript
{
  payment_method: selectedPaymentMethod,  // "bank" or "mobile"
  payment_proof: paymentProofUrl,         // URL to uploaded file
  ...otherFields
}
```

## Customization

### Change Payment Methods

Edit `src/pages/Checkout.tsx` around line 365:

```typescript
{/* Bank Transfer */}
<label className="flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer">
  <input type="radio" name="payment" value="bank" ... />
  <div className="flex-1">
    <p className="font-semibold">Bank Transfer</p>
    <p className="text-sm">Account Name: YOUR NAME</p>
    <p className="text-sm">Account Number: YOUR ACCOUNT</p>
    <p className="text-sm">Bank: YOUR BANK</p>
  </div>
</label>
```

### Change File Upload Constraints

Edit the accept attribute:
```typescript
accept="image/*,.pdf"  // Change to accept more types
```

Edit max size validation:
```typescript
if (paymentProof.size > 5 * 1024 * 1024) {  // 5MB
  toast.error("File too large");
  return;
}
```

## Testing

### Test Payment Upload Locally
1. Go to checkout page
2. Fill in customer details
3. Select payment method (Bank or Mobile)
4. Upload a test image/PDF
5. Click "Place Order"
6. Check Supabase Storage → payment-proofs bucket for uploaded file
7. Check orders table for payment_method and payment_proof fields

### Test Cases
- ✅ User can see bank account details
- ✅ User can see mobile money contacts
- ✅ User can upload payment proof
- ✅ File upload shows filename
- ✅ Order creates with payment info
- ✅ File accessible via URL

## Admin View

### View Payment Proofs in Admin Dashboard

You can add this to admin/Orders.tsx to show payment details:

```typescript
{order.payment_method && (
  <div className="text-sm">
    <p><strong>Payment:</strong> {order.payment_method}</p>
    {order.payment_proof && (
      <a href={order.payment_proof} target="_blank" rel="noopener noreferrer" 
         className="text-blue-600 hover:underline">
        View Proof
      </a>
    )}
  </div>
)}
```

## Summary

The improved payment page is now:
- ✅ **Clean**: Shows only essential information
- ✅ **Clear**: Account details visible for each method
- ✅ **Simple**: Easy to select and upload
- ✅ **Secure**: Files uploaded to Supabase storage
- ✅ **Trackable**: Payment proof linked to order

**Status**: 🟢 Ready for use after Supabase bucket setup
