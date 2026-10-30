import test from "node:test";
import assert from "node:assert/strict";
import { featureMap } from "../src/lib/quantumLab.js";
const near = (actual,expected) => assert.ok(Math.abs(actual-expected)<1e-12,`${actual} != ${expected}`);

test("zero input stays in the zero basis state with or without CNOT", () => {
  for (const coupled of [false,true]) {
    assert.deepEqual(featureMap(0,0,coupled).probabilities,[1,0,0,0]);
    near(featureMap(0,0,coupled).concurrence,0);
  }
});
test("half rotation of control followed by CNOT creates a Bell pair", () => {
  const result=featureMap(.25,0,true);
  [.5,0,0,.5].forEach((p,i)=>near(result.probabilities[i],p));
  near(result.readout,.5); near(result.concurrence,1);
});
test("without coupling the target readout is independent of the other input", () => {
  for (let i=0;i<=20;i++) {
    const state=featureMap(i/20,.17,false);
    near(state.readout,Math.sin(Math.PI*.17)**2);
    near(state.concurrence,0);
  }
});
test("CNOT maps classical control one and target zero to joint eleven", () => {
  const result=featureMap(.5,0,true);
  near(result.probabilities[3],1);near(result.readout,1);near(result.concurrence,0);
});
test("all explored angles preserve probability mass and bounded entanglement", () => {
  for (let x=0;x<=20;x++) for (let y=0;y<=20;y++) for (const coupled of [false,true]) {
    const result=featureMap(x/20,y/20,coupled);
    near(result.probabilities.reduce((a,b)=>a+b,0),1);
    assert.ok(result.readout>=0&&result.readout<=1+1e-12);
    assert.ok(result.concurrence>=0&&result.concurrence<=1);
  }
});
test("untrusted non-finite and out-of-range features are rejected", () => {
  for (const x of [NaN,Infinity,-.1,1.1,"0.2"]) assert.throws(()=>featureMap(x,0),RangeError);
});
