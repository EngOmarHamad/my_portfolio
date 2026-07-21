-- ============================================
-- Portfolio CMS - Complete Database Schema
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create admin user table (single admin)
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- HERO SECTION
-- ============================================
CREATE TABLE hero (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT '',
  short_description TEXT DEFAULT '',
  long_description TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  background_image_url TEXT DEFAULT '',
  resume_button_text TEXT DEFAULT 'Download CV',
  resume_button_url TEXT DEFAULT '',
  availability TEXT DEFAULT 'Available for work',
  location TEXT DEFAULT '',
  typing_animation_texts TEXT[] DEFAULT '{}',
  statistics JSONB DEFAULT '[]',
  cta_buttons JSONB DEFAULT '[]',
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ABOUT SECTION
-- ============================================
CREATE TABLE about (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_image_url TEXT DEFAULT '',
  biography TEXT DEFAULT '',
  years_experience INTEGER DEFAULT 0,
  languages TEXT[] DEFAULT '{}',
  interests TEXT[] DEFAULT '{}',
  highlights JSONB DEFAULT '[]',
  personal_info JSONB DEFAULT '{}',
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SKILLS
-- ============================================
CREATE TABLE skill_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT DEFAULT '',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES skill_categories(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  icon TEXT DEFAULT '',
  color TEXT DEFAULT '',
  percentage INTEGER DEFAULT 0,
  display_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PROJECTS
-- ============================================
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT DEFAULT '',
  long_description TEXT DEFAULT '',
  thumbnail_url TEXT DEFAULT '',
  category TEXT DEFAULT '',
  tech_stack TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  github_url TEXT DEFAULT '',
  live_demo_url TEXT DEFAULT '',
  case_study TEXT DEFAULT '',
  features JSONB DEFAULT '[]',
  challenges TEXT DEFAULT '',
  solutions TEXT DEFAULT '',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  is_featured BOOLEAN DEFAULT false,
  completion_date TIMESTAMPTZ,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE project_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT DEFAULT '',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SERVICES
-- ============================================
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  icon TEXT DEFAULT '',
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  price DECIMAL(10,2),
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- EXPERIENCE
-- ============================================
CREATE TABLE experience (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  description TEXT DEFAULT '',
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  logo_url TEXT DEFAULT '',
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- EDUCATION
-- ============================================
CREATE TABLE education (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  university TEXT NOT NULL,
  degree TEXT NOT NULL,
  department TEXT DEFAULT '',
  description TEXT DEFAULT '',
  gpa DECIMAL(3,2),
  start_date DATE NOT NULL,
  end_date DATE,
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CERTIFICATES
-- ============================================
CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  issue_date DATE,
  credential_url TEXT DEFAULT '',
  certificate_image_url TEXT DEFAULT '',
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TESTIMONIALS
-- ============================================
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name TEXT NOT NULL,
  company TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  review TEXT NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ACHIEVEMENTS
-- ============================================
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  icon TEXT DEFAULT '',
  date DATE,
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- BLOG
-- ============================================
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT DEFAULT '',
  content TEXT DEFAULT '',
  cover_image_url TEXT DEFAULT '',
  tags TEXT[] DEFAULT '{}',
  reading_time INTEGER DEFAULT 0,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  meta_title TEXT DEFAULT '',
  meta_description TEXT DEFAULT '',
  canonical_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- GALLERY
-- ============================================
CREATE TABLE gallery_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE gallery_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES gallery_categories(id) ON DELETE SET NULL,
  url TEXT NOT NULL,
  alt_text TEXT DEFAULT '',
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CONTACT INFORMATION
-- ============================================
CREATE TABLE contact_info (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  location TEXT DEFAULT '',
  working_hours TEXT DEFAULT '',
  google_map_embed_url TEXT DEFAULT '',
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact Messages (from visitors)
CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT DEFAULT '',
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SOCIAL LINKS
-- ============================================
CREATE TABLE social_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  platform TEXT NOT NULL,
  label TEXT DEFAULT '',
  url TEXT NOT NULL,
  icon TEXT DEFAULT '',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TECH STACK
-- ============================================
CREATE TABLE tech_stack (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  icon TEXT DEFAULT '',
  category TEXT DEFAULT '',
  proficiency INTEGER DEFAULT 0,
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TIMELINE
-- ============================================
CREATE TABLE timeline_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  year TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT DEFAULT '',
  description TEXT DEFAULT '',
  type TEXT NOT NULL CHECK (type IN ('education', 'experience', 'certification', 'achievement')),
  icon TEXT DEFAULT '',
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- RESUME
-- ============================================
CREATE TABLE resume (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  file_url TEXT NOT NULL,
  file_name TEXT DEFAULT '',
  file_size INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SEO
-- ============================================
CREATE TABLE seo (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_title TEXT DEFAULT '',
  site_description TEXT DEFAULT '',
  keywords TEXT[] DEFAULT '{}',
  og_title TEXT DEFAULT '',
  og_description TEXT DEFAULT '',
  og_image_url TEXT DEFAULT '',
  twitter_card TEXT DEFAULT 'summary_large_image',
  twitter_handle TEXT DEFAULT '',
  favicon_url TEXT DEFAULT '',
  robots TEXT DEFAULT 'index, follow',
  canonical_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SETTINGS
-- ============================================
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  theme TEXT DEFAULT 'system',
  website_status TEXT DEFAULT 'online' CHECK (website_status IN ('online', 'maintenance', 'offline')),
  maintenance_mode BOOLEAN DEFAULT false,
  google_analytics_id TEXT DEFAULT '',
  google_search_console_id TEXT DEFAULT '',
  custom_head_scripts TEXT DEFAULT '',
  custom_body_scripts TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_skills_category ON skills(category_id);
CREATE INDEX idx_skills_featured ON skills(is_featured);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_featured ON projects(is_featured);
CREATE INDEX idx_projects_category ON projects(category);
CREATE INDEX idx_project_images_project ON project_images(project_id);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_contact_messages_read ON contact_messages(is_read);
CREATE INDEX idx_gallery_images_category ON gallery_images(category_id);
CREATE INDEX idx_social_links_active ON social_links(is_active);
CREATE INDEX idx_resume_active ON resume(is_active);

-- ============================================
-- AUTO-UPDATE TRIGGERS
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_hero_updated_at
  BEFORE UPDATE ON hero FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_about_updated_at
  BEFORE UPDATE ON about FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_skills_updated_at
  BEFORE UPDATE ON skills FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_experience_updated_at
  BEFORE UPDATE ON experience FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_education_updated_at
  BEFORE UPDATE ON education FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_certificates_updated_at
  BEFORE UPDATE ON certificates FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON testimonials FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_blog_updated_at
  BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON settings FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_seo_updated_at
  BEFORE UPDATE ON seo FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- RLS POLICIES
-- ============================================
-- Enable RLS on all tables
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero ENABLE ROW LEVEL SECURITY;
ALTER TABLE about ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE tech_stack ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Admin-only access policies
CREATE POLICY "Admin full access" ON admin_users
  FOR ALL USING (auth.role() = 'authenticated');

-- All content tables: admin can do everything, public can only read published
DO $$
DECLARE
  tables TEXT[] := ARRAY[
    'hero', 'about', 'skills', 'skill_categories', 'projects',
    'project_images', 'services', 'experience', 'education',
    'certificates', 'testimonials', 'achievements', 'blog_posts',
    'gallery_categories', 'gallery_images', 'contact_info',
    'social_links', 'tech_stack', 'timeline_items', 'resume', 'seo', 'settings'
  ];
  t TEXT;
BEGIN
  FOREACH t IN ARRAY tables
  LOOP
    EXECUTE format('
      CREATE POLICY "Admin all access on %s" ON %I
        FOR ALL USING (auth.role() = ''authenticated'')
        WITH CHECK (auth.role() = ''authenticated'');
    ', t, t);
  END LOOP;
END;
$$;

-- Contact messages: anyone can insert, only admin can read/update
CREATE POLICY "Anyone can send messages" ON contact_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin read messages" ON contact_messages
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin update messages" ON contact_messages
  FOR UPDATE USING (auth.role() = 'authenticated');

-- ============================================
-- STORAGE BUCKETS
-- ============================================
INSERT INTO storage.buckets (id, name, public) VALUES
  ('avatars', 'avatars', true),
  ('projects', 'projects', true),
  ('gallery', 'gallery', true),
  ('resume', 'resume', true),
  ('certificates', 'certificates', true),
  ('blog', 'blog', true),
  ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
DO $$
DECLARE
  buckets TEXT[] := ARRAY['avatars', 'projects', 'gallery', 'resume', 'certificates', 'blog', 'uploads'];
  b TEXT;
BEGIN
  FOREACH b IN ARRAY buckets
  LOOP
    EXECUTE format('
      CREATE POLICY "Public read %s" ON storage.objects
        FOR SELECT USING (bucket_id = ''%s'');
    ', b, b);
    EXECUTE format('
      CREATE POLICY "Admin upload %s" ON storage.objects
        FOR INSERT WITH CHECK (bucket_id = ''%s'' AND auth.role() = ''authenticated'');
    ', b, b);
    EXECUTE format('
      CREATE POLICY "Admin update %s" ON storage.objects
        FOR UPDATE USING (bucket_id = ''%s'' AND auth.role() = ''authenticated'');
    ', b, b);
    EXECUTE format('
      CREATE POLICY "Admin delete %s" ON storage.objects
        FOR DELETE USING (bucket_id = ''%s'' AND auth.role() = ''authenticated'');
    ', b, b);
  END LOOP;
END;
$$;

-- ============================================
-- SEED DATA
-- ============================================
INSERT INTO settings (theme, website_status) VALUES ('system', 'online');
INSERT INTO seo (site_title, site_description, keywords) VALUES ('Omar Hamad | CS Portfolio', 'Computer Science student at Al-Aqsa University. Portfolio showcasing projects, skills, and experience.', ARRAY['Omar Hamad', 'Computer Science', 'Al-Aqsa University', 'Portfolio', 'Web Development']);

INSERT INTO hero (name, title, short_description, long_description, availability, location, typing_animation_texts, cta_buttons)
VALUES (
  'Omar Mohammad Ali Hamad',
  'Computer Science Student',
  'Computer Science student at Al-Aqsa University. Passionate about software development, problem-solving, and building modern applications.',
  'I am a Computer Science student at the Faculty of Computing and Information Technology, Al-Aqsa University. Driven by a passion for technology and software development, I am constantly learning and building projects that solve real-world problems. My studies have equipped me with a strong foundation in programming, algorithms, and system design.',
  'Open for opportunities',
  'Palestine, Gaza',
  ARRAY['Computer Science Student', 'Software Developer', 'Problem Solver'],
  '[{"label": "View Projects", "url": "/projects", "variant": "primary"}, {"label": "Contact Me", "url": "/contact"}]'::jsonb
);

INSERT INTO about (biography, years_experience, languages, interests, personal_info)
VALUES (
  'I am Omar Mohammad Ali Hamad, a Computer Science student at the Faculty of Computing and Information Technology, Al-Aqsa University. I am passionate about software development and continuously expanding my skills in programming, web development, and emerging technologies.',
  0,
  ARRAY['Arabic (Native)', 'English (Good)'],
  ARRAY['Backend Architecture', 'Open Source Projects', 'Artificial Intelligence', 'Software Architecture', 'Full-Stack Web Development', 'UI/UX Design', 'AI & Modern Development Tools', 'SaaS & Digital Products', 'Cloud Technologies', 'E-Commerce Systems'],
  '{"email": "omar.mohammad.hamad2003@gmail.com", "phone": "+972597041743", "whatsapp": "+972597041743", "department": "Computer Science", "faculty": "Computing and Information Technology", "university": "Al-Aqsa University"}'::jsonb
);

INSERT INTO contact_info (email, phone, location) VALUES ('omar.mohammad.hamad2003@gmail.com', '+972597041743', 'Palestine, Gaza');

-- ============================================
-- SKILL CATEGORIES & SKILLS SEED
-- ============================================
INSERT INTO skill_categories (name, slug, description, display_order) VALUES
  ('Backend Development', 'backend-development', 'Server-side frameworks, APIs, and architecture patterns.', 1),
  ('Frontend Development', 'frontend-development', 'Modern frontend frameworks, styling, and state management.', 2),
  ('Database & Data', 'database-data', 'Database design, optimization, and management.', 3),
  ('DevOps & Tools', 'devops-tools', 'Deployment, CI/CD, containers, and version control.', 4),
  ('Architecture & Design', 'architecture-design', 'Software architecture, design patterns, and problem solving.', 5);

WITH cat AS (SELECT id, slug FROM skill_categories)
INSERT INTO skills (category_id, title, icon, percentage, display_order, is_featured, is_published) VALUES
  -- Backend Development
  ((SELECT id FROM cat WHERE slug = 'backend-development'), 'ASP.NET Core & CQRS (MediatR)', 'server', 90, 1, true, true),
  ((SELECT id FROM cat WHERE slug = 'backend-development'), 'Clean Architecture & Domain-Driven Design', 'layers', 85, 2, true, true),
  ((SELECT id FROM cat WHERE slug = 'backend-development'), 'Entity Framework Core & LINQ', 'database', 90, 3, true, true),
  ((SELECT id FROM cat WHERE slug = 'backend-development'), 'C# & .NET 10 Development', 'code', 90, 4, true, true),
  ((SELECT id FROM cat WHERE slug = 'backend-development'), 'RESTful API Design & API Security', 'server', 85, 5, true, true),
  ((SELECT id FROM cat WHERE slug = 'backend-development'), 'JWT Authentication & Role-Based Authorization', 'check-circle', 85, 6, true, true),
  ((SELECT id FROM cat WHERE slug = 'backend-development'), 'SignalR & Real-Time Communication', 'server', 75, 7, false, true),
  ((SELECT id FROM cat WHERE slug = 'backend-development'), 'Background Services & Worker Processes', 'server', 80, 8, false, true),
  ((SELECT id FROM cat WHERE slug = 'backend-development'), 'Authentication & Identity Management', 'check-circle', 85, 9, false, true),
  -- Frontend Development
  ((SELECT id FROM cat WHERE slug = 'frontend-development'), 'React.js, Vite & Modern Frontend', 'code', 85, 1, true, true),
  ((SELECT id FROM cat WHERE slug = 'frontend-development'), 'Tailwind CSS, Bootstrap & Responsive UI', 'smartphone', 85, 2, true, true),
  ((SELECT id FROM cat WHERE slug = 'frontend-development'), 'JavaScript (ES6+) & TypeScript', 'code', 80, 3, true, true),
  ((SELECT id FROM cat WHERE slug = 'frontend-development'), 'State Management (MobX)', 'layers', 75, 4, false, true),
  ((SELECT id FROM cat WHERE slug = 'frontend-development'), 'React Query (TanStack Query) & API Integration', 'git-branch', 80, 5, false, true),
  ((SELECT id FROM cat WHERE slug = 'frontend-development'), 'React Hook Form & Client-Side Validation', 'check-circle', 80, 6, false, true),
  -- Database & Data
  ((SELECT id FROM cat WHERE slug = 'database-data'), 'SQL Server & Database Design', 'database', 85, 1, true, true),
  ((SELECT id FROM cat WHERE slug = 'database-data'), 'Entity Relationships & Database Optimization', 'database', 80, 2, true, true),
  -- DevOps & Tools
  ((SELECT id FROM cat WHERE slug = 'devops-tools'), 'Git, GitHub & Version Control', 'git-branch', 85, 1, true, true),
  ((SELECT id FROM cat WHERE slug = 'devops-tools'), 'CI/CD Fundamentals & Deployment', 'cloud', 75, 2, false, true),
  ((SELECT id FROM cat WHERE slug = 'devops-tools'), 'Cloud Deployment & Hosting (MonstarAsp)', 'cloud', 80, 3, false, true),
  ((SELECT id FROM cat WHERE slug = 'devops-tools'), 'Docker Fundamentals', 'cloud', 70, 4, false, true),
  -- Architecture & Design
  ((SELECT id FROM cat WHERE slug = 'architecture-design'), 'Software Architecture & Scalable Design', 'layers', 85, 1, true, true),
  ((SELECT id FROM cat WHERE slug = 'architecture-design'), 'Design Patterns (Repository, Unit of Work, Specification, Outbox)', 'layers', 80, 2, true, true),
  ((SELECT id FROM cat WHERE slug = 'architecture-design'), 'Problem Solving & Algorithmic Thinking', 'code', 85, 3, true, true),
  ((SELECT id FROM cat WHERE slug = 'architecture-design'), 'Debugging & Performance Optimization', 'code', 80, 4, false, true),
  ((SELECT id FROM cat WHERE slug = 'architecture-design'), 'Teamwork & Agile Task Management', 'check-circle', 80, 5, false, true);

-- ============================================
-- TECH STACK (Tools) SEED
-- ============================================
INSERT INTO tech_stack (name, icon, category, proficiency, display_order, is_published) VALUES
  ('Visual Studio & VS Code', 'code', 'IDE', 90, 1, true),
  ('Git & GitHub', 'git-branch', 'Version Control', 85, 2, true),
  ('Figma (UI/UX Design, Wireframing & Prototyping)', 'layers', 'Design', 75, 3, true),
  ('Postman & API Testing', 'server', 'API Tools', 85, 4, true),
  ('Swagger & Scalar API Documentation', 'server', 'API Tools', 85, 5, true),
  ('SQL Server Management Studio (SSMS)', 'database', 'Database', 85, 6, true),
  ('Azure Data Studio', 'database', 'Database', 75, 7, true),
  ('Docker & Containerization Tools', 'cloud', 'DevOps', 70, 8, true),
  ('npm & Node.js Ecosystem', 'code', 'Dev Tools', 80, 9, true),
  ('Vite Development Environment', 'code', 'Dev Tools', 80, 10, true),
  ('Android Studio & Flutter Development Tools', 'smartphone', 'Mobile', 65, 11, true),
  ('Chrome DevTools & Browser Debugging Tools', 'code', 'Dev Tools', 80, 12, true),
  ('Trello / Jira (Task Management & Agile Workflow)', 'check-circle', 'Productivity', 75, 13, true);

-- ============================================
-- TIMELINE (Education) SEED
-- ============================================
INSERT INTO timeline_items (year, title, subtitle, description, type, icon, display_order, is_published) VALUES
  ('2022 - Present', 'B.Sc. in Computer Science', 'Al-Aqsa University', 'Pursuing a Bachelor degree in Computer Science at the Faculty of Computing and Information Technology, Al-Aqsa University.', 'education', 'graduation-cap', 1, true);
