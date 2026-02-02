-- 1. Profiles: Enable RLS
alter table public.profiles enable row level security;

-- Profiles: Allow authenticated users to view all profiles (needed to see team member names)
create policy "Profiles are viewable by everyone" on public.profiles
  for select using ( auth.role() = 'authenticated' );

-- Profiles: Allow users to update their own profile
create policy "Users can update own profile" on public.profiles
  for update using ( auth.uid() = id );

-- Profiles: Insert handled by trigger/postgres, but allow self-insert just in case
create policy "Users can insert own profile" on public.profiles
  for insert with check ( auth.uid() = id );

-- 2. Junction Tables: Enable RLS
alter table public.decision_projects enable row level security;
alter table public.decision_systems enable row level security;
alter table public.insight_sources enable row level security;

-- Decision Projects: Allow access if member of the workspace (via decision)
create policy "Workspace members can manage decision_projects" on public.decision_projects
  for all using (
    exists (
      select 1 from decisions
      where decisions.id = decision_id
      and is_workspace_member(decisions.workspace_id)
    )
  );

-- Decision Systems: Allow access if member of the workspace (via decision)
create policy "Workspace members can manage decision_systems" on public.decision_systems
  for all using (
    exists (
      select 1 from decisions
      where decisions.id = decision_id
      and is_workspace_member(decisions.workspace_id)
    )
  );

-- Insight Sources: Allow access if member of the workspace (via insight)
create policy "Workspace members can manage insight_sources" on public.insight_sources
  for all using (
    exists (
      select 1 from insights
      where insights.id = insight_id
      and is_workspace_member(insights.workspace_id)
    )
  );
