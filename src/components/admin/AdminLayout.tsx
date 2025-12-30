import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  ShoppingCart,
  Users,
  BarChart3,
  Menu,
  X,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const sidebarItems = [
  { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { name: "Products", path: "/admin/products", icon: Package },
  { name: "Categories", path: "/admin/categories", icon: FolderOpen },
  { name: "Orders", path: "/admin/orders", icon: ShoppingCart },
  { name: "Users & Roles", path: "/admin/users", icon: Users },
  { name: "Analytics", path: "/admin/analytics", icon: BarChart3 },
];

interface AdminLayoutProps {
  children: React.ReactNode;
  pageTitle: string;
}

export function AdminLayout({ children, pageTitle }: AdminLayoutProps) {
  const [sidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    window.location.href = "/authadmin";
  };

  return (
    <div className="flex h-screen bg-slate-950">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col fixed h-full z-40 md:relative`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <span className="text-primary font-bold">BM</span>
            </div>
            {sidebarOpen && (
              <div>
                <p className="text-white font-bold text-sm">BuildMart</p>
                <p className="text-slate-400 text-xs">Admin Panel</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}>
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && <span className="text-sm font-medium">{item.name}</span>}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-800">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span>Logout</span>}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden ml-0 md:ml-0">
        {/* Top Bar */}
        <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setIsSidebarOpen(!sidebarOpen)}
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-white"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white">{pageTitle}</h1>
              <ChevronRight className="w-5 h-5 text-slate-600" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm text-slate-300">Admin User</p>
              <p className="text-xs text-slate-500">Logged in</p>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto bg-slate-950">
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
