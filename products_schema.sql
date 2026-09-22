-- Create products table with full VogueSocial Merchant schema
create table if not exists public.products (
  id text default gen_random_uuid()::text primary key,
  vendor_id text references public.profiles(id) on delete cascade not null,
  name text not null,
  description text,
  price decimal(10, 2) not null,
  sale_price decimal(10, 2),
  currency text default 'USD',
  category text,
  subcategory text,
  target_audience text default 'Unisex',
  sku text,
  image_url text not null,
  back_image_url text,
  additional_images jsonb default '[]'::jsonb,
  colors jsonb default '[]'::jsonb,
  sizes jsonb default '[]'::jsonb,
  variants jsonb default '[]'::jsonb,
  stock integer default 0,
  availability_status text default 'in_stock',
  shipping_info jsonb default '{}'::jsonb,
  return_policy jsonb default '{}'::jsonb,
  status text default 'pending_approval',
  admin_notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add merchant profiles fields
alter table public.profiles 
add column if not exists store_name text,
add column if not exists store_handle text unique,
add column if not exists store_description text,
add column if not exists store_category text,
add column if not exists target_audience text[],
add column if not exists website_url text,
add column if not exists instagram_handle text,
add column if not exists twitter_handle text,
add column if not exists location text,
add column if not exists tryon_credits_total integer default 2000,
add column if not exists tryon_credits_used integer default 1621,
add column if not exists subscription_plan text default 'Growth';

-- Enable RLS
alter table public.products enable row level security;

-- Policies for Products
create policy "Live products are viewable by everyone."
  on public.products for select
  using ( status = 'live' or auth.uid()::text = vendor_id );

create policy "Vendors can insert their own products."
  on public.products for insert
  with check ( auth.uid()::text = vendor_id );

create policy "Vendors can update their own products."
  on public.products for update
  using ( auth.uid()::text = vendor_id );

create policy "Vendors can delete their own products."
  on public.products for delete
  using ( auth.uid()::text = vendor_id );
