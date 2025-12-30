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
    <div className="group relative bg-card rounded-lg overflow-hidden shadow-card card-hover border border-border/50">
      {hasDiscount && (
        <div className="sale-badge">SALE</div>
      )}
      
      <div className="aspect-square overflow-hidden bg-secondary/30">
        <img
          src={images[0] || "/placeholder.svg"}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      <div className="p-4 space-y-3">
        {categoryName && (
          <span className="text-xs font-medium text-primary uppercase tracking-wide">
            {categoryName}
          </span>
        )}
        
        <h3 className="font-display font-semibold text-foreground line-clamp-2 min-h-[2.5rem]">
          {name}
        </h3>

        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-primary">
            {formatPrice(discountedPrice)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(price)}
            </span>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Link to={`/products/${slug}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full gap-1">
              <Eye className="h-4 w-4" />
              View
            </Button>
          </Link>
          <Button 
            variant="secondary" 
            size="sm"
            className="flex-1 gap-1"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4" />
            Add
          </Button>
        </div>
        
        <Link to={`/checkout?product=${id}`}>
          <Button variant="default" size="sm" className="w-full gap-1">
            <CreditCard className="h-4 w-4" />
            Buy Now
          </Button>
        </Link>
      </div>
    </div>
  );
}
