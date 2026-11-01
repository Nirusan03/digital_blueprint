import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";
import heroBox from "./heroBox";

gsap.registerPlugin(ScrollTrigger, SplitText);
ScrollTrigger.config({ ignoreMobileResize: true });

const OUT = "expo.out";

function intro(host) {
  SplitText.create(host.querySelectorAll(".film-name span"), {
    type: "chars",
    mask: "chars",
    aria: "none",
    onSplit: (self) => gsap.from(self.chars, { yPercent: 118, duration: 1.3, ease: OUT, stagger: 0.024, delay: 0.25 }),
  });
  gsap.from(host.querySelectorAll(".film-lede > *"), { y: 22, autoAlpha: 0, duration: 1.1, ease: OUT, stagger: 0.1, delay: 0.9 });
  gsap.from(host.querySelectorAll(".film-portrait, .film-now li"), { y: 26, autoAlpha: 0, duration: 1, ease: OUT, stagger: 0.07, delay: 1.05 });
  gsap.from(".nav-bar > *", { y: -18, autoAlpha: 0, duration: 0.9, ease: OUT, stagger: 0.07, delay: 0.7 });
}

// Everything in the film is a pure function of scroll progress, so it can never drift or stick.
const BEATS = [[0.2, 0.15], [0.45, 0.14], [0.68, 0.13]];
// Fade in over a..b, out over c..d.
const STILLS = [[-1, -0.5, 0.15, 0.2], [0.17, 0.22, 0.37, 0.42], [0.42, 0.47, 0.61, 0.66], [0.65, 0.7, 0.83, 0.88], [0.85, 0.9, 2, 3]];
const span = (p, a, b) => Math.min(1, Math.max(0, (p - a) / (b - a)));
const easeOut = (t) => 1 - (1 - t) ** 3;
const easeIn = (t) => t ** 3;

function film(host, progress) {
  const [first, last] = host.querySelectorAll(".film-name span");
  const lede = host.querySelector(".film-lede");
  const card = host.querySelector(".film-card");
  const flash = host.querySelector(".film-flash");
  const stage = host.querySelector(".film-stage");
  const beats = [...host.querySelectorAll(".film-beat")];
  const stills = [...host.querySelectorAll(".film-still")];
  const scrims = { left: host.querySelector('.film-scrim[data-side="left"]'), right: host.querySelector('.film-scrim[data-side="right"]') };
  // Touch the DOM only when a value changes: most of these elements are idle most of the time.
  const known = new Map();
  const show = (element, opacity, transform = "") => {
    const value = Math.round(opacity * 500) / 500;
    const previous = known.get(element);
    if (previous && previous[0] === value && previous[1] === transform) return;
    if (previous?.[0] !== value) {
      element.style.opacity = value;
      element.style.visibility = value > 0 ? "visible" : "hidden";
    }
    if (transform !== (previous?.[1] ?? "")) element.style.transform = transform;
    known.set(element, [value, transform]);
  };
  const update = (p) => {
    progress.current = p;
    const away = easeIn(span(p, 0.01, 0.12));
    show(first, 1 - away, `translate3d(${(-22 * away).toFixed(2)}%,0,0)`);
    show(last, 1 - away, `translate3d(${(22 * away).toFixed(2)}%,0,0)`);
    const lift = span(p, 0.01, 0.07);
    show(lede, 1 - lift, `translate3d(0,${(-40 * lift).toFixed(1)}px,0)`);
    show(card, 1 - lift, `translate3d(0,${(-40 * lift).toFixed(1)}px,0)`);
    const veil = { left: 0, right: 0 };
    beats.forEach((beat, index) => {
      const [start, hold] = BEATS[index];
      [...beat.children].forEach((child, i) => {
        const enter = easeOut(span(p, start + i * 0.012, start + i * 0.012 + 0.045));
        const leave = easeIn(span(p, start + hold + i * 0.006, start + hold + i * 0.006 + 0.035));
        show(child, enter * (1 - leave), `translate3d(0,${(56 * (1 - enter) - 44 * leave).toFixed(1)}px,0)`);
      });
      const side = beat.dataset.side;
      veil[side] = Math.max(veil[side], span(p, start - 0.01, start + 0.03) * (1 - span(p, start + hold + 0.01, start + hold + 0.05)));
    });
    show(scrims.left, veil.left);
    show(scrims.right, veil.right);
    show(flash, span(p, 0.94, 1) ** 2);
    if (stage.dataset.scene !== "canvas") {
      stills.forEach((still, i) => {
        const [a, b, c, d] = STILLS[i];
        show(still, span(p, a, b) * (1 - span(p, c, d)), `scale(${(1 + 0.05 * span(p, Math.max(a, 0), Math.min(d, 1))).toFixed(4)})`);
      });
    }
  };
  update(0);
  ScrollTrigger.create({
    trigger: host.querySelector(".film"), start: "top top", end: "bottom bottom",
    onUpdate: (self) => update(self.progress),
    onRefresh: (self) => update(self.progress),
  });
  return () => [first, last, lede, card, flash, scrims.left, scrims.right, ...stills.slice(1), ...beats.flatMap((beat) => [...beat.children])]
    .forEach((element) => element.removeAttribute("style"));
}

function revealLines(host) {
  host.querySelectorAll("[data-lines]").forEach((element) => {
    SplitText.create(element, {
      type: "lines",
      mask: "lines",
      autoSplit: true,
      aria: "auto",
      onSplit: (self) => {
        // Room for descenders, which the line masks would otherwise cut off.
        gsap.set(self.masks, { paddingBottom: "0.16em", marginBottom: "-0.16em" });
        return gsap.from(self.lines, {
        yPercent: 112, duration: 1.1, ease: OUT, stagger: 0.08,
        scrollTrigger: { trigger: element, start: "top 88%", once: true },
        });
      },
    });
  });
}

function rise(element) {
  gsap.from(element, {
    y: 36, autoAlpha: 0, duration: 0.9, ease: OUT,
    scrollTrigger: { trigger: element, start: "top 92%", once: true },
  });
}

function fillWords(host, low) {
  host.querySelectorAll("[data-fill]").forEach((element) => {
    if (low) return rise(element);
    const split = SplitText.create(element, { type: "words", aria: "auto" });
    gsap.fromTo(split.words, { opacity: 0.14 }, {
      opacity: 1, ease: "none", stagger: 0.05,
      scrollTrigger: { trigger: element, start: "top 78%", end: "bottom 52%", scrub: 0.4 },
    });
  });
}

function reveals(host, low) {
  host.querySelectorAll("[data-rise]").forEach(rise);
  host.querySelectorAll("[data-clip]").forEach((element) => {
    if (low) return rise(element);
    const inner = element.querySelector("img");
    const timeline = gsap.timeline({ scrollTrigger: { trigger: element, start: "top 85%", once: true } });
    timeline.fromTo(element, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "expo.inOut", clearProps: "clipPath" });
    if (inner) timeline.fromTo(inner, { scale: 1.2 }, { scale: 1, duration: 1.7, ease: OUT }, 0);
  });
  if (!low) host.querySelectorAll("[data-parallax]").forEach((element) => {
    gsap.fromTo(element, { yPercent: -Number(element.dataset.parallax) }, {
      yPercent: Number(element.dataset.parallax), ease: "none",
      scrollTrigger: { trigger: element.parentElement, start: "top bottom", end: "bottom top", scrub: true },
    });
  });
  // The title opens out sideways. A transform costs nothing per frame; animating the font's width axis re-lays out the text.
  host.querySelectorAll("[data-kinetic]").forEach((element) => {
    const pinned = element.closest(".rail");
    gsap.fromTo(element, { scaleX: 0.72 }, {
      scaleX: 1, transformOrigin: "0 50%", ease: pinned ? OUT : "none", duration: pinned ? 1.4 : undefined,
      scrollTrigger: pinned
        ? { trigger: pinned, start: "top 70%", once: true }
        : { trigger: element, start: "top 95%", end: "top 35%", scrub: true },
    });
  });
  if (!low) host.querySelectorAll("[data-count]").forEach((element) => {
    const value = Number(element.dataset.count);
    const counter = { value: 0 };
    let text = "";
    gsap.to(counter, {
      value, duration: 1.8, ease: "expo.out",
      scrollTrigger: { trigger: element, start: "top 85%", once: true },
      onUpdate: () => {
        const next = counter.value.toFixed(2);
        if (next !== text) element.textContent = text = next;
      },
    });
  });
  host.querySelectorAll("[data-meter]").forEach((element) => {
    gsap.from(element, {
      scaleX: 0, duration: 1.8, ease: "expo.out",
      scrollTrigger: { trigger: element, start: "top 88%", once: true },
    });
  });
  const paper = host.querySelector(".paper-sheet");
  if (paper && !low) gsap.fromTo(paper, { rotateX: 24, rotateY: -16, rotateZ: 4, scale: 0.86, y: 60 }, {
    rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1, y: 0, ease: "none",
    scrollTrigger: { trigger: paper.parentElement, start: "top 90%", end: "top 20%", scrub: true },
  });
  host.querySelectorAll(".role").forEach((role) => {
    ScrollTrigger.create({ trigger: role, start: "top 62%", end: "bottom 38%", toggleClass: "is-current" });
  });
  host.querySelectorAll(".mark").forEach((mark) => {
    gsap.from(mark.querySelectorAll("dt, li"), {
      y: 26, autoAlpha: 0, duration: 0.8, ease: OUT, stagger: 0.035,
      scrollTrigger: { trigger: mark, start: "top 90%", once: true },
    });
  });
}

// Desktop only. Phones keep the same panels in a plain vertical stack.
function rail(host, low) {
  const section = host.querySelector(".rail");
  const track = host.querySelector(".rail-track");
  if (!section || !track) return null;
  const media = gsap.matchMedia();
  media.add("(min-width: 901px) and (min-height: 560px) and (min-aspect-ratio: 1/1)", () => {
    section.dataset.rail = "on";
    const distance = () => Math.max(0, track.scrollWidth - innerWidth);
    const size = () => { section.style.height = `${distance() + innerHeight}px`; };
    size();
    ScrollTrigger.addEventListener("refreshInit", size);
    const travel = gsap.to(track, {
      x: () => -distance(), ease: "none",
      scrollTrigger: { trigger: section, start: "top top", end: "bottom bottom", scrub: true, invalidateOnRefresh: true },
    });
    track.querySelectorAll(".panel").forEach((panel) => {
      const picture = panel.querySelector(".panel-picture");
      if (picture && !low) gsap.fromTo(picture, { xPercent: 7 }, {
        xPercent: -4, ease: "none",
        scrollTrigger: { trigger: panel, containerAnimation: travel, start: "left right", end: "right left", scrub: true },
      });
    });
    return () => {
      ScrollTrigger.removeEventListener("refreshInit", size);
      section.style.height = "";
      delete section.dataset.rail;
    };
  });
  return media;
}

function cursor(host) {
  const dot = host.querySelector(".cursor");
  if (!dot || !matchMedia("(hover: hover) and (pointer: fine)").matches) return () => {};
  const x = gsap.quickTo(dot, "x", { duration: 0.35, ease: "power3" });
  const y = gsap.quickTo(dot, "y", { duration: 0.35, ease: "power3" });
  const label = dot.querySelector("span");
  const move = (event) => {
    x(event.clientX);
    y(event.clientY);
    const target = event.target.closest?.("[data-cursor]");
    const next = target?.dataset.cursor || "";
    if (dot.dataset.label !== next) {
      dot.dataset.label = next;
      if (next) label.textContent = next;
      gsap.to(dot, { scale: next ? 1 : 0, autoAlpha: next ? 1 : 0, duration: 0.45, ease: OUT });
    }
  };
  gsap.set(dot, { scale: 0, autoAlpha: 0, xPercent: -50, yPercent: -50 });
  window.addEventListener("pointermove", move, { passive: true });
  return () => window.removeEventListener("pointermove", move);
}

// A preview that follows the pointer over rows that have one.
function peek(host) {
  const box = host.querySelector(".peek");
  if (!box || !matchMedia("(hover: hover) and (pointer: fine)").matches) return () => {};
  const image = box.querySelector("img");
  const x = gsap.quickTo(box, "x", { duration: 0.5, ease: "power3" });
  const y = gsap.quickTo(box, "y", { duration: 0.5, ease: "power3" });
  let current = null, pointerX = -1, pointerY = -1, queued = 0;
  gsap.set(box, { autoAlpha: 0, scale: 0.9 });
  const place = (target) => {
    const row = target?.closest?.("[data-peek]");
    const source = row && row.dataset.open !== "true" ? row.dataset.peek : null;
    if (source !== current) {
      current = source;
      if (source) image.src = source;
      gsap.to(box, { autoAlpha: source ? 1 : 0, scale: source ? 1 : 0.9, duration: 0.3, ease: "power3.out", overwrite: "auto" });
    }
    if (!current) return;
    x(Math.min(pointerX + 28, innerWidth - box.offsetWidth - 20));
    y(Math.max(20, Math.min(pointerY - box.offsetHeight / 2, innerHeight - box.offsetHeight - 20)));
  };
  const move = (event) => { pointerX = event.clientX; pointerY = event.clientY; place(event.target); };
  // The page can scroll out from under a still pointer. Hit-testing is only needed while a preview is up.
  const scrolled = () => {
    if (!current || queued) return;
    queued = requestAnimationFrame(() => { queued = 0; place(document.elementFromPoint(pointerX, pointerY)); });
  };
  window.addEventListener("pointermove", move, { passive: true });
  window.addEventListener("scroll", scrolled, { passive: true });
  return () => {
    cancelAnimationFrame(queued);
    window.removeEventListener("pointermove", move);
    window.removeEventListener("scroll", scrolled);
  };
}

export default function useChoreography(root, motion, progress, level) {
  const lenis = useRef(null);
  useEffect(() => {
    const host = root.current;
    if (!host) return;
    // Only the no-WebGL fallback tier skips animation. Phones get all of it.
    const low = level === "still";
    const nav = host.querySelector(".nav-bar");
    const bar = host.querySelector(".progress");
    let smooth = null, tickerCallback = null, removeCursor = () => {}, removePeek = () => {}, media = null, resetFilm = () => {};
    const context = gsap.context(() => {
      // The nav takes its colour from whichever section is under it.
      host.querySelectorAll("section[data-tone], footer[data-tone]").forEach((section) => {
        ScrollTrigger.create({
          trigger: section, start: "top 40px", end: "bottom 40px",
          onToggle: (self) => { if (self.isActive) nav.dataset.tone = section.dataset.tone; },
        });
      });
      if (!motion) return;
      intro(host);
      resetFilm = film(host, progress);
      revealLines(host);
      fillWords(host, low);
      reveals(host, low);
      media = rail(host, low);
    }, host);
    if (motion) {
      removeCursor = cursor(host);
      removePeek = peek(host);
      if (level === "high" && matchMedia("(hover: hover) and (pointer: fine)").matches) {
        smooth = new Lenis({ lerp: 0.1, wheelMultiplier: 0.95 });
        smooth.on("scroll", ScrollTrigger.update);
        tickerCallback = (time) => smooth.raf(time * 1000);
        gsap.ticker.add(tickerCallback);
        gsap.ticker.lagSmoothing(0);
        lenis.current = smooth;
      }
    }
    // Scroll work runs at most once a frame, and writes only what changed.
    // The hero still sits in the free space, exactly where the 3D bench would.
    const view = host.querySelector(".film-view");
    const heroStill = host.querySelector(".film-still-hero");
    const frameStill = () => {
      const box = heroBox(view);
      heroStill.style.cssText += `;left:${box.left}px;top:${box.top}px;width:${box.width}px;height:${box.height}px`;
    };
    frameStill();
    document.fonts?.ready.then(frameStill);
    const framing = new ResizeObserver(frameStill);
    framing.observe(view);
    let lastY = 0, hidden = false, queued = 0, travel = 1;
    const measure = () => { travel = Math.max(1, document.documentElement.scrollHeight - innerHeight); };
    measure();
    ScrollTrigger.addEventListener("refresh", measure);
    const steer = () => {
      queued = 0;
      const y = scrollY;
      if (bar) bar.style.transform = `scaleX(${(y / travel).toFixed(4)})`;
      const hide = y > lastY && y > innerHeight * 0.6;
      if (hide !== hidden && Math.abs(y - lastY) > 2) { hidden = hide; nav.dataset.hidden = String(hide); }
      lastY = y;
    };
    const onScroll = () => { if (!queued) queued = requestAnimationFrame(steer); };
    window.addEventListener("scroll", onScroll, { passive: true });
    const jump = (event) => {
      const link = event.target.closest?.('a[href^="#index-"],a[href="#portfolio-home"]');
      if (!link) return;
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      event.preventDefault();
      history.pushState(null, "", link.getAttribute("href"));
      if (smooth) smooth.scrollTo(target, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) });
      else target.scrollIntoView({ behavior: motion ? "smooth" : "instant" });
    };
    host.addEventListener("click", jump);
    const settle = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(settle);
    window.addEventListener("load", settle);
    if (location.hash.startsWith("#index-"))
      requestAnimationFrame(() => document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: "instant" }));
    return () => {
      cancelAnimationFrame(queued);
      framing.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("load", settle);
      ScrollTrigger.removeEventListener("refresh", measure);
      host.removeEventListener("click", jump);
      removeCursor();
      removePeek();
      if (tickerCallback) gsap.ticker.remove(tickerCallback);
      smooth?.destroy();
      lenis.current = null;
      media?.revert();
      context.revert();
      resetFilm();
    };
  }, [root, motion, progress, level]);
  return lenis;
}
