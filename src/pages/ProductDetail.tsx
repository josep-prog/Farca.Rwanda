import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ShoppingCart, CreditCard, ArrowLeft } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  description: string;
  general_info: string;
  technical_specs: Record<string, string>;
  price: number;
  discount_percent: number;
  images: string[];
  video_url: string | null;
  categories: { name: string } | null;
}

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await supabase.from("products").select("*, categories(name)").eq("slug", slug).maybeSingle();
      setProduct(data as unknown as Product);
      setLoading(false);
    };
    fetchProduct();
  }, [slug]);

  if (loading) return <Layout><div className="container py-12 text-center">Loading...</div></Layout>;
  if (!product) return <Layout><div className="container py-12 text-center">Product not found</div></Layout>;

  const discountedPrice = product.price * (1 - (product.discount_percent || 0) / 100);

  return (
    <Layout>
      <div className="container py-8">
        <Link to="/products" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Products
        </Link>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Image */}
          <div className="aspect-square rounded-lg overflow-hidden bg-secondary/30">
            <img src={product.images[0] || "/placeholder.svg"} alt={product.name} className="w-full h-full object-cover" />
          </div>

          {/* Info */}
          <div className="space-y-6">
            {product.categories && <span className="text-sm font-medium text-primary uppercase">{product.categories.name}</span>}
            <h1 className="font-display text-3xl font-bold">{product.name}</h1>
            <p className="text-muted-foreground">{product.description}</p>
            
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-primary">{formatPrice(discountedPrice)}</span>
              {product.discount_percent > 0 && <span className="text-lg text-muted-foreground line-through">{formatPrice(product.price)}</span>}
            </div>

            <div className="flex gap-3">
              <Button size="lg" className="flex-1 gap-2" onClick={() => addToCart(product.id)}>
                <ShoppingCart className="h-5 w-5" /> Add to Cart
              </Button>
              <Link to={`/checkout?product=${product.id}`} className="flex-1">
                <Button size="lg" variant="secondary" className="w-full gap-2">
                  <CreditCard className="h-5 w-5" /> Buy Now
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="general" className="mt-12">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="technical">Technical</TabsTrigger>
          </TabsList>
          <TabsContent value="general" className="mt-6 prose prose-neutral max-w-none">
            <p className="text-muted-foreground whitespace-pre-line">{product.general_info || "No general information available."}</p>
            {product.video_url && (
              <div className="mt-6 aspect-video">
                <iframe src={product.video_url} className="w-full h-full rounded-lg" allowFullScreen />
              </div>
            )}
          </TabsContent>
          <TabsContent value="technical" className="mt-6">
            {product.technical_specs && Object.keys(product.technical_specs).length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(product.technical_specs).map(([key, value]) => (
                  <div key={key} className="p-4 bg-secondary/50 rounded-lg">
                    <p className="text-xs text-muted-foreground uppercase mb-1">{key.replace(/_/g, " ")}</p>
                    <p className="font-medium">{String(value)}</p>
                  </div>
                ))}
              </div>
            ) : <p className="text-muted-foreground">No technical specifications available.</p>}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
