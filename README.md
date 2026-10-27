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
- Quantum Relay is a five-stage H/X/Z gate puzzle with a real single-qubit state calculation. It is an educational simulation, not a quantum hardware connection.
- The terminal accepts a small local command list. Run `help`. It never executes operating-system commands or user code.
- The introduction can be skipped. Sound is optional and off by default. Animation respects reduced-motion preferences and can be disabled under View.
- Read portfolio provides the same professional information without navigating the scene. Opening `/#read` directly does not load the 3D module.

## Maintain

| File | Purpose |
| --- | --- |
| `src/workspace/content.js` | Roles, dates, recognition, research sources |
| `src/constants/index.js` | Original project archive, images, repository links, email |
| `src/workspace/Files.jsx` | Shared portfolio documents and reading view |
| `src/workspace/World.jsx` | Procedural models, lights, camera, object selection, render scheduling |
| `src/workspace/Workspace.jsx` | Window stack, menus, preferences, entry flow |
| `src/lib/qubit.js`, `src/lib/relay.js` | Quantum simulation and missions |
| `src/index.css` | Responsive workspace, document, print, and reduced-motion styles |
| `public/Nirusan_Hariharan_CV.pdf` | Existing supplied résumé; replace when a newer CV is ready |

Fonts and scene assets are served locally. No analytics, remote scene assets, authentication, backend service, or contact-form delivery service is used. Contact links open the visitor's email application.

Dependencies are pinned; `.npmrc` selects the official npm registry and disables lifecycle scripts. Keep the lockfile when installing. These measures and the clean audit do not guarantee that any package is risk-free.

`public/_headers` contains production security headers for a host that supports that format. Vite does not apply this file. Configure equivalent response headers if the eventual host uses another format, and verify them after deployment. Inline styles are permitted for window positions and state visualizations; scripts remain restricted to the same origin.

See [TEST_REPORT.md](TEST_REPORT.md) for coverage and limitations, and [SOURCE_NOTES.md](SOURCE_NOTES.md) for factual provenance.

Employer product/store listings are intentionally omitted. Keep employer experience general; research sources and public personal projects remain available.
