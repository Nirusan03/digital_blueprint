import { useEffect, useRef, useState } from "react";
import "./boot.css";

const stages = [
  {
    name: "Signal",
    title: "Inbound signal detected.",
    detail: "Quantum computing × cybersecurity",
    cue: "signal",
    duration: 2100,
  },
  {
    name: "Authentication",
    title: "User authentication.",
    detail: "Public visitor · guest session",
    cue: "authenticate",
    duration: 2200,
  },
  {
    name: "Welcome",
    title: "Welcome, explorer.",
    detail: "Step inside Nirusan Hariharan’s workspace.",
    cue: "welcome",
    duration: 1900,
  },
];

function SignalField() {
  return (
    <div className="signal-field" aria-hidden="true">
      <svg viewBox="0 0 800 600" className="signal-diagram">
        <defs>
          <radialGradient id="signal-light">
            <stop offset="0" stopColor="#a7cfc2" stopOpacity=".55" />
            <stop offset="1" stopColor="#a7cfc2" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle
          cx="400"
          cy="300"
          r="230"
          fill="url(#signal-light)"
          stroke="none"
        />
        <g className="signal-orbits">
          <circle cx="400" cy="300" r="180" />
          <circle cx="400" cy="300" r="210" strokeDasharray="3 11" />
          <ellipse cx="400" cy="300" rx="180" ry="62" />
          <ellipse cx="400" cy="300" rx="70" ry="180" />
          <path d="M400 65v470M165 300h470M273 173l254 254M273 427l254-254" />
          <path d="m400 120 156 90v180l-156 90-156-90V210Zm0 0v360m-156-270 312 180m0-180L244 390" />
        </g>
        <g className="signal-nodes">
          {Array.from({ length: 8 }, (_, index) => {
            const angle = (index * Math.PI) / 4;
            const x = 400 + Math.cos(angle) * 265;
            const y = 300 + Math.sin(angle) * 220;
            return (
              <g key={index} transform={`translate(${x} ${y})`}>
                <path d="M0-18 27-3v30L0 43l-27-16V-3Zm0 0v31m-27-16L0 13 27-3M0 13v30" />
                <path d={`M0 13 ${400 - x} ${300 - y}`} strokeDasharray="2 9" />
                <circle cx="0" cy="13" r="3" />
              </g>
            );
          })}
        </g>
        <g className="signal-core">
          <path d="m400 233 58 34v66l-58 34-58-34v-66Zm0 0v134m-58-100 116 66m0-66-116 66" />
          <circle cx="400" cy="300" r="13" />
        </g>
      </svg>
      <div className="signal-fragments">
        {Array.from({ length: 48 }, (_, index) => (
          <i
            key={index}
            style={{
              "--x": `${12 + ((index * 37) % 77)}%`,
              "--y": `${8 + ((index * 23) % 85)}%`,
              "--size": `${5 + ((index * 7) % 25)}px`,
              "--delay": `${(index % 8) * -0.3}s`,
              "--turn": `${(index % 3) * 30}deg`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function Boot({
  ready,
  failed,
  motion,
  onEnter,
  onIndex,
  sound,
  setSound,
  onCue,
}) {
  const dialog = useRef(null);
  const [stage, setStage] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const current = stages[stage];

  useEffect(() => {
    dialog.current.showModal();
  }, []);

  useEffect(() => {
    onCue(current.cue);
    const timer = setTimeout(
      () => {
        if (stage < stages.length - 1) setStage(stage + 1);
        else setLeaving(true);
      },
      motion ? current.duration : 1100,
    );
    return () => clearTimeout(timer);
  }, [stage, current, motion, onCue]);

  useEffect(() => {
    if (!leaving) return;
    const timer = setTimeout(onEnter, motion ? 450 : 0);
    return () => clearTimeout(timer);
  }, [leaving, motion, onEnter]);

  return (
    <dialog
      ref={dialog}
      className={`signal-boot signal-step-${stage} ${leaving ? "signal-leaving" : ""}`}
      aria-labelledby="signal-title"
      onCancel={(event) => {
        event.preventDefault();
        onEnter();
      }}
    >
      <header className="signal-header">
        <span>NH / NIRUSAN HARIHARAN</span>
        <div>
          <button onClick={() => setSound(!sound)} aria-pressed={!sound}>
            {sound ? "Mute sound" : "Unmute sound"}
          </button>
          <button onClick={onEnter}>Skip intro ↗</button>
        </div>
      </header>
      <div className="signal-stage" data-stage={stage}>
        <SignalField />
        <aside className="signal-trace signal-trace-left" aria-hidden="true">
          <p>TRACE / 01</p>
          <p>QUANTUM + CYBERSECURITY</p>
          <p>QuanNetDetect</p>
          <div className="signal-wave">∿ ∿ ∿ ∿ ∿ ∿ ∿</div>
          <p>RESEARCH / IEEE QCNC 2026</p>
        </aside>
        <aside className="signal-trace signal-trace-right" aria-hidden="true">
          <p>SESSION / PUBLIC VISITOR</p>
          <p>ACCESS / PORTFOLIO</p>
          <p>IDENTITY / GUEST</p>
          <p>
            SCENE /{" "}
            {failed ? "READING VIEW AVAILABLE" : ready ? "READY" : "PREPARING"}
          </p>
        </aside>
        <div className="signal-message" key={stage}>
          <p className="signal-step-label">
            0{stage + 1} / {current.name}
          </p>
          <h1 id="signal-title">{current.title}</h1>
          <p className="signal-detail">{current.detail}</p>
          {stage === 1 && (
            <dl className="signal-session">
              <div>
                <dt>Identity</dt>
                <dd>Guest visitor</dd>
              </div>
              <div>
                <dt>Access</dt>
                <dd>Public portfolio</dd>
              </div>
              <div>
                <dt>Credentials</dt>
                <dd>Not required</dd>
              </div>
            </dl>
          )}
          {stage === 2 && (
            <p className="signal-signature">
              ENGINEER / QUANTUM RESEARCHER / CO-FOUNDER & CTO
            </p>
          )}
        </div>
        <p className="sr-only" role="status" aria-live="polite">
          {current.title} {current.detail}
        </p>
      </div>
      <footer className="signal-footer">
        <ol aria-label="Introduction sequence">
          {stages.map((item, index) => (
            <li
              key={item.name}
              aria-current={index === stage ? "step" : undefined}
              data-complete={index < stage}
            >
              <span>0{index + 1}</span> {item.name}
            </li>
          ))}
        </ol>
        <button onClick={onIndex}>Read portfolio ↗</button>
      </footer>
    </dialog>
  );
}
