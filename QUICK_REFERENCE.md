# ⚡ Admin Dashboard - Quick Reference

## 🚀 Get Started in 30 Seconds

### Access Points
```
User Login:     http://localhost:8080/auth
Admin Login:    http://localhost:8080/authadmin
Admin Panel:    http://localhost:8080/admin (after login)
```

### Default Test Credentials
To test admin access, you need an account with admin role in the database.

```sql
-- Assign admin role to a user (run in Supabase SQL Editor)
INSERT INTO user_roles (user_id, role) 
VALUES ('user-uuid-here', 'admin');
```

---

## 📋 Admin Dashboard Pages

| Page | URL | Purpose |
|------|-----|---------|
| Dashboard | `/admin` | Overview, stats, charts |
| Products | `/admin/products` | Manage product catalog |
| Categories | `/admin/categories` | Manage categories |
| Orders | `/admin/orders` | Track & update orders |
| Users | `/admin/users` | Manage user roles |
| Analytics | `/admin/analytics` | View reports & charts |

---

## 🎯 Common Tasks

### Add a Product
1. Go to `/admin/products`
2. Click "Add Product" button
3. Fill: Name, Slug, Price, Stock, Category
4. Click "Create Product"

### Create a Category
1. Go to `/admin/categories`
2. Click "Add Category"
3. Fill: Name, Slug, Color, Icon
4. Click "Create Category"

### Update Order Status
1. Go to `/admin/orders`
2. Click eye icon on any order
3. Change Payment/Order status
4. Click "Update Order"

### Make User an Admin
1. Go to `/admin/users`
2. Find user and click edit
3. Change role to "Admin"
4. Click "Update Role"

### View Analytics
1. Go to `/admin/analytics`
2. See all charts and metrics
3. Data updates in real-time

---

## 🔑 Key Features

✅ Real-time data sync with database
✅ Search & filter everywhere
✅ Color-coded status badges
✅ Interactive charts (Recharts)
✅ Responsive mobile-friendly design
✅ Dark modern professional theme
✅ One-click logout
✅ Collapsible sidebar

---

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **UI**: shadcn/ui + Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod

---

## 🔐 Security Notes

- Admin access requires user_roles entry with 'admin' role
- All admin routes protected by ProtectedAdminRoute component
- Supabase RLS policies enforce database-level security
- Session persists in localStorage
- Auto-logout on manual Supabase signOut

---

## 📊 Dashboard Widgets

### Stats Cards
- Total Products: Count of all products
- Total Orders: Count of all orders
- Total Users: Count of registered users
- Total Revenue: Sum of all order amounts

### Charts
- **Orders & Revenue Trend**: Monthly orders vs revenue
- **Products by Category**: Distribution pie chart
- **Payment Status**: Pending/Verified/Rejected breakdown

### Tables
- Recent Orders: Last 10 orders with status
- Products: Full inventory with actions
- Orders: Searchable order list
- Users: All users with role indicators

---

## 🎨 UI Elements

### Buttons
- **Primary** (Blue): Save, Create, Update
- **Danger** (Red): Delete
- **Secondary** (Slate): Cancel, Edit
- **Ghost**: Toggle, Icon-only

### Status Colors
- 🟢 Green: Delivered, Verified, In Stock
- 🔵 Blue: Shipped, Processing
- 🟡 Yellow: Pending
- 🔴 Red: Cancelled, Rejected, Out of Stock
- 🟣 Purple: Admin, Featured

### Icons
All pages use Lucide React icons:
- LayoutDashboard, Package, FolderOpen
- ShoppingCart, Users, BarChart3
- Plus, Edit2, Trash2, Eye, Search

---

## 🔄 Data Refresh

- Automatic refetch after CRUD operations
- Real-time toast notifications
- Manual refresh by navigating away/back
- Charts update from latest database queries

---

## 📱 Responsive Behavior

- **Desktop**: Full sidebar, multi-column layout
- **Tablet**: Collapsible sidebar, adjusted columns
- **Mobile**: Hidden sidebar with toggle, stacked layout
- **Touchscreen**: Larger click targets, optimized buttons

---

## ⚙️ Configuration

### Modify Admin Theme
Edit color in components:
```tsx
className="bg-primary hover:bg-primary/90"  // Change primary color
className="bg-slate-800 border-slate-700"   // Change background
```

### Add Sidebar Item
Edit `src/components/admin/AdminLayout.tsx`:
```tsx
const sidebarItems = [
  // Add new item here
  { name: "New Page", path: "/admin/new", icon: IconName }
];
```

### Change Admin Port
Edit `vite.config.ts`:
```ts
server: {
  port: 8080  // Change port here
}
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Can't login | Check credentials and user_roles table |
| Admin page blank | Check browser console, verify auth |
| Data not loading | Check Supabase connection, RLS policies |
| Buttons not working | Check browser console for errors |
| Charts not showing | Verify data exists in database |

---

## 📚 File Locations

```
/src/
  /pages/
    AdminAuth.tsx              ← Admin login
    /admin/
      Dashboard.tsx            ← Dashboard
      Products.tsx             ← Products
      Categories.tsx           ← Categories
      Orders.tsx               ← Orders
      Users.tsx                ← Users
      Analytics.tsx            ← Analytics
  
  /components/admin/
    AdminLayout.tsx            ← Main layout
    ProtectedAdminRoute.tsx    ← Route protection

/ADMIN_DASHBOARD_GUIDE.md      ← Full guide
/IMPLEMENTATION_SUMMARY.md     ← Complete summary
```

---

## ✅ Verification Checklist

- [ ] Admin login works at `/authadmin`
- [ ] Dashboard loads with real data
- [ ] Can create/edit/delete products
- [ ] Can create/edit/delete categories
- [ ] Can view and update order status
- [ ] Can change user roles
- [ ] Analytics charts display
- [ ] All forms validate input
- [ ] Search/filter works
- [ ] Mobile responsive

---

## 🚀 You're Ready!

Everything is set up and ready to use. Start by:
1. Going to `http://localhost:8080/authadmin`
2. Login with admin credentials
3. Explore the dashboard
4. Try managing products, categories, and orders

**Happy administrating! 🎉**
