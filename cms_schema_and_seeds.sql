-- CMS Infrastructure & Seed Data

-- 1. Site Config Table (Global Settings)
CREATE TABLE IF NOT EXISTS public.site_config (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'General',
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;

-- Site Config Policies
CREATE POLICY "Public can view site config." ON public.site_config
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage site config." ON public.site_config
    FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN'));

-- 2. Services Table (Dynamic Home Page Cards)
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon_name TEXT NOT NULL DEFAULT 'Sparkles',
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Services Policies
CREATE POLICY "Public can view services." ON public.services
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage services." ON public.services
    FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN'));

-- --- SEED DATA ---

-- Seed Site Config
INSERT INTO public.site_config (key, value, category, description) VALUES
('business_name', 'Maple Leaf Trading Ltd.', 'Company', 'The official brand name.'),
('contact_email', 'hello@mapleleaf-trading.ca', 'Contact', 'Primary business email.'),
('contact_phone', '+1 (604) 555-0123', 'Contact', 'Main office phone number.'),
('whatsapp_number', '16045550123', 'Contact', 'WhatsApp format (digits only).'),
('office_address', '123 Business Way, Vancouver, BC', 'Contact', 'Physical office location.'),
('opening_hours', 'Mon - Fri: 9am - 6pm', 'Company', 'Standard business hours.'),
('hero_title', 'Bringing your brand to life, together.', 'Hero', 'The primary H1 on the landing page.'),
('hero_subtitle', 'We partner with you to craft premium merchandise and signage that tells your unique story with high-end Canadian quality.', 'Hero', 'The secondary text under the Hero title.'),
('hero_image_url', '/hero.png', 'Hero', 'The primary branding image URL for the landing page.'),
('footer_branding', 'Dedicated to the art of B2B merchandising, driven by quality Canadian craftsmanship and long-term human partnership.', 'Footer', 'The short paragraph in the footer.');

-- Seed Services
INSERT INTO public.services (title, description, icon_name, sort_order) VALUES
('Custom apparel', 'We help you craft premium apparel that your team and clients will love to wear, every day.', 'Shirt', 1),
('Commercial signage', 'Let''s make your physical space as welcoming as your brand with elegant architectural solutions.', 'Layers', 2),
('Brand merchandise', 'Thoughtful, high-quality items designed to represent your excellence and build lasting connections.', 'PenTool', 3);

-- Seed Initial Products (If empty)
INSERT INTO public.products (title, description, category, price, stock, is_active)
SELECT 'Classic Heavy Cotton T-Shirt', 'Premium 100% cotton tee for everyday corporate wear.', 'Apparel', 12.50, 450, true
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE title = 'Classic Heavy Cotton T-Shirt');

INSERT INTO public.products (title, description, category, price, stock, is_active)
SELECT 'Architectural Window Film', 'Frosted or decorative signage film for commercial spaces.', 'Signage', 85.00, 50, true
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE title = 'Architectural Window Film');
