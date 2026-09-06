-- ============================================================
-- Create ONE admin user in Supabase Auth (built-in auth.users)
-- Run this in: Supabase Dashboard -> SQL Editor -> New query -> Run
-- ============================================================
-- 1) EDIT the two values below, then run the whole script.

DO $$
DECLARE
  admin_email    text := 'admin@nouvelage.com';      -- <-- change to your admin email
  admin_password text := 'ChangeMe_Strong#2026';     -- <-- change to a strong password
  new_id         uuid := gen_random_uuid();
BEGIN
  -- make sure bcrypt functions are available
  CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

  -- create the auth user
  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, created_at, updated_at,
    raw_app_meta_data, raw_user_meta_data
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    new_id,
    'authenticated',
    'authenticated',
    admin_email,
    crypt(admin_password, gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}',
    '{"name":"Admin","role":"super_admin"}'
  );

  -- create the matching email identity (required to log in with email/password)
  INSERT INTO auth.identities (
    provider_id, user_id, identity_data, provider,
    last_sign_in_at, created_at, updated_at
  ) VALUES (
    new_id::text,
    new_id,
    json_build_object('sub', new_id::text, 'email', admin_email),
    'email',
    now(), now(), now()
  );

  RAISE NOTICE 'Admin created: %', admin_email;
END $$;

-- 2) Verify it worked (optional):
-- SELECT id, email, email_confirmed_at, raw_user_meta_data
-- FROM auth.users WHERE email = 'admin@nouvelage.com';
