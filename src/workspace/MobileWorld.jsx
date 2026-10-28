import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import "./mobile-world.css";

export default function MobileWorld({
  motion,
  suspended,
  onOpen,
  onReady,
  onFailure,
  qubit,
}) {
  const host = useRef(null),
    engine = useRef(null);
  const current = useRef({ motion, suspended, qubit });
  useEffect(() => {
    current.current = { motion, suspended, qubit };
    engine.current?.request();
  }, [motion, suspended, qubit]);
  useEffect(() => {
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
    const container = host.current;
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.domElement.setAttribute("role", "img");
    renderer.domElement.setAttribute(
      "aria-label",
      "Exploded 3D quantum processor design study. Drag to inspect its copper circuits and glass layers.",
    );
    renderer.domElement.style.touchAction = "pan-y";
    container.prepend(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 60);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0.05, 0);
    const direction = new THREE.Vector3(4.4, 4.6, 5.6).normalize();
    camera.position.copy(direction).multiplyScalar(8).add(controls.target);
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.09;
    controls.minPolarAngle = 0.45;
    controls.maxPolarAngle = 1.25;
    const pmrem = new THREE.PMREMGenerator(renderer),
      room = new RoomEnvironment();
    const environment = pmrem.fromScene(room, 0.04);
    scene.environment = environment.texture;
    room.dispose();
    pmrem.dispose();
    scene.add(new THREE.HemisphereLight(0xc6edff, 0x102830, 2.2));
    for (const [color, power, position] of [
      [0xffd7b5, 4, [-3, 5, 3]],
      [0x5de3e0, 3, [4, 2, -3]],
    ]) {
      const light = new THREE.DirectionalLight(color, power);
      light.position.set(...position);
      scene.add(light);
    }
    const metal = new THREE.MeshStandardMaterial({
      color: 0x8faaa9,
      metalness: 0.9,
      roughness: 0.23,
    });
    const copper = new THREE.MeshStandardMaterial({
      color: 0xda995d,
      metalness: 0.9,
      roughness: 0.24,
    });
    const ceramic = new THREE.MeshStandardMaterial({
      color: 0x152e38,
      metalness: 0.6,
      roughness: 0.35,
    });
    const silicon = new THREE.MeshStandardMaterial({
      color: 0x102128,
      metalness: 0.75,
      roughness: 0.23,
    });
    const glass = new THREE.MeshPhysicalMaterial({
      color: 0x69bbb9,
      transparent: true,
      opacity: 0.2,
      metalness: 0.15,
      roughness: 0.12,
      clearcoat: 1,
      depthWrite: false,
    });
    const glow = new THREE.MeshStandardMaterial({
      color: 0x81ffe1,
      emissive: 0x36bbad,
      emissiveIntensity: 0.9,
      roughness: 0.3,
    });
    const chip = new THREE.Group();
    scene.add(chip);
    chip.rotation.y = -0.15;
    const box = (size, material, position, parent = chip) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
      mesh.position.set(...position);
      parent.add(mesh);
      return mesh;
    };
    const outline = (mesh, color = 0x75bdb8, opacity = 0.5) => {
      const line = new THREE.LineSegments(
        new THREE.EdgesGeometry(mesh.geometry),
        new THREE.LineBasicMaterial({ color, transparent: true, opacity }),
      );
      mesh.add(line);
    };
    box([3.3, 0.16, 2.55], metal, [0, -0.3, 0]);
    box([3.18, 0.08, 2.43], copper, [0, -0.19, 0]);
    const board = box([3.08, 0.12, 2.33], ceramic, [0, -0.08, 0]);
    outline(board);
    box([1.5, 0.08, 1.5], copper, [0, 0.06, 0]);
    const die = box([1.3, 0.12, 1.3], silicon, [0, 0.15, 0]);
    outline(die, 0xe3b078, 0.65);
    const paths = [];
    for (let i = 0; i < 14; i++) {
      const x = -1.35 + i * 0.205;
      paths.push(
        x,
        0.0,
        -1.12,
        x,
        0.0,
        -0.88,
        x,
        0.0,
        -0.88,
        x * 0.65,
        0.0,
        -0.68,
      );
      paths.push(x, 0.0, 1.12, x, 0.0, 0.88, x, 0.0, 0.88, x * 0.65, 0.0, 0.68);
    }
    for (const sign of [-1, 1])
      for (let i = 0; i < 10; i++) {
        const z = -0.95 + i * 0.21;
        paths.push(
          sign * 1.48,
          0.0,
          z,
          sign * 0.85,
          0.0,
          z,
          sign * 0.85,
          0.0,
          z,
          sign * 0.69,
          0.0,
          z * 0.6,
        );
      }
    const traces = new THREE.BufferGeometry();
    traces.setAttribute("position", new THREE.Float32BufferAttribute(paths, 3));
    chip.add(
      new THREE.LineSegments(
        traces,
        new THREE.LineBasicMaterial({
          color: 0xd5a96c,
          transparent: true,
          opacity: 0.7,
        }),
      ),
    );
    const pins = new THREE.InstancedMesh(
      new THREE.BoxGeometry(0.045, 0.06, 0.18),
      copper,
      56,
    );
    const matrix = new THREE.Matrix4();
    let pin = 0;
    for (const sign of [-1, 1])
      for (let i = 0; i < 14; i++) {
        matrix.makeTranslation(-1.36 + i * 0.21, -0.02, sign * 1.24);
        pins.setMatrixAt(pin++, matrix);
      }
    for (const sign of [-1, 1])
      for (let i = 0; i < 14; i++) {
        matrix.compose(
          new THREE.Vector3(sign * 1.6, -0.02, -1.12 + i * 0.173),
          new THREE.Quaternion().setFromAxisAngle(
            new THREE.Vector3(0, 1, 0),
            Math.PI / 2,
          ),
          new THREE.Vector3(1, 1, 1),
        );
        pins.setMatrixAt(pin++, matrix);
      }
    chip.add(pins);
    const qubits = new THREE.InstancedMesh(
      new THREE.SphereGeometry(0.055, 12, 8),
      glow,
      16,
    );
    for (let i = 0; i < 16; i++) {
      matrix.makeTranslation(
        -0.4 + (i % 4) * 0.27,
        0.245,
        -0.4 + Math.floor(i / 4) * 0.27,
      );
      qubits.setMatrixAt(i, matrix);
    }
    chip.add(qubits);
    const lid = new THREE.Group();
    chip.add(lid);
    lid.position.y = 0.9;
    outline(box([2.8, 0.055, 2.05], glass, [0, 0, 0], lid), 0xa8e3d9, 0.65);
    for (const x of [-1.42, 1.42])
      for (const z of [-1.02, 1.02]) {
        box([0.055, 0.66, 0.055], metal, [x, 0.38, z]);
        box([0.14, 0.05, 0.14], copper, [x, 0.74, z]);
      }
    box([2.95, 0.055, 0.11], metal, [0, 0.92, -1.1]);
    box([2.95, 0.055, 0.11], metal, [0, 0.92, 1.1]);
    box([0.11, 0.055, 2.1], metal, [-1.47, 0.92, 0]);
    box([0.11, 0.055, 2.1], metal, [1.47, 0.92, 0]);
    const coreRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.49, 0.009, 6, 80),
      new THREE.MeshBasicMaterial({
        color: 0x8be4d5,
        transparent: true,
        opacity: 0.65,
      }),
    );
    coreRing.rotation.x = Math.PI / 2;
    coreRing.position.y = 0.49;
    chip.add(coreRing);
    let frame = 0,
      last = 0,
      elapsed = 0,
      disposed = false,
      dragging = false,
      visible = !document.hidden,
      fit = 9;
    function request() {
      if (!frame && !disposed && visible) frame = requestAnimationFrame(render);
    }
    function render(time = 0) {
      frame = 0;
      if (disposed || !visible) return;
      const running = current.current.motion && !current.current.suspended;
      if (running && time - last < 32) {
        request();
        return;
      }
      const dt = Math.min((time - last) / 1000, 0.05);
      last = time;
      if (running) {
        elapsed += dt;
        lid.position.y = 0.9 + Math.sin(elapsed * 0.65) * 0.035;
        coreRing.rotation.z = elapsed * 0.12;
        glow.emissiveIntensity = 0.8 + Math.sin(elapsed * 1.2) * 0.12;
      }
      const [a, b] = current.current.qubit || [1, 0];
      glow.color.setRGB(
        0.35 + Math.abs(b) * 0.2,
        0.85,
        0.65 + Math.abs(a) * 0.2,
      );
      controls.enableDamping = current.current.motion;
      const changed = controls.update();
      renderer.render(scene, camera);
      if (import.meta.env.DEV) {
        renderer.domElement.dataset.drawCalls = String(
          renderer.info.render.calls,
        );
        renderer.domElement.dataset.triangles = String(
          renderer.info.render.triangles,
        );
      }
      if (running || dragging || changed) request();
    }
    const resize = new ResizeObserver(() => {
      const rect = container.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      renderer.setSize(rect.width, rect.height);
      camera.aspect = rect.width / rect.height;
      fit = Math.max(
        9,
        2.5 / (Math.tan(THREE.MathUtils.degToRad(19)) * camera.aspect),
      );
      camera.position.copy(direction).multiplyScalar(fit).add(controls.target);
      camera.updateProjectionMatrix();
      request();
    });
    resize.observe(container);
    const start = () => {
        dragging = true;
        request();
      },
      end = () => {
        dragging = false;
        request();
      };
    controls.addEventListener("start", start);
    controls.addEventListener("end", end);
    controls.addEventListener("change", request);
    const visibility = () => {
      visible = !document.hidden;
      if (!visible) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else request();
    };
    document.addEventListener("visibilitychange", visibility);
    const lost = (event) => {
      event.preventDefault();
      onFailure();
    };
    renderer.domElement.addEventListener("webglcontextlost", lost);
    engine.current = {
      request,
      reset() {
        camera.position
          .copy(direction)
          .multiplyScalar(fit)
          .add(controls.target);
        controls.update();
        request();
      },
    };
    onReady();
    request();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      engine.current = null;
      resize.disconnect();
      document.removeEventListener("visibilitychange", visibility);
      controls.removeEventListener("start", start);
      controls.removeEventListener("end", end);
      controls.removeEventListener("change", request);
      controls.dispose();
      renderer.domElement.removeEventListener("webglcontextlost", lost);
      const geometries = new Set(),
        materials = new Set();
      scene.traverse((item) => {
        if (item.geometry) geometries.add(item.geometry);
        if (item.material) materials.add(item.material);
      });
      geometries.forEach((item) => item.dispose());
      materials.forEach((item) => item.dispose());
      environment.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [onReady, onFailure]);
  return (
    <div className="world-stage mobile-processor" ref={host}>
      <button className="world-reset" onClick={() => engine.current?.reset()}>
        Reset 3D view ↺
      </button>
      <p className="processor-caption">
        QUANTUM PROCESSOR <span>AN INTERACTIVE DESIGN STUDY</span>
      </p>
      <nav className="processor-stations" aria-label="3D workspace stations">
        <button onClick={() => onOpen("research")}>
          Research <span>↗</span>
        </button>
        <button onClick={() => onOpen("work")}>
          Projects <span>↗</span>
        </button>
        <button onClick={() => onOpen("quantum")}>
          Play <span>↗</span>
        </button>
      </nav>
    </div>
  );
}
