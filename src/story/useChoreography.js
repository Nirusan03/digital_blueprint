import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, SplitText);

const OUT = "expo.out";

function intro(host) {
  const name = host.querySelectorAll(".film-name span");
  SplitText.create(name, {
    type: "chars",
    mask: "chars",
    aria: "none",
    onSplit: (self) => gsap.from(self.chars, { yPercent: 118, duration: 1.5, ease: OUT, stagger: 0.028, delay: 0.5 }),
  });
  gsap.from(host.querySelectorAll(".film-lede > *"), { y: 22, autoAlpha: 0, duration: 1.2, ease: OUT, stagger: 0.1, delay: 1.5 });
  gsap.from(".nav-bar > *", { y: -18, autoAlpha: 0, duration: 1, ease: OUT, stagger: 0.07, delay: 1.2 });
}

// Everything in the film is a pure function of scroll progress, so it can never drift or stick.
const BEATS = [[0.2, 0.15], [0.45, 0.14], [0.68, 0.13]];
const span = (p, a, b) => Math.min(1, Math.max(0, (p - a) / (b - a)));
const easeOut = (t) => 1 - (1 - t) ** 3;
const easeIn = (t) => t ** 3;
const show = (element, opacity, transform) => {
  element.style.opacity = opacity;
  element.style.visibility = opacity > 0.001 ? "visible" : "hidden";
  if (transform !== undefined) element.style.transform = transform;
};

function film(host, progress) {
  const [first, last] = host.querySelectorAll(".film-name span");
  const lede = host.querySelector(".film-lede");
  const flash = host.querySelector(".film-flash");
  const beats = [...host.querySelectorAll(".film-beat")];
  const scrims = { left: host.querySelector('.film-scrim[data-side="left"]'), right: host.querySelector('.film-scrim[data-side="right"]') };
  const update = (p) => {
    progress.current = p;
    const away = easeIn(span(p, 0.01, 0.12));
    show(first, 1 - away, `translateX(${-22 * away}%)`);
    show(last, 1 - away, `translateX(${22 * away}%)`);
    const lift = span(p, 0.01, 0.07);
    show(lede, 1 - lift, `translateY(${-40 * lift}px)`);
    const veil = { left: 0, right: 0 };
    beats.forEach((beat, index) => {
      const [start, hold] = BEATS[index];
      [...beat.children].forEach((child, i) => {
        const enter = easeOut(span(p, start + i * 0.012, start + i * 0.012 + 0.045));
        const leave = easeIn(span(p, start + hold + i * 0.006, start + hold + i * 0.006 + 0.035));
        show(child, enter * (1 - leave), `translateY(${56 * (1 - enter) - 44 * leave}px)`);
      });
      const side = beat.dataset.side;
      veil[side] = Math.max(veil[side], span(p, start - 0.01, start + 0.03) * (1 - span(p, start + hold + 0.01, start + hold + 0.05)));
    });
    show(scrims.left, veil.left);
    show(scrims.right, veil.right);
    show(flash, span(p, 0.94, 1) ** 2);
  };
  update(0);
  ScrollTrigger.create({
    trigger: host.querySelector(".film"), start: "top top", end: "bottom bottom",
    onUpdate: (self) => update(self.progress),
    onRefresh: (self) => update(self.progress),
  });
  return () => [first, last, lede, flash, scrims.left, scrims.right, ...beats.flatMap((beat) => [...beat.children])]
    .forEach((element) => element.removeAttribute("style"));
}

function revealLines(host) {
  host.querySelectorAll("[data-lines]").forEach((element) => {
    SplitText.create(element, {
      type: "lines",
      mask: "lines",
      autoSplit: true,
      aria: "auto",
      onSplit: (self) => gsap.from(self.lines, {
        yPercent: 112, duration: 1.25, ease: OUT, stagger: 0.09,
        scrollTrigger: { trigger: element, start: "top 88%", once: true },
      }),
    });
  });
}

function fillWords(host) {
  host.querySelectorAll("[data-fill]").forEach((element) => {
    const split = SplitText.create(element, { type: "words", aria: "auto" });
    gsap.fromTo(split.words, { opacity: 0.14 }, {
      opacity: 1, ease: "none", stagger: 0.05,
      scrollTrigger: { trigger: element, start: "top 78%", end: "bottom 52%", scrub: 0.4 },
    });
  });
}

function reveals(host) {
  gsap.utils.toArray(host.querySelectorAll("[data-rise]")).forEach((element) => {
    gsap.from(element, {
      y: 42, autoAlpha: 0, duration: 1.1, ease: OUT,
      scrollTrigger: { trigger: element, start: "top 90%", once: true },
    });
  });
  host.querySelectorAll("[data-clip]").forEach((element) => {
    const inner = element.querySelector("img");
    const timeline = gsap.timeline({ scrollTrigger: { trigger: element, start: "top 85%", once: true } });
    timeline.fromTo(element, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "expo.inOut" });
    if (inner) timeline.fromTo(inner, { scale: 1.3 }, { scale: 1, duration: 1.8, ease: OUT }, 0);
  });
  host.querySelectorAll("[data-parallax]").forEach((element) => {
    gsap.fromTo(element, { yPercent: -Number(element.dataset.parallax) }, {
      yPercent: Number(element.dataset.parallax), ease: "none",
      scrollTrigger: { trigger: element.parentElement, start: "top bottom", end: "bottom top", scrub: true },
    });
  });
  host.querySelectorAll("[data-kinetic]").forEach((element) => {
    // Inside the rail the title never scrolls vertically, so it plays once on arrival.
    const pinned = element.closest(".rail");
    gsap.fromTo(element, { "--w": 75, xPercent: 2 }, {
      "--w": 125, xPercent: 0, ease: pinned ? "expo.out" : "none", duration: pinned ? 1.6 : undefined,
      scrollTrigger: pinned
        ? { trigger: pinned, start: "top 70%", once: true }
        : { trigger: element, start: "top 95%", end: "top 25%", scrub: 0.6 },
    });
  });
  host.querySelectorAll("[data-count]").forEach((element) => {
    const value = Number(element.dataset.count);
    const counter = { value: 0 };
    gsap.to(counter, {
      value, duration: 2.2, ease: "expo.out",
      scrollTrigger: { trigger: element, start: "top 85%", once: true },
      onUpdate: () => { element.textContent = counter.value.toFixed(2); },
    });
  });
  host.querySelectorAll("[data-meter]").forEach((element) => {
    gsap.from(element, {
      scaleX: 0, duration: 2.2, ease: "expo.out",
      scrollTrigger: { trigger: element, start: "top 88%", once: true },
    });
  });
  const paper = host.querySelector(".paper-sheet");
  if (paper) gsap.fromTo(paper, { rotateX: 26, rotateY: -22, rotateZ: 5, y: 60 }, {
    rotateX: 0, rotateY: 0, rotateZ: 0, y: 0, ease: "none",
    scrollTrigger: { trigger: paper.parentElement, start: "top 90%", end: "top 20%", scrub: 0.6 },
  });
  host.querySelectorAll(".role").forEach((role) => {
    ScrollTrigger.create({
      trigger: role, start: "top 62%", end: "bottom 38%", toggleClass: "is-current",
    });
  });
  host.querySelectorAll(".mark").forEach((mark) => {
    gsap.from(mark.children, {
      y: 30, autoAlpha: 0, duration: 0.9, ease: OUT, stagger: 0.04,
      scrollTrigger: { trigger: mark, start: "top 90%", once: true },
    });
  });
}

// Desktop only. Phones keep the same panels in a plain vertical stack.
function rail(host) {
  const section = host.querySelector(".rail");
  const track = host.querySelector(".rail-track");
  if (!section || !track) return;
  const media = gsap.matchMedia();
  media.add("(min-width: 901px)", () => {
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
      if (picture) gsap.fromTo(picture, { xPercent: 9, rotateY: -11, scale: 0.92 }, {
        xPercent: -5, rotateY: 7, scale: 1, ease: "none",
        scrollTrigger: { trigger: panel, containerAnimation: travel, start: "left right", end: "right left", scrub: true },
      });
      gsap.from(panel.querySelectorAll(".panel-copy > *"), {
        y: 46, autoAlpha: 0, ease: OUT, duration: 1, stagger: 0.07,
        scrollTrigger: { trigger: panel, containerAnimation: travel, start: "left 72%", toggleActions: "play none none reverse" },
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
  if (!dot || !matchMedia("(pointer: fine)").matches) return () => {};
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
  let current = null;
  gsap.set(box, { autoAlpha: 0, scale: 0.9 });
  let pointerX = -1, pointerY = -1;
  const place = (target) => {
    const row = target?.closest?.("[data-peek]");
    const source = row && row.dataset.open !== "true" ? row.dataset.peek : null;
    const width = box.offsetWidth, height = box.offsetHeight;
    x(Math.min(pointerX + 28, innerWidth - width - 20));
    y(Math.max(20, Math.min(pointerY - height / 2, innerHeight - height - 20)));
    if (source === current) return;
    current = source;
    if (source) image.src = source;
    gsap.to(box, { autoAlpha: source ? 1 : 0, scale: source ? 1 : 0.9, duration: 0.35, ease: "power3.out", overwrite: "auto" });
  };
  const move = (event) => { pointerX = event.clientX; pointerY = event.clientY; place(event.target); };
  // The page can scroll out from under a still pointer.
  const scrolled = () => { if (pointerX >= 0) place(document.elementFromPoint(pointerX, pointerY)); };
  window.addEventListener("pointermove", move, { passive: true });
  window.addEventListener("scroll", scrolled, { passive: true });
  return () => {
    window.removeEventListener("pointermove", move);
    window.removeEventListener("scroll", scrolled);
  };
}

export default function useChoreography(root, motion, progress) {
  const lenis = useRef(null);
  useEffect(() => {
    const host = root.current;
    if (!host) return;
    let smooth = null, tickerCallback = null, removeCursor = () => {}, removePeek = () => {}, media = null, resetFilm = () => {};
    const context = gsap.context(() => {
      // The section nearest the end of the page that has reached its line sets the tone.
      const zones = [];
      const sync = () => {
        const current = zones.filter((zone) => zone.isActive).at(-1);
        if (current) host.dataset.tone = current.vars.id;
      };
      host.querySelectorAll("section[data-tone]").forEach((section) => {
        // The film hands over to Research while its final flash fills the screen.
        const line = section.classList.contains("research") ? "98%" : "58%";
        zones.push(ScrollTrigger.create({
          id: section.dataset.tone, trigger: section,
          start: `top ${line}`, end: section.classList.contains("film") ? "bottom 98%" : "bottom 58%",
          onToggle: sync,
        }));
      });
      if (!motion) return;
      intro(host);
      resetFilm = film(host, progress);
      revealLines(host);
      fillWords(host);
      reveals(host);
      media = rail(host);
    }, host);
    let lastY = 0;
    const nav = host.querySelector(".nav-bar");
    const steer = (y) => {
      nav.dataset.hidden = y > lastY && y > innerHeight * 0.6 ? "true" : "false";
      host.style.setProperty("--progress", String(y / Math.max(1, document.documentElement.scrollHeight - innerHeight)));
      lastY = y;
    };
    if (motion) {
      removeCursor = cursor(host);
      removePeek = peek(host);
      if (matchMedia("(pointer: fine)").matches) {
        smooth = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95 });
        smooth.on("scroll", ScrollTrigger.update);
        tickerCallback = (time) => smooth.raf(time * 1000);
        gsap.ticker.add(tickerCallback);
        gsap.ticker.lagSmoothing(0);
        lenis.current = smooth;
      }
    }
    const onScroll = () => steer(scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    const jump = (event) => {
      const link = event.target.closest?.('a[href^="#index-"],a[href="#portfolio-home"]');
      if (!link) return;
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      event.preventDefault();
      history.pushState(null, "", link.getAttribute("href"));
      if (smooth) smooth.scrollTo(target, { duration: 1.8, easing: (t) => 1 - Math.pow(1 - t, 4) });
      else target.scrollIntoView({ behavior: motion ? "smooth" : "instant" });
    };
    host.addEventListener("click", jump);
    const settle = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(settle);
    window.addEventListener("load", settle);
    if (location.hash.startsWith("#index-"))
      requestAnimationFrame(() => document.querySelector(location.hash)?.scrollIntoView({ behavior: "instant" }));
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("load", settle);
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
  }, [root, motion, progress]);
  return lenis;
}
