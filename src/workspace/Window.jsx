import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { TITLES as APP_TITLES } from "./content";

const NAMES = { research: "QuanNetDetect", work: "Projects", experience: "Experience", recognition: "Recognition", about: "About", stack: "Toolkit", terminal: "Terminal", quantum: "Play", contact: "Contact", immersive: "Immersive Smile Plus" };
const MIN = { width: 420, height: 320 };
const TOP = 40;
const BOTTOM = 96;

export default function WorkspaceWindow({ app, index, front, minimized, motion, onFront, onClose, onMinimize, children }) {
  const [frame, setFrame] = useState(() => {
    const width = Math.min(920, innerWidth - 120);
    const height = Math.min(700, innerHeight - TOP - BOTTOM - 24);
    return {
      x: Math.max(16, (innerWidth - width) / 2 + (index - 1) * 32),
      y: Math.max(TOP + 12, TOP + 16 + index * 26),
      width,
      height,
    };
  });
  const [maximized, setMaximized] = useState(false);
  const start = useRef(null);
  const panel = useRef(null);
  const launcher = () => document.querySelector(`[data-launcher="${app}"]`)?.getBoundingClientRect();
  // A short lean from the dock's direction: the window is readable from the first frames.
  const fromDock = () => {
    const rect = launcher();
    const box = panel.current.getBoundingClientRect();
    if (!rect) return { scale: 0.97, opacity: 0 };
    return {
      x: (rect.left + rect.width / 2 - (box.left + box.width / 2)) * 0.1,
      y: (rect.top + rect.height / 2 - (box.top + box.height / 2)) * 0.1,
      scale: 0.96,
      opacity: 0,
    };
  };
  const clamp = (x, y, width = frame.width) => ({
    x: Math.max(12 - width + 120, Math.min(innerWidth - 120, x)),
    y: Math.max(TOP + 4, Math.min(innerHeight - BOTTOM, y)),
  });
  useLayoutEffect(() => {
    panel.current?.querySelector(".window-body")?.focus({ preventScroll: true });
    if (motion) gsap.fromTo(panel.current, fromDock(), { x: 0, y: 0, scale: 1, opacity: 1, duration: 0.22, ease: "power2.out", overwrite: true, clearProps: "transform,opacity" });
    // Only the opening of a new window animates.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const wasMinimized = useRef(minimized);
  useLayoutEffect(() => {
    if (wasMinimized.current && !minimized && motion)
      gsap.fromTo(panel.current, fromDock(), { x: 0, y: 0, scale: 1, opacity: 1, duration: 0.22, ease: "power2.out", overwrite: true, clearProps: "transform,opacity" });
    wasMinimized.current = minimized;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minimized, motion]);
  useEffect(() => {
    const resize = () => setFrame((previous) => ({ ...previous, ...clamp(previous.x, previous.y, previous.width) }));
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const leave = (finish) => {
    if (!motion) return finish();
    gsap.to(panel.current, { ...fromDock(), duration: 0.14, ease: "power2.in", onComplete: () => { gsap.set(panel.current, { clearProps: "all" }); finish(); } });
  };
  const dragStart = (event) => {
    if (event.target.closest("button") || maximized) return;
    start.current = { x: event.clientX, y: event.clientY, px: frame.x, py: frame.y };
    event.currentTarget.setPointerCapture(event.pointerId);
    onFront();
  };
  const drag = (event) => {
    if (!start.current) return;
    setFrame((previous) => ({ ...previous, ...clamp(start.current.px + event.clientX - start.current.x, start.current.py + event.clientY - start.current.y) }));
  };
  const resizeStart = (event) => {
    event.stopPropagation();
    start.current = { x: event.clientX, y: event.clientY, width: frame.width, height: frame.height };
    event.currentTarget.setPointerCapture(event.pointerId);
    onFront();
  };
  const resizeMove = (event) => {
    if (!start.current) return;
    setFrame((previous) => ({
      ...previous,
      width: Math.max(MIN.width, start.current.width + event.clientX - start.current.x),
      height: Math.max(MIN.height, start.current.height + event.clientY - start.current.y),
    }));
  };
  const keyMove = (event) => {
    const step = { ArrowLeft: [-24, 0], ArrowRight: [24, 0], ArrowUp: [0, -24], ArrowDown: [0, 24] }[event.key];
    if (!step || event.target !== event.currentTarget) return;
    event.preventDefault();
    setFrame((previous) => ({ ...previous, ...clamp(previous.x + step[0], previous.y + step[1]) }));
  };
  const name = NAMES[app] || APP_TITLES[app];
  return (
    <section
      ref={panel}
      className={`workspace-window window-${app} ${front ? "window-front" : ""} ${maximized ? "window-maximized" : ""}`}
      style={maximized ? { zIndex: 20 + index } : { left: frame.x, top: frame.y, width: frame.width, height: frame.height, zIndex: 20 + index }}
      hidden={minimized}
      role="dialog"
      aria-modal="false"
      aria-labelledby={`title-${app}`}
      onPointerDown={onFront}
    >
      <header
        className="window-titlebar"
        tabIndex={0}
        aria-label={`${name} title bar. Use arrow keys to move the window.`}
        onKeyDown={keyMove}
        onPointerDown={dragStart}
        onPointerMove={drag}
        onPointerUp={() => { start.current = null; }}
        onPointerCancel={() => { start.current = null; }}
        onDoubleClick={() => setMaximized((value) => !value)}
      >
        <div className="window-controls">
          <button className="wc-close" aria-label={`Close ${name}`} onClick={(event) => { event.stopPropagation(); leave(onClose); }} />
          <button className="wc-min" aria-label={`Minimize ${name}`} onClick={(event) => { event.stopPropagation(); leave(onMinimize); }} />
          <button className="wc-max" aria-label={`${maximized ? "Restore" : "Maximize"} ${name}`} onClick={(event) => { event.stopPropagation(); setMaximized((value) => !value); }} />
        </div>
        <h2 id={`title-${app}`}>{name}</h2>
      </header>
      <div className={`window-body ${["terminal", "quantum"].includes(app) ? "" : "document-dark"}`} tabIndex="0">
        {children}
      </div>
      {!maximized && <span className="window-resize" aria-hidden="true" onPointerDown={resizeStart} onPointerMove={resizeMove} onPointerUp={() => { start.current = null; }} onPointerCancel={() => { start.current = null; }} />}
    </section>
  );
}
