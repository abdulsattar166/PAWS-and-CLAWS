-- ============================================================================
-- Paws and Claws — full database schema
-- Creates every table, function, policy and storage bucket the website,
-- booking engine and Admin Panel rely on. Safe to run once on a fresh project.
-- ============================================================================

create extension if not exists pgcrypto with schema extensions;

-- ---------------------------------------------------------------------------
-- Admin membership
-- ---------------------------------------------------------------------------
create table if not exists public.admin_users (
  user_id      uuid primary key references auth.users(id) on delete cascade,
  email        text,
  display_name text,
  created_at   timestamptz not null default now()
);

-- Helper used by every RLS policy. SECURITY DEFINER so it can read admin_users
-- without triggering RLS (avoids infinite recursion).
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users au where au.user_id = auth.uid()
  );
$$;

-- ---------------------------------------------------------------------------
-- Services & size pricing
-- ---------------------------------------------------------------------------
create table if not exists public.services (
  id          text primary key,
  name        text not null,
  category    text not null default 'dogs',
  description text,
  price_aed   numeric not null default 0,
  duration    text,
  icon        text,
  sort_order  integer not null default 100,
  active      boolean not null default true,
  pet_type    text not null default 'all',
  image_url   text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.service_size_prices (
  id         uuid primary key default gen_random_uuid(),
  service_id text not null references public.services(id) on delete cascade,
  size       text not null,
  price_aed  numeric not null default 0,
  unique (service_id, size)
);

-- ---------------------------------------------------------------------------
-- Packages
-- ---------------------------------------------------------------------------
create table if not exists public.packages (
  id                  text primary key,
  name                text not null,
  short_description   text,
  full_description    text,
  pet_type            text not null default 'dog',
  breed_restrictions  text,
  pet_size            text,
  min_weight          numeric,
  max_weight          numeric,
  original_price      numeric not null default 0,
  discounted_price    numeric,
  duration            text,
  washes              text,
  shampoo_details     text,
  conditioner_details text,
  haircut_details     text,
  coat_care           text,
  skin_care           text,
  drying_brushing     text,
  ear_cleaning        text,
  nail_trimming       text,
  treatments          jsonb not null default '[]'::jsonb,
  image_url           text,
  featured            boolean not null default false,
  sort_order          integer not null default 100,
  active              boolean not null default true,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Pet categories
-- ---------------------------------------------------------------------------
create table if not exists public.pet_categories (
  id         text primary key,
  label      text not null,
  singular   text,
  icon       text,
  sort_order integer not null default 100,
  active     boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Gallery
-- ---------------------------------------------------------------------------
create table if not exists public.gallery_categories (
  id         text primary key,
  label      text not null,
  sort_order integer not null default 100,
  active     boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.gallery_images (
  id          uuid primary key default gen_random_uuid(),
  title       text,
  caption     text,
  alt         text,
  category_id text references public.gallery_categories(id) on delete set null,
  image_url   text not null,
  featured    boolean not null default false,
  sort_order  integer not null default 100,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Website testimonials (separate from Google reviews)
-- ---------------------------------------------------------------------------
create table if not exists public.reviews (
  id            uuid primary key default gen_random_uuid(),
  customer_name text not null,
  review_text   text not null,
  rating        integer not null default 5,
  review_date   date,
  image_url     text,
  featured      boolean not null default false,
  published     boolean not null default true,
  sort_order    integer not null default 100,
  created_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Offers / discounts
-- ---------------------------------------------------------------------------
create table if not exists public.offers (
  id             uuid primary key default gen_random_uuid(),
  title          text not null,
  description    text,
  discount_type  text not null default 'percent' check (discount_type in ('percent','fixed')),
  discount_value numeric not null default 0,
  service_ids    jsonb not null default '[]'::jsonb,
  promo_code     text,
  banner_text    text,
  starts_at      timestamptz,
  ends_at        timestamptz,
  active         boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Blog
-- ---------------------------------------------------------------------------
create table if not exists public.blog_posts (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  title           text not null,
  excerpt         text,
  content         text,
  cover_image     text,
  category        text,
  tags            jsonb not null default '[]'::jsonb,
  status          text not null default 'draft' check (status in ('draft','published')),
  seo_title       text,
  seo_description text,
  published_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Editable content / settings
-- ---------------------------------------------------------------------------
create table if not exists public.site_settings (
  key        text primary key,
  value      jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.pages (
  key        text primary key,
  value      jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Bookings
-- ---------------------------------------------------------------------------
create table if not exists public.bookings (
  id                    uuid primary key default gen_random_uuid(),
  booking_ref           text not null unique,
  pet_name              text,
  pet_type              text,
  pet_breed             text,
  pet_size              text,
  services              jsonb not null default '[]'::jsonb,
  service_total         numeric not null default 0,
  preferred_date        date not null,
  time_slot             text not null,
  customer_name         text not null,
  customer_email        text not null,
  customer_phone        text not null,
  customer_whatsapp     text,
  customer_address      text,
  addr_house_number     text,
  addr_street_number    text,
  addr_street_name      text,
  addr_area             text,
  addr_city             text,
  addr_province         text,
  addr_country          text,
  addr_postal_code      text,
  addr_landmark         text,
  special_notes         text,
  health_info           text,
  complete_address      text,
  customer_lat          double precision,
  customer_lng          double precision,
  location_shared_at    timestamptz,
  payment_screenshot_url text,
  amount                numeric not null default 0,
  currency              text not null default 'AED',
  booking_status        text not null default 'pending_payment',
  payment_status        text not null default 'unpaid',
  payment_method        text,
  payment_provider      text,
  payment_ref           text,
  admin_status          text not null default 'pending',
  admin_note            text,
  hold_expires_at       timestamptz,
  paid_at               timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- A slot can only be held by one live booking at a time. Cancelled / expired
-- bookings free the slot for somebody else.
create unique index if not exists bookings_slot_unique
  on public.bookings (preferred_date, time_slot)
  where booking_status in ('pending_payment', 'confirmed', 'in_progress');

create index if not exists bookings_created_idx on public.bookings (created_at desc);
create index if not exists bookings_ref_idx on public.bookings (booking_ref);

-- ---------------------------------------------------------------------------
-- Payment verification log
-- ---------------------------------------------------------------------------
create table if not exists public.payment_logs (
  id         uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  action     text not null,
  amount     numeric,
  note       text,
  actor      text,
  created_at timestamptz not null default now()
);

create index if not exists payment_logs_booking_idx on public.payment_logs (booking_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Booking reference generator (PC@YYYY/N) — atomic & concurrency safe
-- ---------------------------------------------------------------------------
create table if not exists public.booking_ref_counters (
  year        integer primary key,
  last_number integer not null default 0
);

create or replace function public.next_booking_ref()
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_year integer := extract(year from now())::int;
  v_num  integer;
begin
  insert into public.booking_ref_counters (year, last_number)
  values (v_year, 1)
  on conflict (year) do update
    set last_number = public.booking_ref_counters.last_number + 1
  returning last_number into v_num;

  return 'PC@' || v_year || '/' || v_num;
end;
$$;

-- Slots already taken for a given date (used by the public booking form).
create or replace function public.get_booked_slots(p_date date)
returns text[]
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(array_agg(time_slot order by time_slot), '{}'::text[])
  from public.bookings
  where preferred_date = p_date
    and booking_status in ('pending_payment', 'confirmed', 'in_progress');
$$;

grant execute on function public.get_booked_slots(date) to anon, authenticated;
grant execute on function public.next_booking_ref() to service_role;

-- ---------------------------------------------------------------------------
-- Admin installer — creates (or resets) an auth user + admin membership.
-- Called by seed.sql on first run; safe to call again to reset the password.
-- ---------------------------------------------------------------------------
create or replace function public.install_admin(p_email text, p_password text)
returns uuid
language plpgsql
security definer
set search_path = public, auth, extensions
as $$
declare
  v_user_id uuid;
  v_email   text := lower(trim(p_email));
begin
  select id into v_user_id from auth.users where lower(email) = v_email limit 1;

  if v_user_id is null then
    v_user_id := gen_random_uuid();

    insert into auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) values (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, crypt(p_password, gen_salt('bf')),
      now(), now(), now(),
      '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      '', '', '', ''
    );

    begin
      insert into auth.identities (
        id, user_id, provider_id, provider, identity_data,
        last_sign_in_at, created_at, updated_at
      ) values (
        gen_random_uuid(), v_user_id, v_user_id::text, 'email',
        jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
        now(), now(), now()
      );
    exception when others then
      begin
        insert into auth.identities (
          id, user_id, provider, identity_data, last_sign_in_at, created_at, updated_at
        ) values (
          gen_random_uuid(), v_user_id, 'email',
          jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
          now(), now(), now()
        );
      exception when others then null;
      end;
    end;
  else
    update auth.users
      set encrypted_password = crypt(p_password, gen_salt('bf')),
          email_confirmed_at = coalesce(email_confirmed_at, now()),
          updated_at = now()
      where id = v_user_id;
  end if;

  insert into public.admin_users (user_id, email, display_name)
  values (v_user_id, v_email, 'Administrator')
  on conflict (user_id) do update
    set email = excluded.email;

  return v_user_id;
end;
$$;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.admin_users         enable row level security;
alter table public.services            enable row level security;
alter table public.service_size_prices enable row level security;
alter table public.packages            enable row level security;
alter table public.pet_categories      enable row level security;
alter table public.gallery_categories  enable row level security;
alter table public.gallery_images      enable row level security;
alter table public.reviews             enable row level security;
alter table public.offers              enable row level security;
alter table public.blog_posts          enable row level security;
alter table public.site_settings       enable row level security;
alter table public.pages               enable row level security;
alter table public.bookings            enable row level security;
alter table public.payment_logs        enable row level security;
alter table public.booking_ref_counters enable row level security;

-- Public (anon) readable tables ---------------------------------------------
do $$
declare
  t text;
  public_read text[] := array[
    'services','service_size_prices','packages','pet_categories',
    'gallery_categories','gallery_images','reviews','offers',
    'site_settings','pages'
  ];
begin
  foreach t in array public_read loop
    execute format('drop policy if exists "public_read" on public.%I', t);
    execute format('create policy "public_read" on public.%I for select using (true)', t);
  end loop;
end $$;

-- Admin full access to everything -------------------------------------------
do $$
declare
  t text;
  admin_tables text[] := array[
    'services','service_size_prices','packages','pet_categories',
    'gallery_categories','gallery_images','reviews','offers',
    'site_settings','pages','bookings','payment_logs',
    'booking_ref_counters','admin_users'
  ];
begin
  foreach t in array admin_tables loop
    execute format('drop policy if exists "admin_all" on public.%I', t);
    execute format(
      'create policy "admin_all" on public.%I for all using (public.is_admin()) with check (public.is_admin())',
      t
    );
  end loop;
end $$;

-- Blog: public may only read published posts --------------------------------
drop policy if exists "published_read" on public.blog_posts;
create policy "published_read" on public.blog_posts
  for select using (status = 'published');

-- Admin users: a signed-in user may read their own membership row ------------
drop policy if exists "self_read" on public.admin_users;
create policy "self_read" on public.admin_users
  for select using (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Grants (cloud parity — explicit so the API roles always have access)
-- ---------------------------------------------------------------------------
grant usage on schema public to anon, authenticated;
grant select on
  public.services, public.service_size_prices, public.packages,
  public.pet_categories, public.gallery_categories, public.gallery_images,
  public.reviews, public.offers, public.site_settings, public.pages,
  public.blog_posts
to anon, authenticated;

grant all on all tables in schema public to authenticated, service_role;
grant usage, select on all sequences in schema public to anon, authenticated, service_role;

-- ---------------------------------------------------------------------------
-- Storage buckets + policies
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('media', 'media', true), ('payment-proofs', 'payment-proofs', true)
on conflict (id) do update set public = excluded.public;

do $$
begin
  drop policy if exists "media_public_read" on storage.objects;
  drop policy if exists "media_admin_write" on storage.objects;
  drop policy if exists "payment_proofs_public_read" on storage.objects;
  drop policy if exists "payment_proofs_admin_write" on storage.objects;
exception when others then null;
end $$;

do $$
begin
  create policy "media_public_read" on storage.objects
    for select using (bucket_id = 'media');
  create policy "media_admin_write" on storage.objects
    for all using (bucket_id = 'media' and public.is_admin())
    with check (bucket_id = 'media' and public.is_admin());
  create policy "payment_proofs_public_read" on storage.objects
    for select using (bucket_id = 'payment-proofs');
  create policy "payment_proofs_admin_write" on storage.objects
    for all using (bucket_id = 'payment-proofs' and public.is_admin())
    with check (bucket_id = 'payment-proofs' and public.is_admin());
exception when others then
  raise notice 'Storage policies skipped: %', sqlerrm;
end $$;
