# Nirusan Hariharan — personal workspace

A React portfolio built around an interactive Three.js engineering workbench. The portfolio also has a complete reading view at `/#read`.

## Run locally

Requires Node.js 22.13 or newer.

```sh
npm ci
npm run dev
```

The development server binds to `127.0.0.1`. To check the production build:

```sh
npm run lint
npm test
npm run build
npm run preview
```

Nothing in this project publishes or deploys automatically.

## Experience

- Drag the actual 3D scene to orbit; select an object or its labeled station to open a file.
- Move desktop windows using the title bar, or focus the grip and use arrow keys. Escape closes the front window. Minimized files are restored from the footer.
- On phones, files open as scrollable sheets with visible window controls.
- Play contains Quantum Relay (the five-stage H/X/Z puzzle) and Packet Run (an animated, three-lane network arcade with keyboard, swipe, and touch controls). Games pause when covered or hidden. Quantum Relay is an educational simulation, not a quantum hardware connection.
- The terminal has a Linux-style virtual filesystem. Run `help`: navigation, writable files, copy/move/remove, redirects, pipes, command history, Tab completion, and a nano-style editor are supported. Ctrl+O saves, Ctrl+X exits, and on-screen controls work on phones. Shift+Tab leaves the input. Files persist in browser storage; the terminal never executes host operating-system commands or user code.
- The three-stage introduction advances automatically: inbound signal, guest authentication, then welcome. Sound is on by default, with a quiet synthesized ambient loop and stage cues. Browser autoplay rules may defer audio until the first pointer or keyboard interaction. Mute is available in the introduction, workspace, and reading view. The intro can be skipped; reduced-motion preferences simplify its transitions. Animation can also be disabled under View.
- Read portfolio provides the same professional information without navigating the scene. Opening `/#read` directly does not load the 3D module.

## Maintain

| File | Purpose |
| --- | --- |
| `src/workspace/content.js` | Roles, dates, recognition, research sources |
| `src/constants/index.js` | Original project archive, images, repository links, email |
| `src/workspace/Files.jsx` | Shared portfolio documents and reading view |
| `src/workspace/World.jsx`, `MobileWorld.jsx` | Desktop workbench and lighter mobile processor, lights, camera, render scheduling |
| `src/lib/shell.js`, `src/workspace/Terminal.jsx` | Browser filesystem, command parser, completion, and editor |
| `src/lib/packetRun.js`, `src/workspace/PacketRun.jsx` | Arcade simulation, canvas rendering, controls, pause, best score |
| `src/workspace/Workspace.jsx` | Window stack, menus, preferences, entry flow |
| `src/lib/qubit.js`, `src/lib/relay.js` | Quantum simulation and missions |
| `src/index.css` | Responsive workspace, document, print, and reduced-motion styles |
| `public/Nirusan_Hariharan_CV.pdf` | Existing supplied résumé; replace when a newer CV is ready |

Fonts and scene assets are served locally. No analytics, remote scene assets, authentication, backend service, or contact-form delivery service is used. Contact links open the visitor's email application.

Dependencies are pinned; `.npmrc` selects the official npm registry and disables lifecycle scripts. Keep the lockfile when installing. These measures and the clean audit do not guarantee that any package is risk-free.

`public/_headers` contains production security headers for a host that supports that format. Vite does not apply this file. Configure equivalent response headers if the eventual host uses another format, and verify them after deployment. Inline styles are permitted for window positions and state visualizations; scripts remain restricted to the same origin.

See [TEST_REPORT.md](TEST_REPORT.md) for coverage and limitations, and [SOURCE_NOTES.md](SOURCE_NOTES.md) for factual provenance.

Employer product/store listings are intentionally omitted. Keep employer experience general; research sources and public personal projects remain available.

The mobile scene is a separate exploded quantum-processor design study with a small geometry budget. It is not the desktop workbench scaled down. `public/workspace-atmosphere.svg` is the locally authored background illustration; no external image request is made.

The filesystem permits writes only under `/home/visitor` and `/tmp`, with a 256 KB serialized quota, a 256-node bound, and a 64 KB limit per file. It supports the commands listed by `help`; it does not provide a full Linux kernel, package manager, arbitrary binaries, or network access. Virtual file edits change only the visitor's browser data, not the portfolio source.
