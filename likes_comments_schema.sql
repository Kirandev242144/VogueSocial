-- Create likes table
create table if not exists public.likes (
  id uuid default gen_random_uuid() primary key,
  product_id text references public.products(id) on delete cascade not null,
  user_id text not null, -- unique identifier (e.g. device_id or user_id)
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(product_id, user_id)
);

-- Create comments table
create table if not exists public.comments (
  id uuid default gen_random_uuid() primary key,
  product_id text references public.products(id) on delete cascade not null,
  user_name text not null,
  user_avatar text not null,
  comment_text text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.likes enable row level security;
alter table public.comments enable row level security;

-- Create select and insert policies (Public access)
create policy "Likes are viewable by everyone" 
  on public.likes for select 
  using (true);

create policy "Anyone can insert likes" 
  on public.likes for insert 
  with check (true);

create policy "Anyone can delete likes" 
  on public.likes for delete 
  using (true);

create policy "Comments are viewable by everyone" 
  on public.comments for select 
  using (true);

create policy "Anyone can insert comments" 
  on public.comments for insert 
  with check (true);
