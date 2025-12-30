import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import { CheckCircle, Loader2, ArrowLeft, Mail, Phone, MapPin, Calendar } from "lucide-react";
import { format } from "date-fns";

interface OrderData {
  id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  client_address: string;
  total_amount: number;
  payment_status: string;
  order_status: string;
  created_at: string;
  notes: string | null;
  order_items: Array<{
    id: string;
    product_name: string;
    quantity: number;
    unit_price: number;
  }>;
}

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from("orders")
          .select(`
            *,
            order_items(*)
          `)
          .eq("id", orderId)
          .maybeSingle();

        if (fetchError) throw fetchError;
        if (!data) {
          setError("Order not found");
          return;
        }

        setOrder(data as unknown as OrderData);
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Failed to load order details");
        toast.error("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (loading) {
    return (
      <Layout>
        <div className="container py-12 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading order confirmation...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !order) {
    return (
      <Layout>
        <div className="container py-12">
          <Card className="p-12 text-center">
            <p className="text-lg text-red-600 mb-6">{error || "Order not found"}</p>
            <Link to="/products">
              <Button>Continue Shopping</Button>
            </Link>
          </Card>
        </div>
      </Layout>
    );
  }

  const subtotal = order.order_items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
  const tax = subtotal * 0.18;

  const getStatusBadgeColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      payment_received: "bg-blue-100 text-blue-800",
      processing: "bg-purple-100 text-purple-800",
      shipped: "bg-cyan-100 text-cyan-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getPaymentStatusBadgeColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      verified: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <Layout>
      <div className="container py-12">
        <Link to="/products" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-4 w-4" /> Continue Shopping
        </Link>

        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-lg text-muted-foreground">
            Thank you for your order. We'll contact you shortly to confirm payment details.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Number */}
            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Order Number</p>
              <p className="font-mono text-lg font-bold">{order.id.substring(0, 12).toUpperCase()}</p>
            </Card>

            {/* Customer Information */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-6">Delivery Information</h2>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{order.client_email}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{order.client_phone}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Delivery Address</p>
                    <p className="font-medium">{order.client_address}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Order Date</p>
                    <p className="font-medium">
                      {format(new Date(order.created_at), "MMMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                </div>

                {order.notes && (
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground mb-2">Special Instructions</p>
                    <p className="text-sm bg-secondary/50 p-3 rounded italic">{order.notes}</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Items Ordered */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-6">Items Ordered</h2>

              <div className="space-y-4">
                {order.order_items.map(item => (
                  <div key={item.id} className="flex justify-between items-center pb-4 border-b last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium">{item.product_name}</p>
                      <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatPrice(item.unit_price * item.quantity)}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatPrice(item.unit_price)} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            {/* Order Status */}
            <Card className="p-6 mb-6">
              <h2 className="text-lg font-bold mb-4">Order Status</h2>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">
                    Order Status
                  </p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(order.order_status)}`}>
                    {order.order_status.replace(/_/g, " ").charAt(0).toUpperCase() +
                      order.order_status.slice(1).replace(/_/g, " ")}
                  </span>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">
                    Payment Status
                  </p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusBadgeColor(order.payment_status)}`}>
                    {order.payment_status.replace(/_/g, " ").charAt(0).toUpperCase() +
                      order.payment_status.slice(1).replace(/_/g, " ")}
                  </span>
                </div>
              </div>
            </Card>

            {/* Order Total */}
            <Card className="p-6">
              <h2 className="text-lg font-bold mb-4">Order Total</h2>

              <div className="space-y-2 mb-4 pb-4 border-b">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (18%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold mb-6">
                <span>Total</span>
                <span className="text-primary">{formatPrice(order.total_amount)}</span>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-900">
                  <span className="font-semibold">Next Step:</span> Our team will contact you at{" "}
                  <span className="font-medium">{order.client_phone}</span> to arrange payment.
                </p>
              </div>

              <Link to="/products" className="w-full">
                <Button className="w-full">Continue Shopping</Button>
              </Link>
            </Card>
          </div>
        </div>

        {/* Help Section */}
        <Card className="mt-12 p-8 bg-secondary/50">
          <h2 className="text-xl font-bold mb-4">Need Help?</h2>
          <p className="text-muted-foreground mb-4">
            If you have any questions about your order, please contact us directly:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">+250 XXX XXX XXX</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">support@buildmart.rw</p>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
