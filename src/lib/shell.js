export const HOME = "/home/visitor";
export const COMMANDS = [
  "help",
  "ls",
  "pwd",
  "cd",
  "mkdir",
  "rmdir",
  "touch",
  "cp",
  "mv",
  "rm",
  "cat",
  "echo",
  "printf",
  "nano",
  "grep",
  "head",
  "tail",
  "wc",
  "find",
  "tree",
  "whoami",
  "uname",
  "date",
  "history",
  "clear",
  "open",
  "projects",
  "exit",
];
const APPS = {
  research: "research",
  about: "about",
  experience: "experience",
  recognition: "recognition",
  work: "work",
  projects: "work",
  stack: "stack",
  toolkit: "stack",
  quantum: "quantum",
  play: "quantum",
  contact: "contact",
};
const LIMIT = 256 * 1024;

export function resolvePath(path = "~", cwd = HOME) {
  const expanded =
    path === "~" ? HOME : path.startsWith("~/") ? HOME + path.slice(1) : path;
  const parts = (
    expanded.startsWith("/") ? expanded : `${cwd}/${expanded}`
  ).split("/");
  const output = [];
  for (const part of parts) {
    if (part === "..") output.pop();
    else if (part && part !== ".") output.push(part);
  }
  return "/" + output.join("/");
}
const parent = (path) => path.slice(0, path.lastIndexOf("/")) || "/";
const base = (path) => path.slice(path.lastIndexOf("/") + 1);

export function tokenize(input) {
  const tokens = [];
  let text = "",
    quote = null,
    started = false;
  const flush = () => {
    if (started) tokens.push({ value: text, op: false });
    text = "";
    started = false;
  };
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (char === "\\" && quote !== "'") {
      if (i + 1 < input.length) {
        const next = input[++i];
        text +=
          quote === '"' && !["$", "`", '"', "\\", "\n"].includes(next)
            ? "\\" + next
            : next;
        started = true;
      }
      continue;
    }
    if (quote) {
      if (char === quote) quote = null;
      else text += char;
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      started = true;
    } else if (/\s/.test(char)) flush();
    else if (
      [";", "|", ">"].includes(char) ||
      (char === "&" && input[i + 1] === "&")
    ) {
      flush();
      let operator = char;
      if ((char === ">" && input[i + 1] === ">") || char === "&")
        operator += input[++i];
      tokens.push({ value: operator, op: true });
    } else {
      text += char;
      started = true;
    }
  }
  if (quote) throw new Error("syntax error: unmatched quote");
  flush();
  return tokens;
}

export class VirtualShell {
  constructor(files = {}, saved = null) {
    this.cwd = HOME;
    this.previous = HOME;
    this.nodes = new Map();
    for (const path of [
      "/",
      "/home",
      HOME,
      "/tmp",
      "/usr",
      "/usr/share",
      "/usr/share/portfolio",
    ])
      this.nodes.set(path, { type: "dir" });
    for (const [path, text] of Object.entries(files)) {
      const full = resolvePath(path);
      let at = parent(full);
      while (!this.nodes.has(at)) {
        this.nodes.set(at, { type: "dir" });
        at = parent(at);
      }
      this.nodes.set(full, { type: "file", text: String(text) });
    }
    this.seed = [...this.nodes].map(([path, node]) => [path, { ...node }]);
    if (saved) {
      try {
        if (JSON.stringify(saved).length > LIMIT || !Array.isArray(saved.nodes))
          throw Error();
        const nodes = new Map(saved.nodes);
        if (nodes.size > 256) throw Error();
        for (const [path, node] of nodes) {
          if (
            typeof path !== "string" ||
            resolvePath(path) !== path ||
            !this.writable(path) ||
            !["dir", "file"].includes(node?.type) ||
            (node.type === "file" && typeof node.text !== "string")
          )
            throw Error();
        }
        for (const [path] of this.nodes)
          if (this.writable(path) && path !== HOME && path !== "/tmp")
            this.nodes.delete(path);
        for (const [path, node] of nodes) this.nodes.set(path, { ...node });
        for (const [path] of nodes)
          if (
            path !== HOME &&
            path !== "/tmp" &&
            this.nodes.get(parent(path))?.type !== "dir"
          )
            throw Error();
        const cwd = resolvePath(saved.cwd || HOME);
        if (this.nodes.get(cwd)?.type === "dir") this.cwd = cwd;
      } catch {
        this.nodes = new Map(this.seed);
      }
    }
  }
  writable(path) {
    return (
      path === HOME ||
      path.startsWith(HOME + "/") ||
      path === "/tmp" ||
      path.startsWith("/tmp/")
    );
  }
  serialize() {
    return {
      cwd: this.cwd,
      nodes: [...this.nodes].filter(([path]) => this.writable(path)),
    };
  }
  get(path) {
    const full = resolvePath(path, this.cwd),
      node = this.nodes.get(full);
    if (!node) throw Error(`${path}: No such file or directory`);
    return [full, node];
  }
  entries(path) {
    return [...this.nodes]
      .filter(([key]) => key !== path && parent(key) === path)
      .sort(([a], [b]) => a.localeCompare(b));
  }
  checkWrite(path) {
    if (!this.writable(path)) throw Error(`${path}: Permission denied`);
    if (this.nodes.get(parent(path))?.type !== "dir")
      throw Error(`${parent(path)}: No such directory`);
  }
  write(path, text, append = false) {
    const full = resolvePath(path, this.cwd);
    this.checkWrite(full);
    if (this.nodes.get(full)?.type === "dir")
      throw Error(`${path}: Is a directory`);
    const result = (append ? this.nodes.get(full)?.text || "" : "") + text;
    if (result.length > 64000)
      throw Error("File exceeds the 64 KB sandbox limit");
    const before = this.nodes.get(full);
    this.nodes.set(full, { type: "file", text: result });
    if (
      this.nodes.size > 256 ||
      JSON.stringify(this.serialize()).length > LIMIT
    ) {
      if (before) this.nodes.set(full, before);
      else this.nodes.delete(full);
      throw Error("Sandbox storage limit reached");
    }
  }
  read(path) {
    const [, node] = this.get(path);
    if (node.type !== "file") throw Error(`${path}: Is a directory`);
    return node.text;
  }
  complete(input) {
    const match = input.match(/^(.*?)([^\s]*)$/);
    const prefix = match[1],
      word = match[2];
    if (!prefix) return COMMANDS.filter((command) => command.startsWith(word));
    if (/^open\s+$/.test(prefix))
      return Object.keys(APPS)
        .filter((app) => app.startsWith(word))
        .map((app) => prefix + app);
    const slash = word.lastIndexOf("/"),
      pathPrefix = slash >= 0 ? word.slice(0, slash + 1) : "",
      leaf = word.slice(slash + 1);
    const dir = resolvePath(pathPrefix || ".", this.cwd);
    return this.entries(dir)
      .filter(([path]) => base(path).startsWith(leaf))
      .map(
        ([path, node]) =>
          prefix + pathPrefix + base(path) + (node.type === "dir" ? "/" : ""),
      );
  }
  run(input, history = []) {
    const snapshot = this.serialize(),
      previous = this.previous;
    try {
      const tokens = tokenize(input);
      let group = [],
        condition = ";",
        code = 0,
        action,
        output = [];
      const executeGroup = () => {
        if (!group.length || (condition === "&&" && code !== 0)) {
          group = [];
          return;
        }
        const pipeline = [];
        let piece = [];
        for (const token of group) {
          if (token.op && token.value === "|") {
            pipeline.push(piece);
            piece = [];
          } else piece.push(token);
        }
        pipeline.push(piece);
        let stdin = "";
        for (const command of pipeline) {
          if (!command.length) throw Error("syntax error near pipe");
          const redirect = command.findIndex((token) => token.op);
          let target,
            append = false;
          if (redirect >= 0) {
            if (
              ![">", ">>"].includes(command[redirect].value) ||
              redirect !== command.length - 2 ||
              command[redirect + 1].op
            )
              throw Error("syntax error near redirection");
            target = command[redirect + 1].value;
            append = command[redirect].value === ">>";
          }
          const args = command
            .slice(0, redirect < 0 ? undefined : redirect)
            .map((token) => token.value);
          if (!args.length) throw Error("syntax error: missing command");
          const result = this.execute(args[0], args.slice(1), stdin, history);
          stdin = result.output || "";
          action = result.action || action;
          if (target) {
            this.write(target, stdin, append);
            stdin = "";
          }
        }
        if (stdin) output.push(stdin.replace(/\n$/, ""));
        code = 0;
        group = [];
      };
      for (const token of [...tokens, { value: ";", op: true }]) {
        if (token.op && [";", "&&"].includes(token.value)) {
          try {
            executeGroup();
          } catch (error) {
            code = 1;
            output.push(error.message);
            group = [];
          }
          condition = token.value;
        } else group.push(token);
      }
      if (
        this.nodes.size > 256 ||
        JSON.stringify(this.serialize()).length > LIMIT
      )
        throw Error("Sandbox storage limit reached");
      return { output: output.join("\n"), code, action };
    } catch (error) {
      const system = this.seed.filter(([path]) => !this.writable(path));
      this.nodes = new Map([...system, ...snapshot.nodes]);
      this.cwd = snapshot.cwd;
      this.previous = previous;
      return { output: error.message, code: 1 };
    }
  }
  execute(name, args, stdin, history) {
    const ok = (output) => ({ output });
    const operand = (count) => {
      if (args.length < count)
        throw Error(
          `${name}: missing ${count > 1 ? "file operand(s)" : "operand"}`,
        );
    };
    const paths = args.filter((arg) => !arg.startsWith("-"));
    if (name === "help")
      return ok(
        "NH Linux · browser sandbox\n\nNavigate: ls [-la] [path], cd [path], pwd, tree, find\nFiles: mkdir [-p] dir, touch file, cp [-r] source dest, mv source dest, rm [-r] path, rmdir dir\nRead/write: cat file, echo text > file, echo text >> file, nano file\nText: grep [-i] pattern [file], head [-n N], tail [-n N], wc [-lwc]\nShell: pipes |, chaining && and ;, history, clear, whoami, uname, date, exit\nPortfolio: projects, open research|about|experience|recognition|work|toolkit|play|contact\n\nTab completes commands and paths. ↑↓ recalls history. Ctrl+L clears. Ctrl+C cancels.\nYour files persist in this browser. System directories are read-only.",
      );
    if (name === "pwd") return ok(this.cwd);
    if (name === "whoami") return ok("visitor");
    if (name === "uname")
      return ok(
        args.includes("-a")
          ? "NH Linux / browser filesystem sandbox / Web platform"
          : "NH Linux (browser sandbox)",
      );
    if (name === "date") return ok(new Date().toString());
    if (name === "history")
      return ok(
        history
          .map((line, index) => `${String(index + 1).padStart(4)}  ${line}`)
          .join("\n"),
      );
    if (name === "clear" || name === "exit") return { action: { type: name } };
    if (name === "cd") {
      const [path, node] = this.get(
        args[0] === "-" ? this.previous : args[0] || HOME,
      );
      if (node.type !== "dir") throw Error(`cd: ${args[0]}: Not a directory`);
      this.previous = this.cwd;
      this.cwd = path;
      return ok(args[0] === "-" ? path : "");
    }
    if (name === "ls") {
      const [path, node] = this.get(paths[0] || ".");
      const entries = node.type === "dir" ? this.entries(path) : [[path, node]];
      return ok(
        entries
          .filter(
            ([path]) =>
              args.some((arg) => /a/.test(arg) && arg.startsWith("-")) ||
              !base(path).startsWith("."),
          )
          .map(([path, node]) =>
            args.some((arg) => /l/.test(arg) && arg.startsWith("-"))
              ? `${node.type === "dir" ? "drwxr-xr-x" : "-rw-r--r--"} visitor visitor ${String(node.text?.length || 0).padStart(6)} ${base(path)}${node.type === "dir" ? "/" : ""}`
              : base(path) + (node.type === "dir" ? "/" : ""),
          )
          .join(
            args.some((arg) => /l/.test(arg) && arg.startsWith("-"))
              ? "\n"
              : "    ",
          ),
      );
    }
    if (["tree", "find"].includes(name)) {
      const [root] = this.get(paths[0] || ".");
      return ok(
        [
          root,
          ...[...this.nodes.keys()]
            .filter(
              (path) =>
                path.startsWith(root === "/" ? "/" : root + "/") &&
                path !== root,
            )
            .sort()
            .map((path) =>
              name === "find"
                ? path
                : "  ".repeat(path.slice(root.length).split("/").length - 2) +
                  "└─ " +
                  base(path),
            ),
        ].join("\n"),
      );
    }
    if (name === "mkdir") {
      if (!paths.length) throw Error("mkdir: missing operand");
      for (const arg of paths) {
        const full = resolvePath(arg, this.cwd);
        if (this.nodes.has(full)) {
          if (args.includes("-p") && this.nodes.get(full).type === "dir")
            continue;
          throw Error(`mkdir: ${arg}: File exists`);
        }
        const missing = [];
        let at = full;
        while (!this.nodes.has(at)) {
          missing.unshift(at);
          at = parent(at);
        }
        if (!args.includes("-p") && missing.length > 1)
          throw Error(`mkdir: ${arg}: No such file or directory`);
        for (const path of missing) {
          this.checkWrite(path);
          this.nodes.set(path, { type: "dir" });
        }
      }
      return ok("");
    }
    if (name === "touch") {
      operand(1);
      for (const path of args) {
        if (!this.nodes.has(resolvePath(path, this.cwd))) this.write(path, "");
        else this.checkWrite(resolvePath(path, this.cwd));
      }
      return ok("");
    }
    if (name === "nano") {
      operand(1);
      const path = resolvePath(args[0], this.cwd);
      this.checkWrite(path);
      const text = this.nodes.has(path) ? this.read(path) : "";
      return { action: { type: "edit", path, text } };
    }
    if (name === "cat") {
      if (!args.length) return ok(stdin);
      return ok(args.map((path) => this.read(path)).join(""));
    }
    if (name === "echo") {
      const noNewline = args[0] === "-n";
      if (noNewline) args.shift();
      const escapes = args[0] === "-e";
      if (escapes) args.shift();
      let text = args.join(" ");
      if (escapes) text = text.replace(/\\n/g, "\n").replace(/\\t/g, "\t");
      return ok(text + (noNewline ? "" : "\n"));
    }
    if (name === "printf") {
      const format = args.shift() || "";
      let index = 0;
      return ok(
        format
          .replace(/%([%sd])/g, (_, type) =>
            type === "%"
              ? "%"
              : type === "d"
                ? String(Number(args[index++]) || 0)
                : args[index++] || "",
          )
          .replace(/\\n/g, "\n")
          .replace(/\\t/g, "\t"),
      );
    }
    if (["cp", "mv"].includes(name)) {
      if (paths.length < 2)
        throw Error(`${name}: missing destination file operand`);
      const [source, node] = this.get(paths[0]);
      let dest = resolvePath(paths[1], this.cwd);
      if (this.nodes.get(dest)?.type === "dir") dest += "/" + base(source);
      if (source === dest || dest.startsWith(source + "/"))
        throw Error(`${name}: source and destination overlap`);
      if (
        node.type === "dir" &&
        name === "cp" &&
        !args.some((arg) => /^-[rRa]+$/.test(arg))
      )
        throw Error(`cp: -r not specified; omitting directory '${paths[0]}'`);
      const copies = [...this.nodes]
        .filter(([path]) => path === source || path.startsWith(source + "/"))
        .sort(([a], [b]) => a.length - b.length);
      for (const [path, entry] of copies) {
        const target = dest + path.slice(source.length);
        this.checkWrite(target);
        if (entry.type === "file") this.write(target, entry.text);
        else this.nodes.set(target, { type: "dir" });
      }
      if (name === "mv")
        for (const [path] of copies.reverse()) {
          this.checkWrite(path);
          this.nodes.delete(path);
        }
      return ok("");
    }
    if (name === "rm" || name === "rmdir") {
      if (!paths.length) {
        if (args.includes("-f")) return ok("");
        operand(1);
      }
      for (const arg of paths) {
        const full = resolvePath(arg, this.cwd);
        if (!this.nodes.has(full) && args.includes("-f")) continue;
        const [path, node] = this.get(arg);
        this.checkWrite(path);
        if (
          [HOME, "/tmp", this.cwd].includes(path) ||
          this.cwd.startsWith(path + "/")
        )
          throw Error(`${name}: refusing to remove the working directory`);
        const children = [...this.nodes.keys()].filter((key) =>
          key.startsWith(path + "/"),
        );
        if (name === "rmdir" && node.type !== "dir")
          throw Error(`rmdir: ${arg}: Not a directory`);
        if (
          node.type === "dir" &&
          name === "rm" &&
          !args.some((arg) => /^-[rfR]+$/.test(arg) && /[rR]/.test(arg))
        )
          throw Error(`rm: ${arg}: Is a directory (use -r)`);
        if (name === "rmdir" && children.length)
          throw Error(`rmdir: ${arg}: Directory not empty`);
        for (const child of children) this.nodes.delete(child);
        this.nodes.delete(path);
      }
      return ok("");
    }
    if (["grep", "head", "tail", "wc"].includes(name)) {
      const options = args.filter((arg) => arg.startsWith("-"));
      let count = 10;
      const numberIndex = args.indexOf("-n");
      if (numberIndex >= 0)
        count = Math.max(0, Math.min(1000, Number(args[numberIndex + 1]) || 0));
      const fileArgs = paths.filter(
        (_, index) =>
          !(numberIndex >= 0 && index === 0 && /^\d+$/.test(paths[0])),
      );
      const pattern = name === "grep" ? fileArgs.shift() : null;
      if (name === "grep" && pattern === undefined)
        throw Error("grep: missing search pattern");
      const text = fileArgs.length
        ? fileArgs.map((path) => this.read(path)).join("")
        : stdin;
      const lines = text.replace(/\n$/, "").split("\n");
      if (name === "grep")
        return ok(
          lines
            .filter((line) =>
              options.includes("-i")
                ? line.toLowerCase().includes(pattern.toLowerCase())
                : line.includes(pattern),
            )
            .join("\n"),
        );
      if (name === "head") return ok(lines.slice(0, count).join("\n"));
      if (name === "tail")
        return ok(count ? lines.slice(-count).join("\n") : "");
      const values = {
        l: (text.match(/\n/g) || []).length,
        w: text.trim() ? text.trim().split(/\s+/).length : 0,
        c: new TextEncoder().encode(text).length,
      };
      const selected = options.join("").replace(/-/g, "") || "lwc";
      return ok(
        [...selected]
          .filter((key) => key in values)
          .map((key) => values[key])
          .join(" "),
      );
    }
    if (name === "projects") return { action: { type: "open", app: "work" } };
    if (name === "open") {
      operand(1);
      const app = APPS[args[0]];
      if (!app) throw Error(`open: ${args[0]}: No portfolio file`);
      return { action: { type: "open", app } };
    }
    throw Error(`${name}: command not found. Run help for available commands.`);
  }
}
