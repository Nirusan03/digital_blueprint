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

export const MY_CONTENT = `I am a full stack developer with a strong focus on building scalable, high-quality web applications. Over the past three years, I have worked extensively with back-end technologies such as Spring Boot, Node.js, Flask, FastAPI, and databases including MySQL, PostgreSQL, and MongoDB. On the front end, I have experience using frameworks like React, AngularJS, and Vue.js. I enjoy solving real-world problems through clean, efficient code and aim to create solutions that enhance user experience and support business goals.`;

export const ABOUT_TEXT = `I am a versatile and committed full stack developer with a passion for building intuitive, high-performing web applications. Over the past three years, I have gained hands-on experience with a wide range of technologies, including Spring Boot, Flask APIs, React, Vue.js, Node.js, Docker, and databases like MySQL, PostgreSQL, and MongoDB. What began as a curiosity about how things work has grown into a fulfilling career where I am constantly learning and tackling new challenges. I enjoy working in collaborative teams and take pride in finding smart, reliable solutions to complex problems. Beyond development, I like staying active, exploring emerging tech, and contributing to open-source projects.`;

export const EXPERIENCES = [
  {
    year: "2023 - 2024",
    role: "Software Engineer Intern",
    company: "Vestoria",
    description: `Led the development of an internal API service application using Spring Boot, Vue.js, and MySQL. Engineered a mediator application integrating company and client systems with Kafka, Spring Boot, React.js, and MySQL. Created an internal UI library with Vue.js to ensure consistent frontend design.`,
    technologies: ["Springboot", "React.js", "Vue.js", "MySQL", "Docker", "AWS", "Amazon ECS", "RESTful API"],
  },
  {
    year: "2023 - 2024",
    role: "Full Stack Developer",
    company: "Izatic",
    description: `​Developed dynamic e-commerce and portfolio websites utilizing WordPress, HTML, CSS, and MySQL, resulting in enhanced user engagement and increased online sales. Implemented responsive design principles to ensure seamless user experiences across various devices. Collaborated with clients to customize themes and plugins, tailoring solutions to meet specific business needs.`,
    technologies: ["WordPress", "HTML", "CSS", "MySQL"],
  },
  {
    year: "2022 - 2025",
    role: "Founder",
    company: "Immersive Smile Plus",
    description: `Built an enterprise-level virtual reality application to help reduce psychological pain through immersive environments, using Unity and Unreal Engine with C#, React.js for the web interface, and Firebase for data management.`,
    technologies: ["C#", "Virtual Reality", "React.js", "MongoDB", "Unity", "Unreal Engine"],
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
      { label: "Backend", url: "https://github.com/itzmalith/EmploySyncBackend" }
    ],
  },
  {
    title: "MedEase Procurement System ",
    image: project3,
    description:
      "A web based application for healthcare e-procurement with vendor, customer, and admin roles, streamlining supply requests, orders, and stock management.",
    technologies: ["Flask", "React.js", "MongoDB", "Swagger", "Keras", "Tensorflow"],
    github: "https://github.com/Nirusan03/MedEase_Procurement_System",
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
    description: "A Java-based console application for managing cruise ship cabin bookings. Supports up to 36 passengers across 12 cabins with dynamic queue management. Implements a circular queue to handle overflow passengers, file-based data persistence, alphabetical sorting, and real-time passenger expense tracking.",
    technologies: ["Java", "JDK 8+","CLI"],
    github: "https://github.com/Nirusan03/Cruise-ship-management"
  },
  {
    title: "Skin Consultation Manager",
    image: project10,
    description: "A full-stack Java application for managing skin consultation clinics. The system provides both command-line and GUI interfaces to manage doctors and consultations efficiently. It supports adding, viewing, and removing doctors, scheduling consultations with conflict detection, and persistent file storage.",
    technologies: ["Java", "Java Swing","JDK 8+","CLI", "GUI"],
    github: "https://github.com/Nirusan03/Skin_Consultation_Manger"
  },
  {
    title: "ElderGuardian-MonitorSystem",
    image: project5,
    description:
      "A full-stack elder monitoring system using Flask and Flutter, featuring real-time video streaming, AI-based fall detection, alert notifications, and secure user authentication.",
    technologies: ["Flask", "Vue.js", "Dart", "OpenCV", "Tensorflow", "Scikit learn", "Mysql", "Docker", "Jenkins"],
    github: "https://github.com/Nirusan03/ElderGuardian-MonitorSystem",
  },
  {
    title: "Project X",
    image: project9,
    description:
      "A web-based application designed to recommend scholarship opportunities and suitable job roles based on a user’s educational history. It uses a Decision Tree model to support user decision-making and a Naive Bayes classifier to suggest relevant scholarships.",
    technologies: ["Flask", "React.js", "Tensorflow", "Scikit learn", "MongoDB"],
    github: "https://github.com/PasanPunsaraDeshapriya/ImplementationSDGP",
  },
  {
    title: "Risk-Lens",
    image: project6,
    description: "A machine learning project that predicts insurance claim severity and detects fraudulent claims using XGBoost, LightGBM, and Random Forest Regressor models. The system includes preprocessing, model training, evaluation, and hyperparameter tuning pipelines with support for Optuna-based optimisation.",
    technologies: ["Python", "XGBoost", "LightGBM", "Random Forest", "Optuna", "Pandas", "Scikit-learn"],
    github: "https://github.com/Nirusan03/RiskLens",
  },
  {
    title: "Pronunciation Trainer for Autism Support",
    image: project7,
    description: "An offline Python-based speech pronunciation trainer designed to assist individuals with autism. Utilises the Vosk API for real-time speech recognition and compares user speech against predefined words to provide human-friendly pronunciation guidance and feedback.",
    technologies: ["Python", "Vosk API", "PyAudio", "NLTK", "pyttsx3"],
    github: "https://github.com/Nirusan03/ATD_SpeechTherapy"
  },
  {
    title: "Education-risk-analysis",
    image: project8,
    description: "A machine learning application that identifies primary school students at risk of underperforming in writing. It uses early literacy, numeracy, demographic, and socio-economic data to provide meaningful insights and support early intervention through predictive modelling and student grouping.",
    technologies: ["Python", "scikit-learn", "Pandas", "SMOTE", "Matplotlib", "Seaborn", "PCA"],
    github: "https://github.com/Nirusan03/Education-risk-analysis"
  }
];

export const CONTACT = {
  address: "Moor's Road, Colombo 06, Sri Lanka",
  phoneNo: "+76 711 9285",
  email: "nirusan.hariharan350@gmail.com",
};
