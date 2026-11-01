# Nirusan Hariharan — personal workspace

A React portfolio built around a scroll-driven Three.js engineering workbench, with an optional desktop mode.

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

The main route is a scroll film. A hand-built Three.js workbench materialises from blueprint lines on load, then the camera, keyed to scroll progress, orbits through the Research, Engineering and Immersive Smile stations and dives into the quantum core, which flashes into the Research chapter. After it: research, an interactive quantum explorer, Projects (a horizontal rail of research and products, then the full list), experience with figures from the CV, about, recognition with pointer-following previews, toolkit, play and contact. The page shifts between ink, bone and signal-orange tones as sections reach reading position.

- Motion uses GSAP (ScrollTrigger, SplitText) and Lenis. Lenis runs only on fine pointers, so touch scrolling stays native. Motion off and reduced-motion preferences remove all of it and show content statically.
- Mona Sans is the only display and text face; its width axis is animated by scroll on the large titles. JetBrains Mono is used only for data readouts and the terminal.
- Quantum Relay, Packet Run and the terminal open in a full-screen sheet from the Play section, so playing never changes mode.
- Desktop mode opens only from the **Desktop mode** button (or an explicit `/#workspace` link), and only on screens over 1100px wide with a hovering pointer; phones and tablets stay on the scrolling page even with that link. It has a menu bar, a dock, draggable and resizable windows that open from and minimise to their dock icons, double-click to maximise, arrow-key movement from a focused title bar, and Escape to close.
- Sound is off by default. It can be turned on from the footer or the View menu.
- Research includes the two-qubit explorer at `/#index-quantum-ml`, using synthetic inputs and labelled separately from the published results. Reported accuracies come from Table II of the IEEE paper.

Sections link as `/#index-research`, `/#index-work`, `/#index-experience`, `/#index-about`, `/#index-recognition`, `/#index-toolkit`, `/#index-play` and `/#index-contact`.

## Maintain

| File | Purpose |
| --- | --- |
| `src/workspace/content.js` | Roles, dates, recognition, research sources |
| `src/constants/index.js` | Original project archive, images, repository links, email |
| `src/workspace/Files.jsx` | Shared portfolio documents, project links, and toolkit icons |
| `src/workspace/workbench.js` | Shared 3D workbench: geometry, materials, blueprint reveal, idle motion |
| `src/story/FilmScene.jsx` | Scroll-driven camera path and film renderer |
| `src/story/useChoreography.js`, `story.css`, `Story.jsx` | Scroll motion, the page design, and page structure |
| `src/workspace/World.jsx`, `desktop.css`, `Window.jsx` | Desktop mode wallpaper, shell and window manager |
| `src/lib/shell.js`, `src/workspace/Terminal.jsx` | Browser filesystem, command parser, completion, and editor |
| `src/lib/packetRun.js`, `src/workspace/PacketRun.jsx` | Arcade simulation, canvas rendering, controls, pause, best score |
| `src/workspace/Workspace.jsx` | Mode routing, desktop shell, dock, preferences |
| `src/workspace/PaperPreview.jsx`, `ResearchResults.jsx`, `public/research/` | IEEE first-page image, reported validation results, publication links and provenance |
| `src/workspace/ProjectMedia.jsx`, `public/previews/` | Real public product previews |
| `src/lib/qubit.js`, `src/lib/relay.js` | Quantum simulation and missions |
| `src/workspace/QuantumLab.jsx`, `quantum-lab.css`, `src/lib/quantumLab.js` | Exact two-qubit teaching simulation, interactive scientific plots and circuit trace |
| `src/index.css` | Responsive workspace, document, print, and reduced-motion styles |
| `public/Nirusan_Hariharan_CV.pdf` | Existing supplied résumé; replace when a newer CV is ready |

Fonts and scene assets are served locally. GSAP and Lenis are bundled, not loaded from a CDN. No analytics, remote scene assets, authentication, backend service, or contact-form delivery service is used. Contact links open the visitor's email application.

Dependencies are pinned; `.npmrc` selects the official npm registry and disables lifecycle scripts. Keep the lockfile when installing. These measures and the clean audit do not guarantee that any package is risk-free.

`public/_headers` contains production security headers for a host that supports that format. Vite does not apply this file. Configure equivalent response headers if the eventual host uses another format, and verify them after deployment. Inline styles are permitted for window positions and state visualizations; scripts remain restricted to the same origin.

See [TEST_REPORT.md](TEST_REPORT.md) for coverage and limitations, and [SOURCE_NOTES.md](SOURCE_NOTES.md) for factual provenance.

Public Niroga AI, BlueLotus360, and SENOVA product and store links are included with high-level contribution descriptions. Internal architecture and partnership details remain omitted.

The terminal filesystem permits writes only under `/home/visitor` and `/tmp`, with a 256 KB serialized quota, a 256-node bound, and a 64 KB limit per file. It supports the commands listed by `help`; it does not provide a full Linux kernel, package manager, arbitrary binaries, or network access.
