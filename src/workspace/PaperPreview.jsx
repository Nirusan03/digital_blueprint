import { LINKS } from "./content";
import Icon from "./Icons";
import "./paper.css";

export default function PaperPreview() {
  return (
    <figure className="paper-preview ieee-preview">
      <figcaption>
        <div><strong>Inside the IEEE paper</strong><span>IEEE QCNC 2026 · First-page preview · 5-page publication</span></div>
        <a href={LINKS.paper} target="_blank" rel="noopener noreferrer">View on IEEE <Icon name="external" size={17} /></a>
      </figcaption>
      <a className="paper-page" href={LINKS.paper} target="_blank" rel="noopener noreferrer" aria-label="Read the QuanNetDetect IEEE QCNC 2026 publication">
        <img src="/research/ieee-qcnc-first-page.webp" alt="First page of QuanNetDetect: A Quantum Hybrid Deep Learning Framework for Encrypted TLS Malicious Traffic Detection, by Nirusan Hariharan and Guhanathan Poravi, IEEE QCNC 2026." width="1082" height="1400" loading="lazy" />
      </a>
      <p className="paper-note">First-page image preview. The complete paper is available through the IEEE publication link.</p>
    </figure>
  );
}
