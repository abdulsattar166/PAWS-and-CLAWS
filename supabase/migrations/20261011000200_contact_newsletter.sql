-- ============================================================================
-- Contact messages + newsletter subscribers
-- The public contact form and newsletter sign-up previously posted to a
-- third-party form endpoint. They now store submissions in Supabase so the
-- business owns the data and can read it from the Admin Panel.
-- ============================================================================

create table if not exists public.contact_messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  phone      text,
  subject    text,
  message    text not null,
  is_read    boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.newsletter_subscribers (
  id         uuid primary key default gen_random_uuid(),
  email      text not null unique,
  created_at timestamptz not null default now()
);

alter table public.contact_messages        enable row level security;
alter table public.newsletter_subscribers  enable row level security;

-- Anyone may submit, but only admins may read/update/delete. -----------------
drop policy if exists "contact_public_insert" on public.contact_messages;
create policy "contact_public_insert" on public.contact_messages
  for insert with check (true);

drop policy if exists "contact_admin_all" on public.contact_messages;
create policy "contact_admin_all" on public.contact_messages
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "newsletter_public_insert" on public.newsletter_subscribers;
create policy "newsletter_public_insert" on public.newsletter_subscribers
  for insert with check (true);

drop policy if exists "newsletter_admin_all" on public.newsletter_subscribers;
create policy "newsletter_admin_all" on public.newsletter_subscribers
  for all using (public.is_admin()) with check (public.is_admin());

grant insert on public.contact_messages, public.newsletter_subscribers to anon, authenticated;
grant all on public.contact_messages, public.newsletter_subscribers to authenticated, service_role;

create index if not exists contact_messages_created_idx on public.contact_messages (created_at desc);
