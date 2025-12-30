import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Package, Calendar, DollarSign, MapPin } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
}

interface Order {
  id: string;
  client_name: string;
  client_email: string;
  client_address: string;
  total_amount: number;
  order_status: string;
  payment_status: string;
  payment_proof: string;
  created_at: string;
  updated_at: string;
  order_items: OrderItem[];
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const paymentStatusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  verified: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

export default function MyOrders() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [selectedPaymentProof, setSelectedPaymentProof] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }

    if (user) {
      fetchOrders();
    }
  }, [user, authLoading, navigate]);

  const fetchOrders = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("orders")
        .select(
          `
          id,
          client_name,
          client_email,
          client_address,
          total_amount,
          order_status,
          payment_status,
          payment_proof,
          created_at,
          updated_at,
          order_items (
            id,
            product_name,
            quantity,
            unit_price
          )
        `
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setOrders(data as unknown as Order[]);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="container py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-4 text-muted-foreground">Loading your orders...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="container py-12">
          <div className="text-center">
            <p className="text-muted-foreground">Please log in to view your orders</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display text-4xl font-bold mb-2">My Orders</h1>
            <p className="text-muted-foreground">View and track your orders</p>
          </div>

          {/* Orders List */}
          {orders.length === 0 ? (
            <Card className="p-12 text-center">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
              <p className="text-muted-foreground mb-6">
                You haven't placed any orders. Start shopping now!
              </p>
              <Button onClick={() => navigate("/products")}>
                Continue Shopping
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card
                  key={order.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Order Summary */}
                  <div
                    className="p-6 cursor-pointer hover:bg-secondary/50 transition-colors"
                    onClick={() =>
                      setExpandedOrderId(
                        expandedOrderId === order.id ? null : order.id
                      )
                    }
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-mono text-sm text-muted-foreground">
                            Order #{order.id.slice(0, 8)}
                          </span>
                          <Badge className={paymentStatusColors[order.payment_status]}>
                            {order.payment_status === "verified"
                              ? "✓ Payment Verified"
                              : order.payment_status === "pending"
                              ? "⏳ Awaiting Verification"
                              : "✗ Payment Rejected"}
                          </Badge>
                          <Badge className={statusColors[order.order_status]}>
                            {order.order_status.charAt(0).toUpperCase() +
                              order.order_status.slice(1)}
                          </Badge>
                        </div>

                        <p className="text-sm text-muted-foreground mb-2">
                          <Calendar className="inline h-4 w-4 mr-1" />
                          {new Date(order.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>

                        <p className="text-sm line-clamp-1">
                          <MapPin className="inline h-4 w-4 mr-1" />
                          {order.client_address}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-bold flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {formatPrice(
                            typeof order.total_amount === "string"
                              ? parseFloat(order.total_amount)
                              : order.total_amount
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {order.order_items.length} items
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedOrderId === order.id && (
                    <div className="border-t px-6 py-4 bg-secondary/30 space-y-4">
                      {/* Payment Proof Section */}
                      {order.payment_proof && (
                        <div>
                          <h4 className="font-semibold mb-2 text-sm">Payment Proof</h4>
                          <button
                            onClick={() =>
                              setSelectedPaymentProof(
                                selectedPaymentProof === order.id ? null : order.id
                              )
                            }
                            className="text-primary hover:underline text-sm"
                          >
                            {selectedPaymentProof === order.id ? "Hide" : "View"} Payment
                            Proof
                          </button>
                          {selectedPaymentProof === order.id && (
                            <div className="mt-3 relative bg-background rounded border p-2">
                              <img
                                src={order.payment_proof}
                                alt="Payment proof"
                                className="w-full max-h-96 object-contain rounded"
                              />
                            </div>
                          )}
                        </div>
                      )}

                      {/* Order Items */}
                      <div>
                        <h4 className="font-semibold mb-3 text-sm">Order Items</h4>
                        <div className="bg-background rounded space-y-2">
                          {order.order_items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between p-3 border-b last:border-b-0"
                            >
                              <div>
                                <p className="font-medium text-sm">
                                  {item.product_name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Qty: {item.quantity}
                                </p>
                              </div>
                              <p className="font-semibold text-sm">
                                {formatPrice(
                                  typeof item.unit_price === "string"
                                    ? parseFloat(item.unit_price)
                                    : item.unit_price
                                )}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Order Status Timeline */}
                      <div>
                        <h4 className="font-semibold mb-3 text-sm">Order Status</h4>
                        <div className="bg-background rounded p-3">
                          <div className="text-sm space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                              <span>Order Placed</span>
                              <span className="ml-auto text-xs text-muted-foreground">
                                {new Date(order.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            <div
                              className={`flex items-center gap-2 ${
                                order.payment_status === "verified"
                                  ? "opacity-100"
                                  : "opacity-50"
                              }`}
                            >
                              <span
                                className={`inline-block w-2 h-2 rounded-full ${
                                  order.payment_status === "verified"
                                    ? "bg-green-500"
                                    : "bg-gray-300"
                                }`}
                              ></span>
                              <span>Payment Verified</span>
                              {order.payment_status === "rejected" && (
                                <span className="ml-auto text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                                  Rejected - Contact support
                                </span>
                              )}
                            </div>
                            <div
                              className={`flex items-center gap-2 ${
                                order.order_status === "processing" ||
                                order.order_status === "shipped" ||
                                order.order_status === "delivered"
                                  ? "opacity-100"
                                  : "opacity-50"
                              }`}
                            >
                              <span
                                className={`inline-block w-2 h-2 rounded-full ${
                                  order.order_status === "processing" ||
                                  order.order_status === "shipped" ||
                                  order.order_status === "delivered"
                                    ? "bg-green-500"
                                    : "bg-gray-300"
                                }`}
                              ></span>
                              <span>Processing</span>
                            </div>
                            <div
                              className={`flex items-center gap-2 ${
                                order.order_status === "shipped" ||
                                order.order_status === "delivered"
                                  ? "opacity-100"
                                  : "opacity-50"
                              }`}
                            >
                              <span
                                className={`inline-block w-2 h-2 rounded-full ${
                                  order.order_status === "shipped" ||
                                  order.order_status === "delivered"
                                    ? "bg-green-500"
                                    : "bg-gray-300"
                                }`}
                              ></span>
                              <span>Shipped</span>
                            </div>
                            <div
                              className={`flex items-center gap-2 ${
                                order.order_status === "delivered"
                                  ? "opacity-100"
                                  : "opacity-50"
                              }`}
                            >
                              <span
                                className={`inline-block w-2 h-2 rounded-full ${
                                  order.order_status === "delivered"
                                    ? "bg-green-500"
                                    : "bg-gray-300"
                                }`}
                              ></span>
                              <span>Delivered</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Delivery Address */}
                      <div>
                        <h4 className="font-semibold mb-2 text-sm">Delivery Address</h4>
                        <div className="bg-background rounded p-3 text-sm">
                          <p className="font-medium">{order.client_name}</p>
                          <p className="text-muted-foreground">{order.client_address}</p>
                          <p className="text-muted-foreground">{order.client_email}</p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      {order.payment_status === "rejected" && (
                        <Alert className="border-red-200 bg-red-50">
                          <AlertCircle className="h-4 w-4 text-red-600" />
                          <AlertDescription className="text-red-800">
                            Your payment proof was rejected. Please contact support with a new
                            payment proof.
                          </AlertDescription>
                        </Alert>
                      )}

                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => navigate("/products")}
                      >
                        Continue Shopping
                      </Button>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
