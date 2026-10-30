# Portfolio content notes

Updated 30 October 2026. This separates public corroboration from the user's supplied biography. External store listings demonstrate products exist; they do not independently establish an individual's contribution.

## Public research sources

- [University of Westminster — Recent Graduate Award 2026](https://www.westminster.ac.uk/about-us/alumni-and-supporters/westminster-alumni-awards/2026-winners/recent-graduate-award-2026): identifies Nirusan Hariharan as a **finalist**, BSc Computer Science with Industrial Experience, 2025. Supports the research description and awards. Its secondary 99.75% figure has been replaced on the portfolio by the task-specific validation results in the supplied IEEE paper.
- [IEEE QCNC accepted papers](https://www.ieee-qcnc.org/2026/accepted-papers.php): lists *QuanNetDetect: A Quantum Hybrid Deep Learning Framework for Encrypted TLS Malicious Traffic Detection*, by Nirusan Hariharan and Guhanathan Poravi, for QCNC 2026 in Kobe, Japan.
- [DOI](https://doi.org/10.1109/QCNC69040.2026.00129) and [IEEE record](https://ieeexplore.ieee.org/document/11500296/): publication links supplied by the user. The IEEE webpage originally presented a verification barrier. On 30 October, the user supplied the actual five-page IEEE paper locally; its text and selected pages were inspected without uploading or copying the PDF into the repository.
- [IIT thesis record](https://dlib.iit.ac.lk/xmlui/handle/123456789/3364): record and abstract supplied by the user. Direct retrieval was unavailable during review; the link is preserved.
- [IEEE INSL LinkedIn post](https://www.linkedin.com/posts/nirusan-hariharan-447463214_ieee-innovation-of-sri-lanka-insl-awarded-activity-7045885862596808704-adB9): primary personal post for the first runner-up recognition. The portfolio uses the 2023 announcement year.

Broad priority claims such as “world's first” and comparisons with specific universities were not used as portfolio headlines.

## User-supplied professional facts

The user explicitly supplied or corrected the following, and they are represented as first-person biography:

- Co-founder **and CTO**, Immersive Smile Plus; collaboration agreements with Genelabs and Hemas Hospital.
- Visiting Lecturer at IIT since May 2026, mentoring final-year quantum-computing research.
- Building and maintaining BlueLotus360 Android, iOS, and Windows ERP applications.
- Maintaining Niroga AI web, commerce, and mobile products, and SENOVA ring/strap sites and Android application.
- First Class Honours, 92% research score, Best Final Year Research Project, ADScAI research award, and NBQSA shortlist.
- Disrupt Asia, National AI Expo, SLT AI Expo participation, StartupTN selection, Yarl IT Hub and IIT product recognition.
- Haxmas/ElderGuardian, HACKX, Cutting Edge placements and team credits.

SLT AI Expo participation was not independently located in a public result during research. Exact event dates were not invented. Previous employment details and project descriptions came from the existing portfolio and supplied screenshots. The original CV is retained, so it may not yet reflect all newly supplied roles.

The pasted Chief Guest / Sentiva panel paragraph appeared to describe a different speaker. It was intentionally **not** attributed to Nirusan.

## Product and archive links

The earlier standalone employer product directory remains removed. In the latest follow-up, the user explicitly requested public production URLs inside Projects. Niroga AI, BlueLotus360, and SENOVA now appear in the shared project archive with nine user-supplied website/store links and high-level descriptions. Partnership names and internal architecture details remain omitted. Product existence does not independently verify the user’s individual contribution; those descriptions are based on their supplied biography. The original thirteen projects are retained, making sixteen entries in total.

The original project archive is retained with team credit added for Immersive Smile Plus and ElderGuardian. EmploySync's two original public GitHub links returned 404 and no replacement was located. Its file now offers a project discussion by email instead of knowingly presenting broken source links. Other external links may change after this review.

## Design references

[Yuta Abe](https://yutaabe.com/), [TO Portfolio](https://to-portfolio.com/), [Wes Dieleman](https://www.wesdieleman.com/about), and [Ammar Raneez](https://ammarraneez.vercel.app/) informed the interactive-scene, startup, desktop-window, and factual-storytelling direction. The scene geometry, terminal, quantum challenges, window system, and layout here were implemented for this portfolio. No model, game, sound recording, or code was copied from those websites. Existing personal photographs and project illustrations were retained.

## ADScAI references added

The user supplied these University of Moratuwa library links for the ADScAI work. Both are now present in Research, and the ADScAI recognition source points to the repository. The two-page document was inspected during the earlier follow-up. Its resource links and award reference remain; the visible preview now uses the IEEE paper instead.

- [ADScAI repository filtered by author](https://dl.lib.uom.lk/collections/82a1a2f9-fd70-41b2-a766-d599d3bbfadd?spc.page=1&f.author=Hariharan,%20N,equals)
- [ADScAI paper download](https://dl.lib.uom.lk/bitstreams/b4cd0161-dae4-47c3-bddf-7de6139ca1a1/download)

## Portrait edit

At the user’s explicit request, the existing photograph was edited using the built-in image tool to remove the venue background and produce a transparent upper-body cutout. The original remains unchanged. The selected master and two optimized WebP assets are in `src/assets/portraits/`; the exact edit prompt is in `EDIT_NOTES.md` there. The site adds its slate/teal backdrop through CSS.

## Browser icon and toolkit artwork

The current favicon is an original orbital Q mark with a mint node and copper tail, supplied as SVG plus raster fallbacks. It appears only in browser metadata; no new logo was added to the page header or body.

The toolkit uses 34 original-variant brand SVGs from [Devicon](https://github.com/devicons/devicon/tree/32fe1d3b3f36ad11f90ab94f7db59738139c2bf6), pinned to that immutable commit, with its MIT license retained. Six additional portfolio-authored pictograms represent LLM integrations, MCP, quantum circuits, cloud infrastructure, VR, and IoT; these are not represented as official brand marks. All icons are local decorative images with visible text labels. Source details and license are in `public/icons/toolkit/`. No npm dependency was added.

## Scrolling portfolio follow-up — 30 October 2026

The main route now opens the scrolling portfolio. `#workspace` explicitly opens the PC interface; the existing reading and section hashes open the scrolling view. At the user’s latest request, all sixteen projects appear once in the lower “Ideas put to work” section, including Niroga AI, BlueLotus360, SENOVA and Immersive Smile Plus. The standalone top showcase was removed. Both layouts share project data, toolkit icons, and Research.

The same desktop workbench geometry is used on mobile. Pixel density is bounded between 1.5 and 2, rather than an unlimited device ratio. The scene pauses outside the viewport or behind another window; native vertical touch scrolling is retained.

The earlier Moratuwa preview was replaced by an IEEE first-page image in the latest follow-up. The old ADScAI images were moved to ignored local QA artifacts, so they are not shipped. See `public/research/SOURCES.md` for current provenance.

The browser favicon was redesigned as a small orbital Q mark with a mint node and copper tail, with a new SVG filename to avoid reusing the old browser cache. No logo image was added to the page header.

## IEEE, social and product previews — latest follow-up

The supplied IEEE paper reports QNN validation accuracy of **99.95%** for the CIC-Darknet-2020 binary task and **82.83%** for CIC-DDoS-2019 multiclass classification. These task-specific results appear in an interactive figure with an explicit note that they are different tasks/datasets, not a controlled comparison between models. Only page one was rendered as an image. The original PDF remains outside the repository and has not been committed, uploaded or published. No full-paper download is bundled.

IIT’s [public LinkedIn graduation feature](https://www.linkedin.com/posts/informatics-institute-of-technology_celebrating-iitian-nirushan-hariharan-best-activity-7409291505158393856-wnDt), dated 23 December 2025, supplied the thumbnail used in an earlier revision. At the user’s request, that large feature and thumbnail are now removed. Its [Facebook counterpart](https://www.facebook.com/iitsl/videos/celebrating-iitian-nirushan-hariharan-best-project-innovative-startup-award-/1198194912288987/) is linked beside it. Both post links now sit in the existing First Class Honours Recognition entry, in both scrolling and PC views. No video, poster, or social tracking script is embedded.

Niroga commerce, SENOVA and Immersive Smile previews are actual browser captures of the public homepages. BlueLotus360 uses a real official Apple App Store screenshot. These are labelled as website/app previews; older independent-project illustrations retain their illustration descriptions. See `public/previews/SOURCES.md` for URLs and image provenance.

Ammar’s complete page was inspected for chapter progression, research visuals, typography and scroll movement. The local Maathava Homes source was read for its masked text, image wipes and staggered motion. Neither reference’s code, text or accomplishments was copied; the Maathava Homes repository was not changed. This portfolio implements the motion with native observers and Web Animations, without GSAP, Lenis or additional npm packages.

## Interactive quantum ML explorer

Ammar’s interactive forecasting/segmentation illustrations informed the interaction style, rather than a static decorative chart. The new implementation and mathematics are original to this portfolio. The explorer is an exact, small real-amplitude simulation of RY(2πx) ⊗ RY(2πy), optionally followed by CNOT with q0 as control; basis order is explicitly |q0 q1>. It displays Born probabilities, target-qubit readout, and pure-state concurrence. The response surface and curve are computed from this circuit, not generated training logs or network captures. Inputs are synthetic and the illustration is explicitly distinguished from the trained QuanNetDetect model.

The RY matrix was checked against [IBM Quantum’s official RYGate reference](https://quantum.cloud.ibm.com/docs/en/api/qiskit/qiskit.circuit.library.RYGate). The published-results bar chart retains the two task-specific QNN validation results transcribed from the supplied IEEE Table II, with a shared zero-to-one-hundred scale and the different task/dataset labels. No paper pages, PDF files, or new publication images were added in this follow-up.

## Consolidated projects and smaller previews

The latest layout puts research first and all projects after the toolkit, preserving the main Work link and the legacy archive anchor. BL360 ERP Go now uses two higher-resolution official App Store images (dashboard and waiting list), encoded locally and shown as interface details through CSS framing. No interface content was generated or rewritten. The old promotional cover is retained only in ignored QA artifacts. Website previews have smaller inset frames; the paper thumbnail uses a compact sheet view. Public product/store links and project credits remain.

## Project exhibit motion and 3D — October 2026

The project archive now includes an original procedural Three.js circuit sculpture and CSS depth layers around existing source previews. No model, texture, icon package or motion library was downloaded. The supplied full IEEE PDF remains outside the repository; the existing first-page WebP is the only publication image used. Public product links are unchanged.

Web searches reviewed portfolio/depth interaction approaches. Implementation references were the primary [Three.js WebGLRenderer documentation](https://threejs.org/docs/pages/WebGLRenderer.html) and [MDN transform-style documentation](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/transform-style). Geometry, assembly animation and input behaviour were authored locally, rather than copied from a reference site.
