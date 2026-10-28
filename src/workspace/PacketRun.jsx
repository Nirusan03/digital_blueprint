import { useCallback, useEffect, useRef, useState } from "react";
import {
  newPacketRun,
  advancePacketRun,
  steerPacketRun,
} from "../lib/packetRun";

export default function PacketRun({ active, motion, onSound }) {
  const surface = useRef(null),
    canvas = useRef(null),
    simulation = useRef(newPacketRun()),
    drawRef = useRef(null),
    dimensions = useRef({ width: 720, height: 420 });
  const [lane, setLane] = useState(1);
  const [status, setStatus] = useState("ready"),
    [score, setScore] = useState(0),
    [shields, setShields] = useState(3),
    [remaining, setRemaining] = useState(45),
    [best, setBest] = useState(() => {
      try {
        return Number(localStorage.getItem("nh-packet-best")) || 0;
      } catch {
        return 0;
      }
    });
  const bestRef = useRef(best),
    last = useRef(0),
    live = useRef({ active, motion });
  useEffect(() => {
    live.current = { active, motion };
  }, [active, motion]);
  const draw = useCallback(() => {
    const ctx = canvas.current?.getContext("2d");
    if (!ctx) return;
    const { width: w, height: h } = dimensions.current,
      game = simulation.current;
    const horizon = h * 0.22,
      roadBottom = h * 0.96;
    const gradient = ctx.createLinearGradient(0, 0, w, h);
    gradient.addColorStop(0, "#0a142b");
    gradient.addColorStop(0.6, "#123443");
    gradient.addColorStop(1, "#081526");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);
    const glow = ctx.createRadialGradient(
      w * 0.5,
      horizon,
      0,
      w * 0.5,
      horizon,
      w * 0.5,
    );
    glow.addColorStop(0, "#4cc5b125");
    glow.addColorStop(1, "#4cc5b100");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 55; i++) {
      const x = (i * 127 + 31) % w,
        y = (i * 67 + 11) % (h * 0.7);
      ctx.fillStyle = i % 3 ? "#8abdc05c" : "#d6ac7e80";
      ctx.fillRect(x, y, i % 4 ? 1 : 2, 1);
    }
    const project = (lane, z) => {
      const p = 0.08 + z * z * 0.92;
      return {
        x: w / 2 + (lane - 1) * w * 0.255 * p,
        y: horizon + (roadBottom - horizon) * p,
        scale: p,
      };
    };
    ctx.strokeStyle = "#70c8c13b";
    ctx.lineWidth = 1;
    for (const edge of [-0.5, 0.5, 1.5, 2.5]) {
      const a = project(edge, 0),
        b = project(edge, 1.15);
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }
    for (let i = 0; i < 17; i++) {
      const z = (i / 17 + (live.current.motion ? game.time * 0.16 : 0)) % 1,
        p = project(1, z);
      ctx.strokeStyle = `rgba(93,184,177,${0.08 + z * 0.2})`;
      ctx.beginPath();
      ctx.moveTo(w / 2 - w * 0.43 * p.scale, p.y);
      ctx.lineTo(w / 2 + w * 0.43 * p.scale, p.y);
      ctx.stroke();
    }
    // The gateway and towers establish depth without images or large model assets.
    ctx.strokeStyle = "#63aaad52";
    ctx.lineWidth = 1;
    for (const side of [-1, 1])
      for (let i = 0; i < 7; i++) {
        const depth = i / 7 + 0.07,
          p = project(1 + side * 2.1, depth),
          height = 35 + depth * 110;
        ctx.strokeRect(p.x - side * 8, p.y - height, side * 20 * depth, height);
      }
    ctx.strokeStyle = "#b7d0bf60";
    ctx.strokeRect(w * 0.42, horizon - 24, w * 0.16, 36);
    ctx.font = `${Math.max(9, w * 0.015)}px monospace`;
    ctx.fillStyle = "#9ed7cf";
    ctx.textAlign = "center";
    ctx.fillText("SECURE GATEWAY", w / 2, horizon - 35);
    const sorted = [...game.objects].sort((a, b) => a.z - b.z);
    for (const item of sorted) {
      if (item.checked && item.lane === game.lane) continue;
      const p = project(item.lane, item.z),
        s = (item.kind === "malware" ? 30 : 18) * p.scale;
      ctx.save();
      ctx.translate(p.x, p.y - 12 * p.scale);
      ctx.lineWidth = 1.5;
      if (item.kind === "malware") {
        ctx.fillStyle = "#8e434055";
        ctx.strokeStyle = "#ff9b85";
        ctx.beginPath();
        ctx.moveTo(0, -s);
        ctx.lineTo(s, s * 0.45);
        ctx.lineTo(0, s);
        ctx.lineTo(-s, s * 0.45);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, -s);
        ctx.lineTo(0, s);
        ctx.moveTo(-s, s * 0.45);
        ctx.lineTo(s, s * 0.45);
        ctx.stroke();
      } else {
        ctx.strokeStyle = "#87ffe0";
        ctx.fillStyle = "#7ef2d63d";
        ctx.rotate(Math.PI / 4);
        ctx.fillRect(-s / 2, -s / 2, s, s);
        ctx.strokeRect(-s / 2, -s / 2, s, s);
        ctx.fillStyle = "#d4fff0";
        ctx.fillRect(-2, -2, 4, 4);
      }
      ctx.restore();
    }
    const player = project(game.lane, 1);
    const size = Math.min(27, w * 0.045);
    ctx.save();
    ctx.translate(player.x, player.y - 16);
    ctx.fillStyle = game.hitFlash > 0 ? "#eeb399" : "#c3e7df";
    ctx.strokeStyle = "#68cabc";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.lineTo(size, size * 0.75);
    ctx.lineTo(0, size * 0.3);
    ctx.lineTo(-size, size * 0.75);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#64e9d1";
    ctx.fillRect(-3, size * 0.5, 6, Math.max(3, size * 0.4));
    ctx.restore();
    ctx.fillStyle = "#b0cecf";
    ctx.font = "10px monospace";
    ctx.textAlign = "left";
    ctx.fillText(w < 500 ? "PACKET RUN" : "PACKET RUN / TLS CHANNEL", 16, 23);
    ctx.textAlign = "right";
    ctx.fillStyle = "#89d6c2";
    ctx.fillText(`LANE ${game.lane + 1} / 3`, w - 16, 23);
  }, []);
  useEffect(() => {
    drawRef.current = draw;
    const observer = new ResizeObserver(() => {
      if (!canvas.current) return;
      const rect = canvas.current.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      dimensions.current = { width: rect.width, height: rect.height };
      const dpr = Math.min(devicePixelRatio || 1, 1.5);
      canvas.current.width = Math.round(rect.width * dpr);
      canvas.current.height = Math.round(rect.height * dpr);
      canvas.current.getContext("2d").setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    });
    observer.observe(canvas.current);
    return () => observer.disconnect();
  }, [draw]);
  useEffect(() => {
    if (status !== "running" || !active) {
      draw();
      return;
    }
    let frame = 0,
      disposed = false,
      lastPaint = 0,
      lastUI = 0;
    const tick = (time) => {
      frame = 0;
      if (disposed) return;
      const dt = last.current
        ? Math.min((time - last.current) / 1000, 0.05)
        : 0;
      last.current = time;
      const game = simulation.current;
      advancePacketRun(game, dt);
      if (time - lastPaint >= 30) {
        draw();
        lastPaint = time;
      }
      if (time - lastUI > 120 || game.status !== "running") {
        setScore(game.score);
        setShields(game.shields);
        setRemaining(Math.max(0, Math.ceil(45 - game.time)));
        lastUI = time;
      }
      if (game.status !== "running") {
        setStatus(game.status);
        if (game.score > bestRef.current) {
          bestRef.current = game.score;
          setBest(game.score);
          try {
            localStorage.setItem("nh-packet-best", String(game.score));
          } catch {
            /* Optional best score. */
          }
        }
        onSound?.(game.status === "won" ? "win" : "gate");
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    const visibility = () => {
      if (document.hidden) {
        simulation.current.status = "paused";
        setStatus("paused");
        cancelAnimationFrame(frame);
        draw();
      }
    };
    last.current = 0;
    frame = requestAnimationFrame(tick);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [status, active, draw, onSound]);
  // Losing window focus pauses the run rather than letting unseen collisions count.
  useEffect(() => {
    if (!active && simulation.current.status === "running") {
      simulation.current.status = "paused";
      const frame = requestAnimationFrame(() => setStatus("paused"));
      return () => cancelAnimationFrame(frame);
    }
  }, [active]);
  const start = () => {
    simulation.current = newPacketRun();
    simulation.current.status = "running";
    last.current = 0;
    setScore(0);
    setShields(3);
    setRemaining(45);
    setLane(1);
    setStatus("running");
    surface.current?.focus({ preventScroll: true });
    requestAnimationFrame(() => {
      const stage = surface.current;
      const pane = stage?.closest(".window-body");
      if (!pane) return;
      const rect = stage.getBoundingClientRect();
      const inset = Math.max(0, (pane.clientHeight - rect.height - 72) / 2);
      pane.scrollTo({
        top: Math.max(0, pane.scrollTop + rect.top - pane.getBoundingClientRect().top - inset),
        behavior: "auto",
      });
    });
    onSound?.("open");
  };
  const pause = () => {
    simulation.current.status = "paused";
    setStatus("paused");
  };
  const resume = () => {
    simulation.current.status = "running";
    last.current = 0;
    setStatus("running");
    surface.current?.focus({ preventScroll: true });
  };
  const steer = (direction) => {
    if (simulation.current.status !== "running") return;
    steerPacketRun(simulation.current, direction);
    setLane(simulation.current.lane);
    drawRef.current?.();
  };
  const keys = (event) => {
    if (
      ["ArrowLeft", "a", "A", "ArrowRight", "d", "D", " ", "Escape"].includes(
        event.key,
      )
    ) {
      event.preventDefault();
      event.stopPropagation();
      if (["ArrowLeft", "a", "A"].includes(event.key)) steer(-1);
      else if (["ArrowRight", "d", "D"].includes(event.key)) steer(1);
      else if (status === "running") pause();
      else if (status === "paused") resume();
      else if (event.key === " ") start();
    }
  };
  const swipe = useRef(null);
  return (
    <div className="packet-run" onKeyDown={keys}>
      <div className="packet-heading">
        <div>
          <p className="file-eyebrow">A NETWORK ARCADE</p>
          <h2>Packet Run</h2>
        </div>
        <span>BEST {best}</span>
      </div>
      <p className="packet-description">
        Carry the signal home. Collect the mint packets, dodge the coral
        malware, and keep your shields for 45 seconds.
      </p>
      <div className="packet-hud">
        <span>
          Score <strong>{score}</strong>
        </span>
        <span>
          Shields <strong>{shields} / 3</strong>
        </span>
        <span>
          Time <strong>{remaining}s</strong>
        </span>
        <span>
          Lane <strong>{lane + 1} / 3</strong>
        </span>
      </div>
      <div
        className="packet-stage"
        ref={surface}
        tabIndex="0"
        role="group"
        aria-label="Packet Run game. Left and right arrows or A and D steer. Space pauses."
        onKeyDown={keys}
        onPointerDown={(event) => {
          swipe.current = event.clientX;
        }}
        onPointerUp={(event) => {
          if (
            swipe.current !== null &&
            Math.abs(event.clientX - swipe.current) > 20
          )
            steer(event.clientX < swipe.current ? -1 : 1);
          swipe.current = null;
        }}
      >
        <canvas
          ref={canvas}
          aria-label="Animated network track with three lanes, a signal ship, packets, and malware."
          role="img"
        />
        {status !== "running" && (
          <div className="packet-overlay">
            <p>
              {status === "ready"
                ? "SECURE THE CHANNEL"
                : status === "paused"
                  ? "CHANNEL PAUSED"
                  : status === "won"
                    ? "SIGNAL DELIVERED"
                    : "CONNECTION LOST"}
            </p>
            <h3>
              {status === "ready"
                ? "One signal. Three lanes."
                : status === "paused"
                  ? "Ready when you are."
                  : status === "won"
                    ? "You made it home."
                    : "Another route awaits."}
            </h3>
            <button onClick={status === "paused" ? resume : start}>
              {status === "ready"
                ? "Start run →"
                : status === "paused"
                  ? "Resume run →"
                  : "Run again ↺"}
            </button>
          </div>
        )}
      </div>
      <div className="packet-controls">
        <button
          onClick={() => steer(-1)}
          aria-label="Steer left"
          disabled={status !== "running"}
        >
          ← <span>Left</span>
        </button>
        <button
          onClick={
            status === "running" ? pause : status === "paused" ? resume : start
          }
        >
          {status === "running"
            ? "Pause"
            : status === "paused"
              ? "Resume"
              : "Start"}
        </button>
        <button
          onClick={() => steer(1)}
          aria-label="Steer right"
          disabled={status !== "running"}
        >
          <span>Right</span> →
        </button>
      </div>
      <p className="packet-help">
        ← → or A / D to steer · Space to pause · On phones, swipe or use the
        buttons.
      </p>
      <p className="sr-only" role="status">
        {status === "won"
          ? `Signal delivered. Score ${score}.`
          : status === "lost"
            ? `Run ended. Score ${score}.`
            : status === "paused"
              ? "Game paused."
              : ""}
      </p>
    </div>
  );
}
