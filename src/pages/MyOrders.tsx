import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { formatPrice } from "@/lib/utils";
import { Eye, Package, Download, AlertCircle } from "lucide-react";
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
  ebm_document: string | null;
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
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [viewType, setViewType] = useState<"payment_proof" | "ebm_document" | null>(
    null
  );

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
          ebm_document,
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
        <div className="w-full">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display text-4xl font-bold mb-2">My Orders</h1>
            <p className="text-muted-foreground">View and track your orders</p>
          </div>

          {/* Orders Table */}
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
            <Card className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Order ID</TableHead>
                    <TableHead className="font-semibold">Date</TableHead>
                    <TableHead className="font-semibold">Items & Qty</TableHead>
                    <TableHead className="font-semibold">Delivery Venue</TableHead>
                    <TableHead className="font-semibold">Payment Proof</TableHead>
                    <TableHead className="font-semibold">Payment Status</TableHead>
                    <TableHead className="font-semibold">EBM Document</TableHead>
                    <TableHead className="font-semibold">Order Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow
                      key={order.id}
                      className="hover:bg-secondary/50 transition-colors"
                    >
                      {/* Order ID */}
                      <TableCell className="font-mono text-sm text-primary">
                        #{order.id.slice(0, 8)}
                      </TableCell>

                      {/* Date */}
                      <TableCell className="text-sm">
                        {new Date(order.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </TableCell>

                      {/* Items & Quantity */}
                      <TableCell className="text-sm">
                        <div className="space-y-1">
                          {order.order_items.map((item) => (
                            <div key={item.id} className="text-xs">
                              <p className="font-medium">{item.product_name}</p>
                              <p className="text-muted-foreground">Qty: {item.quantity}</p>
                            </div>
                          ))}
                        </div>
                      </TableCell>

                      {/* Delivery Venue */}
                      <TableCell className="text-sm max-w-xs">
                        <div>
                          <p className="font-medium text-xs">{order.client_name}</p>
                          <p className="text-muted-foreground text-xs">
                            {order.client_address}
                          </p>
                        </div>
                      </TableCell>

                      {/* Payment Proof */}
                      <TableCell>
                        {order.payment_proof ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedOrder(order);
                              setViewType("payment_proof");
                            }}
                            className="gap-2"
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            No proof
                          </span>
                        )}
                      </TableCell>

                      {/* Payment Status */}
                      <TableCell>
                        <Badge className={paymentStatusColors[order.payment_status]}>
                          {order.payment_status === "verified"
                            ? "✓ Verified"
                            : order.payment_status === "pending"
                            ? "⏳ Pending"
                            : "✗ Rejected"}
                        </Badge>
                      </TableCell>

                      {/* EBM Document */}
                      <TableCell>
                        {order.ebm_document ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedOrder(order);
                              setViewType("ebm_document");
                            }}
                            className="gap-2"
                          >
                            <Download className="h-4 w-4" />
                            Download
                          </Button>
                        ) : (
                          <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-300">
                            NOT YET
                          </Badge>
                        )}
                      </TableCell>

                      {/* Order Status */}
                      <TableCell>
                        <Badge className={statusColors[order.order_status]}>
                          {order.order_status.charAt(0).toUpperCase() +
                            order.order_status.slice(1)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </div>
      </div>

      {/* Modal for Payment Proof and EBM Document */}
      <Dialog
        open={!!selectedOrder && viewType !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedOrder(null);
            setViewType(null);
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {viewType === "payment_proof"
                ? "Payment Proof"
                : "EBM Document"}
              {selectedOrder && (
                <span className="text-muted-foreground text-sm ml-2">
                  Order #{selectedOrder.id.slice(0, 8)}
                </span>
              )}
            </DialogTitle>
          </DialogHeader>

          {viewType === "payment_proof" && selectedOrder?.payment_proof && (
            <div className="space-y-4">
              <img
                src={selectedOrder.payment_proof}
                alt="Payment proof"
                className="w-full max-h-[500px] object-contain rounded border"
              />
              <div className="bg-blue-50 border border-blue-200 rounded p-4">
                <p className="text-sm text-blue-800">
                  Payment proof submitted on{" "}
                  {new Date(selectedOrder.created_at).toLocaleDateString()}
                </p>
              </div>
              {selectedOrder.payment_status === "verified" && (
                <div className="bg-green-50 border border-green-200 rounded p-4">
                  <p className="text-sm text-green-800 font-medium">
                    ✓ Payment verified by admin
                  </p>
                </div>
              )}
              {selectedOrder.payment_status === "rejected" && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    This payment proof was rejected. Please submit a new payment proof.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {viewType === "ebm_document" && selectedOrder?.ebm_document && (
            <div className="space-y-4">
              {selectedOrder.ebm_document.toLowerCase().endsWith(".pdf") ? (
                <iframe
                  src={selectedOrder.ebm_document}
                  className="w-full h-[500px] rounded border"
                />
              ) : (
                <img
                  src={selectedOrder.ebm_document}
                  alt="EBM Document"
                  className="w-full max-h-[500px] object-contain rounded border"
                />
              )}
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={() => {
                  const a = document.createElement("a");
                  a.href = selectedOrder.ebm_document;
                  a.download = `EBM_${selectedOrder.id.slice(0, 8)}_${new Date().getTime()}`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                }}
              >
                <Download className="h-4 w-4" />
                Download Document
              </Button>
            </div>
          )}

          {viewType === "ebm_document" && !selectedOrder?.ebm_document && (
            <div className="py-8 text-center">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">
                EBM Document will be uploaded by admin once order is processed
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
