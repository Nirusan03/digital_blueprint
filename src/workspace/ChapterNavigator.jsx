import { useEffect, useRef, useState } from "react";

const chapters = [
  {id:"portfolio-home",label:"Introduction"}, {id:"index-research",label:"Research"},
  {id:"index-experience",label:"Experience"}, {id:"index-about",label:"About"},
  {id:"index-recognition",label:"Milestones"}, {id:"index-toolkit",label:"Toolkit"},
  {id:"index-work",label:"Projects"}, {id:"index-play",label:"Play"}, {id:"index-contact",label:"Contact"},
];
const Chevron = ({back=false}) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={back ? "m14 6-6 6 6 6" : "m10 6 6 6-6 6"}/></svg>;

export default function ChapterNavigator({root}) {
  const [active,setActive]=useState(0),[open,setOpen]=useState(false);
  const dock=useRef(null),trigger=useRef(null),menu=useRef(null);
  useEffect(()=>{
    const host=root.current;
    if(!host || !("IntersectionObserver" in window)) return;
    const visible=new Set();
    const nodes=chapters.map((chapter,i)=>({node:i===0 ? host.querySelector('.portfolio-hero') : host.querySelector(`#${chapter.id}`),i})).filter(entry=>entry.node);
    const indices=new Map(nodes.map(({node,i})=>[node,i]));
    let observer,frame=0;
    const observe=()=>{
      observer?.disconnect();visible.clear();
      observer=new IntersectionObserver(entries=>{
        entries.forEach(({target,isIntersecting})=>{const i=indices.get(target);if(isIntersecting)visible.add(i);else visible.delete(i);});
        if(visible.size) setActive(previous=>{const next=Math.max(...visible);return previous===next ? previous : next;});
      },{rootMargin:`-${Math.round(innerHeight*.18)}px 0px -${Math.round(innerHeight*.7)}px 0px`,threshold:0});
      nodes.forEach(({node})=>observer.observe(node));
    };
    const resize=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(observe);};
    observe();window.addEventListener('resize',resize,{passive:true});
    return()=>{observer.disconnect();cancelAnimationFrame(frame);window.removeEventListener('resize',resize);};
  },[root]);
  useEffect(()=>{
    const links=root.current?.querySelectorAll('.portfolio-nav nav a') || [];
    links.forEach(link=>{if(link.hash===`#${chapters[active].id}`)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});
  },[active,root]);
  useEffect(()=>{
    if(!open) return;
    const outside=event=>{if(!dock.current?.contains(event.target))setOpen(false);};
    const escape=event=>{if(event.key==='Escape'){setOpen(false);trigger.current?.focus({preventScroll:true});}};
    const scroll=()=>setOpen(false);
    document.addEventListener('pointerdown',outside);document.addEventListener('keydown',escape);
    window.addEventListener('scroll',scroll,{passive:true});
    return()=>{document.removeEventListener('pointerdown',outside);document.removeEventListener('keydown',escape);window.removeEventListener('scroll',scroll);};
  },[open]);
  const previous=chapters[active-1],next=chapters[active+1];
  return <div className="chapter-navigation" ref={dock}>
    <nav className="chapter-rail" aria-label="Reading chapters">
      {chapters.map((chapter,i)=><a key={chapter.id} href={`#${chapter.id}`} aria-label={`${String(i).padStart(2,'0')} ${chapter.label}`} aria-current={active===i ? 'location' : undefined}><span aria-hidden="true">{String(i).padStart(2,'0')}</span><span className="chapter-rail-label" aria-hidden="true">{chapter.label}</span></a>)}
    </nav>
    <div className="chapter-dock">
      <a className="chapter-step" href={`#${previous?.id || 'portfolio-home'}`} aria-label="Previous section" aria-disabled={!previous} tabIndex={previous ? 0 : -1} onClick={event=>{if(!previous)event.preventDefault();}}><Chevron back/></a>
      <button ref={trigger} className="chapter-current" aria-expanded={open} aria-controls="chapter-menu" onClick={()=>setOpen(value=>!value)} onKeyDown={event=>{if(event.key==='ArrowDown'){event.preventDefault();setOpen(true);requestAnimationFrame(()=>menu.current?.querySelector('a')?.focus());}}}>
        <span className="chapter-current-number" aria-hidden="true">{String(active).padStart(2,'0')} / 08</span><span>{chapters[active].label}</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d={open ? 'm6 9 6 6 6-6' : 'm6 15 6-6 6 6'}/></svg>
      </button>
      <a className="chapter-step" href={`#${next?.id || 'portfolio-home'}`} aria-label={next ? 'Next section' : 'Back to top'}><Chevron/></a>
    </div>
    <nav ref={menu} id="chapter-menu" className="chapter-menu" aria-label="Choose a chapter" hidden={!open}>
      <p>EXPLORE THE PORTFOLIO</p>
      {chapters.map((chapter,i)=><a key={chapter.id} href={`#${chapter.id}`} aria-current={active===i ? 'location' : undefined} onClick={()=>setOpen(false)}><span>{String(i).padStart(2,'0')}</span>{chapter.label}<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg></a>)}
    </nav>
  </div>;
}
