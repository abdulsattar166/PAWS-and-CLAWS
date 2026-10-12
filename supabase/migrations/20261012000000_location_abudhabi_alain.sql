-- ============================================================================
-- Business service location shown in the footer and on the Contact page.
-- Set it to "Abu Dhabi & Al Ain" (idempotent — safe to re-run).
-- ============================================================================

update public.site_settings
set value = jsonb_set(coalesce(value, '{}'::jsonb), '{address}', '"Abu Dhabi & Al Ain"'::jsonb, true),
    updated_at = now()
where key = 'contact';
