-- ============================================
-- Drop tech_stack — unified into skills (single source)
-- Data already migrated in 00005_unify_skills.sql
-- ============================================

-- Drop policies first (if any remain)
DO $$ 
DECLARE r RECORD;
BEGIN
  FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'tech_stack') LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON tech_stack', r.policyname);
  END LOOP;
END $$;

DROP TABLE IF EXISTS tech_stack CASCADE;

-- Clean up references in old migrations comments — no-op
