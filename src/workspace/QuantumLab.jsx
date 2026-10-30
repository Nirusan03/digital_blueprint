import { useEffect, useMemo, useRef, useState } from "react";
import { featureMap, responsePath } from "../lib/quantumLab";
import "./quantum-lab.css";

const BASIS = ["00", "01", "10", "11"];
const TRACE = ["Ready to explore", "Encode the two inputs with Y rotations", "Apply the controlled-NOT connection", "Read the four measurement probabilities"];

function ResponseSurface({ x, y, coupled, onSelect }) {
  const canvas = useRef(null);
  useEffect(() => {
    const context = canvas.current?.getContext("2d");
    if (!context) return;
    // Fixed-size field, redrawn only when coupling changes. No idle render loop.
    const size = 128;
    const pixels = context.createImageData(size, size);
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const value = featureMap(col / (size - 1), 1 - row / (size - 1), coupled).readout;
        const offset = (row * size + col) * 4;
        const low = [31, 63, 91], high = [156, 222, 190];
        for (let channel = 0; channel < 3; channel++) pixels.data[offset + channel] = low[channel] + value * (high[channel] - low[channel]);
        pixels.data[offset + 3] = 255;
      }
    }
    context.putImageData(pixels, 0, 0);
  }, [coupled]);
  const select = event => {
    const rect = event.currentTarget.getBoundingClientRect();
    onSelect(Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)), Math.max(0, Math.min(1, 1 - (event.clientY - rect.top) / rect.height)));
  };
  return (
    <div className="quantum-surface-wrap">
      <div className="quantum-plot-heading"><h4 tabIndex={-1}>Quantum response surface</h4><span>P(q₁ = 1)</span></div>
      <div className="quantum-surface-axis"><span>1.0</span><span>FEATURE Y</span><span>0.0</span></div>
      <div className="quantum-surface" onPointerDown={select} aria-hidden="true">
        <canvas ref={canvas} width="128" height="128" />
        <svg viewBox="0 0 400 400" className="quantum-surface-grid">
          {[100, 200, 300].map(v => <path key={v} d={`M${v} 0V400 M0 ${v}H400`} />)}
          <path className="quantum-crosshair" d={`M${x * 400} 0V400 M0 ${(1 - y) * 400}H400`} />
          <circle className="quantum-cursor-halo" cx={x * 400} cy={(1 - y) * 400} r="18" />
          <circle className="quantum-cursor" cx={x * 400} cy={(1 - y) * 400} r="7" />
        </svg>
        <span className="surface-hint">Tap a point to change the inputs</span>
      </div>
      <div className="quantum-x-axis"><span>0.0</span><span>FEATURE X</span><span>1.0</span></div>
      <div className="quantum-gradient-key"><span>0%</span><i /><span>100%</span></div>
    </div>
  );
}

function Circuit({ x, y, coupled, phase }) {
  return (
    <svg className="quantum-circuit" viewBox="0 0 600 180" role="img" aria-label={`Two-qubit circuit. Y rotations ${(x * 2).toFixed(2)} pi and ${(y * 2).toFixed(2)} pi; controlled NOT ${coupled ? "enabled" : "disabled"}; computational basis readout.`}>
      <path className="circuit-wire" d="M75 55H560 M75 130H560" />
      <text x="4" y="63">q₀ |0⟩</text><text x="4" y="138">q₁ |0⟩</text>
      {[55,130].map((cy,i) => <g key={cy} className={phase === 1 ? "circuit-active" : ""}><rect className="circuit-gate" x="125" y={cy - 23} width="112" height="46" rx="5"/><text className="gate-label" x="181" y={cy + 8}>Ry(θ{i === 0 ? "₀" : "₁"})</text></g>)}
      <g className={`${coupled ? "" : "circuit-disabled"} ${phase === 2 ? "circuit-active" : ""}`}>
        <path className="circuit-cx" d="M335 55V130 M319 130H351 M335 114V146" /><circle className="circuit-control" cx="335" cy="55" r="7"/><circle className="circuit-target" cx="335" cy="130" r="21"/>
      </g>
      {[55,130].map(cy => <g key={cy} className={phase === 3 ? "circuit-active" : ""}><rect className="circuit-gate" x="445" y={cy - 23} width="65" height="46" rx="5"/><path className="circuit-meter" d={`M458 ${cy + 8}a19 19 0 0 1 39 0 M477 ${cy + 8}l12 -20`}/></g>)}
      {phase > 0 && <circle className="circuit-signal" cx={[0,110,290,545][phase]} cy="55" r="6" />}
    </svg>
  );
}

export default function QuantumLab({ motion = true }) {
  const [inputs, setInputs] = useState([0.18,0.12]);
  const [coupled, setCoupled] = useState(true);
  const [phase, setPhase] = useState(0);
  const [running, setRunning] = useState(false);
  const host = useRef(null);
  const sweepOrigin = useRef([.18,.12]);
  const stopSweep = useRef(() => {});
  const [sweep, setSweep] = useState(0);
  const [x,y] = inputs;
  const result = useMemo(() => featureMap(x,y,coupled), [x,y,coupled]);
  const curve = useMemo(() => responsePath(y,coupled), [y,coupled]);
  const tracing = running && phase < 3 && motion;
  useEffect(() => {
    if (!tracing) return;
    const timer = setTimeout(() => setPhase(phase + 1), 650);
    return () => clearTimeout(timer);
  }, [tracing,phase]);
  useEffect(() => {
    if (!tracing) return;
    const stop = () => setRunning(false);
    const observer = "IntersectionObserver" in window ? new IntersectionObserver(entries => { if (!entries[0].isIntersecting) stop(); }) : null;
    observer?.observe(host.current);
    const visibility = () => { if (document.hidden) stop(); };
    document.addEventListener("visibilitychange", visibility);
    return () => { observer?.disconnect(); document.removeEventListener("visibilitychange", visibility); };
  }, [tracing]);
  useEffect(() => {
    if (!sweep || !motion) return;
    let frame = 0, started = null, previous = -100;
    const [fromX,heldY] = sweepOrigin.current;
    const initialAngle = Math.acos(1 - 2 * fromX);
    const stop = () => { cancelAnimationFrame(frame); observer?.disconnect(); document.removeEventListener("visibilitychange", onVisibility); };
    const onVisibility = () => { if (document.hidden) stop(); };
    const observer = "IntersectionObserver" in window ? new IntersectionObserver(entries => { if (!entries[0].isIntersecting) stop(); }) : null;
    observer?.observe(host.current);
    document.addEventListener("visibilitychange", onVisibility);
    const tick = now => {
      started ??= now;
      const elapsed = now - started, progress = Math.min(1,elapsed / 4200);
      if (elapsed - previous >= 32 || progress === 1) {
        setInputs([progress === 1 ? fromX : (1-Math.cos(initialAngle + 2*Math.PI*progress))/2,heldY]);
        previous = elapsed;
      }
      if (progress < 1) frame = requestAnimationFrame(tick);
      else stop();
    };
    frame = requestAnimationFrame(tick);
    stopSweep.current = stop;
    return stop;
  }, [sweep,motion]);
  const changeInputs = (nextX,nextY) => { stopSweep.current(); setInputs([nextX,nextY]); setPhase(0); setRunning(false); };
  const trace = () => { stopSweep.current(); setPhase(motion ? 1 : 3); setRunning(motion); };
  const preset = (nextX,nextY,connected) => {
    setCoupled(connected);
    changeInputs(nextX,nextY);
    host.current.querySelector(".quantum-plot-heading h4")?.focus({preventScroll:true});
    host.current.querySelector(".quantum-lab-toolbar")?.scrollIntoView({behavior:motion ? "smooth" : "instant",block:"start"});
  };
  return (
    <section id="index-quantum-ml" ref={host} className="quantum-lab" aria-labelledby="quantum-lab-title">
      <div className="quantum-lab-intro"><span className="chapter-label">QUANTUM ML / INTERACTIVE EXPLORER</span><h3 id="quantum-lab-title">From features to quantum states.</h3><p>Move the inputs. Connect the qubits. See how the same data produces a different measurement.</p></div>
      <div className="quantum-lab-toolbar"><span>2 QUBITS <i /> 4 OUTCOMES</span><div className="quantum-toolbar-actions"><button className="quantum-sweep" disabled={!motion} title={motion ? "Animate one input sweep" : "Enable motion to animate a sweep"} onClick={() => { sweepOrigin.current = inputs; setSweep(current => current+1); setRunning(false); setPhase(0); }}>Sweep inputs <span aria-hidden="true">↗</span></button><button className="quantum-coupling" aria-pressed={coupled} onClick={() => { stopSweep.current(); setCoupled(!coupled); setPhase(0); setRunning(false); }}><i />Qubit coupling {coupled ? "on" : "off"}</button></div></div>
      <div className="quantum-lab-grid">
        <ResponseSurface x={x} y={y} coupled={coupled} onSelect={(a,b) => changeInputs(a,b)} />
        <div className="quantum-readout">
          <div className="quantum-plot-heading"><h4>Measurement probabilities</h4><span>|q₀q₁⟩</span></div>
          <div className="quantum-probabilities" role="img" aria-label={result.probabilities.map((p,i) => `${BASIS[i]}: ${(p*100).toFixed(1)} percent`).join(", ")}>
            {result.probabilities.map((value,i) => <div className="quantum-probability" key={BASIS[i]}><span>|{BASIS[i]}⟩</span><div><i style={{transform:`scaleX(${value})`}} /></div><strong>{(value * 100).toFixed(1)}<small>%</small></strong></div>)}
          </div>
          <div className="quantum-readout-value"><strong>{(result.readout * 100).toFixed(1)}<span>%</span></strong><p>Probability of reading<br /><b>q₁ = 1</b></p></div>
          <div className="quantum-concurrence"><span>Entanglement · concurrence</span><strong>{result.concurrence.toFixed(2)} <small>/ 1</small></strong></div>
          <p className="quantum-plain-explanation">{!coupled ? "The qubits are independent. Feature X can change the joint state, but only feature Y changes the second qubit’s readout." : result.concurrence < .001 ? "With these inputs, the state stays separable even with the connection on. Try the Bell state preset to create maximal entanglement." : "The connection lets feature X influence the second qubit’s readout. Change either input to explore their interaction."}</p>
        </div>
      </div>
      <div className="quantum-inputs">
        {[["x",x],["y",y]].map(([name,value],i) => <label key={name} htmlFor={`quantum-feature-${name}`}><span>Feature {name.toUpperCase()} <output>{value.toFixed(2)}</output></span><input id={`quantum-feature-${name}`} type="range" min="0" max="100" step="1" value={Math.round(value*100)} onChange={event => changeInputs(i ? x : Number(event.target.value)/100,i ? Number(event.target.value)/100 : y)} /><small>Encoding angle: {(value * 2).toFixed(2)}π</small></label>)}
      </div>
      <div className="quantum-response-line"><div className="quantum-plot-heading"><h4>Output probability as X changes</h4><span>Y HELD AT {y.toFixed(2)}</span></div><svg viewBox="0 0 520 184" role="img" aria-label="Probability response across feature X at the selected value of feature Y"><path className="response-grid" d="M40 30H480 M40 90H480 M40 150H480"/><text x="1" y="36">1.0</text><text x="10" y="96">.5</text><text x="18" y="156">0</text><path className="response-curve" d={curve}/><path className="response-cursor" d={`M${40+x*440} 25V150`} /><circle className="quantum-cursor" cx={40+x*440} cy={150-result.readout*120} r="5"/><text x="40" y="179">0</text><text x="480" y="179" textAnchor="end">1</text><text x="260" y="179" textAnchor="middle">FEATURE X</text></svg></div>
      <div className="quantum-circuit-heading"><h4>Trace the circuit</h4><button onClick={trace}>Replay signal <span aria-hidden="true">↗</span></button></div>
      <Circuit x={x} y={y} coupled={coupled} phase={Math.min(3,phase)} />
      <div className="quantum-trace-caption" aria-live="polite"><span>0{Math.min(3,phase)} / 03</span>{TRACE[Math.min(3,phase)]}</div>
      <div className="quantum-presets"><button onClick={() => preset(.25,0,true)}>Try a Bell state</button><button onClick={() => preset(0,0,false)}>Reset to |00⟩</button></div>
      <p className="quantum-lab-note">Two synthetic features and an exact two-qubit simulation. This illustration explains quantum encoding; the trained QuanNetDetect models and their published results are separate. RY rotations and a controlled-NOT gate follow <a href="https://quantum.cloud.ibm.com/docs/en/api/qiskit/qiskit.circuit.library.RYGate" target="_blank" rel="noopener noreferrer">standard gate definitions ↗</a>.</p>
    </section>
  );
}
