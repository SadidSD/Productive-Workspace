-- Leads Migration for Kortex
-- Run this in the Supabase SQL Editor

-- Create enums for lead pipeline
create type lead_status as enum ('new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost');
create type lead_source as enum ('website', 'referral', 'social', 'cold_outreach', 'event', 'other');

-- Create leads table
create table leads (
  id            uuid default uuid_generate_v4() primary key,
  workspace_id  uuid references workspaces(id) on delete cascade not null,

  -- Contact Info
  name          text not null,
  email         text,
  phone         text,
  company       text,

  -- Pipeline
  status        lead_status default 'new'::lead_status,
  source        lead_source default 'other'::lead_source,
  value         numeric(12,2),

  -- Details
  notes         text,
  tags          text[],

  -- Ownership
  assigned_to   uuid references profiles(id),

  -- Timestamps
  last_contacted_at timestamptz,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- Enable RLS
alter table leads enable row level security;

-- Read policy
create policy "Members can view leads" on leads
  for select using (is_workspace_member(workspace_id));

-- Insert policy
create policy "Editors can insert leads" on leads
  for insert with check (
    is_workspace_member(workspace_id) AND
    exists (
      select 1 from workspace_members
      where workspace_id = leads.workspace_id
      and user_id = auth.uid()
      and role in ('owner', 'admin', 'editor')
    )
  );

-- Update policy
create policy "Editors can update leads" on leads
  for update using (
    is_workspace_member(workspace_id) AND
    exists (
      select 1 from workspace_members
      where workspace_id = leads.workspace_id
      and user_id = auth.uid()
      and role in ('owner', 'admin', 'editor')
    )
  );

-- Delete policy
create policy "Editors can delete leads" on leads
  for delete using (
    is_workspace_member(workspace_id) AND
    exists (
      select 1 from workspace_members
      where workspace_id = leads.workspace_id
      and user_id = auth.uid()
      and role in ('owner', 'admin', 'editor')
    )
  );
