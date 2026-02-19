create table if not exists public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  url text not null,
  title text not null,
  created_at timestamptz not null default now()
);

alter table public.bookmarks enable row level security;

create policy "Users can manage own bookmarks"
  on public.bookmarks
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
