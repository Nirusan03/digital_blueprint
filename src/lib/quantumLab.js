// Small, exact real-amplitude simulator. Basis order is |q0 q1>.
// Teaching circuit: RY(2πx) ⊗ RY(2πy), then optional CNOT(q0 -> q1).
export function featureMap(x, y, coupled = true) {
  if (![x, y].every(value => Number.isFinite(value) && value >= 0 && value <= 1)) {
    throw new RangeError("Features must be finite numbers between 0 and 1.");
  }
  const c0 = Math.cos(Math.PI * x), s0 = Math.sin(Math.PI * x);
  const c1 = Math.cos(Math.PI * y), s1 = Math.sin(Math.PI * y);
  const state = [c0 * c1, c0 * s1, s0 * c1, s0 * s1];
  if (coupled) [state[2], state[3]] = [state[3], state[2]];
  const probabilities = state.map(amplitude => amplitude ** 2);
  return {
    state,
    probabilities,
    readout: probabilities[1] + probabilities[3],
    concurrence: Math.min(1, 2 * Math.abs(state[0] * state[3] - state[1] * state[2])),
  };
}

// SVG path of the target-qubit response as x varies, with y held fixed.
export function responsePath(y, coupled, steps = 100) {
  return Array.from({ length: steps + 1 }, (_, i) => {
    const x = i / steps;
    return `${i ? "L" : "M"}${(x * 440 + 40).toFixed(2)},${(150 - featureMap(x, y, coupled).readout * 120).toFixed(2)}`;
  }).join(" ");
}
