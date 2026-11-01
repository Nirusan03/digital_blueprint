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

- Motion uses GSAP (ScrollTrigger, SplitText) and Lenis. Lenis runs only on capable devices with a fine pointer, so touch scrolling stays native. Motion off and reduced-motion preferences remove all of it and show content statically.
- `src/story/quality.js` picks a tier per device. **High**: the full scene. **Low** (touch devices, 4 cores or fewer, weak integrated graphics): the same scene and animation with lighting baked into `public/film/matcap`, up to 2× resolution and 60fps. **Still** (software graphics, data saver, motion off): the pre-rendered frames in `public/film/`, crossfaded by scroll, with no WebGL or Three.js download. While running, `FilmScene.jsx` lowers its resolution if frames slip, then its frame rate, and falls back to the stills as the last resort. If the bench or camera path changes, re-capture `public/film/`.
- The hero sizes everything from the stage's own width and height (container query units), and `heroBox.js` measures the free space so the bench and still frame fit it. Size new layout from both dimensions; widths alone break at browser zoom and on foldables.
- Scroll work stays compositor-friendly on purpose. Do not animate colours or custom properties on a page-wide ancestor, use `mix-blend-mode` on fixed elements, or animate the font width axis: each of these caused visible stutter on modest hardware.
- Mona Sans is the only display and text face; its width axis is animated by scroll on the large titles. JetBrains Mono is used only for data readouts and the terminal.
- Quantum Relay, Packet Run and the terminal open in a full-screen sheet from the Play section, so playing never changes mode.
- Desktop mode opens only from the **Desktop mode** button (or an explicit `/#workspace` link), and only on screens over 1100px wide and 600px tall with a hovering pointer; phones and tablets stay on the scrolling page even with that link. It has a menu bar, a dock, draggable and resizable windows that open from and minimise to their dock icons, double-click to maximise, arrow-key movement from a focused title bar, and Escape to close.
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
| `src/story/useChoreography.js`, `story.css`, `Story.jsx`, `quality.js` | Scroll motion, the page design, page structure, device tiers |
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

The site is hosted on Vercel, and `vercel.json` sets all response headers: Content-Security-Policy, frame and sniffing protection, and the CV's `X-Robots-Tag: noindex`. Do not block the CV in `robots.txt`: Google has to fetch it to see that header. Inline styles stay allowed in the policy for positions and state visualizations; scripts stay restricted to the same origin.

See [TEST_REPORT.md](TEST_REPORT.md) for coverage and limitations, and [SOURCE_NOTES.md](SOURCE_NOTES.md) for factual provenance.

Public Niroga AI, BlueLotus360, and SENOVA product and store links are included with high-level contribution descriptions. Internal architecture and partnership details remain omitted.

The terminal filesystem permits writes only under `/home/visitor` and `/tmp`, with a 256 KB serialized quota, a 256-node bound, and a 64 KB limit per file. It supports the commands listed by `help`; it does not provide a full Linux kernel, package manager, arbitrary binaries, or network access.
