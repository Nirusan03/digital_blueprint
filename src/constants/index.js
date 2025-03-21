import project1 from "../assets/projects/project-1.webp";
import project2 from "../assets/projects/project-2.webp";
import project3 from "../assets/projects/project-3.webp";
import project4 from "../assets/projects/project-4.webp";

export const HERO_CONTENT = `I am a full stack developer with a strong focus on building scalable, high-quality web applications. Over the past three years, I have worked extensively with back-end technologies such as Spring Boot, Node.js, Flask, FastAPI, and databases including MySQL, PostgreSQL, and MongoDB. On the front end, I have experience using frameworks like React, AngularJS, and Vue.js. I enjoy solving real-world problems through clean, efficient code and aim to create solutions that enhance user experience and support business goals.`;

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
  },
  {
    title: "EmploySync Platform",
    image: project2,
    description:
      "A web based recruitment management system with recruiter, applicant, and admin roles, facilitating job postings, applications, team management, and interview scheduling with an intuitive UI.",
    technologies: ["Node.js", "Angular.js", "Figma", "MongoDB", "Docker"],
  },
  {
    title: "MedEase Procurement System ",
    image: project3,
    description:
      "A web based application for healthcare e-procurement with vendor, customer, and admin roles, streamlining supply requests, orders, and stock management.",
    technologies: ["Flask", "React.js", "MongoDB", "Swagger", "Keras", "Tensorflow"],
  },
  {
    title: "CarNexus Platform",
    image: project4,
    description:
      "A smart vehicle service booking platform integrating machine learning for optimized scheduling, featuring customer and service owner roles, seamless bookings, and exclusive member benefits.",
    technologies: ["FastAPI", "React.js", "Tailwind", "MongoDB"],
  },
  {
    title: "ElderGuardian-MonitorSystem",
    image: project3,
    description:
      "A full-stack elder monitoring system using Flask and Flutter, featuring real-time video streaming, AI-based fall detection, alert notifications, and secure user authentication.",
    technologies: ["Flask", "Vue.js", "OpenCV", "Tensorflow", "Scikit learn", "Mysql", "Docker", "Jenkins"],
  },
  
];

export const CONTACT = {
  address: "Moor's Road, Colombo 06, Sri Lanka",
  phoneNo: "+76 711 9285",
  email: "nirusan.hariharan350@gmail.com",
};
