# 🗺️ BuildMart: Complete Sitemap & Navigation

**Visual guide to every page, component, and feature in the system**

---

## 📍 Application Sitemap

```
┌────────────────────────────────────────────────────────────────┐
│                    BUILDMART SITEMAP                          │
└────────────────────────────────────────────────────────────────┘

ROOT: https://buildmart.rw
│
├─ / (HOME PAGE)
│  └─ Features:
│     ├─ Hero section with CTA
│     ├─ Featured products carousel
│     ├─ Category showcase
│     ├─ Benefits section
│     └─ Footer
│
├─ /products (PRODUCT LISTING)
│  └─ Features:
│     ├─ Search bar
│     ├─ Category filter
│     ├─ Sort options (price, newest, popular)
│     ├─ Grid/list view toggle
│     ├─ Product cards (image, name, price, discount)
│     ├─ Add to cart button
│     └─ Pagination
│
├─ /products/:slug (PRODUCT DETAIL)
│  └─ Features:
│     ├─ Product image gallery
│     ├─ Product name & description
│     ├─ Technical specifications
│     ├─ Price with discount display
│     ├─ Stock availability
│     ├─ Quantity selector
│     ├─ Add to cart button
│     ├─ Related products
│     └─ Tabs (specs, reviews, shipping)
│
├─ /cart (SHOPPING CART)
│  └─ Features:
│     ├─ Cart items list
│     ├─ Product image & name
│     ├─ Quantity +/- buttons
│     ├─ Remove item button
│     ├─ Item subtotal (with discount)
│     ├─ Cart total calculation
│     ├─ Discount amount
│     ├─ Proceed to checkout button
│     └─ Continue shopping link
│
├─ /checkout (CHECKOUT FORM)
│  └─ Features:
│     ├─ Order summary
│     ├─ Items list with prices
│     ├─ Form fields:
│     │  ├─ Full name (required)
│     │  ├─ Account/contact info (required)
│     │  ├─ Delivery address (required)
│     │  └─ Payment proof upload (required)
│     ├─ Payment proof uploader
│     ├─ Image preview
│     ├─ File validation
│     ├─ Total price display
│     ├─ Submit order button
│     └─ Login prompt if not authenticated
│
├─ /order-confirmation/:orderId (SUCCESS PAGE)
│  └─ Features:
│     ├─ Order number display
│     ├─ Order date
│     ├─ Items ordered list
│     ├─ Total amount paid
│     ├─ Order status
│     ├─ Next steps message
│     ├─ Customer support contact
│     └─ Continue shopping button
│
├─ /auth (CUSTOMER LOGIN/SIGNUP)
│  ├─ /auth?tab=login (DEFAULT)
│  │  └─ Login Form:
│  │     ├─ Email input
│  │     ├─ Password input
│  │     ├─ Remember me checkbox
│  │     ├─ Forgot password link
│  │     ├─ Login button
│  │     └─ Sign up link
│  │
│  └─ /auth?tab=signup
│     └─ Signup Form:
│        ├─ Full name input
│        ├─ Email input
│        ├─ Password input
│        ├─ Confirm password input
│        ├─ Terms checkbox
│        ├─ Sign up button
│        └─ Login link
│
├─ /authadmin (ADMIN LOGIN PAGE)
│  └─ Features:
│     ├─ Admin login form
│     ├─ Email input
│     ├─ Password input
│     ├─ Login button
│     ├─ Message: "Admin Only"
│     └─ Back to home link
│
├─ /admin (ADMIN DASHBOARD)
│  └─ Features:
│     ├─ Metrics cards:
│     │  ├─ Total products
│     │  ├─ Total orders
│     │  ├─ Total users
│     │  └─ Total revenue
│     ├─ Charts:
│     │  ├─ Orders vs revenue line chart
│     │  └─ Order distribution pie chart
│     ├─ Recent orders table:
│     │  ├─ Order ID
│     │  ├─ Customer name
│     │  ├─ Date
│     │  ├─ Status
│     │  └─ Amount
│     └─ Quick action buttons
│
├─ /admin/products (PRODUCT MANAGEMENT)
│  └─ Features:
│     ├─ Products table
│     ├─ Search bar
│     ├─ Filters
│     ├─ Add product button → Dialog
│     │  └─ Form:
│     │     ├─ Name
│     │     ├─ Category dropdown
│     │     ├─ Price
│     │     ├─ Discount %
│     │     ├─ Stock
│     │     ├─ Images upload (multiple)
│     │     ├─ Description textarea
│     │     ├─ Technical specs JSON
│     │     ├─ Featured toggle
│     │     └─ Create button
│     ├─ Edit button (per product) → Dialog with pre-filled form
│     ├─ Delete button (per product) → Confirmation
│     └─ Bulk actions (planned)
│
├─ /admin/categories (CATEGORY MANAGEMENT)
│  └─ Features:
│     ├─ Categories grid
│     ├─ Add category button → Dialog
│     │  └─ Form:
│     │     ├─ Name
│     │     ├─ Slug (auto-generated)
│     │     ├─ Icon dropdown
│     │     ├─ Color picker
│     │     └─ Create button
│     ├─ Edit button (per category) → Dialog
│     ├─ Delete button (per category) → Confirmation
│     └─ Search functionality
│
├─ /admin/orders (ORDER MANAGEMENT)
│  └─ Features:
│     ├─ Orders list/table
│     ├─ Search by customer name
│     ├─ Filter by:
│     │  ├─ Order status
│     │  ├─ Payment status
│     │  └─ Date range
│     ├─ Click order → Details modal
│     │  ├─ Order header (ID, date, customer)
│     │  ├─ Customer info (name, email, address)
│     │  ├─ Items ordered (table)
│     │  ├─ Payment proof viewer
│     │  │  └─ Image popup on click
│     │  ├─ Payment status dropdown
│     │  │  └─ pending | verified | rejected
│     │  ├─ Order status dropdown
│     │  │  └─ pending | processing | shipped | delivered
│     │  ├─ Notes textarea
│     │  ├─ Total amount display
│     │  └─ Save button
│     ├─ Export CSV button
│     └─ Print button
│
├─ /admin/users (USER MANAGEMENT)
│  └─ Features:
│     ├─ Users list/table
│     ├─ Search by email or name
│     ├─ Columns:
│     │  ├─ Email
│     │  ├─ Full name
│     │  ├─ Phone
│     │  ├─ Created date
│     │  ├─ Is Admin toggle
│     │  └─ Actions
│     ├─ View user details
│     ├─ View user orders
│     ├─ Toggle admin role button
│     ├─ Delete user button → Confirmation
│     └─ Export CSV button
│
├─ /admin/analytics (ADVANCED ANALYTICS)
│  └─ Features:
│     ├─ Revenue chart (line)
│     │  └─ Time period filter
│     ├─ Top products (bar chart)
│     ├─ Category performance (pie)
│     ├─ Customer acquisition (line)
│     ├─ Conversion metrics
│     ├─ Average order value
│     ├─ Peak hours analysis
│     ├─ Product search trends
│     ├─ Download report buttons
│     └─ Date range picker
│
└─ /notfound (404 PAGE)
   └─ Features:
      ├─ 404 message
      ├─ Back home link
      └─ Search bar
```

---

## 🏗️ Component Hierarchy

```
┌─ App.tsx (Main entry point)
│
├─ Provider Components
│  ├─ QueryClientProvider (TanStack Query)
│  ├─ TooltipProvider (UI)
│  ├─ AuthProvider (Authentication context)
│  └─ CartProvider (Shopping cart context)
│
├─ Layout Components
│  ├─ Layout (Wraps customer pages)
│  │  ├─ Header.tsx
│  │  │  ├─ Logo/Brand
│  │  │  ├─ Search bar
│  │  │  ├─ Nav links
│  │  │  ├─ Cart icon
│  │  │  └─ Account menu
│  │  │
│  │  ├─ Page content (routes)
│  │  │  ├─ Index.tsx
│  │  │  ├─ Products.tsx
│  │  │  ├─ ProductDetail.tsx
│  │  │  ├─ Cart.tsx
│  │  │  ├─ Checkout.tsx
│  │  │  ├─ OrderConfirmation.tsx
│  │  │  ├─ Auth.tsx
│  │  │  └─ NotFound.tsx
│  │  │
│  │  └─ Footer.tsx
│  │     ├─ Links
│  │     ├─ Contact info
│  │     └─ Social media
│  │
│  └─ AdminLayout (Wraps admin pages)
│     ├─ Sidebar
│     │  ├─ Logo
│     │  ├─ Nav links
│     │  ├─ Collapse toggle
│     │  └─ Logout button
│     │
│     └─ Main content area
│        ├─ Header with user menu
│        └─ Page content
│           ├─ Dashboard.tsx
│           ├─ Products.tsx
│           ├─ Categories.tsx
│           ├─ Orders.tsx
│           ├─ Users.tsx
│           └─ Analytics.tsx
│
├─ Shared Components
│  ├─ NavLink.tsx (Navigation links)
│  ├─ ProductCard.tsx (Product display)
│  └─ 40+ shadcn/ui components
│     ├─ Button
│     ├─ Card
│     ├─ Dialog
│     ├─ Input
│     ├─ Label
│     ├─ Table
│     ├─ Select
│     ├─ Tabs
│     ├─ Alert
│     ├─ Badge
│     ├─ Toast
│     ├─ Tooltip
│     ├─ Accordion
│     ├─ Avatar
│     ├─ Breadcrumb
│     └─ ... (35+ more)
│
└─ Protection Components
   └─ ProtectedAdminRoute
      └─ Checks: isLoading, user exists, isAdmin
```

---

## 🔄 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     DATA FLOW                               │
└─────────────────────────────────────────────────────────────┘

USER INTERACTION
│
├─ Click "Add to Cart"
│  ↓
│  ProductCard Component
│  ├─ Validate stock available
│  ├─ Call addToCart(productId, quantity)
│  │
│  ↓
│  useCart Hook
│  ├─ Check if user logged in
│  ├─ Prepare cart item data
│  ├─ Call Supabase query
│  │
│  ↓
│  SUPABASE
│  ├─ Receive INSERT request
│  ├─ Check RLS policy
│  │  └─ "Users can manage their own cart"
│  ├─ Verify user_id matches
│  ├─ INSERT into cart_items table
│  │
│  ↓
│  Database
│  ├─ Check constraints
│  ├─ Verify product exists
│  ├─ Check UNIQUE(user_id, product_id)
│  ├─ Insert row
│  │
│  ↓
│  Response returned
│  │
│  ↓
│  useCart Hook
│  ├─ Update local state
│  ├─ Increment cartCount
│  │
│  ↓
│  Component
│  ├─ Toast notification: "Added to cart"
│  ├─ Update UI
│  └─ Show success feedback

CHECKOUT FLOW
│
├─ User fills checkout form
│  ├─ Full name
│  ├─ Account contact
│  ├─ Delivery address
│  └─ Uploads payment proof image
│
├─ Validate inputs
│  ├─ Check required fields
│  ├─ Validate file size < 5MB
│  ├─ Validate file type (JPG, PNG, PDF)
│  └─ Show preview
│
├─ Submit order
│  │
│  ├─ Upload image to Supabase Storage
│  │  ├─ storage/payment_proofs bucket
│  │  ├─ File naming: orderId-timestamp.ext
│  │  ├─ Get public URL
│  │
│  ├─ Create order record
│  │  ├─ INSERT into orders table
│  │  ├─ Include payment_proof URL
│  │  ├─ Set payment_status = 'pending'
│  │  ├─ Set order_status = 'pending'
│  │
│  ├─ Create order items
│  │  ├─ For each product in cart
│  │  ├─ INSERT into order_items table
│  │  ├─ Include quantity & price
│  │
│  ├─ Clear cart
│  │  └─ DELETE all cart_items for user
│  │
│  └─ Redirect to confirmation page

ADMIN VERIFICATION
│
├─ Admin logs in
│  ├─ Email + password
│  ├─ Supabase Auth checks credentials
│  ├─ Query user_roles table
│  ├─ Verify user has role = 'admin'
│  └─ Grant access to /admin routes
│
├─ Admin reviews order
│  ├─ Click order in list
│  ├─ Modal opens with details
│  ├─ Display payment proof image
│  ├─ Admin checks bank statement
│  ├─ Verifies money received
│
├─ Admin verifies payment
│  ├─ Click "Verify" button
│  ├─ UPDATE orders table
│  │  ├─ Set payment_status = 'verified'
│  │  ├─ Set order_status = 'processing'
│  │
│  └─ Order ready for fulfillment
```

---

## 📁 File Organization Reference

```
src/
├─ pages/
│  ├─ Index.tsx              ← Home page
│  ├─ Products.tsx           ← Product listing
│  ├─ ProductDetail.tsx      ← Single product
│  ├─ Cart.tsx               ← Shopping cart
│  ├─ Checkout.tsx           ← Checkout form
│  ├─ OrderConfirmation.tsx  ← Order success
│  ├─ Auth.tsx               ← Customer login/signup
│  ├─ AdminAuth.tsx          ← Admin login
│  ├─ NotFound.tsx           ← 404 page
│  │
│  └─ admin/
│     ├─ Dashboard.tsx       ← Analytics dashboard
│     ├─ Products.tsx        ← Product CRUD
│     ├─ Categories.tsx      ← Category CRUD
│     ├─ Orders.tsx          ← Order management
│     ├─ Users.tsx           ← User management
│     └─ Analytics.tsx       ← Advanced analytics
│
├─ components/
│  ├─ NavLink.tsx            ← Nav links
│  │
│  ├─ layout/
│  │  ├─ Layout.tsx          ← Customer layout
│  │  ├─ Header.tsx          ← Navigation
│  │  └─ Footer.tsx          ← Footer
│  │
│  ├─ admin/
│  │  ├─ AdminLayout.tsx     ← Admin layout
│  │  └─ ProtectedAdminRoute.tsx ← Route guard
│  │
│  ├─ products/
│  │  └─ ProductCard.tsx     ← Product card
│  │
│  └─ ui/
│     ├─ button.tsx
│     ├─ card.tsx
│     ├─ dialog.tsx
│     ├─ input.tsx
│     ├─ label.tsx
│     ├─ table.tsx
│     ├─ select.tsx
│     ├─ tabs.tsx
│     ├─ alert.tsx
│     ├─ badge.tsx
│     ├─ accordion.tsx
│     ├─ avatar.tsx
│     ├─ breadcrumb.tsx
│     └─ ... (25+ more)
│
├─ hooks/
│  ├─ useAuth.tsx            ← Authentication
│  ├─ useCart.tsx            ← Shopping cart
│  ├─ useToast.ts            ← Notifications
│  └─ use-mobile.tsx         ← Mobile detection
│
├─ integrations/
│  └─ supabase/
│     └─ client.ts           ← Supabase client
│
├─ lib/
│  └─ utils.ts               ← Utility functions
│
├─ assets/
│  ├─ hero-bg.jpg
│  └─ ... (other images)
│
├─ App.tsx                   ← Main app with routes
├─ main.tsx                  ← React entry point
├─ index.css                 ← Global styles
└─ App.css                   ← App styles
```

---

## 🔑 Key Locations Quick Reference

### Pages
- **Home**: `src/pages/Index.tsx`
- **Products**: `src/pages/Products.tsx`
- **Product Detail**: `src/pages/ProductDetail.tsx`
- **Cart**: `src/pages/Cart.tsx`
- **Checkout**: `src/pages/Checkout.tsx`
- **Order Confirmation**: `src/pages/OrderConfirmation.tsx`
- **Customer Login**: `src/pages/Auth.tsx`
- **Admin Login**: `src/pages/AdminAuth.tsx`
- **Admin Dashboard**: `src/pages/admin/Dashboard.tsx`
- **Admin Products**: `src/pages/admin/Products.tsx`
- **Admin Orders**: `src/pages/admin/Orders.tsx`
- **Admin Users**: `src/pages/admin/Users.tsx`

### Components
- **Header**: `src/components/layout/Header.tsx`
- **Admin Sidebar**: `src/components/admin/AdminLayout.tsx`
- **Product Card**: `src/components/products/ProductCard.tsx`
- **Form Components**: `src/components/ui/input.tsx`, `select.tsx`, etc.
- **Route Protection**: `src/components/admin/ProtectedAdminRoute.tsx`

### State Management
- **Authentication**: `src/hooks/useAuth.tsx`
- **Shopping Cart**: `src/hooks/useCart.tsx`
- **Notifications**: `src/hooks/useToast.ts`

### Integration
- **Supabase Client**: `src/integrations/supabase/client.ts`

---

## 🗺️ URL Structure

```
Public Routes:
├─ /                         (Home)
├─ /products                 (Listing)
├─ /products/:slug           (Detail)
├─ /cart                      (Shopping cart)
├─ /checkout                  (Checkout form)
├─ /order-confirmation/:id    (Order success)
├─ /auth                      (Login/signup)
├─ /auth?tab=login           (Login)
├─ /auth?tab=signup          (Signup)
└─ /*                         (404)

Admin Routes (Protected):
├─ /authadmin                 (Admin login)
├─ /admin                     (Dashboard) [Protected]
├─ /admin/products            (Products) [Protected]
├─ /admin/categories          (Categories) [Protected]
├─ /admin/orders              (Orders) [Protected]
├─ /admin/users               (Users) [Protected]
└─ /admin/analytics           (Analytics) [Protected]
```

---

## 🎯 Navigation Map

```
Customer Journey:
└─ Home (/)
   ├─ Products (/products)
   │  └─ Product Detail (/products/:slug)
   │     └─ Add to Cart
   │        └─ Go to Cart (/cart)
   │           └─ Checkout (/checkout)
   │              └─ Order Confirmation (/order-confirmation/:id)
   │
   └─ Auth (/auth)
      ├─ Login
      └─ Signup

Admin Journey:
└─ Admin Login (/authadmin)
   └─ Admin Dashboard (/admin)
      ├─ Products (/admin/products)
      ├─ Categories (/admin/categories)
      ├─ Orders (/admin/orders)
      ├─ Users (/admin/users)
      └─ Analytics (/admin/analytics)
```

---

## 📊 Status of All Pages

| Page | Status | Features |
|------|--------|----------|
| Home (/) | ✅ Complete | Hero, categories, featured |
| Products (/products) | ✅ Complete | Search, filter, sort |
| Product Detail | ✅ Complete | Images, specs, add to cart |
| Cart (/cart) | ✅ Complete | Quantity mgmt, totals |
| Checkout (/checkout) | ✅ Complete | Form, payment proof upload |
| Order Confirmation | ✅ Complete | Order summary |
| Auth (/auth) | ✅ Complete | Login & signup |
| Admin Login (/authadmin) | ✅ Complete | Separate admin auth |
| Dashboard (/admin) | ✅ Complete | Stats, charts |
| Products (/admin/products) | ✅ Complete | CRUD |
| Categories (/admin/categories) | ✅ Complete | CRUD |
| Orders (/admin/orders) | ✅ Complete | Mgmt, verification |
| Users (/admin/users) | ✅ Complete | List, role assignment |
| Analytics (/admin/analytics) | ✅ Complete | Reports |

---

## 🚀 Application Flow Summary

```
START
│
├─ USER VISITS HOME (/)
│  ├─ Server renders React app
│  ├─ Check if user authenticated
│  ├─ Load featured products
│  └─ Display homepage
│
├─ USER BROWSES PRODUCTS
│  ├─ Go to /products
│  ├─ Load all products from database
│  ├─ Display in grid
│  ├─ Allow search/filter/sort
│  └─ Click product → /products/:slug
│
├─ USER ADDS TO CART
│  ├─ Click "Add to Cart"
│  ├─ Call useCart.addToCart()
│  ├─ Save to database (cart_items table)
│  ├─ Update cartCount
│  └─ Show toast notification
│
├─ USER PROCEEDS TO CHECKOUT
│  ├─ Go to /checkout
│  ├─ Review items & totals
│  ├─ Fill checkout form
│  ├─ Upload payment proof
│  ├─ Click "Submit"
│  ├─ Create order in database
│  ├─ Clear cart
│  └─ Redirect to /order-confirmation
│
├─ ADMIN VERIFIES PAYMENT
│  ├─ Login to /authadmin
│  ├─ Go to /admin/orders
│  ├─ Find pending order
│  ├─ View payment proof
│  ├─ Verify authenticity
│  ├─ Update payment_status
│  └─ Update order_status
│
├─ ADMIN FULFILLS ORDER
│  ├─ Mark order as SHIPPED
│  ├─ Mark order as DELIVERED
│  └─ Order complete
│
└─ END
```

---

**This sitemap provides a complete visual guide to every page, component, and feature in BuildMart!**

*For code examples of each page, see DEVELOPER_QUICK_REFERENCE.md*
