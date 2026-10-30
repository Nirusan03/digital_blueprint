import { useEffect } from "react";
export default function useProjectDepth(ref) {
  useEffect(()=>{
    const node=ref.current;
    if(!node) return;
    let frame=0,x=0,y=0;
    const fine=matchMedia("(hover:hover) and (pointer:fine)");
    const reduced=matchMedia("(prefers-reduced-motion:reduce)");
    const update=()=>{frame=0;node.style.setProperty("--depth-x",`${x}deg`);node.style.setProperty("--depth-y",`${y}deg`);};
    const reset=()=>{cancelAnimationFrame(frame);frame=0;x=y=0;update();};
    const move=event=>{
      if(event.pointerType!=="mouse"||!fine.matches||reduced.matches||document.documentElement.dataset.motion!=="on") return;
      const bounds=node.getBoundingClientRect();
      x=-((event.clientY-bounds.top)/bounds.height-.5)*12;
      y=((event.clientX-bounds.left)/bounds.width-.5)*16;
      if(!frame) frame=requestAnimationFrame(update);
    };
    node.addEventListener("pointermove",move,{passive:true}); node.addEventListener("pointerleave",reset);
    const preference=new MutationObserver(reset);preference.observe(document.documentElement,{attributes:true,attributeFilter:["data-motion"]});
    reduced.addEventListener("change",reset);
    let observer;
    if(!node.closest(".scroll-portfolio")&&"IntersectionObserver" in window) {
      observer=new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting})=>target.setAttribute("data-exhibit",isIntersecting ? "visible" : "idle")),{threshold:.1});observer.observe(node);
    }
    return()=>{cancelAnimationFrame(frame);node.removeEventListener("pointermove",move);node.removeEventListener("pointerleave",reset);preference.disconnect();reduced.removeEventListener("change",reset);observer?.disconnect();};
  },[ref]);
}
