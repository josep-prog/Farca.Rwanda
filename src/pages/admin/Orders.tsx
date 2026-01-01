import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { EBMDocumentUpload } from "@/components/admin/EBMDocumentUpload";
import { toast } from "sonner";
import { Eye, Search, CheckCircle2, Clock, Package, Image as ImageIcon, Download } from "lucide-react";

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
  client_phone: string;
  client_address: string;
  total_amount: number;
  payment_status: "pending" | "verified" | "rejected";
  order_status: "pending" | "payment_received" | "processing" | "shipped" | "delivered" | "cancelled";
  payment_proof?: string | null;
  ebm_document?: string | null;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [proofPreviewOpen, setProofPreviewOpen] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const [updateData, setUpdateData] = useState({
    order_status: "" as "pending" | "payment_received" | "processing" | "shipped" | "delivered" | "cancelled",
    payment_status: "" as "pending" | "verified" | "rejected",
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setUpdateData({
      order_status: order.order_status,
      payment_status: order.payment_status,
    });
    setOpenDialog(true);
  };

  const handleUpdateOrder = async () => {
    if (!selectedOrder) return;

    try {
      setUpdatingOrderId(selectedOrder.id);
      const { error } = await supabase
        .from("orders")
        .update({
          order_status: updateData.order_status,
          payment_status: updateData.payment_status,
        })
        .eq("id", selectedOrder.id);

      if (error) throw error;
      toast.success("Order updated successfully");
      setOpenDialog(false);
      fetchOrders();
    } catch (error) {
      toast.error("Failed to update order");
      console.error(error);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const filteredOrders = orders.filter(
    (o) =>
      o.client_name.toLowerCase().includes(search.toLowerCase()) ||
      o.client_email.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
      case "verified":
        return "bg-green-100 text-green-700";
      case "shipped":
      case "processing":
        return "bg-blue-100 text-blue-700";
      case "cancelled":
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle2 className="w-4 h-4" />;
      case "shipped":
        return <Package className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <AdminLayout pageTitle="Orders Management">
      <div className="space-y-6">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
          <Input
            placeholder="Search by client name, email, or order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-white border-gray-200 text-gray-900"
          />
        </div>

        {/* Orders Table */}
        <Card className="bg-white border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Order ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Client
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Payment Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Order Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-gray-900 font-mono text-xs">
                        {order.id.substring(0, 8)}...
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-gray-900 font-medium">
                            {order.client_name}
                          </p>
                          <p className="text-gray-600 text-sm">
                            {order.client_email}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-900 font-semibold">
                        RWF {(typeof order.total_amount === 'string' ? parseFloat(order.total_amount) : order.total_amount).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${getStatusColor(
                            order.payment_status
                          )}`}
                        >
                          {getStatusIcon(order.payment_status)}
                          {order.payment_status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${getStatusColor(
                            order.order_status
                          )}`}
                        >
                          {getStatusIcon(order.order_status)}
                          {order.order_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleViewDetails(order)}
                          className="text-blue-600 hover:bg-blue-50"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      {loading ? "Loading..." : "No orders found"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="bg-white border-gray-200 text-gray-900 max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Order Details - {selectedOrder?.id.substring(0, 8)}...
            </DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Client Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-600 text-xs uppercase">
                    Client Name
                  </Label>
                  <p className="text-gray-900 font-medium">
                    {selectedOrder.client_name}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-600 text-xs uppercase">
                    Email
                  </Label>
                  <p className="text-gray-900 font-medium">
                    {selectedOrder.client_email}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-600 text-xs uppercase">
                    Phone
                  </Label>
                  <p className="text-gray-900 font-medium">
                    {selectedOrder.client_phone || "N/A"}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-600 text-xs uppercase">
                    Total Amount
                  </Label>
                  <p className="text-gray-900 font-semibold text-lg">
                    RWF {(typeof selectedOrder.total_amount === 'string' ? parseFloat(selectedOrder.total_amount) : selectedOrder.total_amount).toFixed(2)}
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-gray-600 text-xs uppercase">
                  Address
                </Label>
                <p className="text-gray-900">
                  {selectedOrder.client_address || "N/A"}
                </p>
              </div>

              {/* Payment Proof */}
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <Label className="text-gray-600 text-xs uppercase mb-3 block">
                  Payment Proof
                </Label>
                {selectedOrder.payment_proof ? (
                  <div className="space-y-3">
                    <div className="bg-white rounded p-3 flex items-center justify-between border border-gray-200">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-gray-900 text-sm font-medium">Payment Proof Document</p>
                          <p className="text-gray-600 text-xs">
                            {selectedOrder.payment_proof.split('/').pop()?.substring(0, 40)}...
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setProofPreviewOpen(true)}
                          className="text-blue-600 hover:bg-blue-50"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          asChild
                          className="text-green-600 hover:bg-green-50"
                        >
                          <a href={selectedOrder.payment_proof} target="_blank" rel="noopener noreferrer" download>
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </a>
                        </Button>
                      </div>
                    </div>
                    <p className="text-gray-600 text-xs">
                      Status: <span className={`font-semibold ${
                        selectedOrder.payment_status === 'verified' ? 'text-green-700' :
                        selectedOrder.payment_status === 'rejected' ? 'text-red-700' :
                        'text-yellow-700'
                      }`}>
                        {selectedOrder.payment_status.toUpperCase()}
                      </span>
                    </p>
                  </div>
                ) : (
                  <div className="bg-gray-100 rounded p-3 text-center">
                    <p className="text-gray-500 text-sm">No payment proof uploaded yet</p>
                  </div>
                )}
              </div>
              {selectedOrder.order_items && selectedOrder.order_items.length > 0 && (
                <div>
                  <Label className="text-gray-600 text-xs uppercase mb-2 block">
                    Order Items
                  </Label>
                  <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 bg-gray-100">
                          <th className="px-4 py-2 text-left text-gray-700">
                            Product
                          </th>
                          <th className="px-4 py-2 text-right text-gray-700">
                            Qty
                          </th>
                          <th className="px-4 py-2 text-right text-gray-700">
                            Price
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.order_items.map((item) => (
                          <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="px-4 py-2 text-gray-900">
                              {item.product_name}
                            </td>
                            <td className="px-4 py-2 text-right text-gray-900">
                              {item.quantity}
                            </td>
                            <td className="px-4 py-2 text-right text-gray-900">
                              ${item.unit_price.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* EBM Document Upload Section */}
              <div>
                <Label className="text-gray-600 text-xs uppercase mb-3 block">
                  EBM Document (Proof of Purchase)
                </Label>
                <EBMDocumentUpload
                  orderId={selectedOrder.id}
                  currentEBMDocument={selectedOrder.ebm_document}
                  onUploadSuccess={(documentUrl) => {
                    setSelectedOrder({
                      ...selectedOrder,
                      ebm_document: documentUrl,
                    });
                    toast.success("EBM document uploaded successfully!");
                  }}
                />
              </div>

              {/* Status Updates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-700 mb-2 block">
                    Payment Status
                  </Label>
                  <Select
                    value={updateData.payment_status}
                    onValueChange={(value) =>
                      setUpdateData({ ...updateData, payment_status: value as "pending" | "verified" | "rejected" })
                    }
                  >
                    <SelectTrigger className="bg-white border-gray-200 text-gray-900">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      <SelectItem value="pending" className="text-gray-900">
                        Pending
                      </SelectItem>
                      <SelectItem value="verified" className="text-gray-900">
                        Verified
                      </SelectItem>
                      <SelectItem value="rejected" className="text-gray-900">
                        Rejected
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-700 mb-2 block">
                    Order Status
                  </Label>
                  <Select
                    value={updateData.order_status}
                    onValueChange={(value) =>
                      setUpdateData({ ...updateData, order_status: value as "pending" | "payment_received" | "processing" | "shipped" | "delivered" | "cancelled" })
                    }
                  >
                    <SelectTrigger className="bg-white border-gray-200 text-gray-900">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      <SelectItem value="pending" className="text-gray-900">
                        Pending
                      </SelectItem>
                      <SelectItem value="payment_received" className="text-gray-900">
                        Payment Received
                      </SelectItem>
                      <SelectItem value="processing" className="text-gray-900">
                        Processing
                      </SelectItem>
                      <SelectItem value="shipped" className="text-gray-900">
                        Shipped
                      </SelectItem>
                      <SelectItem value="delivered" className="text-gray-900">
                        Delivered
                      </SelectItem>
                      <SelectItem value="cancelled" className="text-gray-900">
                        Cancelled
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setOpenDialog(false)} className="border-gray-300 text-gray-700 hover:bg-gray-100">
                  Close
                </Button>
                <Button
                  onClick={handleUpdateOrder}
                  disabled={updatingOrderId === selectedOrder.id}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {updatingOrderId === selectedOrder.id
                    ? "Updating..."
                    : "Update Order"}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Payment Proof Preview Modal */}
      <Dialog open={proofPreviewOpen} onOpenChange={setProofPreviewOpen}>
        <DialogContent className="bg-white border-gray-200 text-gray-900 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Payment Proof - {selectedOrder?.client_name}</DialogTitle>
          </DialogHeader>
          
          {selectedOrder?.payment_proof && (
            <div className="space-y-4">
              <div className="bg-gray-100 rounded-lg p-4 border border-gray-200">
                <img
                  src={selectedOrder.payment_proof}
                  alt="Payment Proof"
                  className="w-full rounded-lg max-h-96 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23f3f4f6' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' font-size='16' fill='%239ca3af' text-anchor='middle' dy='.3em'%3EFailed to load image%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded p-4 border border-gray-200">
                <div>
                  <p className="text-gray-600 text-xs uppercase mb-1">Client Name</p>
                  <p className="text-gray-900 font-medium">{selectedOrder.client_name}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs uppercase mb-1">Payment Status</p>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                    selectedOrder.payment_status === 'verified' ? 'bg-green-100 text-green-700' :
                    selectedOrder.payment_status === 'rejected' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {selectedOrder.payment_status.toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-gray-600 text-xs uppercase mb-1">Amount</p>
                  <p className="text-gray-900 font-semibold">
                    RWF {(typeof selectedOrder.total_amount === 'string' ? parseFloat(selectedOrder.total_amount) : selectedOrder.total_amount).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs uppercase mb-1">Date Uploaded</p>
                  <p className="text-gray-900 text-sm">
                    {new Date(selectedOrder.created_at).toLocaleDateString()} {new Date(selectedOrder.created_at).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setProofPreviewOpen(false)}
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  Close
                </Button>
                <Button
                  asChild
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <a href={selectedOrder.payment_proof} target="_blank" rel="noopener noreferrer" download>
                    <Download className="w-4 h-4 mr-2" />
                    Download Original
                  </a>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
