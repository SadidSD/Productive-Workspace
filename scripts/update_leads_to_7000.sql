-- Update all existing leads to have a value of 7000
UPDATE leads SET value = 7000;

-- Alter table leads to make 7000 the default value for new leads
ALTER TABLE leads ALTER COLUMN value SET DEFAULT 7000;
