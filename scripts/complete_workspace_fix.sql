-- PART 1: CLEANUP POLICIES ONLY
-- We drop old policies ensuring a clean state for the tables we are fixing.
-- We DO NOT drop the function because other tables depend on it. We will replace it in-place.
drop policy if exists "Users can view members of their workspaces" on public.workspace_members;
drop policy if exists "Users can view workspaces they belong to" on public.workspaces;
drop policy if exists "Authenticated users can create workspaces" on public.workspaces;
drop policy if exists "Users can insert their own membership" on public.workspace_members;

-- PART 2: HELPER FUNCTION FOR VIEWING (SELECT) - IN-PLACE UPDATE
-- We match the existing parameter name 'ws_id' to avoid errors.
create or replace function public.is_workspace_member(ws_id uuid)
returns boolean as $$
begin
  return exists (
    select 1
    from public.workspace_members
    where workspace_id = ws_id
    and user_id = auth.uid()
  );
end;
$$ language plpgsql security definer set search_path = public;

-- PART 3: RE-APPLY VIEWING POLICIES
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;

create policy "Users can view members of their workspaces"
on public.workspace_members for select
to authenticated
using ( is_workspace_member(workspace_id) or user_id = auth.uid() );

create policy "Users can view workspaces they belong to"
on public.workspaces for select
to authenticated
using ( is_workspace_member(id) );

-- PART 4: RPC FUNCTION FOR CREATION (INSERT)
-- This replaces the direct client-side INSERT, bypassing RLS issues entirely.
create or replace function public.create_new_workspace(name text, slug text)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  new_ws_id uuid;
  new_ws json;
begin
  -- 1. Insert Workspace
  insert into public.workspaces (name, slug)
  values (name, slug)
  returning id into new_ws_id;

  -- 2. Insert Member (Owner)
  insert into public.workspace_members (workspace_id, user_id, role)
  values (new_ws_id, auth.uid(), 'owner');

  -- 3. Return the new workspace as JSON
  select row_to_json(w) into new_ws from public.workspaces w where id = new_ws_id;
  return new_ws;
end;
$$;
