import test from "node:test";
import assert from "node:assert/strict";
import {
  newPacketRun,
  advancePacketRun,
  steerPacketRun,
} from "../src/lib/packetRun.js";
test("steering stays within the three lanes", () => {
  const state = newPacketRun();
  for (let i = 0; i < 8; i++) steerPacketRun(state, -1);
  assert.equal(state.lane, 0);
  for (let i = 0; i < 8; i++) steerPacketRun(state, 1);
  assert.equal(state.lane, 2);
});
test("a packet scores only once and malware removes one shield", () => {
  const state = newPacketRun();
  state.status = "running";
  state.nextSpawn = 10;
  state.objects = [
    { id: 0, lane: 1, kind: "packet", z: 0.935, checked: false },
  ];
  advancePacketRun(state, 0.05);
  assert.equal(state.score, 50);
  advancePacketRun(state, 0.05);
  assert.equal(state.score, 50);
  state.objects = [
    { id: 1, lane: 1, kind: "malware", z: 0.935, checked: false },
  ];
  advancePacketRun(state, 0.05);
  assert.equal(state.shields, 2);
  advancePacketRun(state, 0.05);
  assert.equal(state.shields, 2);
});
test("paused games do not advance and a dropped frame is bounded", () => {
  const state = newPacketRun();
  state.status = "paused";
  advancePacketRun(state, 60);
  assert.equal(state.time, 0);
  state.status = "running";
  advancePacketRun(state, 60);
  assert.equal(state.time, 0.05);
});
test("three collisions end the game and a surviving signal wins", () => {
  const state = newPacketRun();
  state.status = "running";
  state.shields = 1;
  state.objects = [
    { id: 0, lane: 1, kind: "malware", z: 0.935, checked: false },
  ];
  advancePacketRun(state, 0.05);
  assert.equal(state.status, "lost");
  const winner = newPacketRun();
  winner.status = "running";
  winner.time = 44.99;
  advancePacketRun(winner, 0.02);
  assert.equal(winner.status, "won");
  assert.equal(winner.score, 200);
});
