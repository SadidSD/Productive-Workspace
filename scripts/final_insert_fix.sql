-- 1. Workspaces: Allow Creation
-- This is likely the missing policy causing the 403 on POST /workspaces
drop policy if exists "Authenticated users can create workspaces" on public.workspaces;

create policy "Authenticated users can create workspaces"
on public.workspaces for insert
to authenticated
with check (true);

-- 2. Workspace Members: Allow Self-Insertion
-- Needed for the second step of linking yourself to the new workspace
drop policy if exists "Users can insert their own membership" on public.workspace_members;

create policy "Users can insert their own membership"
on public.workspace_members for insert
to authenticated
with check ( auth.uid() = user_id );
