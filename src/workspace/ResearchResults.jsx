import { useState } from "react";
import { LINKS } from "./content";

const experiments = [
  { name: "Binary traffic detection", dataset: "CIC-Darknet-2020", value: 99.95, detail: "QNN validation accuracy for malicious VPN/Tor traffic detection." },
  { name: "Multiclass DDoS classification", dataset: "CIC-DDoS-2019", value: 82.83, detail: "QNN validation accuracy across the evaluated DDoS classes." },
];
export default function ResearchResults() {
  const [selected, setSelected] = useState(0);
  const result = experiments[selected];
  return (
    <figure className="research-results">
      <figcaption><span className="chapter-label">FROM THE IEEE PAPER / TABLE II</span><h3>The published results.</h3><p>Select an experiment to inspect the reported result.</p></figcaption>
      <div className="result-selectors" role="group" aria-label="Research experiment">
        {experiments.map((item, index) => <button key={item.dataset} onClick={() => setSelected(index)} aria-pressed={index === selected}><span>{item.dataset}</span>{item.name}</button>)}
      </div>
      <div className="result-chart-layout">
        <div className="paper-column-chart" role="img" aria-label="Reported QNN validation accuracy. CIC-Darknet-2020: 99.95 percent. CIC-DDoS-2019: 82.83 percent. Both bars use a zero to one hundred percent scale.">
          <div className="paper-y-ticks" aria-hidden="true"><span>100</span><span>75</span><span>50</span><span>25</span><span>0</span></div>
          <div className="paper-plot" aria-hidden="true">{experiments.map((item,index) => <div key={item.dataset} data-selected={index === selected} style={{"--accuracy":`${item.value}%`}}><span>{item.value.toFixed(2)}%</span></div>)}</div>
          <div className="paper-x-labels" aria-hidden="true"><span>CIC-Darknet<br />2020 · binary</span><span>CIC-DDoS<br />2019 · multiclass</span></div>
        </div>
        <div className="result-display" aria-live="polite"><strong key={result.value}>{result.value.toFixed(2)}<span>%</span></strong><div><span>VALIDATION ACCURACY</span><p>{result.detail}</p></div></div>
      </div>
      <p className="result-context">Separate classification tasks and datasets. These results are not a like-for-like model comparison.</p>
      <a href={LINKS.paper} target="_blank" rel="noopener noreferrer">Source: IEEE QCNC 2026, Table II ↗</a>
    </figure>
  );
}
