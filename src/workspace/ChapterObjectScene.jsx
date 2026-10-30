import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Small original models, rendered only while their section is near the viewport.
export default function ChapterObjectScene({ kind, motion, turn, onReady, onFailure }) {
  const host = useRef(null);
  const engine = useRef(null);
  const settings = useRef({ motion, turn });
  useEffect(() => { settings.current = { motion, turn }; engine.current?.update(); }, [motion, turn]);

  useEffect(() => {
    const container = host.current;
    if (!("ResizeObserver" in window)) { onFailure(); return; }
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' }); }
    catch { onFailure(); return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, .1, 50);
    camera.position.set(4.2, 3.2, 6.3); camera.lookAt(0, 0, 0);
    scene.add(new THREE.HemisphereLight(0xd7f8ef, 0x142139, 2.8));
    const light = new THREE.DirectionalLight(0xffffff, 4); light.position.set(3, 6, 5); scene.add(light);
    const warmLight = new THREE.DirectionalLight(0xffb276, 2.7); warmLight.position.set(-4, 0, -3); scene.add(warmLight);
    const silver = new THREE.MeshStandardMaterial({ color: 0xc2dfdc, metalness: .74, roughness: .23 });
    const copper = new THREE.MeshStandardMaterial({ color: 0xf2a970, metalness: .68, roughness: .28 });
    const teal = new THREE.MeshStandardMaterial({ color: 0x4cb69f, metalness: .52, roughness: .27 });
    const dark = new THREE.MeshStandardMaterial({ color: 0x183a48, metalness: .58, roughness: .32 });
    const model = new THREE.Group(); model.scale.setScalar(1.4); scene.add(model);
    const add = (geometry, material, x = 0, y = 0, z = 0, parent = model) => {
      const mesh = new THREE.Mesh(geometry, material); mesh.position.set(x, y, z); parent.add(mesh); return mesh;
    };
    const orbiters = [];
    const ring = (radius, tube, material, rx, ry, rz, parent = model) => {
      const mesh = add(new THREE.TorusGeometry(radius, tube, 10, 80), material, 0, 0, 0, parent);
      mesh.rotation.set(rx, ry, rz); return mesh;
    };
    if (kind === 'experience') {
      for (let i = 0; i < 4; i++) {
        const level = add(new THREE.CylinderGeometry(1.05 - i * .1, 1.05 - i * .1, .12, 48), i % 2 ? silver : dark, 0, -.9 + i * .49, 0);
        level.rotation.y = i * .2;
        const edge = ring(1.05 - i * .1, .025, copper, Math.PI / 2, 0, 0);
        edge.position.y = -.82 + i * .49;
        add(new THREE.CylinderGeometry(.045, .045, .42, 12), silver, -.58, -.62 + i * .49, .12);
      }
      add(new THREE.IcosahedronGeometry(.33, 1), teal, 0, 1.12, 0);
      ring(1.55, .018, silver, 1.1, .2, .3);
    } else if (kind === 'milestones') {
      add(new THREE.IcosahedronGeometry(.74, 1), copper);
      const inner = add(new THREE.OctahedronGeometry(.44, 0), teal); inner.rotation.z = Math.PI / 4;
      for (let i = 0; i < 3; i++) {
        const group = new THREE.Group(); group.rotation.set(.5 + i * .7, .35 + i, i * .55); model.add(group);
        ring(1.24, .025, i === 1 ? copper : silver, 0, 0, 0, group);
        add(new THREE.SphereGeometry(.09, 16, 12), teal, 1.24, 0, 0, group); orbiters.push(group);
      }
      add(new THREE.CylinderGeometry(.53, .73, .13, 48), dark, 0, -1.08, 0);
    } else {
      add(new THREE.BoxGeometry(2.2, .18, 1.75), dark);
      add(new THREE.BoxGeometry(.85, .22, .85), silver, 0, .2, 0);
      add(new THREE.BoxGeometry(.64, .11, .64), teal, 0, .36, 0);
      for (let i = 0; i < 7; i++) for (const side of [-1, 1]) {
        const offset = (i - 3) * .24;
        add(new THREE.BoxGeometry(.22, .07, .07), copper, side * 1.14, .02, offset);
        add(new THREE.BoxGeometry(.07, .07, .22), copper, offset, .02, side * .92);
      }
      for (let i = 0; i < 3; i++) {
        const group = new THREE.Group(); group.rotation.set(.65 + i * .65, i * .7, i * .6); group.position.y = .75; model.add(group);
        ring(.78, .022, i === 1 ? copper : silver, 0, 0, 0, group);
        add(new THREE.SphereGeometry(.075, 12, 10), teal, .78, 0, 0, group); orbiters.push(group);
      }
    }
    let frame = 0, alive = true, started = performance.now(), until = started + 5000, current = 0, lastDraw = 0;
    const render = time => {
      frame = 0;
      if (!alive || document.hidden) return;
      if (time - lastDraw < 32) { frame = requestAnimationFrame(render); return; }
      lastDraw = time;
      const animated = settings.current.motion && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const target = settings.current.turn * Math.PI / 2;
      current = animated ? THREE.MathUtils.lerp(current, target, .12) : target;
      model.rotation.y = current + (animated ? Math.min((time - started) / 5000, 1) * .32 : .2);
      orbiters.forEach((item, i) => { item.rotation.z = i * .55 + (animated ? Math.min((time - started) / 5000, 1) * (i % 2 ? -.6 : .6) : .2); });
      try { renderer.render(scene, camera); } catch { onFailure(); return; }
      container.dataset.renderState = animated && time < until ? 'animating' : 'resting';
      if (animated && time < until) frame = requestAnimationFrame(render);
    };
    const request = () => { if (alive && !document.hidden && !frame) frame = requestAnimationFrame(render); };
    engine.current = { update: () => { until = performance.now() + 850; request(); } };
    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height, false); camera.aspect = width / height; camera.updateProjectionMatrix(); request();
    };
    const observer = new ResizeObserver(resize); observer.observe(container);
    const visibility = () => { if (document.hidden) { cancelAnimationFrame(frame); frame = 0; } else request(); };
    const lost = event => { event.preventDefault(); onFailure(); };
    document.addEventListener('visibilitychange', visibility);
    renderer.domElement.addEventListener('webglcontextlost', lost);
    resize(); onReady();
    return () => {
      alive = false; cancelAnimationFrame(frame); engine.current = null; observer.disconnect();
      document.removeEventListener('visibilitychange', visibility); renderer.domElement.removeEventListener('webglcontextlost', lost);
      const geometries = new Set(), materials = new Set();
      scene.traverse(object => { if (object.geometry) geometries.add(object.geometry); if (object.material) materials.add(object.material); });
      geometries.forEach(geometry => geometry.dispose()); materials.forEach(material => material.dispose());
      renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove();
    };
  }, [kind, onReady, onFailure]);
  return <div className="chapter-object-canvas" ref={host}/>;
}
