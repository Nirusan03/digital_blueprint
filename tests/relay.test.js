import test from "node:test";
import assert from "node:assert/strict";
import { applyGate, probabilities } from "../src/lib/qubit.js";
import { fidelity, MISSIONS } from "../src/lib/relay.js";
const solutions = [["X"], ["H"], ["Z"], ["Z", "H"], ["H", "X"]];
test("all five relay missions have valid solutions within their gate budgets", () => {
  MISSIONS.forEach((mission, i) => {
    assert.ok(solutions[i].length <= mission.budget);
    const state = solutions[i].reduce(applyGate, mission.initial);
    assert.ok(fidelity(state, mission.target) > 1 - 1e-10, mission.title);
    assert.ok(
      Math.abs(probabilities(state).reduce((a, b) => a + b, 0) - 1) < 1e-12,
    );
  });
});
test("fidelity distinguishes relative phase but ignores global phase", () => {
  const p = Math.SQRT1_2;
  assert.ok(fidelity([p, p], [p, -p]) < 1e-12);
  assert.ok(fidelity([p, p], [-p, -p]) > 1 - 1e-12);
  assert.equal(fidelity([1, 0], [0, 1]), 0);
});
