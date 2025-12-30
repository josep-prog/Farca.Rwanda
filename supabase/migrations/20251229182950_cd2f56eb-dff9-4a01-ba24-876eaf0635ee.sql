-- Create enum for order status
CREATE TYPE public.order_status AS ENUM ('pending', 'payment_received', 'processing', 'shipped', 'delivered', 'cancelled');

-- Create enum for payment status
CREATE TYPE public.payment_status AS ENUM ('pending', 'verified', 'rejected');

-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  technical_specs JSONB DEFAULT '{}',
  general_info TEXT,
  video_url TEXT,
  price DECIMAL(12, 2) NOT NULL,
  discount_percent INTEGER DEFAULT 0,
  stock INTEGER DEFAULT 0,
  images TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create profiles table for users
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table for admin management
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  UNIQUE (user_id, role)
);

-- Create cart_items table
CREATE TABLE public.cart_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT,
  client_address TEXT,
  total_amount DECIMAL(12, 2) NOT NULL,
  payment_status payment_status DEFAULT 'pending',
  payment_proof TEXT,
  order_status order_status DEFAULT 'pending',
  ebm_document TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order_items table
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(12, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Public read policies for categories and products
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (true);

-- Admin policies for categories
CREATE POLICY "Admins can insert categories" ON public.categories FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update categories" ON public.categories FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete categories" ON public.categories FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Admin policies for products
CREATE POLICY "Admins can insert products" ON public.products FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update products" ON public.products FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete products" ON public.products FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Profile policies
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- User roles policies
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Cart policies
CREATE POLICY "Users can manage their own cart" ON public.cart_items FOR ALL USING (auth.uid() = user_id);

-- Orders policies
CREATE POLICY "Users can view their own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all orders" ON public.orders FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update orders" ON public.orders FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- Order items policies
CREATE POLICY "Users can view their order items" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);
CREATE POLICY "Users can create order items" ON public.order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);
CREATE POLICY "Admins can view all order items" ON public.order_items FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Trigger for auto-creating profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data ->> 'full_name');
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'user');
  
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default categories
INSERT INTO public.categories (name, slug, icon, color) VALUES
  ('Tiles', 'tiles', 'Grid3x3', 'category-tiles'),
  ('Toilets & Sanitary', 'toilets-sanitary', 'Bath', 'category-toilets'),
  ('Paints', 'paints', 'Paintbrush', 'category-paints'),
  ('Sinks & Basins', 'sinks-basins', 'Droplets', 'category-sinks'),
  ('Faucets & Fittings', 'faucets-fittings', 'Pipette', 'category-faucets'),
  ('Fixtures', 'fixtures', 'Lamp', 'category-fixtures');

-- Insert sample products
INSERT INTO public.products (category_id, name, slug, description, general_info, technical_specs, price, discount_percent, stock, is_featured, images) VALUES
  (
    (SELECT id FROM public.categories WHERE slug = 'tiles'),
    'Carrara Marble Porcelain Tile',
    'carrara-marble-porcelain-tile',
    'Premium Italian-inspired porcelain tile with authentic Carrara marble veining. Perfect for luxury interiors.',
    'The Carrara Marble Porcelain Tile brings the timeless elegance of Italian marble to your space without the maintenance requirements. This tile is ideal for living rooms, bathrooms, and entryways where you want to create a sophisticated atmosphere. The glazed surface provides excellent stain resistance while maintaining the natural beauty of marble patterns. Not recommended for high-traffic commercial areas or outdoor installations due to its polished surface.',
    '{"dimensions": "600x600mm", "thickness": "10mm", "material": "Porcelain", "finish": "Polished", "water_absorption": "<0.5%", "slip_resistance": "R9", "frost_resistant": true, "weight": "22kg/m²", "pei_rating": "PEI III"}',
    38000,
    10,
    250,
    true,
    ARRAY['https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=800']
  ),
  (
    (SELECT id FROM public.categories WHERE slug = 'tiles'),
    'Industrial Concrete Effect Tile',
    'industrial-concrete-effect-tile',
    'Modern industrial-style tile with authentic concrete texture. Durable and versatile for contemporary spaces.',
    'Transform your space with our Industrial Concrete Effect Tile, designed to deliver the raw, urban aesthetic of polished concrete with superior durability. This tile excels in commercial spaces, kitchens, and modern living areas. Its matte finish provides excellent slip resistance, making it suitable for both residential and light commercial applications. The neutral gray tones complement virtually any color scheme. Highly recommended for churches, halls, and public buildings due to its exceptional durability.',
    '{"dimensions": "800x800mm", "thickness": "11mm", "material": "Porcelain", "finish": "Matte", "water_absorption": "<0.1%", "slip_resistance": "R10", "frost_resistant": true, "weight": "25kg/m²", "pei_rating": "PEI V"}',
    46000,
    0,
    180,
    true,
    ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800']
  ),
  (
    (SELECT id FROM public.categories WHERE slug = 'toilets-sanitary'),
    'TOTO Neorest Intelligent Toilet',
    'toto-neorest-intelligent-toilet',
    'State-of-the-art smart toilet with bidet, auto-flush, heated seat, and self-cleaning technology.',
    'The TOTO Neorest represents the pinnacle of bathroom technology and comfort. This intelligent toilet features an integrated bidet with adjustable water temperature and pressure, a heated seat with temperature control, automatic lid opening and closing, and TOTO''s revolutionary ewater+ technology that keeps the bowl clean without harsh chemicals. The tankless design saves space while the powerful flush system ensures complete waste removal with minimal water usage. Ideal for master bathrooms and luxury residences.',
    '{"dimensions": "680x390x540mm", "weight": "45kg", "flush_type": "Dual Cyclone", "water_per_flush": "3.8L/4.8L", "seat_heating": true, "auto_flush": true, "bidet": true, "deodorizer": true, "night_light": true, "power": "220V", "warranty": "3 years"}',
    2500000,
    5,
    15,
    true,
    ARRAY['https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800']
  ),
  (
    (SELECT id FROM public.categories WHERE slug = 'paints'),
    'Premium Interior Wall Paint - Antique White',
    'premium-interior-paint-antique-white',
    'High-quality washable interior paint with excellent coverage and a sophisticated matte finish.',
    'Our Premium Interior Wall Paint in Antique White delivers a warm, inviting atmosphere to any room. This low-VOC formula is safe for bedrooms, nurseries, and living spaces. The advanced acrylic technology provides superior coverage, often requiring just one coat, and creates a durable, washable surface that resists scuffs and stains. Not recommended for high-moisture areas like bathrooms without proper ventilation. For best results, apply over a quality primer on new surfaces.',
    '{"coverage": "12-14 m²/L", "finish": "Matte", "dry_time": "1-2 hours", "recoat_time": "4 hours", "voc": "Low VOC", "base": "Acrylic", "washability": "Excellent", "sizes": ["1L", "4L", "20L"]}',
    45000,
    15,
    500,
    false,
    ARRAY['https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800']
  ),
  (
    (SELECT id FROM public.categories WHERE slug = 'sinks-basins'),
    'Vessel Basin - Natural Stone',
    'vessel-basin-natural-stone',
    'Handcrafted natural stone vessel basin with unique veining patterns. Each piece is one-of-a-kind.',
    'Elevate your bathroom with our Natural Stone Vessel Basin, hand-carved from genuine marble. Each basin features unique veining patterns, making your bathroom truly one-of-a-kind. The polished interior ensures easy cleaning while the natural stone exterior adds organic beauty. Ideal for powder rooms and master bathrooms where design takes center stage. Requires a vessel-style faucet and appropriate vanity height. Professional installation recommended.',
    '{"dimensions": "420x420x150mm", "material": "Natural Marble", "weight": "15kg", "drain": "Standard 45mm", "mounting": "Above Counter", "finish": "Polished Interior/Natural Exterior"}',
    185000,
    0,
    25,
    true,
    ARRAY['https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800']
  ),
  (
    (SELECT id FROM public.categories WHERE slug = 'faucets-fittings'),
    'Waterfall Basin Mixer - Brushed Gold',
    'waterfall-basin-mixer-brushed-gold',
    'Contemporary waterfall faucet with brushed gold finish. Single lever control with ceramic cartridge.',
    'Make a statement with our Waterfall Basin Mixer in stunning brushed gold. The wide cascade spout creates a mesmerizing waterfall effect while providing ample water flow for comfortable use. The single-lever design offers precise temperature and flow control through a premium ceramic cartridge rated for 500,000 cycles. The PVD brushed gold finish is scratch-resistant and maintains its luster for years. Compatible with standard basin installations.',
    '{"height": "180mm", "spout_reach": "120mm", "material": "Solid Brass", "finish": "PVD Brushed Gold", "cartridge": "Ceramic 35mm", "flow_rate": "1.5 GPM", "connections": "Standard 3/8 inch", "warranty": "5 years"}',
    125000,
    20,
    45,
    true,
    ARRAY['https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?w=800']
  ),
  (
    (SELECT id FROM public.categories WHERE slug = 'fixtures'),
    'Modern Pendant Light - Geometric Brass',
    'modern-pendant-light-geometric-brass',
    'Stunning geometric pendant light with brass frame and frosted glass diffuser.',
    'Illuminate your space with our Geometric Brass Pendant Light, where modern design meets timeless elegance. The angular brass frame creates captivating shadow patterns while the frosted glass diffuser provides soft, even lighting. Perfect for dining areas, kitchen islands, or entryways. The adjustable cable allows for custom hanging heights up to 1.5 meters. Dimmable with compatible LED bulbs for creating the perfect ambiance.',
    '{"dimensions": "350x350x400mm", "material": "Brass/Frosted Glass", "max_wattage": "60W", "bulb_type": "E27", "cable_length": "1500mm", "ip_rating": "IP20", "dimmable": true, "weight": "3.2kg"}',
    95000,
    0,
    60,
    false,
    ARRAY['https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=800']
  ),
  (
    (SELECT id FROM public.categories WHERE slug = 'tiles'),
    'Hexagonal Mosaic Tile - Ocean Blue',
    'hexagonal-mosaic-tile-ocean-blue',
    'Stunning hexagonal glass mosaic tiles in ocean blue gradient. Perfect for feature walls and backsplashes.',
    'Create a stunning focal point with our Hexagonal Mosaic Tiles in Ocean Blue. These glass tiles feature a beautiful gradient from deep navy to turquoise, reminiscent of tropical waters. Mesh-mounted for easy installation, they are perfect for kitchen backsplashes, bathroom feature walls, and shower accents. The glazed glass surface is easy to clean and resistant to moisture, making it ideal for wet areas. Not suitable for floor installations.',
    '{"dimensions": "Sheet 300x300mm", "hex_size": "48mm", "thickness": "6mm", "material": "Glass", "finish": "Glazed", "sheets_per_sqm": "11", "frost_resistant": false, "indoor_only": true}',
    28000,
    0,
    120,
    false,
    ARRAY['https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800']
  );