-- ============================================================
-- FIX: "Database error querying schema" on login
-- Cause: hand-inserted auth.users row left internal token
-- columns NULL; Supabase Auth (GoTrue) expects empty strings.
-- Run in: Supabase Dashboard -> SQL Editor -> New query -> Run
-- ============================================================

UPDATE auth.users
SET
  confirmation_token        = COALESCE(confirmation_token, ''),
  recovery_token            = COALESCE(recovery_token, ''),
  email_change              = COALESCE(email_change, ''),
  email_change_token_new    = COALESCE(email_change_token_new, ''),
  email_change_token_current= COALESCE(email_change_token_current, ''),
  phone_change              = COALESCE(phone_change, ''),
  phone_change_token        = COALESCE(phone_change_token, ''),
  reauthentication_token    = COALESCE(reauthentication_token, ''),
  email_confirmed_at        = COALESCE(email_confirmed_at, now())
WHERE email = 'admin@nouvelage.com';

-- Verify (optional):
-- SELECT email, email_confirmed_at, confirmation_token IS NULL AS token_is_null
-- FROM auth.users WHERE email = 'admin@nouvelage.com';
