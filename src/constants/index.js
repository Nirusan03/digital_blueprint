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

export const PROJECTS = [
  {
    title: "Immersive Smile Plus",
    preview: {"src": "/previews/immersive-website.webp", "url": "https://www.immersivesmile.com/", "kind": "website", "alt": "Public Immersive Smile homepage showing its VR healthcare product.", "caption": "Public website preview · Immersive Smile"},
    image: null,
    description:
      "VR and IoT for healthcare. I’m the Co-founder and CTO, developing immersive experiences with our founding team.",
    technologies: ["Unity", "C#", "Virtual Reality", "IoT"],
    website: "https://www.immersivesmile.com/",
    collaborators: [
      "Jaiyramanan Vijayaalayan",
      "Sankeetha Elancheliyan",
      "Ashvin Vigneshwaran",
    ],
  },
  {
    title: "QuanNetDetect",
    preview: {"src": "/research/ieee-qcnc-first-page.webp", "url": "https://doi.org/10.1109/QCNC69040.2026.00129", "kind": "paper", "alt": "First-page preview of the IEEE QCNC 2026 QuanNetDetect paper.", "caption": "IEEE QCNC 2026 · First-page image preview"},
    publication: "https://doi.org/10.1109/QCNC69040.2026.00129",
    image: project1,
    description:
      "A system focused on detecting encrypted malicious TLS traffic using quantum deep learning models for enhanced accuracy, efficiency, and interpretability.",
    technologies: ["Flask", "Pennylane", "Qiskit", "React.js", "MongoDB"],
    github: "https://github.com/Nirusan03/QuanNetDetct",
  },
  {
    title: "Niroga AI",
    preview: {"src": "/previews/niroga-website.webp", "url": "https://orders.niroga.ai/", "kind": "website", "alt": "Niroga AI online store homepage featuring the Niroga 470.", "caption": "Public website preview · Niroga AI online store"},
    image: null,
    role: "Software Engineer",
    description:
      "I maintain Niroga AI’s healthcare website, online store, and Android application, alongside backend and AI integration work.",
    technologies: ["Python", "FastAPI", "AI integrations", "Android", "Web"],
    links: [
      { label: "Website", url: "https://niroga.ai/" },
      { label: "Online store", url: "https://orders.niroga.ai/" },
      { label: "Android app", url: "https://play.google.com/store/apps/details?id=com.nirogaaiauscultation&hl=en" },
    ],
  },
  {
    title: "BlueLotus360",
    preview: {"src": "/previews/bluelotus-dashboard.webp", "screens": [{ "src": "/previews/bluelotus-dashboard.webp", "alt": "BL360 ERP Go dashboard interface, from the official App Store screenshot." }, { "src": "/previews/bluelotus-approvals.webp", "alt": "BL360 ERP Go waiting-list interface, from the official App Store screenshot." }], "url": "https://apps.apple.com/us/app/bl-360-erp-mobile-go/id6775718818", "kind": "app", "alt": "Official BL360 ERP Go app interface previews.", "caption": "App Store · interface details"},
    image: null,
    role: "Software Engineer",
    description:
      "I build and maintain the ERP applications across Android, iOS, and Windows, and work on the backend services that support them.",
    technologies: ["C#", "ASP.NET Core", "Blazor Hybrid", "Kotlin", "SQL"],
    links: [
      { label: "Windows app", url: "https://apps.microsoft.com/detail/9p6rwsmqcjh5?hl=en-US&gl=LK" },
      { label: "Android app", url: "https://play.google.com/store/apps/details?id=com.bl360.ui.blkotlinui&hl=en" },
      { label: "iOS app", url: "https://apps.apple.com/us/app/bl-360-erp-mobile-go/id6775718818" },
    ],
  },
  {
    title: "SENOVA",
    preview: {"src": "/previews/senova-website.webp", "url": "https://senovaproducts.com/", "kind": "website", "alt": "Public SENOVA homepage showing its smart ring product range.", "caption": "Public website preview · SENOVA"},
    image: null,
    role: "Product engineering · Niroga AI",
    description:
      "I maintain the ring and strap product websites and the Android companion application for SENOVA’s wearable products.",
    technologies: ["Web", "E-commerce", "Android", "Connected devices"],
    links: [
      { label: "Global website", url: "https://senovaproducts.com/" },
      { label: "Sri Lanka website", url: "https://senovaproducts.lk/" },
      { label: "Android app", url: "https://play.google.com/store/apps/details?id=com.healthspan.stainlessring&hl=en" },
    ],
  },
  {
    title: "EmploySync Platform",
    sourceStatus: "unavailable",
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
    collaborators: [
      "Jaiyramanan Vijayaalayan",
      "Rishimithun Muralidharan",
      "Al Arfith Ahamed",
    ],
    image: project5,
    description:
      "A remote elder-care prototype combining live conferencing, VR, and environment monitoring, with motion detection and alerts. Developed with my team for Haxmas 2023, where we placed first runner-up.",
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

export const CONTACT = { email: "nirusan.hariharan350@gmail.com" };
