import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Package, ShoppingCart, Users, TrendingUp, Eye, Calendar } from "lucide-react";
import { toast } from "sonner";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { FolderOpen } from "lucide-react";

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
}

interface OrderTrend {
  date: string;
  orders: number;
  revenue: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });
  const [trends, setTrends] = useState<OrderTrend[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch products count
      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select("id", { count: "exact" });

      // Fetch orders
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("id, total_amount, created_at")
        .order("created_at", { ascending: false })
        .limit(10);

      // Fetch users count
      const { data: usersData, error: usersError } = await supabase
        .from("profiles")
        .select("id", { count: "exact" });

      if (productsError) throw productsError;
      if (ordersError) throw ordersError;
      if (usersError) throw usersError;

      const totalRevenue = ordersData?.reduce((sum, order) => sum + (typeof order.total_amount === 'string' ? parseFloat(order.total_amount) : order.total_amount) || 0, 0) || 0;

      const trendMap: Record<string, { orders: number; revenue: number }> = {};
      ordersData?.forEach((order) => {
        const date = new Date(order.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
        if (!trendMap[date]) {
          trendMap[date] = { orders: 0, revenue: 0 };
        }
        trendMap[date].orders += 1;
        trendMap[date].revenue += (typeof order.total_amount === 'string' ? parseFloat(order.total_amount) : order.total_amount) || 0;
      });

      const trendData = Object.entries(trendMap)
        .map(([date, data]) => ({
          date,
          orders: data.orders,
          revenue: Math.round(data.revenue),
        }))
        .reverse();

      setStats({
        totalProducts: productsData?.length || 0,
        totalOrders: ordersData?.length || 0,
        totalUsers: usersData?.length || 0,
        totalRevenue,
      });

      setTrends(trendData);
      setRecentOrders(ordersData || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({
    icon: Icon,
    label,
    value,
    change,
  }: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    change?: string;
  }) => (
    <Card className="bg-slate-800 border-slate-700 p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-white mt-2">{value}</p>
          {change && <p className="text-green-400 text-xs mt-1 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> {change}</p>}
        </div>
        <div className="p-3 bg-primary/20 rounded-lg text-primary">{Icon}</div>
      </div>
    </Card>
  );

  return (
    <AdminLayout pageTitle="Dashboard">
      <div className="space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<Package className="w-6 h-6" />}
            label="Total Products"
            value={stats.totalProducts}
            change="+12% this month"
          />
          <StatCard
            icon={<ShoppingCart className="w-6 h-6" />}
            label="Total Orders"
            value={stats.totalOrders}
            change="+8% this month"
          />
          <StatCard
            icon={<Users className="w-6 h-6" />}
            label="Total Users"
            value={stats.totalUsers}
            change="+5% this month"
          />
          <StatCard
            icon={<TrendingUp className="w-6 h-6" />}
            label="Total Revenue"
            value={`RWF ${stats.totalRevenue.toLocaleString()}`}
            change="+15% this month"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Orders Trend */}
          <Card className="bg-slate-800 border-slate-700 p-6 lg:col-span-2">
            <h3 className="text-white font-semibold mb-4">Orders & Revenue Trend</h3>
            {trends.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }}
                    labelStyle={{ color: "#e2e8f0" }}
                  />
                  <Line type="monotone" dataKey="orders" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6" }} />
                  <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} dot={{ fill: "#10b981" }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-80 flex items-center justify-center text-slate-400">No data available</div>
            )}
          </Card>

          {/* Quick Stats */}
          <Card className="bg-slate-800 border-slate-700 p-6">
            <h3 className="text-white font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button className="w-full bg-primary hover:bg-primary/90" size="sm">
                <Package className="w-4 h-4 mr-2" />
                Add New Product
              </Button>
              <Button className="w-full bg-slate-700 hover:bg-slate-600" size="sm">
                <FolderOpen className="w-4 h-4 mr-2" />
                Manage Categories
              </Button>
              <Button className="w-full bg-slate-700 hover:bg-slate-600" size="sm">
                <ShoppingCart className="w-4 h-4 mr-2" />
                View All Orders
              </Button>
              <Button className="w-full bg-slate-700 hover:bg-slate-600" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                View Reports
              </Button>
            </div>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card className="bg-slate-800 border-slate-700 p-6">
          <h3 className="text-white font-semibold mb-4">Recent Orders</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Order ID</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Client</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Amount</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Date</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition">
                      <td className="py-3 px-4 text-white font-mono text-xs">{order.id.substring(0, 8)}...</td>
                      <td className="py-3 px-4 text-white">{order.client_name}</td>
                      <td className="py-3 px-4 text-white font-semibold">RWF {parseFloat(order.total_amount).toFixed(2)}</td>
                      <td className="py-3 px-4 text-slate-400">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.order_status === "delivered"
                            ? "bg-green-900/30 text-green-400"
                            : order.order_status === "shipped"
                            ? "bg-blue-900/30 text-blue-400"
                            : "bg-yellow-900/30 text-yellow-400"
                        }`}>
                          {order.order_status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      No orders yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
