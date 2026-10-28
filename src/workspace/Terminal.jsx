import { useEffect, useRef, useState } from "react";
import { VirtualShell, HOME } from "../lib/shell";
import { CAREER, LINKS } from "./content";
import { PROJECTS } from "../constants";
import "./terminal.css";
const STORAGE = "nh-linux-files-v1";
const seed = {
  "about.txt":
    "Nirusan Hariharan\nSoftware engineer, IEEE-published quantum researcher, Co-founder & CTO at Immersive Smile Plus, and Visiting Lecturer at IIT.\n",
  "experience.md": CAREER.map(
    (role) =>
      `${role.company}\n${role.role} | ${role.year}\n${role.description.join("\n")}\n`,
  ).join("\n"),
  "research/README.md": `QuanNetDetect\nIEEE QCNC 2026\n${LINKS.paper}\nADScAI: ${LINKS.adscaiRepository}\n`,
  "selected-work/README.md": PROJECTS.map(
    (project) => `${project.title.trim()}\n${project.description}\n`,
  ).join("\n"),
  "toolkit/README.md":
    "Python / Java / C# / TypeScript / Kotlin / Swift\nFastAPI / Spring Boot / ASP.NET Core / React\nQiskit / PennyLane / Unity / VR / IoT\n",
  "play/README.md": "Run open play to explore Quantum Relay and Packet Run.\n",
  "contact.txt": "nirusan.hariharan350@gmail.com\n",
  "README.md":
    "Welcome to your browser filesystem.\n\nTry: mkdir experiments && cd experiments\necho hello > notes.txt\ncp notes.txt backup.txt\nnano notes.txt\n\nTab completes commands and paths. Arrow keys recall commands.\nYour home directory and /tmp are writable. No files on the host computer are accessed.\n",
};
function initialShell() {
  let saved;
  try {
    saved = JSON.parse(localStorage.getItem(STORAGE));
  } catch {
    /* Fresh sandbox. */
  }
  return new VirtualShell(seed, saved);
}
export default function Terminal({ onOpen, onExit }) {
  const [shell] = useState(initialShell);
  const [lines, setLines] = useState([
    "NH Linux / browser sandbox",
    "Type help, or explore with ls. Files stay in this browser.",
  ]);
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState([]);
  const historyIndex = useRef(0),
    draftCommand = useRef("");
  const [editor, setEditor] = useState(null),
    [buffer, setBuffer] = useState("");
  const [confirmExit, setConfirmExit] = useState(false),
    [status, setStatus] = useState("");
  const scroll = useRef(null),
    input = useRef(null),
    textArea = useRef(null);
  const prompt = `visitor@nh:${shell.cwd === HOME || shell.cwd.startsWith(HOME + "/") ? "~" + shell.cwd.slice(HOME.length) : shell.cwd} $`;
  useEffect(() => {
    scroll.current?.scrollTo({ top: scroll.current.scrollHeight });
  }, [lines]);
  useEffect(() => {
    const frame = requestAnimationFrame(() =>
      (editor ? textArea : input).current?.focus({ preventScroll: true }),
    );
    return () => cancelAnimationFrame(frame);
  }, [editor]);
  const append = (...items) =>
    setLines((previous) => [...previous, ...items.filter(Boolean)].slice(-150));
  const persist = () => {
    try {
      localStorage.setItem(STORAGE, JSON.stringify(shell.serialize()));
    } catch {
      setStatus(
        "Browser storage is unavailable. Files remain in this session.",
      );
    }
  };
  const submit = (event) => {
    event.preventDefault();
    if (!command.trim()) return;
    const entry = command,
      nextHistory = [...history, entry].slice(-100);
    const result = shell.run(entry, nextHistory);
    setCommand("");
    setHistory(nextHistory);
    historyIndex.current = nextHistory.length;
    draftCommand.current = "";
    append(`${prompt} ${entry}`, result.output);
    persist();
    if (result.action?.type === "clear") setLines([]);
    if (result.action?.type === "exit") onExit?.();
    if (result.action?.type === "open") onOpen(result.action.app);
    if (result.action?.type === "edit") {
      setEditor(result.action);
      setBuffer(result.action.text);
      setStatus("");
      setConfirmExit(false);
    }
    input.current?.focus();
  };
  const keyDown = (event) => {
    if (event.key === "Tab" && !event.shiftKey) {
      event.preventDefault();
      const matches = shell.complete(command);
      if (matches.length === 1)
        setCommand(matches[0] + (matches[0].endsWith("/") ? "" : " "));
      else if (matches.length) {
        let common = matches[0];
        while (!matches.every((match) => match.startsWith(common)))
          common = common.slice(0, -1);
        if (common.length > command.length) setCommand(common);
        else
          append(
            matches
              .map((match) => match.slice(match.lastIndexOf(" ") + 1))
              .join("    "),
          );
      }
    } else if (["ArrowUp", "ArrowDown"].includes(event.key)) {
      event.preventDefault();
      if (historyIndex.current === history.length)
        draftCommand.current = command;
      historyIndex.current = Math.max(
        0,
        Math.min(
          history.length,
          historyIndex.current + (event.key === "ArrowUp" ? -1 : 1),
        ),
      );
      setCommand(
        historyIndex.current === history.length
          ? draftCommand.current
          : history[historyIndex.current] || "",
      );
    } else if (event.ctrlKey && event.key.toLowerCase() === "l") {
      event.preventDefault();
      setLines([]);
    } else if (event.ctrlKey && event.key.toLowerCase() === "c") {
      event.preventDefault();
      append(`${prompt} ${command}^C`);
      setCommand("");
    } else if (event.ctrlKey && event.key.toLowerCase() === "u") {
      event.preventDefault();
      setCommand("");
    } else if (event.ctrlKey && ["a", "e"].includes(event.key.toLowerCase())) {
      event.preventDefault();
      const at = event.key.toLowerCase() === "a" ? 0 : command.length;
      input.current.setSelectionRange(at, at);
    }
  };
  const save = (exit = false) => {
    try {
      shell.write(editor.path, buffer);
      persist();
      setEditor((previous) => (exit ? null : { ...previous, text: buffer }));
      setStatus(`Wrote ${buffer.split("\n").length} lines to ${editor.path}`);
      setConfirmExit(false);
    } catch (error) {
      setStatus(error.message);
    }
  };
  const closeEditor = () => {
    if (buffer !== editor.text) setConfirmExit(true);
    else {
      setEditor(null);
      setStatus("");
    }
  };
  const editorKeys = (event) => {
    if (
      event.ctrlKey &&
      ["o", "s", "x", "g"].includes(event.key.toLowerCase())
    ) {
      event.preventDefault();
      event.stopPropagation();
      if (["o", "s"].includes(event.key.toLowerCase())) save();
      else if (event.key.toLowerCase() === "x") closeEditor();
      else
        setStatus(
          "Ctrl+O saves. Ctrl+X exits. Tab inserts two spaces. Your file stays in this browser.",
        );
    } else if (event.key === "Tab") {
      event.preventDefault();
      const start = event.currentTarget.selectionStart,
        end = event.currentTarget.selectionEnd;
      setBuffer(buffer.slice(0, start) + "  " + buffer.slice(end));
      requestAnimationFrame(() =>
        textArea.current?.setSelectionRange(start + 2, start + 2),
      );
    } else if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      setConfirmExit(false);
    }
  };
  if (editor)
    return (
      <div className="nano-editor">
        <div className="nano-header">
          <span>nano</span>
          <span>{editor.path.slice(editor.path.lastIndexOf("/") + 1)}</span>
          <span>{buffer !== editor.text ? "Modified" : "Saved"}</span>
        </div>
        <textarea
          ref={textArea}
          maxLength={64000}
          aria-label={`Edit ${editor.path}`}
          value={buffer}
          onChange={(event) => setBuffer(event.target.value)}
          onKeyDown={editorKeys}
          spellCheck="false"
          autoCapitalize="off"
          autoCorrect="off"
        />
        <p role="status" className="nano-status">
          {status || editor.path}
        </p>
        {confirmExit ? (
          <div
            className="nano-confirm"
            role="group"
            aria-label="Unsaved changes"
          >
            <p>Save modified buffer?</p>
            <button onClick={() => save(true)}>Save and exit</button>
            <button
              onClick={() => {
                setEditor(null);
                setConfirmExit(false);
              }}
            >
              Discard changes
            </button>
            <button onClick={() => setConfirmExit(false)}>Cancel</button>
          </div>
        ) : (
          <div className="nano-shortcuts">
            <button
              onClick={() =>
                setStatus(
                  "Ctrl+O saves. Ctrl+X exits. Files stay in this browser.",
                )
              }
            >
              ^G Help
            </button>
            <button onClick={() => save()}>^O Write out</button>
            <button onClick={closeEditor}>^X Exit</button>
          </div>
        )}
      </div>
    );
  return (
    <div className="terminal-app linux-terminal">
      <div
        className="terminal-output"
        ref={scroll}
        role="log"
        aria-live="polite"
        aria-relevant="additions"
      >
        {lines.map((line, index) => (
          <pre
            key={index}
            className={line.startsWith("visitor@") ? "terminal-command" : ""}
          >
            {line}
          </pre>
        ))}
      </div>
      <form onSubmit={submit}>
        <label htmlFor="terminal-input">{prompt}</label>
        <input
          ref={input}
          id="terminal-input"
          maxLength={4096}
          value={command}
          onChange={(event) => setCommand(event.target.value)}
          onKeyDown={keyDown}
          autoComplete="off"
          spellCheck="false"
          autoCapitalize="off"
          autoCorrect="off"
          aria-label="Terminal command"
        />
        <button type="submit" aria-label="Run command">
          ↵
        </button>
      </form>
      <p className="terminal-note">
        Tab completes · ↑↓ history · Ctrl+L clears ·{" "}
        <span>Shift+Tab moves focus</span>
      </p>
      {status && (
        <p className="terminal-note" role="status">
          {status}
        </p>
      )}
    </div>
  );
}
