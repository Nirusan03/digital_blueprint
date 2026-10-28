export function newPacketRun(seed = 7319) {
  return {
    status: "ready",
    time: 0,
    score: 0,
    shields: 3,
    lane: 1,
    objects: [],
    nextSpawn: 0.2,
    seed: seed >>> 0,
    serial: 0,
    hitFlash: 0,
    collected: 0,
  };
}
function random(state) {
  let n = state.seed;
  n ^= n << 13;
  n ^= n >>> 17;
  n ^= n << 5;
  state.seed = n >>> 0;
  return state.seed / 4294967296;
}
export function steerPacketRun(state, direction) {
  state.lane = Math.max(0, Math.min(2, state.lane + direction));
}
export function advancePacketRun(state, delta) {
  if (state.status !== "running") return state;
  const dt = Math.max(0, Math.min(delta, 0.05));
  state.time += dt;
  state.hitFlash = Math.max(0, state.hitFlash - dt);
  state.nextSpawn -= dt;
  if (state.nextSpawn <= 0) {
    state.objects.push({
      id: state.serial++,
      lane: Math.floor(random(state) * 3),
      kind: random(state) > 0.36 ? "malware" : "packet",
      z: 0,
      checked: false,
    });
    state.nextSpawn = 0.68 + random(state) * 0.35;
  }
  for (const object of state.objects) {
    object.z += dt * (0.29 + state.time * 0.004);
    if (object.z >= 0.94 && !object.checked) {
      object.checked = true;
      if (object.lane === state.lane) {
        if (object.kind === "malware") {
          state.shields--;
          state.hitFlash = 0.24;
        } else {
          state.score += 50;
          state.collected++;
        }
      } else if (object.kind === "malware") state.score += 10;
    }
  }
  state.objects = state.objects.filter((object) => object.z < 1.12);
  if (state.shields <= 0) state.status = "lost";
  else if (state.time >= 45) {
    state.status = "won";
    state.score += 200;
  }
  return state;
}
