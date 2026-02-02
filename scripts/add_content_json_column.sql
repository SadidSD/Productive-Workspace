-- Run this in your Supabase SQL Editor

ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS content_json JSONB DEFAULT '{}'::jsonb;

-- Force schema cache reload to ensure PostgREST picks up the new column
NOTIFY pgrst, 'reload config';
