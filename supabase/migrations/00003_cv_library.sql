-- Generated from the independent CreateCVPage defaultValues. Do not edit that page to maintain this seed.
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
  payload JSONB := $cv_defaults${
  "fullName": "Omar Hamad",
  "title": "ASP.NET Core / Full Stack Developer | C#, SQL Server, Web APIs & Information Systems",
  "email": "omar.mohammad.hamad2003@gmail.com",
  "phone": "+972597041743",
  "location": "Al-Maghazi, Gaza, State of Palestine",
  "summary": "ASP.NET Core / Full Stack Developer and Computer Science student with hands-on experience developing database-driven web applications, administrative information systems, RESTful Web APIs, reporting functionality, and secure backend services using C#, ASP.NET Core, Entity Framework Core, and Microsoft SQL Server. Experienced in requirements analysis, application maintenance, debugging, quality assurance, authentication and authorization, technical documentation, background processing, and real-time communication. Previously trained within the UNRWA HQG IMT Department, contributing to an Employee Attendance System that supported employee records, attendance workflows, administrative operations, reporting, testing, debugging, and system improvements. Additional experience includes municipal, healthcare, e-commerce, and administrative management systems. Strong foundation in relational database design, API development, software security, maintainable architecture, Git-based workflows, and modern frontend development with React and TypeScript.",
  "skills": [
    {
      "name": "C#",
      "category": "Programming",
      "level": "Expert"
    },
    {
      "name": "ASP.NET Core",
      "category": "Backend",
      "level": "Expert"
    },
    {
      "name": "ASP.NET Core Web API",
      "category": "Backend",
      "level": "Expert"
    },
    {
      "name": ".NET 10",
      "category": "Backend",
      "level": "Advanced"
    },
    {
      "name": "Entity Framework Core",
      "category": "Backend",
      "level": "Advanced"
    },
    {
      "name": "LINQ",
      "category": "Backend",
      "level": "Advanced"
    },
    {
      "name": "RESTful APIs",
      "category": "Backend",
      "level": "Advanced"
    },
    {
      "name": "Background Services",
      "category": "Backend",
      "level": "Advanced"
    },
    {
      "name": "SignalR",
      "category": "Backend",
      "level": "Advanced"
    },
    {
      "name": "Microsoft SQL Server",
      "category": "Database",
      "level": "Advanced"
    },
    {
      "name": "SQL",
      "category": "Database",
      "level": "Advanced"
    },
    {
      "name": "T-SQL",
      "category": "Database",
      "level": "Advanced"
    },
    {
      "name": "Database Design",
      "category": "Database",
      "level": "Advanced"
    },
    {
      "name": "Database Normalization",
      "category": "Database",
      "level": "Advanced"
    },
    {
      "name": "Query Optimization",
      "category": "Database",
      "level": "Intermediate"
    },
    {
      "name": "Database Indexing",
      "category": "Database",
      "level": "Intermediate"
    },
    {
      "name": "EF Core Migrations",
      "category": "Database",
      "level": "Advanced"
    },
    {
      "name": "Transactions",
      "category": "Database",
      "level": "Advanced"
    },
    {
      "name": "PostgreSQL",
      "category": "Database",
      "level": "Advanced"
    },
    {
      "name": "Requirements Analysis",
      "category": "Software Engineering",
      "level": "Advanced"
    },
    {
      "name": "Debugging & Troubleshooting",
      "category": "Software Engineering",
      "level": "Advanced"
    },
    {
      "name": "Quality Assurance & Application Testing",
      "category": "Software Engineering",
      "level": "Intermediate"
    },
    {
      "name": "Application Maintenance",
      "category": "Software Engineering",
      "level": "Advanced"
    },
    {
      "name": "Technical Documentation",
      "category": "Software Engineering",
      "level": "Advanced"
    },
    {
      "name": "Reporting & Administrative Systems",
      "category": "Software Engineering",
      "level": "Advanced"
    },
    {
      "name": "User Training & Technical Support",
      "category": "Software Engineering",
      "level": "Advanced"
    },
    {
      "name": "Problem Solving",
      "category": "Software Engineering",
      "level": "Advanced"
    },
    {
      "name": "ASP.NET Core Identity",
      "category": "Security",
      "level": "Advanced"
    },
    {
      "name": "JWT Authentication",
      "category": "Security",
      "level": "Advanced"
    },
    {
      "name": "Role-Based Authorization",
      "category": "Security",
      "level": "Advanced"
    },
    {
      "name": "Policy-Based Authorization",
      "category": "Security",
      "level": "Advanced"
    },
    {
      "name": "Claims-Based Authorization",
      "category": "Security",
      "level": "Advanced"
    },
    {
      "name": "API Security",
      "category": "Security",
      "level": "Advanced"
    },
    {
      "name": "CORS",
      "category": "Security",
      "level": "Advanced"
    },
    {
      "name": "JavaScript",
      "category": "Frontend",
      "level": "Advanced"
    },
    {
      "name": "HTML5",
      "category": "Frontend",
      "level": "Advanced"
    },
    {
      "name": "CSS3",
      "category": "Frontend",
      "level": "Advanced"
    },
    {
      "name": "Bootstrap",
      "category": "Frontend",
      "level": "Advanced"
    },
    {
      "name": "React.js",
      "category": "Frontend",
      "level": "Advanced"
    },
    {
      "name": "TypeScript",
      "category": "Frontend",
      "level": "Advanced"
    },
    {
      "name": "Tailwind CSS",
      "category": "Frontend",
      "level": "Advanced"
    },
    {
      "name": "Clean Architecture",
      "category": "Architecture",
      "level": "Advanced"
    },
    {
      "name": "CQRS",
      "category": "Architecture",
      "level": "Advanced"
    },
    {
      "name": "MediatR",
      "category": "Architecture",
      "level": "Advanced"
    },
    {
      "name": "SOLID Principles",
      "category": "Architecture",
      "level": "Advanced"
    },
    {
      "name": "Design Patterns",
      "category": "Architecture",
      "level": "Advanced"
    },
    {
      "name": "Git",
      "category": "Tools",
      "level": "Advanced"
    },
    {
      "name": "GitHub",
      "category": "Tools",
      "level": "Advanced"
    },
    {
      "name": "Swagger / OpenAPI",
      "category": "Tools",
      "level": "Advanced"
    },
    {
      "name": "Postman",
      "category": "Tools",
      "level": "Advanced"
    },
    {
      "name": "Docker",
      "category": "DevOps",
      "level": "Intermediate"
    },
    {
      "name": "CI/CD",
      "category": "DevOps",
      "level": "Intermediate"
    }
  ],
  "experience": [
    {
      "position": "Team Leader & Volunteer Full Stack Developer",
      "organization": "Al-Maghazi Municipality",
      "start_date": "July 2026",
      "end_date": "Present",
      "description": "Lead the technical development of a municipal information-management platform, translating operational requirements into secure, maintainable web applications and digital administrative workflows.",
      "highlights": [
        {
          "text": "Lead development activities, distribute technical tasks, track progress, and coordinate implementation across the team"
        },
        {
          "text": "Analyze operational requirements with municipal staff and translate them into application features, workflows, and structured data models"
        },
        {
          "text": "Develop and maintain backend services and RESTful Web APIs using ASP.NET Core and C#"
        },
        {
          "text": "Develop database-driven administrative functionality for citizens, employees, services, organizational structures, documents, and internal workflows"
        },
        {
          "text": "Implement authentication, authorization, role-based permissions, and administrative access controls"
        },
        {
          "text": "Build responsive administrative and public-facing interfaces using React and TypeScript"
        },
        {
          "text": "Implement reporting-oriented features, filtering, structured data retrieval, and administrative dashboards"
        },
        {
          "text": "Handle application maintenance, debugging, issue resolution, performance improvements, deployment, and reliability"
        },
        {
          "text": "Contribute to technical documentation, development planning, and communication of implementation decisions"
        }
      ]
    },
    {
      "position": "Full Stack Developer",
      "organization": "Freelance",
      "start_date": "May 2024",
      "end_date": "Present",
      "description": "Design and deliver database-driven web applications and administrative systems using ASP.NET Core, C#, Entity Framework Core, SQL Server, PostgreSQL, React, and TypeScript.",
      "highlights": [
        {
          "text": "Develop backend services, RESTful Web APIs, and database-driven business logic using C#, ASP.NET Core, Entity Framework Core, SQL Server, and PostgreSQL"
        },
        {
          "text": "Analyze business and administrative requirements and translate them into maintainable application features and digital workflows"
        },
        {
          "text": "Design relational database schemas and implement querying, filtering, pagination, transactions, and reporting functionality"
        },
        {
          "text": "Implement authentication, authorization, role-based access control, notifications, and background processing"
        },
        {
          "text": "Build responsive frontend applications using React, TypeScript, Tailwind CSS, and reusable component architectures"
        },
        {
          "text": "Integrate frontend applications with backend services through REST APIs and JSON-based data exchange"
        },
        {
          "text": "Troubleshoot application and database issues, fix defects, and improve existing functionality, stability, and maintainability"
        },
        {
          "text": "Use Swagger/OpenAPI and Postman for API documentation, validation, and testing"
        },
        {
          "text": "Apply secure development practices for authentication, authorization, API access, and sensitive application data"
        },
        {
          "text": "Use Git and GitHub for source control and Docker for consistent development and deployment environments"
        }
      ]
    },
    {
      "position": "Full Stack Web Developer",
      "organization": "Developers Plus",
      "start_date": "September 2023",
      "end_date": "December 2023",
      "description": "Contributed to the development and maintenance of a database-driven Job Portal and real-time communication platform using ASP.NET Core, SQL Server, JavaScript, Bootstrap, SignalR, and related web technologies.",
      "highlights": [
        {
          "text": "Developed and maintained web application functionality using ASP.NET Core, C#, JavaScript, and Bootstrap"
        },
        {
          "text": "Implemented backend business logic and database-driven features for users, records, requests, and related operations"
        },
        {
          "text": "Worked with Microsoft SQL Server for data storage, querying, updating, filtering, and reporting"
        },
        {
          "text": "Developed RESTful backend services with authentication and authorization"
        },
        {
          "text": "Implemented real-time notifications and communication functionality using SignalR"
        },
        {
          "text": "Debugged application issues, fixed defects, and improved existing features, stability, and usability"
        },
        {
          "text": "Integrated charts and structured reporting views for administrative data analysis"
        }
      ]
    },
    {
      "position": "Full Stack ASP.NET Developer Intern",
      "organization": "IMT Department at UNRWA HQG",
      "start_date": "July 2023",
      "end_date": "August 2023",
      "description": "Contributed to the development and improvement of an internal Employee Attendance System supporting employee information, attendance workflows, administrative operations, reporting, and application support within the UNRWA HQG IMT environment.",
      "highlights": [
        {
          "text": "Developed backend and administrative web functionality using ASP.NET Core"
        },
        {
          "text": "Worked with employee records, attendance data, administrative workflows, and reporting functionality"
        },
        {
          "text": "Implemented backend business logic and database-driven application features using relational data"
        },
        {
          "text": "Contributed to automated attendance processing using ASP.NET Core background services"
        },
        {
          "text": "Developed responsive administrative interfaces using Bootstrap, JavaScript, and jQuery"
        },
        {
          "text": "Contributed to application testing, debugging, issue resolution, and functional improvements"
        },
        {
          "text": "Supported real-time communication and notification functionality"
        },
        {
          "text": "Gained practical experience working with internal administrative information systems in the UNRWA IT environment"
        }
      ]
    },
    {
      "position": "Team Leader & ASP.NET Core Developer",
      "organization": "Gaza Training College",
      "start_date": "February 2023",
      "end_date": "May 2023",
      "description": "Led a development team while contributing directly to the design and implementation of an ASP.NET Core administrative management system backed by Microsoft SQL Server.",
      "highlights": [
        {
          "text": "Led the development team and coordinated tasks, milestones, priorities, and technical implementation"
        },
        {
          "text": "Analyzed project requirements and translated them into application features and relational database structures"
        },
        {
          "text": "Developed backend functionality using ASP.NET Core and C#"
        },
        {
          "text": "Designed and managed relational databases using Microsoft SQL Server"
        },
        {
          "text": "Implemented CRUD operations, search, filtering, structured data management, and administrative workflows"
        },
        {
          "text": "Developed reporting-oriented functionality for administrative data"
        },
        {
          "text": "Contributed to debugging, problem solving, technical decisions, and coordination between team members"
        }
      ]
    },
    {
      "position": "React Developer",
      "organization": "trustangle",
      "start_date": "January 2023",
      "end_date": "April 2023",
      "description": "Contributed to the development of responsive web interfaces and reusable frontend components integrated with backend APIs.",
      "highlights": [
        {
          "text": "Developed responsive and reusable user-interface components using React"
        },
        {
          "text": "Integrated frontend applications with backend APIs and structured data"
        },
        {
          "text": "Worked with JavaScript, HTML, CSS, and component-based frontend architecture"
        },
        {
          "text": "Improved interface responsiveness, usability, structure, and maintainability"
        }
      ]
    }
  ],
  "education": [
    {
      "degree": "Bachelor's Degree in Computer Science",
      "institution": "Al-Aqsa University",
      "start_date": "September 2023",
      "end_date": "June 2027",
      "gpa": "89.86%",
      "description": "In progress. Computer Science studies focused on software engineering, databases, algorithms, data structures, information systems, web development, and software architecture."
    },
    {
      "degree": "Diploma in Programming and Database Management",
      "institution": "Gaza Training College",
      "start_date": "September 2021",
      "end_date": "June 2023",
      "gpa": "93.3%",
      "description": "Completed diploma focused on software development, programming fundamentals, database design and management, web applications, information systems, and practical application development."
    }
  ],
  "certifications": [
    {
      "title": "CodeMap 2026 Training Program",
      "issuer": "TAQAT",
      "issue_date": "10 July 2026",
      "type": "Training",
      "status": "Completed",
      "level": "Beginner",
      "duration": "144 hours",
      "description": "Completed a 144-hour software development training program covering professional development workflows, software architecture, maintainable code, scalable systems, and software engineering best practices.",
      "skills": [
        "Software Architecture",
        "Clean Code",
        "Development Workflow",
        "Scalable Systems",
        "Software Maintainability",
        "Software Engineering Best Practices"
      ]
    }
  ],
  "languages": [
    {
      "language": "Arabic",
      "level": "Native or Bilingual"
    },
    {
      "language": "English",
      "level": "Intermediate"
    }
  ],
  "socialLinks": [
    {
      "platform": "LinkedIn",
      "url": "https://www.linkedin.com/in/omar-hamad-521911274"
    },
    {
      "platform": "GitHub",
      "url": "https://github.com/EngOmarHamad"
    }
  ],
  "projects": [
    {
      "name": "Employee Attendance System – UNRWA HQG",
      "description": "Internal employee attendance and administrative management system developed during training at the UNRWA HQG IMT Department, supporting employee records, attendance workflows, reporting, administrative operations, testing, and real-time functionality.",
      "technologies": [
        "ASP.NET Core",
        "C#",
        "SQL Server",
        "JavaScript",
        "Bootstrap",
        "SignalR",
        "REST APIs",
        "Reporting",
        "Background Services"
      ]
    },
    {
      "name": "Tabibi Clinic Management System",
      "description": "Database-driven clinic management platform for doctors, patients, appointments, schedules, authentication, notifications, and administrative workflows, with secure APIs and role-based access control.",
      "link": "https://tabibi-frontend.vercel.app/",
      "technologies": [
        "ASP.NET Core",
        ".NET 10",
        "C#",
        "SQL Server",
        "Entity Framework Core",
        "REST APIs",
        "ASP.NET Core Identity",
        "JWT",
        "SignalR",
        "React",
        "TypeScript",
        "CQRS"
      ]
    },
    {
      "name": "Socotry E-Commerce & Administration Platform",
      "link": "https://youtu.be/CKiXxyAhlZA?si=z-6K2dYQ1ZvwBQb9",
      "description": "Database-driven e-commerce and administrative platform supporting products, customers, orders, checkout, delivery operations, search, notifications, and administrative reporting.",
      "technologies": [
        "ASP.NET Core",
        "C#",
        "Entity Framework Core",
        "SQL Server",
        "REST APIs",
        "ASP.NET Core Identity",
        "JavaScript",
        "Bootstrap",
        "SignalR",
        "DataTables",
        "Chart.js",
        "Reporting"
      ]
    },
    {
      "name": "Maghazi Municipality Management System",
      "description": "Municipal information-management platform designed to digitize administrative operations, citizen services, employees, organizational structures, documents, content, and internal workflows through a centralized system.",
      "link": "https://maghazi-municipality.vercel.app/",
      "technologies": [
        "ASP.NET Core",
        ".NET 10",
        "C#",
        "React",
        "TypeScript",
        "PostgreSQL",
        "REST APIs",
        "Entity Framework Core",
        "CQRS",
        "MediatR",
        "Clean Architecture"
      ]
    },
    {
      "name": "Orphans Management System",
      "link": "https://youtu.be/yenx0JyeRu4?si=6SGdVugE-rYKddFj",
      "description": "Administrative information system for managing records, personal and family information, sponsorships, assistance programs, documents, follow-ups, and reporting through a centralized database-driven platform.",
      "technologies": [
        "ASP.NET Core",
        "C#",
        "Entity Framework Core",
        "SQL Server",
        "JavaScript",
        "Bootstrap",
        "REST APIs",
        "Data Management",
        "Reporting"
      ]
    }
  ],
  "achievements": [
    {
      "title": "Hult Prize – Team Leader & Software Developer",
      "description": "Led a multidisciplinary team in developing a sustainable entrepreneurship project addressing clothing waste through a circular-economy model. Coordinated planning and task distribution while contributing to the software application supporting the project's operational workflow."
    }
  ],
  "references": [
    {
      "name": "Eng. Tahani Al-Naouq",
      "position": "Instructor / Engineer",
      "organization": "Gaza Training College (GTC)",
      "relationship": "Academic Reference",
      "email": "",
      "phone": "+972 59-948-4049"
    },
    {
      "name": "Nael Ali Mousa",
      "position": "Computer Technician",
      "organization": "Al-Maghazi Municipality",
      "relationship": "Technical Supervisor",
      "email": "n.mousa@momg.ps",
      "phone": "+972 59-963-3588"
    },
    {
      "name": "Adeeb Mahmoud Abu Ghzal",
      "position": "Head of Public Relations and Media Department",
      "organization": "Al-Maghazi Municipality",
      "relationship": "Supervisor / Professional Reference",
      "email": "a.ghzal@momg.ps",
      "phone": "+972 59-960-4530"
    },
    {
      "name": "Wissam Al-Balawi",
      "position": "Freelance Software Developer",
      "organization": "",
      "relationship": "Professional Colleague / Freelance Collaborator",
      "email": "",
      "phone": "+972 59-992-4216"
    }
  ]
}$cv_defaults$::jsonb;
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
