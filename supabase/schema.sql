-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check ((select auth.uid()) = id);

create policy "Users can update own profile." on profiles
  for update using ((select auth.uid()) = id);

-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
-- See https://supabase.com/docs/guides/auth/managing-user-data#using-triggers for more details.
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, username)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'preferred_username'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create Wiki Posts table
create table wiki_posts (
  id uuid default gen_random_uuid() primary key,
  project_slug text not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index on wiki_posts(project_slug);
create index on wiki_posts(user_id);

alter table wiki_posts enable row level security;

create policy "Wiki posts are viewable by everyone." on wiki_posts
  for select using (true);

create policy "Authenticated users can insert wiki posts." on wiki_posts
  for insert with check (auth.role() = 'authenticated');

create policy "Users can update own wiki posts." on wiki_posts
  for update using ((select auth.uid()) = user_id);

create policy "Users can delete own wiki posts." on wiki_posts
  for delete using ((select auth.uid()) = user_id);

-- Create Wiki Post Votes table
create table wiki_post_votes (
  post_id uuid references public.wiki_posts(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  vote_type smallint not null check (vote_type = 1 or vote_type = -1),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (post_id, user_id)
);

alter table wiki_post_votes enable row level security;

create policy "Votes are viewable by everyone." on wiki_post_votes
  for select using (true);

create policy "Authenticated users can vote." on wiki_post_votes
  for insert with check (auth.role() = 'authenticated');

create policy "Users can update own vote." on wiki_post_votes
  for update using ((select auth.uid()) = user_id);

create policy "Users can delete own vote." on wiki_post_votes
  for delete using ((select auth.uid()) = user_id);

-- Create Discussions/Issues table
create table discussions (
  id uuid default gen_random_uuid() primary key,
  project_slug text not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  content text not null,
  status text check (status in ('open', 'closed', 'resolved')) default 'open',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index on discussions(project_slug);

alter table discussions enable row level security;

create policy "Discussions are viewable by everyone." on discussions
  for select using (true);

create policy "Authenticated users can insert discussions." on discussions
  for insert with check (auth.role() = 'authenticated');

create policy "Users can update own discussions." on discussions
  for update using ((select auth.uid()) = user_id);

create policy "Users can delete own discussions." on discussions
  for delete using ((select auth.uid()) = user_id);

-- Set up Storage
insert into storage.buckets (id, name, public) values ('wiki_images', 'wiki_images', true);

create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'wiki_images' );

create policy "Authenticated users can upload images"
  on storage.objects for insert
  to authenticated
  with check ( bucket_id = 'wiki_images' );

-- Create User Favorites table
create table user_favorites (
  user_id uuid references public.profiles(id) on delete cascade not null,
  project_slug text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, project_slug)
);

alter table user_favorites enable row level security;

create policy "Users can view their own favorites." on user_favorites
  for select using ((select auth.uid()) = user_id);

create policy "Users can insert their own favorites." on user_favorites
  for insert with check ((select auth.uid()) = user_id);

create policy "Users can delete their own favorites." on user_favorites
  for delete using ((select auth.uid()) = user_id);
