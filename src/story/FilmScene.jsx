import { useEffect, useRef } from "react";
import * as THREE from "three";
import { buildWorkbench, disposeScene } from "../workspace/workbench";

// Camera path, keyed to the film's scroll progress. Stations are visited in orbit order,
// so the camera travels around the bench rather than cutting through it.
const CORE = [0, 1.48, 0];
const PATH = [
  { at: 0, theta: 0.72, radius: 10.2, height: 8.3, target: [0, 0.95, 0], shift: [0.1, -0.13], wide: 1 },
  { at: 0.13, theta: 1.05, radius: 7.4, height: 5.2, target: [0, 0.8, 0], shift: [0, -0.04], wide: 1 },
  { at: 0.24, theta: 2.06, radius: 6.4, height: 2.6, target: [2.25, 0.62, -1.2], shift: [0.2, 0] },
  { at: 0.37, theta: 2.2, radius: 5.9, height: 2.2, target: [2.25, 0.62, -1.2], shift: [0.2, 0] },
  { at: 0.49, theta: 3.03, radius: 6.8, height: 2.5, target: [0.15, 1, -2.35], shift: [-0.2, 0] },
  { at: 0.61, theta: 3.2, radius: 6.3, height: 2.2, target: [0.15, 1, -2.35], shift: [-0.2, 0] },
  { at: 0.72, theta: 6.1, radius: 6.4, height: 2.5, target: [-0.25, 0.52, 2.45], shift: [0.2, 0] },
  { at: 0.82, theta: 6.3, radius: 5.9, height: 2.1, target: [-0.25, 0.52, 2.45], shift: [0.2, 0] },
  { at: 0.9, theta: 6.95, radius: 3.9, height: 1.95, target: CORE, shift: [0, 0] },
  { at: 1, theta: 7.35, radius: 0.1, height: 1.48, target: CORE, shift: [0, 0], close: true },
];
const smoother = (t) => t * t * t * (t * (t * 6 - 15) + 10);

function pose(progress, out) {
  let index = 0;
  while (index < PATH.length - 2 && progress > PATH[index + 1].at) index++;
  const a = PATH[index],
    b = PATH[index + 1];
  const t = smoother(Math.min(1, Math.max(0, (progress - a.at) / (b.at - a.at))));
  const mix = (x, y) => x + (y - x) * t;
  out.theta = mix(a.theta, b.theta);
  out.radius = mix(a.radius, b.radius);
  out.height = mix(a.height, b.height);
  out.wide = mix(a.wide ? 1 : 0, b.wide ? 1 : 0);
  out.close = mix(a.close ? 1 : 0, b.close ? 1 : 0);
  out.shiftX = mix(a.shift[0], b.shift[0]);
  out.shiftY = mix(a.shift[1], b.shift[1]);
  out.target.set(mix(a.target[0], b.target[0]), mix(a.target[1], b.target[1]), mix(a.target[2], b.target[2]));
}

export default function FilmScene({ motion, progress, onFailure }) {
  const host = useRef(null);
  useEffect(() => {
    const container = host.current;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      onFailure();
      return;
    }
    const compact = matchMedia("(max-width: 900px)").matches;
    const fine = matchMedia("(pointer: fine)").matches;
    let pixelRatio = Math.min(devicePixelRatio || 1, compact ? 1.75 : 2);
    renderer.setPixelRatio(pixelRatio);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.localClippingEnabled = true;
    renderer.domElement.setAttribute("aria-hidden", "true");
    container.append(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.03, 80);
    let frame = 0, last = 0, elapsed = 0, shown = 0, width = 1, height = 1, visible = true, disposed = false;
    let slowFrames = 0, sampled = 0;
    const requestFrame = () => { if (!frame && !disposed) frame = requestAnimationFrame(render); };
    const workbench = buildWorkbench({ scene, renderer, compact, onTexture: requestFrame });
    const now = { target: new THREE.Vector3() };
    const pointer = { x: 0, y: 0, cx: 0, cy: 0 };
    const started = performance.now();
    if (!motion) workbench.setReveal(1);

    function draw() {
      pose(shown, now);
      // Narrow screens pull back so the whole bench fits; the close-ups pull back less.
      const fit = Math.max(1, 0.9 / camera.aspect);
      const pull = now.close > 0 ? 1 : Math.pow(fit, 0.55 + now.wide * 0.45);
      const theta = now.theta + pointer.cx * 0.05;
      const radius = now.radius * pull * (1 - now.close) + now.radius * now.close;
      camera.position.set(
        Math.sin(theta) * radius,
        now.target.y + (now.height - now.target.y) * pull + pointer.cy * 0.16,
        Math.cos(theta) * radius,
      );
      camera.lookAt(now.target);
      const shiftX = compact ? 0 : now.shiftX;
      const shiftY = compact ? (now.wide > 0.5 ? now.shiftY : -0.16) * (1 - now.close) : now.shiftY;
      camera.setViewOffset(width, height, -shiftX * width, -shiftY * height, width, height);
      workbench.glow.material.opacity = 0.32 + now.close * 0.68;
      workbench.glow.scale.setScalar(2.6 + now.close * 3);
      renderer.render(scene, camera);
    }
    function render(time) {
      frame = 0;
      if (disposed || !visible) return;
      const delta = Math.max(0, Math.min((time - last) / 1000, 0.06));
      if (motion) {
        const delay = 0.45;
        const assemble = Math.min(1, Math.max(0, (performance.now() - started) / 1000 - delay) / 2.6);
        workbench.setReveal(assemble);
        if (assemble >= 1 && renderer.shadowMap.autoUpdate) {
          renderer.shadowMap.autoUpdate = false;
          renderer.shadowMap.needsUpdate = true;
        }
        elapsed += delta;
        workbench.tick(elapsed);
        const goal = progress.current;
        shown += (goal - shown) * (1 - Math.exp(-delta * 7));
        pointer.cx += (pointer.x - pointer.cx) * (1 - Math.exp(-delta * 3));
        pointer.cy += (pointer.y - pointer.cy) * (1 - Math.exp(-delta * 3));
        // Step resolution down rather than dropping frames on slower graphics hardware.
        if (delta > 0.03) slowFrames++;
        if (++sampled === 90) {
          if (slowFrames > 45 && pixelRatio > 1) {
            pixelRatio = Math.max(1, pixelRatio - 0.5);
            renderer.setPixelRatio(pixelRatio);
            renderer.setSize(width, height, false);
          }
          sampled = slowFrames = 0;
        }
      } else workbench.tick(0);
      last = time;
      draw();
      if (motion) requestFrame();
      if (import.meta.env.DEV) renderer.domElement.dataset.shown = shown.toFixed(3);
    }
    const resize = new ResizeObserver(() => {
      const rect = container.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      requestFrame();
    });
    resize.observe(container);
    const visibility = () => { visible = !document.hidden && inView; if (visible) { last = performance.now(); requestFrame(); } };
    let inView = true;
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; visibility(); }, { rootMargin: "60px" });
    observer.observe(container);
    document.addEventListener("visibilitychange", visibility);
    const move = (event) => {
      pointer.x = (event.clientX / innerWidth - 0.5) * 2;
      pointer.y = -(event.clientY / innerHeight - 0.5) * 2;
    };
    if (motion && fine) window.addEventListener("pointermove", move, { passive: true });
    const lost = (event) => { event.preventDefault(); onFailure(); };
    renderer.domElement.addEventListener("webglcontextlost", lost);
    last = performance.now();
    requestFrame();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      resize.disconnect();
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("pointermove", move);
      renderer.domElement.removeEventListener("webglcontextlost", lost);
      disposeScene(scene);
      workbench.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [motion, progress, onFailure]);
  return <div className="film-canvas" ref={host} />;
}
