import { useEffect } from "react";

// Native page scrolling; bounded transform/opacity animations replay after a block leaves view.
export default function useScrollStory(root, enabled) {
  useEffect(() => {
    const host = root.current;
    if (!host || !enabled || !("IntersectionObserver" in window) || !("animate" in Element.prototype)) return;
    const selector = [
      ".proof-strip > div", ".scroll-section > .chapter-label", ".chapter-heading",
      ".research-file > :not(.file-rule)", ".experience-file > *",
      ".about-file", ".recognition-file > *", ".stack-file > p", ".stack-file > h2",
      ".stack-file dl > div", ".project-story", ".play-chapter > :not(.chapter-label)", ".contact-file",
    ].join(",");
    const states = [...host.querySelectorAll(selector)].map((element,index) => ({
      element, direction: index % 2 ? 1 : -1, animations: new Set(), runs: 0,
    }));
    const stateByElement = new Map(states.map(state => [state.element,state]));
    host.setAttribute("data-scroll-motion","active");

    const cancel = state => {
      state.animations.forEach(animation => animation.cancel());
      state.animations.clear();
    };
    const show = state => {
      cancel(state);
      state.element.style.opacity = "";
      state.element.dataset.story = "visible";
    };
    const arm = state => {
      if (state.element.contains(document.activeElement)) return;
      cancel(state);
      state.element.style.opacity = "0";
      state.element.dataset.story = "waiting";
    };
    const play = state => {
      if (state.element.dataset.story !== "waiting") return;
      const { element, direction } = state;
      cancel(state);
      element.style.opacity = "";
      element.dataset.story = "entering";
      element.dataset.storyRuns = String(++state.runs);
      const distance = Math.min(160,Math.max(58,innerWidth * .16));
      const motion = element.animate([
        { opacity:0, transform:`translate3d(${direction * distance}px, 18px, 0)` },
        { opacity:1, transform:"translate3d(0,0,0)" },
      ], { duration:1050, easing:"cubic-bezier(.22,.75,.2,1)", fill:"backwards" });
      state.animations.add(motion);
      motion.onfinish = () => { state.animations.delete(motion); element.dataset.story = "visible"; };

      let children = [];
      if (element.matches(".project-story")) children = [...element.querySelectorAll(".project-story-heading,.project-media,.project-illustration-stage,.project-story-copy > *")];
      else if (element.matches(".about-file")) children = [...element.querySelectorAll("figure,.about-file > div > *")];
      else if (element.matches(".research-intro,.contact-file,.chapter-heading")) children = [...element.children];
      else if (element.matches(".stack-file dl > div")) children = [...element.querySelectorAll("dt,.toolkit-items > li")];
      else if (element.matches(".experience-row")) children = [...element.querySelectorAll(".experience-date,.experience-heading > *,.experience-body > *")];
      else if (element.matches(".milestone-row")) children = [...element.querySelectorAll(".milestone-meta,.milestone-copy > *")];
      children.filter(child => child.getBoundingClientRect().height > 0).slice(0,9).forEach((child,index) => {
        const stagger = child.animate([
          { opacity:0, transform:"translate3d(0,20px,0)" },
          { opacity:1, transform:"translate3d(0,0,0)" },
        ], { duration:720, delay:80 + index * 65, easing:"cubic-bezier(.22,.75,.2,1)", fill:"backwards" });
        state.animations.add(stagger);
        stagger.onfinish = () => state.animations.delete(stagger);
      });
    };

    states.forEach(state => {
      state.element.dataset.storyDirection = state.direction < 0 ? "left" : "right";
      arm(state);
    });
    const entrance = new IntersectionObserver(entries => {
      entries.forEach(({target,isIntersecting}) => { if (isIntersecting) play(stateByElement.get(target)); });
    }, { threshold:0, rootMargin:"0px 0px -11% 0px" });
    // A separate, larger boundary prevents flickering at the entrance threshold.
    const departure = new IntersectionObserver(entries => {
      entries.forEach(({target,isIntersecting}) => { if (!isIntersecting) arm(stateByElement.get(target)); });
    }, { threshold:0, rootMargin:"120px 0px 120px 0px" });
    states.forEach(({element}) => { entrance.observe(element); departure.observe(element); });
    const onFocus = event => {
      const element = event.target.closest("[data-story]");
      const state = stateByElement.get(element);
      if (state) show(state);
    };
    host.addEventListener("focusin",onFocus);
    let frame = 0;
    const updateProgress = () => {
      frame = 0;
      const travel = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      host.style.setProperty("--reading-progress",String(Math.min(1,scrollY / travel)));
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(updateProgress); };
    window.addEventListener("scroll",onScroll,{passive:true});
    updateProgress();
    return () => {
      entrance.disconnect(); departure.disconnect();
      host.removeEventListener("focusin",onFocus);
      window.removeEventListener("scroll",onScroll);
      cancelAnimationFrame(frame);
      states.forEach(state => {
        cancel(state);
        state.element.style.opacity = "";
        delete state.element.dataset.story;
        delete state.element.dataset.storyDirection;
        delete state.element.dataset.storyRuns;
      });
      host.removeAttribute("data-scroll-motion");
      host.style.removeProperty("--reading-progress");
    };
  }, [root,enabled]);
}
