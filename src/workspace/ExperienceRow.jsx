import { useEffect, useRef } from "react";

export default function ExperienceRow({ item, index, defaultOpen, motion }) {
  const row = useRef(null);
  const transition = useRef(null);
  const destination = useRef(Boolean(defaultOpen));

  useEffect(() => {
    const node = row.current;
    return () => {
      if (!transition.current) return;
      transition.current.cancel();
      transition.current = null;
      node.toggleAttribute("open",destination.current);
      node.style.removeProperty("overflow");
    };
  }, [motion]);

  const toggle = event => {
    const node = row.current;
    if (!node || !motion || document.documentElement.dataset.motion !== "on" || matchMedia("(prefers-reduced-motion: reduce)").matches || !node.animate) return;
    event.preventDefault();
    const opening = transition.current ? !destination.current : !node.open;
    const start = node.getBoundingClientRect().height;
    destination.current = opening;
    transition.current?.cancel();
    node.setAttribute("open", "");
    node.setAttribute("data-disclosure",opening ? "open" : "closed");
    const border = getComputedStyle(node);
    const closed = node.querySelector("summary").getBoundingClientRect().height + parseFloat(border.borderTopWidth) + parseFloat(border.borderBottomWidth);
    const end = opening ? node.getBoundingClientRect().height : closed;
    node.style.setProperty("overflow","hidden");
    const animation = node.animate([{height:`${start}px`},{height:`${end}px`}], {
      duration:Math.min(560,320 + Math.abs(end-start) * .35), easing:"cubic-bezier(.22,.7,.2,1)", fill:"both",
    });
    transition.current = animation;
    animation.onfinish = () => {
      if (transition.current !== animation) return;
      node.toggleAttribute("open",opening);
      node.style.removeProperty("overflow");
      transition.current = null;
      animation.cancel();
    };
  };

  return (
    <details ref={row} className="experience-row" data-career-tone={index % 3} open={defaultOpen || undefined} onToggle={event => {
      if (!transition.current) event.currentTarget.setAttribute("data-disclosure",event.currentTarget.open ? "open" : "closed");
    }}>
      <summary onClick={toggle}>
        <span className="experience-date">
          <span>{item.year}</span>
          <svg className="experience-trace" width="88" height="24" viewBox="0 0 88 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
            <path className="experience-trace-line" pathLength="1" d="M1 12h26l6-7 12 14 6-7h36" />
            <circle className="experience-node-ring" cx="68" cy="12" r="8" />
            <circle className="experience-node" cx="68" cy="12" r="3" fill="currentColor" stroke="none" />
          </svg>
        </span>
        <span className="experience-heading"><strong>{item.company}</strong><span>{item.role}</span></span>
        <span className="experience-toggle" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M5 12h14" /><path className="experience-toggle-stem" d="M12 5v14" /></svg>
        </span>
      </summary>
      <div className="experience-body">
        <ul className="experience-achievements">
          {item.description.map((line,i) => <li key={line} style={{'--entry-order':i}}>{line}</li>)}
        </ul>
        <ul className="experience-skills" aria-label="Technologies">
          {item.technologies.map((technology,i) => <li key={technology} style={{'--entry-order':i}}>{technology}</li>)}
        </ul>
      </div>
    </details>
  );
}
