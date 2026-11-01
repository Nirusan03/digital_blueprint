import { lazy, Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import WorkspaceWindow from "./Window";
import Terminal from "./Terminal";
import Playground from "./Playground";
import useSound from "./useSound";
import { AboutFile, ContactFile, ExperienceFile, ImmersiveFile, RecognitionFile, ResearchFile, StackFile, WorkFile } from "./Files";
import { TITLES } from "./content";
import SceneBoundary from "./SceneBoundary";
import Story from "../story/Story";
import "./dark-story.css";
import "./desktop.css";

const World = lazy(() => import("./World"));
const DOCK = [
  ["research", "Research", "M6 3h8l4 4v14H6ZM14 3v4h4M9 12h6M9 16h6"],
  ["work", "Projects", "M3 7h7l2 2h9v11H3Z"],
  ["experience", "Experience", "M4 8h16v12H4ZM9 8V5h6v3M4 13h16"],
  ["recognition", "Recognition", "M12 3a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM8.5 13 7 21l5-3 5 3-1.5-8"],
  ["about", "About", "M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM4 21c1-4.5 4-6 8-6s7 1.5 8 6"],
  ["stack", "Toolkit", "m14 6 4-3 3 3-3 4-2-2-9 9-3-1-1-3 9-9ZM5 5l5 5M3 7l4-4"],
  ["terminal", "Terminal", "M3 5h18v14H3ZM7 9l3 3-3 3M13 15h4"],
  ["quantum", "Play", "M7 8h10a4 4 0 0 1 4 4v3a2.5 2.5 0 0 1-4.5 1.5L15 15H9l-1.5 1.5A2.5 2.5 0 0 1 3 15v-3a4 4 0 0 1 4-4ZM8 10.5v3M6.5 12h3M16 11h.01M18 13h.01"],
  ["contact", "Contact", "M3 6h18v12H3ZM3 7l9 7 9-7"],
];

function initialMotion() {
  try {
    if (localStorage.getItem("portfolio-motion") === "off") return false;
  } catch {
    /* Optional preference. */
  }
  return !matchMedia("(prefers-reduced-motion: reduce)").matches;
}
const colomboTime = () => new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Colombo", hour: "2-digit", minute: "2-digit" }).format(new Date());

// A circular wipe from the control the visitor pressed, so changing mode feels like one continuous space.
function wipe(event, motion, swap) {
  if (!motion) return swap();
  const rect = event?.currentTarget?.getBoundingClientRect?.();
  const x = rect ? rect.left + rect.width / 2 : innerWidth / 2;
  const y = rect ? rect.top + rect.height / 2 : innerHeight / 2;
  const curtain = document.createElement("div");
  curtain.className = "mode-curtain";
  document.body.append(curtain);
  gsap.fromTo(curtain, { clipPath: `circle(0px at ${x}px ${y}px)` }, {
    clipPath: `circle(${Math.hypot(innerWidth, innerHeight)}px at ${x}px ${y}px)`,
    duration: 0.85, ease: "expo.inOut",
    onComplete: () => {
      swap();
      gsap.to(curtain, { autoAlpha: 0, duration: 0.5, delay: 0.1, onComplete: () => curtain.remove() });
    },
  });
}

function Desktop({ motion, onMotion, sound, setSound, play, onExit }) {
  const [windows, setWindows] = useState([]);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [qubit, setQubit] = useState([1, 0]);
  const [clock, setClock] = useState(colomboTime);
  const shell = useRef(null);
  const dock = useRef(null);
  const world = useRef(null);
  const front = windows.filter((item) => !item.minimized).at(-1)?.id;
  const openApp = useCallback((app) => {
    if (!TITLES[app]) return;
    setWindows((previous) => [...previous.filter((item) => item.id !== app), { id: app, minimized: false }]);
    play("open");
  }, [play]);
  const onReady = useCallback(() => setReady(true), []);
  const onFailure = useCallback(() => { setFailed(true); setReady(true); }, []);
  const closeApp = useCallback((app) => {
    setWindows((previous) => previous.filter((item) => item.id !== app));
    requestAnimationFrame(() => document.querySelector(`[data-launcher="${app}"]`)?.focus({ preventScroll: true }));
  }, []);
  const bringFront = (app) => setWindows((previous) => {
    const target = previous.find((item) => item.id === app);
    if (!target || (previous.at(-1) === target && !target.minimized)) return previous;
    return [...previous.filter((item) => item.id !== app), { ...target, minimized: false }];
  });
  const minimize = (app) => setWindows((previous) => previous.map((item) => item.id === app ? { ...item, minimized: true } : item));
  useEffect(() => {
    const timer = setInterval(() => setClock(colomboTime()), 20000);
    return () => clearInterval(timer);
  }, []);
  useLayoutEffect(() => {
    if (!motion) return;
    const context = gsap.context(() => {
      gsap.from(".dt-bar", { yPercent: -100, duration: 0.9, ease: "expo.out", delay: 0.55 });
      gsap.from(".dt-dock button", { y: 110, duration: 1, ease: "expo.out", stagger: 0.045, delay: 0.7 });
      gsap.from(".dt-identity > *", { y: 28, autoAlpha: 0, duration: 1, ease: "expo.out", stagger: 0.08, delay: 0.9 });
    }, shell);
    return () => context.revert();
  }, [motion]);
  useEffect(() => {
    const key = (event) => {
      if (event.defaultPrevented) return;
      const menu = document.querySelector(".dt-menu[open]");
      if (event.key !== "Escape") return;
      if (menu) menu.open = false;
      else if (front) closeApp(front);
    };
    const dismiss = (event) => {
      if (!event.target.closest(".dt-menu")) document.querySelectorAll(".dt-menu[open]").forEach((menu) => { menu.open = false; });
    };
    document.addEventListener("keydown", key);
    document.addEventListener("pointerdown", dismiss);
    return () => {
      document.removeEventListener("keydown", key);
      document.removeEventListener("pointerdown", dismiss);
    };
  }, [front, closeApp]);
  // Dock icons swell towards the pointer.
  const swell = (event) => {
    if (!motion) return;
    dock.current.querySelectorAll("button").forEach((button) => {
      const rect = button.getBoundingClientRect();
      const distance = Math.abs(event.clientX - (rect.left + rect.width / 2));
      const scale = 1 + Math.max(0, 1 - distance / 170) ** 2 * 0.5;
      gsap.to(button, { scale, duration: 0.3, ease: "power3.out", overwrite: "auto" });
    });
  };
  const settle = () => { if (motion) gsap.to(dock.current.querySelectorAll("button"), { scale: 1, duration: 0.5, ease: "expo.out", overwrite: "auto" }); };
  const renderApp = (app) => {
    switch (app) {
      case "about": return <AboutFile />;
      case "research": return <ResearchFile motion={motion} />;
      case "immersive": return <ImmersiveFile />;
      case "experience": return <ExperienceFile motion={motion} />;
      case "recognition": return <RecognitionFile />;
      case "work": return <WorkFile />;
      case "stack": return <StackFile />;
      case "terminal": return <Terminal onOpen={openApp} onExit={() => closeApp("terminal")} />;
      case "quantum": return <Playground onState={setQubit} onSound={play} active={front === "quantum"} motion={motion} />;
      case "contact": return <ContactFile />;
      default: return null;
    }
  };
  const label = front ? DOCK.find(([id]) => id === front)?.[1] || "Immersive Smile" : "Desktop";
  return (
    <div className="dt" ref={shell}>
      <a className="skip-link" href="#dt-dock">Skip to apps</a>
      <header className="dt-bar">
        <button className="dt-mark" onClick={() => setWindows((previous) => previous.map((item) => ({ ...item, minimized: true })))} aria-label="Show the desktop">NH</button>
        <strong className="dt-active">{label}</strong>
        <details className="dt-menu" name="dt-menus">
          <summary>Files</summary>
          <nav aria-label="All files">
            {DOCK.map(([id, name]) => <button key={id} onClick={(event) => { openApp(id); event.currentTarget.closest("details").open = false; }}>{name}<span>{TITLES[id]}</span></button>)}
          </nav>
        </details>
        <details className="dt-menu" name="dt-menus">
          <summary>View</summary>
          <nav aria-label="View options">
            <button onClick={(event) => { world.current?.resetView(); event.currentTarget.closest("details").open = false; }}>Reset 3D view</button>
            <button onClick={(event) => { onMotion(); event.currentTarget.closest("details").open = false; }}>Animation<span>{motion ? "On" : "Off"}</span></button>
            <button onClick={(event) => { setSound(!sound); event.currentTarget.closest("details").open = false; }}>Sound<span>{sound ? "On" : "Off"}</span></button>
          </nav>
        </details>
        <span className="dt-spacer" />
        <a className="dt-plain" href="/Nirusan_Hariharan_CV.pdf" download>Résumé</a>
        <time className="dt-plain">{clock} Colombo</time>
        <button className="dt-exit" onClick={onExit}>Exit desktop</button>
      </header>
      <main className="dt-main">
        <div className={`dt-world ${ready ? "is-ready" : ""}`}>
          <SceneBoundary onFailure={onFailure}>
            <Suspense fallback={null}>
              <World motion={motion} suspended={Boolean(front)} onOpen={openApp} onReady={onReady} onFailure={onFailure} qubit={qubit} apiRef={world} />
            </Suspense>
          </SceneBoundary>
          {failed && <p className="dt-failed">This browser couldn’t open the 3D view. Every file is still in the dock.</p>}
        </div>
        <div className="dt-identity">
          <h1>Nirusan Hariharan</h1>
          <p>Software engineer, quantum researcher, Co-founder &amp; CTO. Open anything from the dock, or click a station on the bench.</p>
        </div>
        {/* DOM order stays stable; only the stacking index changes, so focus never restarts a window. */}
        {[...windows].sort((a, b) => a.id.localeCompare(b.id)).map((item) => (
          <WorkspaceWindow
            key={item.id}
            app={item.id}
            index={windows.indexOf(item)}
            front={front === item.id}
            minimized={item.minimized}
            motion={motion}
            onFront={() => bringFront(item.id)}
            onClose={() => closeApp(item.id)}
            onMinimize={() => minimize(item.id)}
          >
            {renderApp(item.id)}
          </WorkspaceWindow>
        ))}
        <nav id="dt-dock" className="dt-dock" ref={dock} aria-label="Apps" onPointerMove={swell} onPointerLeave={settle}>
          {DOCK.map(([id, name, path]) => (
            <button
              key={id}
              data-launcher={id}
              onClick={() => (windows.find((item) => item.id === id)?.minimized ? bringFront(id) : openApp(id))}
              aria-label={`Open ${name}`}
              data-open={windows.some((item) => item.id === id)}
            >
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={path} /></svg>
              <span>{name}</span>
            </button>
          ))}
        </nav>
      </main>
    </div>
  );
}

export default function Workspace() {
  const [desktop, setDesktop] = useState(() => location.hash === "#workspace");
  const [compact, setCompact] = useState(() => matchMedia("(max-width: 1100px), (hover: none)").matches);
  const [motion, setMotion] = useState(initialMotion);
  const { sound, setEnabled, play } = useSound();
  const toggleMotion = () => setMotion((previous) => {
    try {
      localStorage.setItem("portfolio-motion", previous ? "off" : "on");
    } catch {
      /* Optional preference. */
    }
    return !previous;
  });
  useEffect(() => {
    const query = matchMedia("(max-width: 1100px), (hover: none)");
    const change = () => setCompact(query.matches);
    query.addEventListener("change", change);
    const navigation = () => setDesktop(location.hash === "#workspace");
    window.addEventListener("popstate", navigation);
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const reduce = () => { if (media.matches) setMotion(false); };
    media.addEventListener("change", reduce);
    return () => {
      query.removeEventListener("change", change);
      window.removeEventListener("popstate", navigation);
      media.removeEventListener("change", reduce);
    };
  }, []);
  useEffect(() => {
    document.documentElement.dataset.motion = motion ? "on" : "off";
  }, [motion]);
  // Desktop mode needs a pointer and a large screen. Only an explicit click or link opens it.
  const showDesktop = desktop && !compact;
  useEffect(() => {
    document.body.classList.toggle("workspace-mode", showDesktop);
    return () => document.body.classList.remove("workspace-mode");
  }, [showDesktop]);
  const enter = (event) => wipe(event, motion, () => {
    history.pushState(null, "", "#workspace");
    setDesktop(true);
    window.scrollTo(0, 0);
  });
  const leave = (event) => wipe(event, motion, () => {
    history.pushState(null, "", "#read");
    setDesktop(false);
    window.scrollTo(0, 0);
  });
  if (showDesktop)
    return <Desktop motion={motion} onMotion={toggleMotion} sound={sound} setSound={setEnabled} play={play} onExit={leave} />;
  return <Story onDesktop={enter} motion={motion} onMotion={toggleMotion} sound={sound} onSound={() => setEnabled(!sound)} playCue={play} />;
}
