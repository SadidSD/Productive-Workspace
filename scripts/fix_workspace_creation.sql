-- Enable RLS on workspaces
alter table public.workspaces enable row level security;

-- 1. Allow any authenticated user to create a new workspace
-- This is necessary because when you create a workspace, you are not a member yet (until the next transaction).
create policy "Authenticated users can create workspaces"
on public.workspaces for insert
to authenticated
with check (true);

-- 2. Allow users to view workspaces they belong to
create policy "Users can view workspaces they belong to"
on public.workspaces for select
to authenticated
using (
  exists (
    select 1 from workspace_members
    where workspace_members.workspace_id = workspaces.id
    and workspace_members.user_id = auth.uid()
  )
);

-- 3. Allow workspace owners/admins to update their workspace
create policy "Owners and admins can update workspaces"
on public.workspaces for update
to authenticated
using (
  exists (
    select 1 from workspace_members
    where workspace_members.workspace_id = workspaces.id
    and workspace_members.user_id = auth.uid()
    and workspace_members.role in ('owner', 'admin')
  )
);

-- 4. Workspace Members: Allow users to view members of their workspaces
alter table public.workspace_members enable row level security;

create policy "Users can view members of their workspaces"
on public.workspace_members for select
to authenticated
using (
  exists (
    select 1 from workspace_members as my_membership
    where my_membership.workspace_id = workspace_members.workspace_id
    and my_membership.user_id = auth.uid()
  )
);

-- 5. Workspace Members: Allow self-insert (needed during workspace creation)
-- When creating a workspace, the backend/client inserts the creator as the first member.
create policy "Users can insert their own membership"
on public.workspace_members for insert
to authenticated
with check (
  auth.uid() = user_id
);
