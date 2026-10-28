# Local verification — 28 October 2026

The redesign is local only. Nothing was pushed, published, or deployed.

## Follow-up: portrait treatment

The original event photo remains untouched. A new transparent portrait was edited with the built-in image tool, removing the orange/magenta venue background and using an upper-body crop. Shared slate/teal framing now appears in the workspace and About/reading views; the 3D portrait display uses the same edited asset with alpha support.

- Alpha channel verified with values spanning 0–255.
- Profile asset: about 31 KB; document/3D asset: about 79 KB. The previous full image was about 276 KB.
- Workspace and About view checked at 320 × 568, 390 × 844, 768 × 1024, 1440 × 900, and 1920 × 1080: images loaded, no horizontal overflow, and no legacy 1.7× scaling on the profile portrait.
- Reading view loaded the edited document portrait successfully. Final browser console check reported no errors.
- ESLint and production build passed. No application dependency changed. Existing Three.js chunk advisory remains.
- The image prompt and asset provenance are recorded in `src/assets/portraits/EDIT_NOTES.md`. Assets and master are saved in that same directory.
- This follow-up used responsive browser emulation; no new physical-device or cross-browser coverage is claimed.

## Follow-up: terminal, mobile 3D, background, and second game

Current local revision adds a Linux-style browser filesystem and nano-style editor, a dedicated mobile processor model, a locally illustrated atmosphere background, and Packet Run alongside Quantum Relay.

- **19 unit tests pass**: nine existing qubit/relay checks, six filesystem/shell checks, and four arcade simulation checks. Shell coverage includes path normalization, quoted filenames, copy/move, pipes, recursive copy isolation, permissions, missing operands, failed `&&` chains, persistence restore, and completion. Arcade coverage includes lane bounds, collision/collection counted once, pause, bounded frame deltas, loss, and successful delivery.
- Browser workflow verified: `mkdir -p experiments && cd experiments`, redirected writing, `cp`, `cat`, `nano above.txt`, editing and Ctrl+O save, on-screen editor exit, and content/cwd restored after closing and reopening Terminal.
- Tab completed `mk` to `mkdir ` while focus remained in the command input. Ctrl+G editor help worked. The in-app browser intercepted Ctrl+X before it reached the page during automation; the on-screen Exit control passed. Standalone-browser Ctrl+X is implemented but not independently verified here.
- Packet Run start, arrow-key steering, touch-button steering, pause/resume, and automatic pause when another window covered it passed. Keyboard arrow navigation between the two game tabs passed. Quantum Relay's first mission was completed again after integration.
- The new mobile model reported **25 draw calls / 4,536 triangles** in development, compared with approximately 189 draw calls / 60,254 triangles for the previous full workbench. These are geometry/submission counts, not measured frame-rate guarantees. Mobile DPR is capped at 1.75; animations stop when covered/hidden. The layered model has no floating labels over the geometry.
- The background is a locally authored SVG with a star field and contour paths. No new application dependency or remote media service was added.
- Workspace, Terminal, and Packet Run checked at 320 × 568, 360 × 800, 390 × 844, 430 × 932, 768 × 1024, 1024 × 768, 1440 × 900, and 1920 × 1080: correct mobile/desktop scene switch and no horizontal overflow in either document pane.
- A natural Packet Run loss displayed the final score; restart reset score, shields, and timer. Start via Space and keyboard steering after using touch buttons also passed.
- Game-start scrolling is restricted to the content pane. The outer window scroll position remained zero and the title controls remained visible on both desktop and phone.
- Final lint/build passed and the final browser console pass reported no errors. The deferred shared Three.js engine still triggers the existing 500 kB uncompressed advisory. Current initial JS is about 95 kB gzip; deferred engine about 147 kB gzip, with small separate mobile/desktop scene modules.
- Captures: `artifacts/qa/processor-mobile-revised.jpg`, `atmosphere-desktop-revised.jpg`, `packet-run-desktop.jpg`, and `workspace-final.jpg`.
- Test-created virtual files were removed. The handed-off preview has animation and sound enabled. These checks use viewport emulation, not physical Android/iOS or Safari/Firefox testing.

## Follow-up: automatic signal introduction and sound

The previous opt-in intro is replaced with an automatic sequence: inbound quantum/cybersecurity signal, public guest authentication, and a welcome transition. It takes about 6.65 seconds with motion enabled, then opens the workspace. The short static sequence is used when animation is off. Authentication is presentation only: there is no account form, credential collection, or server authentication request.

Sound is now **on by default**, with a quiet locally synthesized ambient loop and phase cues. Audio activation is attempted automatically; browser autoplay restrictions can defer it until a pointer or keyboard interaction. Mute remains available in the intro, workspace, and reading view. The old sound-off/opt-in results below are historical and superseded.

Verified in the in-app Chromium browser:

- All three stages appeared in order and automatically entered the workspace.
- Intro skip, read-index shortcut, mute/unmute, and reading-view mute worked.
- Animation-off sequence also completed all three stages; motion was restored on for handoff.
- Authentication layout checked at 320 × 568, 390 × 844, 768 × 1024, 1024 × 768, 1440 × 900, and 1920 × 1080: no horizontal overflow, content and skip control within the viewport, no credential fields.
- No runtime console errors during the interaction pass. Audio controls and Web Audio execution checked; perceived audio quality and cross-browser autoplay behavior remain outside this local test.
- Captures: `artifacts/qa/intro-signal-desktop.jpg`, `intro-authentication-desktop.jpg`, `intro-welcome-desktop.jpg`, and `intro-authentication-mobile.jpg`.

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
