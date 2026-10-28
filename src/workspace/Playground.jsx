import { useState } from "react";
import QuantumRelay from "./QuantumRelay";
import PacketRun from "./PacketRun";
import "./playground.css";
export default function Playground({ onState, onSound, active, motion }) {
  const [game, setGame] = useState("quantum");
  const navigate = (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next =
      event.key === "Home"
        ? "quantum"
        : event.key === "End"
          ? "packet"
          : game === "quantum"
            ? "packet"
            : "quantum";
    setGame(next);
    event.currentTarget
      .querySelector(next === "packet" ? "#tab-packet" : "#tab-relay")
      ?.focus();
  };
  return (
    <div className="playground">
      <div
        className="play-tabs"
        role="tablist"
        aria-label="Choose a game"
        onKeyDown={navigate}
      >
        <button
          id="tab-relay"
          role="tab"
          aria-selected={game === "quantum"}
          aria-controls="panel-relay"
          tabIndex={game === "quantum" ? 0 : -1}
          onClick={() => setGame("quantum")}
        >
          01 / Quantum Relay
        </button>
        <button
          id="tab-packet"
          role="tab"
          aria-selected={game === "packet"}
          aria-controls="panel-packet"
          tabIndex={game === "packet" ? 0 : -1}
          onClick={() => setGame("packet")}
        >
          02 / Packet Run
        </button>
      </div>
      <div
        id="panel-relay"
        role="tabpanel"
        aria-labelledby="tab-relay"
        hidden={game !== "quantum"}
      >
        <QuantumRelay onState={onState} onSound={onSound} />
      </div>
      <div
        id="panel-packet"
        role="tabpanel"
        aria-labelledby="tab-packet"
        hidden={game !== "packet"}
      >
        <PacketRun
          active={active && game === "packet"}
          motion={motion}
          onSound={onSound}
        />
      </div>
    </div>
  );
}
