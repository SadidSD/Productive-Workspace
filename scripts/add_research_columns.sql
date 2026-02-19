-- Add missing columns to research_entries table if they don't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'research_entries' AND column_name = 'question') THEN 
        ALTER TABLE research_entries ADD COLUMN question TEXT DEFAULT ''; 
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'research_entries' AND column_name = 'scope') THEN 
        ALTER TABLE research_entries ADD COLUMN scope TEXT DEFAULT ''; 
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'research_entries' AND column_name = 'content') THEN 
        ALTER TABLE research_entries ADD COLUMN content JSONB DEFAULT '{}'; 
    END IF;
END $$;
