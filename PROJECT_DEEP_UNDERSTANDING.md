# Farca Rwanda - Project Deep Understanding

## 📋 Project Overview

**Farca Rwanda** is a comprehensive e-commerce platform for selling interior materials (tiles, sanitaryware, paints, etc.) built with modern web technologies. It serves both customers and administrators with distinct user roles and permissions.

**Tech Stack:**
- **Frontend:** React 18.3 + TypeScript + Vite
- **Styling:** Tailwind CSS + shadcn/ui components
- **Backend/Database:** Supabase (PostgreSQL) with Row-Level Security (RLS)
- **Authentication:** Supabase Auth
- **State Management:** React Context (Auth, Cart) + React Query
- **Charts/Analytics:** Recharts

---

## 🏗️ Architecture Overview

### Frontend Architecture (Client-Side)

```
src/
├── pages/              # Route pages (customer & admin)
├── components/         # Reusable UI components
├── hooks/             # Context hooks (Auth, Cart)
├── integrations/      # Supabase client setup
├── assets/            # Images & static files
└── lib/               # Utilities
```

### Data Flow

1. **Authentication:** `useAuth()` hook manages user sessions via Supabase Auth
2. **Shopping:** `useCart()` hook manages cart items (stored in DB, not local storage)
3. **Products:** Fetched directly from Supabase on-demand
4. **Orders:** Created during checkout with payment proof validation

---

## 🗄️ Database Schema

### Core Tables

#### 1. **users** (Supabase Auth)
- Managed by Supabase Auth service
- References in `profiles` and `user_roles`

#### 2. **profiles**
```sql
- id (UUID, FK to auth.users)
- email (TEXT)
- full_name (TEXT)
- phone (TEXT)
- address (TEXT)
- created_at, updated_at (TIMESTAMPS)
```
- Auto-created on user signup via trigger
- Stores user profile information

#### 3. **user_roles**
```sql
- id (UUID, PRIMARY KEY)
- user_id (UUID, FK to auth.users)
- role (ENUM: 'admin' | 'user')
```
- Determines admin privileges
- Checked via `has_role()` function for RLS policies

#### 4. **categories**
```sql
- id, name, slug (UNIQUE)
- icon, color (TEXT)
- created_at (TIMESTAMP)
```
- Product categorization (Tiles, Toilets, Paints, etc.)
- Public read-only; admin write access

#### 5. **products**
```sql
- id (UUID)
- category_id (FK to categories)
- name, slug (UNIQUE)
- description, technical_specs (JSONB), general_info
- video_url (TEXT)
- price (DECIMAL 12,2)
- discount_percent (INTEGER)
- stock (INTEGER)
- images (TEXT[] array)
- is_featured (BOOLEAN)
- created_at, updated_at
```
- Core product data with rich metadata
- Supports images array, technical specs, video URLs
- Featured products shown on homepage

#### 6. **cart_items**
```sql
- id (UUID)
- user_id (FK)
- product_id (FK)
- quantity (INTEGER)
- created_at
- UNIQUE(user_id, product_id)
```
- Tracks items in user shopping carts
- Stores only product ID + quantity (product details fetched via JOIN)

#### 7. **orders**
```sql
- id (UUID)
- user_id (FK, nullable)
- client_name, client_email, client_phone, client_address
- total_amount (DECIMAL 12,2)
- payment_status (ENUM: 'pending' | 'verified' | 'rejected')
- payment_proof (TEXT - file path in storage)
- order_status (ENUM: 'pending' | 'payment_received' | 'processing' | 'shipped' | 'delivered' | 'cancelled')
- ebm_document (TEXT - EBM file path)
- notes (TEXT)
- created_at, updated_at
```

#### 8. **order_items**
```sql
- id (UUID)
- order_id (FK)
- product_id (FK, nullable)
- product_name, quantity, unit_price
- created_at
```
- Line items for each order
- Denormalized product_name to preserve order history

### Key Enums
- `order_status`: pending → payment_received → processing → shipped → delivered (or cancelled)
- `payment_status`: pending → verified/rejected
- `app_role`: admin | user

### Security Features

**Row-Level Security (RLS) Policies:**

1. **Public Access:**
   - Categories & Products: readable by everyone

2. **User Access:**
   - Users see/edit own profiles
   - Users manage own cart items
   - Users see own orders

3. **Admin Access:**
   - Can create/edit/delete products & categories
   - Can view all orders & order items
   - Can manage all user roles

4. **Security Definer Function:**
   - `has_role(user_id, role)` - checks if user has a role without SQL injection risk

---

## 🔑 Key Features

### 1. Customer-Facing Features

#### **Product Browsing**
- Homepage with featured products (4 products)
- Category-based filtering (6 main categories)
- Product search by name
- Individual product detail pages with:
  - Images carousel
  - Technical specifications
  - General information
  - Video URLs
  - Discount pricing

#### **Shopping Cart**
- Add/remove products
- Adjust quantities
- Real-time total calculations
- Persistent storage (database, not local storage)
- Cart synchronizes on login

#### **Checkout Process**
- Two checkout modes:
  1. Direct: Single product from product page
  2. Cart: Multiple items from shopping cart
- Form validation (name, contact, address)
- **Payment Proof Upload:**
  - Image/PDF upload required
  - File preview before submission
  - Stored in Supabase Storage
- **Tax Calculation:** 18% tax added to subtotal
- Order confirmation with order ID

#### **Order Management**
- Users can view their order history
- Order status tracking (pending → payment_received → shipped → delivered)
- Order details with items and totals

#### **Authentication**
- Email/password signup
- Email/password login
- Session persistence
- Profile management

### 2. Admin-Facing Features

#### **Dashboard**
- Key metrics:
  - Total products count
  - Total orders count
  - Total users count
  - Total revenue
- Order trends chart (orders & revenue by date)
- Recent orders list

#### **Product Management**
- Create, edit, delete products
- Bulk operations
- Category assignment
- Image uploads (multiple)
- Pricing and discount management
- Stock tracking
- Featured product toggle
- Technical specs editor (JSONB)

#### **Category Management**
- Create, edit, delete categories
- Icon and color selection
- Slug auto-generation

#### **Order Management**
- View all orders
- Filter/search capabilities
- Update order status
- Update payment status
- View customer details
- Payment proof verification
- EBM document upload/management

#### **User Management**
- View all user profiles
- User role assignment (admin/user)
- User activity tracking

#### **Analytics**
- Revenue charts
- Order trends
- Top products
- Customer insights

---

## 🔐 Authentication & Authorization

### Auth Flow

1. **User Signup:**
   ```
   signUp(email, password, fullName) 
   → Supabase Auth creates user
   → Trigger creates profile + user_role ('user')
   ```

2. **User Login:**
   ```
   signIn(email, password)
   → Session stored in localStorage
   → Session automatically refreshed
   → Admin role checked from user_roles table
   ```

3. **Admin Check:**
   ```
   useAuth() hook checks user_roles table
   → Sets isAdmin boolean
   → Used by ProtectedAdminRoute component
   ```

### Admin Route Protection

```typescript
<ProtectedAdminRoute>
  <AdminDashboard />
</ProtectedAdminRoute>
```
- Redirects to login if not authenticated
- Redirects to home if not admin

---

## 📄 Page Structure

### Customer Pages

| Path | Component | Purpose |
|------|-----------|---------|
| `/` | Index | Homepage with featured products & categories |
| `/products` | Products | Product catalog with search/filter |
| `/products/:slug` | ProductDetail | Individual product details |
| `/cart` | Cart | Shopping cart view & management |
| `/checkout` | Checkout | Order creation with payment proof |
| `/order-confirmation/:orderId` | OrderConfirmation | Order success confirmation |
| `/orders` | MyOrders | User's order history |
| `/auth` | Auth | Login/signup form |

### Admin Pages

| Path | Component | Purpose |
|------|-----------|---------|
| `/authadmin` | AdminAuth | Admin login |
| `/admin` | Dashboard | Admin dashboard with stats |
| `/admin/products` | Products | Product management |
| `/admin/categories` | Categories | Category management |
| `/admin/orders` | Orders | Order management & fulfillment |
| `/admin/users` | Users | User profile & role management |
| `/admin/analytics` | Analytics | Business analytics & insights |

---

## 🔄 Data Flow Patterns

### Shopping Flow

```
1. Browse Products (Supabase query)
   ↓
2. Add to Cart (INSERT into cart_items)
   ↓
3. View Cart (SELECT cart_items with product JOIN)
   ↓
4. Checkout (Load items from cart OR direct product)
   ↓
5. Upload Payment Proof
   ↓
6. Create Order (INSERT orders + order_items)
   ↓
7. Clear Cart (DELETE all cart_items for user)
   ↓
8. Order Confirmation Page
```

### Admin Order Fulfillment

```
1. View All Orders (SELECT with user JOIN)
   ↓
2. Review Payment Proof (File URL in Supabase Storage)
   ↓
3. Verify/Reject Payment (UPDATE payment_status)
   ↓
4. Update Order Status (pending → payment_received → processing → shipped → delivered)
   ↓
5. Upload EBM Document (File stored in Supabase Storage)
```

---

## 🗂️ Key Components

### Layout Components
- **Layout:** Main wrapper with Header, Footer, sidebar
- **Header:** Navigation, search, cart icon, auth menu
- **Footer:** Company info, links

### Product Components
- **ProductCard:** Displays product in grid with image, price, discount
- **ProductDetail:** Full product view with specs, video, images

### Checkout Components
- **PaymentProofUpload:** File input with preview
- **OrderSummary:** Items, totals, tax calculation
- **CheckoutForm:** Customer details form

### Admin Components
- **AdminLayout:** Admin sidebar navigation
- **AdminProductForm:** Product creation/editing
- **OrderActions:** Status update buttons
- **EBMDocumentUpload:** Document upload component

### UI Components (shadcn/ui)
- Button, Card, Input, Label
- Dialog, AlertDialog
- Select, Checkbox, Radio
- Tabs, Accordion
- Alerts, Toasts (via sonner)
- Form validation with Zod + react-hook-form

---

## 🎯 Storage Buckets

### Payment Proofs Bucket
- **Purpose:** Store customer payment evidence (images/PDFs)
- **Naming:** Payment proof file paths stored in orders.payment_proof

### EBM Documents Bucket
- **Purpose:** Store EBM (business) documents
- **Naming:** Document paths stored in orders.ebm_document

### Product Images Bucket
- **Purpose:** Store product images
- **Access:** Images array in products table contains URLs

---

## 🔄 Context Hooks

### useAuth()
```typescript
{
  user: User | null          // Current authenticated user
  session: Session | null    // Supabase session
  isAdmin: boolean           // True if user has admin role
  isLoading: boolean         // Loading state
  signIn()                   // Login function
  signUp()                   // Registration function
  signOut()                  // Logout function
}
```

### useCart()
```typescript
{
  items: CartItem[]          // Cart items with product details
  cartCount: number          // Total items in cart
  cartTotal: number          // Total price (with discount)
  isLoading: boolean         // Loading state
  addToCart()                // Add item or increase quantity
  updateQuantity()           // Change item quantity
  removeFromCart()           // Remove item
  clearCart()                // Empty entire cart
}
```

---

## 💰 Pricing Logic

### Product Pricing
```
Original Price = product.price (DECIMAL 12,2)
Discount % = product.discount_percent (0-100)
Discounted Price = price × (1 - discount_percent/100)
```

### Order Total Calculation
```
Subtotal = SUM(discounted_price × quantity for each item)
Tax = Subtotal × 0.18 (18% tax rate)
Total = Subtotal + Tax
```

---

## 📱 Responsive Design

- **Mobile-first approach** using Tailwind CSS
- **Grid breakpoints:**
  - sm: 640px
  - md: 768px
  - lg: 1024px
  - xl: 1280px
  
- **Key responsive elements:**
  - Navigation collapses on mobile
  - Product grid: 1 col (mobile) → 2 cols (sm) → 3 cols (lg)
  - Sidebar: Hidden on mobile, visible on lg
  - Forms stack vertically

---

## 🚀 Build & Deployment

### Development
```bash
npm i
npm run dev        # Starts Vite dev server on port 8080
```

### Production
```bash
npm run build      # Vite build output to dist/
npm run preview    # Preview production build
```

### Deployment
- Built for Vercel deployment
- Environment variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`
- Build command: `vite build`
- Output directory: `dist/`

---

## 🔗 External Dependencies

### UI & Styling (27+ @radix-ui packages)
- Button, Card, Input, Label, Dialog, Dropdown, Select, etc.
- Ensures accessible, consistent component library

### Forms & Validation
- `react-hook-form`: Form state management
- `@hookform/resolvers`: Form resolver integration
- `zod`: Schema validation

### Data & Queries
- `@tanstack/react-query`: Server state management
- `@supabase/supabase-js`: Supabase client SDK

### Utilities
- `lucide-react`: 400+ icons
- `date-fns`: Date manipulation
- `recharts`: Charts/graphs
- `clsx` + `tailwind-merge`: CSS utility helpers
- `sonner`: Toast notifications

### Special Features
- `input-otp`: OTP input component
- `react-day-picker`: Calendar picker
- `react-resizable-panels`: Resizable panel layouts
- `embla-carousel-react`: Product image carousels
- `next-themes`: Dark/light mode theming

---

## ⚠️ Important Notes

1. **Payment Processing:**
   - Currently uses manual payment proof verification
   - No automated payment gateway integration
   - Admins manually verify payment status

2. **EBM Documents:**
   - EBM = Electronic Business/Bill of Materials
   - Used for business documentation
   - Uploaded by admins during order fulfillment

3. **Image Management:**
   - Products support multiple images in array
   - Images stored in Supabase Storage buckets
   - Image URLs returned from database

4. **Tax Rate:**
   - Fixed at 18% for all orders
   - Applied uniformly regardless of location

5. **Cart Persistence:**
   - Stored in database, not localStorage
   - Syncs across devices for logged-in users
   - Empty on logout

6. **Order History:**
   - Users can only see their own orders
   - Admins can see all orders
   - Guest checkout not supported (requires account)

---

## 🎨 Styling System

- **Theme:** shadcn/ui default with Tailwind
- **Colors:** Primary, secondary, accent, destructive
- **Fonts:** Display font for headings, sans-serif for body
- **Animations:** Tailwind animations (fade, slide-up, etc.)
- **Dark Mode:** next-themes support (configured but may not be active)

---

## 📊 Analytics Features

- **Real-time dashboards** with recharts
- **Order trends:** Line chart showing orders and revenue over time
- **Revenue tracking:** Total revenue and breakdown by date
- **User growth:** Total users with percentage change
- **Product inventory:** Total products with stock levels

---

This project is a fully-featured e-commerce platform with enterprise-grade security, role-based access control, and comprehensive admin features for managing products, categories, orders, and users.
