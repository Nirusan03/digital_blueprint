import Icon from "./Icons";
import { useRef } from "react";
import useProjectDepth from "./useProjectDepth";
import "./project-exhibit.css";
import "./project-media.css";

export default function ProjectMedia({ project }) {
  const depth = useRef(null);
  useProjectDepth(depth);
  const preview = project.preview;
  if (!preview) return null;
  const type = preview.kind === "app" ? "App Store" : preview.kind === "paper" ? "IEEE publication" : "Website";
  const host = new URL(preview.url).hostname.replace(/^www\./, "");
  return (
    <figure ref={depth} className={`project-media project-depth media-${preview.kind}`}>
      <a className="project-preview-stage" href={preview.url} target="_blank" rel="noopener noreferrer" aria-label={`Open ${project.title.trim()} ${type.toLowerCase()}`}>
        <div className="preview-depth-object">
        {preview.kind === "app" ? (
          <div className="preview-app-gallery">
            {(preview.screens || [{src:preview.src,alt:preview.alt}]).map(screen => <div className="preview-app-window" key={screen.src}><img src={screen.src} alt={screen.alt} width="600" height="1300" loading="lazy" /></div>)}
          </div>
        ) : (
          <div className={preview.kind === "paper" ? "preview-paper-sheet" : "preview-site-window"}>
            <img src={preview.src} alt={preview.alt} width={preview.kind === "paper" ? 1082 : 1280} height={preview.kind === "paper" ? 1400 : 720} loading="lazy" />
          </div>
        )}
        </div>
        <span className="preview-open" aria-hidden="true"><Icon name="external" size={18} /></span>
      </a>
      <figcaption><span>{preview.kind === "app" ? "BL360 ERP Go · interface details" : host}</span><span>{type} <Icon name="external" size={13} /></span></figcaption>
    </figure>
  );
}

export function ProjectIllustration({ project }) {
  const depth=useRef(null);
  useProjectDepth(depth);
  return <figure ref={depth} className="project-illustration-stage project-depth"><div className="preview-depth-object"><img className="project-story-image" src={project.image} alt={`${project.title.trim()} project illustration`} width="800" height="450" loading="lazy" /></div></figure>;
}
