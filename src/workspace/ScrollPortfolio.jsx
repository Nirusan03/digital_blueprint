import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { PROJECTS } from "../constants";
import { LINKS } from "./content";
import { AboutFile, ContactFile, ExperienceFile, RecognitionFile, RepositoryLinks, ResearchFile, StackFile } from "./Files";
import SceneBoundary from "./SceneBoundary";
import portrait from "../assets/portraits/nirusan-profile-v2.webp";
import "./scroll-portfolio.css";
import "./dark-story.css";
import "./scroll-motion.css";
import ProjectMedia, { ProjectIllustration } from "./ProjectMedia";
import ProjectArchiveArt from "./ProjectArchiveArt";
import Icon from "./Icons";
import useScrollStory from "./useScrollStory";
import ChapterNavigator from "./ChapterNavigator";
import PlayArtwork from "./PlayArtwork";
import ChapterObject from "./ChapterObject";
import "./system-polish.css";

const World = lazy(() => import("./World"));
const sections = { research: "research", work: "work", about: "about", experience: "experience", immersive: "work", contact: "contact" };
const orderedProjects = [
  PROJECTS.find(project => project.title === "QuanNetDetect"),
  ...PROJECTS.filter(project => project.title !== "QuanNetDetect"),
];

function ProjectRow({ project, index }) {
  return (
    <article className={`project-story ${project.preview || project.image ? "has-image" : ""}`}>
      <div className="project-story-heading">
        <span className="project-number">{String(index + 1).padStart(2, "0")}</span>
        <div>
          {project.role && <p className="story-role">{project.role}</p>}
          <h3>{project.title.trim()}</h3>
        </div>
      </div>
      {project.preview && <ProjectMedia project={project} />}
      {!project.preview && project.image && <ProjectIllustration project={project} />}
      <div className="project-story-copy">
        <p>{project.description}</p>
        <p className="story-stack">{project.technologies.map((technology,i)=><span className="project-tech" key={technology} style={{'--tech-order':i}}>{technology}{i<project.technologies.length-1&&<span aria-hidden="true"> · </span>}</span>)}</p>
        <div className="file-links"><RepositoryLinks project={project} />
          {project.publication && <a href={project.publication} target="_blank" rel="noopener noreferrer">IEEE paper ↗</a>}
        </div>
        {project.collaborators && <p className="story-credit">With {project.collaborators.join(", ")}.</p>}
      </div>
    </article>
  );
}

export default function ScrollPortfolio({ onWorkspace, motion, onMotion, sound, onSound, boot, palette, onPalette }) {
  const root = useRef(null);
  const [sceneFailed, setSceneFailed] = useState(false);
  const sceneReady = useCallback(() => {}, []);
  const sceneFailure = useCallback(() => setSceneFailed(true), []);
  const openStation = useCallback(app => {
    if (sections[app]) {
      document.getElementById(`index-${sections[app]}`)?.scrollIntoView({ behavior: motion ? "smooth" : "instant" });
    } else onWorkspace(app);
  }, [motion, onWorkspace]);
  useScrollStory(root, motion && !boot);
  useEffect(() => {
    if (!location.hash.startsWith("#index-")) return;
    document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: "instant" });
  }, []);
  return (
    <div className="scroll-portfolio" id="portfolio-home" ref={root} data-started={!boot}>
      <a className="skip-link" href="#index-work">Skip to projects</a>
      <header className="portfolio-nav">
        <a className="portfolio-name" href="#portfolio-home">Nirusan H<span>.</span></a>
        <nav aria-label="Portfolio sections">
          <a href="#index-work">Work</a>
          <a href="#index-research">Research</a>
          <a href="#index-about">About</a>
          <a href="#index-contact">Contact</a>
        </nav>
        <button className="theme-cycle" onClick={onPalette} aria-label={`Change dark palette. Current: ${palette}`} title={`Palette: ${palette}`}><Icon name="palette" /></button>
        <button className="pc-mode-button" onClick={() => onWorkspace()}>PC workspace <span aria-hidden="true">↗</span></button>
      </header>
      {!boot && <ChapterNavigator root={root}/>}
      <main>
        <section className="portfolio-hero" aria-labelledby="portfolio-title">
          <div className="hero-copy">
            <div className="hero-introduction">
              <img src={portrait} width="90" height="110" alt="Nirusan Hariharan" fetchPriority="high" />
              <p>COLOMBO, SRI LANKA<br /><span>SOFTWARE · QUANTUM · VR</span></p>
            </div>
            <h1 id="portfolio-title"><span className="hero-title-line"><span>Nirusan</span></span><span className="hero-title-line"><span>Hariharan<i>.</i></span></span></h1>
            <p className="hero-profession">Software engineer.<br />Quantum researcher. Co-founder & CTO.</p>
            <p className="hero-description">I build backends, AI systems, and applications. My research explores quantum computing for cybersecurity. At Immersive Smile Plus, I build with VR and IoT for healthcare.</p>
            <div className="hero-actions"><a href="#index-work">Explore my work <span>↓</span></a><a href="/Nirusan_Hariharan_CV.pdf" download>Download résumé ↗</a></div>
          </div>
          <div className="hero-lab">
            <div className="hero-lab-label"><span>THE QUANTUM WORKSPACE</span><span>LIVE / 3D</span></div>
            <div className="hero-world">
              <SceneBoundary onFailure={sceneFailure}>
                <Suspense fallback={<div className="lab-loading">Preparing the quantum workspace…</div>}>
                  <World motion={motion} suspended={boot} onOpen={openStation} onReady={sceneReady} onFailure={sceneFailure} qubit={[1, 0]} />
                </Suspense>
              </SceneBoundary>
              {sceneFailed && <p className="lab-loading">The 3D view is unavailable here. All my work is ready to explore below.</p>}
            </div>
            <div className="hero-lab-footer"><span>Software, research, and immersive technology.</span><button onClick={() => onWorkspace()}>Explore in PC mode ↗</button></div>
          </div>
          <a className="scroll-invitation" href="#index-work"><span>KEEP EXPLORING</span><span>Scroll to see the work ↓</span></a>
        </section>
        <div className="portfolio-chapter-band"><span>Software engineer at Niroga AI & BlueLotus360</span><span>Co-founder & CTO, Immersive Smile Plus</span><span>Visiting Lecturer, IIT</span></div>
        <section className="proof-strip" aria-label="Academic and research highlights">
          <div><Icon name="award" size={24} /><strong>First Class</strong><span>BSc Computer Science · Westminster / IIT</span></div>
          <div><span className="proof-value">92<span>%</span></span><strong>Research score</strong><span>Best Final Year Research Project · IIT</span></div>
          <div><Icon name="paper" size={24} /><strong>IEEE QCNC 2026</strong><span>Published quantum cybersecurity research</span></div>
        </section>
        <section className="scroll-section research-chapter" id="index-research" aria-label="Research"><p className="chapter-label">01 / RESEARCH</p><ResearchFile motion={motion} /></section>
        <section className="scroll-section experience-chapter" id="index-experience" aria-label="Experience"><p className="chapter-label">02 / EXPERIENCE</p><ExperienceFile expanded motion={motion} visual={<ChapterObject kind="experience" motion={motion} />} /></section>
        <section className="scroll-section about-chapter" id="index-about" aria-label="About Nirusan"><p className="chapter-label">03 / ABOUT</p><AboutFile /></section>
        <section className="scroll-section recognition-chapter" id="index-recognition" aria-label="Recognition"><p className="chapter-label">04 / RECOGNITION</p><RecognitionFile visual={<ChapterObject kind="milestones" motion={motion} />} /></section>
        <section className="scroll-section toolkit-chapter" id="index-toolkit" aria-label="Toolkit"><p className="chapter-label">05 / TOOLKIT</p><StackFile visual={<ChapterObject kind="toolkit" motion={motion} />} /></section>
        <section className="scroll-section archive-chapter" id="index-work" aria-labelledby="work-heading">
          <div className="chapter-heading independent-heading archive-dimensional-heading" id="index-archive"><div className="archive-heading-copy"><p className="chapter-label">06 / RESEARCH · PRODUCTS · INDEPENDENT PROJECTS</p><h2 id="work-heading">Ideas put to work.</h2><p>Quantum research, VR healthcare, and the applications I build and maintain with teams in Sri Lanka and the US.</p></div><ProjectArchiveArt motion={motion}/></div>
          <div className="independent-stories">{orderedProjects.map((project,index)=><ProjectRow key={project.title} project={project} index={index} />)}</div>
        </section>
        <section className="scroll-section play-chapter" id="index-play" aria-labelledby="play-heading"><p className="chapter-label">07 / TAKE A DETOUR</p><PlayArtwork/><h2 id="play-heading">A little curiosity.<br />A little play.</h2><p>Try a quantum gate puzzle, steer a packet through a network, or explore the browser’s Linux-style terminal.</p><div className="play-invitations"><button onClick={() => onWorkspace("quantum")}>Quantum Relay & Packet Run ↗</button><button onClick={() => onWorkspace("terminal")}>Open the terminal ↗</button></div></section>
        <section className="scroll-section contact-chapter" id="index-contact" aria-label="Contact"><p className="chapter-label">08 / SAY HELLO</p><ContactFile /></section>
      </main>
      <footer className="portfolio-footer"><span>© {new Date().getFullYear()} Nirusan Hariharan</span><a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a><button onClick={onSound}>{sound ? "Sound on" : "Sound off"}</button><button onClick={onMotion}>{motion ? "Motion on" : "Motion off"}</button><button onClick={onPalette}>Palette: {palette}</button><a href="#portfolio-home">Back to top ↑</a><div className="footer-feature"><a href={LINKS.iitFacebook} target="_blank" rel="noopener noreferrer">Watch IIT’s graduation feature on Facebook ↗</a></div></footer>
    </div>
  );
}
