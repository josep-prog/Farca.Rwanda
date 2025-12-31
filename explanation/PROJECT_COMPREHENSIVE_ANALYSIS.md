# 🏗️ BUILDMART PROJECT - COMPREHENSIVE DEEP DIVE ANALYSIS

**Last Updated**: December 30, 2025  
**Project Type**: E-commerce Platform (Interior Construction Materials)  
**Status**: Fully Developed with Admin Dashboard

---

## 📋 TABLE OF CONTENTS

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture Deep Dive](#architecture-deep-dive)
4. [File Structure & Organization](#file-structure--organization)
5. [Core Features Explained](#core-features-explained)
6. [Data Flow & State Management](#data-flow--state-management)
7. [Database Schema](#database-schema)
8. [Key Components](#key-components)
9. [Authentication & Authorization](#authentication--authorization)
10. [Deployment & Configuration](#deployment--configuration)

---

## PROJECT OVERVIEW

### What is BuildMart?

**BuildMart** is a modern, full-featured e-commerce platform designed specifically for selling interior construction materials in Rwanda. The platform serves both **customers** (who browse and purchase products) and **administrators** (who manage inventory, orders, and analytics).

### Key Facts

| Aspect | Details |
|--------|---------|
| **Project Name** | Farca.Rwanda / BuildMart |
| **Platform** | Web-based e-commerce |
| **Primary Market** | Rwanda |
| **Products** | Interior construction materials (tiles, sanitary ware, paints, fixtures) |
| **Build Tool** | Vite (ultra-fast frontend build tool) |
| **Backend** | Supabase (PostgreSQL + Auth) |
| **Repository** | Git (Lovable integrated) |
| **Environment** | Node.js with npm/bun |

### Business Domain

BuildMart specializes in:
- 🏠 **Tiles** - Ceramic and porcelain tiles for various applications
- 🚽 **Sanitary Ware** - Toilets, bidets, and bathroom fixtures
- 🎨 **Paints** - Interior and exterior paints with various finishes
- 🛁 **Sinks & Basins** - Modern bathroom and kitchen fixtures
- 💡 **Fixtures** - Lighting and decorative hardware

---

## TECHNOLOGY STACK

### Frontend Technologies

```
┌─────────────────────────────────────────────────────┐
│                  FRONTEND STACK                      │
├─────────────────────────────────────────────────────┤
│ React 18.3.1        - UI library & rendering        │
│ TypeScript 5.8.3    - Type-safe JavaScript          │
│ Vite 5.4.19         - Ultra-fast build tool         │
│ React Router 6.30.1 - Client-side routing           │
│ Tailwind CSS 3.4.17 - Utility-first styling         │
│ shadcn/ui           - High-quality UI components    │
│ TanStack Query 5.83 - Server state management       │
│ React Context       - Global state (Auth, Cart)     │
│ React Hook Form 7.6 - Form state management         │
│ Zod 3.25            - Schema validation             │
│ Lucide Icons 0.462  - Beautiful icon library        │
│ Recharts 2.15       - Chart & graph library         │
│ Sonner 1.7          - Toast notifications           │
│ Date-fns 3.6        - Date manipulation             │
│ Radix UI            - Headless UI components        │
└─────────────────────────────────────────────────────┘
```

### Backend & Infrastructure

```
Supabase (Full Backend Solution)
├── PostgreSQL Database
│   ├── Tables: users, products, categories, orders, etc.
│   ├── Row Level Security (RLS)
│   └── Real-time subscriptions
├── Authentication
│   ├── Email/Password auth
│   ├── JWT tokens
│   └── Session management
├── Storage
│   ├── Product images
│   └── File uploads
└── API
    └── RESTful endpoints auto-generated
```

### Development Tools

- **Package Manager**: npm / bun
- **Linter**: ESLint
- **Code Style**: Tailwind CSS + shadcn/ui conventions
- **Hot Reload**: Vite HMR (Hot Module Replacement)
- **Version Control**: Git
- **CI/CD**: Lovable (automatic deployment)

---

## ARCHITECTURE DEEP DIVE

### Application Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      main.tsx                               │
│              (Application Entry Point)                      │
│                     ↓                                        │
├─────────────────────────────────────────────────────────────┤
│                       App.tsx                               │
│            (Top-Level Route Configuration)                 │
├──────────────┬──────────────┬──────────────┬────────────────┤
│              │              │              │                │
│   QueryClient│  BrowserRouter│ AuthProvider│ CartProvider   │
│   Provider   │      │        │              │                │
│              │      │        │              │                │
└──────────────┼──────┼────────┼──────────────┼────────────────┘
               │      │        │              │
        ┌──────▼──────▼────────▼──────────────▼────┐
        │          Routes & Layout                 │
        └──────┬─────────────────────────────┬─────┘
               │                             │
        ┌──────▼────────────┐        ┌──────▼──────────┐
        │  Customer Routes  │        │  Admin Routes   │
        ├───────────────────┤        ├─────────────────┤
        │ / (Index)         │        │ /admin          │
        │ /products         │        │ /admin/products │
        │ /products/:slug   │        │ /admin/categories
        │ /cart             │        │ /admin/orders   │
        │ /checkout         │        │ /admin/users    │
        │ /order-confirmation│      │ /admin/analytics│
        │ /auth             │        │ /authadmin      │
        └───────────────────┘        └─────────────────┘
```

### Request/Response Flow

```
User Action (Click, Form Submit)
        ↓
Component State Update / Event Handler
        ↓
API Call to Supabase (via supabase client)
        ↓
Server (PostgreSQL Database)
        ↓
Response with Data
        ↓
Update Component State / Context
        ↓
Re-render UI
        ↓
Display to User
```

### State Management Architecture

```
┌─────────────────────────────────────────────────────┐
│           State Management Layers                   │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Global State (Context API)                        │
│  ├── AuthContext (user, session, isAdmin)          │
│  └── CartContext (items, total, count)             │
│                    ↓                                │
│  Server State (TanStack Query)                     │
│  ├── Products data                                 │
│  ├── Categories                                    │
│  ├── Orders                                        │
│  └── Analytics                                     │
│                    ↓                                │
│  Local State (useState)                            │
│  ├── Form inputs                                   │
│  ├── UI toggles (dialogs, modals)                  │
│  └── Temporary data                                │
│                    ↓                                │
│  Persistence Layer                                 │
│  ├── localStorage (JWT token)                      │
│  └── Database (all persistent data)                │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## FILE STRUCTURE & ORGANIZATION

### Complete Directory Tree

```
Farca.Rwanda/
├── 📄 Documentation Files (12 files)
│   ├── README.md
│   ├── DOCUMENTATION_INDEX.md
│   ├── KNOWLEDGE_BASE_SUMMARY.md
│   ├── ARCHITECTURE_DIAGRAMS.md
│   ├── PROJECT_DEEP_DIVE.md
│   ├── DEVELOPER_QUICK_REFERENCE.md
│   ├── QUICK_REFERENCE.md
│   ├── QUICK_SUMMARY.md
│   ├── CHECKOUT_SYSTEM_GUIDE.md
│   ├── CHECKOUT_INTEGRATION_MAP.md
│   ├── ADMIN_DASHBOARD_GUIDE.md
│   └── IMAGE_UPLOAD_GUIDE.md
│
├── 📁 Configuration Files
│   ├── package.json          - Dependencies & scripts
│   ├── vite.config.ts        - Vite build configuration
│   ├── tsconfig.json         - TypeScript configuration
│   ├── tsconfig.app.json     - App TypeScript settings
│   ├── tsconfig.node.json    - Node TypeScript settings
│   ├── tailwind.config.ts    - Tailwind CSS config
│   ├── postcss.config.js     - PostCSS configuration
│   ├── eslint.config.js      - ESLint rules
│   ├── components.json       - shadcn/ui config
│   ├── index.html            - HTML entry point
│   └── bun.lockb             - bun lock file
│
├── 📁 public/
│   └── robots.txt            - SEO robots file
│
├── 📁 src/ (Main Application Code)
│   ├── main.tsx              - Application entry point
│   ├── App.tsx               - Root component & routing
│   ├── App.css               - Global app styles
│   ├── index.css             - Global styles
│   ├── vite-env.d.ts         - Vite env types
│   │
│   ├── 📁 assets/            - Static assets
│   │   └── (images, fonts, etc)
│   │
│   ├── 📁 components/        - Reusable React components
│   │   ├── NavLink.tsx
│   │   ├── 📁 admin/         - Admin-specific components
│   │   │   ├── AdminLayout.tsx    - Admin page wrapper
│   │   │   └── ProtectedAdminRoute.tsx - Auth guard
│   │   ├── 📁 layout/        - Layout components
│   │   │   ├── Header.tsx    - Navigation header
│   │   │   ├── Footer.tsx    - Page footer
│   │   │   └── Layout.tsx    - Page wrapper
│   │   ├── 📁 products/      - Product components
│   │   │   └── ProductCard.tsx - Product display card
│   │   └── 📁 ui/            - shadcn/ui components (40+)
│   │       ├── button.tsx, input.tsx, card.tsx
│   │       ├── dialog.tsx, table.tsx, tabs.tsx
│   │       ├── select.tsx, pagination.tsx
│   │       └── ... (many more UI primitives)
│   │
│   ├── 📁 hooks/             - Custom React hooks
│   │   ├── useAuth.tsx       - Auth context & logic
│   │   ├── useCart.tsx       - Cart context & logic
│   │   ├── useToast.ts       - Toast notifications
│   │   └── use-mobile.tsx    - Responsive design helper
│   │
│   ├── 📁 integrations/      - External service integration
│   │   └── 📁 supabase/
│   │       ├── client.ts     - Supabase client setup
│   │       └── types.ts      - Generated TypeScript types
│   │
│   ├── 📁 lib/               - Utility functions
│   │   └── utils.ts          - Helper functions
│   │
│   └── 📁 pages/             - Page components (12 pages)
│       ├── Index.tsx         - Home page
│       ├── Products.tsx      - Products listing
│       ├── ProductDetail.tsx - Single product page
│       ├── Cart.tsx          - Shopping cart page
│       ├── Checkout.tsx      - Checkout process
│       ├── OrderConfirmation.tsx - Order success
│       ├── Auth.tsx          - Customer login/signup
│       ├── NotFound.tsx      - 404 page
│       └── 📁 admin/         - Admin pages
│           ├── Dashboard.tsx - Admin home & analytics
│           ├── Products.tsx  - Product management (CRUD)
│           ├── Categories.tsx - Category management
│           ├── Orders.tsx    - Order management
│           ├── Users.tsx     - User management
│           └── Analytics.tsx - Analytics & reports
│
├── 📁 supabase/              - Supabase local development
│   ├── config.toml
│   └── 📁 migrations/        - Database migration files
│       └── 20251229182950_cd2f56eb-dff9-4a01-ba24-876eaf0635ee.sql
│
└── 📄 SQL Setup Files
    └── PRODUCT_IMAGES_SETUP.sql - Database initialization
```

### Code Organization Principles

1. **Separation of Concerns**
   - Pages handle routing & major features
   - Components handle UI & reusability
   - Hooks handle stateful logic
   - Utils handle pure functions

2. **Component Hierarchy**
   ```
   Layout (wraps all pages)
   ├── Header (navigation)
   ├── Main Content (page-specific)
   └── Footer (global footer)
   ```

3. **State Scope**
   - Global: Auth & Cart (Context API)
   - Component: Form inputs, UI toggles (useState)
   - Server: Products, Orders (TanStack Query + Supabase)

---

## CORE FEATURES EXPLAINED

### 1. **Customer Features**

#### Product Browsing
- **Location**: `/products` route
- **Component**: `src/pages/Products.tsx`
- **Features**:
  - Display all products with images, prices, discounts
  - Filter by category
  - Search by product name
  - Responsive grid layout
  - Pagination support

#### Product Details
- **Location**: `/products/:slug` route
- **Component**: `src/pages/ProductDetail.tsx`
- **Features**:
  - Full product information
  - High-quality image gallery
  - Price with discount calculation
  - Stock availability
  - "Add to Cart" button
  - Related products section

#### Shopping Cart
- **Location**: `/cart` route
- **Component**: `src/pages/Cart.tsx`
- **Context**: `useCart()` hook
- **Features**:
  - View all items in cart
  - Update item quantities
  - Remove items
  - Cart persistence (database)
  - Real-time total calculation

#### Checkout Process
- **Location**: `/checkout` route
- **Component**: `src/pages/Checkout.tsx`
- **Features**:
  - Order summary with items & prices
  - Customer information form
  - Address collection
  - Tax calculation (18% fixed)
  - Order confirmation
  - Transaction processing

#### Order Confirmation
- **Location**: `/order-confirmation/:orderId` route
- **Component**: `src/pages/OrderConfirmation.tsx`
- **Features**:
  - Order details display
  - Receipt/Invoice
  - Tracking information
  - Customer service contact

#### Authentication
- **Location**: `/auth` route
- **Component**: `src/pages/Auth.tsx`
- **Features**:
  - User signup with full name, email, password
  - User login
  - Password validation
  - Session persistence
  - Error handling

### 2. **Admin Dashboard Features**

#### Admin Authentication
- **Location**: `/authadmin` route
- **Component**: `src/pages/AdminAuth.tsx`
- **Security**: 
  - Separate from customer auth
  - Requires admin role in `user_roles` table
  - Route protection with `ProtectedAdminRoute`

#### Dashboard/Home
- **Location**: `/admin` route
- **Component**: `src/pages/admin/Dashboard.tsx`
- **Features**:
  - Overview statistics (total orders, revenue, users)
  - Charts and analytics
  - Quick access to other admin pages
  - Recent orders list

#### Product Management
- **Location**: `/admin/products` route
- **Component**: `src/pages/admin/Products.tsx`
- **CRUD Operations**:
  - **Create**: Add new products with all details
  - **Read**: Display product table with search
  - **Update**: Edit existing products
  - **Delete**: Remove products
- **Features**:
  - Image upload & management
  - Price & discount settings
  - Stock management
  - Category assignment
  - Featured product flag
  - Bulk operations

#### Category Management
- **Location**: `/admin/categories` route
- **Component**: `src/pages/admin/Categories.tsx`
- **CRUD Operations**:
  - Create, read, update, delete categories
  - Icon selection
  - Color coding
  - URL slug generation

#### Order Management
- **Location**: `/admin/orders` route
- **Component**: `src/pages/admin/Orders.tsx`
- **Features**:
  - View all orders with status
  - Order status updates (pending, processing, shipped, delivered)
  - Payment status tracking
  - Customer information
  - Order items detail
  - Filtering & sorting

#### User Management
- **Location**: `/admin/users` route
- **Component**: `src/pages/admin/Users.tsx`
- **Features**:
  - List all users
  - User roles management
  - User activity tracking
  - Account status control

#### Analytics & Reporting
- **Location**: `/admin/analytics` route
- **Component**: `src/pages/admin/Analytics.tsx`
- **Metrics**:
  - Total revenue
  - Order trends
  - Product performance
  - Category sales
  - Customer demographics
  - Time-series charts

---

## DATA FLOW & STATE MANAGEMENT

### Authentication Flow

```
User navigates to /auth
        ↓
Enters email, password, full_name
        ↓
Submits form
        ↓
useAuth.signUp() called
        ↓
Supabase creates auth.users record
        ↓
Supabase creates profiles record
        ↓
JWT token generated
        ↓
Token stored in localStorage
        ↓
AuthContext updated
        ↓
User redirected to home page
        ↓
useAuth hook detects user change
        ↓
checkAdminRole() called
        ↓
user_roles table queried
        ↓
isAdmin state set accordingly
```

### Shopping Cart Flow

```
User clicks "Add to Cart" on product
        ↓
useCart.addToCart(productId) called
        ↓
User exists in auth? Check
        ↓
Product already in cart?
    ├─ YES → updateQuantity()
    └─ NO → insert into cart_items
        ↓
Database updated
        ↓
fetchCart() refreshes local state
        ↓
CartContext updated
        ↓
Cart badge updates
        ↓
Toast notification shows
        ↓
Component re-renders
```

### Checkout & Order Flow

```
User clicks "Checkout"
        ↓
Checkout page loads cart items
        ↓
User fills form (name, email, phone, address)
        ↓
Form validation
        ↓
Calculate totals (subtotal + 18% tax)
        ↓
User clicks "Place Order"
        ↓
Order created in orders table
        ↓
Order items created in order_items
        ↓
Cart cleared (clearCart())
        ↓
Redirect to /order-confirmation/:orderId
        ↓
Display success page with order details
```

### Admin Product Management Flow

```
Admin navigates to /admin/products
        ↓
Fetches all products from database
        ↓
Displays in table with search/sort
        ↓
Admin clicks "Add Product"
        ↓
Dialog opens with form
        ↓
Admin fills form (name, price, stock, category, images)
        ↓
Optionally uploads product images
        ↓
Form validation
        ↓
On submit:
├─ INSERT new product
├─ Store image URLs
└─ Refresh product list
        ↓
Success toast shown
        ↓
Dialog closes
        ↓
New product appears in table
```

---

## DATABASE SCHEMA

### Complete Schema Overview

```
                        DATABASE TABLES

┌─────────────────────────────────────────────────────┐
│                    auth.users                       │
│ (Managed by Supabase - DO NOT MODIFY DIRECTLY)     │
├─────────────────────────────────────────────────────┤
│ id (UUID) PRIMARY KEY                              │
│ email UNIQUE NOT NULL                              │
│ encrypted_password NOT NULL                        │
│ email_confirmed_at TIMESTAMP                       │
│ created_at TIMESTAMP DEFAULT now()                 │
│ updated_at TIMESTAMP                               │
└──────────────────┬──────────────────────────────────┘
                   │ (1:1)
        ┌──────────▼─────────────────┐
        │     profiles (public)       │
        ├────────────────────────────┤
        │ id (UUID) PRIMARY KEY (FK) │
        │ email TEXT                 │
        │ full_name TEXT             │
        │ phone TEXT                 │
        │ address TEXT               │
        │ created_at TIMESTAMP       │
        │ updated_at TIMESTAMP       │
        └──────────┬──────────────────┘
                   │
        ┌──────────▼─────────────────┐
        │    user_roles (public)     │
        ├────────────────────────────┤
        │ id UUID PRIMARY KEY        │
        │ user_id (UUID) FK          │
        │ role TEXT (enum)           │
        │   - 'customer' (default)   │
        │   - 'admin'                │
        │ created_at TIMESTAMP       │
        │ UNIQUE(user_id, role)      │
        └────────────────────────────┘

┌────────────────────────────────────────────────────┐
│         categories (public - Taxonomy)              │
├────────────────────────────────────────────────────┤
│ id UUID PRIMARY KEY                                │
│ name TEXT NOT NULL                                 │
│ slug TEXT UNIQUE NOT NULL                          │
│ icon TEXT (Lucide icon name)                       │
│ color TEXT (hex or tailwind color)                 │
│ created_at TIMESTAMP DEFAULT now()                 │
│ updated_at TIMESTAMP                               │
└──────────────────┬─────────────────────────────────┘
                   │ (1:M)
        ┌──────────▼────────────────────────┐
        │      products (public)             │
        ├────────────────────────────────────┤
        │ id UUID PRIMARY KEY                │
        │ category_id (UUID) FK [NOT NULL]   │
        │ name TEXT NOT NULL                 │
        │ slug TEXT UNIQUE NOT NULL          │
        │ description TEXT                   │
        │ price NUMERIC(10,2) NOT NULL       │
        │ discount_percent INTEGER (0-100)   │
        │ stock INTEGER NOT NULL (>=0)       │
        │ images TEXT[] (URL array)          │
        │ is_featured BOOLEAN DEFAULT false  │
        │ created_at TIMESTAMP DEFAULT now() │
        │ updated_at TIMESTAMP               │
        └────────┬──────────────────┬────────┘
                 │(1:M)             │(1:M)
       ┌─────────▼──────────┐  ┌────▼────────────────┐
       │  cart_items        │  │  order_items        │
       │  (public)          │  │  (public)           │
       ├────────────────────┤  ├─────────────────────┤
       │ id UUID PK         │  │ id UUID PK          │
       │ user_id (UUID) FK  │  │ order_id (UUID) FK  │
       │ product_id UUID FK │  │ product_id UUID FK  │
       │ quantity INTEGER   │  │ quantity INTEGER    │
       │ created_at         │  │ unit_price NUMERIC  │
       │ UNIQUE(user_id,    │  │ created_at          │
       │ product_id)        │  └─────────────────────┘
       └────────────────────┘         ▲
                                      │(1:M)
        ┌─────────────────────────────┴──────────┐
        │      orders (public)                    │
        ├─────────────────────────────────────────┤
        │ id UUID PRIMARY KEY                     │
        │ user_id (UUID) FK                       │
        │ client_name TEXT NOT NULL               │
        │ client_email TEXT NOT NULL              │
        │ client_phone TEXT NOT NULL              │
        │ client_address TEXT NOT NULL            │
        │ total_amount NUMERIC(10,2) NOT NULL     │
        │ order_status TEXT (enum)                │
        │   - 'pending' (new order)               │
        │   - 'processing' (being prepared)       │
        │   - 'shipped' (in transit)              │
        │   - 'delivered' (completed)             │
        │   - 'cancelled'                         │
        │ payment_status TEXT (enum)              │
        │   - 'pending'                           │
        │   - 'completed'                         │
        │   - 'failed'                            │
        │ notes TEXT (customer notes)             │
        │ created_at TIMESTAMP DEFAULT now()      │
        │ updated_at TIMESTAMP                    │
        └─────────────────────────────────────────┘
```

### Key Database Relationships

| Parent Table | Child Table | Relation | On Delete |
|-------------|------------|----------|-----------|
| auth.users | profiles | 1:1 | CASCADE |
| auth.users | user_roles | 1:M | CASCADE |
| auth.users | cart_items | 1:M | CASCADE |
| auth.users | orders | 1:M | SET NULL |
| categories | products | 1:M | SET NULL |
| products | cart_items | 1:M | CASCADE |
| products | order_items | 1:M | SET NULL |
| orders | order_items | 1:M | CASCADE |

### Row Level Security (RLS)

RLS policies protect data:
- Users can only see their own cart items
- Users can only see their own orders
- Admin users have full access to all data
- Products are publicly readable
- Categories are publicly readable

---

## KEY COMPONENTS

### 1. **AuthProvider & useAuth Hook**

**File**: `src/hooks/useAuth.tsx`

```tsx
interface AuthContextType {
  user: User | null;              // Supabase User object
  session: Session | null;        // Auth session
  isAdmin: boolean;               // Admin flag
  isLoading: boolean;             // Loading state
  signIn: (email, password) => Promise
  signUp: (email, password, fullName) => Promise
  signOut: () => Promise<void>
}
```

**Usage**:
```tsx
const { user, isAdmin, signIn, signOut } = useAuth();
```

**Key Features**:
- Automatic session restoration on app load
- Admin role verification
- Error handling
- Loading states

### 2. **CartProvider & useCart Hook**

**File**: `src/hooks/useCart.tsx`

```tsx
interface CartContextType {
  items: CartItem[];
  cartCount: number;
  cartTotal: number;
  isLoading: boolean;
  addToCart: (productId, quantity?) => Promise<void>
  updateQuantity: (productId, quantity) => Promise<void>
  removeFromCart: (productId) => Promise<void>
  clearCart: () => Promise<void>
}
```

**Usage**:
```tsx
const { items, cartTotal, addToCart } = useCart();
```

**Key Features**:
- Database persistence
- Real-time calculations
- User-scoped cart
- Auto-fetch on login
- Toast notifications

### 3. **ProtectedAdminRoute**

**File**: `src/components/admin/ProtectedAdminRoute.tsx`

```tsx
function ProtectedAdminRoute({ children }) {
  const { user, isAdmin, isLoading } = useAuth();
  
  if (isLoading) return <LoadingPage />
  if (!user) return <Navigate to="/authadmin" />
  if (!isAdmin) return <Navigate to="/authadmin" />
  
  return children;
}
```

**Security**:
- Prevents unauthorized admin access
- Redirects to login if needed
- Checks admin role in database
- Loading states

### 4. **ProductCard Component**

**File**: `src/components/products/ProductCard.tsx`

**Props**:
```tsx
interface ProductCardProps {
  id: string;
  slug: string;
  name: string;
  price: number;
  discountPercent: number;
  images: string[];
  categoryName?: string;
}
```

**Features**:
- Product image display
- Price with discount calculation
- Quick add to cart
- Link to detail page

### 5. **Layout Component**

**File**: `src/components/layout/Layout.tsx`

**Structure**:
```
Layout
├── Header (navigation)
├── Main (children)
└── Footer
```

---

## AUTHENTICATION & AUTHORIZATION

### Two-Tier Authentication System

#### 1. Customer Authentication

```
/auth page
    ↓
signUp(email, password, fullName)
    ↓
Creates auth.users record in Supabase Auth
    ↓
Creates profiles record with user details
    ↓
Auto-creates customer role in user_roles
    ↓
Returns to home (isAdmin = false)
```

#### 2. Admin Authentication

```
/authadmin page
    ↓
signIn(email, password)
    ↓
Authenticates against auth.users
    ↓
checkAdminRole() queries user_roles
    ↓
Looks for role == 'admin'
    ↓
Sets isAdmin = true if found
    ↓
ProtectedAdminRoute allows access
```

### Security Measures

1. **JWT Tokens**: Supabase handles JWT generation & validation
2. **Row Level Security**: Database policies restrict data access
3. **Route Protection**: Admin routes protected by `ProtectedAdminRoute`
4. **Role-Based Access**: user_roles table controls permissions
5. **HTTPS**: Recommended for production
6. **Secure Session**: localStorage with auto-refresh

---

## DEPLOYMENT & CONFIGURATION

### Environment Variables

Create `.env.local` file:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-public-key
```

### Build & Run

```bash
# Install dependencies
npm install

# Development server (hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Linting
npm run lint
```

### Development Workflow

1. **Local Development**
   ```bash
   npm run dev
   # App runs at http://localhost:8080
   ```

2. **Database Testing**
   - Supabase provides free tier with 500MB storage
   - Test locally with Supabase CLI
   - Run migrations in `supabase/migrations/`

3. **Image Uploads**
   - Products store image URLs in database
   - Images stored in Supabase Storage bucket
   - Admin can upload new images through admin panel

### Deployment Options

1. **Lovable Platform** (Integrated CI/CD)
   - Auto-deploys on git push
   - Free tier available
   - Custom domain support

2. **Vercel** (Recommended)
   - Zero-config deployment
   - Preview deployments for PRs
   - Edge functions support

3. **Netlify**
   - Easy GitHub integration
   - Form handling
   - Analytics included

4. **Self-hosted**
   - Build and deploy Docker container
   - Requires server infrastructure

---

## WORKFLOW PATTERNS

### Adding a New Admin Feature

1. **Create Page** (`src/pages/admin/NewFeature.tsx`)
2. **Add Route** (in `App.tsx`)
3. **Protect Route** (with `ProtectedAdminRoute`)
4. **Use Database** (with supabase client)
5. **Add UI** (with shadcn/ui components)

### Adding a New Product Field

1. **Update Database**: Add column to products table
2. **Update Types**: Modify `src/integrations/supabase/types.ts`
3. **Update Pages**: Modify product pages to display/input new field
4. **Update Admin**: Add field to product form in admin panel

### Handling Errors

```tsx
try {
  const { data, error } = await supabase.from("table").select("*");
  if (error) throw error;
  setData(data);
} catch (error) {
  toast.error(error.message);
  console.error(error);
}
```

---

## KEY INSIGHTS & BEST PRACTICES

### 1. **Component Design**
- Keep components focused and reusable
- Use shadcn/ui for consistency
- Lift state up when needed
- Pass props clearly

### 2. **Data Fetching**
- Use supabase client directly
- Handle loading & error states
- Cache with TanStack Query when appropriate
- Validate data on client

### 3. **Styling**
- Use Tailwind CSS utilities
- Leverage component defaults
- Keep custom CSS minimal
- Use CSS variables for theming

### 4. **State Management**
- Auth & Cart → Context API
- Page data → Component state or Query
- Form data → React Hook Form
- Derived state → Computed in component

### 5. **Type Safety**
- Always use TypeScript
- Define interfaces for data structures
- Use generated types from Supabase
- Enable strict mode in tsconfig.json

---

## DEVELOPMENT TIPS

### Debugging

1. **Browser DevTools**
   - React DevTools extension
   - Network tab for API calls
   - Console for errors

2. **Supabase Dashboard**
   - Check database content
   - View RLS policies
   - Monitor Auth logs
   - Check Storage files

3. **Logging**
   ```tsx
   console.log("Debug info:", variable);
   console.error("Error:", error);
   ```

### Common Tasks

**Display Products from Database**:
```tsx
useEffect(() => {
  const fetchProducts = async () => {
    const { data } = await supabase.from("products").select("*");
    setProducts(data);
  };
  fetchProducts();
}, []);
```

**Create New Record**:
```tsx
await supabase.from("table").insert({ field: value });
```

**Update Record**:
```tsx
await supabase.from("table").update({ field: newValue }).eq("id", id);
```

**Delete Record**:
```tsx
await supabase.from("table").delete().eq("id", id);
```

---

## PROJECT STATISTICS

| Metric | Count |
|--------|-------|
| Pages | 12 |
| Components | 40+ |
| Custom Hooks | 4 |
| UI Components (shadcn/ui) | 40+ |
| Database Tables | 8 |
| API Endpoints | Auto-generated |
| Lines of Code | ~5000+ |
| Type-Safe | 100% (TypeScript) |

---

## CONCLUSION

**BuildMart** is a professionally built, full-featured e-commerce platform with:

✅ **Modern Stack**: React, TypeScript, Vite, Tailwind CSS  
✅ **Robust Backend**: Supabase PostgreSQL with RLS  
✅ **Complete Features**: Shopping, admin dashboard, analytics  
✅ **Type-Safe**: 100% TypeScript coverage  
✅ **Scalable**: Clean architecture ready for growth  
✅ **Well-Documented**: Comprehensive guides & comments  

The project is production-ready and can be deployed immediately to Vercel, Netlify, or Lovable platform.

---

**Project Created**: December 2025  
**Last Updated**: December 30, 2025  
**Status**: ✅ Complete & Production-Ready
