import { useEffect, useState } from "react";
import { applyGate, probabilities } from "../lib/qubit";
import { MISSIONS, fidelity } from "../lib/relay";
export default function QuantumRelay({ onState, onSound }) {
  useEffect(() => {
    onState(MISSIONS[0].initial);
  }, [onState]);
  const [level, setLevel] = useState(0),
    [state, setState] = useState(MISSIONS[0].initial),
    [gates, setGates] = useState([]),
    [message, setMessage] = useState("Use a gate, then transmit your state."),
    [solved, setSolved] = useState(false);
  const mission = MISSIONS[level],
    probs = probabilities(state);
  const gate = (value) => {
    if (solved || gates.length >= 8) return;
    const next = applyGate(state, value);
    setState(next);
    setGates((previous) => [...previous, value]);
    onState(next);
    onSound("gate");
    setMessage(
      gates.length + 1 > mission.budget
        ? "Over the gate budget. Reset and try a shorter route."
        : "State updated. Transmit when you’re ready.",
    );
  };
  const reset = () => {
    setState(mission.initial);
    setGates([]);
    setSolved(false);
    setMessage("Circuit reset. Try another route.");
    onState(mission.initial);
  };
  const transmit = () => {
    if (gates.length > mission.budget) {
      setMessage("Too many gates. Reset to try again.");
      return;
    }
    if (fidelity(state, mission.target) > 1 - 1e-9) {
      setSolved(true);
      setMessage(
        level === MISSIONS.length - 1
          ? "All five signals delivered. Nice work."
          : "Signal delivered. Target state matched.",
      );
      onSound("win");
    } else
      setMessage("The signal missed its target. Try another gate or reset.");
  };
  const next = () => {
    const index = (level + 1) % MISSIONS.length;
    setLevel(index);
    setState(MISSIONS[index].initial);
    onState(MISSIONS[index].initial);
    setGates([]);
    setSolved(false);
    setMessage("Use a gate, then transmit your state.");
  };
  return (
    <div
      className="quantum-game"
      onKeyDown={(event) => {
        if (["h", "x", "z"].includes(event.key.toLowerCase())) {
          event.preventDefault();
          gate(event.key.toUpperCase());
        }
      }}
    >
      <div className="game-top">
        <span>QUANTUM RELAY</span>
        <span>
          MISSION {level + 1} / {MISSIONS.length}
        </span>
      </div>
      <h2>{mission.title}</h2>
      <p>{mission.description}</p>
      <div className="game-target">
        <span>Target</span>
        <strong>{mission.label}</strong>
        <span>
          {mission.budget} gate{mission.budget === 1 ? "" : "s"} maximum
        </span>
      </div>
      <div
        className="game-circuit"
        aria-label={`Applied gates: ${gates.length ? gates.join(", ") : "none"}`}
      >
        <span>ψ</span>
        <i />
        {gates.slice(-8).map((item, i) => (
          <b key={`${i}-${item}`}>{item}</b>
        ))}
        <span>→</span>
      </div>
      <div className="game-probabilities">
        {probs.map((prob, i) => (
          <div key={i}>
            <span>|{i}⟩</span>
            <span className="game-track">
              <span style={{ width: `${prob * 100}%` }} />
            </span>
            <span>{Math.round(prob * 100)}%</span>
          </div>
        ))}
      </div>
      <p className="game-state">
        |ψ⟩ = {Math.abs(state[0]) < 0.0001 ? "0" : state[0].toFixed(3)}|0⟩{" "}
        {state[1] < 0 ? "−" : "+"}{" "}
        {Math.abs(state[1]) < 0.0001 ? "0" : Math.abs(state[1]).toFixed(3)}|1⟩
      </p>
      <div className="game-controls">
        <button onClick={() => gate("H")} disabled={solved}>
          <strong>H</strong>
          <span>Superposition</span>
        </button>
        <button onClick={() => gate("X")} disabled={solved}>
          <strong>X</strong>
          <span>Bit flip</span>
        </button>
        <button onClick={() => gate("Z")} disabled={solved}>
          <strong>Z</strong>
          <span>Phase flip</span>
        </button>
      </div>
      <div className="game-actions">
        <button onClick={reset}>Reset ↺</button>
        {solved ? (
          <button className="transmit" onClick={next}>
            {level === MISSIONS.length - 1 ? "Play again" : "Next signal"} →
          </button>
        ) : (
          <button className="transmit" onClick={transmit}>
            Transmit →
          </button>
        )}
      </div>
      <p
        className={`game-message ${solved ? "game-success" : ""}`}
        role="status"
      >
        {message}
      </p>
      <details className="game-help">
        <summary>How do the gates work?</summary>
        <p>
          H creates or combines superposition. X swaps the amplitudes. Z flips
          the sign of |1⟩, changing phase without changing the probabilities.
          Try H → Z → H on |0⟩: interference turns it into |1⟩.
        </p>
        <p>
          Targets compare the complete state, including phase. This is a local
          mathematical simulation, not a quantum computer connection.
        </p>
      </details>
    </div>
  );
}
