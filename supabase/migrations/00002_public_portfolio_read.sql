-- Public visitors can read only content that is visible on the portfolio.
-- Admin and contact-message policies from the initial schema remain unchanged.
DO $$
DECLARE
  table_name text;
BEGIN
  FOREACH table_name IN ARRAY ARRAY[
    'hero', 'about', 'skills', 'services', 'experience', 'education',
    'certificates', 'testimonials', 'achievements', 'contact_info',
    'tech_stack', 'timeline_items'
  ] LOOP
    EXECUTE format(
      'CREATE POLICY "Public read published" ON %I FOR SELECT TO anon USING (is_published = true)',
      table_name
    );
  END LOOP;
END;
$$;

CREATE POLICY "Public read published" ON projects
  FOR SELECT TO anon USING (status = 'published');

CREATE POLICY "Public read published" ON blog_posts
  FOR SELECT TO anon USING (status = 'published');

CREATE POLICY "Public read active" ON social_links
  FOR SELECT TO anon USING (is_active = true);

CREATE POLICY "Public read active" ON resume
  FOR SELECT TO anon USING (is_active = true);

CREATE POLICY "Public read project images" ON project_images
  FOR SELECT TO anon USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = project_images.project_id AND projects.status = 'published')
  );

CREATE POLICY "Public read gallery" ON gallery_images
  FOR SELECT TO anon USING (true);

CREATE POLICY "Public read gallery categories" ON gallery_categories
  FOR SELECT TO anon USING (true);

CREATE POLICY "Public read skill categories" ON skill_categories
  FOR SELECT TO anon USING (true);

CREATE POLICY "Public read metadata" ON seo
  FOR SELECT TO anon USING (true);
