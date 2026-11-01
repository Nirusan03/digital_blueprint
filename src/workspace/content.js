export const LINKS = {
  iitLinkedin: "https://www.linkedin.com/posts/informatics-institute-of-technology_celebrating-iitian-nirushan-hariharan-best-activity-7409291505158393856-wnDt",
  iitFacebook: "https://www.facebook.com/iitsl/videos/celebrating-iitian-nirushan-hariharan-best-project-innovative-startup-award-/1198194912288987/",
  paper: "https://doi.org/10.1109/QCNC69040.2026.00129",
  adscaiRepository:
    "https://dl.lib.uom.lk/collections/82a1a2f9-fd70-41b2-a766-d599d3bbfadd?spc.page=1&f.author=Hariharan,%20N,equals",
  adscaiPaper:
    "https://dl.lib.uom.lk/bitstreams/b4cd0161-dae4-47c3-bddf-7de6139ca1a1/download",
  ieee: "https://ieeexplore.ieee.org/document/11500296/",
  conference: "https://www.ieee-qcnc.org/2026/accepted-papers.php",
  thesis: "https://dlib.iit.ac.lk/xmlui/handle/123456789/3364",
  westminster:
    "https://www.westminster.ac.uk/about-us/alumni-and-supporters/westminster-alumni-awards/2026-winners/recent-graduate-award-2026",
  linkedin: "https://www.linkedin.com/in/nirusan-hariharan-447463214/",
  immersive: "https://www.immersivesmile.com/",
};
export const TITLES = {
  immersive: "immersive-smile/",
  about: "about.txt",
  research: "quannetdetect.pdf",
  work: "project-archive/",
  experience: "experience.md",
  recognition: "recognition.log",
  stack: "toolkit.txt",
  terminal: "terminal",
  quantum: "playground",
  contact: "contact",
};
export const CAREER = [
  {
    year: "May 2026 — Present",
    company: "Informatics Institute of Technology",
    role: "Visiting Lecturer · Quantum computing mentor",
    description: [
      "Mentoring final-year students on quantum-computing research and projects.",
    ],
    technologies: ["Quantum computing", "Research mentorship"],
  },
  {
    year: "Aug 2025 — Present",
    company: "Niroga AI Inc.",
    role: "Software Engineer",
    description: [
      "Work on backend engineering, AI integrations, and mobile application development.",
      "Contribute to application architecture, cloud infrastructure, and software delivery.",
      "Develop cross-platform experiences with a focus on reliability and maintainability.",
    ],
    metrics: [["40%", "lower average API response time across web and mobile"]],
    technologies: [
      "FastAPI",
      "Python",
      "MCP",
      "Kotlin",
      "Swift",
      "AWS",
      "Docker",
      "PostgreSQL",
    ],
  },
  {
    year: "Aug 2025 — Present",
    company: "BlueLotus360",
    role: "Software Engineer",
    description: [
      "Work on enterprise software and cross-platform application development.",
      "Develop backend services and APIs with a focus on performance and reliability.",
      "Support application maintenance, modernization, and release engineering.",
    ],
    metrics: [["4", "Azure DevOps deployment tracks across iOS and Android"]],
    technologies: [
      "ASP.NET Core",
      "C#",
      "Blazor",
      "Kotlin",
      "Azure DevOps",
      "SQL",
    ],
  },
  {
    year: "2022 — Present",
    company: "Immersive Smile Plus",
    role: "Co-founder & CTO",
    description: [
      "Lead technology development for a VR and IoT healthcare venture with my co-founding team.",
      "Developed the immersive platform and worked on product demonstrations, healthcare collaborations, and hospital adoption.",
    ],
    technologies: [
      "Unity",
      "C#",
      "Virtual reality",
      "IoT",
      "Product development",
    ],
  },
  {
    year: "May — Aug 2025",
    company: "Altrium",
    role: "Associate Software Engineer",
    description: [
      "Worked on full-stack SaaS applications and secure data exchange.",
      "Contributed to AI integrations and application reliability.",
    ],
    metrics: [["50,000+", "users on the PlanYear SaaS platform"], ["100+", "daily communications automated with Spring AI"], ["25%", "faster delivery, saving 5 hours a week"], ["10%", "fewer data-inconsistency incidents in production"]],
    technologies: [
      "Spring Boot",
      "React",
      "Spring AI",
      "MongoDB",
      "RabbitMQ",
      "AWS",
    ],
  },
  {
    year: "2023 — 2024",
    company: "Vetstoria",
    role: "Software Engineer Intern",
    description: [
      "Improved a Spring Boot reporting API used by veterinary clinics.",
      "Worked on message-queue middleware across SaaS products and an internal frontend component framework.",
    ],
    metrics: [["200", "clinics on the Reporting API, with 12% more session coverage"], ["40%", "of clinics relied on Autonoe, across 4 SaaS products"], ["20%", "deeper insights for business decisions"]],
    technologies: ["Spring Boot", "React", "Vue", "MySQL", "AWS"],
  },
  {
    year: "2023 — 2024",
    company: "Izatic",
    role: "Full-stack Developer",
    description: [
      "Built responsive e-commerce and portfolio websites, adapting themes and plugins to client requirements.",
    ],
    technologies: ["WordPress", "HTML", "CSS", "MySQL"],
  },
];
export const RECOGNITION = [
  {
    year: "2026",
    title: "Recent Graduate Award — finalist",
    preview: "/previews/westminster-award.webp",
    icon: "laurels",
    tone: "gold",
    detail: "University of Westminster Alumni Awards.",
    url: LINKS.westminster,
  },
  {
    year: "2026",
    title: "QuanNetDetect published at IEEE QCNC",
    preview: "/research/ieee-qcnc-first-page.webp",
    icon: "quantum",
    tone: "cyan",
    detail: "Co-authored with Guhanathan Poravi. QCNC 2026, Kobe, Japan.",
    url: LINKS.paper,
  },
  {
    year: "2025",
    title: "First Class Honours · BSc Computer Science",
    preview: "/previews/convocation-2025.webp",
    icon: "graduate",
    tone: "lavender",
    detail:
      "University of Westminster / IIT. Research score: 92%. Best Final Year Research Project — Faculty of Computing.",
    url: LINKS.iitLinkedin,
    links: [
      { label: "IIT’s post", url: LINKS.iitLinkedin },
      { label: "Facebook", url: LINKS.iitFacebook },
    ],
  },
  {
    year: "2025",
    title: "Best Undergraduate Research — ADScAI",
    preview: "/previews/adscai-repository.webp",
    icon: "research",
    tone: "mint",
    detail:
      "QuanNetDetect, University of Moratuwa. Also shortlisted for NBQSA.",
    url: LINKS.adscaiRepository,
  },
  {
    year: "2026",
    title: "Immersive Smile Plus — national showcases",
    preview: "/previews/immersive-website.webp",
    icon: "globe",
    tone: "cyan",
    detail:
      "Disrupt Asia, National AI Expo, and SLT AI Expo participation. Selected for StartupTN.",
    url: LINKS.linkedin,
  },
  {
    year: "",
    title: "Best Innovative Tech Product · IIT",
    preview: "/previews/immersive-website.webp",
    icon: "immersive",
    tone: "peach",
    detail:
      "Immersive Smile Plus. Also 1st Runner-Up, Yarl IT Hub Innovative Solution Award.",
    url: LINKS.linkedin,
  },
  {
    year: "2023",
    title: "1st Runner-Up · IEEE Innovation Nation Sri Lanka",
    preview: "/previews/immersive-website.webp",
    icon: "trophy",
    tone: "gold",
    detail: "Immersive Smile Plus, Idea Stage.",
    url: "https://www.linkedin.com/posts/nirusan-hariharan-447463214_ieee-innovation-of-sri-lanka-insl-awarded-activity-7045885862596808704-adB9",
  },
  {
    year: "2023",
    title: "1st Runner-Up · Haxmas",
    icon: "code",
    tone: "lavender",
    detail: "ElderGuardian, built with my team.",
    url: LINKS.linkedin,
  },
  {
    year: "2022",
    title: "Grand finalist · HACKX 7.0",
    preview: "/previews/immersive-website.webp",
    icon: "launch",
    tone: "peach",
    detail: "VR healthcare project. University of Kelaniya.",
    url: LINKS.linkedin,
  },
  {
    year: "2022",
    title: "2nd Runner-Up · Cutting Edge",
    icon: "podium",
    tone: "mint",
    detail:
      "IIT team project in full-stack development and e-commerce trading.",
    url: LINKS.linkedin,
  },
  {
    year: "2022",
    title: "Business Faculty finalist · Cutting Edge",
    icon: "growth",
    tone: "cyan",
    detail: "A team project exploring an application for digital trading.",
    url: LINKS.linkedin,
  },
];

export const toolkit = [
  [
    "Languages",
    [
      ["Python", "python"],
      ["Java", "java"],
      ["C#", "csharp"],
      ["TypeScript", "typescript"],
      ["JavaScript", "javascript"],
      ["Kotlin", "kotlin"],
      ["Swift", "swift"],
    ],
  ],
  [
    "Backend",
    [
      ["FastAPI", "fastapi"],
      ["Spring Boot", "spring"],
      ["ASP.NET Core", "dotnetcore"],
      ["Node.js", "nodejs"],
      ["Flask", "flask"],
    ],
  ],
  [
    "Frontend",
    [
      ["React", "react"],
      ["Next.js", "nextjs"],
      ["Angular", "angular"],
      ["Vue", "vuejs"],
      ["Blazor", "blazor"],
    ],
  ],
  [
    "AI & quantum",
    [
      ["LLM integrations", "concept-llm"],
      ["MCP", "concept-mcp"],
      ["TensorFlow", "tensorflow"],
      ["Qiskit", "qiskit"],
      ["PennyLane", "concept-circuit"],
    ],
  ],
  [
    "Data",
    [
      ["PostgreSQL", "postgresql"],
      ["MongoDB", "mongodb"],
      ["MySQL", "mysql"],
      ["Firebase", "firebase"],
      ["Supabase", "supabase"],
      ["SQLite", "sqlite"],
    ],
  ],
  [
    "Infrastructure",
    [
      ["AWS", "amazonwebservices"],
      ["Azure", "azure"],
      ["Linode", "concept-cloud"],
      ["Docker", "docker"],
      ["Jenkins", "jenkins"],
      ["Azure DevOps", "azuredevops"],
    ],
  ],
  [
    "Immersive & mobile",
    [
      ["Unity", "unity"],
      ["Unreal Engine", "unrealengine"],
      ["VR", "concept-vr"],
      ["IoT", "concept-iot"],
      ["Android", "android"],
      ["iOS", "apple"],
    ],
  ],
];
