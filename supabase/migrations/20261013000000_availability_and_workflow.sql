-- ============================================================================
-- Availability management + approval workflow + WhatsApp notification log
--   * blocked_slots        — admin-managed unavailable dates / time slots
--   * bookings whatsapp_*  — notification delivery status for the admin panel
--   * get_booked_slots()   — now also returns admin-blocked slots
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Blocked (unavailable) slots. A NULL time_slot means the whole day is blocked.
-- ---------------------------------------------------------------------------
create table if not exists public.blocked_slots (
  id         uuid primary key default gen_random_uuid(),
  block_date date not null,
  time_slot  text,
  reason     text,
  created_at timestamptz not null default now()
);

create unique index if not exists blocked_slots_unique
  on public.blocked_slots (block_date, coalesce(time_slot, ''));

alter table public.blocked_slots enable row level security;

drop policy if exists "blocked_slots_public_read" on public.blocked_slots;
create policy "blocked_slots_public_read" on public.blocked_slots
  for select using (true);

drop policy if exists "blocked_slots_admin_all" on public.blocked_slots;
create policy "blocked_slots_admin_all" on public.blocked_slots
  for all using (public.is_admin()) with check (public.is_admin());

grant select on public.blocked_slots to anon, authenticated;
grant all on public.blocked_slots to authenticated, service_role;

-- ---------------------------------------------------------------------------
-- WhatsApp notification status on bookings (shown to administrators).
-- ---------------------------------------------------------------------------
alter table public.bookings add column if not exists whatsapp_status text;
alter table public.bookings add column if not exists whatsapp_sent_at timestamptz;
alter table public.bookings add column if not exists whatsapp_error text;

-- ---------------------------------------------------------------------------
-- Slots that are unavailable for a date: already booked OR admin-blocked.
-- A whole-day block expands to every arrival window.
-- ---------------------------------------------------------------------------
create or replace function public.get_booked_slots(p_date date)
returns text[]
language sql
stable
security definer
set search_path = public
as $$
  with all_slots as (
    select unnest(array[
      '9:30 AM – 11:30 AM',
      '11:30 AM – 1:30 PM',
      '1:30 PM – 3:30 PM',
      '3:30 PM – 5:30 PM',
      '5:30 PM – 7:30 PM',
      '7:30 PM – 9:30 PM',
      '9:30 PM – 11:30 PM'
    ]::text[]) as slot
  ),
  booked as (
    select time_slot as slot from public.bookings
    where preferred_date = p_date
      and booking_status in ('pending_payment', 'confirmed', 'in_progress')
  ),
  blocked as (
    select time_slot as slot from public.blocked_slots
    where block_date = p_date and time_slot is not null
  ),
  whole_day as (
    select exists (
      select 1 from public.blocked_slots where block_date = p_date and time_slot is null
    ) as blocked
  )
  select coalesce(array_agg(distinct u.slot), '{}'::text[])
  from (
    select slot from booked
    union
    select slot from blocked
    union
    select slot from all_slots where (select blocked from whole_day)
  ) u
  where u.slot is not null;
$$;

grant execute on function public.get_booked_slots(date) to anon, authenticated;
