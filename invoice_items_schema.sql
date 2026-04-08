-- 1. Create the Order Items table for line items in invoices
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    description TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable RLS
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- 3. Policies
CREATE POLICY "Order items are viewable by everyone." ON public.order_items
    FOR SELECT USING (true);

CREATE POLICY "Order items are manageable by admins." ON public.order_items
    FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN'));

-- 4. Seed some initial order items (optional, but good for testing)
-- This assumes some orders exist. For now we just create the table.
