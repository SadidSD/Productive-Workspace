SELECT 
    tablename, 
    rowsecurity 
FROM pg_tables 
WHERE tablename = 'research_entries';

SELECT * FROM pg_policies WHERE tablename = 'research_entries';
