import test from "node:test";
import assert from "node:assert/strict";
import { VirtualShell, HOME, resolvePath } from "../src/lib/shell.js";
const fresh = () =>
  new VirtualShell({
    "about.txt": "Nirusan\nQuantum computing\n",
    "research/paper.txt": "QuanNetDetect\n",
  });
test("Linux navigation normalizes home, parent, and absolute paths", () => {
  const shell = fresh();
  assert.equal(shell.run("cd research && pwd").output, HOME + "/research");
  assert.equal(shell.run("cd && pwd").output, HOME);
  assert.equal(resolvePath("../../..", HOME), "/");
});
test("file workflow supports quoted names, mkdir, copy, move, redirect and nano", () => {
  const shell = fresh();
  assert.equal(
    shell.run("mkdir -p experiments/notes && cd experiments/notes").code,
    0,
  );
  assert.equal(shell.run('echo "hello quantum" > "my notes.txt"').code, 0);
  assert.equal(
    shell.run('cp "my notes.txt" backup.txt && mv backup.txt final.txt').code,
    0,
  );
  assert.equal(shell.read("final.txt"), "hello quantum\n");
  assert.equal(shell.run("nano above.txt").action.type, "edit");
  shell.write("above.txt", "edited locally\n");
  assert.equal(shell.run("cat above.txt").output, "edited locally");
});
test("pipes process real file content and recursive copies remain independent", () => {
  const shell = fresh();
  assert.equal(shell.run("cat about.txt | grep Quantum | wc -w").output, "2");
  assert.equal(
    shell.run("cp -r research copy && echo extra >> copy/paper.txt").code,
    0,
  );
  assert.equal(shell.read("research/paper.txt"), "QuanNetDetect\n");
});
test("missing operands report usage errors and failed && chains do not execute", () => {
  const shell = fresh();
  for (const command of ["mkdir", "cp", "nano"])
    assert.equal(shell.run(command).code, 1);
  assert.equal(shell.run("cd missing && touch should-not-exist").code, 1);
  assert.throws(() => shell.read("should-not-exist"));
});
test("system paths cannot be written and snapshot restore rejects invalid trees", () => {
  const shell = fresh();
  assert.equal(shell.run("echo bad > /usr/share/file").code, 1);
  assert.equal(shell.run("mkdir /etc").code, 1);
  assert.equal(shell.run("rm -r ~").code, 1);
  shell.run("mkdir notes && echo saved > notes/a.txt");
  const restored = new VirtualShell({}, shell.serialize());
  assert.equal(restored.read("notes/a.txt"), "saved\n");
  const invalid = new VirtualShell(
    {},
    { nodes: [["/etc/passwd", { type: "file", text: "bad" }]] },
  );
  assert.equal(invalid.nodes.has("/etc/passwd"), false);
});
test("Tab completion resolves commands and current-directory file paths", () => {
  const shell = fresh();
  assert.deepEqual(shell.complete("mk"), ["mkdir"]);
  assert.deepEqual(shell.complete("cat abo"), ["cat about.txt"]);
  assert.deepEqual(shell.complete("cd res"), ["cd research/"]);
  shell.run("cd research");
  assert.deepEqual(shell.complete("nano pa"), ["nano paper.txt"]);
});
