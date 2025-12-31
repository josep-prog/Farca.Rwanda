# 🎨 Payment Page Implementation - Complete Visual Reference

## 🏗️ Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     CHECKOUT PAGE FLOW                          │
└─────────────────────────────────────────────────────────────────┘

USER INTERFACE
├─ Customer Information Section
│  ├─ Full Name Input
│  ├─ Account/Contact Information Input
│  └─ Delivery Address Input
│
├─ Payment Proof Section
│  ├─ File Upload Area (Drag & Drop)
│  ├─ File Preview (Images)
│  └─ File Name Display (PDFs)
│
├─ Order Summary (Sticky Sidebar)
│  ├─ Order Items List
│  ├─ Subtotal
│  ├─ Tax (18%)
│  ├─ Total Amount
│  └─ Place Order Button
│
└─ Form Actions
   ├─ Cancel Button
   └─ Place Order Button

              ↓↓↓

VALIDATION LAYER
├─ Full Name (required, non-empty)
├─ Account/Contact (required, non-empty)
├─ Delivery Address (required, non-empty)
├─ Payment Proof (required, file)
│  ├─ File Size (≤ 5MB)
│  └─ File Type (JPG, PNG, GIF, PDF)
└─ Order Items (≥ 1 item)

              ↓↓↓

PROCESSING
├─ Validate All Fields
├─ Upload File to Storage
│  └─ supabase.storage.from("payment_proofs").upload()
├─ Get Public URL
├─ Create Order Record
│  └─ supabase.from("orders").insert()
├─ Create Order Items
│  └─ supabase.from("order_items").insert()
├─ Clear Cart
│  └─ supabase.from("cart_items").delete()
└─ Show Success Toast

              ↓↓↓

RESULT
├─ Redirect to Confirmation Page
└─ Display Order Number & Summary
```

---

## 📱 Mobile vs Desktop Layout

### Desktop View (lg: 1024px+)

```
┌──────────────────────────────────────────────────────────────┐
│                         CHECKOUT                             │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────┐  ┌──────────────────────┐ │
│  │   Checkout Form (2/3 width)  │  │ Order Summary (1/3)  │ │
│  │                              │  │ ┌──────────────────┐ │ │
│  │ Customer Information         │  │ │ Item 1  $100 ✕   │ │ │
│  │ ┌──────────────────────────┐ │  │ │ Item 2   $50 ✕   │ │ │
│  │ │ Full Name                │ │  │ │ Item 3   $75 ✕   │ │ │
│  │ │ [__________________]     │ │  │ │─────────────────│ │ │
│  │ │                          │ │  │ │ Subtotal:  $225 │ │ │
│  │ │ Account/Contact          │ │  │ │ Tax (18%):  $40 │ │ │
│  │ │ [__________________]     │ │  │ │ Total:     $265 │ │ │
│  │ │ (MTN, Bank #, etc)      │ │  │ │                  │ │ │
│  │ │                          │ │  │ │[Place Order]    │ │ │
│  │ │ Delivery Address         │ │  │ └──────────────────┘ │ │
│  │ │ [__________________]     │ │  │                      │ │
│  │ │                          │ │  │                      │ │
│  │ │ Payment Proof            │ │  │                      │ │
│  │ │ ┌──────────────────────┐ │  │                      │ │
│  │ │ │  📤 Click to upload  │ │  │                      │ │
│  │ │ │   payment proof      │ │  │                      │ │
│  │ │ └──────────────────────┘ │  │                      │ │
│  │ │                          │ │  │                      │ │
│  │ │  [Cancel]  [Place Order] │ │  │                      │ │
│  │ └──────────────────────────┘ │  │                      │ │
│  └──────────────────────────────┘  └──────────────────────┘ │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Mobile View (sm: 640px)

```
┌────────────────────────────────┐
│         CHECKOUT               │
├────────────────────────────────┤
│                                │
│  Full Name                     │
│  [________________]            │
│                                │
│  Account/Contact               │
│  [________________]            │
│  MTN, bank #, email, etc.     │
│                                │
│  Delivery Address              │
│  [________________]            │
│                                │
│  Payment Proof                 │
│  ┌──────────────────────────┐  │
│  │   📤 Click to upload     │  │
│  │   payment proof          │  │
│  │ JPG, PNG, GIF, PDF       │  │
│  │ Max 5MB                  │  │
│  └──────────────────────────┘  │
│                                │
│  ORDER SUMMARY                 │
│  ──────────────────────────    │
│  Item 1             $100  ✕    │
│  Item 2              $50  ✕    │
│  Item 3              $75  ✕    │
│  ──────────────────────────    │
│  Subtotal           $225       │
│  Tax (18%)           $40       │
│  Total              $265       │
│                                │
│  [Cancel]  [Place Order]       │
│                                │
└────────────────────────────────┘
```

---

## 🎬 State Transitions

### Form States

```
┌─────────────────────────────┐
│  INITIAL STATE              │
├─────────────────────────────┤
│ fullName: ""                │
│ accountContact: ""          │
│ address: ""                 │
│ paymentProof: null          │
│ loading: false              │
│ [Submit Button: Enabled]    │
└─────────────────────────────┘
           ↓
┌─────────────────────────────┐
│  USER FILLING FORM          │
├─────────────────────────────┤
│ fullName: "John Doe"        │
│ accountContact: "0788..."   │
│ address: "123 Main St"      │
│ paymentProof: null          │
│ loading: false              │
│ [Submit Button: Enabled*]   │
│ (*still missing proof)      │
└─────────────────────────────┘
           ↓
┌─────────────────────────────┐
│  PROOF UPLOADED             │
├─────────────────────────────┤
│ fullName: "John Doe"        │
│ accountContact: "0788..."   │
│ address: "123 Main St"      │
│ paymentProof: File { ... }  │
│ paymentProofPreview: URL    │
│ loading: false              │
│ [Submit Button: Enabled ✓]  │
└─────────────────────────────┘
           ↓
┌─────────────────────────────┐
│  SUBMITTING                 │
├─────────────────────────────┤
│ loading: true               │
│ [Submit Button: Disabled]   │
│ [Processing...]             │
│ - Validate fields           │
│ - Upload file               │
│ - Create order              │
│ - Clear cart                │
└─────────────────────────────┘
           ↓
┌─────────────────────────────┐
│  SUCCESS                    │
├─────────────────────────────┤
│ ✅ Order created!           │
│ [Redirect to confirmation]  │
│ Show order number & items   │
└─────────────────────────────┘
```

---

## 🔄 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    FORM SUBMISSION                          │
└─────────────────────────────────────────────────────────────┘

User Clicks "Place Order"
           ↓
validateForm() runs
├─ fullName not empty? ✓
├─ accountContact not empty? ✓
├─ address not empty? ✓
├─ paymentProof exists? ✓
└─ checkoutItems count > 0? ✓
           ↓
All validations pass
           ↓
createOrderItems array
├─ productId, productName, quantity, unitPrice
└─ Repeat for each item in cart
           ↓
Upload File to Supabase
           │
           ├─ supabase.storage.from("payment_proofs")
           ├─ .upload(fileName, file)
           │  ├─ File: <File object>
           │  ├─ Stored with: timestamp-name-filename
           │  └─ Encrypted at rest
           │
           └─ Get public URL
              └─ paymentProofUrl: "https://..."
           ↓
Create Order Record
           │
           ├─ INSERT into orders table
           ├─ client_name: fullName
           ├─ client_email: accountContact
           ├─ client_phone: accountContact
           ├─ client_address: address
           ├─ total_amount: total
           ├─ payment_status: "pending"
           ├─ order_status: "pending"
           ├─ notes: "Account/Contact: ...\nPayment Proof: ..."
           │
           └─ Returns: orderData with id
           ↓
Create Order Items
           │
           ├─ INSERT into order_items table (multiple rows)
           ├─ order_id: orderData.id
           ├─ product_id, product_name, quantity, unit_price
           │
           └─ Success
           ↓
Clear Shopping Cart
           │
           ├─ DELETE from cart_items
           ├─ WHERE user_id = current user
           │
           └─ Cart emptied
           ↓
Show Success Toast
├─ "Order created successfully!"
├─ "Our team will verify your payment"
└─ and contact you soon.
           ↓
Redirect to Confirmation
├─ Navigate to /order-confirmation/:orderId
├─ Show order details
├─ Show items ordered
├─ Show total amount
└─ Show next steps message
```

---

## 💾 Database Operations

### Orders Table Insert

```sql
INSERT INTO orders (
  user_id,
  client_name,
  client_email,           -- stores account/contact
  client_phone,           -- stores account/contact (backup)
  client_address,
  total_amount,
  payment_status,
  order_status,
  notes,
  created_at
) VALUES (
  'user-uuid',
  'John Doe',
  '0788555888',           -- Mobile money number
  '0788555888',
  '123 Main St, Kigali',
  45000,
  'pending',              -- Waiting for verification
  'pending',              -- Not yet processing
  'Account/Contact: 0788555888
   Payment Proof: https://supabase.../1234567-john-doe-screenshot.jpg',
  NOW()
);
```

### Order Items Insert (Multiple Rows)

```sql
INSERT INTO order_items (
  order_id,
  product_id,
  product_name,
  quantity,
  unit_price
) VALUES 
  ('order-uuid-1', 'prod-1', 'Tiles', 5, 5000),
  ('order-uuid-1', 'prod-2', 'Paint', 2, 10000),
  ('order-uuid-1', 'prod-3', 'Fixture', 1, 15000);
```

---

## 🎯 File Upload Validation

```
User Selects File
       ↓
Browser reads file
       ├─ File name
       ├─ File size
       ├─ File type (MIME)
       └─ File content
       ↓
Frontend Validation
       ├─ Size ≤ 5MB?
       │  └─ If NO → toast.error("File too large")
       │
       ├─ Type allowed?
       │  Allowed: image/jpeg, image/png, image/gif, application/pdf
       │  └─ If NO → toast.error("File type not allowed")
       │
       └─ All checks pass?
          └─ YES → Create preview & store in state
       ↓
Create File Preview
       ├─ If image: Display thumbnail
       ├─ If PDF: Show filename with checkmark
       └─ Store in paymentProofPreview state
       ↓
Display Preview to User
       └─ Show "Remove & Upload Different" option
       ↓
User Can:
├─ Proceed to submit (proof valid)
├─ Remove file (startOver)
└─ Upload different file (select new)
```

---

## 📊 Component Structure

```
Checkout Page
│
├─ Layout Wrapper
│  ├─ Header
│  ├─ Main Content
│  │  └─ Container
│  │     ├─ Back Link
│  │     ├─ Title
│  │     │
│  │     └─ Grid (lg:grid-cols-3)
│  │        │
│  │        ├─ Order Summary Card (sticky)
│  │        │  ├─ Heading
│  │        │  ├─ Items List
│  │        │  │  └─ Item Component (removable)
│  │        │  ├─ Pricing
│  │        │  │  ├─ Subtotal
│  │        │  │  ├─ Tax
│  │        │  │  └─ Total
│  │        │  └─ Place Order Button
│  │        │
│  │        └─ Checkout Form Card
│  │           ├─ Form Element
│  │           │
│  │           ├─ Customer Info Section
│  │           │  ├─ Full Name Input
│  │           │  ├─ Account/Contact Input
│  │           │  └─ Delivery Address Input
│  │           │
│  │           ├─ Payment Proof Section
│  │           │  ├─ Info Box
│  │           │  ├─ Upload Area
│  │           │  │  ├─ File Input (hidden)
│  │           │  │  └─ Label (upload UI)
│  │           │  │
│  │           │  └─ Preview Area
│  │           │     ├─ Image Preview (if image)
│  │           │     └─ Filename (if PDF)
│  │           │
│  │           └─ Form Actions
│  │              ├─ Cancel Button
│  │              └─ Place Order Button
│  │
│  └─ Footer
│
└─ Toaster (notifications)
```

---

## 🎨 Styling Classes Used

### Tailwind CSS Classes

```
Layout:
├─ grid, lg:grid-cols-3 - 3-column layout on large screens
├─ gap-8 - Space between columns
├─ order-1, order-2, lg:order-1, lg:order-2 - Reorder mobile/desktop
├─ sticky top-20 - Sticky sidebar on desktop
└─ container - Max width container

Cards:
├─ Card - shadcn/ui card component
├─ p-6, p-8 - Padding
├─ rounded-lg - Rounded corners
└─ border - Border styling

Forms:
├─ space-y-4, space-y-6 - Vertical spacing
├─ Label - shadcn/ui label
├─ Input - shadcn/ui input
├─ border-2 border-dashed - Dashed upload area
└─ rounded-lg - Rounded corners

Buttons:
├─ Button - shadcn/ui button
├─ w-full - Full width
├─ disabled:opacity-50 - Disabled state
└─ transition-colors - Smooth transitions

Text:
├─ text-xl, text-lg, text-sm, text-xs - Font sizes
├─ font-bold, font-medium - Font weights
├─ text-primary, text-muted-foreground - Colors
└─ mb-4, mb-6, mt-1 - Margins

Info Box:
├─ bg-blue-50 - Light blue background
├─ border border-blue-200 - Blue border
├─ text-blue-900, text-blue-800 - Blue text
└─ flex items-start gap-3 - Flexbox layout
```

---

## 🔔 Toast Notifications

```
Error Notifications (Red):
├─ "Full name is required"
├─ "Account/Contact information is required"
├─ "Address is required"
├─ "Payment proof is required"
├─ "File size must be less than 5MB"
├─ "Only JPG, PNG, GIF, or PDF files are allowed"
└─ "Failed to create order. Please try again."

Success Notifications (Green):
├─ "Order created successfully!"
└─ "Our team will verify your payment and contact you soon."

Info Notifications (Blue):
└─ "Item removed from checkout"
```

---

## 📦 Dependencies Used

```
Components:
├─ Button (shadcn/ui)
├─ Input (shadcn/ui)
├─ Label (shadcn/ui)
├─ Card (shadcn/ui)
└─ AlertCircle (lucide-react icon)

Hooks:
├─ useAuth - Get user data
├─ useCart - Get cart items
├─ useNavigate - Navigate after order
└─ useState - Form state management

Icons:
├─ Upload - File upload icon
├─ CheckCircle2 - Success checkmark
├─ AlertCircle - Info indicator
├─ Loader2 - Loading spinner
├─ Trash2 - Delete button
└─ ArrowLeft - Back link

Services:
├─ supabase.storage - File uploads
└─ supabase.from("orders") - Order creation

Utilities:
├─ formatPrice - Currency formatting
└─ toast - Notifications (sonner)
```

---

**Design Complete**: December 30, 2025  
**Status**: ✅ Production Ready
