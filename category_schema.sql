-- 1. Create the Product Categories table
CREATE TABLE IF NOT EXISTS public.product_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable RLS
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;

-- 3. Policies
CREATE POLICY "Categories are viewable by everyone." ON public.product_categories
    FOR SELECT USING (true);

CREATE POLICY "Categories are manageable by admins." ON public.product_categories
    FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN'));

-- 4. Seed initial categories
INSERT INTO public.product_categories (name)
VALUES ('Apparel'), ('Signage'), ('Promotional')
ON CONFLICT (name) DO NOTHING;

-- 5. Remove the CHECK constraint from the products table
-- We need to find the constraint name. Usually it's 'products_category_check'.
-- This is a one-time migration.
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_category_check;

-- Optional: Link products to categories via foreign key if desired, 
-- but for simplicity we'll keep it as TEXT for now to avoid breaking existing data.
