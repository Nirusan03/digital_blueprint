import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { CONTACT, PROJECTS } from "../constants";
import { CAREER, LINKS, RECOGNITION, toolkit } from "../workspace/content";
import RepositoryLinks from "../workspace/RepositoryLinks";
import QuantumLab from "../workspace/QuantumLab";
import SceneBoundary from "../workspace/SceneBoundary";
import useChoreography from "./useChoreography";
import quality from "./quality";
import "./story.css";

const FilmScene = lazy(() => import("./FilmScene"));
const GameSheet = lazy(() => import("./GameSheet"));

const FLAGSHIPS = ["Immersive Smile Plus", "Niroga AI", "BlueLotus360", "SENOVA", "QuanNetDetect"];
const flagships = FLAGSHIPS.map((title) => PROJECTS.find((project) => project.title === title));
const archive = PROJECTS.filter((project) => !FLAGSHIPS.includes(project.title));
const NAV = [["Projects", "index-work"], ["Research", "index-research"], ["Experience", "index-experience"], ["About", "index-about"], ["Contact", "index-contact"]];
const out = { target: "_blank", rel: "noopener noreferrer" };
const STILLS = ["research", "engineering", "immersive", "core"];

// Haxmas has its own project artwork; the other previews are public captures named in content.js.
const preview = (item) => item.preview || (item.title.includes("Haxmas") ? PROJECTS.find((project) => project.title.startsWith("ElderGuardian")).image : null);

function Panel({ project }) {
  const { preview } = project;
  return (
    <article className={`panel panel-${preview.kind}`}>
      <a className="panel-stage" href={preview.url} {...out} data-cursor="Open" aria-label={`Open ${project.title}`}>
        <div className="panel-picture">
          {preview.kind === "app"
            ? preview.screens.map((screen) => <img key={screen.src} src={screen.src} alt={screen.alt} width="600" height="1300" loading="lazy" decoding="async" />)
            : <img src={preview.src} alt={preview.alt} width={preview.kind === "paper" ? 1082 : 1280} height={preview.kind === "paper" ? 1400 : 720} loading="lazy" decoding="async" />}
        </div>
      </a>
      <div className="panel-copy">
        <p className="panel-index">{preview.kind === "paper" ? "Research" : `Product, ${project.role || "Co-founder & CTO"}`}</p>
        <h3>{project.title}</h3>
        <p className="panel-text">{project.description}</p>
        <p className="panel-stack">{project.technologies.join(", ")}</p>
        <div className="links"><RepositoryLinks project={project} /></div>
        {project.collaborators && <p className="panel-credit">With {project.collaborators.join(", ")}.</p>}
      </div>
    </article>
  );
}

function ArchiveRow({ project }) {
  const [open, setOpen] = useState(false);
  const title = project.title.trim();
  return (
    <li className="ledger-row" data-open={open} data-peek={project.image || undefined}>
      <button aria-expanded={open} onClick={() => setOpen(!open)} data-rise>
        <span className="ledger-title">{title}</span>
        <span className="ledger-stack">{project.technologies.slice(0, 4).join(", ")}</span>
        <i aria-hidden="true" />
      </button>
      <div className="ledger-more" inert={!open}>
        <div>
          {project.image && <img className="row-thumb" src={project.image} alt="" width="800" height="450" loading="lazy" decoding="async" />}
          <p>{project.description}</p>
          {project.collaborators && <p className="panel-credit">With {project.collaborators.join(", ")}.</p>}
          <div className="links"><RepositoryLinks project={project} /></div>
        </div>
      </div>
    </li>
  );
}

function Clock() {
  const format = () => new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Colombo", hour: "2-digit", minute: "2-digit" }).format(new Date());
  const [time, setTime] = useState(format);
  useEffect(() => {
    const timer = setInterval(() => setTime(format()), 20000);
    return () => clearInterval(timer);
  }, []);
  return <time>{time} in Colombo</time>;
}

export default function Story({ onDesktop, motion, onMotion, sound, onSound, playCue }) {
  const root = useRef(null);
  const progress = useRef(0);
  const level = useState(quality)[0];
  // canvas: live 3D. poster: a still while the 3D loads. stills: pre-rendered frames only.
  const [scene, setScene] = useState(() => (!motion || level === "still" ? "stills" : level === "high" ? "canvas" : "poster"));
  const [sheet, setSheet] = useState(null);
  const [menu, setMenu] = useState(false);
  const [copied, setCopied] = useState("");
  const sceneFailure = useCallback(() => setScene("stills"), []);
  const sceneReady = useCallback(() => setScene((current) => (current === "poster" ? "canvas" : current)), []);
  const live = motion && level !== "still" && scene !== "stills";
  const lenis = useChoreography(root, motion, progress, level);
  useEffect(() => {
    if (sheet || menu) lenis.current?.stop();
    else lenis.current?.start();
  }, [sheet, menu, lenis]);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT.email);
      setCopied("Copied");
    } catch {
      setCopied("Select the address to copy it");
    }
    setTimeout(() => setCopied(""), 2200);
  };
  return (
    <div className="story" id="portfolio-home" ref={root}>
      <a className="skip-link" href="#index-research">Skip to content</a>
      <div className="progress" aria-hidden="true" />
      <div className="cursor" aria-hidden="true"><span /></div>
      <div className="peek" aria-hidden="true"><img alt="" /></div>

      <header className="nav-bar" data-tone="ink">
        <a className="nav-name" href="#portfolio-home">Nirusan Hariharan</a>
        <nav aria-label="Sections">
          {NAV.map(([label, id]) => <a key={id} href={`#${id}`}>{label}</a>)}
        </nav>
        <div className="nav-end">
          <a href="/Nirusan_Hariharan_CV.pdf" rel="nofollow" download>Résumé</a>
          <button className="nav-desktop" onClick={onDesktop} data-desktop-trigger>Desktop mode</button>
          <button className="nav-menu" onClick={() => setMenu(true)} aria-expanded={menu}>Menu</button>
        </div>
      </header>
      {menu && (
        <div className="menu-sheet" role="dialog" aria-modal="true" aria-label="Menu">
          <button className="menu-close" onClick={() => setMenu(false)} autoFocus>Close</button>
          <nav aria-label="Sections">
            {NAV.map(([label, id]) => <a key={id} href={`#${id}`} onClick={() => setMenu(false)}>{label}</a>)}
            <a href="/Nirusan_Hariharan_CV.pdf" rel="nofollow" download>Résumé</a>
          </nav>
        </div>
      )}

      <main>
        <section className="film" data-tone="ink" aria-labelledby="film-title">
          <div className="film-stage" data-scene={motion ? scene : "stills"}>
            <div className="film-view">
              <h1 className="film-name" id="film-title" aria-label="Nirusan Hariharan"><span>Nirusan</span> <span>Hariharan</span></h1>
              <div className="film-stills" aria-hidden="true">
                <div className="film-still film-still-hero"><img src="/film/hero.webp" alt="" width="1400" height="1100" decoding="async" /></div>
                {STILLS.map((name) => (
                  <picture className="film-still" key={name}>
                    <source media="(max-aspect-ratio: 1/1)" srcSet={`/film/${name}-p.webp`} />
                    <img src={`/film/${name}-l.webp`} alt="" width="1600" height="1000" decoding="async" loading="lazy" />
                  </picture>
                ))}
              </div>
              {live && (
                <SceneBoundary onFailure={sceneFailure}>
                  <Suspense fallback={null}>
                    <FilmScene level={level} progress={progress} onReady={sceneReady} onFallback={sceneFailure} />
                  </Suspense>
                </SceneBoundary>
              )}
              <div className="film-lede">
                <p>Software engineer, quantum researcher, and co-founder of a VR healthcare company.</p>
                <p className="film-place">Colombo, Sri Lanka</p>
              </div>
            </div>
            <div className="film-scrim" data-side="left" aria-hidden="true" />
            <div className="film-scrim" data-side="right" aria-hidden="true" />
            <div className="film-beats">
              <div className="film-beat" data-side="left">
                <p className="kicker">Research</p>
                <h2>Finding malicious traffic without decrypting it.</h2>
                <p>QuanNetDetect is my hybrid quantum deep learning framework, published at IEEE QCNC 2026.</p>
              </div>
              <div className="film-beat" data-side="right">
                <p className="kicker">Engineering</p>
                <h2>Software that ships across platforms.</h2>
                <p>Backends, AI integrations, and apps for Android, iOS, and Windows at Niroga AI and BlueLotus360.</p>
              </div>
              <div className="film-beat" data-side="left">
                <p className="kicker">Immersive Smile Plus</p>
                <h2>Virtual reality for healthcare.</h2>
                <p>I lead technology as Co-founder and CTO, building with VR and connected devices.</p>
              </div>
            </div>
            <div className="film-flash" aria-hidden="true" />
          </div>
        </section>

        <section className="ch research" id="index-research" data-tone="bone" aria-labelledby="research-title">
          <p className="kicker" data-rise>Published research, April 2026</p>
          <h2 className="mega" id="research-title" data-kinetic>QuanNetDetect</h2>
          <div className="research-grid">
            <a className="paper" href={LINKS.paper} {...out} data-cursor="Read" aria-label="Read the QuanNetDetect IEEE QCNC 2026 publication">
              <img className="paper-sheet" src="/research/ieee-qcnc-first-page.webp" alt="First page of the QuanNetDetect paper, by Nirusan Hariharan and Guhanathan Poravi, IEEE QCNC 2026." width="1082" height="1400" loading="lazy" decoding="async" />
            </a>
            <div className="research-copy">
              <p className="statement" data-lines>A Quantum Hybrid Deep Learning Framework for Encrypted TLS Malicious Traffic Detection</p>
              <p className="byline" data-rise>Nirusan Hariharan and Guhanathan Poravi. IEEE QCNC 2026, Kobe, Japan.</p>
              <p className="prose" data-rise>Detecting malicious network traffic without decrypting it. My research combines classical deep learning with quantum models to analyse encrypted TLS traffic while preserving privacy.</p>
              <div className="figures">
                <figure>
                  <strong><span data-count="99.95">99.95</span>%</strong>
                  <figcaption>Binary traffic detection, CIC-Darknet-2020</figcaption>
                  <div className="meter"><i data-meter style={{ width: "99.95%" }} /></div>
                </figure>
                <figure>
                  <strong><span data-count="82.83">82.83</span>%</strong>
                  <figcaption>Multiclass DDoS classification, CIC-DDoS-2019</figcaption>
                  <div className="meter"><i data-meter style={{ width: "82.83%" }} /></div>
                </figure>
              </div>
              <p className="fineprint" data-rise>QNN validation accuracy, from Table II of the IEEE paper. These are separate tasks and datasets, not a like-for-like comparison.</p>
              <p className="prose" data-rise>The work earned a 92% research score, Best Final Year Research Project at IIT, and Best Undergraduate Research at ADScAI, hosted by the University of Moratuwa. Westminster’s 2026 alumni awards profile discusses the framework; I was a finalist in the Recent Graduate category.</p>
              <div className="links" data-rise>
                <a href={LINKS.paper} {...out}>Read the IEEE paper</a>
                <a href={LINKS.thesis} {...out}>IIT thesis record</a>
                <a href={LINKS.conference} {...out}>Accepted papers</a>
                <a href={LINKS.adscaiRepository} {...out}>ADScAI repository</a>
                <a href={LINKS.adscaiPaper} {...out}>ADScAI paper</a>
                <a href={LINKS.westminster} {...out}>Westminster profile</a>
              </div>
              <p className="fineprint" data-rise>DOI 10.1109/QCNC69040.2026.00129</p>
            </div>
          </div>
        </section>

        <section className="ch lab" data-tone="ink" aria-label="Quantum explorer">
          <QuantumLab motion={motion} />
        </section>

        <section className="rail" id="index-work" data-tone="ink" aria-labelledby="work-title">
          <div className="rail-sticky">
            <div className="rail-track">
              <header className="rail-intro">
                <h2 id="work-title" className="mega mega-sm" data-kinetic>Projects</h2>
                <p className="rail-hint">Research and products first, then everything else. Built and maintained with teams in Sri Lanka and the US.</p>
              </header>
              {flagships.map((project) => <Panel key={project.title} project={project} />)}
            </div>
          </div>
        </section>

        <section className="ch ledger" data-tone="ink" aria-labelledby="ledger-title" id="index-archive">
          <h2 className="ledger-heading" id="ledger-title" data-rise>More projects</h2>
          <ol>{archive.map((project) => <ArchiveRow key={project.title} project={project} />)}</ol>
        </section>

        <section className="ch experience" id="index-experience" data-tone="bone" aria-labelledby="experience-title">
          <h2 className="mega mega-sm" id="experience-title" data-kinetic>Experience</h2>
          <ol className="roles">
            {CAREER.map((item) => (
              <li className="role" key={item.company}>
                <p className="role-date">{item.year}</p>
                <div className="role-who"><h3>{item.company}</h3><p>{item.role}</p></div>
                <div className="role-what">
                  {item.metrics && (
                    <ul className="role-stats">
                      {item.metrics.map(([value, label]) => <li key={label}><strong>{value}</strong><span>{label}</span></li>)}
                    </ul>
                  )}
                  {item.description.map((line) => <p key={line}>{line}</p>)}
                  <p className="role-stack">{item.technologies.join(", ")}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="links"><a href="/Nirusan_Hariharan_CV.pdf" rel="nofollow" download>Download résumé</a></div>
        </section>

        <section className="ch about" id="index-about" data-tone="ink" aria-labelledby="about-title">
          <figure className="about-portrait" data-clip>
            <img src="/portrait/nirusan-1408.webp" srcSet="/portrait/nirusan-800.webp 800w, /portrait/nirusan-1408.webp 1408w" sizes="(max-width: 900px) 100vw, 42vw" alt="Nirusan Hariharan" width="1408" height="1760" loading="lazy" decoding="async" data-parallax="3" />
          </figure>
          <div className="about-copy">
            <h2 id="about-title" className="kicker">About</h2>
            <p className="about-lead" data-fill>I work on AI systems, backends, and full-stack products with teams in Sri Lanka and the US. As Co-founder and CTO of Immersive Smile Plus, I build with VR and IoT for healthcare.</p>
            <p className="prose" data-rise>I graduated with First Class Honours in Computer Science from the University of Westminster through IIT. My research, QuanNetDetect, is published in the IEEE QCNC 2026 proceedings.</p>
            <p className="prose" data-rise>Since May 2026, I’ve also been a visiting lecturer at IIT, mentoring final-year students in quantum computing. Outside work, I take on freelance projects and make time for sports.</p>
            <div className="links" data-rise><a href={LINKS.linkedin} {...out}>LinkedIn</a><a href={LINKS.iitFacebook} {...out}>IIT’s graduation feature</a></div>
          </div>
        </section>

        <section className="ch honours" id="index-recognition" data-tone="ink" aria-labelledby="honours-title">
          <h2 className="section-title" id="honours-title" data-lines>Recognition</h2>
          <ol>
            {RECOGNITION.map((item) => (
              <li key={item.title} data-rise data-peek={preview(item) || undefined}>
                <span className="honour-year">{item.year}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.detail}</p>
                  {preview(item) && <img className="row-thumb" src={preview(item)} alt="" width="640" height="360" loading="lazy" decoding="async" />}
                </div>
                <div className="links">
                  {(item.links || [{ url: item.url, label: item.url.includes("linkedin") ? "LinkedIn" : "Source" }]).map((link) => <a key={link.url} href={link.url} {...out}>{link.label}</a>)}
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="ch toolkit" id="index-toolkit" data-tone="bone" aria-labelledby="toolkit-title">
          <h2 className="section-title" id="toolkit-title" data-lines>Toolkit</h2>
          <dl>
            {toolkit.map(([group, tools]) => (
              <div key={group} className="mark">
                <dt>{group}</dt>
                <dd><ul>{tools.map(([name, icon]) => <li key={name}><img src={`/icons/toolkit/${icon}.svg`} alt="" width="40" height="40" loading="lazy" decoding="async" />{name}</li>)}</ul></dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="ch play" id="index-play" data-tone="signal" aria-labelledby="play-title">
          <h2 className="mega mega-sm" id="play-title" data-kinetic>Play</h2>
          <p className="play-lead" data-lines>A quantum gate puzzle, a network arcade, and a Linux-style terminal. All of them run right here in the browser.</p>
          <div className="play-doors">
            <button onClick={() => setSheet("quantum")} data-cursor="Play" data-rise><span>Quantum Relay</span><small>Five-stage gate puzzle</small></button>
            <button onClick={() => setSheet("packet")} data-cursor="Play" data-rise><span>Packet Run</span><small>Three-lane network arcade</small></button>
            <button onClick={() => setSheet("terminal")} data-cursor="Open" data-rise><span>Terminal</span><small>Type help to begin</small></button>
          </div>
        </section>

        <section className="ch contact" id="index-contact" data-tone="ink" aria-labelledby="contact-title">
          <p className="kicker" id="contact-title">For roles, projects, or a conversation about something you’re building.</p>
          <a className="contact-mail" href={`mailto:${CONTACT.email}`} data-cursor="Write" data-lines>{CONTACT.email}</a>
          <div className="contact-row">
            <button className="contact-copy" onClick={copy}>Copy address</button>
            <span role="status" className="contact-status">{copied}</span>
          </div>
          <div className="links links-lg">
            <a href="https://github.com/Nirusan03" {...out}>GitHub</a>
            <a href={LINKS.linkedin} {...out}>LinkedIn</a>
            <a href="/Nirusan_Hariharan_CV.pdf" rel="nofollow" download>Résumé</a>
          </div>
        </section>
      </main>

      <footer className="foot" data-tone="ink">
        <span>© {new Date().getFullYear()} Nirusan Hariharan</span>
        <Clock />
        <span className="foot-controls">
          <button onClick={onSound} aria-pressed={sound}>Sound {sound ? "on" : "off"}</button>
          <button onClick={onMotion} aria-pressed={motion}>Motion {motion ? "on" : "off"}</button>
          <button className="nav-desktop" onClick={onDesktop}>Desktop mode</button>
          <a href="#portfolio-home">Back to top</a>
        </span>
      </footer>
      {sheet && (
        <Suspense fallback={null}>
          <GameSheet kind={sheet} motion={motion} playCue={playCue} onClose={() => setSheet(null)} />
        </Suspense>
      )}
    </div>
  );
}
