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

Midnight is the default dark palette. The header palette control cycles through Midnight, Deep teal and Plum; the selection is saved locally. Native IntersectionObserver/Web Animations move whole content blocks from alternating sides, with staggered content inside project rows, research introductions and toolkit groups. Entrances replay after a block fully leaves the viewport. Desktop travel is up to 160px over 1.05 seconds; phone travel scales to the viewport. Motion off restores every section immediately. Reduced-motion preferences disable these effects. No animation dependency was added.

IIT’s graduation feature is linked discreetly from the existing First Class Honours entry in Recognition, with LinkedIn and Facebook sources. There is no separate graduation banner or thumbnail. Product previews are local, optimized captures of the public websites or official app listing; no third-party frame, video autoplay or tracker is embedded.

- The main route opens a full scrolling portfolio on desktop and mobile: research, experience, biography, recognition, colourful toolkit, one consolidated project archive, play, and contact.
- Select **PC workspace** (or open `/#workspace`) for the original desktop/window interface. **Scroll portfolio** returns to the full page.
- The same detailed quantum workbench appears in both modes and on phones. Drag with a mouse to orbit; touch gestures retain vertical page scrolling. Mobile labels are hidden to keep the model clear. Renderer density is bounded at 1.5–2× and the scene pauses offscreen.
- Experience, Recognition, and Toolkit each have a distinct, interactive 3D study in the scrolling view. The Rotate buttons work with touch and keyboard; scenes load near the viewport and release their graphics resources when scrolled away. Motion preferences are respected and a simple illustration remains if 3D is unavailable.
- Move desktop windows using the title bar, or focus the grip and use arrow keys. Escape closes the front window. Minimized files are restored from the footer.
- On phones, files open as scrollable sheets with visible window controls.
- Play contains Quantum Relay (the five-stage H/X/Z puzzle) and Packet Run (an animated, three-lane network arcade with keyboard, swipe, and touch controls). Games pause when covered or hidden. Quantum Relay is an educational simulation, not a quantum hardware connection.
- The terminal has a Linux-style virtual filesystem. Run `help`: navigation, writable files, copy/move/remove, redirects, pipes, command history, Tab completion, and a nano-style editor are supported. Ctrl+O saves, Ctrl+X exits, and on-screen controls work on phones. Shift+Tab leaves the input. Files persist in browser storage; the terminal never executes host operating-system commands or user code.
- The portfolio opens directly by default. The optional three-stage introduction is retained and can be replayed from the PC workspace's View menu. To show it automatically for new sessions again, set `SHOW_INTRO_ON_FIRST_VISIT` to `true` in `src/workspace/Workspace.jsx`. Sound is on by default, with a quiet synthesized ambient loop and stage cues; browser autoplay rules may defer audio until the first interaction. Mute is available in the introduction, workspace, and reading view. Reduced-motion preferences simplify the introduction, and animation can also be disabled under View.
- `/#read` and `/#index-research` remain supported as scrolling-page links. The lazy hero scene is optional: content remains available if WebGL fails. Research includes an IEEE QCNC first-page image preview, an interactive chart of the paper’s reported validation results, and links to the full publication on IEEE. The supplied publication PDF is never copied into this repository.

Research also includes an interactive quantum feature-map explorer: a two-input response surface, a probability response curve, exact four-outcome probabilities, CNOT coupling, Bell-state and zero-state presets, a bounded input sweep and a three-stage circuit trace. The teaching circuit uses synthetic inputs and is labelled separately from the published model/results. Open `/#index-quantum-ml` directly.

All sixteen projects now appear once under “Ideas put to work”, after the toolkit. Research leads the page; there is no separate top product showcase. Both `/#index-work` and the earlier `/#index-archive` reach this section. Previews use compact frames, with two official BL360 ERP interface details instead of the large promotional poster.

## Maintain

| File | Purpose |
| --- | --- |
| `src/workspace/content.js` | Roles, dates, recognition, research sources |
| `src/constants/index.js` | Original project archive, images, repository links, email |
| `src/workspace/Files.jsx` | Shared portfolio documents, project links, and toolkit icons |
| `src/workspace/World.jsx` | Shared high-resolution quantum workbench, lights, camera, offscreen render scheduling |
| `src/lib/shell.js`, `src/workspace/Terminal.jsx` | Browser filesystem, command parser, completion, and editor |
| `src/lib/packetRun.js`, `src/workspace/PacketRun.jsx` | Arcade simulation, canvas rendering, controls, pause, best score |
| `src/workspace/Workspace.jsx` | Mode routing, window stack, menus, preferences, entry flow |
| `src/workspace/ScrollPortfolio.jsx`, `scroll-portfolio.css`, `dark-story.css`, `useScrollStory.js` | Default dark scrolling layout, palette choices, native scrolling, replayable horizontal block entrances |
| `src/workspace/PaperPreview.jsx`, `ResearchResults.jsx`, `public/research/` | IEEE first-page image, reported validation results, publication links and provenance |
| `src/workspace/ProjectMedia.jsx`, `public/previews/` | Real public product previews |
| `src/lib/qubit.js`, `src/lib/relay.js` | Quantum simulation and missions |
| `src/workspace/QuantumLab.jsx`, `quantum-lab.css`, `src/lib/quantumLab.js` | Exact two-qubit teaching simulation, interactive scientific plots and circuit trace |
| `src/index.css` | Responsive workspace, document, print, and reduced-motion styles |
| `public/Nirusan_Hariharan_CV.pdf` | Existing supplied résumé; replace when a newer CV is ready |

Fonts and scene assets are served locally. No analytics, remote scene assets, authentication, backend service, or contact-form delivery service is used. Contact links open the visitor's email application.

Dependencies are pinned; `.npmrc` selects the official npm registry and disables lifecycle scripts. Keep the lockfile when installing. These measures and the clean audit do not guarantee that any package is risk-free.

`public/_headers` contains production security headers for a host that supports that format. Vite does not apply this file. Configure equivalent response headers if the eventual host uses another format, and verify them after deployment. Inline styles are permitted for window positions and state visualizations; scripts remain restricted to the same origin.

See [TEST_REPORT.md](TEST_REPORT.md) for coverage and limitations, and [SOURCE_NOTES.md](SOURCE_NOTES.md) for factual provenance.

At the user’s latest request, public Niroga AI, BlueLotus360, and SENOVA product/store links are included with high-level contribution descriptions. Internal architecture and partnership details remain omitted.

The same detailed quantum workbench is rendered in the scrolling and PC views on desktop and mobile. `public/workspace-atmosphere.svg` is the locally authored background illustration; no external image request is made.

The filesystem permits writes only under `/home/visitor` and `/tmp`, with a 256 KB serialized quota, a 256-node bound, and a 64 KB limit per file. It supports the commands listed by `help`; it does not provide a full Linux kernel, package manager, arbitrary binaries, or network access. Virtual file edits change only the visitor's browser data, not the portfolio source.

The milestones section uses eleven original coloured SVG illustrations. Scroll entrances draw the icon strokes, reveal a short orbit accent, sweep the row rule and stagger the text. Hover and keyboard focus add a brief icon response. The PC document observes its own scroll pane. All effects are finite and honour Motion off and reduced-motion preferences; no icon package or remote asset was added.

Experience rows combine replayable horizontal entrances with drawn timeline traces, a brief beacon pulse, staggered achievements and individual skill labels. Native details/summary controls keep keyboard semantics; a bounded Web Animation smooths expansion and collapse, supports reversal during rapid clicks, and settles immediately when motion is disabled. PC panes trigger their own entrance details as roles enter view.

Projects now open with a procedural 3D circuit sculpture: a layered chip, suspended frame, copper traces and moving orbital nodes. Its assembly can be replayed; pointer movement and arrow keys rotate it. Rendering is lazy, bounded to a short interval, paused offscreen/in hidden tabs and disposed on unmount. The existing Three.js package is shared with the hero.

All sixteen project visuals have perspective depth, replayable assembly entrances and pointer tilt on devices with a fine pointer. Paper previews use layered sheets, app previews use angled device frames and website previews use a raised screen. Source links and original images remain available. Native touch scrolling and Motion off/reduced-motion fallbacks remain in place.
