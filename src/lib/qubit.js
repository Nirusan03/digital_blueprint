// Real-amplitude, normalized single-qubit state. H, X and Z preserve normalization.
export const INITIAL_QUBIT = [1, 0];
export function applyGate([a, b], gate) {
  switch (gate) {
    case "H":
      return [(a + b) / Math.SQRT2, (a - b) / Math.SQRT2];
    case "X":
      return [b, a];
    case "Z":
      return [a, -b];
    default:
      throw new Error(`Unsupported gate: ${gate}`);
  }
}
export function probabilities([a, b]) {
  return [Math.min(1, Math.max(0, a * a)), Math.min(1, Math.max(0, b * b))];
}
export function measure(state, random) {
  if (!(random >= 0 && random < 1))
    throw new RangeError("Random sample must be in [0, 1).");
  const result = random < probabilities(state)[0] ? 0 : 1;
  return { result, state: result === 0 ? [1, 0] : [0, 1] };
}
