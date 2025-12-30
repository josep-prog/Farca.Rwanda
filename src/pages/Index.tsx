import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Truck, Award, Grid3X3, Bath, Paintbrush, Droplets, Lamp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/products/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import heroBg from "@/assets/hero-bg.jpg";

interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  discount_percent: number;
  images: string[];
  categories: { name: string } | null;
}

const categoryIcons: Record<string, React.ReactNode> = {
  "Tiles": <Grid3X3 className="h-6 w-6" />,
  "Toilets & Sanitary": <Bath className="h-6 w-6" />,
  "Paints": <Paintbrush className="h-6 w-6" />,
  "Sinks & Basins": <Droplets className="h-6 w-6" />,
  "Fixtures": <Lamp className="h-6 w-6" />,
};

export default function Index() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [productsRes, categoriesRes] = await Promise.all([
        supabase.from("products").select("id, slug, name, price, discount_percent, images, categories(name)").eq("is_featured", true).limit(4),
        supabase.from("categories").select("id, name, slug").limit(6),
      ]);
      if (productsRes.data) setFeaturedProducts(productsRes.data as unknown as Product[]);
      if (categoriesRes.data) setCategories(categoriesRes.data);
    };
    fetchData();
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center">
        <div className="absolute inset-0">
          <img src={heroBg} alt="Interior design" className="w-full h-full object-cover" />
          <div className="absolute inset-0 hero-gradient" />
        </div>
        <div className="container relative z-10 py-20">
          <div className="max-w-2xl animate-slide-up">
            <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-6">
              Premium Interior Materials
            </h1>
            <p className="text-lg text-white/80 mb-8">
              Discover premium tiles, modern sanitary ware, and professional paints. Expert guidance to help you choose the perfect materials for your construction projects.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products">
                <Button size="lg" className="gap-2">
                  Explore Products <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-secondary/30">
        <div className="container">
          <h2 className="font-display text-3xl font-bold text-center mb-10">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link key={cat.id} to={`/products?category=${cat.slug}`} className="group p-6 bg-card rounded-lg border border-border/50 text-center card-hover">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  {categoryIcons[cat.name] || <Grid3X3 className="h-6 w-6" />}
                </div>
                <p className="font-medium text-sm">{cat.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-10">
            <h2 className="font-display text-3xl font-bold">Featured Products</h2>
            <Link to="/products">
              <Button variant="outline" className="gap-2">View All <ArrowRight className="h-4 w-4" /></Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} id={product.id} slug={product.slug} name={product.name} price={product.price} discountPercent={product.discount_percent} images={product.images} categoryName={product.categories?.name} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container">
          <h2 className="font-display text-3xl font-bold text-center mb-10">Why Choose BuildMart?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Shield className="h-8 w-8" />, title: "Quality Guaranteed", desc: "All products are certified and backed by manufacturer warranties" },
              { icon: <Truck className="h-8 w-8" />, title: "Fast Delivery", desc: "Reliable delivery with real-time tracking on all orders" },
              { icon: <Award className="h-8 w-8" />, title: "Expert Guidance", desc: "Technical support to help you choose the right materials" },
            ].map((item, i) => (
              <div key={i} className="text-center p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-foreground/10 mb-4">{item.icon}</div>
                <h3 className="font-display text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-primary-foreground/80">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
