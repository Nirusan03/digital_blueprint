import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import SceneBoundary from "./SceneBoundary";
const Sculpture = lazy(()=>import("./ProjectSculpture"));
export default function ProjectArchiveArt({ motion }) {
  const host=useRef(null);
  const [mounted,setMounted]=useState(()=>!("IntersectionObserver" in window)),[ready,setReady]=useState(false),[failed,setFailed]=useState(false),[replay,setReplay]=useState(0);
  const loaded=useCallback(()=>setReady(true),[]);
  const failure=useCallback(()=>setFailed(true),[]);
  useEffect(()=>{
    if(!("IntersectionObserver" in window)) return;
    const observer=new IntersectionObserver(([entry])=>{if(entry.isIntersecting){setMounted(true);observer.disconnect();}},{rootMargin:"250px"});
    observer.observe(host.current); return()=>observer.disconnect();
  },[]);
  const replayAssembly=()=>{
    const bounds=host.current.getBoundingClientRect();
    if(bounds.top<85 || bounds.bottom>innerHeight-20) host.current.scrollIntoView({block:"center",behavior:motion ? "smooth" : "instant"});
    setReplay(value=>value+1);
  };
  return <figure ref={host} className={`archive-sculpture ${ready&&!failed ? "sculpture-ready" : ""}`}>
    <div className="archive-sculpture-stage">
      {(!ready||failed)&&<svg className="sculpture-fallback" viewBox="0 0 360 280" role="img" aria-label="Circuit sculpture illustration"><g fill="none" stroke="currentColor" strokeWidth="1.3"><path d="m60 150 120-65 120 65-120 65ZM60 150v35l120 65 120-65v-35M105 126v-60l75-40 75 40v60M105 66l75 40 75-40M180 106v80"/><ellipse cx="180" cy="126" rx="80" ry="28"/><ellipse cx="180" cy="126" rx="28" ry="80" transform="rotate(-35 180 126)"/><circle cx="180" cy="126" r="8" fill="currentColor"/></g></svg>}
      {mounted&&!failed&&<SceneBoundary onFailure={failure}><Suspense fallback={null}><Sculpture motion={motion} replay={replay} onReady={loaded} onFailure={failure}/></Suspense></SceneBoundary>}
    </div>
    <figcaption><span>CIRCUIT SCULPTURE</span><button onClick={replayAssembly} disabled={!motion||!ready||failed}>Replay assembly <span aria-hidden="true">↻</span></button></figcaption>
  </figure>;
}
