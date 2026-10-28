import { useEffect, useRef, useState } from "react";
import { TITLES as APP_TITLES } from "./content";
export default function WorkspaceWindow({
  app,
  index,
  front,
  minimized,
  onFront,
  onClose,
  onMinimize,
  children,
}) {
  const [position, setPosition] = useState(() => ({
    x: Math.max(
      12,
      Math.min(
        330 + index * 25,
        window.innerWidth - Math.min(880, window.innerWidth - 48) - 12,
      ),
    ),
    y: Math.max(
      65,
      Math.min(
        95 + index * 25,
        window.innerHeight - Math.min(700, window.innerHeight - 160) - 40,
      ),
    ),
  }));
  const [maximized, setMaximized] = useState(false);
  const start = useRef(null),
    panel = useRef(null),
    title = useRef(null);
  const clamp = (x, y) => ({
    x: Math.max(
      12,
      Math.min(window.innerWidth - (panel.current?.offsetWidth || 700) - 12, x),
    ),
    y: Math.max(
      64,
      Math.min(
        window.innerHeight - (panel.current?.offsetHeight || 560) - 38,
        y,
      ),
    ),
  });
  useEffect(() => {
    panel.current
      ?.querySelector(".window-body")
      ?.focus({ preventScroll: true });
    const resize = () =>
      setPosition((previous) => clamp(previous.x, previous.y));
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);
  const dragStart = (event) => {
    if (event.target.closest("button") || window.innerWidth <= 760 || maximized)
      return;
    start.current = {
      x: event.clientX,
      y: event.clientY,
      px: position.x,
      py: position.y,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    onFront();
  };
  const drag = (event) => {
    if (start.current)
      setPosition(
        clamp(
          start.current.px + event.clientX - start.current.x,
          start.current.py + event.clientY - start.current.y,
        ),
      );
  };
  const keyMove = (event) => {
    if (
      !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)
    )
      return;
    event.preventDefault();
    setPosition((previous) =>
      clamp(
        previous.x +
          (event.key === "ArrowLeft"
            ? -20
            : event.key === "ArrowRight"
              ? 20
              : 0),
        previous.y +
          (event.key === "ArrowUp" ? -20 : event.key === "ArrowDown" ? 20 : 0),
      ),
    );
  };
  return (
    <section
      ref={panel}
      className={`workspace-window window-${app} ${front ? "window-front" : ""} ${maximized ? "window-maximized" : ""}`}
      style={{ left: position.x, top: position.y, zIndex: 20 + index }}
      hidden={minimized}
      role="dialog"
      aria-modal="false"
      aria-labelledby={`title-${app}`}
      onPointerDown={onFront}
      onScroll={(event) => {
        // Keep the frame fixed when browser focus/scrollIntoView targets a child.
        // Document and game content scroll only inside .window-body.
        if (event.target === event.currentTarget) {
          event.currentTarget.scrollTop = 0;
          event.currentTarget.scrollLeft = 0;
        }
      }}
    >
      <header
        ref={title}
        className="window-titlebar"
        onPointerDown={dragStart}
        onPointerMove={drag}
        onPointerUp={() => {
          start.current = null;
        }}
        onPointerCancel={() => {
          start.current = null;
        }}
        onDoubleClick={() => setMaximized((value) => !value)}
      >
        <span
          className="window-grip"
          tabIndex="0"
          onKeyDown={keyMove}
          aria-label={`Move ${APP_TITLES[app]} window with arrow keys`}
        >
          ⠿
        </span>
        <h2 id={`title-${app}`}>{APP_TITLES[app]}</h2>
        <div className="window-controls">
          <button
            aria-label={`Minimize ${APP_TITLES[app]}`}
            onClick={(event) => {
              event.stopPropagation();
              onMinimize();
            }}
          >
            −
          </button>
          <button
            aria-label={`${maximized ? "Restore" : "Maximize"} ${APP_TITLES[app]}`}
            onClick={(event) => {
              event.stopPropagation();
              setMaximized((value) => !value);
            }}
          >
            □
          </button>
          <button
            aria-label={`Close ${APP_TITLES[app]}`}
            onClick={(event) => {
              event.stopPropagation();
              onClose();
            }}
          >
            ×
          </button>
        </div>
      </header>
      <div className="window-body" tabIndex="0">
        {children}
      </div>
      <div className="window-status">
        <span>{APP_TITLES[app]}</span>
        <span>
          {app === "terminal"
            ? "BROWSER FILESYSTEM"
            : app === "quantum"
              ? "QUANTUM RELAY / PACKET RUN"
              : "NIRUSAN HARIHARAN"}
        </span>
      </div>
    </section>
  );
}
