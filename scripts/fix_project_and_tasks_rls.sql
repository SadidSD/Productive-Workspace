-- Enable RLS
alter table public.projects enable row level security;
alter table public.tasks enable row level security;

-- PROJECTS POLICIES
-- 1. View: Members can see projects in their workspace
create policy "Members can view projects"
on public.projects for select
to authenticated
using ( is_workspace_member(workspace_id) );

-- 2. Insert: Members can create projects in their workspace
create policy "Members can create projects"
on public.projects for insert
to authenticated
with check ( is_workspace_member(workspace_id) );

-- 3. Update: Members can update projects in their workspace
create policy "Members can update projects"
on public.projects for update
to authenticated
using ( is_workspace_member(workspace_id) );

-- TASKS POLICIES
-- 1. View: Members can see tasks in their workspace
create policy "Members can view tasks"
on public.tasks for select
to authenticated
using ( is_workspace_member(workspace_id) );

-- 2. Insert: Members can create tasks in their workspace
create policy "Members can create tasks"
on public.tasks for insert
to authenticated
with check ( is_workspace_member(workspace_id) );

-- 3. Update: Members can update tasks in their workspace
create policy "Members can update tasks"
on public.tasks for update
to authenticated
using ( is_workspace_member(workspace_id) );
