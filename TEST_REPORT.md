# Local verification — 28 October 2026

The redesign is local only. Nothing was pushed, published, or deployed.

## Follow-up: ADScAI links and company privacy

The production directory has now been removed from the scene, launchers, menus, reading index, app registry, and terminal command whitelist. Its previous coverage below is a historical record of the initial redesign, not a description of the current site.

- Both supplied ADScAI links render in Research; the recognition entry links to the author-filtered repository.
- Built JavaScript checked: employer store URLs, SENOVA domains, production directory, and partnership names are absent.
- Terminal `open production` reports that the file is unavailable.
- Workspace and reading index rechecked at 320 × 568, 390 × 844, and 1440 × 900: no horizontal overflow; nine visible file launchers; no production entry.
- ESLint and the updated production build passed. Existing deferred Three.js chunk advisory remains.
- Capture: `artifacts/qa/adscai-research-desktop.jpg` and `artifacts/qa/adscai-research-mobile.jpg`.

## Code and dependencies

- ESLint: passed.
- Unit tests: **9 passed**, covering gate normalization, H/X/Z behavior, measurement boundaries, all five relay solutions, and fidelity/relative-phase behavior.
- Vite production build: passed. The deferred Three.js chunk still triggers Vite's 500 kB uncompressed chunk-size advisory.
- `npm audit`: **0 known vulnerabilities** at the time checked.
- `npm audit signatures`: **152 registry signatures verified; 56 verified attestations**.
- Direct dependencies pinned; official npm registry; lifecycle scripts disabled. No new remote model, audio, font, analytics, or form-service dependency.

## Browser verification

Tested in the Codex in-app Chromium browser. Viewport dimensions were checked against the rendered document to avoid testing a stale or hidden-tab viewport.

| Workspace + production window | Result |
| --- | --- |
| 320 × 568; 360 × 800; 375 × 667; 390 × 844; 430 × 932 | No horizontal document overflow; window inside viewport; primary document copy 16px |
| 768 × 1024; 820 × 1180; 1024 × 768 | Same checks passed |
| 1280 × 800; 1440 × 900; 1920 × 1080; 2560 × 1440 | Same checks passed |

Reading index additionally checked at 320 × 568, 390 × 844, 768 × 1024, 1024 × 768, 1440 × 900, and 1920 × 1080. Body text is 17px, images loaded, and no horizontal overflow was found.

Interactions verified:

- Actual WebGL scene renders; dragging changes the camera and station projections; reset returns the view.
- Research and product launchers open the corresponding documents. The production directory contains the ten product/store links supplied for the four product groups.
- Window close, minimize, restore, maximize, and keyboard movement work. Escape closes the front window and restores launcher focus.
- Mobile Files and View menus stay inside the viewport; only one is open at a time.
- All **five Quantum Relay missions completed through the UI**, including relative-phase targets; final completion message displayed.
- Terminal `open research` opens the actual research document.
- Introduction replay, ready state, entry transition, sound opt-in, sound on/off, and skip-to-index work. Sound finishes off for handoff.
- Motion preference switches work. Browser reduced-motion handling and document-visibility suspension were also reviewed in source.
- Project archive navigation loads the QuanNetDetect illustration. The no-image Immersive Smile project displays normally.
- Contact copy shows “Email address copied.”
- Reading index and return-to-workspace work.
- All ten file types checked at 320 × 568: no horizontal overflow inside their content panes.
- Built production preview opens with both ready states and the research window. Production HTML, hashed JS/CSS, fonts, résumé, and social preview return HTTP 200; no development client is included.
- Browser console: no errors observed during the final interaction pass.

## Performance measures and limits

The 3D module is loaded separately. Last build: initial JavaScript about **85 kB gzip**, deferred scene/Three.js about **150 kB gzip**, CSS about **9.4 kB gzip**. Images and locally served fonts are additional transfers. Existing project illustrations are lazy-loaded where displayed.

Rendering caps device pixel ratio at 1 on narrow screens and 1.5 on desktop. The render loop pauses when a document window covers the scene or the tab is hidden. Animation-off mode renders on interaction. Mobile rendering is capped around 30 frames per second; desktop animation has a bounded frame rate. Geometries, textures, environment maps, controls, and renderer resources are disposed on teardown. Read mode has no dependency on successful WebGL initialization.

This is viewport emulation, **not physical-device testing**. No claim is made that every GPU/device will run without a frame drop. Safari, Firefox, physical iOS/Android, screen-reader software, slow-network behavior, and a deliberately forced WebGL failure were not independently exercised in this final pass. Audio controls and error-free execution were checked; perceived audio quality is subjective. The fallback and reduced-motion paths were reviewed in code rather than exhaustively fault-injected.

Security headers in `public/_headers` require support/configuration on the eventual host and must be verified there. A clean dependency audit/signature check does not guarantee future supply-chain safety. Store listings and external destinations can change.

## Review captures

Fresh captures are in the ignored local `artifacts/qa/` directory: `workspace-desktop.jpg`, `workspace-mobile.jpg`, and `workspace-intro-mobile.jpg`. Older captures in that directory may show superseded designs.
