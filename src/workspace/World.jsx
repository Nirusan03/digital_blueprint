import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { buildWorkbench, disposeScene, stations } from "./workbench";

export default function World({
  motion,
  suspended,
  onOpen,
  onReady,
  onFailure,
  qubit,
  apiRef,
}) {
  const host = useRef(null),
    labels = useRef({}),
    engine = useRef(null);
  const state = useRef({ motion, suspended, onOpen, qubit });
  useEffect(() => {
    state.current = { motion, suspended, onOpen, qubit };
    engine.current?.requestFrame();
  }, [motion, suspended, onOpen, qubit]);
  useEffect(() => {
    const container = host.current;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      onFailure();
      onReady();
      return;
    }
    const compact = window.matchMedia("(max-width: 760px)").matches;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setClearColor(0x0b0b0c, 0);
    renderer.localClippingEnabled = true;
    renderer.domElement.setAttribute(
      "aria-label",
      "Interactive 3D engineering workspace. Use the labeled stations or drag to orbit.",
    );
    renderer.domElement.setAttribute("role", "img");
    container.prepend(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 80);
    camera.position.set(6.1, 5.2, 7);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0.65, 0);
    const homeDirection = camera.position
      .clone()
      .sub(controls.target)
      .normalize();
    let fitDistance = 10.4;
    controls.enableDamping = true;
    controls.dampingFactor = 0.075;
    controls.enablePan = false;
    controls.minDistance = 7.8;
    controls.maxDistance = 30;
    controls.minPolarAngle = 0.32;
    controls.maxPolarAngle = 1.3;
    controls.enableZoom = false;
    controls.touches.ONE = null;
    controls.touches.TWO = null;
    renderer.domElement.style.touchAction = "pan-y";
    const workbench = buildWorkbench({ scene, renderer, compact, onTexture: () => requestFrame() });
    workbench.setReveal(1);
    // The bench holds still, so its shadows are drawn once rather than every frame.
    renderer.shadowMap.autoUpdate = false;
    renderer.shadowMap.needsUpdate = true;
    const { objects, vector } = workbench;
    const raycaster = new THREE.Raycaster(),
      pointer = new THREE.Vector2();
    let down = null,
      frame = 0,
      last = 0,
      elapsed = 0,
      labelsDirty = true,
      renderSamples = 0,
      disposed = false,
      dragging = false,
      visible = !document.hidden,
      inViewport = true;
    function updateLabels() {
      const rect = container.getBoundingClientRect();
      stations.forEach((station) => {
        const element = labels.current[station.id];
        if (!element) return;
        const point = new THREE.Vector3(...station.position).project(camera);
        element.style.transform = `translate(${(point.x * 0.5 + 0.5) * rect.width}px,${(-point.y * 0.5 + 0.5) * rect.height}px) translate(-50%,-100%)`;
        element.style.visibility = point.z > 1 ? "hidden" : "visible";
      });
    }
    function render(time = 0) {
      const frameStarted = import.meta.env.DEV ? performance.now() : 0;
      frame = 0;
      if (disposed) return;
      const current = state.current;
      const running = current.motion && !current.suspended && visible && inViewport;
      const delta = Math.min((time - last) / 1000, 0.06);
      if (running && time - last < (compact ? 32 : 22)) {
        frame = requestAnimationFrame(render);
        return;
      }
      last = time;
      controls.enableDamping = current.motion;
      if (running) {
        elapsed += delta;
        workbench.tick(elapsed);
      }
      const [a, b] = current.qubit || [1, 0];
      vector.setDirection(
        new THREE.Vector3(2 * a * b, 0, a * a - b * b).normalize(),
      );
      controls.update();
      renderer.render(scene, camera);
      if (labelsDirty) {
        updateLabels();
        labelsDirty = false;
      }
      if (import.meta.env.DEV && renderSamples++ % 30 === 0) {
        renderer.domElement.dataset.sceneTime = elapsed.toFixed(2);
        renderer.domElement.dataset.pixelRatio = String(renderer.getPixelRatio());
        renderer.domElement.dataset.drawCalls = String(
          renderer.info.render.calls,
        );
        renderer.domElement.dataset.triangles = String(
          renderer.info.render.triangles,
        );
        renderer.domElement.dataset.cpuSubmitMs = (
          performance.now() - frameStarted
        ).toFixed(2);
      }
      if ((running || dragging) && !frame)
        frame = requestAnimationFrame(render);
    }
    function requestFrame() {
      if (!frame && !disposed) frame = requestAnimationFrame(render);
    }
    engine.current = {
      requestFrame,
      resetView: () => {
        controls.target.set(0, 0.65, 0);
        camera.position
          .copy(homeDirection)
          .multiplyScalar(fitDistance)
          .add(controls.target);
        controls.update();
        requestFrame();
      },
    };
    const resize = new ResizeObserver(() => {
      const rect = container.getBoundingClientRect();
      renderer.setSize(rect.width, rect.height, false);
      camera.aspect = rect.width / rect.height;
      fitDistance = Math.max(
        10.4,
        4.1 /
          (Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.aspect),
      );
      camera.position
        .sub(controls.target)
        .normalize()
        .multiplyScalar(fitDistance)
        .add(controls.target);
      camera.updateProjectionMatrix();
      labelsDirty = true;
      requestFrame();
    });
    resize.observe(container);
    const viewportObserver = new IntersectionObserver(([entry]) => {
      inViewport = entry.isIntersecting;
      if (!inViewport) { cancelAnimationFrame(frame); frame = 0; }
      else requestFrame();
    }, { rootMargin: "80px" });
    viewportObserver.observe(container);
    const visibility = () => {
      visible = !document.hidden,
      inViewport = true;
      if (!visible) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else requestFrame();
    };
    document.addEventListener("visibilitychange", visibility);
    const start = () => {
        dragging = true;
        requestFrame();
      },
      end = () => {
        dragging = false;
        requestFrame();
      };
    controls.addEventListener("start", start);
    controls.addEventListener("end", end);
    const cameraChanged = () => {
      labelsDirty = true;
      requestFrame();
    };
    controls.addEventListener("change", cameraChanged);
    const pick = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.set(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        (-(event.clientY - rect.top) / rect.height) * 2 + 1,
      );
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(objects, true);
      let object = hits[0]?.object;
      while (object && !object.userData.app) object = object.parent;
      return object?.userData.app;
    };
    const pointerDown = (event) => {
      down = { x: event.clientX, y: event.clientY };
    };
    const pointerUp = (event) => {
      if (
        down &&
        Math.hypot(event.clientX - down.x, event.clientY - down.y) < 6
      ) {
        const app = pick(event);
        if (app) state.current.onOpen(app);
      }
      down = null;
    };
    const pointerMove = (event) => {
      if (event.pointerType === "touch") return;
      renderer.domElement.style.cursor = down
        ? "grabbing"
        : pick(event)
          ? "pointer"
          : "grab";
    };
    const lost = (event) => {
      event.preventDefault();
      onFailure();
    };
    renderer.domElement.addEventListener("webglcontextlost", lost);
    renderer.domElement.addEventListener("pointerdown", pointerDown);
    renderer.domElement.addEventListener("pointerup", pointerUp);
    renderer.domElement.addEventListener("pointermove", pointerMove);
    const pointerCancel = () => { down = null; };
    renderer.domElement.addEventListener("pointercancel", pointerCancel);
    controls.update();
    controls.saveState();
    renderer.render(scene, camera);
    updateLabels();
    onReady();
    requestFrame();
    if (apiRef) apiRef.current = { resetView: () => engine.current?.resetView() };
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      engine.current = null;
      resize.disconnect();
      viewportObserver.disconnect();
      document.removeEventListener("visibilitychange", visibility);
      controls.removeEventListener("start", start);
      controls.removeEventListener("end", end);
      controls.removeEventListener("change", cameraChanged);
      controls.dispose();
      renderer.domElement.removeEventListener("webglcontextlost", lost);
      renderer.domElement.removeEventListener("pointerdown", pointerDown);
      renderer.domElement.removeEventListener("pointerup", pointerUp);
      renderer.domElement.removeEventListener("pointermove", pointerMove);
      renderer.domElement.removeEventListener("pointercancel", pointerCancel);
      disposeScene(scene);
      workbench.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [onReady, onFailure, apiRef]);
  return (
    <div className="world-stage" ref={host}>
      <nav className="world-stations" aria-label="3D workspace stations">
        {stations.map((station) => (
          <button
            className="world-label"
            ref={(element) => {
              labels.current[station.id] = element;
            }}
            key={station.id}
            onClick={() => onOpen(station.id)}
          >
            {station.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
