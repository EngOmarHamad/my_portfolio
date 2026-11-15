-- ============================================
-- Unify skills: skills + tech_stack + cv_entries(kind=skills) -> single source `skills`
-- Categories are free: admin can add via skill_categories (already free)
-- ============================================

-- 1) Add level column to skills for CV compatibility (Expert/Advanced/Intermediate)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='skills' AND column_name='level') THEN
    ALTER TABLE skills ADD COLUMN level TEXT DEFAULT 'Advanced';
  END IF;
END $$;

-- Add description for CV grouping (optional)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='skills' AND column_name='description') THEN
    ALTER TABLE skills ADD COLUMN description TEXT DEFAULT '';
  END IF;
END $$;

-- 2) Migrate tech_stack categories into skill_categories (free categories)
INSERT INTO skill_categories (name, slug, description, display_order)
SELECT DISTINCT
  TRIM(t.category) as name,
  LOWER(REPLACE(TRIM(t.category), ' ', '-')) || '-tech' as slug,
  'Migrated from tech_stack' as description,
  100 + ROW_NUMBER() OVER (ORDER BY TRIM(t.category)) as display_order
FROM tech_stack t
WHERE TRIM(t.category) <> '' 
  AND NOT EXISTS (
    SELECT 1 FROM skill_categories sc WHERE LOWER(sc.name) = LOWER(TRIM(t.category))
  )
ON CONFLICT (slug) DO NOTHING;

-- 3) Migrate tech_stack rows into skills (unified)
INSERT INTO skills (category_id, title, icon, color, percentage, level, display_order, is_featured, is_published)
SELECT
  (SELECT id FROM skill_categories WHERE LOWER(name) = LOWER(TRIM(t.category)) LIMIT 1),
  t.name,
  t.icon,
  '#256F6C' as color,
  t.proficiency,
  CASE 
    WHEN t.proficiency >= 85 THEN 'Expert'
    WHEN t.proficiency >= 70 THEN 'Advanced'
    ELSE 'Intermediate'
  END as level,
  t.display_order + 1000,
  false,
  t.is_published
FROM tech_stack t
WHERE NOT EXISTS (
  SELECT 1 FROM skills s WHERE LOWER(s.title) = LOWER(TRIM(t.name))
)
ON CONFLICT DO NOTHING;

-- 4) Migrate cv_entries skills into skills (if not already present)
-- cv_entries content: {name, category, level}
INSERT INTO skills (category_id, title, icon, percentage, level, display_order, is_featured, is_published)
SELECT
  COALESCE(
    (SELECT id FROM skill_categories WHERE LOWER(name) = LOWER(TRIM(e.content->>'category')) LIMIT 1),
    (SELECT id FROM skill_categories WHERE slug = 'backend-development' LIMIT 1)
  ) as category_id,
  e.content->>'name' as title,
  'code' as icon,
  CASE 
    WHEN e.content->>'level' = 'Expert' THEN 90
    WHEN e.content->>'level' = 'Advanced' THEN 80
    WHEN e.content->>'level' = 'Intermediate' THEN 65
    ELSE 75
  END as percentage,
  COALESCE(e.content->>'level', 'Advanced') as level,
  e.display_order + 2000,
  false,
  e.is_public
FROM cv_entries e
WHERE e.kind = 'skills'
  AND e.content->>'name' IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM skills s WHERE LOWER(s.title) = LOWER(TRIM(e.content->>'name'))
  )
ON CONFLICT DO NOTHING;

-- 5) Create view for backward compatibility: tech_stack as view of skills (optional, keep table for now)
-- Instead, we keep tech_stack data but portfolioService will now read from skills where needed.
-- Add index for level filtering
CREATE INDEX IF NOT EXISTS idx_skills_level ON skills(level);
CREATE INDEX IF NOT EXISTS idx_skills_category_level ON skills(category_id, level);

-- 6) Ensure RLS still allows public read of skills (already exists)
-- Add comment for documentation
COMMENT ON TABLE skills IS 'Unified skills table — single source for portfolio, tech_stack, and CV. Categories are free via skill_categories.';
COMMENT ON COLUMN skills.level IS 'CV level: Expert/Advanced/Intermediate — synced from cv_entries';
