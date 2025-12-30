import { Link } from "react-router-dom";
import { Eye, ShoppingCart, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  id: string;
  slug: string;
  name: string;
  price: number;
  discountPercent?: number;
  images: string[];
  categoryName?: string;
}

export function ProductCard({
  id,
  slug,
  name,
  price,
  discountPercent = 0,
  images,
  categoryName,
}: ProductCardProps) {
  const { addToCart } = useCart();
  const discountedPrice = price * (1 - discountPercent / 100);
  const hasDiscount = discountPercent > 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(id);
  };

  return (
    <div className="group relative bg-card rounded-lg overflow-hidden shadow-card card-hover border border-border/50 flex flex-col h-full hover:shadow-lg transition-shadow">
      {hasDiscount && (
        <div className="sale-badge">SALE</div>
      )}
      
      {/* Image Section - Takes up more space */}
      <div className="aspect-video overflow-hidden bg-secondary/30 relative group flex-shrink-0">
        <img
          src={images[0] || "/placeholder.svg"}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {!images[0] && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground text-sm">No Image</p>
            </div>
          </div>
        )}
      </div>

      {/* Content Section - Flexible height */}
      <div className="p-5 space-y-4 flex flex-col flex-grow">
        {/* Category */}
        {categoryName && (
          <span className="text-xs font-semibold text-primary uppercase tracking-widest">
            {categoryName}
          </span>
        )}
        
        {/* Product Name - Fully visible */}
        <h3 className="font-display font-bold text-lg text-foreground leading-snug">
          {name}
        </h3>

        {/* Price Section */}
        <div className="flex items-baseline gap-3 py-2">
          <span className="text-2xl font-bold text-primary">
            {formatPrice(discountedPrice)}
          </span>
          {hasDiscount && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(price)}
              </span>
              <span className="text-xs font-semibold text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded">
                -{discountPercent}%
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons - Stay at bottom */}
        <div className="space-y-2 mt-auto pt-2">
          <div className="flex gap-2">
            <Link to={`/products/${slug}`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full gap-1 text-xs font-semibold">
                <Eye className="h-4 w-4" />
                View
              </Button>
            </Link>
            <Button 
              variant="secondary" 
              size="sm"
              className="flex-1 gap-1 text-xs font-semibold"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4" />
              Add
            </Button>
          </div>
          
          <Link to={`/checkout?product=${id}`} className="block w-full">
            <Button variant="default" size="sm" className="w-full gap-1 text-xs font-semibold">
              <CreditCard className="h-4 w-4" />
              Buy Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
