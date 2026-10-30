import { useEffect, useRef, useState } from "react";
import { CONTACT, PROJECTS } from "../constants";
import { CAREER, LINKS, RECOGNITION } from "./content";
import portrait from "../assets/portraits/nirusan-cutout-v2.webp";
import "./portrait.css";
import "./toolkit.css";
import "./milestones.css";
import MilestoneIcon from "./MilestoneIcon";
import ExperienceRow from "./ExperienceRow";
import "./experience-motion.css";
import useFileChoreography from "./useFileChoreography";
import PaperPreview from "./PaperPreview";
import ProjectMedia, { ProjectIllustration } from "./ProjectMedia";
import ResearchResults from "./ResearchResults";
import QuantumLab from "./QuantumLab";
export function AboutFile() {
  const reveal=useFileChoreography();
  return (
    <div className="about-file" ref={reveal}>
      <figure>
        <img src={portrait} alt="Nirusan Hariharan" width="220" height="280" />
        <figcaption>Colombo, Sri Lanka</figcaption>
      </figure>
      <div>
        <p className="file-eyebrow">ABOUT / NIRUSAN HARIHARAN</p>
        <h2>
          Software engineer.
          <br />
          Quantum researcher.
          <br />
          Co-founder & CTO.
        </h2>
        <p>
          I work on AI systems, backends, and full-stack products with teams in
          Sri Lanka and the US. I’m the Co-founder and CTO of Immersive Smile
          Plus, where we build with VR and IoT for healthcare.
        </p>
        <p>
          I graduated with First Class Honours in Computer Science from the
          University of Westminster through IIT. My research, QuanNetDetect, is
          published in the IEEE QCNC 2026 proceedings.
        </p>
        <p>
          Since May 2026, I’ve also been a visiting lecturer at IIT, mentoring
          final-year students in quantum computing. Outside work, I take on
          freelance projects and make time for sports.
        </p>
        <div className="file-links">
          <a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn ↗
          </a>
          <a href="/Nirusan_Hariharan_CV.pdf" download>
            Résumé ↓
          </a>
        </div>
      </div>
    </div>
  );
}
export function ResearchFile({ motion = true }) {
  return (
    <article className="research-file">
      <div className="research-intro">
      <p className="file-eyebrow">PUBLISHED RESEARCH / APRIL 2026</p>
      <h2>QuanNetDetect</h2>
      <p className="research-title">
        A Quantum Hybrid Deep Learning Framework for Encrypted TLS Malicious
        Traffic Detection
      </p>
      <p className="research-authors">Nirusan Hariharan · Guhanathan Poravi</p>
      <div className="file-rule" />
      <p>
        Detecting malicious network traffic without decrypting it. My research
        combines classical deep learning with quantum models to analyse
        encrypted TLS traffic while preserving privacy.
      </p>
      </div>
      <dl className="research-facts">
        <div>
          <dt>Published at</dt>
          <dd>IEEE QCNC 2026 · Kobe, Japan</dd>
        </div>
        <div>
          <dt>Binary detection</dt>
          <dd>
            99.95% validation accuracy · CIC-Darknet-2020
            {" "}<a href={LINKS.paper} target="_blank" rel="noopener noreferrer">[IEEE paper]</a>
          </dd>
        </div>
        <div>
          <dt>Research score</dt>
          <dd>92% · First Class Honours</dd>
        </div>
        <div>
          <dt>Recognition</dt>
          <dd>
            Best Undergraduate Research, ADScAI / University of Moratuwa. Best
            Final Year Research Project, IIT.
          </dd>
        </div>
      </dl>
      <p>
        Westminster’s 2026 alumni awards profile discusses the framework and its
        research contributions. I was a finalist in its Recent Graduate Award
        category.
      </p>
      <div className="file-links">
        <a href={LINKS.paper} target="_blank" rel="noopener noreferrer">
          Read the IEEE paper ↗
        </a>
        <a href={LINKS.thesis} target="_blank" rel="noopener noreferrer">
          IIT thesis record ↗
        </a>
        <a href={LINKS.conference} target="_blank" rel="noopener noreferrer">
          Accepted papers ↗
        </a>
      </div>
      <p className="document-note">DOI: 10.1109/QCNC69040.2026.00129</p>
      <div className="file-rule" />
      <QuantumLab motion={motion} />
      <ResearchResults />
      <PaperPreview />
      <div className="file-rule" />
      <h3>ADScAI 2025</h3>
      <p>
        QuanNetDetect received the Best Undergraduate Research award at ADScAI,
        hosted by the University of Moratuwa. The university library provides
        the repository entry and conference download below.
      </p>
      <div className="file-links">
        <a
          href={LINKS.adscaiRepository}
          target="_blank"
          rel="noopener noreferrer"
        >
          ADScAI repository ↗
        </a>
        <a href={LINKS.adscaiPaper} target="_blank" rel="noopener noreferrer">
          ADScAI paper download ↗
        </a>
      </div>
    </article>
  );
}
export function ImmersiveFile() {
  return (
    <article className="immersive-file">
      <p className="file-eyebrow">CO-FOUNDER & CTO / VR & IOT</p>
      <h2>Immersive Smile Plus</h2>
      <p className="file-intro">
        I build immersive experiences for healthcare with our founding team. Our
        work brings together virtual reality, connected devices, and software
        engineering.
      </p>
      <div className="file-links">
        <a href={LINKS.immersive} target="_blank" rel="noopener noreferrer">
          Visit Immersive Smile ↗
        </a>
      </div>
    </article>
  );
}
export function RecognitionFile() {
  const milestones = useRef(null);
  useEffect(() => {
    // The reading view uses the shared scroll choreography. PC panes observe their own rows.
    const host = milestones.current;
    if (!host || host.closest(".scroll-portfolio") || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(({target,isIntersecting}) => target.setAttribute("data-milestone",isIntersecting ? "entering" : "idle"));
    }, { threshold:.12 });
    host.querySelectorAll(".milestone-row").forEach(row => observer.observe(row));
    return () => observer.disconnect();
  }, []);
  return (
    <div className="recognition-file" ref={milestones}>
      <p className="file-eyebrow">RESEARCH / EDUCATION / STARTUPS</p>
      <h2>A few milestones</h2>
      <p className="file-intro">
        A record of the work, and the teams and institutions that have
        recognised it.
      </p>
      {RECOGNITION.map((item) => (
        <article key={item.title} className="milestone-row" data-tone={item.tone}>
          <div className="milestone-meta">
            <MilestoneIcon name={item.icon} />
            {item.year && <span className="milestone-year">{item.year}</span>}
          </div>
          <div className="milestone-copy">
            <h3>{item.title}</h3>
            <p>{item.detail}</p>
            <div className="recognition-links">
              {(item.links || [{ url: item.url, label: item.url.includes("linkedin") ? "On LinkedIn" : "Source" }]).map(link => (
                <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer">{link.label}<svg className="milestone-link-arrow" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" /></svg></a>
              ))}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
export function RepositoryLinks({ project }) {
  if (project.links)
    return project.links.map(({ label, url }) => (
      <a key={url} href={url} target="_blank" rel="noopener noreferrer">
        {label} ↗
      </a>
    ));
  if (project.website)
    return (
      <a href={project.website} target="_blank" rel="noopener noreferrer">
        Visit the project ↗
      </a>
    );
  if (project.sourceStatus === "unavailable")
    return (
      <a
        href={`mailto:${CONTACT.email}?subject=${encodeURIComponent(project.title + " project walkthrough")}`}
      >
        Discuss this project ↗
      </a>
    );
  return (
    project.githubs || [{ label: "View source", url: project.github }]
  ).map((repo) => (
    <a key={repo.url} href={repo.url} target="_blank" rel="noopener noreferrer">
      {repo.label} ↗
    </a>
  ));
}
export function WorkFile() {
  const [selected, setSelected] = useState(0);
  const project = PROJECTS[selected];
  return (
    <div className="work-file">
      <div className="work-file-index">
        <p className="file-eyebrow">PROJECT ARCHIVE / {PROJECTS.length}</p>
        <nav aria-label="Select a project">
          {PROJECTS.map((item, index) => (
            <button
              key={item.title}
              onClick={() => setSelected(index)}
              aria-pressed={index === selected}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {item.title.trim()}
              <span>↗</span>
            </button>
          ))}
        </nav>
      </div>
      <article key={project.title} className="work-file-preview" aria-live="polite">
        {project.preview && <ProjectMedia project={project} />}
        {!project.preview && project.image && <ProjectIllustration project={project} />}
        {project.role && <p className="file-eyebrow">PRODUCTION / {project.role}</p>}
        <h2>{project.title.trim()}</h2>
        <p>{project.description}</p>
        <p className="inline-stack">{project.technologies.join(" / ")}</p>
        {project.collaborators && (
          <p className="project-credit">
            Project team: {project.collaborators.join(", ")} and me.
          </p>
        )}
        <div className="file-links">
          <RepositoryLinks project={project} />
          {project.publication && (
            <a
              href={project.publication}
              target="_blank"
              rel="noopener noreferrer"
            >
              IEEE paper ↗
            </a>
          )}
        </div>
        {project.image && (
          <p className="document-note">
            Project illustration · code and details linked above
          </p>
        )}
      </article>
    </div>
  );
}
export function ExperienceFile({ expanded = false, motion = true }) {
  const experience = useRef(null);
  useEffect(() => {
    const host = experience.current;
    if (!host || host.closest(".scroll-portfolio") || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(({target,isIntersecting}) => target.setAttribute("data-experience",isIntersecting ? "entering" : "idle"));
    }, { threshold:.12 });
    host.querySelectorAll(".experience-row").forEach(row => observer.observe(row));
    return () => observer.disconnect();
  }, []);
  return (
    <div className="experience-file" ref={experience}>
      <p className="file-eyebrow">WORK HISTORY / CURRENT & PREVIOUS</p>
      <h2>Experience</h2>
      {CAREER.map((item,index) => <ExperienceRow key={item.company} item={item} index={index} defaultOpen={expanded || index < 2} motion={motion} />)}
      <a href="/Nirusan_Hariharan_CV.pdf" download>Download résumé ↓</a>
    </div>
  );
}

const toolkit = [
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
export function StackFile() {
  const reveal=useFileChoreography("dl > div");
  return (
    <div className="stack-file" ref={reveal}>
      <p className="file-eyebrow">TOOLS / LANGUAGES / PLATFORMS</p>
      <h2>The toolkit</h2>
      <dl>
        {toolkit.map(([title, list]) => (
          <div key={title}>
            <dt>{title}</dt>
            <dd>
              <ul className="toolkit-items">
                {list.map(([name, icon],i) => (
                  <li key={name} style={{'--tool-order':i}}>
                    <img
                      src={`/icons/toolkit/${icon}.svg`}
                      data-icon={icon}
                      alt=""
                      aria-hidden="true"
                      width="30"
                      height="30"
                      loading="lazy"
                    />
                    <span>{name}</span>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
export function ContactFile() {
  const reveal=useFileChoreography();
  const [status, setStatus] = useState("");
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT.email);
      setStatus("Email address copied.");
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setStatus(""), 2200);
    } catch {
      setStatus("Please select the address to copy it.");
    }
  };
  return (
    <div className="contact-file" ref={reveal}>
      <p className="file-eyebrow">CONTACT</p>
      <svg className="contact-signal" width="100" height="100" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true"><circle className="contact-orbit" cx="50" cy="50" r="43" strokeDasharray="2 8"/><path className="contact-signal-path" pathLength="1" d="m20 52 60-29-23 59-10-24-27-6ZM47 58l33-35M47 58l-7 18 17 6"/><circle cx="80" cy="23" r="3" fill="currentColor" stroke="none"/></svg>
      <h2>Get in touch.</h2>
      <p>
        For roles, projects, or a conversation about something you’re building.
      </p>
      <a className="contact-email" href={`mailto:${CONTACT.email}`}>
        {CONTACT.email}
      </a>
      <button className="plain-action" onClick={copy}>
        Copy address
      </button>
      <p className="copy-message" role="status">
        {status}
      </p>
      <div className="contact-file-links">
        <a
          href="https://github.com/Nirusan03"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub ↗
        </a>
        <a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer">
          LinkedIn ↗
        </a>
        <a href="/Nirusan_Hariharan_CV.pdf" download>
          Résumé ↓
        </a>
      </div>
    </div>
  );
}
export function ReadIndex({ onBack, sound, onSound }) {
  return (
    <div className="read-index">
      <header>
        <button onClick={onBack}>← 3D workspace</button>
        <button onClick={onSound} aria-pressed={!sound}>
          {sound ? "Mute sound" : "Unmute sound"}
        </button>
        <nav aria-label="Portfolio index">
          <a href="#index-research">Research</a>
          <a href="#index-experience">Experience</a>
          <a href="#index-contact">Contact</a>
        </nav>
        <a href="/Nirusan_Hariharan_CV.pdf" download>
          Résumé ↓
        </a>
      </header>
      <main id="portfolio-index">
        <h1 className="sr-only">Nirusan Hariharan — portfolio</h1>
        <section>
          <AboutFile />
        </section>
        <section id="index-research">
          <ResearchFile />
        </section>
        <section id="index-recognition">
          <RecognitionFile />
        </section>
        <section id="index-experience">
          <ExperienceFile />
        </section>
        <section id="index-work">
          <WorkFile />
        </section>
        <section id="index-toolkit">
          <StackFile />
        </section>
        <section id="index-contact">
          <ContactFile />
        </section>
      </main>
      <footer>© {new Date().getFullYear()} Nirusan Hariharan</footer>
    </div>
  );
}
