
-- SELL ARMY DATABASE SCHEMA
-- Paste this into the Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. Create Profiles Table (Extends Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  name TEXT,
  role TEXT CHECK (role IN ('SELLER', 'RESELLER', 'ADMIN')),
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  stock INTEGER DEFAULT 0,
  image_url TEXT,
  seller_id UUID REFERENCES auth.users NOT NULL,
  category TEXT,
  status TEXT DEFAULT 'active'
);

-- 3. Create Stores Table (For Resellers)
CREATE TABLE IF NOT EXISTS public.stores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reseller_id UUID REFERENCES auth.users NOT NULL,
  name TEXT,
  bio TEXT,
  accent_color TEXT DEFAULT '#065f46',
  layout TEXT DEFAULT 'grid',
  logo_url TEXT,
  banner_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for Profiles
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 6. RLS Policies for Products
CREATE POLICY "Products are viewable by everyone." ON public.products FOR SELECT USING (true);
CREATE POLICY "Sellers can insert their own products." ON public.products FOR INSERT WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "Sellers can update their own products." ON public.products FOR UPDATE USING (auth.uid() = seller_id);
CREATE POLICY "Sellers can delete their own products." ON public.products FOR DELETE USING (auth.uid() = seller_id);

-- 7. RLS Policies for Stores
CREATE POLICY "Stores are viewable by everyone." ON public.stores FOR SELECT USING (true);
CREATE POLICY "Resellers can manage their own store." ON public.stores FOR ALL USING (auth.uid() = reseller_id);

-- 8. Trigger: Automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (new.id, new.email, split_part(new.email, '@', 1), 'RESELLER');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 9. STORAGE BUCKETS SETUP
-- Note: You can also do this manually in the Supabase Dashboard under Storage
INSERT INTO storage.buckets (id, name, public) VALUES ('products', 'products', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('assets', 'assets', true) ON CONFLICT (id) DO NOTHING;

-- 10. STORAGE POLICIES (Allow public read, authenticated upload)
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id IN ('products', 'assets'));
CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update their own uploads" ON storage.objects FOR UPDATE USING (auth.uid() = owner);
