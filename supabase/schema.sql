-- ==============================================================================
-- Mini E-Commerce & Realtime Dashboard Database Schema & Migration (Idempotent)
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

CREATE TABLE IF NOT EXISTS public.vouchers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL, -- 'shipping', 'percent', 'fixed'
    value NUMERIC(12, 2) NOT NULL DEFAULT 0,
    min_spend NUMERIC(12, 2) DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(100) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_whatsapp VARCHAR(50),
    customer_address TEXT,
    subtotal_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    shipping_fee NUMERIC(12, 2) NOT NULL DEFAULT 0,
    discount_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    voucher_code VARCHAR(100),
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

-- Ensure schema updates
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_whatsapp VARCHAR(50);
ALTER TABLE public.orders DROP COLUMN IF EXISTS customer_phone;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_address TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS subtotal_amount NUMERIC(12, 2) DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_fee NUMERIC(12, 2) DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS discount_amount NUMERIC(12, 2) DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS voucher_code VARCHAR(100);

CREATE TABLE IF NOT EXISTS public.admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'admin', -- 'superadmin', 'admin'
    avatar_url TEXT,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vouchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies (Drop if exists then recreate)
DROP POLICY IF EXISTS "Allow public read on products" ON public.products;
DROP POLICY IF EXISTS "Allow authenticated insert/update/delete on products" ON public.products;
DROP POLICY IF EXISTS "Allow public all on products" ON public.products;
CREATE POLICY "Allow public all on products" ON public.products FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read on vouchers" ON public.vouchers;
DROP POLICY IF EXISTS "Allow authenticated manage on vouchers" ON public.vouchers;
DROP POLICY IF EXISTS "Allow public all on vouchers" ON public.vouchers;
CREATE POLICY "Allow public all on vouchers" ON public.vouchers FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public insert on orders" ON public.orders;
CREATE POLICY "Allow public insert on orders" ON public.orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read on orders" ON public.orders;
CREATE POLICY "Allow public read on orders" ON public.orders FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public update on orders" ON public.orders;
CREATE POLICY "Allow public update on orders" ON public.orders FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow authenticated manage on orders" ON public.orders;
CREATE POLICY "Allow authenticated manage on orders" ON public.orders FOR ALL TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow public insert on order_items" ON public.order_items;
CREATE POLICY "Allow public insert on order_items" ON public.order_items FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read on order_items" ON public.order_items;
CREATE POLICY "Allow public read on order_items" ON public.order_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow authenticated manage on order_items" ON public.order_items;
CREATE POLICY "Allow authenticated manage on order_items" ON public.order_items FOR ALL TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow public all on admins" ON public.admins;
CREATE POLICY "Allow public all on admins" ON public.admins FOR ALL USING (true) WITH CHECK (true);

-- 4. Enable Supabase Realtime for All Tables
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'orders'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
    END IF;
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'order_items'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.order_items;
    END IF;
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'products'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
    END IF;
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'vouchers'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.vouchers;
    END IF;
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'admins'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.admins;
    END IF;
END $$;

-- 5. Seed Initial Products Data (Insert only if empty)
INSERT INTO public.products (name, description, price, stock, category, image_url)
SELECT 'Mechanical Keyboard RGB Wireless', 'Keyboard mekanik nirkabel 75% layout dengan switch linear halus, hot-swappable, dan RGB backlight.', 850000, 25, 'Peripherals', 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80'
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Mechanical Keyboard RGB Wireless');

INSERT INTO public.products (name, description, price, stock, category, image_url)
SELECT 'Ergonomic Wireless Mouse', 'Mouse nirkabel ergonomis dengan sensor presisi tinggi 4000 DPI, silent click, dan baterai tahan 3 bulan.', 450000, 40, 'Peripherals', 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80'
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Ergonomic Wireless Mouse');

INSERT INTO public.products (name, description, price, stock, category, image_url)
SELECT 'Ultra-Wide Curved Gaming Monitor 34"', 'Monitor lengkung 34 inci WQHD 144Hz 1ms dengan color gamut 99% sRGB dan HDR10 untuk produktivitas & gaming.', 4850000, 10, 'Display', 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80'
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Ultra-Wide Curved Gaming Monitor 34"');

INSERT INTO public.products (name, description, price, stock, category, image_url)
SELECT 'Noise Cancelling Wireless Headphones', 'Headphone over-ear nirkabel dengan Active Noise Cancellation (ANC), audio resolusi tinggi, dan mikrofon jernih.', 1250000, 18, 'Audio', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80'
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Noise Cancelling Wireless Headphones');

INSERT INTO public.products (name, description, price, stock, category, image_url)
SELECT 'Minimalist Desk Mat Extended XL', 'Mousepad jumbo berbahan kulit sintetis anti-air berukuran 90x40cm, memberikan sentuhan meja kerja elegan.', 175000, 60, 'Accessories', 'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=600&auto=format&fit=crop&q=80'
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Minimalist Desk Mat Extended XL');

INSERT INTO public.products (name, description, price, stock, category, image_url)
SELECT 'USB-C Multiport Docking Station 10-in-1', 'Hub multiport USB-C dengan dual HDMI 4K, Gigabit Ethernet, 100W Power Delivery, dan card reader SD/TF.', 650000, 30, 'Accessories', 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=600&auto=format&fit=crop&q=80'
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'USB-C Multiport Docking Station 10-in-1');

-- 6. Seed Initial Vouchers Data
INSERT INTO public.vouchers (code, name, description, type, value, min_spend)
VALUES 
('GRATISONGKIR', 'Voucher Gratis Ongkir', 'Bebas biaya ongkir s.d Rp 20.000', 'shipping', 20000, 0),
('SPARKE10', 'Diskon Belanja 10%', 'Potongan 10% untuk semua produk', 'percent', 10, 0),
('HEMAT50', 'Potongan Rp 50.000', 'Min. pembelian Rp 200.000', 'fixed', 50000, 200000)
ON CONFLICT (code) DO NOTHING;

-- 7. Seed Default Admin Account (admin@sparke.id / admin123)
INSERT INTO public.admins (name, email, password_hash, role)
VALUES 
('Admin Pusat', 'admin@sparke.id', 'c8e2a1b9f04d3e5a:61802edeef6a42f41644eb1e2782981f9eb716fe99dd00fbedee997edd56438ac6244ddec345b203b6e22521f8a9fbf8e0e18458e96d3c4ebe22b62c9478ac6f', 'superadmin')
ON CONFLICT (email) DO UPDATE 
SET password_hash = EXCLUDED.password_hash,
    name = EXCLUDED.name,
    role = EXCLUDED.role;
