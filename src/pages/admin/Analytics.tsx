import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Users, ShoppingCart, DollarSign } from "lucide-react";

interface CategoryStats {
  name: string;
  count: number;
}

interface MonthlyStats {
  month: string;
  orders: number;
  revenue: number;
}

interface PaymentStats {
  status: string;
  count: number;
}

export default function AdminAnalytics() {
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats[]>([]);
  const [paymentStats, setPaymentStats] = useState<PaymentStats[]>([]);
  const [loading, setLoading] = useState(true);

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);

      // Fetch category stats
      const { data: products, error: productsError } = await supabase
        .from("products")
        .select("categories(name)")
        .order("categories(name)");

      if (productsError) throw productsError;

      // Count products by category
      const categoryCount: Record<string, number> = {};
      products?.forEach((p: any) => {
        const categoryName = p.categories?.name || "Uncategorized";
        categoryCount[categoryName] = (categoryCount[categoryName] || 0) + 1;
      });

      const categoryStatsData = Object.entries(categoryCount).map(([name, count]) => ({
        name,
        count: count as number,
      }));
      setCategoryStats(categoryStatsData);

      // Fetch monthly stats
      const { data: orders, error: ordersError } = await supabase
        .from("orders")
        .select("created_at, total_amount");

      if (ordersError) throw ordersError;

      // Group orders by month
      const monthlyData: Record<string, { orders: number; revenue: number }> = {};
      orders?.forEach((order: any) => {
        const date = new Date(order.created_at);
        const monthKey = date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { orders: 0, revenue: 0 };
        }
        monthlyData[monthKey].orders += 1;
        monthlyData[monthKey].revenue += parseFloat(order.total_amount) || 0;
      });

      const monthlyStatsData = Object.entries(monthlyData)
        .map(([month, data]) => ({
          month,
          orders: data.orders,
          revenue: Math.round(data.revenue),
        }))
        .sort((a, b) => {
          const dateA = new Date(a.month);
          const dateB = new Date(b.month);
          return dateA.getTime() - dateB.getTime();
        });

      setMonthlyStats(monthlyStatsData);

      // Fetch payment stats
      const { data: allOrders, error: allOrdersError } = await supabase
        .from("orders")
        .select("payment_status");

      if (allOrdersError) throw allOrdersError;

      const paymentCount: Record<string, number> = {
        pending: 0,
        verified: 0,
        rejected: 0,
      };

      allOrders?.forEach((order: any) => {
        paymentCount[order.payment_status] = (paymentCount[order.payment_status] || 0) + 1;
      });

      const paymentStatsData = Object.entries(paymentCount)
        .map(([status, count]) => ({
          status: status.charAt(0).toUpperCase() + status.slice(1),
          count: count as number,
        }))
        .filter((item) => item.count > 0);

      setPaymentStats(paymentStatsData);
    } catch (error) {
      toast.error("Failed to load analytics data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({
    icon: Icon,
    label,
    value,
  }: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
  }) => (
    <Card className="bg-white border-gray-200 p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className="p-3 bg-blue-100 rounded-lg text-blue-600">{Icon}</div>
      </div>
    </Card>
  );

  return (
    <AdminLayout pageTitle="Analytics & Reports">
      <div className="space-y-8">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<TrendingUp className="w-6 h-6" />}
            label="Total Orders"
            value={monthlyStats.reduce((sum, m) => sum + m.orders, 0)}
          />
          <StatCard
            icon={<DollarSign className="w-6 h-6" />}
            label="Total Revenue"
            value={`RWF ${monthlyStats
              .reduce((sum, m) => sum + m.revenue, 0)
              .toLocaleString()}`}
          />
          <StatCard
            icon={<ShoppingCart className="w-6 h-4" />}
            label="Total Products"
            value={categoryStats.reduce((sum, c) => sum + c.count, 0)}
          />
          <StatCard
            icon={<Users className="w-6 h-6" />}
            label="Total Categories"
            value={categoryStats.length}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Orders & Revenue */}
          <Card className="bg-white border-gray-200 p-6 lg:col-span-2 shadow-sm">
            <h3 className="text-gray-900 font-semibold mb-4">Monthly Orders & Revenue</h3>
            {monthlyStats.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }}
                    labelStyle={{ color: "#e2e8f0" }}
                  />
                  <Legend />
                  <Bar dataKey="orders" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="revenue" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-500">
                No data available
              </div>
            )}
          </Card>

          {/* Products by Category */}
          <Card className="bg-white border-gray-200 p-6 shadow-sm">
            <h3 className="text-gray-900 font-semibold mb-4">Products by Category</h3>
            {categoryStats.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryStats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.count}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {categoryStats.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb" }}
                    labelStyle={{ color: "#111827" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-500">
                No data available
              </div>
            )}
          </Card>

          {/* Payment Status Distribution */}
          <Card className="bg-white border-gray-200 p-6 shadow-sm">
            <h3 className="text-gray-900 font-semibold mb-4">Payment Status</h3>
            {paymentStats.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={paymentStats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.status}: ${entry.count}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {paymentStats.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb" }}
                    labelStyle={{ color: "#111827" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-500">
                No data available
              </div>
            )}
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
