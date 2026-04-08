-- 1. Add image_url to Services table
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS image_url TEXT;

-- 2. Seed some initial images for existing services (if any)
UPDATE public.services SET image_url = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800' WHERE title = 'Custom apparel' AND image_url IS NULL;
UPDATE public.services SET image_url = 'https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?auto=format&fit=crop&q=80&w=800' WHERE title = 'Commercial signage' AND image_url IS NULL;
UPDATE public.services SET image_url = 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=800' WHERE title = 'Brand merchandise' AND image_url IS NULL;

-- 3. Ensure site_config is seeded for settings page
-- This ensures the settings page isn't "empty"
INSERT INTO public.site_config (key, value, category, description) VALUES
('business_name', 'Maple Leaf Trading Ltd.', 'Company', 'The official brand name.'),
('contact_email', 'hello@mapleleaf-trading.ca', 'Contact', 'Primary business email.'),
('contact_phone', '+1 (604) 555-0123', 'Contact', 'Main office phone number.'),
('whatsapp_number', '16045550123', 'Contact', 'WhatsApp format (digits only).'),
('office_address', '123 Business Way, Vancouver, BC', 'Contact', 'Physical office location.'),
('opening_hours', 'Mon - Fri: 9am - 6pm', 'Company', 'Standard business hours.'),
('hero_title', 'Bringing your brand, to life, together.', 'Hero', 'The primary H1 on the landing page.'),
('hero_subtitle', 'We partner with you to craft premium merchandise and signage that tells your unique story with high-end Canadian quality.', 'Hero', 'The secondary text under the Hero title.'),
('hero_image_url', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200', 'Hero', 'The primary branding image URL for the landing page.'),
('footer_branding', 'Dedicated to the art of B2B merchandising, driven by quality Canadian craftsmanship and long-term human partnership.', 'Footer', 'The short paragraph in the footer.')
ON CONFLICT (key) DO NOTHING;
