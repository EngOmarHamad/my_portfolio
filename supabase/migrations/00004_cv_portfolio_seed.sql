-- Copy the independent Create CV defaults into the existing portfolio editors.
-- Existing rows are preserved; each section only receives missing items.
-- Replace only the untouched sample identity from the initial schema.
UPDATE hero existing
SET name = identity.content ->> 'fullName', title = identity.content ->> 'title',
  short_description = identity.content ->> 'summary', long_description = identity.content ->> 'summary',
  location = identity.content ->> 'location'
FROM cv_entries identity
WHERE identity.kind = 'identity' AND existing.name = 'Omar Mohammad Ali Hamad'
  AND existing.title = 'Computer Science Student'
  AND existing.short_description = 'Computer Science student at Al-Aqsa University. Passionate about software development, problem-solving, and building modern applications.';

UPDATE about existing
SET biography = identity.content ->> 'summary',
  languages = ARRAY(SELECT content ->> 'language' FROM cv_entries WHERE kind = 'languages' ORDER BY display_order)
FROM cv_entries identity
WHERE identity.kind = 'identity'
  AND existing.biography = 'I am Omar Mohammad Ali Hamad, a Computer Science student at the Faculty of Computing and Information Technology, Al-Aqsa University. I am passionate about software development and continuously expanding my skills in programming, web development, and emerging technologies.';

UPDATE contact_info existing
SET location = identity.content ->> 'location'
FROM cv_entries identity
WHERE identity.kind = 'identity' AND existing.location = 'Palestine, Gaza'
  AND existing.email = identity.content ->> 'email';

INSERT INTO hero (name, title, short_description, long_description, location)
SELECT content ->> 'fullName', content ->> 'title', content ->> 'summary', content ->> 'summary', content ->> 'location'
FROM cv_entries
WHERE kind = 'identity' AND NOT EXISTS (SELECT 1 FROM hero);

INSERT INTO about (biography, languages, personal_info)
SELECT identity.content ->> 'summary',
  ARRAY(SELECT content ->> 'language' FROM cv_entries WHERE kind = 'languages' ORDER BY display_order),
  jsonb_build_object('email', identity.content ->> 'email', 'phone', identity.content ->> 'phone')
FROM cv_entries identity
WHERE identity.kind = 'identity' AND NOT EXISTS (SELECT 1 FROM about);

INSERT INTO contact_info (email, phone, location)
SELECT content ->> 'email', content ->> 'phone', content ->> 'location'
FROM cv_entries
WHERE kind = 'identity' AND NOT EXISTS (SELECT 1 FROM contact_info);

INSERT INTO skill_categories (name, slug, display_order)
SELECT DISTINCT content ->> 'category',
  lower(regexp_replace(content ->> 'category', '[^a-zA-Z0-9]+', '-', 'g')),
  0
FROM cv_entries entry
WHERE kind = 'skills' AND NULLIF(content ->> 'category', '') IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM skill_categories category WHERE category.name = entry.content ->> 'category')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO skills (category_id, title, percentage, display_order)
SELECT category.id, entry.content ->> 'name',
  CASE entry.content ->> 'level' WHEN 'Expert' THEN 95 WHEN 'Advanced' THEN 85 WHEN 'Intermediate' THEN 70 ELSE 60 END,
  entry.display_order
FROM cv_entries entry
LEFT JOIN skill_categories category ON category.name = entry.content ->> 'category'
WHERE entry.kind = 'skills' AND NOT EXISTS (SELECT 1 FROM skills skill WHERE skill.title = entry.content ->> 'name');

INSERT INTO tech_stack (name, category, proficiency, display_order)
SELECT entry.content ->> 'name', entry.content ->> 'category',
  CASE entry.content ->> 'level' WHEN 'Expert' THEN 95 WHEN 'Advanced' THEN 85 WHEN 'Intermediate' THEN 70 ELSE 60 END,
  entry.display_order
FROM cv_entries entry
WHERE entry.kind = 'skills' AND NOT EXISTS (SELECT 1 FROM tech_stack tech WHERE tech.name = entry.content ->> 'name');

INSERT INTO experience (company, position, description, start_date, end_date, is_current, display_order)
SELECT content ->> 'organization', content ->> 'position', content ->> 'description',
  to_date(content ->> 'start_date', 'FMMonth YYYY'),
  CASE WHEN content ->> 'end_date' = 'Present' THEN NULL ELSE to_date(content ->> 'end_date', 'FMMonth YYYY') END,
  content ->> 'end_date' = 'Present', display_order
FROM cv_entries entry
WHERE kind = 'experience' AND NOT EXISTS (
  SELECT 1 FROM experience existing WHERE existing.company = entry.content ->> 'organization'
    AND existing.position = entry.content ->> 'position'
);

INSERT INTO education (university, degree, description, start_date, end_date, display_order)
SELECT content ->> 'institution', content ->> 'degree',
  concat_ws(E'\n', NULLIF(content ->> 'description', ''), NULLIF(content ->> 'gpa', '')),
  to_date(content ->> 'start_date', 'FMMonth YYYY'),
  to_date(content ->> 'end_date', 'FMMonth YYYY'), display_order
FROM cv_entries entry
WHERE kind = 'education' AND NOT EXISTS (
  SELECT 1 FROM education existing WHERE existing.university = entry.content ->> 'institution'
    AND existing.degree = entry.content ->> 'degree'
);

INSERT INTO certificates (title, issuer, issue_date, credential_url, display_order)
SELECT content ->> 'title', content ->> 'issuer', to_date(content ->> 'issue_date', 'DD FMMonth YYYY'),
  COALESCE(content ->> 'credential_url', ''), display_order
FROM cv_entries entry
WHERE kind = 'certifications' AND NOT EXISTS (SELECT 1 FROM certificates existing WHERE existing.title = entry.content ->> 'title');

INSERT INTO projects (title, slug, description, tech_stack, live_demo_url, status, display_order)
SELECT content ->> 'name', 'cv-project-' || display_order,
  content ->> 'description', ARRAY(SELECT jsonb_array_elements_text(content -> 'technologies')),
  COALESCE(content ->> 'link', ''), 'published', display_order
FROM cv_entries entry
WHERE kind = 'projects' AND NOT EXISTS (SELECT 1 FROM projects existing WHERE existing.title = entry.content ->> 'name')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO achievements (title, description, display_order)
SELECT content ->> 'title', content ->> 'description', display_order
FROM cv_entries entry
WHERE kind = 'achievements' AND NOT EXISTS (SELECT 1 FROM achievements existing WHERE existing.title = entry.content ->> 'title');

INSERT INTO social_links (platform, label, url, display_order)
SELECT content ->> 'platform', content ->> 'platform', content ->> 'url', display_order
FROM cv_entries entry
WHERE kind = 'socialLinks' AND NOT EXISTS (SELECT 1 FROM social_links existing WHERE existing.url = entry.content ->> 'url');
