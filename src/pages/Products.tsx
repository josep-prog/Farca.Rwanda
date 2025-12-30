import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/products/ProductCard";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  discount_percent: number;
  images: string[];
  category_id: string;
  categories: { name: string } | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  
  const activeCategory = searchParams.get("category") || "all";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        supabase.from("products").select("id, slug, name, price, discount_percent, images, category_id, categories(name)"),
        supabase.from("categories").select("id, name, slug"),
      ]);
      if (productsRes.data) setProducts(productsRes.data as unknown as Product[]);
      if (categoriesRes.data) setCategories(categoriesRes.data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchesCategory = activeCategory === "all" || categories.find(c => c.slug === activeCategory)?.id === p.category_id;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="font-display text-3xl font-bold mb-8">Our Products</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search products..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Categories</h3>
              <div className="space-y-1">
                <button onClick={() => setSearchParams({})} className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${activeCategory === "all" ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}>
                  All Products
                </button>
                {categories.map((cat) => (
                  <button key={cat.id} onClick={() => setSearchParams({ category: cat.slug })} className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${activeCategory === cat.slug ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}>
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="text-center py-12 text-muted-foreground">Loading products...</div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">No products found</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} id={product.id} slug={product.slug} name={product.name} price={product.price} discountPercent={product.discount_percent} images={product.images} categoryName={product.categories?.name} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
