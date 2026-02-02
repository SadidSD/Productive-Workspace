-- 1. Drop the problematic policies (Looping ones)
-- We do NOT drop the function, we update it.
drop policy if exists "Users can view members of their workspaces" on public.workspace_members;
drop policy if exists "Users can view workspaces they belong to" on public.workspaces;

-- 2. Update the helper function
-- CRITICAL: We use 'ws_id' as the parameter name because that's what the database already has.
-- Changing the parameter name causes an error.
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
$$ language plpgsql security definer;

-- 3. Re-create Policy: Members
create policy "Users can view members of their workspaces"
on public.workspace_members for select
to authenticated
using ( is_workspace_member(workspace_id) or user_id = auth.uid() );

-- 4. Re-create Policy: Workspaces
create policy "Users can view workspaces they belong to"
on public.workspaces for select
to authenticated
using ( is_workspace_member(id) );
