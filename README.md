# React + TypeScript + Vite

## Portfolio structure

The public site and admin panel are two views of the same Supabase content. Keep their route and content mapping in `src/shared/config/site-structure.ts` instead of adding separate navigation lists. Public pages live in `src/portfolio/pages`, admin editors in `src/admin/pages`, and reusable data access/types/configuration in `src/shared` or the relevant feature's `services` directory. `src/app/router` owns public routes and `src/admin/AdminRouter.tsx` owns protected editor routes.

| Admin editor | Public destination |
| --- | --- |
| Hero | Home |
| Projects, Services, Gallery | Dedicated work pages |
| Skills, Tech Stack | Skills page |
| About, Achievements, Testimonials | About page |
| Experience, Timeline, Education, Certificates | Experience page |
| Blog, Contact Info, Social Links, Resume | Blog, Contact, and CV pages |
| SEO | Public page metadata |
| CV from Database | Public CV (`/cv`); role-specific CVs stay in admin |
| Messages, Settings, Data Viewer, Create CV | Admin tools; the original Create CV remains independent |

Only published or active content is selected for visitors. The public read policies are in `supabase/migrations/00002_public_portfolio_read.sql`; apply that migration in the target Supabase project before expecting anonymous visitors to see database content. It is intentionally separate from the initial schema migration.

## CV content

The independent `/admin/create-cv` page is unchanged. `scripts/generate-cv-seed.mjs` extracts its default values into `supabase/migrations/00003_cv_library.sql`, including the full profile, skills, experience, education, certifications, languages, links, projects, achievements, and references. Apply migration `00003` and then `00004_cv_portfolio_seed.sql` to the target database. The second migration copies missing CV content into the existing site sections and only updates the untouched sample identity from the initial schema; it does not remove existing records.

`/admin/cv-from-data` manages database CV content and role-specific CV types. Its ASP.NET type suggests entries by keywords, and each entry can be included or excluded manually. The public `/cv` displays every published CV entry, regardless of CV type. References are included in the public CV by default; review their contact details before deploying and use the visibility switch in the admin editor if any should be private.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
