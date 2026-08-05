-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ROLES
create type user_role as enum ('owner', 'admin', 'editor', 'viewer');
create type decision_status as enum ('proposed', 'approved', 'reversed');
create type project_status as enum ('planning', 'active', 'paused', 'completed');

-- PROFILES (Users)
create table profiles (
  id uuid references auth.users not null primary key,
  full_name text,
  avatar_url text,
  created_at timestamptz default now()
);

-- WORKSPACES
create table workspaces (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  created_at timestamptz default now()
);

-- WORKSPACE MEMBERS
create table workspace_members (
  workspace_id uuid references workspaces(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  role user_role default 'viewer'::user_role,
  joined_at timestamptz default now(),
  primary key (workspace_id, user_id)
);

-- SYSTEMS (Conceptual Layer)
create table systems (
  id uuid default uuid_generate_v4() primary key,
  workspace_id uuid references workspaces(id) on delete cascade not null,
  name text not null,
  description text,
  created_at timestamptz default now()
);

-- PROJECTS (Execution Containers)
create table projects (
  id uuid default uuid_generate_v4() primary key,
  workspace_id uuid references workspaces(id) on delete cascade not null,
  system_id uuid references systems(id) on delete set null,
  name text not null,
  description text,
  status project_status default 'planning'::project_status,
  start_date date,
  target_date date,
  created_at timestamptz default now()
);

-- RESEARCH HUB
create table research_entries (
  id uuid default uuid_generate_v4() primary key,
  workspace_id uuid references workspaces(id) on delete cascade not null,
  title text not null,
  content jsonb default '{}'::jsonb, -- Tiptap JSON
  tags text[],
  created_by uuid references profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- INSIGHTS (Distilled Intelligence)
create table insights (
  id uuid default uuid_generate_v4() primary key,
  workspace_id uuid references workspaces(id) on delete cascade not null,
  statement text not null,
  context text,
  confidence_level integer check (confidence_level between 1 and 10),
  created_by uuid references profiles(id),
  created_at timestamptz default now()
);

-- DECISIONS (Institutional Memory)
create table decisions (
  id uuid default uuid_generate_v4() primary key,
  workspace_id uuid references workspaces(id) on delete cascade not null,
  title text not null,
  summary text,
  rationale text,
  status decision_status default 'proposed'::decision_status,
  approved_by uuid references profiles(id),
  decision_date date default CURRENT_DATE,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- LINKING TABLES (Many-to-Many Relationships)
-- Decision <-> System
create table decision_systems (
  decision_id uuid references decisions(id) on delete cascade,
  system_id uuid references systems(id) on delete cascade,
  primary key (decision_id, system_id)
);

-- Decision <-> Project (Impacted Projects)
create table decision_projects (
  decision_id uuid references decisions(id) on delete cascade,
  project_id uuid references projects(id) on delete cascade,
  primary key (decision_id, project_id)
);

-- Insight <-> Research (Source)
create table insight_sources (
  insight_id uuid references insights(id) on delete cascade,
  research_id uuid references research_entries(id) on delete cascade,
  primary key (insight_id, research_id)
);

-- DOCS (Pages)
create table docs (
  id uuid default uuid_generate_v4() primary key,
  workspace_id uuid references workspaces(id) on delete cascade not null,
  project_id uuid references projects(id) on delete cascade,
  parent_id uuid references docs(id) on delete cascade,
  title text not null,
  content jsonb default '{}'::jsonb, -- Block content
  is_published boolean default false,
  created_by uuid references profiles(id),
  last_edited_by uuid references profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS POLICIES (Example for Boards, similar for all)
alter table workspaces enable row level security;
alter table workspace_members enable row level security;
alter table systems enable row level security;
alter table projects enable row level security;
alter table research_entries enable row level security;
alter table insights enable row level security;
alter table decisions enable row level security;
alter table docs enable row level security;

-- Basic Policy: Users can see data if they are a member of the workspace
-- Note: This requires a helper function in a real deployment to avoid infinite recursion or performant joins.
-- For simplicity in this schema definition, we assume `auth.uid()` check against `workspace_members`.

create or replace function is_workspace_member(ws_id uuid)
returns boolean as $$
begin
  return exists (
    select 1 from workspace_members
    where workspace_id = ws_id
    and user_id = auth.uid()
  );
end;
$$ language plpgsql security definer;

-- Apply Policy (Read)
create policy "Members can view workspace data" on projects
  for select using (is_workspace_member(workspace_id));

-- Apply Policy (Write - Editors+)
create policy "Editors can insert projects" on projects
  for insert with check (
    is_workspace_member(workspace_id) AND
    exists (
      select 1 from workspace_members
      where workspace_id = projects.workspace_id
      and user_id = auth.uid()
      and role in ('owner', 'admin', 'editor')
    )
  );

-- ═══════════════════════════════════════════════════════════════════════════════
-- INSTAGRAM CONTENT PLANNER
-- ═══════════════════════════════════════════════════════════════════════════════

-- Instagram Content Types
create type ig_post_format as enum ('reel', 'carousel', 'story', 'live');
create type ig_post_status as enum ('idea', 'draft', 'scripted', 'shot', 'editing', 'ready', 'scheduled', 'published', 'missed');
create type ig_content_pillar as enum ('platform_pain', 'solution', 'education', 'comparison', 'case_study');
create type ig_script_formula as enum ('problem_agitate_solve', 'before_after_bridge', 'list', 'opinion_reasoning');
create type ig_funnel_stage as enum ('awareness', 'education', 'trust', 'conversion');

-- Instagram Posts
create table instagram_posts (
  id uuid default uuid_generate_v4() primary key,
  workspace_id uuid references workspaces(id) on delete cascade not null,
  title text not null,
  caption text,
  format ig_post_format default 'reel',
  pillar ig_content_pillar,
  script_formula ig_script_formula,
  funnel_stage ig_funnel_stage,
  status ig_post_status default 'idea',

  -- Script structure (Hook → Retain → Reward)
  hook_text text,
  retain_text text,
  reward_text text,

  -- Scripting Studio fields
  full_script text,                             -- Spoken dialogue / teleprompter script
  broll_notes text,                             -- Visual shot list & B-roll directions
  text_overlays text,                           -- On-screen graphics & captions
  audio_cues text,                              -- Music, sound effects & audio cues

  -- VVA framework
  has_value boolean default false,
  has_vulnerability boolean default false,
  has_authority boolean default false,

  -- Metadata
  hashtags text[],
  scheduled_date date,
  scheduled_time time,
  cta text default 'DM me ''TCG'' to see how I can help.',
  media_notes text,
  notes text,

  created_by uuid references profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Engagement Checklist (daily tracking)
create table ig_engagement_checklist (
  id uuid default uuid_generate_v4() primary key,
  workspace_id uuid references workspaces(id) on delete cascade not null,
  check_date date not null default CURRENT_DATE,
  engaged_tcg_content boolean default false,
  replied_comments_dms boolean default false,
  dmed_store_owners boolean default false,
  watched_tcg_reels boolean default false,
  created_at timestamptz default now(),
  unique(workspace_id, check_date)
);

-- RLS
alter table instagram_posts enable row level security;
alter table ig_engagement_checklist enable row level security;

-- Instagram Posts Policies
create policy "Members can view instagram posts" on instagram_posts
  for select using (is_workspace_member(workspace_id));

create policy "Editors can insert instagram posts" on instagram_posts
  for insert with check (
    is_workspace_member(workspace_id) AND
    exists (
      select 1 from workspace_members
      where workspace_id = instagram_posts.workspace_id
      and user_id = auth.uid()
      and role in ('owner', 'admin', 'editor')
    )
  );

create policy "Editors can update instagram posts" on instagram_posts
  for update using (
    is_workspace_member(workspace_id) AND
    exists (
      select 1 from workspace_members
      where workspace_id = instagram_posts.workspace_id
      and user_id = auth.uid()
      and role in ('owner', 'admin', 'editor')
    )
  );

create policy "Editors can delete instagram posts" on instagram_posts
  for delete using (
    is_workspace_member(workspace_id) AND
    exists (
      select 1 from workspace_members
      where workspace_id = instagram_posts.workspace_id
      and user_id = auth.uid()
      and role in ('owner', 'admin', 'editor')
    )
  );

-- Engagement Checklist Policies
create policy "Members can view engagement checklist" on ig_engagement_checklist
  for select using (is_workspace_member(workspace_id));

create policy "Editors can insert engagement checklist" on ig_engagement_checklist
  for insert with check (is_workspace_member(workspace_id));

create policy "Editors can update engagement checklist" on ig_engagement_checklist
  for update using (is_workspace_member(workspace_id));
