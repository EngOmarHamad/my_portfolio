import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'

const root = path.resolve(import.meta.dirname, '..')
const sourcePath = path.join(root, 'src/admin/pages/CreateCV/CreateCVPage.tsx')
const outputPath = path.join(root, 'supabase/migrations/00003_cv_library.sql')
const sourceText = fs.readFileSync(sourcePath, 'utf8')
const source = ts.createSourceFile(sourcePath, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)

function propertyName(node) {
  return node.name?.getText(source).replace(/^['"]|['"]$/g, '')
}

function readLiteral(node) {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text
  if (ts.isNumericLiteral(node)) return Number(node.text)
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false
  if (node.kind === ts.SyntaxKind.NullKeyword) return null
  if (ts.isArrayLiteralExpression(node)) return node.elements.map(readLiteral)
  if (ts.isObjectLiteralExpression(node)) {
    return Object.fromEntries(node.properties.map((property) => {
      if (!ts.isPropertyAssignment(property)) throw new Error(`Unsupported property: ${property.getText(source)}`)
      return [propertyName(property), readLiteral(property.initializer)]
    }))
  }
  throw new Error(`Unsupported value: ${node.getText(source).slice(0, 80)}`)
}

let defaults
function visit(node) {
  if (defaults) return
  if (ts.isCallExpression(node) && node.expression.getText(source) === 'useForm' && node.arguments.length === 1) {
    const options = node.arguments[0]
    if (ts.isObjectLiteralExpression(options)) {
      const property = options.properties.find((item) => ts.isPropertyAssignment(item) && propertyName(item) === 'defaultValues')
      if (property && ts.isPropertyAssignment(property)) defaults = readLiteral(property.initializer)
    }
  }
  ts.forEachChild(node, visit)
}
visit(source)
if (!defaults) throw new Error('CreateCV defaultValues were not found')

const json = JSON.stringify(defaults, null, 2)
if (json.includes('$cv_defaults$')) throw new Error('SQL delimiter collision')

const sql = `-- Generated from the independent CreateCVPage defaultValues. Do not edit that page to maintain this seed.
-- This migration adds a CV-specific library and profile associations without replacing portfolio tables.
CREATE TABLE cv_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_key TEXT UNIQUE,
  kind TEXT NOT NULL CHECK (kind IN ('identity', 'skills', 'experience', 'education', 'certifications', 'languages', 'socialLinks', 'projects', 'achievements', 'references')),
  label TEXT NOT NULL,
  content JSONB NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  display_order INTEGER NOT NULL DEFAULT 0,
  is_public BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE cv_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  summary TEXT NOT NULL DEFAULT '',
  keywords TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE cv_profile_entries (
  profile_id UUID NOT NULL REFERENCES cv_profiles(id) ON DELETE CASCADE,
  entry_id UUID NOT NULL REFERENCES cv_entries(id) ON DELETE CASCADE,
  included BOOLEAN NOT NULL,
  PRIMARY KEY (profile_id, entry_id)
);

CREATE INDEX idx_cv_entries_kind_order ON cv_entries(kind, display_order);
CREATE INDEX idx_cv_profile_entries_entry ON cv_profile_entries(entry_id);

ALTER TABLE cv_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_profile_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read CV entries" ON cv_entries FOR SELECT TO anon USING (is_public = true);
CREATE POLICY "Admin manage CV entries" ON cv_entries FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin manage CV profiles" ON cv_profiles FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin manage CV selections" ON cv_profile_entries FOR ALL TO authenticated USING (true) WITH CHECK (true);

DO $seed$
DECLARE
  payload JSONB := $cv_defaults$${json}$cv_defaults$::jsonb;
  section_name TEXT;
  section_entry JSONB;
  item_number INTEGER;
  item_label TEXT;
BEGIN
  INSERT INTO cv_entries (source_key, kind, label, content, display_order)
  VALUES (
    'create-cv:identity', 'identity', 'Profile details',
    payload - 'skills' - 'experience' - 'education' - 'certifications' - 'languages' - 'socialLinks' - 'projects' - 'achievements' - 'references',
    0
  ) ON CONFLICT (source_key) DO NOTHING;

  FOREACH section_name IN ARRAY ARRAY['skills', 'experience', 'education', 'certifications', 'languages', 'socialLinks', 'projects', 'achievements', 'references'] LOOP
    item_number := 0;
    FOR section_entry IN SELECT value FROM jsonb_array_elements(COALESCE(payload -> section_name, '[]'::jsonb)) LOOP
      item_number := item_number + 1;
      item_label := COALESCE(
        section_entry ->> 'name', section_entry ->> 'position', section_entry ->> 'degree',
        section_entry ->> 'title', section_entry ->> 'language', section_entry ->> 'platform',
        'Item ' || item_number
      );
      INSERT INTO cv_entries (source_key, kind, label, content, display_order, is_public)
      VALUES (
        'create-cv:' || section_name || ':' || item_number,
        section_name,
        item_label,
        section_entry,
        item_number,
        true
      ) ON CONFLICT (source_key) DO NOTHING;
    END LOOP;
  END LOOP;
END;
$seed$;

INSERT INTO cv_profiles (name, slug, title, summary, keywords)
VALUES (
  'ASP.NET', 'asp-net', 'ASP.NET Core Developer',
  'Experience and skills focused on ASP.NET Core, C#, Web APIs, Entity Framework Core, and SQL Server.',
  ARRAY['asp.net', '.net', 'c#', 'entity framework', 'sql server', 'web api', 'cqrs', 'mediatr']
) ON CONFLICT (slug) DO NOTHING;
`

fs.writeFileSync(outputPath, sql, 'utf8')
process.stdout.write(`Extracted ${Object.entries(defaults).filter(([, value]) => Array.isArray(value)).map(([key, value]) => `${key}: ${value.length}`).join(', ')}\n`)
process.stdout.write(`Wrote ${outputPath}\n`)
