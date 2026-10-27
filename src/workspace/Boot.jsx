import { useEffect, useRef, useState } from "react";
export default function Boot({ ready, onEnter, onIndex, sound, setSound }) {
  const dialog = useRef(null),
    timer = useRef(null);
  const [entering, setEntering] = useState(false);
  useEffect(() => {
    dialog.current.showModal();
    return () => clearTimeout(timer.current);
  }, []);
  const enter = () => {
    setEntering(true);
    timer.current = setTimeout(
      onEnter,
      document.documentElement.dataset.motion === "off" ? 0 : 650,
    );
  };
  return (
    <dialog
      ref={dialog}
      className={`boot-screen ${entering ? "boot-entering" : ""}`}
      aria-labelledby="boot-title"
      onCancel={(event) => {
        event.preventDefault();
        onEnter();
      }}
    >
      <div className="boot-top">
        <span>NH / PERSONAL WORKSPACE</span>
        <button onClick={onIndex}>Skip to the index ↗</button>
      </div>
      <div className="boot-layout">
        <div className="boot-reticle" aria-hidden="true">
          <svg viewBox="0 0 300 300">
            <circle cx="150" cy="150" r="116" />
            <ellipse cx="150" cy="150" rx="64" ry="116" />
            <ellipse cx="150" cy="150" rx="116" ry="38" />
            <path d="M150 8v42m0 200v42M8 150h42m200 0h42M65 65l20 20m130 130 20 20M65 235l20-20m130-130 20-20" />
            <circle cx="150" cy="150" r="5" />
          </svg>
        </div>
        <div className="boot-copy">
          <p className="file-eyebrow">
            {entering ? "OPENING VISITOR SESSION" : "A PORTFOLIO BY"}
          </p>
          <h1 id="boot-title">
            Nirusan
            <br />
            Hariharan<span>.</span>
          </h1>
          <p className="boot-description">
            Software engineer. Quantum researcher.
            <br />
            Co-founder & CTO, Immersive Smile Plus.
          </p>
          <div className="boot-checks" role="status">
            <p>
              <span>Portfolio files</span>
              <span>Ready</span>
            </p>
            <p>
              <span>3D workspace</span>
              <span>{ready ? "Ready" : "Preparing…"}</span>
            </p>
          </div>
          <label className="boot-sound">
            <input
              type="checkbox"
              checked={sound}
              onChange={(event) => setSound(event.target.checked)}
            />{" "}
            Enable sound <span>short interface sounds, no music loop</span>
          </label>
          <button className="boot-enter" onClick={enter} disabled={entering}>
            {entering ? "Welcome, visitor." : "Enter workspace"}
            <span>↗</span>
          </button>
        </div>
      </div>
      <div className="boot-bottom">
        <span>RESEARCH / PROJECTS / EXPERIENCE / PLAY</span>
        <span>No account needed.</span>
      </div>
    </dialog>
  );
}
