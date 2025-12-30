import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import { ArrowLeft, ShoppingCart, Loader2, AlertCircle, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
}

interface CheckoutProduct {
  id: string;
  name: string;
  price: number;
  discount_percent: number;
  images: string[];
}

export default function Checkout() {
  const { user, isLoading: authLoading } = useAuth();
  const { items: cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("product");

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState<(CheckoutProduct & { quantity: number })[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  // Pre-fill user data if logged in
  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (data) {
          setFullName(data.full_name || "");
          setEmail(data.email || user.email || "");
          setPhone(data.phone || "");
          setAddress(data.address || "");
        } else {
          setEmail(user.email || "");
        }
      };

      fetchUserData();
    }
  }, [user]);

  // Load checkout items
  useEffect(() => {
    const loadCheckoutItems = async () => {
      setIsLoadingProducts(true);
      try {
        if (productId) {
          // Single product checkout
          const { data } = await supabase
            .from("products")
            .select("*")
            .eq("id", productId)
            .maybeSingle();

          if (data) {
            setCheckoutItems([{ ...data, quantity: 1 }]);
          }
        } else if (cartItems.length > 0) {
          // Cart checkout
          setCheckoutItems(
            cartItems.map(item => ({
              ...item.product,
              quantity: item.quantity
            }))
          );
        }
      } catch (error) {
        console.error("Error loading checkout items:", error);
        toast.error("Failed to load items for checkout");
      } finally {
        setIsLoadingProducts(false);
      }
    };

    loadCheckoutItems();
  }, [productId, cartItems]);

  // Calculate totals
  const calculateSubtotal = () => {
    return checkoutItems.reduce((sum, item) => {
      const discountedPrice = item.price * (1 - (item.discount_percent || 0) / 100);
      return sum + discountedPrice * item.quantity;
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const tax = subtotal * 0.18; // 18% tax
  const total = subtotal + tax;

  // Handle remove item from checkout
  const handleRemoveItem = (itemId: string) => {
    setCheckoutItems(checkoutItems.filter(item => item.id !== itemId));
    toast.success("Item removed from checkout");
  };

  // Validate form
  const validateForm = (): boolean => {
    if (!fullName.trim()) {
      toast.error("Full name is required");
      return false;
    }
    if (!email.trim() || !email.includes("@")) {
      toast.error("Valid email is required");
      return false;
    }
    if (!phone.trim()) {
      toast.error("Phone number is required");
      return false;
    }
    if (!address.trim()) {
      toast.error("Address is required");
      return false;
    }
    if (checkoutItems.length === 0) {
      toast.error("No items in checkout");
      return false;
    }
    return true;
  };

  // Handle order submission
  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      // Create order_items array
      const orderItems: OrderItem[] = checkoutItems.map(item => ({
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity,
        unit_price: item.price * (1 - (item.discount_percent || 0) / 100)
      }));

      // Create order
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user?.id || null,
          client_name: fullName,
          client_email: email,
          client_phone: phone,
          client_address: address,
          total_amount: total,
          payment_status: "pending",
          order_status: "pending",
          notes: notes || null
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(
          orderItems.map(item => ({
            order_id: orderData.id,
            product_id: item.product_id,
            product_name: item.product_name,
            quantity: item.quantity,
            unit_price: item.unit_price
          }))
        );

      if (itemsError) throw itemsError;

      // Clear cart if it was a cart checkout
      if (!productId && cartItems.length > 0) {
        await clearCart();
      }

      toast.success("Order created successfully!");
      
      // Redirect to order confirmation
      navigate(`/order-confirmation/${orderData.id}`);
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Failed to create order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || isLoadingProducts) {
    return (
      <Layout>
        <div className="container py-12 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading checkout...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (checkoutItems.length === 0) {
    return (
      <Layout>
        <div className="container py-12">
          <Link to="/products" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" /> Back to Products
          </Link>

          <Card className="p-12 text-center">
            <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
            <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6">Add items to your cart to continue shopping</p>
            <Link to="/products">
              <Button>Continue Shopping</Button>
            </Link>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-12">
        <Link to={productId ? `/products/${productId}` : "/products"} className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <Card className="p-6 sticky top-20">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6 pb-6 border-b">
                {checkoutItems.map(item => (
                  <div key={item.id} className="flex justify-between items-start text-sm group">
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <p className="font-medium">
                        {formatPrice(
                          item.price * (1 - (item.discount_percent || 0) / 100) * item.quantity
                        )}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded transition-colors flex items-center gap-1"
                        title="Remove item"
                      >
                        <Trash2 className="h-3 w-3" />
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (18%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-4 border-t">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(total)}</span>
                </div>
              </div>

              <Button className="w-full" size="lg" disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {loading ? "Processing..." : "Place Order"}
              </Button>
            </Card>
          </div>

          {/* Checkout Form */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <Card className="p-8">
              <form onSubmit={handleSubmitOrder} className="space-y-6">
                {/* Billing Information */}
                <div>
                  <h2 className="text-xl font-bold mb-4">Billing Information</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter your full name"
                        disabled={loading}
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@email.com"
                          disabled={loading}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="250 XXX XXX XXX"
                          disabled={loading}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address">Delivery Address *</Label>
                      <Input
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter your full address"
                        disabled={loading}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="notes">Additional Notes (Optional)</Label>
                      <textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Any special instructions for delivery"
                        disabled={loading}
                        className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        rows={4}
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="pt-6 border-t">
                  <h2 className="text-xl font-bold mb-4">Payment Method</h2>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3 mb-4">
                    <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold text-blue-900">Payment Instructions</p>
                      <p className="text-blue-800 mt-1">
                        Our team will contact you after order confirmation to arrange payment details. We accept bank transfers and mobile money.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-4 border rounded-lg bg-secondary/50">
                      <div className="h-4 w-4 rounded border border-primary" />
                      <div>
                        <p className="font-medium">Bank Transfer</p>
                        <p className="text-sm text-muted-foreground">We'll provide details after confirmation</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 border rounded-lg bg-secondary/50">
                      <div className="h-4 w-4 rounded border border-primary" />
                      <div>
                        <p className="font-medium">Mobile Money</p>
                        <p className="text-sm text-muted-foreground">MTN, Airtel, or other mobile payment</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6 flex gap-3">
                  <Link to={productId ? `/products/${productId}` : "/products"} className="flex-1">
                    <Button variant="outline" className="w-full" disabled={loading}>
                      Cancel
                    </Button>
                  </Link>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-md font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                    {loading ? "Placing Order..." : "Place Order"}
                  </button>
                </div>

                <p className="text-xs text-muted-foreground text-center pt-4">
                  By placing this order, you agree to our terms and conditions. Your information will be kept secure.
                </p>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
