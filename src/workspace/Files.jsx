import { useEffect, useRef, useState } from "react";
import { CONTACT, PROJECTS } from "../constants";
import { CAREER, LINKS, RECOGNITION } from "./content";
import portrait from "../assets/nirusanHariharan2.webp";
export function AboutFile() {
  return (
    <div className="about-file">
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
export function ResearchFile() {
  return (
    <article className="research-file">
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
      <dl className="research-facts">
        <div>
          <dt>Published at</dt>
          <dd>IEEE QCNC 2026 · Kobe, Japan</dd>
        </div>
        <div>
          <dt>Reported accuracy</dt>
          <dd>
            99.75% on evaluated datasets{" "}
            <a
              href={LINKS.westminster}
              target="_blank"
              rel="noopener noreferrer"
            >
              [Westminster]
            </a>
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
      <h3>ADScAI 2025</h3>
      <p>
        QuanNetDetect received the Best Undergraduate Research award at ADScAI,
        hosted by the University of Moratuwa. The university library provides
        the repository entry and conference download below.
      </p>
      <div className="file-links">
        <a href={LINKS.adscaiRepository} target="_blank" rel="noopener noreferrer">
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
        I build immersive experiences for healthcare with our founding team.
        Our work brings together virtual reality, connected devices, and
        software engineering.
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
  return (
    <div className="recognition-file">
      <p className="file-eyebrow">RESEARCH / EDUCATION / STARTUPS</p>
      <h2>A few milestones</h2>
      <p className="file-intro">
        A record of the work, and the teams and institutions that have
        recognised it.
      </p>
      {RECOGNITION.map((item) => (
        <article key={item.title}>
          <span>{item.year || "—"}</span>
          <div>
            <h3>{item.title}</h3>
            <p>{item.detail}</p>
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              {item.url.includes("linkedin") ? "On LinkedIn" : "Source"} ↗
            </a>
          </div>
        </article>
      ))}
    </div>
  );
}
function RepositoryLinks({ project }) {
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
      <article className="work-file-preview" aria-live="polite">
        {project.image && (
          <img
            src={project.image}
            alt={`${project.title} project illustration`}
            width="800"
            height="450"
          />
        )}
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
export function ExperienceFile() {
  return (
    <div className="experience-file">
      <p className="file-eyebrow">WORK HISTORY / CURRENT & PREVIOUS</p>
      <h2>Experience</h2>
      {CAREER.map((item, index) => (
        <details key={item.company} open={index < 2 ? true : undefined}>
          <summary>
            <span className="experience-date">{item.year}</span>
            <span>
              <strong>{item.company}</strong>
              <span>{item.role}</span>
            </span>
            <span className="file-expand" aria-hidden="true">
              +
            </span>
          </summary>
          <div>
            <ul>
              {item.description.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <p className="inline-stack">{item.technologies.join(" / ")}</p>
          </div>
        </details>
      ))}
      <a href="/Nirusan_Hariharan_CV.pdf" download>
        Download résumé ↓
      </a>
    </div>
  );
}
const toolkit = [
  ["Languages", "Python, Java, C#, TypeScript, JavaScript, Kotlin, Swift"],
  ["Backend", "FastAPI, Spring Boot, ASP.NET Core, Node.js, Flask"],
  ["Frontend", "React, Next.js, Angular, Vue, Blazor"],
  ["AI & quantum", "LLM integrations, MCP, TensorFlow, Qiskit, PennyLane"],
  ["Data", "PostgreSQL, MongoDB, MySQL, Firebase, Supabase, SQLite"],
  ["Infrastructure", "AWS, Azure, Linode, Docker, Jenkins, Azure DevOps"],
  ["Immersive & mobile", "Unity, Unreal Engine, VR, IoT, Android, iOS"],
];
export function StackFile() {
  return (
    <div className="stack-file">
      <p className="file-eyebrow">TOOLS / LANGUAGES / PLATFORMS</p>
      <h2>The toolkit</h2>
      <dl>
        {toolkit.map(([title, list]) => (
          <div key={title}>
            <dt>{title}</dt>
            <dd>{list}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
export function ContactFile() {
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
    <div className="contact-file">
      <p className="file-eyebrow">CONTACT</p>
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
export function ReadIndex({ onBack }) {
  return (
    <div className="read-index">
      <header>
        <button onClick={onBack}>← 3D workspace</button>
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
