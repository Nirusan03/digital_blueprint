import test from "node:test";
import assert from "node:assert/strict";
import {
  applyGate,
  INITIAL_QUBIT,
  measure,
  probabilities,
} from "../src/lib/qubit.js";
const close = (actual, expected) =>
  actual.forEach((value, i) =>
    assert.ok(Math.abs(value - expected[i]) < 1e-12),
  );
test("Hadamard makes equal probabilities and is its own inverse", () => {
  const state = applyGate(INITIAL_QUBIT, "H");
  close(probabilities(state), [0.5, 0.5]);
  close(applyGate(state, "H"), INITIAL_QUBIT);
});
test("X flips basis states and is its own inverse", () => {
  close(applyGate(INITIAL_QUBIT, "X"), [0, 1]);
  close(applyGate(applyGate(INITIAL_QUBIT, "X"), "X"), INITIAL_QUBIT);
});
test("phase changes interfere: H Z H maps zero to one", () => {
  const plus = applyGate(INITIAL_QUBIT, "H");
  const minus = applyGate(plus, "Z");
  close(probabilities(plus), probabilities(minus));
  close(probabilities(applyGate(minus, "H")), [0, 1]);
});
test("long gate sequences preserve normalization", () => {
  let state = INITIAL_QUBIT;
  for (let i = 0; i < 1000; i++) {
    state = applyGate(state, ["H", "X", "Z"][i % 3]);
    assert.ok(
      Math.abs(probabilities(state).reduce((a, b) => a + b) - 1) < 1e-12,
    );
  }
});
test("measurement follows the Born probabilities and collapses the state", () => {
  const plus = applyGate(INITIAL_QUBIT, "H");
  assert.deepEqual(measure(plus, 0), { result: 0, state: [1, 0] });
  assert.deepEqual(measure(plus, 0.9), { result: 1, state: [0, 1] });
  assert.equal(measure([1, 0], 0.999999).result, 0);
  assert.equal(measure([0, 1], 0).result, 1);
});
test("repeated measurement remains deterministic after collapse", () => {
  const first = measure(applyGate(INITIAL_QUBIT, "H"), 0.75);
  for (const sample of [0, 0.3, 0.99])
    assert.equal(measure(first.state, sample).result, first.result);
});
test("rejects unknown gates and invalid probability samples", () => {
  assert.throws(() => applyGate(INITIAL_QUBIT, "Y"));
  for (const sample of [-1, 1, NaN])
    assert.throws(() => measure(INITIAL_QUBIT, sample), RangeError);
});
