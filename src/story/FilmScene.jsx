import { useEffect, useRef } from "react";
import * as THREE from "three";
import { buildWorkbench, disposeScene } from "../workspace/workbench";
import heroBox from "./heroBox";

// Camera path, keyed to the film's scroll progress. Stations are visited in orbit order,
// so the camera travels around the bench rather than cutting through it.
const CORE = [0, 1.48, 0];
const PATH = [
  { at: 0, theta: 0.72, radius: 10.2, height: 8.3, target: [0, 0.95, 0], shift: [0, 0], wide: 1 },
  { at: 0.13, theta: 1.05, radius: 7.4, height: 5.2, target: [0, 0.8, 0], shift: [0, 0], wide: 1 },
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

export default function FilmScene({ level, progress, onReady, onFallback }) {
  const host = useRef(null);
  useEffect(() => {
    const container = host.current;
    const low = level === "low";
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: !low, alpha: true, powerPreference: "high-performance" });
    } catch {
      onFallback();
      return;
    }
    const fine = matchMedia("(pointer: fine)").matches;
    const ratios = low ? [1.25, 1, 0.8] : [Math.min(devicePixelRatio || 1, 1.75), 1.25, 1, 0.8];
    let step = 0;
    renderer.setPixelRatio(Math.min(ratios[0], devicePixelRatio || 1));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.localClippingEnabled = !low;
    renderer.domElement.setAttribute("aria-hidden", "true");
    renderer.domElement.dataset.ratio = String(renderer.getPixelRatio());
    renderer.domElement.dataset.tier = level;
    container.append(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.03, 80);
    let frame = 0, last = performance.now(), lastDraw = 0, elapsed = 0, shown = progress.current, width = 1, height = 1, visible = true, inView = true, disposed = false;
    let announced = false, assembled = low;
    const samples = [];
    const requestFrame = () => { if (!frame && !disposed) frame = requestAnimationFrame(render); };
    const workbench = buildWorkbench({ scene, renderer, level, reveal: !low, onTexture: requestFrame });
    const now = { target: new THREE.Vector3() };
    const pointer = { x: 0, y: 0, cx: 0, cy: 0 };
    let started = performance.now();
    if (low) workbench.setReveal(1);
    // Draw the shadows before the first frame: an unrendered shadow map leaves every solid unlit.
    else workbench.bakeShadows();

    // Fit the bench's silhouette into the free space the hero's text leaves, at any screen shape.
    const hero = { pull: 1, x: 0, y: 0 };
    const outline = [];
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      outline.push([Math.sin(a) * 3.3, -1, Math.cos(a) * 3.3], [Math.sin(a) * 3.3, -0.2, Math.cos(a) * 3.3], [Math.sin(a) * 1.72, 2.6, Math.cos(a) * 1.72]);
    }
    const point = new THREE.Vector3();
    function fitHero() {
      const view = container.parentElement;
      const box = heroBox(view);
      pose(0, now);
      let pull = 1, bounds = null;
      for (let pass = 0; pass < 4; pass++) {
        camera.clearViewOffset();
        camera.position.set(Math.sin(now.theta) * now.radius * pull, now.target.y + (now.height - now.target.y) * pull, Math.cos(now.theta) * now.radius * pull);
        camera.lookAt(now.target);
        camera.updateMatrixWorld();
        bounds = { left: 1e9, right: -1e9, top: 1e9, bottom: -1e9 };
        outline.forEach(([x, y, z]) => {
          point.set(x, y, z).project(camera);
          const px = (point.x * 0.5 + 0.5) * width, py = (-point.y * 0.5 + 0.5) * height;
          bounds.left = Math.min(bounds.left, px); bounds.right = Math.max(bounds.right, px);
          bounds.top = Math.min(bounds.top, py); bounds.bottom = Math.max(bounds.bottom, py);
        });
        pull *= Math.max((bounds.right - bounds.left) / box.width, (bounds.bottom - bounds.top) / box.height);
        pull = Math.max(pull, 0.72);
      }
      hero.pull = pull;
      hero.x = (box.left + box.width / 2 - (bounds.left + bounds.right) / 2) / width;
      hero.y = (box.top + box.height / 2 - (bounds.top + bounds.bottom) / 2) / height;
      const dx = hero.x * width, dy = hero.y * height;
      renderer.domElement.dataset.bench = [bounds.left + dx, bounds.top + dy, bounds.right + dx, bounds.bottom + dy].map(Math.round).join(",");
    }

    function draw() {
      pose(shown, now);
      const portrait = camera.aspect < 1;
      // Close-ups pull back on narrow screens so the subject stays in frame.
      const closeFit = portrait ? Math.pow(Math.max(1, 0.9 / camera.aspect + (camera.aspect - 0.46) * 1.8), 0.8) : 1;
      const base = closeFit + (hero.pull - closeFit) * now.wide;
      const pull = now.close > 0 ? 1 : base;
      const theta = now.theta + pointer.cx * 0.05;
      const radius = now.radius * pull * (1 - now.close) + now.radius * now.close;
      camera.position.set(
        Math.sin(theta) * radius,
        now.target.y + (now.height - now.target.y) * pull + pointer.cy * 0.16,
        Math.cos(theta) * radius,
      );
      camera.lookAt(now.target);
      // Portrait screens frame the subject above the caption; wide screens beside it.
      const closeX = portrait ? 0 : now.shiftX, closeY = portrait ? -0.15 * (1 - now.close) : 0;
      const shiftX = closeX * (1 - now.wide) + hero.x * now.wide;
      const shiftY = closeY * (1 - now.wide) + hero.y * now.wide;
      camera.setViewOffset(width, height, -shiftX * width, -shiftY * height, width, height);
      workbench.glow.material.opacity = 0.32 + now.close * 0.68;
      workbench.glow.scale.setScalar(2.6 + now.close * 3);
      renderer.render(scene, camera);
    }
    // Trade resolution for smoothness, and give up on live 3D only as the last resort.
    function adapt(delta) {
      samples.push(delta);
      if (samples.length < 40) return;
      const sorted = [...samples].sort((a, b) => a - b);
      const average = samples.reduce((a, b) => a + b, 0) / samples.length;
      const jitter = sorted[Math.floor(sorted.length * 0.9)] - sorted[20];
      samples.length = 0;
      // A steady 30fps can just be a phone's low power mode, so only unsteady frames count at that rate.
      const budget = low ? 0.05 : 0.021;
      if (average < budget && (low || jitter < 0.008)) return;
      if (average > 0.03 && jitter < 0.004 && average < 0.04) return;
      if (step < ratios.length - 1) {
        step++;
        renderer.setPixelRatio(Math.min(ratios[step], devicePixelRatio || 1));
        renderer.setSize(width, height, false);
        renderer.domElement.dataset.ratio = String(renderer.getPixelRatio());
        if (step === 1) workbench.dropShadows();
      } else if (average > 0.045) onFallback();
    }
    function render(time) {
      frame = 0;
      if (disposed || !visible) return;
      // Low-tier devices draw at 30fps, which leaves the main thread free for scrolling.
      if (low && time - lastDraw < 30) { requestFrame(); return; }
      lastDraw = time;
      const delta = Math.max(0, Math.min((time - last) / 1000, 0.25));
      last = time;
      if (!assembled) {
        const assemble = Math.min(1, Math.max(0, (performance.now() - started) / 1000 - 0.25) / 2.4);
        workbench.setReveal(assemble);
        if (assemble >= 1) { assembled = true; workbench.bakeShadows(); }
      }
      const step60 = Math.min(delta, 0.06);
      elapsed += step60;
      workbench.tick(elapsed);
      shown += (progress.current - shown) * (1 - Math.exp(-step60 * 7));
      pointer.cx += (pointer.x - pointer.cx) * (1 - Math.exp(-step60 * 3));
      pointer.cy += (pointer.y - pointer.cy) * (1 - Math.exp(-step60 * 3));
      draw();
      if (!announced) { announced = true; onReady(); }
      else if (assembled) adapt(delta);
      requestFrame();
    }
    const resize = new ResizeObserver(() => {
      const rect = container.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      fitHero();
      requestFrame();
    });
    resize.observe(container);
    // Web fonts change the text's size, and so the free space.
    document.fonts?.ready.then(() => { if (!disposed) { fitHero(); requestFrame(); } });
    const visibility = () => {
      visible = !document.hidden && inView;
      samples.length = 0;
      if (visible) { last = performance.now(); requestFrame(); }
    };
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; visibility(); }, { rootMargin: "60px" });
    observer.observe(container);
    document.addEventListener("visibilitychange", visibility);
    const move = (event) => {
      pointer.x = (event.clientX / innerWidth - 0.5) * 2;
      pointer.y = -(event.clientY / innerHeight - 0.5) * 2;
    };
    if (fine && !low) window.addEventListener("pointermove", move, { passive: true });
    const lost = (event) => { event.preventDefault(); onFallback(); };
    renderer.domElement.addEventListener("webglcontextlost", lost);
    // Compile every shader now, so the stall happens before the visitor starts scrolling.
    camera.aspect = container.clientWidth / Math.max(1, container.clientHeight);
    renderer.compile(scene, camera);
    started = performance.now();
    last = started;
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
  }, [level, progress, onReady, onFallback]);
  return <div className="film-canvas" ref={host} />;
}
