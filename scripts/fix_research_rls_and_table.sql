-- Enable RLS on research_entries
ALTER TABLE research_entries ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all authenticated users to full access (for now, to fix the blocker)
-- In production, strict workspace isolation policies should be applied.
CREATE POLICY "Allow full access to research_entries for authenticated users"
ON research_entries
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Ensure research_insights table exists (Layer 4)
CREATE TABLE IF NOT EXISTS research_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inquiry_id UUID NOT NULL REFERENCES research_entries(id) ON DELETE CASCADE,
    statement TEXT NOT NULL,
    context TEXT,
    evidence_url TEXT,
    confidence TEXT CHECK (confidence IN ('low', 'medium', 'high')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on research_insights
ALTER TABLE research_insights ENABLE ROW LEVEL SECURITY;

-- Create policy for research_insights
CREATE POLICY "Allow full access to research_insights for authenticated users"
ON research_insights
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
