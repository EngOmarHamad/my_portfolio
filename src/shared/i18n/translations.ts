export type Language = 'en' | 'ar'

const en = {
  toggle: {
    toArabic: 'Switch to Arabic',
    toEnglish: 'Switch to English',
    arabicShort: 'عربي',
    englishShort: 'EN',
  },
  hero: {
    name: 'Omar Mohammad Ali Hamad',
    availabilityFallback: 'Available for opportunities',
    imA: "I'm a",
    titlesFallback: ['Full Stack Developer', '.NET Architect', 'UI/UX Enthusiast', 'Problem Solver'],
    descriptionFallback:
      'Building scalable, maintainable systems with clean architecture, modern stacks, and great user experiences.',
    viewWork: 'View My Work',
    aboutMe: 'About Me',
    downloadCv: 'Download CV',
    connect: 'Connect',
    stats: [
      { label: 'Projects' },
      { label: 'Experience' },
      { label: 'Commits' },
    ],
    availableBadge: 'Available',
    yearsBadge: '2+ Years',
    scroll: 'Scroll',
    profileAlt: 'Profile photo',
  },
  metrics: {
    yearsExperience: 'Years Experience',
    projectsDelivered: 'Projects Delivered',
    certifications: 'Certifications',
    technologies: 'Technologies',
  },
  featured: {
    badge: 'Production Portfolio',
    title: 'Selected Engineering Works',
    subtitle:
      'High-impact web systems built with Clean Architecture, robust backend APIs, and modern frontends.',
    viewAll: 'View All Projects',
    categoryFallback: 'Full-Stack',
    descriptionFallback:
      'Enterprise web application designed with scalable architecture, secure APIs, and responsive UI components.',
    openSource: 'Open Source',
    enterpriseSystem: 'Enterprise System',
    caseStudy: 'Case Study',
    footerNote:
      'All enterprise projects emphasize CQRS, Domain-Driven Design, & High Security.',
    statusLabel: 'Status:',
    statusValue: 'Available for Enterprise Solutions',
  },
  blueprint: {
    badge: 'Engineering Philosophy & Standards',
    title: 'System Blueprint',
    subtitle:
      'The architectural pillars I rely on to construct enterprise-grade, maintainable software.',
    exploreProfile: 'Explore Technical Profile',
    pillar: 'PILLAR',
    archSpec: 'ARCH_SPEC:',
    certifiedStatus: 'Status: Certified Engine Standard',
    coreImpl: 'Core Implementations & Frameworks',
    inspector: 'Interactive Architecture Inspector',
    hoverHint: 'Hover or Click pillars to inspect',
    principles: [
      {
        title: 'Clean Architecture',
        subtitle: 'Domain-Driven Core',
        description:
          'Strict separation of concerns using Onion/Clean Architecture. Decoupling core domain logic from infrastructure, database drivers, and UI protocols.',
        metric: '100% Decoupled Core',
      },
      {
        title: 'Scalable Systems',
        subtitle: 'High-Throughput Services',
        description:
          'Engineering microservices and event-driven backends using message brokers to maintain zero data loss and resilient fault tolerance.',
        metric: 'Sub-50ms Latency',
      },
      {
        title: 'Modern Frontend',
        subtitle: 'Type-Safe Reactive Interfaces',
        description:
          'Building responsive UI systems with React, TypeScript, and state management pipelines focused on high UX fidelity and low bundle footprint.',
        metric: '99+ Lighthouse Score',
      },
      {
        title: 'Cloud Native & DevOps',
        subtitle: 'Automated Deployment',
        description:
          'Containerizing services with Docker and orchestrating automated CI/CD pipelines for seamless zero-downtime production deployments.',
        metric: '99.99% Availability',
      },
    ],
  },
  skillsSection: {
    title: 'Toolkit & Capabilities',
    subtitle: 'Core technologies and frameworks I use to engineer end-to-end solutions.',
    viewAll: 'View All Skills',
    proficiency: 'Proficiency',
  },
  contactSection: {
    badge: 'Initiate Collaboration',
    titleA: "Let's Build",
    titleB: 'Something Exceptional',
    subtitle:
      'Have a full-stack system, mobile platform build, or enterprise architecture query? Reach out directly below.',
    workAvailability: 'Work availability',
    availabilityFallback: 'Let’s talk about your project',
    availabilityDescriptionFallback: 'Send a message to discuss your project or collaboration.',
    directChannels: 'Direct Channels',
    emailResponse: 'Email Response',
    workingHours: 'Working hours',
  },
  contactForm: {
    name: 'Name',
    email: 'Email',
    subject: 'Subject',
    message: 'Message',
    nameRequired: 'Name is required',
    emailRequired: 'Email is required',
    invalidEmail: 'Invalid email',
    subjectRequired: 'Subject is required',
    messageRequired: 'Message is required',
    namePlaceholder: 'Omar Hamad',
    emailPlaceholder: 'engineer@example.com',
    subjectPlaceholder: 'Project Inquiry',
    messagePlaceholder: 'Describe your system requirements or project goals...',
    successTitle: 'Transmission Successful',
    successDescription: "Your message has been sent directly. I'll get back to you within 24 hours.",
    sendAnother: 'Send Another',
    sending: 'Sending...',
    send: 'Send Message',
  },
}

export type Strings = typeof en

const ar: Strings = {
  toggle: {
    toArabic: 'التبديل إلى العربية',
    toEnglish: 'التبديل إلى الإنجليزية',
    arabicShort: 'عربي',
    englishShort: 'EN',
  },
  hero: {
    name: 'عمر محمد علي حمد',
    availabilityFallback: 'متاح لفرص العمل',
    imA: 'أنا',
    titlesFallback: ['مطور Full Stack', 'مهندس .NET', 'مهتم بتجربة المستخدم', 'حلّال مشاكل'],
    descriptionFallback:
      'أبني أنظمة قابلة للتوسع وسهلة الصيانة بمعمارية نظيفة وتقنيات حديثة وتجربة استخدام مميزة.',
    viewWork: 'شاهد أعمالي',
    aboutMe: 'من أنا',
    downloadCv: 'تحميل السيرة الذاتية',
    connect: 'تواصل',
    stats: [{ label: 'مشاريع' }, { label: 'خبرة' }, { label: 'Commits' }],
    availableBadge: 'متاح',
    yearsBadge: '+2 سنوات خبرة',
    scroll: 'مرر',
    profileAlt: 'الصورة الشخصية',
  },
  metrics: {
    yearsExperience: 'سنوات خبرة',
    projectsDelivered: 'مشاريع منجزة',
    certifications: 'شهادات',
    technologies: 'تقنيات',
  },
  featured: {
    badge: 'معرض الأعمال',
    title: 'أعمال هندسية مختارة',
    subtitle: 'أنظمة ويب عالية التأثير مبنية بمعمارية نظيفة وواجهات API خلفية قوية وواجهات أمامية حديثة.',
    viewAll: 'عرض كل المشاريع',
    categoryFallback: 'Full-Stack',
    descriptionFallback:
      'تطبيق ويب مؤسسي مصمم بمعمارية قابلة للتوسع وواجهات API آمنة ومكونات واجهة متجاوبة.',
    openSource: 'مفتوح المصدر',
    enterpriseSystem: 'نظام مؤسسي',
    caseStudy: 'دراسة الحالة',
    footerNote: 'جميع المشاريع المؤسسية تركز على CQRS والتصميم الموجه بالمجال والأمان العالي.',
    statusLabel: 'الحالة:',
    statusValue: 'متاح لحلول المؤسسات',
  },
  blueprint: {
    badge: 'الفلسفة والمعايير الهندسية',
    title: 'المخطط المعماري للنظام',
    subtitle: 'الركائز المعمارية التي أعتمد عليها لبناء برمجيات مؤسسية قابلة للصيانة.',
    exploreProfile: 'استكشف الملف التقني',
    pillar: 'ركيزة',
    archSpec: 'مواصفة:',
    certifiedStatus: 'الحالة: معيار هندسي معتمد',
    coreImpl: 'التطبيقات والأطر الأساسية',
    inspector: 'فاحص معماري تفاعلي',
    hoverHint: 'مرر أو انقر على الركائز للفحص',
    principles: [
      {
        title: 'معمارية نظيفة',
        subtitle: 'نواة موجهة بالمجال',
        description:
          'فصل صارم للمسؤوليات باستخدام المعمارية النظيفة/البصلية. فصل منطق المجال الأساسي عن البنية التحتية وقواعد البيانات وواجهات المستخدم.',
        metric: 'نواة مفصولة 100%',
      },
      {
        title: 'أنظمة قابلة للتوسع',
        subtitle: 'خدمات عالية الإنتاجية',
        description:
          'هندسة خدمات مصغرة وخلفيات مدفوعة بالأحداث باستخدام وسطاء الرسائل للحفاظ على عدم فقدان البيانات وتحمل الأعطال.',
        metric: 'زمن استجابة أقل من 50ms',
      },
      {
        title: 'واجهات أمامية حديثة',
        subtitle: 'واجهات تفاعلية آمنة الأنواع',
        description:
          'بناء أنظمة واجهات متجاوبة باستخدام React وTypeScript وخطوط إدارة الحالة مع التركيز على جودة تجربة المستخدم وصغر حجم الحزمة.',
        metric: 'نتيجة Lighthouse +99',
      },
      {
        title: 'سحابة و DevOps',
        subtitle: 'نشر مؤتمت',
        description:
          'تغليف الخدمات بـ Docker وتنظيم خطوط CI/CD مؤتمتة لنشر إنتاجي سلس بدون توقف.',
        metric: 'توفر 99.99%',
      },
    ],
  },
  skillsSection: {
    title: 'العدة والقدرات',
    subtitle: 'التقنيات والأطر الأساسية التي أستخدمها لهندسة حلول متكاملة.',
    viewAll: 'عرض كل المهارات',
    proficiency: 'الإتقان',
  },
  contactSection: {
    badge: 'ابدأ التعاون',
    titleA: 'لنبنِ',
    titleB: 'شيئًا استثنائيًا',
    subtitle: 'هل لديك نظام full-stack أو منصة أو استفسار معماري مؤسسي؟ تواصل مباشرة أدناه.',
    workAvailability: 'توفر العمل',
    availabilityFallback: 'لنتحدث عن مشروعك',
    availabilityDescriptionFallback: 'أرسل رسالة لمناقشة مشروعك أو التعاون.',
    directChannels: 'قنوات مباشرة',
    emailResponse: 'الرد عبر البريد',
    workingHours: 'ساعات العمل',
  },
  contactForm: {
    name: 'الاسم',
    email: 'البريد الإلكتروني',
    subject: 'الموضوع',
    message: 'الرسالة',
    nameRequired: 'الاسم مطلوب',
    emailRequired: 'البريد الإلكتروني مطلوب',
    invalidEmail: 'بريد إلكتروني غير صالح',
    subjectRequired: 'الموضوع مطلوب',
    messageRequired: 'الرسالة مطلوبة',
    namePlaceholder: 'عمر حمد',
    emailPlaceholder: 'engineer@example.com',
    subjectPlaceholder: 'استفسار عن مشروع',
    messagePlaceholder: 'صف متطلبات نظامك أو أهداف مشروعك...',
    successTitle: 'تم الإرسال بنجاح',
    successDescription: 'تم إرسال رسالتك مباشرة. سأرد عليك خلال 24 ساعة.',
    sendAnother: 'إرسال أخرى',
    sending: 'جارٍ الإرسال...',
    send: 'إرسال الرسالة',
  },
}

export const STRINGS: Record<Language, Strings> = { en, ar }
