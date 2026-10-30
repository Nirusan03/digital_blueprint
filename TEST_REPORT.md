# Local verification — 30 October 2026

Current revision: dark scrolling portfolio, IEEE first-page preview, real product previews, compact IIT source links in Recognition and native scroll animation. Nothing was committed, pushed, uploaded or deployed.

## Build and dependencies

- ESLint and production build pass; `git diff --check` is clean.
- All 25 unit tests passed: the 19 existing qubit/relay, filesystem/shell and arcade checks, plus six new tests for the two-qubit explorer. New tests cover zero/Bell/classical states, CNOT, uncoupled independence, normalized probabilities and bounded concurrence across a grid of inputs, and rejected non-finite/out-of-range values.
- Production dependency audit: **0 known vulnerabilities** (`npm audit --omit=dev`). No npm package was added, and package/lock files are unchanged.
- Final build: initial JavaScript **104.29 kB gzip**, deferred World/Three.js **150.36 kB gzip**, CSS **18.56 kB gzip**. Images and fonts are additional. The existing deferred 592.70 kB uncompressed scene chunk still triggers Vite’s 500 kB advisory; it is loaded separately.

## Responsive browser checks

| Emulated viewport | Checked |
| --- | --- |
| 320 × 740 | Header controls, hero typography, detailed 3D scene, toolkit wrapping, IEEE preview, document bounds |
| 390 × 844 | Scrolling layout, 382px scene/canvas fit, project previews; PC research/toolkit sheets have equal content/client widths |
| 768 × 1024 | Page/header/scene bounds and native page scrolling |
| 1440 × 900 | Hero, project composition, IIT spotlight, research chart, directional/image reveals, palettes and navigation |
| 1920 × 1080 | Page/media bounds and dark PC project/research windows |

No horizontal page overflow was observed at these sizes. The same detailed workbench is used on phones and desktop, with a 1.5–2× pixel-density bound. Native touch scrolling, scene suspension outside the viewport/behind windows, and cleanup remain in place.

## New features exercised

- Midnight is the default; header control cycles to Deep teal, Plum and back. Plum survives reload. Handoff restored to Midnight, motion on.
- Whole content blocks enter from alternating sides, with staggered children. Scroll entrances replay after leaving the viewport; native scrolling remains browser-owned. See the scroll-motion follow-up below for current verification.
- Motion off removes pending reveal hiding immediately: zero waiting nodes and zero inline-hidden content after toggling. Unsupported observer/animation APIs leave content visible. Reduced-motion handling was reviewed in source; the graph’s value scaling is retained when its transition is disabled.
- All four product previews loaded: Niroga online store, BlueLotus official app screenshot, SENOVA and Immersive Smile. Their external destinations match the supplied public products. All 16 projects remain available.
- All **40 local toolkit icons** loaded in the scrolling view. PC toolkit checked on mobile without content overflow.
- Latest simplification removes the entire graduation spotlight, large poster and promotional headline. Hero highlights now lead directly to Work. IIT LinkedIn and Facebook sources are attached to the existing First Class Honours entry, shared by scrolling and PC Recognition.
- IEEE preview loads in scrolling Research and the PC research pane. The paper image and public DOI are also available in the QuanNetDetect project entry. It is labelled first-page preview of a five-page publication.
- Research chart switches to **82.83%** for CIC-DDoS-2019 and back to **99.95%** for CIC-Darknet-2020; displayed value, selected state and the accessible chart description agree. The caption distinguishes the two tasks/datasets.
- PC Projects opens the real Niroga/Immersive previews. Research scrolls internally with outer window scroll remaining zero. Professional document surfaces, front title bars and controls use the dark palette. Return to scrolling mode works.
- Final browser console error checks returned no errors in development or production preview.

## Quantum ML graphs — latest follow-up

- New response heatmap, exact four-outcome probability bars, probability response curve, entanglement readout and circuit illustration are computed from the two-qubit state, with synthetic inputs labelled clearly.
- Keyboard ArrowRight changes X and its probabilities; without coupling, changing X to its maximum leaves the target readout unchanged (13.6% at the selected Y). The Bell preset gives 50% |00>, 50% |11>, and concurrence 1.00. Plot tapping sets both feature inputs.
- Bounded input sweep was observed moving from X = 1; it completes one cycle and returns to the selected input. It is capped near 30 updates per second, cancels on manual control, and stops offscreen/hidden. The heatmap is redrawn only when coupling changes, not every animation frame.
- Replay visibly advances from encoding to connection to readout and finishes at 03/03. With Motion off, replay immediately displays its final stage and Sweep is disabled; sliders and presets remain usable.
- Presets focus the graph heading and bring their updated charts into view. Both keyboard and pointer controls remain available.
- Layout checked at 320, 390, 768 and 1440px, including a 100.0% readout at 320px: no page or plot overflow. PC Research also contains the lab; its outer window scroll stays zero. Mobile PC research content width equals the pane client width (368px at a 390px viewport).
- Container queries adapt the graph layout to a narrow PC document pane as well as to narrow screens. Default dark palettes and reduced-motion styles are retained.
- The IEEE result display is now a two-column bar chart with both data labels and a shared 0–100% scale. Selecting DDoS updates the highlighted bar and summary to 82.83%.
- Compiled production lab opened at its direct hash after the intro (top offset approximately 95px), without a Vite development client. Its Bell preset produced 50% |00>, 50% |11>, and concurrence 1.00. Browser console error checks were clean.
- No dependency added. Original PDF remains outside source/public/build; no new publication images added.

## Publication privacy and production preview

The supplied IEEE PDF remained in Downloads and was only read locally. **No publication PDF is present in source, public assets, the build, staged files or tracked files.** The only PDF distributed is the pre-existing résumé. Only a rendered first-page WebP is included. Git ignore rules protect publication PDFs. The obsolete ADScAI preview images were moved to ignored local QA artifacts; ADScAI source/award links remain.

A local production server on port 4173 was tested: automatic intro completion, Midnight default, full 3D canvas, 16 project entries, 40 toolkit icons, research chart interaction and first-page image. No Vite development client appeared in the build. All five new product/social images, IEEE image and favicon returned HTTP 200. Mobile production page and canvas bounds passed at 390px. The temporary production server was stopped; development preview on port 5173 remains available.

## Coverage limits

These are browser viewport-emulation checks, not physical Android/iOS or cross-browser certification. Safari, Firefox, real-device GPU frame rates, slow-network behaviour and forced WebGL failure were not independently exercised in this follow-up. Reduced-motion fallbacks were reviewed in code and the manual motion switch tested. No universal performance or future dependency-security guarantee is claimed. Host-specific `_headers` require verification when the user later chooses to deploy.

The existing shell/game tests cover behaviour; prior UI checks for terminal editing/completion, game controls and window operations were preserved in ignored `artifacts/qa/test-report-before-dark.md`. This follow-up did not change that business logic.

## Review captures

Ignored local captures: `artifacts/qa/dark-desktop-home.jpg`, `dark-mobile-390.jpg`, `dark-iit-feature.jpg`, and `quantum-ml-desktop.jpg`. Source provenance is recorded in `SOURCE_NOTES.md`, `public/previews/SOURCES.md` and `public/research/SOURCES.md`.

## Graduation feature simplification

Removed the large poster, standalone headline and spotlight section from the scrolling page and PC Recognition. The original post URLs now appear only in the existing First Class Honours row. Browser inspection confirmed zero graduation poster images, zero spotlight components, and the highlights leading directly to Work. The desktop row is approximately 160px high; both links fit at 390px without horizontal overflow. Lint and build pass. No business logic or dependencies changed; no additional unit tests were needed.

## Consolidated project section — latest layout

Removed the top product showcase. The highlights now lead to Research; all sixteen projects appear once under “Ideas put to work” after Toolkit, beginning with QuanNetDetect. Work navigation and the earlier archive hash both target the lower section. Public links and team credits are retained.

Preview frames are smaller, with no large address/header bands. BL360 ERP Go uses two high-resolution official App Store interface details rather than the cover poster; both images loaded in browser checks. The paper uses a compact sheet thumbnail. At 320, 390, 768 and the default 1280px desktop viewport, the page fits without horizontal overflow. All five project media frames fit at 390px (346px each); all sixteen project rows remain present. Lint/build pass, with no business-logic or dependency changes requiring new unit tests. Nothing was committed or pushed.

## Scroll-motion follow-up

Replaced subtle, once-only entrances with alternating horizontal movement on 76 logical content blocks. Travel is up to 160px, duration 1.05 seconds, with staggered children in larger blocks. A separate departure boundary rearms entrances only after blocks leave view, avoiding threshold flicker. Keyboard focus immediately reveals the focused block. No new dependency, continuous animation loop or scroll interception was added.

Desktop browser checks observed simultaneous positive and negative horizontal transforms (approximately +129px / −129px) during navigation and +151px during native PageDown scrolling. Returning to Research increased its entrance count from one to two. Motion off removed all 76 pending animation targets and left zero inline-hidden elements; motion on restored the effect. ESLint, production build and whitespace checks pass.

Phone checks at 390 × 844 and 320 × 740 showed zero horizontal page overflow. At 390px, live computed transforms were approximately +52px and −54px on opposing entrances. Keyboard navigation to a pending research link revealed its complete block immediately (opacity 1). Browser error log was empty. A short captured browser animation is saved locally under `artifacts/qa/scroll-motion.gif`. These are viewport-emulation checks, not physical-device certification.

## Milestone illustrations and choreography

- Added 11 original SVG illustrations with gold, cyan, lavender, mint and peach accents. Existing milestone text and source URLs remain intact.
- Reading-view rows retain alternating entrances and now stagger the icon, heading, description and links separately. SVG strokes draw in, a finite orbit accent plays, and the separator sweeps across the row. Hover and keyboard focus add a short lift/rotation. No continuous animation loop or dependency was added.
- PC Recognition uses IntersectionObserver within the clipped window. Scrolling its pane brought the next milestone into the animated state. Finished strokes resolved to zero dash offset and text opacity 1. Pane client width and scroll width both measured 878px.
- Checked desktop 1280px and phones at 390px and 320px: no horizontal document overflow. Mobile icons are 38px; the 390px reading view displayed the first two milestones fully with legible copy and source links.
- Keyboard focus triggered the icon response on the active source row. Motion off returned every milestone illustration and stroke to animation none, with zero hidden milestone rows. Reduced-motion and print overrides are included.

Final milestone checks: ESLint, production build and git whitespace checks pass. Browser error log is empty. The first milestone replayed three times during navigation checks. Twelve original source links remain. Captured review media is local and ignored by Git under `artifacts/qa/`. Nothing was committed, pushed or deployed.

## Experience animation follow-up

- All seven career entries retain their original content. The reading view still expands every role by default; the PC document initially expands the first two. Added timeline traces, finite beacon pulses, separator sweeps, staggered achievements/skills and focus/hover feedback.
- Native details/summary semantics are retained. Expansion/collapse animates height only during interaction, with cancellation and cleanup. Rapid close/open/close finished closed with no leftover overflow style. Enter reopened the first role; a live intermediate height confirmed gradual expansion.
- In PC mode, the third role opened with Enter. Disabling motion during a subsequent collapse left it closed with an empty overflow style and trace animation none. Restoring motion returned the normal effects. PC pane client width and scroll width both measured 878px.
- Reviewed full reading layout at 390px, including the first two open roles. Checked 320px layout/collapse and 1280px desktop: zero horizontal document overflow. Skills wrap, date traces move inline on phones, and the full summary remains the interaction target. Reduced-motion CSS and print fallbacks remain in place.

Final Experience checks: ESLint, production build and whitespace checks pass; browser error log is empty. Motion on and all seven reading-view roles were restored before handoff. Local screenshots and animation captures are in ignored `artifacts/qa/`. No dependency was added. Nothing was committed, pushed or deployed.

## Projects 3D exhibit follow-up

- Added a lazy procedural circuit sculpture to the archive heading, using the existing Three.js dependency. Layers unfold and reassemble over approximately two seconds; orbital movement stops after 4.2 seconds. It responds to pointer movement, arrow keys and Replay assembly. Rendering uses a bounded pixel ratio up to 2, pauses outside view/when the tab is hidden and disposes geometry/material/renderer resources when unmounted. Constructor/render/context-loss and unsupported-observer fallbacks are included; forced GPU failure was not separately exercised.
- All 16 projects retain a visual. Existing websites, app screenshots and first-page paper image now use CSS depth layers, pointer tilt, assembly entrances, animated separators and staggered technology labels. The original full paper was not read, copied or uploaded in this follow-up.
- Browser inspection confirmed canvas rendering and transitions between animating, resting and paused states. ArrowRight on the focused canvas triggered rendering. Pointer movement on the paper figure produced non-zero depth variables and a matrix3d transform.
- Motion off changed the preview animation and transform to none and disabled Replay assembly. Motion on was restored. The sculpture unmounted in PC mode; the PC paper preview used its own visibility-driven entrance. Pane client width and scroll width both measured 878px.
- Checked 1280px desktop and 390px/320px phone widths: zero horizontal document overflow. The phone sculpture uses a 2× backing resolution in the tested browser. Both official app screenshots loaded at their 600px source width. The mobile app preview stage measured 259.5px high at 390px and 207px at 320px.
- Caught and corrected intrinsic paper image sizing that could extend into the next row. Desktop source preview stages are bounded to 268.75px at a 430px width. These are viewport checks, not physical-device/GPU certification.

Final project exhibit checks: ESLint, all 25 existing tests, production build and whitespace checks pass. Browser error log is empty. All 16 projects remain available; native touch scrolling is retained. Replay also requests full-figure visibility when the sculpture is partly offscreen. No package, model or texture was installed or downloaded. Nothing was committed, pushed or deployed.
