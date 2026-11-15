/**
 * Static, typed fallback content — taken verbatim from Omar's CV
 * (supabase/migrations/00003_cv_library.sql). The CMS remains the source of
 * truth; this file is what renders while it loads or when it is unreachable.
 * Never add anything here that is not in the CV.
 */
import type {
  AchievementVM,
  ArchitectureEdgeVM,
  ArchitectureNodeVM,
  CertificateVM,
  EducationVM,
  ExperienceVM,
  ProfileVM,
  ProjectVM,
  SkillVM,
  SocialLinkVM,
} from './types'

export const SITE_URL = 'https://omar-hamad-portfolio.vercel.app'

export const PORTRAIT = {
  avif: ['/images/profile-480.avif 480w', '/images/profile-800.avif 800w'],
  webp: ['/images/profile-480.webp 480w', '/images/profile-800.webp 800w'],
  fallback: '/images/profile-800.webp',
  width: 800,
  height: 1000,
} as const

export const profile: ProfileVM = {
  name: 'Omar Hamad',
  title: 'Full Stack Engineer',
  location: 'Al-Maghazi, Gaza, Palestine',
  coordinates: '31.42°N 34.38°E',
  timeZone: 'Asia/Gaza',
  email: 'omar.mohammad.hamad2003@gmail.com',
  phone: '+972597041743',
  availability: '',
  isAvailable: true,
  biography:
    'ASP.NET Core / Full Stack Developer and Computer Science student with hands-on experience developing database-driven web applications, administrative information systems, RESTful Web APIs, reporting functionality, and secure backend services using C#, ASP.NET Core, Entity Framework Core, and Microsoft SQL Server. Previously trained within the UNRWA HQG IMT Department, contributing to an Employee Attendance System. Additional experience includes municipal, healthcare, e-commerce, and administrative management systems.',
  portrait: {
    avif: [...PORTRAIT.avif],
    webp: [...PORTRAIT.webp],
    fallback: PORTRAIT.fallback,
    alt: 'Portrait of Omar Hamad',
    isPlaceholder: false,
  },
  resumeUrl: '/cv',
  resumeIsFile: false,
  languages: ['Arabic — Native', 'English — Intermediate'],
  interests: [],
  workingHours: '',
}

export const socials: SocialLinkVM[] = [
  { id: 'github', platform: 'github', label: 'GitHub', url: 'https://github.com/EngOmarHamad' },
  { id: 'linkedin', platform: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/in/omar-hamad-521911274' },
]

const s = (name: string, group: SkillVM['group'], icon?: string): SkillVM => ({
  id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  name,
  group,
  icon,
})

export const skills: SkillVM[] = [
  s('C#', 'backend'),
  s('ASP.NET Core', 'backend', 'siDotnet'),
  s('ASP.NET Core Web API', 'backend', 'siDotnet'),
  s('.NET 10', 'backend', 'siDotnet'),
  s('Entity Framework Core', 'backend'),
  s('LINQ', 'backend'),
  s('RESTful APIs', 'backend'),
  s('Background Services', 'backend'),
  s('SignalR', 'backend'),
  s('ASP.NET Core Identity', 'backend'),
  s('JWT Authentication', 'backend', 'siJsonwebtokens'),
  s('Role-Based Authorization', 'backend'),
  s('Policy-Based Authorization', 'backend'),
  s('Claims-Based Authorization', 'backend'),
  s('API Security', 'backend'),
  s('CORS', 'backend'),

  s('React.js', 'frontend', 'siReact'),
  s('TypeScript', 'frontend', 'siTypescript'),
  s('JavaScript', 'frontend', 'siJavascript'),
  s('Tailwind CSS', 'frontend', 'siTailwindcss'),
  s('Bootstrap', 'frontend', 'siBootstrap'),
  s('HTML5', 'frontend', 'siHtml5'),
  s('CSS3', 'frontend', 'siCss'),

  s('Microsoft SQL Server', 'data'),
  s('PostgreSQL', 'data', 'siPostgresql'),
  s('SQL', 'data'),
  s('T-SQL', 'data'),
  s('Database Design', 'data'),
  s('Database Normalization', 'data'),
  s('Query Optimization', 'data'),
  s('Database Indexing', 'data'),
  s('EF Core Migrations', 'data'),
  s('Transactions', 'data'),

  s('Docker', 'devops', 'siDocker'),
  s('CI/CD', 'devops'),
  s('Git', 'devops', 'siGit'),
  s('GitHub', 'devops', 'siGithub'),
  s('Swagger / OpenAPI', 'devops', 'siSwagger'),
  s('Postman', 'devops', 'siPostman'),

  s('Clean Architecture', 'architecture'),
  s('CQRS', 'architecture'),
  s('MediatR', 'architecture'),
  s('SOLID Principles', 'architecture'),
  s('Design Patterns', 'architecture'),
  s('Requirements Analysis', 'architecture'),
  s('Debugging & Troubleshooting', 'architecture'),
  s('Quality Assurance & Application Testing', 'architecture'),
  s('Application Maintenance', 'architecture'),
  s('Technical Documentation', 'architecture'),
  s('Reporting & Administrative Systems', 'architecture'),
  s('Problem Solving', 'architecture'),
]

/**
 * The layered system Omar builds, drawn from technologies on his CV only.
 * Columns: 0 client → 1 API → 2 application → 3 data.
 */
export const architectureNodes: ArchitectureNodeVM[] = [
  { id: 'spa', label: 'React SPA', layer: 0, row: 0, technologies: ['React.js', 'TypeScript', 'Tailwind CSS'] },
  { id: 'mvc', label: 'Server UI', layer: 0, row: 1, technologies: ['JavaScript', 'Bootstrap', 'HTML5', 'CSS3'] },
  { id: 'api', label: 'Web API', layer: 1, row: 0, technologies: ['ASP.NET Core Web API', 'RESTful APIs', 'Swagger / OpenAPI', 'CORS'] },
  { id: 'auth', label: 'Identity', layer: 1, row: 1, technologies: ['ASP.NET Core Identity', 'JWT Authentication', 'Role-Based Authorization', 'Policy-Based Authorization', 'Claims-Based Authorization'] },
  { id: 'hub', label: 'Realtime', layer: 1, row: 2, technologies: ['SignalR'] },
  { id: 'cqrs', label: 'CQRS', layer: 2, row: 0, technologies: ['CQRS', 'MediatR'] },
  { id: 'domain', label: 'Domain', layer: 2, row: 1, technologies: ['Clean Architecture', 'SOLID Principles', 'Design Patterns', 'C#'] },
  { id: 'jobs', label: 'Workers', layer: 2, row: 2, technologies: ['Background Services', '.NET 10'] },
  { id: 'orm', label: 'EF Core', layer: 3, row: 0, technologies: ['Entity Framework Core', 'LINQ', 'EF Core Migrations', 'Transactions'] },
  { id: 'mssql', label: 'SQL Server', layer: 3, row: 1, technologies: ['Microsoft SQL Server', 'T-SQL', 'Database Indexing', 'Query Optimization'] },
  { id: 'pg', label: 'PostgreSQL', layer: 3, row: 2, technologies: ['PostgreSQL', 'Database Design', 'Database Normalization'] },
]

export const architectureEdges: ArchitectureEdgeVM[] = [
  { from: 'spa', to: 'api' },
  { from: 'spa', to: 'auth' },
  { from: 'spa', to: 'hub' },
  { from: 'mvc', to: 'api' },
  { from: 'mvc', to: 'auth' },
  { from: 'api', to: 'cqrs' },
  { from: 'auth', to: 'domain' },
  { from: 'hub', to: 'jobs' },
  { from: 'cqrs', to: 'domain' },
  { from: 'cqrs', to: 'orm' },
  { from: 'jobs', to: 'orm' },
  { from: 'orm', to: 'mssql' },
  { from: 'orm', to: 'pg' },
]

export const projects: ProjectVM[] = [
  {
    id: 'maghazi-municipality',
    routeId: 'maghazi-municipality',
    title: 'Maghazi Municipality Management System',
    category: 'Government',
    summary:
      'Municipal information-management platform designed to digitize administrative operations, citizen services, employees, organizational structures, documents, content, and internal workflows through a centralized system.',
    problem: '',
    approach: '',
    caseStudy: '',
    features: [],
    technologies: ['ASP.NET Core', '.NET 10', 'C#', 'React', 'TypeScript', 'PostgreSQL', 'REST APIs', 'Entity Framework Core', 'CQRS', 'MediatR', 'Clean Architecture'],
    cover: null,
    gallery: [],
    links: [{ kind: 'live', url: 'https://maghazi-municipality.vercel.app/' }],
    year: '2026',
    featured: true,
  },
  {
    id: 'tabibi',
    routeId: 'tabibi',
    title: 'Tabibi Clinic Management System',
    category: 'Healthcare',
    summary:
      'Database-driven clinic management platform for doctors, patients, appointments, schedules, authentication, notifications, and administrative workflows, with secure APIs and role-based access control.',
    problem: '',
    approach: '',
    caseStudy: '',
    features: [],
    technologies: ['ASP.NET Core', '.NET 10', 'C#', 'SQL Server', 'Entity Framework Core', 'REST APIs', 'ASP.NET Core Identity', 'JWT', 'SignalR', 'React', 'TypeScript', 'CQRS'],
    cover: null,
    gallery: [],
    links: [{ kind: 'live', url: 'https://tabibi-frontend.vercel.app/' }],
    year: '',
    featured: false,
  },
  {
    id: 'unrwa-attendance',
    routeId: 'unrwa-attendance',
    title: 'Employee Attendance System – UNRWA HQG',
    category: 'Enterprise',
    summary:
      'Internal employee attendance and administrative management system developed during training at the UNRWA HQG IMT Department, supporting employee records, attendance workflows, reporting, administrative operations, testing, and real-time functionality.',
    problem: '',
    approach: '',
    caseStudy: '',
    features: [],
    technologies: ['ASP.NET Core', 'C#', 'SQL Server', 'JavaScript', 'Bootstrap', 'SignalR', 'REST APIs', 'Reporting', 'Background Services'],
    cover: null,
    gallery: [],
    links: [],
    year: '2023',
    featured: false,
  },
  {
    id: 'socotry',
    routeId: 'socotry',
    title: 'Socotry E-Commerce & Administration Platform',
    category: 'E-commerce',
    summary:
      'Database-driven e-commerce and administrative platform supporting products, customers, orders, checkout, delivery operations, search, notifications, and administrative reporting.',
    problem: '',
    approach: '',
    caseStudy: '',
    features: [],
    technologies: ['ASP.NET Core', 'C#', 'Entity Framework Core', 'SQL Server', 'REST APIs', 'ASP.NET Core Identity', 'JavaScript', 'Bootstrap', 'SignalR', 'DataTables', 'Chart.js', 'Reporting'],
    cover: null,
    gallery: [],
    links: [{ kind: 'video', url: 'https://youtu.be/CKiXxyAhlZA' }],
    year: '',
    featured: false,
  },
  {
    id: 'orphans-management',
    routeId: 'orphans-management',
    title: 'Orphans Management System',
    category: 'Nonprofit',
    summary:
      'Administrative information system for managing records, personal and family information, sponsorships, assistance programs, documents, follow-ups, and reporting through a centralized database-driven platform.',
    problem: '',
    approach: '',
    caseStudy: '',
    features: [],
    technologies: ['ASP.NET Core', 'C#', 'Entity Framework Core', 'SQL Server', 'JavaScript', 'Bootstrap', 'REST APIs', 'Data Management', 'Reporting'],
    cover: null,
    gallery: [],
    links: [{ kind: 'video', url: 'https://youtu.be/yenx0JyeRu4' }],
    year: '',
    featured: false,
  },
]

export const experience: ExperienceVM[] = [
  {
    id: 'maghazi',
    role: 'Team Leader & Volunteer Full Stack Developer',
    organization: 'Al-Maghazi Municipality',
    start: '2026-07',
    end: '',
    isCurrent: true,
    summary:
      'Lead the technical development of a municipal information-management platform, translating operational requirements into secure, maintainable web applications and digital administrative workflows.',
    highlights: [
      'Lead development activities, distribute technical tasks and coordinate implementation across the team',
      'Develop backend services and RESTful Web APIs with ASP.NET Core and C#',
      'Implement authentication, authorization and role-based permissions',
    ],
  },
  {
    id: 'freelance',
    role: 'Full Stack Developer',
    organization: 'Freelance',
    start: '2024-05',
    end: '',
    isCurrent: true,
    summary:
      'Design and deliver database-driven web applications and administrative systems using ASP.NET Core, C#, Entity Framework Core, SQL Server, PostgreSQL, React, and TypeScript.',
    highlights: [
      'Design relational schemas with querying, pagination, transactions and reporting',
      'Implement RBAC, notifications and background processing',
      'Build responsive React + TypeScript frontends integrated over REST',
    ],
  },
  {
    id: 'developers-plus',
    role: 'Full Stack Web Developer',
    organization: 'Developers Plus',
    start: '2023-09',
    end: '2023-12',
    isCurrent: false,
    summary:
      'Contributed to a database-driven Job Portal and real-time communication platform using ASP.NET Core, SQL Server, JavaScript, Bootstrap and SignalR.',
    highlights: ['Implemented real-time notifications with SignalR', 'Integrated charts and structured reporting views'],
  },
  {
    id: 'unrwa',
    role: 'Full Stack ASP.NET Developer Intern',
    organization: 'IMT Department at UNRWA HQG',
    start: '2023-07',
    end: '2023-08',
    isCurrent: false,
    summary:
      'Contributed to an internal Employee Attendance System supporting employee information, attendance workflows, administrative operations and reporting.',
    highlights: ['Contributed to automated attendance processing with ASP.NET Core background services'],
  },
  {
    id: 'gtc',
    role: 'Team Leader & ASP.NET Core Developer',
    organization: 'Gaza Training College',
    start: '2023-02',
    end: '2023-05',
    isCurrent: false,
    summary:
      'Led a development team while contributing directly to an ASP.NET Core administrative management system backed by Microsoft SQL Server.',
    highlights: ['Coordinated tasks, milestones and technical implementation', 'Designed and managed the SQL Server database'],
  },
  {
    id: 'trustangle',
    role: 'React Developer',
    organization: 'trustangle',
    start: '2023-01',
    end: '2023-04',
    isCurrent: false,
    summary: 'Developed responsive web interfaces and reusable frontend components integrated with backend APIs.',
    highlights: [],
  },
]

export const education: EducationVM[] = [
  {
    id: 'aqsa',
    degree: "Bachelor's Degree in Computer Science",
    institution: 'Al-Aqsa University',
    start: '2023-09',
    end: '2027-06',
    grade: '89.86%',
    summary: 'In progress — software engineering, databases, algorithms, information systems and software architecture.',
  },
  {
    id: 'gtc-diploma',
    degree: 'Diploma in Programming and Database Management',
    institution: 'Gaza Training College',
    start: '2021-09',
    end: '2023-06',
    grade: '93.3%',
    summary: 'Software development, database design and management, web applications and information systems.',
  },
]

export const certificates: CertificateVM[] = [
  {
    id: 'codemap-2026',
    title: 'CodeMap 2026 Training Program',
    issuer: 'TAQAT',
    date: '2026-07-10',
    url: '',
    summary: '144-hour program covering software architecture, maintainable code and scalable systems.',
  },
]

export const achievements: AchievementVM[] = [
  {
    id: 'hult-prize',
    title: 'Hult Prize — Team Leader & Software Developer',
    date: '',
    summary:
      'Led a multidisciplinary team building a circular-economy venture against clothing waste, and contributed to the software supporting its operations.',
  },
]
