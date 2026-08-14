-- ==============================================================================
-- Mini E-Commerce & Realtime Dashboard Database Schema & Seed Data
-- ==============================================================================

-- 1. Create Tables
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(12, 2) NOT NULL DEFAULT 0,
    stock INTEGER NOT NULL DEFAULT 0,
    image_url TEXT,
    category VARCHAR(100) DEFAULT 'General',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(100) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, processing, completed, cancelled
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL DEFAULT 1,
    price NUMERIC(12, 2) NOT NULL DEFAULT 0,
    subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
-- Products: Read accessible by anyone (Customer & Admin), Write by authenticated
CREATE POLICY "Allow public read on products" ON public.products
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert/update/delete on products" ON public.products
    FOR ALL TO authenticated USING (true);

-- Orders: Public can create order (Guest Checkout) & read their own confirmation
CREATE POLICY "Allow public insert on orders" ON public.orders
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read on orders" ON public.orders
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated manage on orders" ON public.orders
    FOR ALL TO authenticated USING (true);

-- Order Items: Public can insert & read
CREATE POLICY "Allow public insert on order_items" ON public.order_items
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read on order_items" ON public.order_items
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated manage on order_items" ON public.order_items
    FOR ALL TO authenticated USING (true);

-- 4. Enable Supabase Realtime for Orders and Order Items
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.order_items;

-- 5. Seed Initial Products Data
INSERT INTO public.products (name, description, price, stock, category, image_url) VALUES
(
    'Mechanical Keyboard RGB Wireless',
    'Keyboard mekanik nirkabel 75% layout dengan switch linear halus, hot-swappable, dan RGB backlight.',
    850000,
    25,
    'Peripherals',
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80'
),
(
    'Ergonomic Wireless Mouse',
    'Mouse nirkabel ergonomis dengan sensor presisi tinggi 4000 DPI, silent click, dan baterai tahan 3 bulan.',
    450000,
    40,
    'Peripherals',
    'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80'
),
(
    'Ultra-Wide Curved Gaming Monitor 34"',
    'Monitor lengkung 34 inci WQHD 144Hz 1ms dengan color gamut 99% sRGB dan HDR10 untuk produktivitas & gaming.',
    4850000,
    10,
    'Display',
    'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80'
),
(
    'Noise Cancelling Wireless Headphones',
    'Headphone over-ear nirkabel dengan Active Noise Cancellation (ANC), audio resolusi tinggi, dan mikrofon jernih.',
    1250000,
    18,
    'Audio',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80'
),
(
    'Minimalist Desk Mat Extended XL',
    'Mousepad jumbo berbahan kulit sintetis anti-air berukuran 90x40cm, memberikan sentuhan meja kerja elegan.',
    175000,
    60,
    'Accessories',
    'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=600&auto=format&fit=crop&q=80'
),
(
    'USB-C Multiport Docking Station 10-in-1',
    'Hub multiport USB-C dengan dual HDMI 4K, Gigabit Ethernet, 100W Power Delivery, dan card reader SD/TF.',
    650000,
    30,
    'Accessories',
    'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=600&auto=format&fit=crop&q=80'
);
