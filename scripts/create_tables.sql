-- 1. Create Projects Table
create table if not exists public.projects (
  id uuid default gen_random_uuid() primary key,
  workspace_id uuid references public.workspaces(id) on delete cascade not null,
  system_id uuid, -- Optional link to system
  name text not null,
  description text,
  status text check (status in ('planning', 'active', 'paused', 'completed')) default 'planning',
  start_date timestamp with time zone,
  target_date timestamp with time zone,
  created_at timestamp with time zone default now() not null,
  content_json jsonb,
  updated_at timestamp with time zone default now()
);

-- 2. Create Tasks Table
create table if not exists public.tasks (
  id uuid default gen_random_uuid() primary key,
  workspace_id uuid references public.workspaces(id) on delete cascade not null,
  project_id uuid references public.projects(id) on delete set null, -- Task can exist without project
  title text not null,
  description text,
  status text check (status in ('todo', 'in_progress', 'review', 'done')) default 'todo',
  priority text check (priority in ('low', 'medium', 'high')) default 'medium',
  assignee_id uuid references auth.users(id) on delete set null,
  due_date timestamp with time zone,
  created_at timestamp with time zone default now() not null
);

-- 3. Enable RLS
alter table public.projects enable row level security;
alter table public.tasks enable row level security;

-- 4. Projects Policies (Re-applying from previous step just in case)
drop policy if exists "Members can view projects" on public.projects;
drop policy if exists "Members can create projects" on public.projects;
drop policy if exists "Members can update projects" on public.projects;

create policy "Members can view projects" on public.projects for select to authenticated using ( is_workspace_member(workspace_id) );
create policy "Members can create projects" on public.projects for insert to authenticated with check ( is_workspace_member(workspace_id) );
create policy "Members can update projects" on public.projects for update to authenticated using ( is_workspace_member(workspace_id) );

-- 5. Tasks Policies (Re-applying from previous step)
drop policy if exists "Members can view tasks" on public.tasks;
drop policy if exists "Members can create tasks" on public.tasks;
drop policy if exists "Members can update tasks" on public.tasks;

create policy "Members can view tasks" on public.tasks for select to authenticated using ( is_workspace_member(workspace_id) );
create policy "Members can create tasks" on public.tasks for insert to authenticated with check ( is_workspace_member(workspace_id) );
create policy "Members can update tasks" on public.tasks for update to authenticated using ( is_workspace_member(workspace_id) );
