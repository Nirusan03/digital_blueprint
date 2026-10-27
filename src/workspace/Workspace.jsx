import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import Boot from "./Boot";
import WorkspaceWindow from "./Window";
import Terminal from "./Terminal";
import QuantumRelay from "./QuantumRelay";
import useSound from "./useSound";
import {
  AboutFile,
  ContactFile,
  ExperienceFile,
  ImmersiveFile,
  ReadIndex,
  RecognitionFile,
  ResearchFile,
  StackFile,
  WorkFile,
} from "./Files";
import { LINKS, TITLES } from "./content";
import portrait from "../assets/nirusanHariharan2.webp";
import SceneBoundary from "./SceneBoundary";
const World = lazy(() => import("./World"));
const files = [
  ["research", "Research"],
  ["experience", "Experience"],
  ["recognition", "Recognition"],
  ["about", "About"],
  ["work", "Projects"],
  ["stack", "Toolkit"],
  ["terminal", "Terminal"],
  ["quantum", "Play"],
  ["contact", "Contact"],
];
function initialMotion() {
  try {
    if (localStorage.getItem("portfolio-motion") === "off") return false;
  } catch {
    /* Optional preference. */
  }
  return !matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function initialBoot() {
  try {
    return sessionStorage.getItem("nh-workspace-entered") !== "yes";
  } catch {
    return true;
  }
}
export default function Workspace() {
  const [boot, setBoot] = useState(initialBoot),
    [reading, setReading] = useState(
      () => location.hash === "#read" || location.hash.startsWith("#index-"),
    );
  const [ready, setReady] = useState(false),
    [failed, setFailed] = useState(false),
    [motion, setMotion] = useState(initialMotion),
    [windows, setWindows] = useState([]),
    [qubit, setQubit] = useState([1, 0]);
  const [clock, setClock] = useState(() =>
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Colombo",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date()),
  );
  const { sound, setEnabled, play } = useSound();
  const markEntered = () => {
    try {
      sessionStorage.setItem("nh-workspace-entered", "yes");
    } catch {
      /* Optional storage. */
    }
  };
  const enter = () => {
    markEntered();
    setBoot(false);
    play("welcome");
  };
  const openIndex = () => {
    markEntered();
    setBoot(false);
    setReading(true);
    history.pushState(null, "", "#read");
  };
  const closeIndex = () => {
    setReading(false);
    history.replaceState(null, "", location.pathname + location.search);
  };
  const openApp = useCallback(
    (app) => {
      if (!TITLES[app]) return;
      setWindows((previous) => [
        ...previous.filter((item) => item.id !== app),
        { id: app, minimized: false },
      ]);
      play("open");
    },
    [play],
  );
  const onReady = useCallback(() => setReady(true), []),
    onFailure = useCallback(() => {
      setFailed(true);
      setReady(true);
    }, []);
  const front = windows.filter((item) => !item.minimized).at(-1)?.id;
  const closeApp = (app) => {
    setWindows((previous) => previous.filter((item) => item.id !== app));
    requestAnimationFrame(() =>
      document.querySelector(`[data-launcher="${app}"]`)?.focus(),
    );
  };
  const bringFront = (app) =>
    setWindows((previous) => {
      const target = previous.find((item) => item.id === app);
      if (!target || (previous.at(-1) === target && !target.minimized))
        return previous;
      return [
        ...previous.filter((item) => item.id !== app),
        { ...target, minimized: false },
      ];
    });
  const minimize = (app) =>
    setWindows((previous) =>
      previous.map((item) =>
        item.id === app ? { ...item, minimized: true } : item,
      ),
    );
  const toggleMotion = () =>
    setMotion((previous) => {
      try {
        localStorage.setItem("portfolio-motion", previous ? "off" : "on");
      } catch {
        /* Optional preference. */
      }
      return !previous;
    });
  useEffect(() => {
    document.documentElement.dataset.motion = motion ? "on" : "off";
  }, [motion]);
  useEffect(() => {
    document.body.classList.toggle("workspace-mode", !reading);
    return () => document.body.classList.remove("workspace-mode");
  }, [reading]);
  useEffect(() => {
    const timer = setInterval(
      () =>
        setClock(
          new Intl.DateTimeFormat("en-GB", {
            timeZone: "Asia/Colombo",
            hour: "2-digit",
            minute: "2-digit",
          }).format(new Date()),
        ),
      30000,
    );
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    const navigation = () =>
      setReading(
        location.hash === "#read" || location.hash.startsWith("#index-"),
      );
    const dismissMenus = (event) => {
      if (!event.target.closest(".workspace-menu"))
        document.querySelectorAll(".workspace-menu[open]").forEach((menu) => {
          menu.open = false;
        });
    };
    window.addEventListener("popstate", navigation);
    document.addEventListener("pointerdown", dismissMenus);
    return () => {
      window.removeEventListener("popstate", navigation);
      document.removeEventListener("pointerdown", dismissMenus);
    };
  }, []);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => {
      if (media.matches) setMotion(false);
    };
    media.addEventListener("change", change);
    return () => media.removeEventListener("change", change);
  }, []);
  useEffect(() => {
    const key = (event) => {
      if (event.key !== "Escape" || boot || reading) return;
      const menu = document.querySelector(".workspace-menu[open]");
      if (menu) {
        menu.open = false;
        return;
      }
      if (front) {
        setWindows((previous) => previous.filter((item) => item.id !== front));
        requestAnimationFrame(() =>
          document.querySelector(`[data-launcher="${front}"]`)?.focus(),
        );
      }
    };
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, [front, boot, reading]);
  if (reading) return <ReadIndex onBack={closeIndex} />;
  const renderApp = (app) => {
    switch (app) {
      case "about":
        return <AboutFile />;
      case "research":
        return <ResearchFile />;
      case "immersive":
        return <ImmersiveFile />;
      case "experience":
        return <ExperienceFile />;
      case "recognition":
        return <RecognitionFile />;
      case "work":
        return <WorkFile />;
      case "stack":
        return <StackFile />;
      case "terminal":
        return <Terminal onOpen={openApp} />;
      case "quantum":
        return <QuantumRelay onState={setQubit} onSound={play} />;
      case "contact":
        return <ContactFile />;
      default:
        return null;
    }
  };
  return (
    <div className="personal-workspace">
      <a className="skip-link" href="#workspace-files">
        Skip to portfolio files
      </a>
      <header className="workspace-menubar">
        <button
          className="workspace-wordmark"
          onClick={() => setWindows([])}
          aria-label="Show 3D workspace"
        >
          NH<span> / </span>WORKSPACE
        </button>
        <details className="workspace-menu" name="workspace-menus">
          <summary>Files</summary>
          <nav aria-label="All workspace files">
            {files.map(([id, label]) => (
              <button
                key={id}
                onClick={(event) => {
                  openApp(id);
                  event.currentTarget.closest("details").open = false;
                }}
              >
                {label}
                <span>{TITLES[id]}</span>
              </button>
            ))}
          </nav>
        </details>
        <details className="workspace-menu" name="workspace-menus">
          <summary>View</summary>
          <nav aria-label="Workspace view options">
            <button onClick={openIndex}>
              Read portfolio <span>Text index ↗</span>
            </button>
            <button
              onClick={(event) => {
                toggleMotion();
                event.currentTarget.closest("details").open = false;
              }}
            >
              Animation <span>{motion ? "On" : "Off"}</span>
            </button>
            <button
              onClick={(event) => {
                setBoot(true);
                event.currentTarget.closest("details").open = false;
              }}
            >
              Replay introduction <span>↺</span>
            </button>
          </nav>
        </details>
        <button className="top-play" onClick={() => openApp("quantum")}>
          Play
        </button>
        <span className="menubar-spacer" />
        <button
          className="sound-switch"
          onClick={() => setEnabled(!sound)}
          aria-pressed={sound}
        >
          {sound ? "Sound on" : "Sound off"}
          <span aria-hidden="true">{sound ? "▥" : "⊘"}</span>
        </button>
        <button className="read-shortcut" onClick={openIndex}>
          Read portfolio ↗
        </button>
        <time className="workspace-clock">{clock} LK</time>
      </header>
      <main id="workspace-main" className="workspace-main">
        <div className="workspace-intro">
          <div className="workspace-identity">
            <div className="identity-photo">
              <img
                src={portrait}
                alt="Nirusan Hariharan"
                width="126"
                height="150"
                fetchPriority="high"
              />
            </div>
            <p>
              COLOMBO, SRI LANKA
              <br />
              SOFTWARE / RESEARCH / VR
            </p>
          </div>
          <h1>
            Nirusan
            <br />
            Hariharan<span>.</span>
          </h1>
          <p className="workspace-role">
            Software engineer.
            <br />
            Quantum researcher.
            <br />
            Co-founder & CTO.
          </p>
          <p className="workspace-summary">
            Niroga AI · BlueLotus360 · Immersive Smile Plus. Visiting Lecturer
            at IIT.
          </p>
          <div className="intro-links">
            <button onClick={() => openApp("research")}>
              Read my IEEE paper <span>↗</span>
            </button>
            <button onClick={() => openApp("work")}>
              Explore my projects <span>↗</span>
            </button>
            <a href="/Nirusan_Hariharan_CV.pdf" download>
              Download résumé <span>↓</span>
            </a>
          </div>
          <a
            className="profile-source"
            href={LINKS.westminster}
            target="_blank"
            rel="noopener noreferrer"
          >
            Westminster Alumni Awards
            <br />
            <span>Recent Graduate finalist, 2026 ↗</span>
          </a>
        </div>
        <div className={`world-shell ${failed ? "world-failed" : ""}`}>
          <div className="world-coordinate">
            INTERACTIVE ENGINEERING WORKSPACE
            <br />
            <span>DRAG TO ORBIT · OPEN A STATION</span>
          </div>
          <SceneBoundary onFailure={onFailure}>
            <Suspense
              fallback={
                <div className="scene-loading" role="status">
                  Preparing the 3D workspace…
                </div>
              }
            >
              <World
                motion={motion}
                suspended={Boolean(front) || reading || boot}
                onOpen={openApp}
                onReady={onReady}
                onFailure={onFailure}
                qubit={qubit}
              />
            </Suspense>
          </SceneBoundary>
          {failed && (
            <div className="world-fallback">
              <p>The portfolio files are ready.</p>
              <p>This browser couldn’t open the 3D view.</p>
              <button onClick={openIndex}>Open the full portfolio ↗</button>
            </div>
          )}
          <div className="world-caption">
            <span>NIRUSAN HARIHARAN / INTERACTIVE PORTFOLIO</span>
            <button onClick={() => openApp("quantum")}>
              Try quantum relay →
            </button>
          </div>
        </div>
        <nav
          id="workspace-files"
          className="workspace-launcher"
          aria-label="Open a portfolio file"
        >
          {files.map(([id, label]) => (
            <button
              key={id}
              data-launcher={id}
              onClick={() => openApp(id)}
              aria-label={`Open ${label}`}
            >
              <span className="file-mark" aria-hidden="true">
                {id === "terminal"
                  ? ">_"
                  : id === "quantum"
                    ? "ψ"
                    : id === "work"
                      ? "↳"
                      : "▱"}
              </span>
              <span>{label}</span>
              {windows.some((item) => item.id === id) && (
                <i aria-hidden="true" />
              )}
            </button>
          ))}
        </nav>
        {windows.map((item, index) => (
          <WorkspaceWindow
            key={item.id}
            app={item.id}
            index={index}
            front={front === item.id}
            minimized={item.minimized}
            onFront={() => bringFront(item.id)}
            onClose={() => closeApp(item.id)}
            onMinimize={() => minimize(item.id)}
          >
            {renderApp(item.id)}
          </WorkspaceWindow>
        ))}
      </main>
      <footer className="workspace-status">
        <span>© {new Date().getFullYear()} NIRUSAN HARIHARAN</span>
        <div>
          {windows
            .filter((item) => item.minimized)
            .map((item) => (
              <button
                key={item.id}
                onClick={() => bringFront(item.id)}
                aria-label={`Restore ${TITLES[item.id]}`}
              >
                {TITLES[item.id]} ↑
              </button>
            ))}
        </div>
        <span className="workspace-status-hint">
          OPEN A FILE. MOVE A WINDOW. STAY A WHILE.
        </span>
      </footer>
      {boot && (
        <Boot
          ready={ready}
          onEnter={enter}
          onIndex={openIndex}
          sound={sound}
          setSound={setEnabled}
        />
      )}
    </div>
  );
}
