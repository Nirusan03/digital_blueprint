import project1 from "../assets/projects/project-1.webp";
import project2 from "../assets/projects/project-2.webp";
import project3 from "../assets/projects/project-3.webp";
import project4 from "../assets/projects/project-4.webp";
import project5 from "../assets/projects/project-5.webp";
import project6 from "../assets/projects/project-6.webp";
import project7 from "../assets/projects/project-7.webp";
import project8 from "../assets/projects/project-8.webp";
import project9 from "../assets/projects/project-9.webp";
import project10 from "../assets/projects/project-10.webp";
import project11 from "../assets/projects/project-11.webp";
import project12 from "../assets/projects/project-12.webp";

export const MY_CONTENT = `I am a Software Engineer with a strong focus on building production-grade REST APIs, AI-integrated backends, and scalable full-stack applications. I have worked extensively with backend technologies such as FastAPI, Spring Boot, ASP.NET Core, and Node.js, databases including PostgreSQL, MongoDB, and Firebase, and cloud infrastructure across AWS and Azure. I have hands-on experience integrating LLMs, MCP, and building multi-platform mobile applications. I enjoy solving real-world engineering challenges through clean, efficient code and aim to build solutions that are performant, secure, and impactful.`;

export const ABOUT_TEXT = `I am a versatile and committed full stack developer with a passion for building intuitive, high-performing web applications. Over the past three years, I have gained hands-on experience with a wide range of technologies, including Spring Boot, Flask APIs, React, Vue.js, Node.js, Docker, and databases like MySQL, PostgreSQL, and MongoDB. What began as a curiosity about how things work has grown into a fulfilling career where I am constantly learning and tackling new challenges. I enjoy working in collaborative teams and take pride in finding smart, reliable solutions to complex problems. Beyond development, I like staying active, exploring emerging tech, and contributing to open-source projects.`;

export const EXPERIENCES = [
  {
    year: "2025 Aug - Present",
    role: "Software Engineer",
    company: "Niroga AI Inc.",
    description: [
      "Spearheaded end-to-end backend architecture under Dr. Yasantha Rajakarunanayake, building a production-grade FastAPI REST API with latency management, async processing, and thread-safe concurrency — reducing average API response time by 40% across web and mobile clients.",
      "Architected a multi-LLM gateway integrating Gemini and OpenAI APIs with MCP (Model Context Protocol) to expose backend services as AI-accessible tools with centralized LLM traffic governance.",
      "Solely owned the complete CI/CD pipeline across AWS EC2 and Linode (production + staging) with Docker and Git automation, handling all server security operations including malware detection, anomaly monitoring, and infrastructure hardening.",
      "Developed Kotlin (Android) and Swift (iOS) mobile applications with an offline-first sync architecture using SQLite, PowerSync, and Supabase, ensuring seamless data consistency across zero-connectivity environments.",
    ],
    technologies: [
      "FastAPI",
      "Python",
      "MCP",
      "Gemini API",
      "OpenAI API",
      "JWT",
      "Firebase",
      "AWS EC2",
      "Linode",
      "Docker",
      "Kotlin",
      "Swift",
      "SQLite",
      "PowerSync",
      "Supabase",
      "PostgreSQL",
    ],
  },
  {
    year: "2025 Aug - Present",
    role: "Software Engineer",
    company: "BlueLotus360 (PVT) Ltd",
    description: [
      "Engineered a complete Ticketing Management System for an ERP solution on ASP.NET Core with Azure Notification Hub, designing sync and async APIs with latency management, bottleneck handling, and thread-safe concurrency — backed by a persistent FCM and APNS notification queue with automatic retry under high-concurrency loads.",
      "Architected a complete Azure DevOps CI/CD pipeline across 4 deployment tracks for iOS and Android, resolving a critical bundle ID conflict causing application swapping between two co-existing versions, enabling independent parallel builds for both legacy and active codebases.",
      "Drove the full migration of the legacy Blazor Hybrid ERP mobile application to the latest framework, establishing clean codebase separation between BL10 and BL11 across both platforms.",
    ],
    technologies: [
      "ASP.NET Core",
      "C#",
      "Blazor Hybrid",
      "Syncfusion",
      "SQL",
      "SSMS",
      "Azure DevOps",
      "Azure Notification Hub",
      "FCM",
      "APNS",
      "iOS",
      "Android",
    ],
  },
  {
    year: "2025 May - 2025 Aug",
    role: "Associate Software Engineer",
    company: "Altrium",
    description: [
      "Coordinated the lifecycle of PlanYear, a SaaS platform used in Silicon Valley, enabling secure data exchange for 50,000+ users across brokers, carriers, and buyers with multi-level access control.",
      "Integrated Spring AI with email generation for insurance proposal exports, automating 100+ daily communications, saving 5 hours weekly, and accelerating delivery by 25%.",
      "Revamped project workflows addressing critical support bugs that caused data inconsistencies, leading to a 10% reduction in production incidents.",
    ],
    technologies: [
      "Spring Boot",
      "React.js",
      "FastAPI",
      "Spring AI",
      "MongoDB",
      "RabbitMQ",
      "AWS",
      "Jenkins",
      "Docker",
      "Gradle",
    ],
  },
  {
    year: "2023 - 2024",
    role: "Software Engineer Intern",
    company: "Vetstoria",
    description: [
      "Enhanced the Reporting API with Spring Boot, increasing session data coverage by 12% for 200 clinics and delivering 20% deeper insights for business decisions.",
      "Played a key role in Autonoe, a middleware solution orchestrating message queues across 4 SaaS products, relied on by 40% of clinics for seamless integration between PIMS and applications.",
      "Developed features and documentation in an internal frontend component framework, ensuring design consistency across 4 internal teams.",
    ],
    technologies: [
      "Spring Boot",
      "React.js",
      "Vue.js",
      "MySQL",
      "Docker",
      "AWS",
      "Amazon ECS",
      "RESTful API",
    ],
  },
  {
    year: "2023 - 2024",
    role: "Full Stack Developer",
    company: "Izatic",
    description: [
      "Developed dynamic e-commerce and portfolio websites utilizing WordPress, HTML, CSS, and MySQL, resulting in enhanced user engagement and increased online sales.",
      "Implemented responsive design principles to ensure seamless user experiences across various devices.",
      "Collaborated with clients to customize themes and plugins, tailoring solutions to meet specific business needs.",
    ],
    technologies: ["WordPress", "HTML", "CSS", "MySQL"],
  },
  {
    year: "2022 - 2025",
    role: "Founder",
    company: "Immersive Smile Plus",
    description: [
      "Founded and led development of a VR-based mental wellness platform, clinically trialed with 50+ pediatric patients, reporting zero pain levels at the initial stage.",
      "Presented a digital anesthesia product with IoT and VR, adopted by 5+ top Sri Lankan hospitals, boosting engagement by 80%.",
    ],
    technologies: [
      "C#",
      "Virtual Reality",
      "React.js",
      "Firebase",
      "Unity",
      "Unreal Engine",
    ],
  },
];

export const PROJECTS = [
  {
    title: "QuanNetDetect",
    image: project1,
    description:
      "A system focused on detecting encrypted malicious TLS traffic using quantum deep learning models for enhanced accuracy, efficiency, and interpretability.",
    technologies: ["Flask", "Pennylane", "Qiskit", "React.js", "MongoDB"],
    github: "https://github.com/Nirusan03/QuanNetDetct",
  },
  {
    title: "EmploySync Platform",
    image: project2,
    description:
      "A web based recruitment management system with recruiter, applicant, and admin roles, facilitating job postings, applications, team management, and interview scheduling with an intuitive UI.",
    technologies: ["Node.js", "Angular.js", "Figma", "MongoDB", "Docker"],
    githubs: [
      { label: "Frontend", url: "https://github.com/Nirusan03/EmploySync_UI" },
      {
        label: "Backend",
        url: "https://github.com/itzmalith/EmploySyncBackend",
      },
    ],
  },
  {
    title: "MedEase Procurement System ",
    image: project3,
    description:
      "A web based application for healthcare e-procurement with vendor, customer, and admin roles, streamlining supply requests, orders, and stock management.",
    technologies: [
      "Flask",
      "React.js",
      "MongoDB",
      "Swagger",
      "Keras",
      "Tensorflow",
    ],
    github: "https://github.com/Nirusan03/MedEase_Procurement_System",
  },
  {
    title: "Student Hub",
    image: project12,
    description:
      "A modern full stack application built with Spring Boot and React.js to manage student records efficiently. Designed for academic use, it allows adding, viewing, and deleting students through a responsive UI backed by a robust RESTful API and PostgreSQL integration.",
    technologies: [
      "Java",
      "Spring Boot",
      "React.js",
      "PostgreSQL",
      "REST API",
      "HTML",
      "CSS",
      "JavaScript",
    ],
    githubs: [
      { label: "Frontend", url: "https://github.com/Nirusan03/student-hub-ui" },
      { label: "Backend", url: "https://github.com/Nirusan03/student-hub-api" },
    ],
  },
  {
    title: "CarNexus Platform",
    image: project4,
    description:
      "A smart vehicle service booking platform integrating machine learning for optimized scheduling, featuring customer and service owner roles, seamless bookings, and exclusive member benefits.",
    technologies: ["FastAPI", "React.js", "Tailwind", "MongoDB"],
    github: "https://github.com/Nirusan03/CarNexus",
  },
  {
    title: "Cruise Ship Management",
    image: project11,
    description:
      "A Java-based console application for managing cruise ship cabin bookings. Supports up to 36 passengers across 12 cabins with dynamic queue management. Implements a circular queue to handle overflow passengers, file-based data persistence, alphabetical sorting, and real-time passenger expense tracking.",
    technologies: ["Java", "JDK 8+", "CLI"],
    github: "https://github.com/Nirusan03/Cruise-ship-management",
  },
  {
    title: "Skin Consultation Manager",
    image: project10,
    description:
      "A full-stack Java application for managing skin consultation clinics. The system provides both command-line and GUI interfaces to manage doctors and consultations efficiently. It supports adding, viewing, and removing doctors, scheduling consultations with conflict detection, and persistent file storage.",
    technologies: ["Java", "Java Swing", "JDK 8+", "CLI", "GUI"],
    github: "https://github.com/Nirusan03/Skin_Consultation_Manger",
  },
  {
    title: "ElderGuardian-MonitorSystem",
    image: project5,
    description:
      "A full-stack elder monitoring system using Flask and Flutter, featuring real-time video streaming, AI-based fall detection, alert notifications, and secure user authentication.",
    technologies: [
      "Flask",
      "Vue.js",
      "Dart",
      "OpenCV",
      "Tensorflow",
      "Scikit learn",
      "Mysql",
      "Docker",
      "Jenkins",
    ],
    github: "https://github.com/Nirusan03/ElderGuardian-MonitorSystem",
  },
  {
    title: "Project X",
    image: project9,
    description:
      "A web-based application designed to recommend scholarship opportunities and suitable job roles based on a user’s educational history. It uses a Decision Tree model to support user decision-making and a Naive Bayes classifier to suggest relevant scholarships.",
    technologies: [
      "Flask",
      "React.js",
      "Tensorflow",
      "Scikit learn",
      "MongoDB",
    ],
    github: "https://github.com/PasanPunsaraDeshapriya/ImplementationSDGP",
  },
  {
    title: "Risk-Lens",
    image: project6,
    description:
      "A machine learning project that predicts insurance claim severity and detects fraudulent claims using XGBoost, LightGBM, and Random Forest Regressor models. The system includes preprocessing, model training, evaluation, and hyperparameter tuning pipelines with support for Optuna-based optimisation.",
    technologies: [
      "Python",
      "XGBoost",
      "LightGBM",
      "Random Forest",
      "Optuna",
      "Pandas",
      "Scikit-learn",
    ],
    github: "https://github.com/Nirusan03/RiskLens",
  },
  {
    title: "Pronunciation Trainer for Autism Support",
    image: project7,
    description:
      "An offline Python-based speech pronunciation trainer designed to assist individuals with autism. Utilises the Vosk API for real-time speech recognition and compares user speech against predefined words to provide human-friendly pronunciation guidance and feedback.",
    technologies: ["Python", "Vosk API", "PyAudio", "NLTK", "pyttsx3"],
    github: "https://github.com/Nirusan03/ATD_SpeechTherapy",
  },
  {
    title: "Education-risk-analysis",
    image: project8,
    description:
      "A machine learning application that identifies primary school students at risk of underperforming in writing. It uses early literacy, numeracy, demographic, and socio-economic data to provide meaningful insights and support early intervention through predictive modelling and student grouping.",
    technologies: [
      "Python",
      "scikit-learn",
      "Pandas",
      "SMOTE",
      "Matplotlib",
      "Seaborn",
      "PCA",
    ],
    github: "https://github.com/Nirusan03/Education-risk-analysis",
  },
];

export const CONTACT = {
  address: "Moor's Road, Colombo 06, Sri Lanka",
  phoneNo: "+76 711 9285",
  email: "nirusan.hariharan350@gmail.com",
};
