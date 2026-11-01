import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import portrait from "../assets/portraits/nirusan-cutout-v3.webp";

export const stations = [
  { id: "work", label: "Projects", position: [-2.25, 0.72, 1.25] },
  { id: "about", label: "About me", position: [-2.2, 0.9, -1.55] },
  { id: "experience", label: "Experience", position: [0.15, 1.15, -2.35] },
  { id: "research", label: "Research", position: [2.25, 0.65, -1.2] },
  { id: "terminal", label: "Terminal", position: [2.25, 0.9, 1.45] },
  { id: "quantum", label: "Quantum relay", position: [0, 2.5, 0] },
  { id: "immersive", label: "Immersive Smile", position: [-0.25, 0.7, 2.45] },
];

const SIGNAL = 0xff5a1f;

function terminalTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 320;
  const context = canvas.getContext("2d");
  context.fillStyle = "#08090a";
  context.fillRect(0, 0, 512, 320);
  context.font = "500 26px 'JetBrains Mono', ui-monospace, monospace";
  ["visitor@nh ~ %", "> help", "work  about  play", "_"].forEach((line, i) => {
    context.fillStyle = i === 3 ? "#ff5a1f" : "#e9e6df";
    context.fillText(line, 34, 70 + i * 54);
  });
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function softTexture(stops) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 256;
  const context = canvas.getContext("2d");
  const gradient = context.createRadialGradient(128, 128, 0, 128, 128, 128);
  stops.forEach(([at, color]) => gradient.addColorStop(at, color));
  context.fillStyle = gradient;
  context.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(canvas);
}

// The machined bench shared by the scrolling film and the desktop wallpaper.
// Static meshes that share a material become one draw call.
function bake(group, live) {
  group.updateMatrixWorld(true);
  const inverse = group.matrixWorld.clone().invert();
  const byMaterial = new Map();
  group.children.forEach((child) => {
    if (!child.isMesh || live.has(child)) return;
    if (!byMaterial.has(child.material)) byMaterial.set(child.material, []);
    byMaterial.get(child.material).push(child);
  });
  byMaterial.forEach((meshes, material) => {
    if (meshes.length < 2) return;
    const parts = meshes.map((mesh) => mesh.geometry.clone().applyMatrix4(new THREE.Matrix4().multiplyMatrices(inverse, mesh.matrixWorld)));
    const merged = mergeGeometries(parts, false);
    parts.forEach((part) => part.dispose());
    if (!merged) return;
    const mesh = new THREE.Mesh(merged, material);
    mesh.castShadow = mesh.receiveShadow = meshes[0].castShadow;
    meshes.forEach((item) => { item.geometry.dispose(); item.removeFromParent(); });
    group.add(mesh);
  });
}

export function buildWorkbench({ scene, renderer, level = "high", reveal: blueprint = false, onTexture = () => {} }) {
  const low = level === "low";
  let environment = null, key = null;
  if (!low) {
  const pmrem = new THREE.PMREMGenerator(renderer),
    room = new RoomEnvironment();
  environment = pmrem.fromScene(room, 0.04);
  scene.environment = environment.texture;
  scene.environmentIntensity = 0.6;
  room.dispose();
  pmrem.dispose();
  scene.add(new THREE.HemisphereLight(0xffffff, 0x0a0a0a, 1.1));
  key = new THREE.DirectionalLight(0xfff6ea, 4.2);
  key.position.set(-3.5, 8, 4.5);
  {
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.left = key.shadow.camera.bottom = -5;
    key.shadow.camera.right = key.shadow.camera.top = 5;
    key.shadow.bias = -0.0006;
    key.shadow.radius = 5;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    // The bench holds still, so shadows are drawn once, when it is complete.
    renderer.shadowMap.autoUpdate = false;
  }
  scene.add(key);
  const rim = new THREE.DirectionalLight(SIGNAL, 3.4);
  rim.position.set(4.5, 2.5, -4.5);
  scene.add(rim);
  const fill = new THREE.DirectionalLight(0xd9dde2, 0.9);
  fill.position.set(-5, 2, -2);
  scene.add(fill);
  }

  const reveal = new THREE.Plane(new THREE.Vector3(0, -1, 0), 40);
  const wireReveal = new THREE.Plane(new THREE.Vector3(0, 1, 0), -40);
  const solid = (Type, parameters) =>
    new Type(blueprint ? { ...parameters, clippingPlanes: [reveal] } : parameters);
  // Phones use the same lit materials baked into textures (public/film/matcap): one texture read
  // per pixel instead of the full lighting maths, so they can draw sharp and at full frame rate.
  const textures = [];
  const matcaps = new THREE.TextureLoader();
  const lit = (name, Type, parameters) => {
    if (!low) return solid(Type, parameters);
    const matcap = matcaps.load(`/film/matcap/${name}.webp`, onTexture);
    matcap.colorSpace = THREE.SRGBColorSpace;
    textures.push(matcap);
    return solid(THREE.MeshMatcapMaterial, { matcap, toneMapped: false });
  };
  const metal = lit("metal", THREE.MeshStandardMaterial, { color: 0xa9abae, metalness: 0.94, roughness: 0.24 });
  const dark = lit("dark", THREE.MeshStandardMaterial, { color: 0x0f1012, metalness: 0.75, roughness: 0.38 });
  const graphite = lit("graphite", THREE.MeshStandardMaterial, { color: 0x0e0f11, metalness: 0.4, roughness: 0.58 });
  const copper = lit("copper", THREE.MeshStandardMaterial, { color: 0xd8773c, metalness: 0.92, roughness: 0.28 });
  const ceramic = lit("ceramic", THREE.MeshStandardMaterial, { color: 0xe9e5dc, metalness: 0.15, roughness: 0.36 });
  const signal = low ? solid(THREE.MeshBasicMaterial, { color: SIGNAL, toneMapped: false }) : solid(THREE.MeshStandardMaterial, { color: SIGNAL, emissive: SIGNAL, emissiveIntensity: 1.5, roughness: 0.4 });
  const white = low ? solid(THREE.MeshBasicMaterial, { color: 0xfff6ea, toneMapped: false }) : solid(THREE.MeshStandardMaterial, { color: 0xffffff, emissive: 0xfff1e0, emissiveIntensity: 0.9, roughness: 0.4 });

  const wireMaterial = new THREE.LineBasicMaterial({
    color: SIGNAL, transparent: true, opacity: 0, depthWrite: false, clippingPlanes: [wireReveal],
  });
  const wired = [];
  const live = new Set();
  const mesh = (geometry, material, parent = scene, x = 0, y = 0, z = 0) => {
    const item = new THREE.Mesh(geometry, material);
    item.position.set(x, y, z);
    item.castShadow = item.receiveShadow = !low;
    parent.add(item);
    if (blueprint && (geometry.type === "BoxGeometry" || geometry.type === "CylinderGeometry")) wired.push(item);
    return item;
  };
  const box = (x, y, z, material, parent, px = 0, py = 0, pz = 0) =>
    mesh(new THREE.BoxGeometry(x, y, z), material, parent, px, py, pz);
  const cylinder = (r, h, material, parent, px = 0, py = 0, pz = 0) =>
    mesh(new THREE.CylinderGeometry(r, r, h, low ? 48 : 64), material, parent, px, py, pz);
  const ring = (r, t, material, parent, px = 0, py = 0, pz = 0) => {
    const item = mesh(new THREE.TorusGeometry(r, t, low ? 6 : 8, low ? 96 : 112), material, parent, px, py, pz);
    item.rotation.x = Math.PI / 2;
    return item;
  };

  const bench = new THREE.Group();
  scene.add(bench);
  cylinder(3.25, 0.22, dark, bench, 0, -0.3, 0);
  cylinder(3.15, 0.055, graphite, bench, 0, -0.16, 0);
  ring(3.22, 0.024, copper, bench, 0, -0.19, 0);
  ring(2.99, 0.01, metal, bench, 0, -0.125, 0);
  ring(1.2, 0.01, metal, bench, 0, -0.123, 0);
  const ticks = 72;
  for (let i = 0; i < ticks; i++) {
    const a = (i / ticks) * Math.PI * 2;
    const tick = new THREE.Mesh(
      new THREE.BoxGeometry(0.014, 0.008, i % 6 === 0 ? 0.13 : 0.05),
      i % 6 === 0 ? ceramic : metal,
    );
    tick.position.set(Math.sin(a) * 3.06, -0.119, Math.cos(a) * 3.06);
    tick.rotation.y = a;
    bench.add(tick);
  }
  for (const x of [-1.7, 1.7])
    for (const z of [-1.7, 1.7]) {
      cylinder(0.16, 0.5, metal, bench, x, -0.65, z);
      cylinder(0.27, 0.09, dark, bench, x, -0.91, z);
    }

  const shadowTexture = softTexture([[0, "rgba(0,0,0,.7)"], [0.6, "rgba(0,0,0,.4)"], [1, "rgba(0,0,0,0)"]]);
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(8.5, 8.5),
    new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false }),
  );
  shadow.position.y = -0.99;
  shadow.rotation.x = -Math.PI / 2;
  scene.add(shadow);

  let photo = null;
  const objects = [],
    routes = [];
  textures.push(shadowTexture);
  stations
    .filter((station) => station.id !== "quantum")
    .forEach((station, i) => {
      const group = new THREE.Group();
      group.position.set(station.position[0], 0, station.position[2]);
      group.userData.app = station.id;
      group.rotation.y = Math.atan2(station.position[0], station.position[2]);
      scene.add(group);
      objects.push(group);
      cylinder(0.64, 0.13, dark, group, 0, -0.08, 0);
      ring(0.6, 0.013, i % 2 ? ceramic : copper, group, 0, -0.005, 0);
      const cable = new THREE.CatmullRomCurve3([
        new THREE.Vector3(station.position[0], -0.08, station.position[2]),
        new THREE.Vector3(station.position[0] * 0.6, 0.02, station.position[2] * 0.6),
        new THREE.Vector3(0, 0.06, 0),
      ]);
      routes.push(cable);
      mesh(new THREE.TubeGeometry(cable, low ? 16 : 20, 0.02, 5, false), i % 2 ? copper : metal, bench);
      if (station.id === "work") {
        box(0.88, 0.25, 0.68, metal, group, 0, 0.18, 0);
        box(0.72, 0.06, 0.51, dark, group, 0, 0.34, 0);
        for (let n = 0; n < 10; n++)
          box(0.035, 0.23, 0.48, copper, group, (n - 4.5) * 0.065, 0.46, 0);
        ring(0.27, 0.04, graphite, group, 0, 0.61, 0);
        cylinder(0.09, 0.06, metal, group, 0, 0.62, 0);
        for (let n = 0; n < 6; n++) {
          const blade = box(0.08, 0.018, 0.29, dark, group,
            Math.sin((n * Math.PI) / 3) * 0.12, 0.635, Math.cos((n * Math.PI) / 3) * 0.12);
          blade.rotation.y = (n * Math.PI) / 3 + 0.4;
        }
      } else if (station.id === "about") {
        box(0.87, 1.22, 0.075, metal, group, 0, 0.75, 0);
        box(0.96, 0.08, 0.45, dark, group, 0, 0.1, 0);
        box(0.76, 1.1, 0.001, dark, group, 0, 0.76, 0.039);
        const material = solid(THREE.MeshBasicMaterial, {
          color: 0xffffff, side: THREE.DoubleSide, transparent: true, alphaTest: 0.02, depthWrite: false,
        });
        photo = new THREE.Mesh(new THREE.PlaneGeometry(0.76, 0.95), material);
        photo.position.set(0, 0.685, 0.041);
        group.add(photo);
        new THREE.TextureLoader().load(portrait, (texture) => {
          texture.colorSpace = THREE.SRGBColorSpace;
          material.map = texture;
          material.needsUpdate = true;
          onTexture(texture);
        });
      } else if (station.id === "experience") {
        box(0.72, 1.7, 0.52, metal, group, 0, 0.82, 0);
        for (let n = 0; n < 6; n++) {
          box(0.62, 0.19, 0.025, dark, group, 0, 0.2 + n * 0.23, 0.275);
          box(0.04, 0.025, 0.01, n % 2 ? white : signal, group, 0.22, 0.2 + n * 0.23, 0.295);
          for (let k = 0; k < 5; k++)
            box(0.06, 0.01, 0.012, graphite, group, -0.21 + k * 0.07, 0.2 + n * 0.23, 0.293);
        }
        box(0.8, 0.06, 0.6, copper, group, 0, 1.7, 0);
      } else if (station.id === "research") {
        for (let n = 0; n < 4; n++) {
          cylinder(0.38, 0.2, metal, group, 0, 0.15 + n * 0.24, 0);
          ring(0.375, 0.016, n === 3 ? signal : copper, group, 0, 0.23 + n * 0.24, 0);
        }
        cylinder(0.26, 0.035, dark, group, 0, 1.0, 0);
      } else if (station.id === "immersive") {
        box(1.03, 0.39, 0.47, ceramic, group, 0, 0.37, 0);
        box(0.85, 0.27, 0.03, dark, group, 0, 0.37, 0.25);
        for (const x of [-0.27, 0.27])
          mesh(new THREE.SphereGeometry(0.068, 12, 8), metal, group, x, 0.37, 0.28);
        const strap = mesh(new THREE.TorusGeometry(0.44, 0.048, 6, 24, Math.PI), dark, group, 0, 0.4, -0.1);
        strap.rotation.x = -0.25;
        mesh(new THREE.SphereGeometry(0.16, 20, 14), signal, group, 0.73, 0.18, 0.22);
        const wearable = ring(0.2, 0.055, metal, group, -0.77, 0.22, 0.1);
        wearable.rotation.x = 0.45;
      } else {
        box(0.94, 0.65, 0.07, metal, group, 0, 0.72, 0);
        const map = terminalTexture();
        textures.push(map);
        const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.84, 0.55), solid(THREE.MeshBasicMaterial, { map }));
        screen.position.set(0, 0.72, 0.04);
        group.add(screen);
        box(0.14, 0.3, 0.14, metal, group, 0, 0.25, 0);
        box(0.7, 0.055, 0.45, dark, group, 0, 0.08, 0.05);
        const keyboard = box(0.8, 0.025, 0.37, metal, group, 0, 0.03, 0.4);
        keyboard.rotation.x = 0.08;
      }
    });

  if (low) {
    const pools = stations.filter((station) => station.id !== "quantum").map((station) => {
      const plane = new THREE.PlaneGeometry(1.9, 1.9).rotateX(-Math.PI / 2);
      return plane.translate(station.position[0] * 1.02, -0.115, station.position[2] * 1.02);
    });
    pools.push(new THREE.PlaneGeometry(2.3, 2.3).rotateX(-Math.PI / 2).translate(0, -0.115, 0));
    const contact = new THREE.Mesh(mergeGeometries(pools, false), solid(THREE.MeshBasicMaterial, { map: shadowTexture, transparent: true, opacity: 0.85, depthWrite: false }));
    pools.forEach((pool) => pool.dispose());
    contact.renderOrder = 1;
    scene.add(contact);
  }

  // Suspended quantum apparatus.
  const core = new THREE.Group();
  core.userData.app = "quantum";
  core.position.y = 1.48;
  scene.add(core);
  objects.push(core);
  const frame = new THREE.Group();
  scene.add(frame);
  cylinder(0.65, 0.18, metal, frame, 0, 0.05, 0);
  cylinder(0.48, 0.2, dark, frame, 0, 0.21, 0);
  ring(0.49, 0.02, signal, frame, 0, 0.31, 0);
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    const x = Math.sin(a) * 1.18,
      z = Math.cos(a) * 1.18;
    cylinder(0.03, 2.65, metal, frame, x, 1.18, z);
    box(0.16, 0.07, 0.16, copper, frame, x, 2.5, z);
  }
  const canopy = ring(1.66, 0.05, metal, scene, 0, 2.52, 0);
  ring(1.52, 0.011, signal, frame, 0, 2.5, 0);
  const knot = mesh(
    new THREE.TorusKnotGeometry(0.77, 0.12, low ? 200 : 220, low ? 14 : 18, 2, 3),
    lit("chrome", THREE.MeshPhysicalMaterial, { color: 0xc9c9c7, metalness: 1, roughness: 0.14, clearcoat: 1, envMapIntensity: 1.8 }),
    core,
  );
  knot.rotation.set(0.2, 0, 0.3);
  const inner = mesh(
    new THREE.IcosahedronGeometry(0.4, 3),
    lit("inner", THREE.MeshStandardMaterial, { color: 0xfff0e4, emissive: SIGNAL, emissiveIntensity: 0.65, metalness: 0.2, roughness: 0.14 }),
    core,
  );
  const orbitA = ring(1.17, 0.012, copper, core);
  orbitA.rotation.set(0.6, 0.35, 0.3);
  const orbitB = ring(1.31, 0.009, metal, core);
  orbitB.rotation.set(1.4, 0.4, -0.2);
  const vector = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), 0.76, 0xffffff, 0.15, 0.07);
  core.add(vector);
  const marker = mesh(new THREE.SphereGeometry(0.05, 10, 8), signal, core, 1.17, 0, 0);

  const glowTexture = softTexture([[0, "rgba(255,190,140,1)"], [0.25, "rgba(255,110,45,.45)"], [1, "rgba(255,90,31,0)"]]);
  textures.push(glowTexture);
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowTexture, transparent: true, opacity: 0.32, depthWrite: false, blending: THREE.AdditiveBlending,
  }));
  glow.scale.setScalar(2.6);
  core.add(glow);

  // Signals travelling along the conduits into the core.
  const pulseMaterial = new THREE.MeshBasicMaterial({ color: 0xffb489 });
  const pulses = routes.map((route, i, list) => {
    const pulse = new THREE.Mesh(new THREE.SphereGeometry(0.028, 10, 8), pulseMaterial);
    pulse.userData = { route, offset: i / list.length };
    live.add(pulse);
    bench.add(pulse);
    return pulse;
  });

  // Dust in the light cone.
  const count = low ? 200 : 300;
  const dustPositions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2,
      r = 1.2 + Math.random() * 7;
    dustPositions.set([Math.cos(a) * r, -1 + Math.random() * 7, Math.sin(a) * r], i * 3);
  }
  const dustGeometry = new THREE.BufferGeometry();
  dustGeometry.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
  const dust = new THREE.Points(dustGeometry, new THREE.PointsMaterial({
    color: 0xffd9c2, size: 0.018, transparent: true, opacity: 0.5, depthWrite: false, blending: THREE.AdditiveBlending,
  }));
  scene.add(dust);

  // Blueprint lines, used once while the bench materialises from the floor up.
  scene.updateMatrixWorld(true);
  let wires = null;
  if (wired.length) {
    const parts = wired.map((item) => new THREE.EdgesGeometry(item.geometry, 28).applyMatrix4(item.matrixWorld));
    wires = new THREE.LineSegments(mergeGeometries(parts, false), wireMaterial);
    parts.forEach((part) => part.dispose());
    scene.add(wires);
  }
  [bench, frame, ...objects.filter((group) => group !== core)].forEach((group) => bake(group, live));

  const setReveal = (amount) => {
    const draw = Math.min(1, amount / 0.28);
    const sweep = Math.min(1, Math.max(0, (amount - 0.2) / 0.8));
    const eased = sweep * sweep * (3 - 2 * sweep);
    const height = amount >= 1 ? 40 : -1.15 + eased * 4.4;
    reveal.constant = height;
    wireReveal.constant = -height;
    wireMaterial.opacity = draw * (1 - eased * eased) * 0.85;
    shadow.material.opacity = eased;
    // These don't take the clipping plane, so they wait: the photo fades in once its plate has formed.
    const details = amount >= 0.9;
    vector.visible = details;
    pulses.forEach((pulse) => { pulse.visible = details; });
    const face = Math.min(1, Math.max(0, (height - 0.75) / 0.6));
    if (photo) { photo.visible = face > 0; photo.material.opacity = face; }
    if (amount >= 1 && wires) {
      wires.geometry.dispose();
      wires.removeFromParent();
      wires = null;
    }
  };

  const point = new THREE.Vector3();
  const tick = (elapsed) => {
    knot.rotation.y = elapsed * 0.22;
    knot.rotation.z = 0.3 + Math.sin(elapsed * 0.2) * 0.08;
    orbitA.rotation.z = elapsed * 0.09;
    orbitB.rotation.y = 0.4 + elapsed * 0.05;
    marker.position.set(Math.cos(elapsed * 0.7) * 1.17, Math.sin(elapsed * 0.7) * 0.42, Math.sin(elapsed * 0.7) * 0.95);
    inner.rotation.y = -elapsed * 0.16;
    canopy.rotation.z = Math.sin(elapsed * 0.18) * 0.025;
    dust.rotation.y = elapsed * 0.008;
    pulses.forEach((pulse) => {
      pulse.userData.route.getPointAt((elapsed * 0.14 + pulse.userData.offset) % 1, point);
      pulse.position.copy(point).setY(point.y + 0.03);
    });
  };

  return {
    objects, knot, inner, core, glow, vector, tick, setReveal,
    bakeShadows: () => { if (!low) renderer.shadowMap.needsUpdate = true; },
    dropShadows: () => {
      if (!key?.castShadow) return;
      key.castShadow = false;
      scene.traverse((object) => { if (object.material) object.material.needsUpdate = true; });
    },
    dispose: () => {
      textures.forEach((texture) => texture.dispose());
      environment?.dispose();
      if (wires) wires.geometry.dispose();
      wireMaterial.dispose();
    },
  };
}

export function disposeScene(scene) {
  const geometries = new Set(),
    materials = new Set(),
    maps = new Set();
  scene.traverse((object) => {
    if (object.geometry) geometries.add(object.geometry);
    if (object.material)
      [object.material].flat().forEach((material) => {
        materials.add(material);
        if (material.map) maps.add(material.map);
      });
  });
  geometries.forEach((item) => item.dispose());
  materials.forEach((item) => item.dispose());
  maps.forEach((item) => item.dispose());
}
