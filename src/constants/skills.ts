import type { Skill } from '@/types'

export const SKILLS: Skill[] = [
  {
    icon: 'code',
    title: 'Frontend',
    technologies: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Framer Motion', 'Three.js'],
    description: 'Building responsive, accessible, and performant user interfaces with modern frameworks.',
  },
  {
    icon: 'server',
    title: 'Backend',
    technologies: ['ASP.NET Core', 'C#', 'Node.js', 'REST APIs', 'GraphQL', 'SignalR'],
    description: 'Designing robust APIs and services with Clean Architecture and Domain-Driven Design.',
  },
  {
    icon: 'smartphone',
    title: 'Mobile',
    technologies: ['Flutter', 'Dart', 'React Native', 'Swift', 'Kotlin'],
    description: 'Creating cross-platform mobile applications with native performance.',
  },
  {
    icon: 'cloud',
    title: 'Cloud',
    technologies: ['Azure', 'AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform'],
    description: 'Deploying and managing cloud-native applications with infrastructure as code.',
  },
  {
    icon: 'git-branch',
    title: 'DevOps',
    technologies: ['GitHub Actions', 'Azure DevOps', 'Jenkins', 'Ansible', 'Prometheus'],
    description: 'Automating deployment pipelines and monitoring production systems.',
  },
  {
    icon: 'layers',
    title: 'Architecture',
    technologies: ['Clean Architecture', 'CQRS', 'Event Sourcing', 'Microservices', 'DDD'],
    description: 'Designing scalable, maintainable system architectures using proven patterns.',
  },
  {
    icon: 'database',
    title: 'Databases',
    technologies: ['SQL Server', 'PostgreSQL', 'MongoDB', 'Redis', 'Elasticsearch', 'Cosmos DB'],
    description: 'Working with relational, document, and cache databases for optimal data access.',
  },
  {
    icon: 'check-circle',
    title: 'Testing',
    technologies: ['xUnit', 'Jest', 'Cypress', 'Playwright', 'Selenium', 'Postman'],
    description: 'Ensuring code quality through comprehensive testing at all levels.',
  },
]
