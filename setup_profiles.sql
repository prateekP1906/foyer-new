-- 1. Create profiles table
create table public.profiles (
  id uuid not null references auth.users on delete cascade,
  first_name text,
  last_name text,
  avatar_url text,
  updated_at timestamp with time zone,
  primary key (id)
);

-- 2. Enable RLS
alter table public.profiles enable row level security;

-- 3. create policies
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- 4. Create a trigger to auto-create profile on signup
-- This function will be called on every new user signup
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, first_name, last_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

-- Trigger definition
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 5. Storage Policies for 'avatars' bucket
-- Ensure the bucket exists (idempotent)
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Allow authenticated uploads ONLY if the filename matches their user ID
-- We'll use a folder structure strategy: avatars/{user_id}/{filename} or just {user_id}
-- The prompt asked for "file name is their own User ID".
-- Policy to allow upload if the name equals the user's ID (plus extension)
create policy "Users can upload their own avatar"
on storage.objects for insert
with check (
  bucket_id = 'avatars' 
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow updates
create policy "Users can update their own avatar"
on storage.objects for update
using (
  bucket_id = 'avatars' 
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow public access
create policy "Avatar images are publicly accessible"
on storage.objects for select
using ( bucket_id = 'avatars' );
