# 🚀 BuildMart - Developer Quick Reference

## Table of Contents
1. [File Structure Reference](#file-structure-reference)
2. [Common Tasks & How-To](#common-tasks--how-to)
3. [Code Patterns & Best Practices](#code-patterns--best-practices)
4. [Debugging Guide](#debugging-guide)
5. [API Patterns](#api-patterns)
6. [Component Patterns](#component-patterns)

---

## File Structure Reference

### Quick Navigation

```
📁 Project Root
├── 📄 README.md                    ← Project info & setup
├── 📄 PROJECT_DEEP_DIVE.md        ← Full documentation ✨ [YOU ARE HERE]
├── 📄 ARCHITECTURE_DIAGRAMS.md    ← Visual diagrams
├── 📄 COMPLETION_SUMMARY.md       ← Project completion status
├── 📄 ADMIN_DASHBOARD_GUIDE.md    ← Admin features guide
├── 📄 package.json                ← Dependencies & scripts
├── 📄 vite.config.ts              ← Vite bundler config
├── 📄 tailwind.config.ts          ← Tailwind theming
├── 📄 tsconfig.json               ← TypeScript config
├── 📄 eslint.config.js            ← Code linting rules
│
├── 📁 src/
│   ├── 📄 main.tsx               ← Entry point
│   ├── 📄 App.tsx                ← Main router & providers
│   ├── 📄 index.css              ← Global styles
│   ├── 📄 vite-env.d.ts          ← Vite type definitions
│   │
│   ├── 📁 pages/                 ← Page components
│   │   ├── 📄 Index.tsx          ← Home page (/)
│   │   ├── 📄 Products.tsx       ← Products listing
│   │   ├── 📄 ProductDetail.tsx  ← Single product page
│   │   ├── 📄 Auth.tsx           ← Customer login/signup
│   │   ├── 📄 AdminAuth.tsx      ← Admin login
│   │   ├── 📄 NotFound.tsx       ← 404 page
│   │   └── 📁 admin/             ← Admin pages
│   │       ├── 📄 Dashboard.tsx
│   │       ├── 📄 Products.tsx
│   │       ├── 📄 Categories.tsx
│   │       ├── 📄 Orders.tsx
│   │       ├── 📄 Users.tsx
│   │       └── 📄 Analytics.tsx
│   │
│   ├── 📁 components/            ← Reusable components
│   │   ├── 📄 NavLink.tsx        ← Navigation helper
│   │   ├── 📁 layout/            ← Layout components
│   │   │   ├── 📄 Layout.tsx     ← Customer layout
│   │   │   ├── 📄 Header.tsx     ← Navigation bar
│   │   │   └── 📄 Footer.tsx     ← Footer
│   │   ├── 📁 admin/             ← Admin components
│   │   │   ├── 📄 AdminLayout.tsx
│   │   │   └── 📄 ProtectedAdminRoute.tsx
│   │   ├── 📁 products/          ← Product components
│   │   │   └── 📄 ProductCard.tsx
│   │   └── 📁 ui/                ← shadcn/ui components (30+)
│   │       ├── 📄 button.tsx
│   │       ├── 📄 input.tsx
│   │       ├── 📄 dialog.tsx
│   │       ├── 📄 table.tsx
│   │       ├── 📄 card.tsx
│   │       └── ... (30+ more UI components)
│   │
│   ├── 📁 hooks/                 ← Custom React hooks
│   │   ├── 📄 useAuth.tsx        ← Authentication
│   │   ├── 📄 useCart.tsx        ← Shopping cart
│   │   ├── 📄 use-mobile.tsx     ← Mobile detection
│   │   └── 📄 use-toast.ts       ← Notifications
│   │
│   ├── 📁 integrations/          ← External integrations
│   │   └── 📁 supabase/
│   │       ├── 📄 client.ts      ← Supabase client
│   │       └── 📄 types.ts       ← Generated types
│   │
│   └── 📁 lib/                   ← Utility functions
│       └── 📄 utils.ts           ← formatPrice(), cn()
│
├── 📁 supabase/                  ← Database config
│   ├── 📄 config.toml            ← Supabase settings
│   └── 📁 migrations/
│       └── 📄 20251229*.sql      ← Database schema
│
└── 📁 public/                    ← Static assets
    └── 📄 robots.txt

```

---

## Common Tasks & How-To

### Task: Add a New Product Page Section

**Goal**: Add a new tab to product detail page

**Steps**:
1. Open `src/pages/ProductDetail.tsx`
2. Find the `<Tabs>` component around line 90
3. Add new tab:
   ```tsx
   <TabsTrigger value="reviews">Reviews</TabsTrigger>
   
   <TabsContent value="reviews" className="mt-6">
     {/* Add your content here */}
     <p>Customer reviews would go here</p>
   </TabsContent>
   ```
4. Save and test in browser

**Files Modified**: 
- [ProductDetail.tsx](src/pages/ProductDetail.tsx)

---

### Task: Create a New Admin Page

**Goal**: Add a new admin section (e.g., Reviews Management)

**Steps**:

1. **Create the page file**:
   ```bash
   # Create: src/pages/admin/Reviews.tsx
   ```

2. **Add basic structure**:
   ```tsx
   import { AdminLayout } from "@/components/admin/AdminLayout";
   import { Card } from "@/components/ui/card";
   import { supabase } from "@/integrations/supabase/client";
   
   export default function AdminReviews() {
     return (
       <AdminLayout pageTitle="Reviews">
         <Card className="p-6">
           <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
           {/* Your content here */}
         </Card>
       </AdminLayout>
     );
   }
   ```

3. **Add route in App.tsx**:
   ```tsx
   <Route
     path="/admin/reviews"
     element={
       <ProtectedAdminRoute>
         <AdminReviews />
       </ProtectedAdminRoute>
     }
   />
   ```

4. **Add navigation in AdminLayout.tsx**:
   ```tsx
   const sidebarItems = [
     // ... existing items
     { name: "Reviews", path: "/admin/reviews", icon: MessageSquare },
   ];
   ```

5. **Create database table** (if needed):
   - Use Supabase dashboard
   - Run migration with new table schema

6. **Test**: Navigate to `/admin/reviews`

---

### Task: Add Search/Filter to a Table

**Goal**: Filter products by name in admin panel

**Implementation**:
```tsx
// Already implemented in AdminProducts.tsx (lines 52-60)

const [search, setSearch] = useState("");

// Add search input
<Input 
  placeholder="Search products..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>

// Filter in JSX
const filteredProducts = products.filter(p =>
  p.name.toLowerCase().includes(search.toLowerCase())
);

{filteredProducts.map(product => (
  <TableRow key={product.id}>
    {/* render row */}
  </TableRow>
))}
```

**Files to Reference**:
- [AdminProducts.tsx](src/pages/admin/Products.tsx#L52-L60)
- [Products.tsx](src/pages/Products.tsx#L50-L55)

---

### Task: Display Data from Supabase

**Goal**: Fetch and display orders on admin page

**Pattern**:
```tsx
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*, order_items(*), profiles(*)")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {orders.map(order => (
        <div key={order.id}>{order.id} - {order.total_amount}</div>
      ))}
    </div>
  );
}
```

**Key Points**:
- Use `supabase.from("table_name")`
- Chain `.select()` to specify columns
- Use `.*` for all columns
- Join related tables with `table_name(*)`
- Always have loading & error states
- `.order()` for sorting
- `.limit()` for pagination

---

### Task: Update a Record in Database

**Goal**: Update product stock in admin panel

**Pattern**:
```tsx
const handleUpdateStock = async (productId: string, newStock: number) => {
  try {
    const { error } = await supabase
      .from("products")
      .update({ stock: newStock })
      .eq("id", productId);

    if (error) throw error;
    
    toast.success("Stock updated!");
    fetchProducts(); // Refresh list
  } catch (error) {
    toast.error("Failed to update stock");
    console.error(error);
  }
};
```

**Key Points**:
- `.update({})` with new values
- `.eq("column", value)` for WHERE clause
- Always handle errors
- Show feedback with toast
- Refresh data after success

---

### Task: Add a Dialog Form

**Goal**: Create form to add new category

**Pattern**:
```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminCategories() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from("categories")
        .insert({ name, slug: name.toLowerCase().replace(/\s/g, "-") });

      if (error) throw error;
      
      toast.success("Category created!");
      setIsOpen(false);
      setName("");
      fetchCategories(); // Refresh
    } catch (error) {
      toast.error("Failed to create category");
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Add Category</Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Category</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <Input 
              placeholder="Category name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
```

---

### Task: Check if User is Authenticated

**Pattern**:
```tsx
import { useAuth } from "@/hooks/useAuth";

export default function MyComponent() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner />;
  
  if (!user) {
    return <Redirect to="/auth" />;
  }

  return <div>Welcome, {user.email}!</div>;
}
```

---

### Task: Use Shopping Cart

**Pattern**:
```tsx
import { useCart } from "@/hooks/useCart";

export default function ProductCard() {
  const { addToCart, removeFromCart, cartCount } = useCart();

  return (
    <div>
      <p>Cart items: {cartCount}</p>
      <button onClick={() => addToCart(productId, 1)}>
        Add to Cart
      </button>
      <button onClick={() => removeFromCart(productId)}>
        Remove
      </button>
    </div>
  );
}
```

---

## Code Patterns & Best Practices

### Pattern: Data Fetching

**✅ Good**:
```tsx
useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*");
      
      if (error) throw error;
      setProducts(data);
    } catch (error) {
      toast.error("Failed to load");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);
```

**❌ Bad**:
```tsx
// No error handling, no loading state
useEffect(() => {
  supabase.from("products").select("*")
    .then(res => setProducts(res.data));
}, []);
```

---

### Pattern: Form Submission

**✅ Good**:
```tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Validate
  if (!name.trim()) {
    toast.error("Name is required");
    return;
  }

  setLoading(true);
  try {
    const { error } = await supabase
      .from("products")
      .insert({ name, price });
    
    if (error) throw error;
    toast.success("Product created!");
    resetForm();
  } catch (error) {
    toast.error("Failed to create product");
  } finally {
    setLoading(false);
  }
};
```

---

### Pattern: Conditional Rendering

**✅ Good - Multiple States**:
```tsx
if (loading) return <LoadingSpinner />;
if (error) return <ErrorMessage message={error} />;
if (!data?.length) return <EmptyState />;

return <DataTable data={data} />;
```

**❌ Bad - Boolean Hell**:
```tsx
return (
  <div>
    {loading ? (
      <Spinner />
    ) : error ? (
      <Error />
    ) : (
      <div>
        {data && data.length > 0 ? (
          <Table data={data} />
        ) : (
          <Empty />
        )}
      </div>
    )}
  </div>
);
```

---

### Pattern: Styling Components

**✅ Use className with Tailwind**:
```tsx
<div className="
  flex 
  items-center 
  justify-between 
  p-4 
  rounded-lg 
  bg-slate-900 
  hover:bg-slate-800
  transition-colors
">
  Content
</div>
```

**Use cn() for conditional classes**:
```tsx
import { cn } from "@/lib/utils";

<button className={cn(
  "px-4 py-2 rounded",
  isActive ? "bg-primary text-white" : "bg-secondary"
)}>
  Button
</button>
```

---

### Pattern: Type Safety

**✅ Define interfaces**:
```tsx
interface Product {
  id: string;
  name: string;
  price: number;
  category_id: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  // Component code
}
```

---

## Debugging Guide

### Issue: Page shows "Not found"

**Causes**:
1. Wrong URL path
2. Route not defined in App.tsx
3. Typo in route path

**Solution**:
```tsx
// Check App.tsx for the route
// Should have exact path or parameter definition
<Route path="/products/:slug" element={<ProductDetail />} />
```

---

### Issue: Data not loading from Supabase

**Checklist**:
```tsx
// 1. Check environment variables
console.log(import.meta.env.VITE_SUPABASE_URL)

// 2. Verify Supabase client initialization
import { supabase } from "@/integrations/supabase/client"
console.log(supabase) // Should not be undefined

// 3. Check database table exists
// Go to Supabase dashboard → SQL Editor

// 4. Verify row level security policies
// Supabase dashboard → Authentication → Policies

// 5. Check query syntax
const { data, error } = await supabase
  .from("products")
  .select("*");
console.log(error); // Log any errors
```

---

### Issue: Authentication not working

**Debug**:
```tsx
import { useAuth } from "@/hooks/useAuth";

export default function Debug() {
  const { user, isLoading, isAdmin } = useAuth();

  return (
    <div>
      <p>Loading: {isLoading}</p>
      <p>User: {user?.email}</p>
      <p>Admin: {isAdmin}</p>
    </div>
  );
}
```

---

### Issue: Types missing for Supabase

**Solution**:
```bash
# Regenerate types from Supabase
# 1. Install Supabase CLI
npm install -g supabase

# 2. Generate types
supabase gen types typescript --project-id your-project-id > src/integrations/supabase/types.ts

# 3. Update client.ts to import
import type { Database } from './types'
```

---

## API Patterns

### Reading Data

```tsx
// Single table
const { data } = await supabase
  .from("products")
  .select("*")

// Multiple columns
const { data } = await supabase
  .from("products")
  .select("id, name, price")

// With conditions
const { data } = await supabase
  .from("products")
  .select("*")
  .eq("category_id", categoryId)

// With joins
const { data } = await supabase
  .from("products")
  .select("*, categories(name)")

// With ordering
const { data } = await supabase
  .from("products")
  .select("*")
  .order("created_at", { ascending: false })

// With limit
const { data } = await supabase
  .from("products")
  .select("*")
  .limit(10)

// With offset (pagination)
const { data } = await supabase
  .from("products")
  .select("*")
  .range(0, 9) // Items 0-9
```

---

### Creating Data

```tsx
// Single insert
const { error } = await supabase
  .from("products")
  .insert({
    name: "Product",
    price: 100,
    category_id: "cat-123"
  })

// Multiple inserts
const { error } = await supabase
  .from("products")
  .insert([
    { name: "Product 1", price: 100 },
    { name: "Product 2", price: 200 }
  ])

// Insert with return
const { data, error } = await supabase
  .from("products")
  .insert({ name: "Product" })
  .select()
```

---

### Updating Data

```tsx
// Update by ID
const { error } = await supabase
  .from("products")
  .update({ name: "New Name" })
  .eq("id", productId)

// Update with condition
const { error } = await supabase
  .from("products")
  .update({ stock: 0 })
  .lt("stock", 5) // Less than 5

// Update with return
const { data, error } = await supabase
  .from("products")
  .update({ price: 150 })
  .eq("id", productId)
  .select()
```

---

### Deleting Data

```tsx
// Delete by ID
const { error } = await supabase
  .from("products")
  .delete()
  .eq("id", productId)

// Delete with condition
const { error } = await supabase
  .from("products")
  .delete()
  .eq("category_id", categoryId)
```

---

## Component Patterns

### Simple Data Display Component

```tsx
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface Item {
  id: string;
  name: string;
}

export function ItemList() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const { data, error } = await supabase
          .from("items")
          .select("*");
        
        if (error) throw error;
        setItems(data);
      } catch (error) {
        toast.error("Failed to load items");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Items</h2>
      <div className="space-y-2">
        {items.map(item => (
          <div key={item.id} className="p-3 bg-secondary rounded">
            {item.name}
          </div>
        ))}
      </div>
    </Card>
  );
}
```

---

### Form Component with Validation

```tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function CreateProductForm() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!price || parseFloat(price) <= 0) {
      toast.error("Price must be greater than 0");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("products")
        .insert({
          name,
          price: parseFloat(price)
        });

      if (error) throw error;

      toast.success("Product created!");
      setName("");
      setPrice("");
    } catch (error) {
      toast.error("Failed to create product");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Product Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
        />
      </div>

      <div>
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          disabled={loading}
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Product"}
      </Button>
    </form>
  );
}
```

---

This quick reference should help you navigate the codebase and complete common development tasks! 🚀

