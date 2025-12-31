# 🏗️ FARCA.RWANDA (BuildMart) - Complete Deep Dive

**Last Updated**: December 30, 2025  
**Project Status**: ✅ **PRODUCTION READY**  
**Version**: 1.0.0

---

## 📖 Table of Contents

1. [Executive Summary](#executive-summary)
2. [Project Structure](#project-structure)
3. [Technology Stack](#technology-stack)
4. [Architecture Overview](#architecture-overview)
5. [Database Design](#database-design)
6. [User Authentication Flow](#user-authentication-flow)
7. [Customer-Facing Features](#customer-facing-features)
8. [Admin Dashboard Features](#admin-dashboard-features)
9. [Component Deep Dive](#component-deep-dive)
10. [State Management](#state-management)
11. [Key Integrations](#key-integrations)
12. [Deployment & Setup](#deployment--setup)

---

## Executive Summary

**BuildMart** (Farca.Rwanda) is a comprehensive **e-commerce platform** for interior construction materials in Rwanda. It provides:

### For Customers 👥
- Browse and search construction materials (tiles, sanitary ware, paints, fixtures, etc.)
- Add items to cart
- Checkout with simplified payment flow
- Upload payment proof (screenshot or receipt)
- Track orders

### For Administrators 👨‍💼
- Complete product management system
- Category organization
- Order fulfillment tracking
- User and role management
- Real-time analytics and reporting
- Revenue tracking

### Key Statistics
- **7 Database Tables** with complex relationships
- **2 Authentication Systems** (customer & admin)
- **6 Admin Pages** with full CRUD operations
- **40+ UI Components** from shadcn/ui
- **Real-time Data Sync** via Supabase
- **Payment Proof Storage** on Supabase Cloud Storage

---

## Project Structure

### Root Directory Layout
```
Farca.Rwanda/
├── src/                           # React source code
│   ├── App.tsx                    # Main router & providers
│   ├── main.tsx                   # Entry point
│   ├── index.css & App.css        # Global styles
│   │
│   ├── pages/                     # Route pages (customer & admin)
│   │   ├── Index.tsx              # Home page
│   │   ├── Products.tsx           # Product catalog
│   │   ├── ProductDetail.tsx      # Single product page
│   │   ├── Auth.tsx               # Customer login/signup
│   │   ├── Cart.tsx               # Shopping cart
│   │   ├── Checkout.tsx           # Order creation
│   │   ├── OrderConfirmation.tsx  # Order receipt
│   │   ├── NotFound.tsx           # 404 page
│   │   └── admin/                 # Admin pages
│   │       ├── Dashboard.tsx      # Analytics dashboard
│   │       ├── Products.tsx       # Product management
│   │       ├── Categories.tsx     # Category management
│   │       ├── Orders.tsx         # Order management
│   │       ├── Users.tsx          # User & role management
│   │       └── Analytics.tsx      # Advanced analytics
│   │
│   ├── components/                # Reusable React components
│   │   ├── admin/
│   │   │   ├── AdminLayout.tsx    # Admin sidebar + navigation
│   │   │   └── ProtectedAdminRoute.tsx  # Route guard
│   │   │
│   │   ├── layout/
│   │   │   ├── Layout.tsx         # Customer page wrapper
│   │   │   ├── Header.tsx         # Top navigation bar
│   │   │   └── Footer.tsx         # Footer
│   │   │
│   │   ├── products/
│   │   │   └── ProductCard.tsx    # Product display card
│   │   │
│   │   ├── ui/                    # shadcn/ui components (40+)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── form.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   └── ... (many more)
│   │   │
│   │   └── NavLink.tsx            # Navigation link component
│   │
│   ├── hooks/                     # Custom React hooks
│   │   ├── useAuth.tsx            # Auth context & login
│   │   ├── useCart.tsx            # Cart context & functions
│   │   ├── use-mobile.tsx         # Responsive design detection
│   │   └── use-toast.ts           # Notification system
│   │
│   ├── integrations/
│   │   └── supabase/
│   │       ├── client.ts          # Supabase initialization
│   │       └── types.ts           # Generated TypeScript types
│   │
│   └── lib/
│       └── utils.ts               # Utility functions (formatPrice, etc.)
│
├── supabase/                      # Backend configuration
│   ├── config.toml                # Supabase settings
│   └── migrations/
│       ├── 20251229182950_*.sql   # Database schema
│       └── 20251230_payment_proofs_bucket.sql
│
├── public/
│   └── robots.txt
│
├── Configuration Files
│   ├── package.json               # Dependencies
│   ├── vite.config.ts             # Build tool config
│   ├── tsconfig.json              # TypeScript config
│   ├── tailwind.config.ts         # Tailwind CSS config
│   ├── components.json            # shadcn/ui config
│   ├── postcss.config.js          # CSS processing
│   └── eslint.config.js           # Code quality
│
└── Documentation Files (14+)
    ├── README.md
    ├── PROJECT_DEEP_DIVE.md
    ├── ARCHITECTURE_DIAGRAMS.md
    ├── PAYMENT_SYSTEM_GUIDE.md
    ├── CHECKOUT_SYSTEM_GUIDE.md
    ├── ADMIN_DASHBOARD_GUIDE.md
    ├── DEPLOYMENT_CHECKLIST.md
    ├── And more...
```

---

## Technology Stack

### **Frontend Framework**
| Technology | Version | Purpose |
|---|---|---|
| React | 18.3.1 | UI framework |
| TypeScript | 5.7.3 | Type safety |
| Vite | 5.4.19 | Build tool (ultra-fast) |
| React Router DOM | 6.30.1 | Client-side routing |

### **UI & Styling**
| Technology | Purpose |
|---|---|
| Tailwind CSS 3.4.17 | Utility-first CSS |
| shadcn/ui | Pre-built component library (40+ components) |
| Lucide React 0.462.0 | SVG icon library (450+ icons) |
| Recharts 2.15.4 | Interactive charts for analytics |
| PostCSS | CSS processing |

### **State Management & Forms**
| Technology | Purpose |
|---|---|
| React Context API | Global state (Auth, Cart) |
| React Hook Form 7.61.1 | Efficient form handling |
| @hookform/resolvers 3.10.0 | Form validation integration |
| Zod 3.25.76 | Type-safe schema validation |
| TanStack React Query 5.83.0 | Server state & caching |

### **Backend & Database**
| Technology | Purpose |
|---|---|
| Supabase | PostgreSQL database + Auth |
| @supabase/supabase-js 2.89.0 | JavaScript SDK |
| PostgreSQL | Relational database |

### **Notifications & UX**
| Technology | Purpose |
|---|---|
| Sonner 1.7.4 | Toast notifications |
| @radix-ui/react-toast | Toast components |

### **Development Tools**
| Tool | Purpose |
|---|---|
| ESLint 9.32.0 | Code quality linting |
| TypeScript ESLint | TypeScript-specific linting |
| Lovable Tagger | AI-powered development |

---

## Architecture Overview

### Application Flow Diagram

```
┌──────────────────────────────────────────────────────────┐
│                      App.tsx (Root)                      │
│  ├─ QueryClientProvider (React Query)                   │
│  ├─ TooltipProvider (Radix UI)                          │
│  ├─ AuthProvider (Auth Context)                         │
│  ├─ CartProvider (Cart Context)                         │
│  └─ BrowserRouter (React Router)                        │
└──────────────────────┬───────────────────────────────────┘
                       │
         ┌─────────────┴──────────────┐
         │                            │
    CUSTOMER ROUTES            ADMIN ROUTES
    (Public)                   (Protected)
         │                            │
    ┌────┼────────────┐          ┌────┴─────────────┐
    │    │            │          │                  │
   /  /products /auth  /cart  /authadmin   /admin/*
    │    │            │          │                  │
   Index Products Auth Cart   AdminAuth    Protected
   Page  List    Login       Route Guard
        │ │
        └─Detail
```

### Page & Component Hierarchy

```
App.tsx (Routes defined)
│
├── CUSTOMER ROUTES
│   ├── / (Index)
│   │   └── Layout
│   │       ├── Header
│   │       ├── Hero Section
│   │       ├── Featured Products
│   │       └── Footer
│   │
│   ├── /products (Products List)
│   │   └── Layout
│   │       ├── Header
│   │       ├── Search & Filter
│   │       ├── ProductCard (multiple)
│   │       └── Footer
│   │
│   ├── /products/:slug (Product Detail)
│   │   └── Layout
│   │       ├── Header
│   │       ├── Product Images
│   │       ├── Product Info
│   │       ├── Add to Cart Button
│   │       └── Footer
│   │
│   ├── /auth (Login/Signup)
│   │   └── Auth Form Component
│   │
│   ├── /cart (Shopping Cart)
│   │   └── Layout
│   │       ├── Cart Items
│   │       ├── Cart Summary
│   │       └── Checkout Button
│   │
│   └── /checkout (Order Creation)
│       ├── Order Summary
│       ├── Customer Info Form
│       ├── Payment Proof Upload
│       └── Submit Button
│
└── ADMIN ROUTES (Protected by ProtectedAdminRoute)
    ├── /authadmin (Admin Login)
    │
    ├── /admin (Dashboard)
    │   ├── AdminLayout
    │   │   ├── Sidebar Navigation
    │   │   └── Top Header
    │   └── Stats & Charts
    │
    ├── /admin/products
    │   ├── AdminLayout
    │   └── Product CRUD UI
    │
    ├── /admin/categories
    │   ├── AdminLayout
    │   └── Category CRUD UI
    │
    ├── /admin/orders
    │   ├── AdminLayout
    │   └── Order Management UI
    │
    ├── /admin/users
    │   ├── AdminLayout
    │   └── User & Role Management
    │
    └── /admin/analytics
        ├── AdminLayout
        └── Advanced Charts & Reports
```

---

## Database Design

### Entity Relationship Diagram

```
                        ┌─────────────────┐
                        │   auth.users    │
                        │  (Supabase Auth)│
                        │                 │
                        │ id (UUID)       │
                        │ email           │
                        │ password (enc)  │
                        │ created_at      │
                        └────────┬────────┘
                                 │
                   ┌─────────────┼─────────────┐
                   │             │             │
        ┌──────────▼──────┐  ┌──▼───────────┐ │
        │   profiles      │  │ user_roles   │ │
        ├─────────────────┤  ├──────────────┤ │
        │ id (PK, FK)     │  │ id (PK)      │ │
        │ email           │  │ user_id(FK)  │ │
        │ full_name       │  │ role (enum)  │ │
        │ phone           │  │ UNIQUE()     │ │
        │ address         │  └──────────────┘ │
        │ created_at      │                   │
        │ updated_at      │                   │
        └──────────────────┘       (admin?)   │
                                             │
        ┌──────────────────────────────────┐ │
        │         orders (FK)               │ │
        ├──────────────────────────────────┤ │
        │ id (UUID, PK)                    │ │
        │ user_id (FK, ON DELETE SET NULL) ◄─┘
        │ client_name (TEXT)               │
        │ client_email (TEXT)              │
        │ client_phone (TEXT)              │
        │ client_address (TEXT)            │
        │ total_amount (DECIMAL)           │
        │ payment_status (enum)            │
        │ payment_proof (TEXT, URL)        │
        │ order_status (enum)              │
        │ ebm_document (TEXT)              │
        │ notes (TEXT)                     │
        │ created_at & updated_at          │
        └────┬───────────────────────────────┘
             │ (1:M)
             │
    ┌────────▼──────────────┐
    │   order_items        │
    ├──────────────────────┤
    │ id (UUID, PK)        │
    │ order_id (FK)        │
    │ product_id (FK)      │
    │ product_name (TEXT)  │
    │ quantity (INTEGER)   │
    │ unit_price (DECIMAL) │
    │ created_at           │
    └──────────────────────┘


    ┌──────────────────────────────────────┐
    │       products                       │
    ├──────────────────────────────────────┤
    │ id (UUID, PK)                        │
    │ category_id (FK, ON DELETE SET NULL) ├──┐
    │ name (TEXT)                          │  │
    │ slug (TEXT, UNIQUE)                  │  │
    │ description (TEXT)                   │  │
    │ technical_specs (JSONB)              │  │
    │ general_info (TEXT)                  │  │
    │ video_url (TEXT)                     │  │
    │ price (DECIMAL)                      │  │
    │ discount_percent (INTEGER)           │  │
    │ stock (INTEGER)                      │  │
    │ images (TEXT[])                      │  │
    │ is_featured (BOOLEAN)                │  │
    │ created_at & updated_at              │  │
    └──────────────────────────────────────┘  │
                                              │
    ┌─────────────────────────────────────┐   │
    │       categories                    │   │
    ├─────────────────────────────────────┤   │
    │ id (UUID, PK) ◄──────────────────────────┘
    │ name (TEXT, UNIQUE)                 │
    │ slug (TEXT, UNIQUE)                 │
    │ icon (TEXT)                         │
    │ color (TEXT)                        │
    │ created_at                          │
    └─────────────────────────────────────┘


    ┌─────────────────────────────────────┐
    │      cart_items                     │
    ├─────────────────────────────────────┤
    │ id (UUID, PK)                       │
    │ user_id (FK, CASCADE DELETE)        │
    │ product_id (FK, CASCADE DELETE)     │
    │ quantity (INTEGER, default 1)       │
    │ created_at                          │
    │ UNIQUE(user_id, product_id)         │
    └─────────────────────────────────────┘
```

### Table Details

#### 1. **categories** (Product Categories)
```sql
id: UUID (Primary Key)
name: TEXT (Unique, Required)
slug: TEXT (Unique, Required) -- URL-friendly name
icon: TEXT (Optional)          -- Icon identifier
color: TEXT (Optional)         -- Hex color for UI
created_at: TIMESTAMP
```

#### 2. **products** (Main Product Inventory)
```sql
id: UUID (Primary Key)
category_id: UUID (Foreign Key) -- Which category?
name: TEXT (Required)
slug: TEXT (Unique, Required)   -- URL-friendly name
description: TEXT              -- Product description
technical_specs: JSONB         -- Flexible specs (JSON)
general_info: TEXT             -- Additional info
video_url: TEXT                -- Product demo video
price: DECIMAL(12,2) (Required)
discount_percent: INTEGER (Default: 0) -- Sale discount
stock: INTEGER (Default: 0)    -- Inventory count
images: TEXT[] (Array)         -- Image URLs from storage
is_featured: BOOLEAN (Default: false) -- Homepage featured?
created_at: TIMESTAMP
updated_at: TIMESTAMP
```

#### 3. **profiles** (User Profile Information)
```sql
id: UUID (Primary Key, FK to auth.users)
email: TEXT (Required)
full_name: TEXT (Optional)
phone: TEXT (Optional)
address: TEXT (Optional)
created_at: TIMESTAMP
updated_at: TIMESTAMP
```

#### 4. **user_roles** (Admin Access Control)
```sql
id: UUID (Primary Key)
user_id: UUID (Foreign Key to auth.users)
role: app_role ENUM ('admin', 'user')
UNIQUE(user_id, role) -- One role per user
```

#### 5. **cart_items** (Shopping Cart)
```sql
id: UUID (Primary Key)
user_id: UUID (Foreign Key, CASCADE DELETE)
product_id: UUID (Foreign Key, CASCADE DELETE)
quantity: INTEGER (Default: 1)
created_at: TIMESTAMP
UNIQUE(user_id, product_id) -- Can't add same product twice
```

#### 6. **orders** (Customer Orders)
```sql
id: UUID (Primary Key)
user_id: UUID (Foreign Key, SET NULL on delete)
client_name: TEXT (Required)
client_email: TEXT (Required) -- Account/Contact info
client_phone: TEXT            -- Account/Contact info
client_address: TEXT (Required)
total_amount: DECIMAL(12,2) (Required)
payment_status: payment_status ENUM
  - 'pending'   → Awaiting verification
  - 'verified'  → Payment confirmed
  - 'rejected'  → Payment failed
payment_proof: TEXT           -- URL to payment screenshot
order_status: order_status ENUM
  - 'pending'        → Awaiting processing
  - 'payment_received' → Payment confirmed
  - 'processing'     → Being prepared
  - 'shipped'        → In transit
  - 'delivered'      → Received by customer
  - 'cancelled'      → Order cancelled
ebm_document: TEXT            -- EBM reference number
notes: TEXT                   -- Internal notes
created_at: TIMESTAMP
updated_at: TIMESTAMP
```

#### 7. **order_items** (Line Items in Orders)
```sql
id: UUID (Primary Key)
order_id: UUID (Foreign Key, CASCADE DELETE)
product_id: UUID (Foreign Key, SET NULL)
product_name: TEXT (Required) -- Snapshot of product name
quantity: INTEGER (Required)
unit_price: DECIMAL(12,2) (Required) -- Price at time of order
created_at: TIMESTAMP
```

### Enums

```sql
-- Order Status Flow
order_status: 
  'pending' 
  → 'payment_received' 
  → 'processing' 
  → 'shipped' 
  → 'delivered'
     or 'cancelled'

-- Payment Status
payment_status:
  'pending'   -- Waiting for verification
  'verified'  -- Payment confirmed
  'rejected'  -- Payment failed

-- User Role
app_role:
  'admin'  -- Full admin access
  'user'   -- Regular customer
```

---

## User Authentication Flow

### Customer Authentication (useAuth Hook)

```typescript
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthContextType {
  user: User | null;           // Supabase auth user
  session: Session | null;     // Auth session
  isAdmin: boolean;            // Is user an admin?
  isLoading: boolean;          // Auth state loading?
  signIn: (email, password) => Promise<{ error }>
  signUp: (email, password, fullName) => Promise<{ error }>
  signOut: () => Promise<void>
}
```

### Authentication Flow Diagram

```
┌──────────────────────────────────────────────┐
│  USER VISITS /auth (Customer Login Page)     │
└──────────────────┬───────────────────────────┘
                   │
           ┌───────┴────────┐
           │                │
       SIGN IN           SIGN UP
           │                │
    Email/Password   Email/Password/Full Name
           │                │
           └────────┬────────┘
                    │
        ┌───────────▼────────────┐
        │ Supabase Auth Service  │
        ├────────────────────────┤
        │ 1. Create/Validate     │
        │    auth.users record   │
        │ 2. Generate JWT token  │
        │ 3. Create session      │
        │ 4. Emit auth event     │
        └────────────┬───────────┘
                     │
        ┌────────────▼──────────────┐
        │ useAuth Hook (Context)    │
        ├───────────────────────────┤
        │ 1. Receive auth event     │
        │ 2. Update user state      │
        │ 3. Check admin role       │
        │ 4. Notify app             │
        └────────────┬──────────────┘
                     │
        ┌────────────▼─────────────────────┐
        │ User Profile Setup (if new)      │
        ├──────────────────────────────────┤
        │ Create profiles table entry:     │
        │ - id (from user)                 │
        │ - email (from user)              │
        │ - full_name (from signup)        │
        │ - phone, address (optional)      │
        └──────────────────────────────────┘
                     │
        ┌────────────▼─────────────────────┐
        │ App Updates State                │
        ├──────────────────────────────────┤
        │ - user object populated          │
        │ - isLoading = false              │
        │ - isAdmin = false (by default)   │
        │ - useCart hook can now fetch     │
        │   cart items from database       │
        └──────────────────────────────────┘
                     │
        ┌────────────▼─────────────────────┐
        │ Redirect to Previous Page        │
        │ Or /products (home)              │
        └──────────────────────────────────┘
```

### Admin Authentication (Special Case)

```
USER VISITS /authadmin (Admin Login)
           │
           ├─ Admin login form (separate from /auth)
           │
           ├─ Email + Password submission
           │
           ├─ Supabase Auth (same auth.users table)
           │
           ├─ SPECIAL CHECK:
           │  Query user_roles table
           │  WHERE user_id = logged_in_user
           │  AND role = 'admin'
           │
           ├─ If admin record exists:
           │  setIsAdmin = true
           │  Redirect to /admin
           │
           └─ If NOT admin:
              setIsAdmin = false
              Redirect back to /authadmin
              Show error: "Not authorized"
```

---

## Customer-Facing Features

### 1. **Home Page** (`/`)
```
┌─────────────────────────────────────────┐
│         BuildMart E-Commerce            │
│      Farca.Rwanda Construction          │
├─────────────────────────────────────────┤
│            Hero Banner                  │
│   "Shop Quality Building Materials"     │
│      [Browse Products Button]           │
├─────────────────────────────────────────┤
│    Featured Products Carousel           │
│                                         │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│ │ Product1 │ │ Product2 │ │ Product3 │ │
│ │ $5.99    │ │ $12.99   │ │ $8.99    │ │
│ └──────────┘ └──────────┘ └──────────┘ │
├─────────────────────────────────────────┤
│         Categories Section              │
│    [Tiles] [Sanitary] [Paint] ...       │
├─────────────────────────────────────────┤
│           Footer                        │
│  Contact • About • Policies             │
└─────────────────────────────────────────┘
```

### 2. **Products Listing** (`/products`)
```
Features:
├── Search Bar (real-time search)
├── Category Filter Dropdown
├── Sort Options (price, newest, trending)
├── Product Grid View (responsive)
│   └── Product Cards:
│       ├── Product Image
│       ├── Product Name
│       ├── Price (strikethrough if discounted)
│       ├── Discount Badge (if applicable)
│       ├── Rating/Reviews (if available)
│       └── [Add to Cart] Button
│
├── Pagination (if many products)
└── "No results" message (if search empty)
```

### 3. **Product Detail Page** (`/products/:slug`)
```
Components:
├── Product Images
│   ├── Main image display
│   ├── Thumbnail gallery
│   └── Image zoom on hover
│
├── Product Information
│   ├── Product Name
│   ├── Price (with discount if applicable)
│   ├── Stock Status (in stock / out of stock)
│   ├── SKU/Product ID
│   ├── Description
│   ├── Technical Specifications (from JSONB)
│   ├── General Information
│   └── Video Link (if available)
│
├── Purchase Section
│   ├── Quantity Selector (± buttons)
│   ├── [Add to Cart] Button
│   ├── [Buy Now] Button (direct checkout)
│   └── Share Options
│
├── Related Products
│   └── Similar products from same category
│
└── Reviews & Ratings (if enabled)
```

### 4. **Shopping Cart** (`/cart`)
```
Cart View:
├── Cart Items List
│   ├── Product Image (thumbnail)
│   ├── Product Name (link to detail)
│   ├── Price per unit
│   ├── Quantity selector (±)
│   ├── Line total (price × quantity)
│   └── [Remove] Button
│
├── Cart Summary
│   ├── Subtotal
│   ├── Discount Applied (if coupon)
│   ├── Tax (18%)
│   ├── Shipping (if applicable)
│   └── TOTAL
│
├── Cart Actions
│   ├── [Continue Shopping] Button
│   ├── [Clear Cart] Button
│   └── [Proceed to Checkout] Button
│
└── Empty Cart Message (if no items)
    └── [Browse Products] Link
```

### 5. **Checkout Page** (`/checkout`)
```
Two Sections:

LEFT: Order Summary
├── Checkout Items Table
│   ├── Product Name
│   ├── Quantity
│   ├── Unit Price
│   ├── Line Total
│   └── [Remove] Button
│
└── Order Totals
    ├── Subtotal
    ├── Tax (18%)
    ├── TOTAL Amount

RIGHT: Checkout Form
├── Full Name (required)
├── Account/Contact Info (required)
│   └── (Bank account, mobile money account, etc.)
│
├── Delivery Address (required)
│   └── Street, City, ZIP
│
├── Payment Proof Upload (required)
│   ├── Drag & Drop Zone
│   ├── File preview
│   ├── Supported: JPG, PNG, GIF, PDF
│   ├── Max 5MB
│   └── [Remove File] Button
│
└── [Place Order] Button
    ├── Validates all fields
    ├── Uploads payment proof to storage
    ├── Creates order in database
    └── Redirects to confirmation

Order Submission Process:
1. Validate form (all required fields)
2. Upload payment proof image to Supabase Storage
3. Get public URL from storage
4. Create order record in orders table
5. Create order_items for each product
6. Clear shopping cart
7. Show success toast
8. Redirect to /order-confirmation/:orderId
```

### 6. **Order Confirmation** (`/order-confirmation/:orderId`)
```
Display:
├── Order Receipt Header
│   ├── Order ID
│   ├── Order Date
│   └── "Thank You" message
│
├── Delivery Information
│   ├── Customer Name
│   ├── Email/Contact
│   ├── Delivery Address
│   └── Estimated Delivery Date
│
├── Order Items
│   ├── Item Name
│   ├── Quantity
│   ├── Unit Price
│   └── Line Total
│
├── Order Summary
│   ├── Subtotal
│   ├── Tax
│   └── TOTAL
│
├── Order Status
│   └── Current Status (pending/payment_received/etc.)
│
└── Next Steps
    ├── "We'll contact you soon to confirm payment"
    ├── [Track Order] Button
    └── [Continue Shopping] Button
```

---

## Admin Dashboard Features

### Architecture

```
/authadmin (Admin Login)
    │
    ├─ Only users with admin role can proceed
    ├─ Redirects to /admin on success
    └─ Redirects to /auth on failure

/admin/* (Protected by ProtectedAdminRoute)
    │
    ├─ Checks: Is user logged in?
    ├─ Checks: isAdmin === true?
    ├─ If yes: Show admin page
    └─ If no: Redirect to /authadmin
```

### 1. **Dashboard Home** (`/admin`)

```
Layout:
├── Sidebar Navigation
│   ├── Dashboard (active)
│   ├── Products
│   ├── Categories
│   ├── Orders
│   ├── Users & Roles
│   ├── Analytics
│   └── [Logout]
│
└── Main Content
    ├── Welcome Header
    │   └── "Welcome, [Admin Name]"
    │
    ├── Statistics Cards (4 columns)
    │   ├── Total Products
    │   │   └── Count with trend
    │   ├── Total Orders
    │   │   └── Count with trend
    │   ├── Total Users
    │   │   └── Count with trend
    │   └── Total Revenue
    │       └── Amount with trend %
    │
    ├── Interactive Chart Section
    │   ├── Orders & Revenue Trend
    │   │   └── Line chart (orders vs revenue over time)
    │   └── Recent Orders Table
    │       ├── Order ID
    │       ├── Client Name
    │       ├── Amount
    │       ├── Status (color-coded)
    │       └── Date
    │
    └── Quick Actions
        ├── [+ Add Product]
        ├── [Manage Categories]
        ├── [View All Orders]
        └── [View Analytics]
```

### 2. **Products Management** (`/admin/products`)

```
Features:
├── Search & Filter
│   ├── Search box (real-time)
│   └── Category filter dropdown
│
├── Data Table
│   ├── Product Name
│   ├── Category
│   ├── Price
│   ├── Stock
│   ├── Featured status
│   ├── Status badge
│   └── Actions
│       ├── [Edit]
│       └── [Delete]
│
└── Dialog: Add/Edit Product
    ├── Product Name (required)
    ├── Slug (auto-generated or manual)
    ├── Category (dropdown)
    ├── Price (required)
    ├── Discount % (optional)
    ├── Stock Quantity (required)
    ├── Description (textarea)
    ├── Technical Specs (JSON)
    ├── General Info (textarea)
    ├── Video URL (optional)
    ├── Image Upload
    │   ├── Drag & Drop zone
    │   ├── File preview
    │   └── Upload progress
    ├── Featured checkbox
    └── [Create/Update] Button

CRUD Operations:
├── CREATE: [+ Add Product] opens dialog
├── READ: Table displays all products
├── UPDATE: [Edit] opens dialog with pre-filled data
└── DELETE: [Delete] with confirmation modal
```

### 3. **Categories Management** (`/admin/categories`)

```
Features:
├── Category Grid View
│   └── Each category card shows:
│       ├── Icon
│       ├── Color swatch
│       ├── Category name
│       └── Product count
│
└── Dialog: Add/Edit Category
    ├── Category Name (required)
    ├── Slug (auto-generated)
    ├── Icon Selector (text input)
    ├── Color Picker (hex input with preview)
    └── [Create/Update] Button

CRUD Operations:
├── CREATE: [+ Add Category] button
├── READ: Grid displays all categories
├── UPDATE: Click card to edit
└── DELETE: Delete button on card
```

### 4. **Orders Management** (`/admin/orders`)

```
Features:
├── Search & Filter
│   ├── Search box (name, email, order ID)
│   └── Status filter dropdown
│
├── Orders Table
│   ├── Order ID
│   ├── Client Name
│   ├── Client Email
│   ├── Total Amount
│   ├── Order Status (badge)
│   │   └── Color-coded: pending, processing, shipped, etc.
│   ├── Payment Status (badge)
│   │   └── Color-coded: pending, verified, rejected
│   ├── Date Created
│   └── Actions
│       ├── [View Details]
│       └── [Edit]
│
└── Order Detail Modal
    ├── Order Information
    │   ├── Order ID
    │   ├── Created Date
    │   └── Last Updated
    │
    ├── Client Information
    │   ├── Name
    │   ├── Email/Account
    │   ├── Phone
    │   └── Delivery Address
    │
    ├── Order Items
    │   ├── Product Name
    │   ├── Quantity
    │   ├── Unit Price
    │   └── Line Total
    │
    ├── Order Summary
    │   ├── Subtotal
    │   ├── Tax
    │   └── TOTAL
    │
    ├── Payment Information
    │   ├── Payment Status (dropdown to change)
    │   │   └── pending → verified → rejected
    │   └── Payment Proof
    │       └── [View Image] button (opens in modal)
    │
    ├── Fulfillment
    │   ├── Order Status (dropdown to change)
    │   │   ├── pending
    │   │   ├── payment_received
    │   │   ├── processing
    │   │   ├── shipped
    │   │   ├── delivered
    │   │   └── cancelled
    │   └── Notes (textarea)
    │
    └── [Save Changes] Button
```

### 5. **Users & Roles Management** (`/admin/users`)

```
Features:
├── Users Table
│   ├── User Email
│   ├── Full Name
│   ├── Phone
│   ├── Address
│   ├── Join Date
│   ├── Current Role (admin/user)
│   └── Actions
│       └── [Toggle Admin Role] Button
│
└── Role Management
    ├── Display all users
    ├── Show current role as badge
    └── Quick role toggle button
        ├── Click to grant admin role
        └── Click to remove admin role

Operations:
├── Grant Admin: User → Admin (adds user_roles record)
├── Revoke Admin: Admin → User (removes user_roles record)
└── View user details (click row)
```

### 6. **Analytics** (`/admin/analytics`)

```
Display:
├── Summary Statistics (4 cards)
│   ├── Total Orders (count)
│   ├── Total Revenue (sum)
│   ├── Total Products (count)
│   └── Total Categories (count)
│
├── Charts Section
│   ├── Monthly Orders & Revenue
│   │   └── Bar chart (orders vs revenue)
│   │
│   ├── Products by Category
│   │   └── Pie chart (distribution)
│   │
│   └── Payment Status Distribution
│       └── Pie chart (pending/verified/rejected)
│
└── Time Range Selector (if applicable)
    └── Last 30 days / 90 days / All time
```

---

## Component Deep Dive

### Key Components

#### 1. **App.tsx** (Main Router)
```typescript
// Sets up:
// - QueryClient for data fetching
// - TooltipProvider for UI tooltips
// - AuthProvider for user authentication
// - CartProvider for shopping cart
// - Sonner toaster for notifications
// - React Router with all routes

// Route Structure:
// CUSTOMER: /, /products, /products/:slug, /cart, /checkout, etc.
// ADMIN: /admin/*, all protected
// AUTH: /auth, /authadmin (separate)
```

#### 2. **useAuth Hook** (Authentication)
```typescript
export function AuthProvider({ children }: { children: ReactNode }) {
  // State:
  // - user: Current logged-in user
  // - session: Auth session
  // - isAdmin: Is user an admin?
  // - isLoading: Auth loading state

  // Functions:
  // - signIn(email, password)
  // - signUp(email, password, fullName)
  // - signOut()
  // - checkAdminRole(userId) [internal]

  // Effect: Listen to auth state changes
  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      // Update user, session
      // Check admin role
    });
  }, []);
}

// Usage:
// const { user, isAdmin, signIn, signOut } = useAuth();
```

#### 3. **useCart Hook** (Shopping Cart)
```typescript
export function CartProvider({ children }: { children: ReactNode }) {
  // State:
  // - items: Cart items with product details
  // - cartCount: Number of unique items
  // - cartTotal: Total price
  // - isLoading: Cart loading state

  // Functions:
  // - addToCart(productId, quantity)
  // - updateQuantity(productId, quantity)
  // - removeFromCart(productId)
  // - clearCart()

  // Effect: Fetch cart when user logs in
  useEffect(() => {
    if (user) fetchCart();
  }, [user]);

  // Database Operations:
  // - Read from: cart_items (with product join)
  // - Create: INSERT into cart_items
  // - Update: UPDATE cart_items
  // - Delete: DELETE from cart_items
}

// Usage:
// const { items, addToCart, cartTotal } = useCart();
```

#### 4. **AdminLayout Component**
```typescript
// Structure:
├── Sidebar
│   ├── Logo/Branding
│   ├── Navigation Links
│   │   ├── Dashboard
│   │   ├── Products
│   │   ├── Categories
│   │   ├── Orders
│   │   ├── Users
│   │   └── Analytics
│   └── Logout Button
│
└── Main Content
    ├── Top Header
    │   ├── Breadcrumb
    │   ├── Page Title
    │   └── User Profile
    │
    └── Content Area (dynamic)
        └── {children}

// Responsive:
// - Desktop: Sidebar on left
// - Mobile: Hamburger menu
```

#### 5. **ProtectedAdminRoute Component**
```typescript
// Logic:
if (isLoading) {
  return <LoadingSpinner />
}

if (!user) {
  return <Navigate to="/authadmin" />
}

if (!isAdmin) {
  return <Navigate to="/authadmin" />
}

// If all checks pass:
return children;

// Wrapped around all /admin/* routes
```

#### 6. **ProductCard Component**
```typescript
// Props:
interface Props {
  id: string;
  name: string;
  price: number;
  discount_percent: number;
  images: string[];
  slug: string;
}

// Displays:
├── Product image (first in array)
├── Product name (clickable link)
├── Price
│   └── Strikethrough if discount
├── Discount badge (if discount > 0)
├── [View Details] Button
└── [Add to Cart] Button
```

---

## State Management

### React Context API

The app uses **Context API** for global state:

```
App.tsx (Root)
│
├── QueryClientProvider (TanStack React Query)
│   └── Manages server state & caching
│
├── AuthProvider
│   ├── Provides: user, session, isAdmin, isLoading
│   ├── Functions: signIn, signUp, signOut
│   └── Connected to: Supabase Auth
│
├── CartProvider
│   ├── Provides: items, cartCount, cartTotal
│   ├── Functions: addToCart, removeFromCart, updateQuantity
│   └── Connected to: Supabase cart_items table
│
└── TooltipProvider (Radix UI)
    └── For component tooltips
```

### Data Flow Example: Adding to Cart

```
User clicks "Add to Cart" Button
         │
         ├─ cartContext.addToCart(productId, quantity)
         │
         ├─ Check if user is logged in
         │   └─ If not: Show toast "Please sign in"
         │
         ├─ Check if product already in cart
         │   ├─ If yes: Update quantity
         │   └─ If no: Insert new cart_item
         │
         ├─ Supabase INSERT/UPDATE to cart_items table
         │
         ├─ Re-fetch cart items from database
         │
         ├─ Update context state (items, cartCount, cartTotal)
         │
         ├─ Show toast success message
         │
         └─ Update UI (cart count badge updates)
```

---

## Key Integrations

### 1. **Supabase Integration**

```typescript
// File: src/integrations/supabase/client.ts

import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabase = createClient<Database>(
  VITE_SUPABASE_URL,
  VITE_SUPABASE_PUBLISHABLE_KEY
);

// Features:
// - Auth: signUp, signIn, signOut, onAuthStateChange
// - Database: select, insert, update, delete (using RLS)
// - Storage: upload, download files (for product images & payment proofs)
// - Real-time: Subscribe to table changes (not used in current version)
```

### 2. **Payment Proof Storage**

```
Payment Proof Upload Flow:
│
├─ User selects file in checkout form
├─ Validate: File type (JPG, PNG, GIF, PDF), Size < 5MB
├─ Create preview for display
│
├─ On submit:
│  ├─ supabase.storage.from('payment_proofs').upload(file)
│  ├─ Get public URL from storage
│  ├─ Save URL in orders.payment_proof field
│  └─ Create order record
│
├─ File stored at: /payment_proofs/[timestamp]-[filename]
├─ Public URL: https://[project].supabase.co/storage/.../[file]
│
└─ RLS Policies:
   ├─ Authenticated users can upload
   ├─ Public can view
   └─ Admins can delete
```

### 3. **Product Images Storage**

```
Product Image Upload Flow:
│
├─ Admin uploads image in product form
├─ Validate: File type (image/*), Size < 5MB
├─ Create preview
│
├─ On submit:
│  ├─ supabase.storage.from('product-images').upload(file)
│  ├─ Get public URL
│  ├─ Save URL in products.images array
│  └─ Create product record
│
├─ File stored at: /product-images/products/[timestamp]-[filename]
├─ Public URL: https://[project].supabase.co/storage/.../[file]
│
└─ RLS Policies:
   ├─ Authenticated users can upload
   ├─ Public can view
   └─ Admins can delete
```

---

## Deployment & Setup

### Environment Configuration

Create `.env.local`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-public-key
```

### Development Setup

```bash
# 1. Install dependencies
npm install
# or
bun install

# 2. Start development server
npm run dev
# Accessible at: http://localhost:8080

# 3. Build for production
npm run build
# Output: dist/ directory

# 4. Preview production build
npm run preview
```

### Production Deployment

The project uses **Vite** which creates an optimized build:

```bash
# Build process
npm run build
# - Bundles React code
# - Minifies CSS & JavaScript
# - Creates optimized dist/ folder
# - Ready for deployment

# Deploy to:
# - Vercel (recommended, auto-deploys from Git)
# - Netlify (drag & drop dist/ folder)
# - GitHub Pages
# - Any static hosting (Firebase, S3, etc.)
```

### Database Setup

1. Create Supabase project
2. Run migrations:
   ```sql
   -- Copy from: supabase/migrations/20251229182950_*.sql
   -- Paste into Supabase SQL Editor
   -- Execute all code
   ```
3. Create storage buckets:
   - `product-images`
   - `payment_proofs`
4. Run RLS policies (from BUCKET_SETUP_SQL.sql)
5. Enable RLS on all tables

---

## Summary

**BuildMart** is a production-ready e-commerce platform built with modern web technologies:

### Strengths ✅
- Type-safe TypeScript throughout
- Responsive design (mobile-friendly)
- Real-time data sync via Supabase
- Professional UI with shadcn/ui
- Complete admin dashboard
- Role-based access control
- Secure authentication
- File upload capabilities
- Interactive analytics

### Architecture
- **Frontend**: React 18 + TypeScript + Vite
- **UI**: Tailwind CSS + shadcn/ui + Recharts
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **State**: Context API + TanStack Query
- **Deployment**: Vite static build

### Key Features
- Dual authentication (customer & admin)
- Shopping cart with persistence
- Simplified checkout with payment proof
- Full product & category management
- Order tracking & fulfillment
- User role management
- Revenue analytics
- Real-time inventory

This is a fully functional e-commerce solution ready for Rwanda market or any region!
