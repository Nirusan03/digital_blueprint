import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Playground from "../workspace/Playground";
import Terminal from "../workspace/Terminal";

const SECTION = { work: "index-work", about: "index-about", research: "index-research", experience: "index-experience", recognition: "index-recognition", stack: "index-toolkit", contact: "index-contact" };

// Games and the terminal open in place, so playing never moves the visitor into desktop mode.
export default function GameSheet({ kind, motion, playCue, onClose }) {
  const dialog = useRef(null);
  const [, setQubit] = useState([1, 0]);
  useEffect(() => {
    const node = dialog.current;
    if (!node.open) node.showModal();
    document.documentElement.style.overflow = "hidden";
    if (motion) gsap.fromTo(node, { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 0.9, ease: "expo.inOut" });
    return () => { document.documentElement.style.overflow = ""; };
  }, [motion]);
  const close = () => {
    if (!motion) return onClose();
    gsap.to(dialog.current, { clipPath: "inset(0 0 100% 0)", duration: 0.6, ease: "expo.inOut", onComplete: onClose });
  };
  const openFromTerminal = (app) => {
    onClose();
    if (SECTION[app]) requestAnimationFrame(() => document.getElementById(SECTION[app])?.scrollIntoView({ behavior: "instant" }));
  };
  return (
    <dialog className="sheet" ref={dialog} onCancel={(event) => { event.preventDefault(); close(); }} aria-label={kind === "terminal" ? "Terminal" : "Games"}>
      <header className="sheet-bar">
        <span>{kind === "terminal" ? "Terminal" : "Play"}</span>
        <button onClick={close}>Close</button>
      </header>
      <div className={`sheet-body sheet-${kind}`}>
        {kind === "terminal"
          ? <Terminal onOpen={openFromTerminal} onExit={close} />
          : <Playground onState={setQubit} onSound={playCue} active motion={motion} initial={kind} />}
      </div>
    </dialog>
  );
}
