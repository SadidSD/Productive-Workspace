-- The profiles table FK to auth.users was created without ON DELETE CASCADE,
-- which blocks deletion of users from the Supabase Auth UI.
-- This re-creates the constraint with CASCADE so deleting an auth user
-- automatically removes their profile (and workspace_members cascades from there).

alter table public.profiles
  drop constraint profiles_id_fkey;

alter table public.profiles
  add constraint profiles_id_fkey
  foreign key (id) references auth.users(id) on delete cascade;
