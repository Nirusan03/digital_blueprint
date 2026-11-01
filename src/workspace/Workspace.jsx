import { lazy, Suspense, useEffect, useState } from "react";
import gsap from "gsap";
import useSound from "./useSound";
import Story from "../story/Story";
import SceneBoundary from "./SceneBoundary";
import quality from "../story/quality";

const loadDesktop = () => import("./Desktop");
const Desktop = lazy(loadDesktop);

function initialMotion() {
  try {
    if (localStorage.getItem("portfolio-motion") === "off") return false;
  } catch {
    /* Optional preference. */
  }
  return !matchMedia("(prefers-reduced-motion: reduce)").matches;
}
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

export default function Workspace() {
  const [desktop, setDesktop] = useState(() => location.hash === "#workspace");
  const [compact, setCompact] = useState(() => matchMedia("(max-width: 1100px), (max-height: 599px), (hover: none)").matches);
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
    const query = matchMedia("(max-width: 1100px), (max-height: 599px), (hover: none)");
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
    document.documentElement.dataset.quality = quality();
  }, [motion]);
  // Desktop mode needs a pointer and a large screen. Only an explicit click or link opens it.
  const showDesktop = desktop && !compact;
  useEffect(() => {
    document.body.classList.toggle("workspace-mode", showDesktop);
    return () => document.body.classList.remove("workspace-mode");
  }, [showDesktop]);
  const enter = (event) => { loadDesktop(); wipe(event, motion, () => {
    history.pushState(null, "", "#workspace");
    setDesktop(true);
    window.scrollTo(0, 0);
  }); };
  const leave = (event) => wipe(event, motion, () => {
    history.pushState(null, "", "#read");
    setDesktop(false);
    window.scrollTo(0, 0);
  });
  if (showDesktop)
    return <SceneBoundary onFailure={() => setDesktop(false)}><Suspense fallback={<div style={{ position: "fixed", inset: 0, background: "#0b0b0c" }} />}><Desktop motion={motion} onMotion={toggleMotion} sound={sound} setSound={setEnabled} play={play} onExit={leave} /></Suspense></SceneBoundary>;
  return <Story onDesktop={enter} motion={motion} onMotion={toggleMotion} sound={sound} onSound={() => setEnabled(!sound)} playCue={play} />;
}
