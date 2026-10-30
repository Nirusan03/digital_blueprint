import { useEffect, useRef } from "react";
import * as THREE from "three";

// A small original circuit sculpture; one bounded render loop, no downloaded model.
export default function ProjectSculpture({ motion, replay, onReady, onFailure }) {
  const host = useRef(null), engine = useRef(null), settings = useRef({motion});
  useEffect(() => { settings.current.motion = motion; engine.current?.replay(); }, [motion,replay]);
  useEffect(() => {
    const container = host.current;
    if (!("IntersectionObserver" in window) || !("ResizeObserver" in window)) { onFailure(); return; }
    let renderer;
    try { renderer = new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:"low-power"}); }
    catch { onFailure(); return; }
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1,2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    const canvas = renderer.domElement;
    canvas.tabIndex = 0;
    canvas.setAttribute("role","img");
    canvas.setAttribute("aria-label","3D circuit sculpture. Use left and right arrow keys to rotate.");
    container.append(canvas);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(39,1,.1,40);
    camera.position.set(3.9,3.2,5.2); camera.lookAt(0,.85,0);
    scene.add(new THREE.HemisphereLight(0xe4ffff,0x172238,3));
    const key = new THREE.DirectionalLight(0xf1fff8,5); key.position.set(3,6,4); scene.add(key);
    const rim = new THREE.DirectionalLight(0x88caf4,4); rim.position.set(-4,2,-3); scene.add(rim);
    const warm = new THREE.DirectionalLight(0xffbd8e,3); warm.position.set(0,1,-4); scene.add(warm);
    const model = new THREE.Group(); model.scale.setScalar(1.25); scene.add(model);
    const silver = new THREE.MeshStandardMaterial({color:0xc3dadb,metalness:.65,roughness:.28});
    const copper = new THREE.MeshStandardMaterial({color:0xe3a16c,metalness:.58,roughness:.32});
    const dark = new THREE.MeshStandardMaterial({color:0x142d3c,metalness:.4,roughness:.38});
    const ceramic = new THREE.MeshStandardMaterial({color:0xd6eee4,metalness:.2,roughness:.28});
    const mint = new THREE.MeshStandardMaterial({color:0x8ee9cb,emissive:0x76dcb5,emissiveIntensity:.55,roughness:.4});
    const layers = [], orbiters = [];
    const box = (parent,w,h,d,x,y,z,material) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material); mesh.position.set(x,y,z); parent.add(mesh); return mesh;
    };
    const sphere = new THREE.SphereGeometry(.065,12,8);
    const base = new THREE.Group(); model.add(base); layers.push({group:base,y:0,offset:-.3});
    box(base,2.65,.14,2.65,0,0,0,dark);
    for(let i=0;i<4;i++) {
      const edge = new THREE.Mesh(new THREE.BoxGeometry(2.6,.025,.025),copper);
      edge.position.set(0,.085,i%2 ? 0 : (i===0 ? 1.3 : -1.3));
      if(i%2) { edge.rotation.y=Math.PI/2; edge.position.x=i===1 ? 1.3 : -1.3; }
      base.add(edge);
    }
    const chip = new THREE.Group(); model.add(chip); layers.push({group:chip,y:.55,offset:.6});
    box(chip,1.35,.14,1.35,0,0,0,copper);
    box(chip,1.15,.18,1.15,0,.12,0,dark);
    box(chip,.84,.06,.84,0,.25,0,ceramic);
    for(let i=0;i<7;i++) for(const side of [-1,1]) {
      const v=(i-3)*.17;
      box(chip,.22,.045,.055,side*.76,0,v,copper);
      box(chip,.055,.045,.22,v,0,side*.76,copper);
    }
    for(let x=-1;x<=1;x++) for(let z=-1;z<=1;z++) {
      const bead=new THREE.Mesh(sphere,mint); bead.position.set(x*.25,.34,z*.25); chip.add(bead);
    }
    const frame = new THREE.Group(); model.add(frame); layers.push({group:frame,y:0,offset:.75});
    for(const x of [-1.08,1.08]) for(const z of [-1.08,1.08]) {
      box(frame,.035,1.7,.035,x,.9,z,silver);
      box(frame,.13,.08,.13,x,1.77,z,copper);
      const stand = new THREE.Mesh(new THREE.CylinderGeometry(.09,.09,.1,12),copper); stand.position.set(x,.16,z); frame.add(stand);
    }
    for(const z of [-1.08,1.08]) box(frame,2.16,.04,.04,0,1.8,z,silver);
    for(const x of [-1.08,1.08]) box(frame,.04,.04,2.16,x,1.8,0,silver);
    const rings = new THREE.Group(); rings.position.y=1.1; model.add(rings); layers.push({group:rings,y:1.1,offset:.55});
    for(let i=0;i<3;i++) {
      const ring = new THREE.Group(); ring.rotation.set(i*.9,.35+i*.7,i*.55); rings.add(ring);
      ring.add(new THREE.Mesh(new THREE.TorusGeometry(1.04,.023,8,72),i===1 ? copper : silver));
      const moving = new THREE.Group(); ring.add(moving);
      const bead = new THREE.Mesh(sphere,mint); bead.position.x=1.04; moving.add(bead); orbiters.push(moving);
    }
    // Raised traces route the chip to the outer frame, as an illustrative design study.
    const routes = new THREE.Group(); base.add(routes);
    for(let i=0;i<4;i++) {
      const route=new THREE.CatmullRomCurve3([new THREE.Vector3(-1.16,.1,-.85+i*.56),new THREE.Vector3(-.9,.12,-.85+i*.56),new THREE.Vector3(-.75,.35,-.6+i*.4),new THREE.Vector3(-.35,.47,-.6+i*.4)]);
      routes.add(new THREE.Mesh(new THREE.TubeGeometry(route,12,.012,5,false),copper));
    }
    let alive=true, visible=false, frameId=0, lastDraw=-Infinity, started=performance.now(), until=started+4200;
    let targetYaw=0,targetPitch=0,currentYaw=0,currentPitch=0;
    const render = time => {
      frameId=0;
      if(!alive || !visible || document.hidden) return;
      if(time-lastDraw<30) { frameId=requestAnimationFrame(render); return; }
      lastDraw=time;
      const animated=settings.current.motion && !matchMedia("(prefers-reduced-motion: reduce)").matches;
      layers.forEach(({group,y,offset},i) => {
        const progress=animated ? THREE.MathUtils.clamp((time-started-i*70)/1800,0,1) : 1;
        // Zero velocity at both ends: replay unfolds and reassembles without a jump.
        const separation=Math.pow(Math.sin(progress*Math.PI),2);
        group.position.y=y+separation*offset;
      });
      currentYaw=THREE.MathUtils.lerp(currentYaw,animated ? targetYaw : 0,.18);
      currentPitch=THREE.MathUtils.lerp(currentPitch,animated ? targetPitch : 0,.18);
      model.rotation.y=currentYaw;
      model.rotation.x=currentPitch;
      const phase=animated ? Math.min(Math.max(time-started,0),4200)*.0006 : 1.2;
      orbiters.forEach((orbiter,i)=>{orbiter.rotation.z=phase*(i%2 ? -1 : 1)+i*2;});
      try { renderer.render(scene,camera); } catch { onFailure(); return; }
      container.dataset.renderState=animated && time<until ? "animating" : "resting";
      if(animated && time<until) frameId=requestAnimationFrame(render);
    };
    const request = () => { if(alive && visible && !document.hidden && !frameId) frameId=requestAnimationFrame(render); };
    const play = () => { started=performance.now(); until=started+4200; request(); };
    engine.current={replay:play};
    const resize = () => {
      const {width,height}=container.getBoundingClientRect();
      if(!width || !height) return;
      renderer.setSize(width,height,false); camera.aspect=width/height; camera.updateProjectionMatrix(); request();
    };
    const sizes = new ResizeObserver(resize); sizes.observe(container);
    const visibility = new IntersectionObserver(([entry])=>{
      visible=entry.isIntersecting;
      if(visible) play(); else { cancelAnimationFrame(frameId); frameId=0; container.dataset.renderState="paused"; }
    },{threshold:.08}); visibility.observe(container);
    const pointer = event => {
      if(event.pointerType!=="mouse" || !settings.current.motion) return;
      const rect=canvas.getBoundingClientRect();
      targetYaw=((event.clientX-rect.left)/rect.width-.5)*.8;
      targetPitch=((event.clientY-rect.top)/rect.height-.5)*.2;
      until=Math.max(until,performance.now()+500); request();
    };
    const leave=()=>{targetYaw=targetPitch=0; until=Math.max(until,performance.now()+600); request();};
    const keys = event => {
      if(!settings.current.motion || !["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(event.key)) return;
      event.preventDefault();
      if(event.key==="ArrowLeft") targetYaw-=.25;
      if(event.key==="ArrowRight") targetYaw+=.25;
      if(event.key==="ArrowUp") targetPitch=Math.max(-.3,targetPitch-.1);
      if(event.key==="ArrowDown") targetPitch=Math.min(.3,targetPitch+.1);
      until=Math.max(until,performance.now()+600); request();
    };
    const tabVisibility=()=>{if(document.hidden){cancelAnimationFrame(frameId);frameId=0;container.dataset.renderState="paused";}else request();};
    const lost=event=>{event.preventDefault();cancelAnimationFrame(frameId);frameId=0;onFailure();};
    canvas.addEventListener("pointermove",pointer,{passive:true}); canvas.addEventListener("pointerleave",leave);
    canvas.addEventListener("keydown",keys); canvas.addEventListener("webglcontextlost",lost);
    document.addEventListener("visibilitychange",tabVisibility);
    resize(); onReady();
    return () => {
      alive=false; cancelAnimationFrame(frameId); engine.current=null;
      visibility.disconnect(); sizes.disconnect();
      canvas.removeEventListener("pointermove",pointer); canvas.removeEventListener("pointerleave",leave);
      canvas.removeEventListener("keydown",keys); canvas.removeEventListener("webglcontextlost",lost);
      document.removeEventListener("visibilitychange",tabVisibility);
      const geometries=new Set(),materials=new Set();
      scene.traverse(object=>{if(object.geometry)geometries.add(object.geometry);if(object.material)materials.add(object.material);});
      geometries.forEach(geometry=>geometry.dispose()); materials.forEach(material=>material.dispose());
      renderer.dispose(); renderer.forceContextLoss(); canvas.remove();
    };
  },[onReady,onFailure]);
  return <div className="project-sculpture-canvas" ref={host} />;
}
