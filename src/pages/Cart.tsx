import { useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Trash2, Plus, Minus } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";

export default function Cart() {
  const { items, removeFromCart, updateQuantity } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  // Calculate totals
  const subtotal = items.reduce((sum, item) => {
    const price = item.product?.price || 0;
    const discount = item.product?.discount_percent || 0;
    const discountedPrice = price * (1 - discount / 100);
    return sum + discountedPrice * (item.quantity || 1);
  }, 0);

  const tax = subtotal * 0.18; // 18% tax
  const total = subtotal + tax;

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <Link to="/products" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            </div>

            {/* Empty State */}
            <div className="text-center py-12">
              <div className="mb-6">
                <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Your cart is empty
              </h2>
              <p className="text-gray-600 mb-8">
                Start shopping to add items to your cart
              </p>
              <Link to="/products">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link to="/products" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {items.map((item) => {
                  const price = item.product?.price || 0;
                  const discount = item.product?.discount_percent || 0;
                  const discountedPrice = price * (1 - discount / 100);
                  const itemTotal = discountedPrice * (item.quantity || 1);

                  return (
                    <Card key={item.id} className="p-6">
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-start">
                        {/* Product Image */}
                        <div className="sm:col-span-1">
                          {item.product?.images && item.product.images[0] ? (
                            <img
                              src={item.product.images[0]}
                              alt={item.product?.name}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                              <span className="text-gray-400 text-sm">
                                No image
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="sm:col-span-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {item.product?.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Product ID: {item.product?.id}
                          </p>

                          {/* Price */}
                          <div className="mt-3">
                            {discount > 0 ? (
                              <>
                                <span className="text-lg font-bold text-gray-900">
                                  {formatPrice(discountedPrice)}
                                </span>
                                <span className="text-sm text-gray-500 line-through ml-2">
                                  {formatPrice(price)}
                                </span>
                                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded ml-2">
                                  {discount}% off
                                </span>
                              </>
                            ) : (
                              <span className="text-lg font-bold text-gray-900">
                                {formatPrice(price)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="sm:col-span-1 space-y-3">
                          {/* Quantity */}
                          <div className="flex items-center gap-2 border rounded-lg w-fit">
                            <button
                              onClick={() =>
                                handleUpdateQuantity(
                                  item.id,
                                  (item.quantity || 1) - 1
                                )
                              }
                              className="p-2 hover:bg-gray-100"
                              disabled={isLoading}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-3 font-semibold min-w-[40px] text-center">
                              {item.quantity || 1}
                            </span>
                            <button
                              onClick={() =>
                                handleUpdateQuantity(
                                  item.id,
                                  (item.quantity || 1) + 1
                                )
                              }
                              className="p-2 hover:bg-gray-100"
                              disabled={isLoading}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Item Total */}
                          <div className="text-right">
                            <p className="text-sm text-gray-600">Subtotal</p>
                            <p className="text-lg font-bold text-gray-900">
                              {formatPrice(itemTotal)}
                            </p>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => removeFromCart(item.product_id)}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition"
                            disabled={isLoading}
                          >
                            <Trash2 className="w-4 h-4" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {/* Continue Shopping */}
              <div className="mt-8">
                <Link to="/products">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6 pb-6 border-b">
                  <div className="flex justify-between text-gray-600">
                    <span>Items ({items.length})</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (18%)</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                </div>

                <div className="flex justify-between text-lg font-bold text-gray-900 mb-6">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>

                <Link to="/checkout" className="w-full">
                  <Button
                    size="lg"
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={isLoading}
                  >
                    Proceed to Checkout
                  </Button>
                </Link>

                <p className="text-xs text-gray-500 text-center mt-4">
                  Secure checkout with all major payment methods
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
