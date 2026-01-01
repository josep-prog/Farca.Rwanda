# Farca Rwanda - Complete Project Deep Walkthrough

**Last Updated:** December 31, 2025  
**Project Status:** Production Ready  
**Tech Stack:** React 18 + TypeScript + Vite + Supabase + PostgreSQL + Tailwind CSS

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Core Architecture](#core-architecture)
3. [Technology Stack](#technology-stack)
4. [Database Schema](#database-schema)
5. [User Flows](#user-flows)
6. [Customer Features](#customer-features)
7. [Admin Features](#admin-features)
8. [Authentication & Security](#authentication--security)
9. [File Structure & Components](#file-structure--components)
10. [State Management](#state-management)
11. [Key Integrations](#key-integrations)
12. [Deployment & Build](#deployment--build)

---

## Project Overview

### What Is Farca Rwanda?

**Farca Rwanda** is a full-featured **e-commerce platform** for selling interior construction materials in Rwanda, including:
- 🪟 Tiles (ceramic, porcelain, mosaic)
- 🚽 Sanitary ware (toilets, bidets, urinals)
- 🎨 Paints & coatings
- 🔧 Fixtures & accessories
- 💧 Sinks & basins

### Business Model

```
Cash Payment + Proof-Based Verification
│
├─ Customer places order
├─ Customer uploads payment proof (MTN, Airtel, Bank Transfer)
├─ Admin verifies payment
├─ Order marked as "payment_received"
└─ Order prepared for delivery
```

### Key Metrics

| Metric | Value |
|--------|-------|
| **Pages** | 15 total (9 admin + 6 customer) |
| **Components** | 40+ reusable UI components |
| **Database Tables** | 7 core tables |
| **RLS Policies** | 15+ security policies |
| **TypeScript** | 100% coverage |
| **Mobile Responsive** | Full support |

---

## Core Architecture

### Frontend Architecture (Client-Side)

```
src/
├── pages/                    # Route pages
│   ├── Index.tsx            # Homepage
│   ├── Products.tsx         # Product listing
│   ├── ProductDetail.tsx    # Single product
│   ├── Cart.tsx             # Shopping cart
│   ├── Checkout.tsx         # Checkout form
│   ├── OrderConfirmation.tsx # Order success
│   ├── MyOrders.tsx         # User orders
│   ├── Auth.tsx             # User login/signup
│   ├── AdminAuth.tsx        # Admin login
│   └── admin/               # Admin pages
│       ├── Dashboard.tsx    # Stats & analytics
│       ├── Products.tsx     # Product management
│       ├── Categories.tsx   # Category management
│       ├── Orders.tsx       # Order management
│       ├── Users.tsx        # User management
│       └── Analytics.tsx    # Advanced analytics
│
├── components/              # Reusable UI components
│   ├── ui/                 # shadcn/ui components (Button, Card, etc.)
│   ├── layout/             # Layout components
│   │   ├── Header.tsx      # Navigation header
│   │   ├── Footer.tsx      # Footer
│   │   └── Layout.tsx      # Main layout wrapper
│   ├── products/           # Product-specific components
│   │   ├── ProductCard.tsx # Product card
│   │   └── ProductGrid.tsx # Product grid
│   └── admin/              # Admin components
│       ├── AdminLayout.tsx # Admin wrapper
│       ├── ProtectedAdminRoute.tsx # Route protection
│       └── EBMDocumentUpload.tsx   # Document upload
│
├── hooks/                   # Custom React hooks
│   ├── useAuth.tsx         # Authentication context
│   ├── useCart.tsx         # Shopping cart context
│   ├── use-mobile.tsx      # Mobile detection
│   └── use-toast.ts        # Toast notifications
│
├── integrations/           # External service integration
│   └── supabase/
│       └── client.ts       # Supabase client setup
│
├── lib/                    # Utility functions
│   └── utils.ts            # Helpers (formatting, etc.)
│
├── assets/                 # Static files
│   └── hero-bg.jpg         # Homepage hero image
│
├── App.tsx                 # Main app component with routing
├── main.tsx                # Entry point
├── index.css               # Global styles
└── vite-env.d.ts           # Vite type definitions
```

### Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    REACT COMPONENTS                          │
│  (Pages, Components, UI Elements)                            │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ├─ useAuth()          → Auth Context
                 ├─ useCart()          → Cart Context
                 ├─ React Query        → API caching
                 └─ useState/useEffect  → Local state
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                  SUPABASE CLIENT                             │
│  (Manages API calls, authentication, file storage)           │
└────────────────┬────────────────────────────────────────────┘
                 │
        ┌────────┼────────┐
        │                 │
        ▼                 ▼
   JWT Auth Token    REST API Calls
        │                 │
        ▼                 ▼
┌─────────────────────────────────────────────────────────────┐
│                   SUPABASE BACKEND                           │
│  - PostgreSQL Database                                       │
│  - Row-Level Security (RLS) Policies                         │
│  - File Storage (payment proofs, documents)                  │
│  - Authentication Service                                    │
└─────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Frontend
- **React 18.3** - UI library with hooks
- **TypeScript** - Static typing
- **Vite 5** - Build tool (faster than Webpack)
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - 40+ pre-built accessible components
- **React Router 7** - Client-side routing
- **React Query (TanStack)** - API data caching
- **Recharts** - Charts and graphs
- **Sonner** - Toast notifications
- **Lucide React** - Icon library

### Backend
- **Supabase** - Firebase alternative with PostgreSQL
- **PostgreSQL** - Relational database
- **Supabase Auth** - JWT-based authentication
- **Row-Level Security** - Database-level security

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Bun** - Package manager (faster than npm)

---

## Database Schema

### 1. **users** (Managed by Supabase Auth)
```sql
-- Created automatically by Supabase
- id: UUID (primary key)
- email: TEXT (unique)
- encrypted_password: TEXT
- email_confirmed_at: TIMESTAMP
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```
**Purpose:** Core authentication table (don't modify directly)

### 2. **profiles**
```sql
- id: UUID (FK to auth.users) PRIMARY KEY
- email: TEXT
- full_name: TEXT (nullable)
- phone: TEXT (nullable)
- address: TEXT (nullable)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP

-- Indexes
CREATE INDEX idx_profiles_id ON profiles(id)
```
**Purpose:** User profile data (auto-created on signup via trigger)  
**Access:** Users read/edit own profile; admins view all

### 3. **user_roles**
```sql
- id: UUID PRIMARY KEY
- user_id: UUID (FK to auth.users) UNIQUE
- role: ENUM ('admin', 'user')
- created_at: TIMESTAMP

-- Indexes
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id)
```
**Purpose:** Track admin privileges  
**Access:** Admin-only; checked via RLS policies

### 4. **categories**
```sql
- id: UUID PRIMARY KEY
- name: TEXT (unique)
- slug: TEXT (unique)
- icon: TEXT (nullable) -- Lucide icon name
- color: TEXT (nullable) -- Tailwind color
- description: TEXT (nullable)
- created_at: TIMESTAMP

-- Indexes
CREATE INDEX idx_categories_slug ON categories(slug)
```
**Purpose:** Product categories (Tiles, Paints, etc.)  
**Access:** Public read; admin write

### 5. **products**
```sql
- id: UUID PRIMARY KEY
- category_id: UUID (FK to categories)
- name: TEXT
- slug: TEXT (unique)
- description: TEXT
- technical_specs: JSONB (nullable) -- e.g., {"dimensions": "30x30cm", "material": "ceramic"}
- general_info: TEXT (nullable)
- video_url: TEXT (nullable) -- YouTube or similar
- price: DECIMAL(12,2)
- discount_percent: INTEGER (0-100, default 0)
- stock: INTEGER
- images: TEXT[] (array of image URLs)
- is_featured: BOOLEAN (default false)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP

-- Indexes
CREATE INDEX idx_products_category_id ON products(category_id)
CREATE INDEX idx_products_slug ON products(slug)
CREATE INDEX idx_products_featured ON products(is_featured)
```
**Purpose:** Product catalog  
**Access:** Public read; admin write

### 6. **cart_items**
```sql
- id: UUID PRIMARY KEY
- user_id: UUID (FK to auth.users)
- product_id: UUID (FK to products)
- quantity: INTEGER (>= 1)
- created_at: TIMESTAMP

-- Unique constraint: one user can't have same product twice
UNIQUE(user_id, product_id)

-- Indexes
CREATE INDEX idx_cart_items_user_id ON cart_items(user_id)
CREATE INDEX idx_cart_items_product_id ON cart_items(product_id)
```
**Purpose:** Shopping cart persistence  
**Access:** Users see/edit own cart; admin read-all

### 7. **orders**
```sql
- id: UUID PRIMARY KEY
- user_id: UUID (FK to auth.users, nullable) -- Guest checkout
- client_name: TEXT
- client_email: TEXT
- client_phone: TEXT
- client_address: TEXT
- total_amount: DECIMAL(12,2)
- tax_amount: DECIMAL(12,2) (18% of subtotal)
- payment_status: ENUM ('pending', 'verified', 'rejected') DEFAULT 'pending'
- payment_proof: TEXT (file path in Supabase Storage)
- payment_proof_file_name: TEXT
- order_status: ENUM ('pending', 'payment_received', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending'
- ebm_document: TEXT (EBM file path, nullable)
- notes: TEXT (admin notes, nullable)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP

-- Indexes
CREATE INDEX idx_orders_user_id ON orders(user_id)
CREATE INDEX idx_orders_payment_status ON orders(payment_status)
CREATE INDEX idx_orders_order_status ON orders(order_status)
CREATE INDEX idx_orders_created_at ON orders(created_at)
```
**Purpose:** Customer orders  
**Access:** Users see own orders; admins see all

### 8. **order_items**
```sql
- id: UUID PRIMARY KEY
- order_id: UUID (FK to orders)
- product_id: UUID (FK to products, nullable) -- null if product deleted
- product_name: TEXT -- denormalized to preserve history
- quantity: INTEGER
- unit_price: DECIMAL(12,2)
- created_at: TIMESTAMP

-- Indexes
CREATE INDEX idx_order_items_order_id ON order_items(order_id)
CREATE INDEX idx_order_items_product_id ON order_items(product_id)
```
**Purpose:** Line items for orders  
**Access:** Same as orders

### Security Features

#### Row-Level Security (RLS) Policies

**Profiles Table:**
```sql
-- Users can only view/edit their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (has_role(auth.uid(), 'admin'));
```

**Cart Items Table:**
```sql
-- Users can only manage their own cart
CREATE POLICY "Users see own cart" ON cart_items
  FOR SELECT USING (user_id = auth.uid());

-- Admins can view all carts
CREATE POLICY "Admins see all carts" ON cart_items
  FOR SELECT USING (has_role(auth.uid(), 'admin'));
```

**Products Table:**
```sql
-- Everyone can view products
CREATE POLICY "Products public read" ON products
  FOR SELECT USING (true);

-- Only admins can insert/update/delete
CREATE POLICY "Admins manage products" ON products
  FOR ALL USING (has_role(auth.uid(), 'admin'));
```

**Orders Table:**
```sql
-- Users see own orders, admins see all
CREATE POLICY "Users see own orders" ON orders
  FOR SELECT USING (user_id = auth.uid() OR has_role(auth.uid(), 'admin'));
```

---

## User Flows

### 1. Customer Registration & Login Flow

```
Customer Opens App
  │
  ├─ Click "Sign Up"
  │   └─ Enter: email, password, full name
  │   └─ Supabase creates user & profile record
  │   └─ Stored in: users + profiles tables
  │   └─ Redirected to homepage
  │
  ├─ Click "Sign In"
  │   └─ Enter: email, password
  │   └─ Supabase validates credentials
  │   └─ JWT token stored in browser
  │   └─ useAuth() context updated
  │   └─ Cart loaded for user
  │
  └─ Not logged in?
      └─ Can browse products, but cart/checkout blocked
      └─ "Please sign in" message shown
```

### 2. Product Browsing Flow

```
Homepage (Index.tsx)
  ├─ Fetch featured products (4 max)
  ├─ Display categories with icons
  └─ Show featured products in grid
       │
       ├─ Click product card
       │   └─ Navigate to ProductDetail page
       │       └─ Fetch full product data
       │       └─ Display: images carousel, specs, price
       │       └─ Option: "Add to Cart" or "Buy Now"
       │
       └─ Search/Filter
           └─ Go to Products page
           └─ Filter by category or search by name
           └─ Results update in real-time
```

### 3. Shopping Cart Flow

```
Add to Cart
  │
  ├─ Not logged in?
  │   └─ Toast: "Please sign in to add items to cart"
  │   └─ Redirect to /auth
  │
  ├─ Already in cart?
  │   └─ Update quantity instead of duplicating
  │
  └─ New item?
      └─ Insert into cart_items table
      └─ Trigger toast: "Added to cart"
      └─ Cart count updates globally
         │
         └─ useCart() context refreshes
             └─ Fetches all cart_items for user
             └─ Calculates cartTotal = sum of (price * quantity - discount)
             └─ Updates cartCount (number of items)

View Cart (/cart)
  │
  ├─ Display: all items with quantity controls
  ├─ Show: price, discount, subtotal per item
  ├─ Calculate: total (all items)
  ├─ Options: Update quantity, Remove item, Clear cart
  │
  └─ Click "Proceed to Checkout"
      └─ Navigate to /checkout
      └─ With query param ?source=cart (optional)
```

### 4. Checkout & Order Creation Flow

```
Checkout Page (/checkout)
  │
  ├─ Load items:
  │   ├─ From cart_items table (if cart checkout)
  │   └─ OR single product (if direct checkout)
  │
  ├─ Pre-fill form if logged in:
  │   ├─ Fetch from profiles table
  │   └─ Auto-fill: full_name, address
  │
  ├─ Display: order summary
  │   ├─ Items with prices
  │   ├─ Subtotal
  │   ├─ Tax (18% of subtotal)
  │   └─ Total
  │
  ├─ Collect: client info
  │   ├─ Full Name (required)
  │   ├─ Email/Phone (required)
  │   └─ Address (required)
  │
  ├─ Upload: Payment Proof
  │   ├─ Accept: JPG, PNG, PDF
  │   ├─ Max size: 5MB
  │   ├─ Show preview before upload
  │   └─ Upload to Supabase Storage (/payment-proofs/{timestamp}.ext)
  │
  ├─ Validate: form data
  │   └─ All fields required
  │   └─ Email format validation
  │   └─ Payment proof required
  │
  └─ Submit Order
      │
      ├─ Create order record:
      │   ├─ Insert into orders table
      │   ├─ Set: user_id (if logged in), client_*, total_amount, tax_amount
      │   ├─ Set: payment_status = 'pending'
      │   ├─ Set: order_status = 'pending'
      │   └─ Store: payment_proof file path
      │
      ├─ Create order items:
      │   └─ For each item in cart/product
      │   └─ Insert into order_items table
      │   └─ Denormalize: product_name, unit_price
      │
      ├─ Clear cart
      │   └─ Delete all cart_items for user
      │
      ├─ Redirect to:
      │   └─ /order-confirmation/{orderId}
      │   └─ Display: "Order placed successfully!"
      │   └─ Show: order ID, total amount, status
      │
      └─ Toast: "Order created! Awaiting payment verification"
```

### 5. Order Status Flow (Admin Perspective)

```
Admin Dashboard
  │
  ├─ View pending orders
  │   ├─ payment_status = 'pending'
  │   └─ Click order to review
  │
  └─ Verify Payment
      │
      ├─ Review payment proof (image/PDF)
      │   ├─ Displayed in modal/preview
      │   └─ Verify amount matches order total
      │
      ├─ Action: Approve Payment
      │   ├─ Update order: payment_status = 'verified'
      │   ├─ Update order: order_status = 'payment_received'
      │   └─ Toast: "Payment verified"
      │
      ├─ OR Action: Reject Payment
      │   ├─ Update order: payment_status = 'rejected'
      │   ├─ Prompt for reason/notes
      │   └─ Customer can re-submit proof
      │
      ├─ Manage Order Status
      │   ├─ pending → payment_received → processing → shipped → delivered
      │   └─ Can add notes at each stage
      │
      └─ Upload EBM Document (optional)
          └─ For order/shipping records
          └─ Stored in ebm_document field
```

---

## Customer Features

### Homepage (Index.tsx)

**What it shows:**
- Hero section with background image
- "Shop by Category" grid (6 categories)
- Featured products (4 max)
- Product cards with: image, name, price, discount
- Trust badges (delivery, quality, etc.)

**Functionality:**
- Click category → filter products
- Click product → product detail page
- Links to "Explore Products" and "Contact Us"

### Product Listing (Products.tsx)

**Features:**
- Grid layout (responsive: 1-4 columns)
- Search by product name (real-time)
- Filter by category
- Sort: by price, newest, most popular
- Pagination (if many products)
- Product cards show: image, name, price, discount, rating

**Responsive:** Mobile, tablet, desktop

### Product Detail (ProductDetail.tsx)

**Displays:**
- Image carousel (multiple images)
- Product name, category, price
- Discount percentage (if available)
- Technical specifications (JSON rendered as key-value)
- General information / description
- Video URL (if available)
- Stock status (in stock / out of stock)
- Quantity selector
- Buttons: "Add to Cart" or "Buy Now"
- Related products (optional)

### Shopping Cart (Cart.tsx)

**Shows:**
- All cart items in table format
- For each item:
  - Product image, name
  - Unit price, quantity
  - Subtotal (price × quantity)
  - Discount applied
- Cart totals:
  - Subtotal
  - Tax (18%)
  - Final total
- Actions:
  - Change quantity (+/- buttons)
  - Remove item (trash icon)
  - Clear cart (button)
- Buttons: "Continue Shopping" or "Proceed to Checkout"

### Checkout (Checkout.tsx)

**Three-step flow:**

**Step 1: Order Summary**
- Items with quantities, prices
- Subtotal, tax (18%), total

**Step 2: Customer Information**
- Full name (pre-filled if logged in)
- Email address
- Phone number
- Delivery address
- Form validation on submit

**Step 3: Payment Proof**
- File upload input (image/PDF)
- File preview before submit
- Accepted formats: JPG, PNG, PDF
- Max 5MB
- Upload button: "Confirm Order"

**On Submit:**
- Validate all fields
- Upload payment proof to Supabase Storage
- Create order in database
- Create order_items for cart items
- Redirect to order confirmation page

### Order Confirmation (OrderConfirmation.tsx)

**Displays:**
- Success message ✓
- Order ID (large, copyable)
- Order date/time
- Order total
- Items ordered
- Next steps: "Admin will verify payment within 24 hours"
- Button: "Return to Home" or "View Order Status"

### My Orders (MyOrders.tsx)

**Shows:**
- All orders placed by logged-in user
- For each order:
  - Order ID
  - Order date
  - Status badge (pending, payment_received, shipped, delivered, etc.)
  - Items count
  - Total amount
- Click order → see details:
  - All items with prices
  - Current status
  - Payment status
  - Delivery address
  - Order notes (admin added)

---

## Admin Features

### Admin Authentication (AdminAuth.tsx)

**Separate login page** from customer auth:
- URL: `/authadmin`
- Email + Password
- Creates session in `auth.users` table
- Checks `user_roles` table for admin role
- If not admin → "Access Denied" error

### Admin Dashboard (AdminDashboard.tsx)

**Key Metrics:**
- Total products in catalog
- Total orders (all-time)
- Total users registered
- Total revenue (sum of all order amounts)

**Charts:**
- Line chart: Order trends over time (orders/revenue per day)
- Bar chart: Revenue by category (optional)
- Recent orders table: Last 10 orders with status

**Quick Links:**
- View Products Management
- View Orders Management
- View Users
- View Analytics

### Product Management (AdminProducts.tsx)

**Features:**

**List View:**
- Table of all products
- Columns: image, name, category, price, discount, stock, is_featured
- Search by name
- Filter by category
- Pagination

**Create/Edit Product:**
- Form fields:
  - Name (required, unique)
  - Category (dropdown)
  - Price (decimal)
  - Discount % (0-100)
  - Stock (integer)
  - Description (rich text, optional)
  - Technical specs (JSON editor, optional)
  - General info (textarea)
  - Video URL (optional)
  - Is featured? (checkbox)
  - Images (upload multiple, drag-drop)
- Validation: name unique, price > 0
- Actions: Save, Cancel, Delete

**Delete:**
- Confirmation dialog
- Remove from database
- Remove images from storage

### Category Management (AdminCategories.tsx)

**Features:**

**List View:**
- Table: name, slug, icon, color, action buttons

**Create/Edit Category:**
- Name (unique)
- Slug (auto-generated from name)
- Icon (Lucide icon selector)
- Color (Tailwind color picker)
- Description

**Delete:**
- Confirmation
- Can't delete if products exist in category (optional)

### Order Management (AdminOrders.tsx)

**Features:**

**Pending Orders List:**
- Filter by payment_status: pending, verified, rejected
- Filter by order_status: pending, payment_received, processing, shipped, delivered
- Search by order ID or customer name
- Columns: Order ID, customer, amount, payment status, order status, date

**Order Details View:**
- Customer info: name, email, phone, address
- Order items: product, quantity, price per item, total
- Order totals: subtotal, tax, total amount
- Statuses: payment_status, order_status
- Payment proof: image/PDF preview in modal
- Admin notes: textarea field

**Admin Actions:**

1. **Verify Payment:**
   - View payment proof
   - Button: "Approve" or "Reject"
   - On approve: payment_status → verified, order_status → payment_received
   - On reject: payment_status → rejected, prompt for reason

2. **Update Order Status:**
   - Dropdown: pending → payment_received → processing → shipped → delivered
   - Each status change timestamped
   - Can add notes

3. **Upload EBM Document:**
   - File upload
   - Stored in ebm_document field
   - For shipping/order records

4. **Edit Notes:**
   - Textarea for admin-only notes
   - Visible in customer's order detail

### User Management (AdminUsers.tsx)

**Features:**

**User List:**
- Table: profile picture, name, email, phone, role, created date
- Search by name/email
- Filter by role: admin, user

**User Details:**
- Profile info: name, email, phone, address
- Account created date
- Last login (if tracked)
- Orders count

**Admin Actions:**
- Change role: user ↔ admin (dropdown)
- View user's orders
- Delete user account (soft delete)

### Analytics (AdminAnalytics.tsx)

**Advanced Reporting:**
- Date range picker
- Charts:
  - Revenue over time (line chart)
  - Orders by category (pie chart)
  - Top products (bar chart)
  - Customer distribution (map, optional)
- Tables:
  - Top selling products
  - Best customers by revenue
  - Monthly sales summary

---

## Authentication & Security

### Authentication Flow

```
User Registration
  ├─ Email + Password → Supabase Auth
  ├─ Creates: auth.users record
  ├─ Trigger runs → creates profiles record
  ├─ Sets: role = 'user' in user_roles
  └─ JWT token issued

User Login
  ├─ Email + Password → Supabase Auth
  ├─ JWT token issued and stored in browser
  ├─ useAuth() hook:
  │   ├─ Retrieves session
  │   ├─ Sets user object
  │   ├─ Checks user_roles for admin status
  │   └─ Updates isAdmin state
  └─ App renders based on user state

Protected Routes
  ├─ Customer routes: /cart, /checkout, /orders (require login)
  ├─ Admin routes: /admin/* (require admin role)
  └─ ProtectedAdminRoute component checks:
      ├─ Is user logged in?
      ├─ Is user an admin?
      └─ If not: redirect to /authadmin
```

### Security Layers

**Layer 1: JWT Authentication**
- Supabase Auth issues JWT tokens
- Token stored in browser (secure, HTTP-only cookies)
- Token expires after 1 hour (default)
- Refresh token extends session

**Layer 2: Row-Level Security (RLS)**
- Database policies enforce access control
- Users can only:
  - View/edit own profile
  - View/edit own cart
  - View own orders
- Admins can:
  - View all profiles, carts, orders
  - Create/edit/delete products, categories
  - Manage user roles

**Layer 3: Client-Side Protection**
- ProtectedAdminRoute checks isAdmin before rendering
- Redirects unauthorized users
- useAuth() provides auth context everywhere

**Layer 4: File Upload Security**
- Payment proofs uploaded to Supabase Storage
- Path: `/payment-proofs/{timestamp-random}.{ext}`
- Access: admin-readable, user can view own
- Virus scanning optional (configure in Supabase)

### Password Security
- Minimum 6 characters (Supabase default)
- Hashed with bcrypt in Supabase
- Never transmitted in plain text

---

## File Structure & Components

### Key Pages Breakdown

**Index.tsx (Homepage)**
```
Hero Section
├─ Background image
├─ Title: "Premium Interior Materials"
├─ CTA buttons: "Explore" and "Contact"
└─ Hero gradient overlay

Categories Section
├─ Grid of 6 categories with icons
└─ Click → filter to Products page

Featured Products
├─ Grid of 4 featured products
└─ Product cards with images and prices
```

**Products.tsx (Product Listing)**
```
Header
├─ Breadcrumb: Home > Products
├─ Title: "All Products"
└─ Results count

Sidebar (Mobile: collapsible)
├─ Category filter (checkboxes)
├─ Price range slider
└─ Sort dropdown

Main Content
├─ Product grid (responsive)
├─ Search bar
├─ Pagination controls
└─ "No results" message if empty
```

**ProductDetail.tsx**
```
Breadcrumb
├─ Home > Products > Product Name
└─ Stock status badge

Content Grid
├─ Left: Product image carousel
│   └─ Thumbnails below
│
├─ Right: Product info
│   ├─ Name, category, rating
│   ├─ Price with discount
│   ├─ Stock status
│   ├─ Technical specs (if available)
│   ├─ General description
│   ├─ Video embed (if available)
│   ├─ Quantity selector (1-10)
│   └─ Buttons: "Add to Cart" | "Buy Now"
│
└─ Related Products (carousel, optional)
```

**Cart.tsx**
```
Header
├─ Breadcrumb
├─ Title: "Shopping Cart"
└─ Item count

Content
├─ Empty cart message (if empty)
│   └─ "Continue Shopping" button
│
├─ Cart items table:
│   ├─ Columns: Product | Price | Qty | Subtotal | Remove
│   ├─ Quantity +/- buttons
│   └─ Delete icon
│
└─ Cart summary (sticky, right side on desktop):
    ├─ Subtotal
    ├─ Tax (18%)
    ├─ Total
    ├─ "Clear Cart" button
    └─ "Checkout" button (CTA)
```

**Checkout.tsx (Multi-step)**
```
Step Indicator
├─ 1. Summary
├─ 2. Information
└─ 3. Payment

Step 1: Order Summary
├─ Items with prices
├─ Subtotal, tax, total
└─ Next button

Step 2: Customer Information
├─ Full Name (text input)
├─ Email (email input)
├─ Phone (tel input)
├─ Address (textarea)
└─ Form validation messages

Step 3: Payment Proof
├─ File upload zone (drag-drop)
├─ File preview (image or PDF)
├─ Upload progress bar
└─ "Confirm Order" button
```

**OrderConfirmation.tsx**
```
Success Card
├─ Large checkmark icon ✓
├─ "Order Placed Successfully!"
├─ Order ID (large, bold, copyable)
├─ Order date
├─ Order total
├─ Items summary
└─ Next steps message

Buttons
├─ "Return to Home"
└─ "View Order Status"
```

**MyOrders.tsx**
```
Header
├─ "Your Orders"
├─ Filter: All | Pending | Payment Received | Shipped | Delivered
└─ Search by order ID

Orders List
├─ Table or cards (responsive)
├─ For each order:
│   ├─ Order ID
│   ├─ Date
│   ├─ Status badge
│   ├─ Items count
│   ├─ Total amount
│   └─ "View Details" button

Order Details Modal
├─ Full order info
├─ Items breakdown
├─ Delivery address
├─ Current status
└─ Admin notes (if any)
```

### Admin Pages

**AdminDashboard.tsx**
```
Stats Cards
├─ Total Products
├─ Total Orders
├─ Total Users
└─ Total Revenue

Charts Section
├─ Line chart: Orders/Revenue over time
├─ Bar chart: Revenue by category
└─ Recent orders table

Quick Actions
├─ "Manage Products" button
├─ "View Orders" button
└─ "View Users" button
```

**AdminProducts.tsx**
```
Toolbar
├─ "Create New Product" button
├─ Search by name
└─ Filter by category

Products Table
├─ Columns: Image | Name | Category | Price | Discount | Stock | Featured | Actions
├─ Edit icon → edit modal/page
├─ Delete icon → confirmation
└─ Pagination

Product Form Modal
├─ Name (text)
├─ Category (select)
├─ Price (decimal)
├─ Discount % (number 0-100)
├─ Stock (number)
├─ Description (textarea)
├─ Technical specs (JSON editor)
├─ General info (textarea)
├─ Video URL (text)
├─ Is featured (checkbox)
├─ Images upload (drag-drop, multiple)
└─ Save | Cancel buttons
```

**AdminCategories.tsx**
```
Toolbar
├─ "Create Category" button
└─ Search

Categories Table
├─ Columns: Icon | Name | Slug | Color | Actions
├─ Edit | Delete buttons
└─ Pagination

Category Form
├─ Name (text)
├─ Icon selector (Lucide icons)
├─ Color picker (Tailwind colors)
└─ Description (textarea)
```

**AdminOrders.tsx**
```
Filters
├─ Payment status: All | Pending | Verified | Rejected
├─ Order status: All | Pending | Payment Received | Processing | Shipped | Delivered
└─ Date range picker

Orders Table
├─ Columns: ID | Customer | Amount | Payment Status | Order Status | Date | Actions
├─ Click order → details view
└─ Pagination

Order Details View
├─ Customer info card
├─ Items table
├─ Payment proof preview
├─ Statuses with action buttons:
│   ├─ Verify/Reject payment
│   ├─ Change order status
│   └─ Add notes
└─ EBM document upload
```

**AdminUsers.tsx**
```
Filter
├─ Search by name/email
└─ Filter by role

Users Table
├─ Columns: Avatar | Name | Email | Phone | Role | Orders | Actions
└─ Click user → details + role change

User Details
├─ Profile info
├─ Created date
├─ Orders list
└─ Delete account button
```

---

## State Management

### 1. Authentication Context (useAuth.tsx)

```typescript
interface AuthContextType {
  user: User | null;              // Current user from Supabase Auth
  session: Session | null;        // Current session
  isAdmin: boolean;               // Is user an admin?
  isLoading: boolean;             // Loading state
  signIn(email, password);        // Login
  signUp(email, password, name);  // Register
  signOut();                       // Logout
}
```

**How it works:**
- Tracks Supabase auth state changes
- Auto-fetches admin status from user_roles table
- Provides global auth context to all components
- JWT token auto-managed by Supabase client

### 2. Cart Context (useCart.tsx)

```typescript
interface CartContextType {
  items: CartItem[];              // Cart items with product details
  cartCount: number;              // Total number of items
  cartTotal: number;              // Total price (with discounts)
  isLoading: boolean;             // Loading state
  addToCart(productId, qty);      // Add item to cart
  updateQuantity(productId, qty); // Change quantity
  removeFromCart(productId);      // Remove item
  clearCart();                    // Clear entire cart
}
```

**How it works:**
- Fetches cart_items from database on user login
- Joins with products table to get prices
- Calculates totals client-side
- Updates database when user modifies cart
- Syncs across browser tabs (Supabase realtime optional)

### 3. React Query (TanStack Query)

**Used for:**
- Caching API responses (products, categories, orders)
- Automatic refetching
- Deduping requests
- Optimistic updates

**Example:**
```typescript
const { data: products } = useQuery({
  queryKey: ['products', categoryId],
  queryFn: () => fetchProducts(categoryId)
});
```

### 4. Component State (useState/useEffect)

**Used for:**
- Form inputs (name, email, address)
- UI state (modals, dropdowns, pagination)
- Loading indicators
- Error messages

---

## Key Integrations

### Supabase Integration

**File:** `src/integrations/supabase/client.ts`

```typescript
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);
```

**Environment Variables (in `.env`):**
```
VITE_SUPABASE_URL=https://shlhoyhgurpixxvzpvpy.supabase.co
VITE_SUPABASE_ANON_KEY=...
```

**Usage in Components:**
```typescript
// Fetch products
const { data } = await supabase
  .from('products')
  .select('*')
  .eq('category_id', categoryId);

// Upload file
const { data } = await supabase
  .storage
  .from('payment-proofs')
  .upload(`payment-proof-${timestamp}.jpg`, file);

// Real-time subscriptions (optional)
const subscription = supabase
  .from('orders')
  .on('*', payload => console.log('Order update:', payload))
  .subscribe();
```

### Vite Configuration

**File:** `vite.config.ts`

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});
```

**Key Settings:**
- Dev server on port 5173
- Output to `dist/` folder
- No sourcemaps in production

### Tailwind CSS + shadcn/ui

**Global Styles:** `src/index.css`
- Tailwind directives
- Custom colors (primary, secondary)
- Custom fonts (display font)

**Components:** `src/components/ui/`
- 40+ shadcn/ui components
- All accessible (ARIA compliant)
- Customizable via CSS variables

### TypeScript Configuration

**File:** `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "paths": {
      "@/*": ["./src/*"]  // @ alias for imports
    }
  }
}
```

**Alias Usage:**
```typescript
// Instead of:
import { Button } from '../../../components/ui/button';

// Use:
import { Button } from '@/components/ui/button';
```

---

## Deployment & Build

### Build Process

```bash
# Development
npm run dev

# Production build
npm run build
npm run preview

# Linting
npm run lint
```

### Vercel Deployment

**File:** `vercel.json`

```json
{
  "buildCommand": "vite build",
  "outputDirectory": "dist",
  "env": {
    "VITE_SUPABASE_URL": "@supabase_url",
    "VITE_SUPABASE_ANON_KEY": "@supabase_key"
  }
}
```

**Deployment Steps:**
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Vercel auto-builds on push

### Environment Setup

**Development (`.env.local`):**
```
VITE_SUPABASE_URL=https://shlhoyhgurpixxvzpvpy.supabase.co
VITE_SUPABASE_ANON_KEY=...
```

**Production (Vercel):**
- Set same variables in Vercel Project Settings
- Never commit `.env` files to Git

---

## Key Strengths

✅ **Full e-commerce functionality** - browsing, cart, checkout, orders  
✅ **Dual user roles** - customers and admins with separate dashboards  
✅ **Database security** - Row-Level Security policies on all tables  
✅ **Responsive design** - works on mobile, tablet, desktop  
✅ **Modern tech stack** - React 18, TypeScript, Vite (fast)  
✅ **Real data persistence** - not localStorage, actual PostgreSQL database  
✅ **File uploads** - payment proofs stored in Supabase Storage  
✅ **Analytics** - admin can track orders, revenue, trends  
✅ **100% TypeScript** - type-safe throughout  
✅ **Production ready** - deployed on Vercel  

---

## Areas for Future Enhancement

📌 **Email/SMS notifications** - order status updates  
📌 **Customer reviews** - product ratings and feedback  
📌 **Wishlist** - save products for later  
📌 **Bulk ordering** - B2B features  
📌 **PDF invoices** - downloadable order receipts  
📌 **Multiple payment methods** - integrate Stripe, PayPal  
📌 **Real-time chat** - customer support  
📌 **Advanced analytics** - customer lifetime value, cohort analysis  
📌 **Inventory alerts** - low stock notifications  
📌 **Multi-language** - Kinyarwanda, French support  

---

## Summary

**Farca Rwanda** is a **complete, production-ready e-commerce platform** with:
- Full customer shopping experience (browse, cart, checkout, orders)
- Comprehensive admin dashboard (products, categories, orders, users, analytics)
- Database security via RLS policies
- Modern, responsive UI with shadcn/ui components
- Real data persistence in PostgreSQL via Supabase
- Payment proof verification workflow
- Type-safe with 100% TypeScript

The architecture is **scalable and maintainable**, with clear separation between pages, components, hooks, and integrations. All data flows through the Supabase backend with appropriate security policies.

---

**Last Updated:** December 31, 2025  
**Status:** Production Ready ✅
