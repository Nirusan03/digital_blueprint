import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import portrait from "../assets/portraits/nirusan-cutout-v2.webp";

const stations = [
  { id: "work", label: "Projects", position: [-2.25, 0.72, 1.25] },
  { id: "about", label: "About me", position: [-2.2, 0.9, -1.55] },
  { id: "experience", label: "Experience", position: [0.15, 1.15, -2.35] },
  { id: "research", label: "Research", position: [2.25, 0.65, -1.2] },
  { id: "terminal", label: "Terminal", position: [2.25, 0.9, 1.45] },
  { id: "quantum", label: "Quantum relay", position: [0, 2.5, 0] },
  { id: "immersive", label: "Immersive Smile", position: [-0.25, 0.7, 2.45] },
];

function screenTexture(lines, color = "#bdffc8") {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 320;
  const context = canvas.getContext("2d");
  context.fillStyle = "#07100e";
  context.fillRect(0, 0, 512, 320);
  context.strokeStyle = "#244639";
  context.lineWidth = 2;
  context.strokeRect(14, 14, 484, 292);
  context.fillStyle = color;
  context.font = "24px monospace";
  lines.forEach((line, i) => context.fillText(line, 32, 63 + i * 43));
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export default function World({
  motion,
  suspended,
  onOpen,
  onReady,
  onFailure,
  qubit,
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
        powerPreference: "low-power",
      });
    } catch {
      onFailure();
      onReady();
      return;
    }
    const compact = window.matchMedia("(max-width: 760px)").matches;
    renderer.setPixelRatio(
      Math.min(Math.max(window.devicePixelRatio || 1, 1.5), 2),
    );
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setClearColor(0x0b0e10, 0);
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
    const pmrem = new THREE.PMREMGenerator(renderer),
      room = new RoomEnvironment(),
      environment = pmrem.fromScene(room, 0.04);
    scene.environment = environment.texture;
    room.dispose();
    pmrem.dispose();
    scene.add(new THREE.HemisphereLight(0xd5e8ef, 0x151411, 2));
    const key = new THREE.DirectionalLight(0xffffff, 4);
    key.position.set(-3, 7, 4);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xff7738, 3);
    rim.position.set(4, 3, -4);
    scene.add(rim);
    const fill = new THREE.DirectionalLight(0x7ac7ff, 2);
    fill.position.set(-5, 2, -2);
    scene.add(fill);
    const metal = new THREE.MeshStandardMaterial({
      color: 0x879598,
      metalness: 0.92,
      roughness: 0.26,
    });
    const dark = new THREE.MeshStandardMaterial({
      color: 0x182124,
      metalness: 0.8,
      roughness: 0.4,
    });
    const graphite = new THREE.MeshStandardMaterial({
      color: 0x293235,
      metalness: 0.7,
      roughness: 0.46,
    });
    const copper = new THREE.MeshStandardMaterial({
      color: 0xe08c51,
      metalness: 0.85,
      roughness: 0.3,
    });
    const ceramic = new THREE.MeshStandardMaterial({
      color: 0xcdd9d7,
      metalness: 0.38,
      roughness: 0.34,
    });
    const orange = new THREE.MeshStandardMaterial({
      color: 0xff7744,
      emissive: 0xff490c,
      emissiveIntensity: 1.1,
      roughness: 0.4,
    });
    const mint = new THREE.MeshStandardMaterial({
      color: 0xbee9b1,
      emissive: 0x75b955,
      emissiveIntensity: 0.75,
      roughness: 0.4,
    });
    const blue = new THREE.MeshStandardMaterial({
      color: 0x6ebbc9,
      emissive: 0x266b89,
      emissiveIntensity: 0.5,
      roughness: 0.4,
    });
    const mesh = (geometry, material, parent = scene, x = 0, y = 0, z = 0) => {
      const item = new THREE.Mesh(geometry, material);
      item.position.set(x, y, z);
      parent.add(item);
      return item;
    };
    const box = (x, y, z, material, parent, px = 0, py = 0, pz = 0) =>
      mesh(new THREE.BoxGeometry(x, y, z), material, parent, px, py, pz);
    const cylinder = (r, h, material, parent, px = 0, py = 0, pz = 0) =>
      mesh(
        new THREE.CylinderGeometry(r, r, h, compact ? 48 : 80),
        material,
        parent,
        px,
        py,
        pz,
      );
    const ring = (r, t, material, parent, px = 0, py = 0, pz = 0) => {
      const item = mesh(
        new THREE.TorusGeometry(r, t, 8, compact ? 80 : 128),
        material,
        parent,
        px,
        py,
        pz,
      );
      item.rotation.x = Math.PI / 2;
      return item;
    };
    // A machined circular workbench with radial marks, conduits, and hardware stations.
    const bench = new THREE.Group();
    scene.add(bench);
    cylinder(3.25, 0.22, dark, bench, 0, -0.3, 0);
    cylinder(3.15, 0.055, graphite, bench, 0, -0.16, 0);
    ring(3.22, 0.027, copper, bench, 0, -0.19, 0);
    ring(2.99, 0.012, metal, bench, 0, -0.125, 0);
    ring(1.2, 0.012, metal, bench, 0, -0.123, 0);
    for (let i = 0; i < 48; i++) {
      const a = (i / 48) * Math.PI * 2;
      const tick = box(
        0.018,
        0.009,
        i % 4 === 0 ? 0.13 : 0.055,
        i % 4 === 0 ? ceramic : metal,
        bench,
        Math.sin(a) * 3.06,
        -0.119,
        Math.cos(a) * 3.06,
      );
      tick.rotation.y = a;
    }
    for (const x of [-1.7, 1.7])
      for (const z of [-1.7, 1.7]) {
        cylinder(0.16, 0.5, metal, bench, x, -0.65, z);
        cylinder(0.27, 0.09, dark, bench, x, -0.91, z);
      }
    // Soft contact shadow, authored locally rather than using an external texture.
    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const shadowContext = shadowCanvas.getContext("2d");
    const gradient = shadowContext.createRadialGradient(
      128,
      128,
      20,
      128,
      128,
      128,
    );
    gradient.addColorStop(0, "rgba(0,0,0,.65)");
    gradient.addColorStop(0.6, "rgba(0,0,0,.4)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    shadowContext.fillStyle = gradient;
    shadowContext.fillRect(0, 0, 256, 256);
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadow = mesh(
      new THREE.PlaneGeometry(7.5, 7.5),
      new THREE.MeshBasicMaterial({
        map: shadowTexture,
        transparent: true,
        depthWrite: false,
      }),
      scene,
      0,
      -0.99,
      0,
    );
    shadow.rotation.x = -Math.PI / 2;
    const objects = [];
    stations
      .filter((station) => station.id !== "quantum")
      .forEach((station, i) => {
        const group = new THREE.Group();
        group.position.set(station.position[0], 0, station.position[2]);
        group.userData.app = station.id;
        scene.add(group);
        objects.push(group);
        cylinder(0.64, 0.13, dark, group, 0, -0.08, 0);
        ring(0.6, 0.015, i % 2 ? blue : copper, group, 0, -0.005, 0);
        const angle = Math.atan2(station.position[0], station.position[2]);
        group.rotation.y = angle;
        const cable = new THREE.CatmullRomCurve3([
          new THREE.Vector3(station.position[0], -0.08, station.position[2]),
          new THREE.Vector3(
            station.position[0] * 0.6,
            0.02,
            station.position[2] * 0.6,
          ),
          new THREE.Vector3(0, 0.06, 0),
        ]);
        mesh(
          new THREE.TubeGeometry(cable, 18, 0.025, 5, false),
          i % 2 ? copper : metal,
          bench,
        );
        if (station.id === "work") {
          box(0.88, 0.25, 0.68, metal, group, 0, 0.18, 0);
          box(0.72, 0.06, 0.51, dark, group, 0, 0.34, 0);
          for (let n = 0; n < 10; n++)
            box(0.035, 0.23, 0.48, copper, group, (n - 4.5) * 0.065, 0.46, 0);
          ring(0.27, 0.04, graphite, group, 0, 0.61, 0);
          cylinder(0.09, 0.06, metal, group, 0, 0.62, 0);
          for (let n = 0; n < 6; n++) {
            const blade = box(
              0.08,
              0.018,
              0.29,
              dark,
              group,
              Math.sin((n * Math.PI) / 3) * 0.12,
              0.635,
              Math.cos((n * Math.PI) / 3) * 0.12,
            );
            blade.rotation.y = (n * Math.PI) / 3 + 0.4;
          }
        } else if (station.id === "about") {
          box(0.87, 1.22, 0.075, metal, group, 0, 0.75, 0);
          box(0.96, 0.08, 0.45, dark, group, 0, 0.1, 0);
          box(0.76, 1.1, 0.001, dark, group, 0, 0.76, 0.039);
          const material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide,
            transparent: true,
            alphaTest: 0.02,
            depthWrite: false,
          });
          const photo = mesh(
            new THREE.PlaneGeometry(0.76, 1.1),
            material,
            group,
            0,
            0.76,
            0.041,
          );
          const loader = new THREE.TextureLoader();
          loader.load(
            portrait,
            (texture) => {
              if (disposed) {
                texture.dispose();
                return;
              }
              texture.colorSpace = THREE.SRGBColorSpace;
              material.map = texture;
              material.needsUpdate = true;
              requestFrame();
            },
            undefined,
            () => {},
          );
          photo.userData.app = "about";
        } else if (station.id === "experience") {
          box(0.72, 1.7, 0.52, metal, group, 0, 0.82, 0);
          for (let n = 0; n < 6; n++) {
            box(0.62, 0.19, 0.025, dark, group, 0, 0.2 + n * 0.23, 0.275);
            box(
              0.04,
              0.025,
              0.01,
              n % 2 ? mint : orange,
              group,
              0.22,
              0.2 + n * 0.23,
              0.295,
            );
            for (let k = 0; k < 5; k++)
              box(
                0.06,
                0.01,
                0.012,
                graphite,
                group,
                -0.21 + k * 0.07,
                0.2 + n * 0.23,
                0.293,
              );
          }
          box(0.8, 0.06, 0.6, copper, group, 0, 1.7, 0);
        } else if (station.id === "research") {
          for (let n = 0; n < 4; n++) {
            cylinder(0.38, 0.2, metal, group, 0, 0.15 + n * 0.24, 0);
            ring(
              0.375,
              0.018,
              n === 3 ? mint : copper,
              group,
              0,
              0.23 + n * 0.24,
              0,
            );
          }
          cylinder(0.26, 0.035, dark, group, 0, 1.0, 0);
        } else if (station.id === "immersive") {
          box(1.03, 0.39, 0.47, ceramic, group, 0, 0.37, 0);
          box(0.85, 0.27, 0.03, dark, group, 0, 0.37, 0.25);
          for (const x of [-0.27, 0.27])
            mesh(
              new THREE.SphereGeometry(0.068, 14, 10),
              metal,
              group,
              x,
              0.37,
              0.28,
            );
          const strap = mesh(
            new THREE.TorusGeometry(0.44, 0.048, 8, 40, Math.PI),
            dark,
            group,
            0,
            0.4,
            -0.1,
          );
          strap.rotation.x = -0.25;
          mesh(
            new THREE.SphereGeometry(0.16, 20, 14),
            orange,
            group,
            0.73,
            0.18,
            0.22,
          );
          const wearable = ring(0.2, 0.055, metal, group, -0.77, 0.22, 0.1);
          wearable.rotation.x = 0.45;
        } else {
          box(0.94, 0.65, 0.07, metal, group, 0, 0.72, 0);
          const terminalMap = screenTexture([
            "visitor@nh:~ $",
            "> help",
            "work  about  play",
            "_",
          ]);
          mesh(
            new THREE.PlaneGeometry(0.84, 0.55),
            new THREE.MeshBasicMaterial({ map: terminalMap }),
            group,
            0,
            0.72,
            0.04,
          );
          box(0.14, 0.3, 0.14, metal, group, 0, 0.25, 0);
          box(0.7, 0.055, 0.45, dark, group, 0, 0.08, 0.05);
          const keyboard = box(0.8, 0.025, 0.37, metal, group, 0, 0.03, 0.4);
          keyboard.rotation.x = 0.08;
        }
      });
    // Suspended quantum apparatus: real 3D meshes with reflected light.
    const core = new THREE.Group();
    core.userData.app = "quantum";
    core.position.y = 1.48;
    scene.add(core);
    objects.push(core);
    cylinder(0.65, 0.18, metal, scene, 0, 0.05, 0);
    cylinder(0.48, 0.2, dark, scene, 0, 0.21, 0);
    ring(0.49, 0.024, orange, scene, 0, 0.31, 0);
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
      const x = Math.sin(a) * 1.18,
        z = Math.cos(a) * 1.18;
      cylinder(0.035, 2.65, metal, scene, x, 1.18, z);
      box(0.18, 0.08, 0.18, copper, scene, x, 2.5, z);
    }
    const canopy = ring(1.66, 0.055, metal, scene, 0, 2.52, 0);
    ring(1.52, 0.013, orange, scene, 0, 2.5, 0);
    const knot = mesh(
      new THREE.TorusKnotGeometry(
        0.77,
        0.12,
        160,
        18,
        2,
        3,
      ),
      new THREE.MeshPhysicalMaterial({
        color: 0xb8c6c5,
        metalness: 1,
        roughness: 0.17,
        clearcoat: 1,
        envMapIntensity: 1.7,
      }),
      core,
    );
    knot.rotation.set(0.2, 0, 0.3);
    const inner = mesh(
      new THREE.IcosahedronGeometry(0.4, 2),
      new THREE.MeshPhysicalMaterial({
        color: 0xc9ffb2,
        emissive: 0x64a941,
        emissiveIntensity: 0.3,
        metalness: 0.3,
        roughness: 0.1,
        transparent: true,
        opacity: 0.85,
        clearcoat: 1,
      }),
      core,
    );
    const orbitA = ring(1.17, 0.014, copper, core);
    orbitA.rotation.set(0.6, 0.35, 0.3);
    const orbitB = ring(1.31, 0.011, metal, core);
    orbitB.rotation.set(1.4, 0.4, -0.2);
    const vector = new THREE.ArrowHelper(
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(0, 0, 0),
      0.76,
      0xdbffb9,
      0.15,
      0.07,
    );
    core.add(vector);
    const marker = mesh(
      new THREE.SphereGeometry(0.057, 12, 8),
      orange,
      core,
      1.17,
      0,
      0,
    );
    const hubLabel = screenTexture(
      ["NIRUSAN HARIHARAN", "SOFTWARE ENGINEER", "PERSONAL WORKSPACE"],
      "#e2e2cf",
    );
    const plate = mesh(
      new THREE.PlaneGeometry(1.75, 1.05),
      new THREE.MeshBasicMaterial({ map: hubLabel }),
      bench,
      0,
      -0.105,
      1.9,
    );
    plate.rotation.x = -Math.PI / 2;
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
        knot.rotation.y = elapsed * 0.16;
        knot.rotation.z = 0.3 + Math.sin(elapsed * 0.2) * 0.08;
        orbitA.rotation.z = elapsed * 0.06;
        marker.position.set(
          Math.cos(elapsed * 0.7) * 1.17,
          Math.sin(elapsed * 0.7) * 0.42,
          Math.sin(elapsed * 0.7) * 0.95,
        );
        inner.rotation.y = -elapsed * 0.12;
        canopy.rotation.z = Math.sin(elapsed * 0.18) * 0.025;
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
      const geometries = new Set(),
        materials = new Set(),
        textures = new Set([shadowTexture, hubLabel]);
      scene.traverse((object) => {
        if (object.geometry) geometries.add(object.geometry);
        if (object.material)
          (Array.isArray(object.material)
            ? object.material
            : [object.material]
          ).forEach((material) => {
            materials.add(material);
            for (const value of Object.values(material))
              if (value?.isTexture) textures.add(value);
          });
      });
      geometries.forEach((item) => item.dispose());
      materials.forEach((item) => item.dispose());
      textures.forEach((item) => item.dispose());
      environment.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [onReady, onFailure]);
  return (
    <div className="world-stage" ref={host}>
      <button
        className="world-reset"
        onClick={() => engine.current?.resetView()}
      >
        Reset 3D view ↺
      </button>
      <nav className="world-stations" aria-label="3D workspace stations">
        {stations.map((station, i) => (
          <button
            className="world-label"
            ref={(element) => {
              labels.current[station.id] = element;
            }}
            key={station.id}
            onClick={() => onOpen(station.id)}
          >
            <span>{String(i + 1).padStart(2, "0")}</span>
            {station.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
