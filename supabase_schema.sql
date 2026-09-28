-- VELORA HOME - SUPABASE DATABASE SCHEMA
-- Copy and paste this script into your Supabase SQL Editor (https://app.supabase.com)

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255),
    description TEXT,
    category VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    sale_price DECIMAL(10, 2),
    stock INT NOT NULL DEFAULT 10,
    image_url TEXT NOT NULL,
    is_featured BOOLEAN DEFAULT FALSE,
    is_new BOOLEAN DEFAULT FALSE,
    dimensions VARCHAR(100),
    material VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    shipping_address TEXT NOT NULL,
    phone VARCHAR(50),
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending', -- Pending, Processing, Shipped, Delivered, Cancelled
    payment_method VARCHAR(50) DEFAULT 'Credit Card',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_title VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create Contact / Inquiries Messages Table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 7. Drop existing policies if re-running script to prevent "policy already exists" error (ERROR 42710)
DROP POLICY IF EXISTS "Public Products Read" ON public.products;
DROP POLICY IF EXISTS "Public Products Insert" ON public.products;
DROP POLICY IF EXISTS "Public Products Update" ON public.products;
DROP POLICY IF EXISTS "Public Products Delete" ON public.products;

DROP POLICY IF EXISTS "Public Orders Select" ON public.orders;
DROP POLICY IF EXISTS "Public Orders Insert" ON public.orders;
DROP POLICY IF EXISTS "Public Orders Update" ON public.orders;

DROP POLICY IF EXISTS "Public Order Items Select" ON public.order_items;
DROP POLICY IF EXISTS "Public Order Items Insert" ON public.order_items;

DROP POLICY IF EXISTS "Public Messages Select" ON public.messages;
DROP POLICY IF EXISTS "Public Messages Insert" ON public.messages;

-- 8. Create Policies
-- Allow public access to products
CREATE POLICY "Public Products Read" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public Products Insert" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Products Update" ON public.products FOR UPDATE USING (true);
CREATE POLICY "Public Products Delete" ON public.products FOR DELETE USING (true);

-- Allow public insert & select for orders
CREATE POLICY "Public Orders Select" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Public Orders Insert" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Orders Update" ON public.orders FOR UPDATE USING (true);

-- Allow public insert & select for order items
CREATE POLICY "Public Order Items Select" ON public.order_items FOR SELECT USING (true);
CREATE POLICY "Public Order Items Insert" ON public.order_items FOR INSERT WITH CHECK (true);

-- Allow public insert & select for messages
CREATE POLICY "Public Messages Select" ON public.messages FOR SELECT USING (true);
CREATE POLICY "Public Messages Insert" ON public.messages FOR INSERT WITH CHECK (true);

-- 9. Insert Initial Sample Seed Data (Only if table is empty)
INSERT INTO public.products (title, category, price, sale_price, stock, image_url, is_featured, is_new, dimensions, material, description)
SELECT 'Aura Terracotta Ceramic Vase', 'Ceramics', 89.00, 75.00, 15, 'https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?auto=format&fit=crop&w=800&q=80', true, true, '24cm x 15cm', 'Raw Terracotta', 'Hand-sculpted matte terracotta vase designed to display dried botanticals or serve as a minimalist standalone center sculpture.'
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE title = 'Aura Terracotta Ceramic Vase');

INSERT INTO public.products (title, category, price, sale_price, stock, image_url, is_featured, is_new, dimensions, material, description)
SELECT 'Minimalist Linen Armchair', 'Furniture', 499.00, NULL, 6, 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80', true, true, '85cm x 80cm x 90cm', 'Belgian Linen & Oak', 'Deep-seated armchair crafted with natural Belgian linen fabric and a solid European oak wood frame.'
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE title = 'Minimalist Linen Armchair');

INSERT INTO public.products (title, category, price, sale_price, stock, image_url, is_featured, is_new, dimensions, material, description)
SELECT 'Nordic Brass Table Lamp', 'Lighting', 145.00, 120.00, 20, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80', true, false, '45cm x 28cm', 'Brushed Brass & Opal Glass', 'Warm ambient table lamp with hand-blown frosted opal glass globe set upon a brushed solid brass base.'
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE title = 'Nordic Brass Table Lamp');

INSERT INTO public.products (title, category, price, sale_price, stock, image_url, is_featured, is_new, dimensions, material, description)
SELECT 'Abstract Sand Stone Wall Art', 'Wall Art', 210.00, NULL, 8, 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80', false, true, '100cm x 70cm', 'Textured Plaster & Wood Frame', 'Hand-textured 3D plaster wall sculpture featuring organic wave lines and soothing warm sand hues.'
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE title = 'Abstract Sand Stone Wall Art');

INSERT INTO public.products (title, category, price, sale_price, stock, image_url, is_featured, is_new, dimensions, material, description)
SELECT 'Artisanal Fluted Side Table', 'Furniture', 320.00, 285.00, 12, 'https://images.unsplash.com/photo-1532372576444-dda954194ad0?auto=format&fit=crop&w=800&q=80', true, false, '50cm x 40cm', 'Travertine Marble & Solid Wood', 'Elegant fluted pedestal side table topped with polished Italian travertine marble.'
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE title = 'Artisanal Fluted Side Table');

INSERT INTO public.products (title, category, price, sale_price, stock, image_url, is_featured, is_new, dimensions, material, description)
SELECT 'Organic Woven Throw Pillow', 'Textiles', 65.00, NULL, 25, 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80', false, false, '50cm x 50cm', '100% Organic Wool & Cotton', 'Heavyweight textured cushion cover woven from un-dyed wool yarns with down alternative insert included.'
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE title = 'Organic Woven Throw Pillow');

INSERT INTO public.products (title, category, price, sale_price, stock, image_url, is_featured, is_new, dimensions, material, description)
SELECT 'Zen Sculptural Candle Holder', 'Decor Accessories', 48.00, 38.00, 30, 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80', false, false, '18cm x 10cm', 'Cast Concrete', 'Monolithic architectural taper candle holder cast in fine smooth grey concrete.'
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE title = 'Zen Sculptural Candle Holder');

INSERT INTO public.products (title, category, price, sale_price, stock, image_url, is_featured, is_new, dimensions, material, description)
SELECT 'Earthy Ceramic Serving Bowl', 'Ceramics', 78.00, NULL, 18, 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80', true, false, '30cm x 12cm', 'Stoneware Clay', 'Rustic wide shallow stoneware bowl finished with reactive speckled glaze, food safe & hand crafted.'
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE title = 'Earthy Ceramic Serving Bowl');
