import { useEffect, useRef, useState } from "react";
const help =
  "Commands: help, ls, whoami, pwd, cat about.txt, cat experience.md, projects, open <research|about|experience|recognition|work|stack|quantum|contact>, clear";
export default function Terminal({ onOpen }) {
  const [lines, setLines] = useState([
    "Portfolio shell / local browser session",
    "Type help to see the available commands.",
  ]);
  const [command, setCommand] = useState("");
  const scroll = useRef(null);
  useEffect(() => {
    scroll.current?.scrollTo({ top: scroll.current.scrollHeight });
  }, [lines]);
  const submit = (event) => {
    event.preventDefault();
    const input = command.trim();
    if (!input) return;
    setCommand("");
    const lower = input.toLowerCase();
    if (lower === "clear") {
      setLines([]);
      return;
    }
    let output;
    if (lower === "help") output = help;
    else if (lower === "ls")
      output =
        "about.txt    experience.md    selected-work/    toolkit/    quantum-relay/    contact";
    else if (lower === "whoami")
      output = "visitor — a local session in Nirusan Hariharan’s portfolio";
    else if (lower === "pwd") output = "/home/visitor";
    else if (lower === "cat about.txt")
      output =
        "Nirusan Hariharan. Software engineer, IEEE-published quantum researcher, Co-founder & CTO at Immersive Smile Plus, and Visiting Lecturer at IIT.";
    else if (lower === "cat experience.md")
      output =
        "Niroga AI Inc. / BlueLotus360 / Altrium / Vetstoria / Izatic / Immersive Smile Plus. Run: open experience";
    else if (lower === "projects") {
      output = "Opening the project directory.";
      onOpen("work");
    } else if (lower.startsWith("open ")) {
      const app = lower.slice(5).trim();
      if (
        [
          "work",
          "about",
          "research",
          "recognition",
          "experience",
          "stack",
          "quantum",
          "contact",
        ].includes(app)
      ) {
        onOpen(app);
        output = `Opened ${app}.`;
      } else
        output = `No file named “${app}”. Type help for available commands.`;
    } else output = `Command not found: ${input}. Type help.`;
    setLines((previous) => [
      ...previous.slice(-58),
      `visitor@nh:~ $ ${input}`,
      output,
    ]);
  };
  return (
    <div className="terminal-app">
      <div
        className="terminal-output"
        ref={scroll}
        role="log"
        aria-live="polite"
      >
        {lines.map((line, index) => (
          <p
            key={`${index}-${line}`}
            className={line.startsWith("visitor@") ? "terminal-command" : ""}
          >
            {line}
          </p>
        ))}
      </div>
      <form onSubmit={submit}>
        <label htmlFor="terminal-input">visitor@nh:~ $</label>
        <input
          id="terminal-input"
          value={command}
          onChange={(event) => setCommand(event.target.value)}
          autoComplete="off"
          spellCheck="false"
          aria-label="Terminal command"
        />
        <button type="submit" aria-label="Run command">
          ↵
        </button>
      </form>
      <p className="terminal-note">
        A portfolio shell. Commands stay in this browser.
      </p>
    </div>
  );
}
