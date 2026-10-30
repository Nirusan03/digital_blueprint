import { useEffect, useRef } from "react";
// PC documents share the reading view's visual language without hiding content in JS.
export default function useFileChoreography(selector) {
  const root=useRef(null);
  useEffect(()=>{
    const host=root.current;
    if(!host || host.closest('.scroll-portfolio') || !('IntersectionObserver' in window)) return;
    const observer=new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting})=>target.setAttribute('data-file-reveal',isIntersecting ? 'visible' : 'idle')),{threshold:.08});
    const nodes=selector ? host.querySelectorAll(selector) : [host];
    nodes.forEach(node=>observer.observe(node));
    return()=>observer.disconnect();
  },[selector]);
  return root;
}
