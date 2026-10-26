# Spider-Verse portfolio redesign

Implemented locally in `/Users/s3eed/Documents/GitHub/portfolio`, on `rebrand`. Nothing committed, pushed or deployed. The critical design override governs the result: new visual compositions, original content and functional centerpieces, no decorative eyebrow text or section numbering.

## A. Implementation

| Area | Result |
| --- | --- |
| Navigation | Floating glass header, proximity-based spring Dock on desktop, shared active indicator, accessible mobile menu, compact native mobile language selector, suit controls with 44px mobile targets. |
| Hero | Original Spider-Man SVG now resolves as a recognizable red/blue or silver ASCII silhouette; orbital lighting, restrained scroll depth, oversized custom signature, clear biography separation and magnetic explore action. |
| System | Split introduction and central 3D installation with a projected halo. Five original interactive books receive theme-aware covers and foil. |
| Projects | Large alternating showcases with original descriptions and stack tags. Lightweight vector compositions reference forestry, retrieval networks and city geography. Direct repository links remain intact. |
| About | Editorial two-column composition, larger lead paragraph, separate education/body rhythm, social link feedback, whole-element reveals safe for Arabic. |
| Experience | Substantial two-column presentation for the single existing entry, anchored date/role hierarchy and restrained entry choreography. |
| Contact | Central keyboard scene, oversized original heading, silver or graphite materials, framed email console, original key highlights and replay. |

## B. Protected features

Verified with source comparison, browser interaction tests and screenshot review:

- `src/data/portfolio.js`, `i18n.js`, `syrianArabic.js`: byte-identical to the starting commit. Original text, facts, translated strings, stacks and URLs retained.
- `src/assets/spider.svg` and bundled Lastoria font: byte-identical. The original OpenType glyph paths, SVG mask and handwritten drawing remain. Added actual glyph bounds, accessible name, font failure fallback and reduced-motion final state.
- `mac-keyboard.tsx`: byte-identical. DOM keys, mappings, physical key listeners and audio handling preserved; surrounding CSS supplies materials and fixes the arrow cluster's intrinsic width.
- Contact timing and routing retained: 450ms delay, 115ms character interval, mapped highlighted keys, replay, desktop Gmail and mobile mailto. Tests verify that theme/language changes do not restart completed typing.
- Bookshelf: original five books, cover technology text, seeded geometry, camera, selection, inspection, pointer orbit, arrows, Enter, Escape and touch selection retained. Space activation repaired. Selected book survives theme and language updates.
- EN/DE/SK/AR, Syrian Arabic override and RTL verified; strings are never split into characters.
- Original System/Work/About/LinkedIn navigation and top action retained. Mobile selection closes the menu; Escape restores toggle focus.
- `GameSection.jsx` and `MacBookScene.jsx`: unchanged and still inactive.
- No decorative eyebrows or substitute section numbering rendered. Existing unused translation fields remain untouched.

## C. Themes

Semantic CSS tokens are centralized in `src/theme/tokens.css`. CSS, ASCII and book textures share these values through ThemeProvider's palette bridge.

Classic uses neutral white/light-blue surfaces, navy typography, red focal accents and blue depth. Symbiote uses layered black/graphite surfaces, silver highlights, directional cool lighting and dark keyboard/book materials.

An inline bootstrap applies the stored suit before the app paints. First visits follow the OS preference, including subsequent OS changes until the visitor makes an explicit choice. Manual choice persists in localStorage; denied storage falls back safely for the current session. Language changes retain the current suit.

On supporting browsers, a 560ms radial View Transition originates at the selected control. Switching back reverses the reveal. Unsupported browsers receive direct state updates with CSS color-transition enhancement where available. Reduced motion switches immediately. No component remount is used to change themes.

## D. Motion

Locally adapted Motion Primitives: **Animated Background**, **Magnetic**, **In View**. Actual upstream sources, version, adaptations and license are recorded in [MOTION.md](MOTION.md). Existing Framer Motion 13.5 provides the compatible APIs; no additional animation runtime or Tailwind was installed.

Shared spring parameters live in `src/lib/motion.js`. The custom Dock uses a shared pointer MotionValue to magnify adjacent icons without changing their layout footprints. Project illustrations respond subtly to pointer movement; hero artwork has restrained scroll depth. Sections use different coherent group entrances rather than character-level effects. Reduced motion reaches readable final states immediately, including the signature and bookshelf camera.

## E. Performance

- ASCII now samples the static SVG only on image load/resize, caches typed arrays, and owns one cancellable RAF. Pointer interpolation runs inside that existing loop. Canvas DPR remains capped at 1.4; drawing is throttled to approximately 25fps.
- Automated instrumentation verified that samples stay unchanged during animation, drawing stops offscreen and drawing stops after reduced motion becomes active.
- Bookshelf rendering pauses offscreen and when the document is hidden; its original continuous imperative animation mode remains while visible. DPR is capped at 1.5. Geometry and texture disposal lifecycles are separate, avoiding geometry disposal on palette changes.
- Ordinary movement uses transforms/opacity, native scrolling remains, and pointer movement does not set React state each frame.
- A local headless Chrome observation of a suit switch with the bookshelf visible recorded no tasks above the browser long-task threshold. This is a limited local observation, not a mobile frame-rate benchmark.
- Production output retains the existing large-chunk warning: about 599kB main JS and 839kB lazy bookshelf JS before gzip (about 184kB and 226kB gzipped). No new runtime dependencies; only Playwright and axe were added as development tools.

## F. Screenshots

The screenshots are actual browser captures. Full-page captures visit each heading first so viewport-triggered reveals are visible. Hero captures include navigation.

| View | Classic | Symbiote |
| --- | --- | --- |
| Desktop hero/navigation | [Classic](screenshots/desktop-classic-top.png) | [Symbiote](screenshots/desktop-symbiote-top.png) |
| Mobile hero/navigation | [Classic](screenshots/mobile-classic-top.png) | [Symbiote](screenshots/mobile-symbiote-top.png) |
| Desktop full page | [Classic](screenshots/desktop-classic-full.png) | [Symbiote](screenshots/desktop-symbiote-full.png) |
| Mobile full page | [Classic](screenshots/mobile-classic-full.png) | [Symbiote](screenshots/mobile-symbiote-full.png) |
| Bookshelf | [Classic](screenshots/desktop-classic-bookshelf.png) | [Symbiote](screenshots/desktop-symbiote-bookshelf.png) |
| Mobile book inspection | [Classic](screenshots/mobile-classic-book-inspection.png) | [Symbiote](screenshots/mobile-symbiote-book-inspection.png) |
| Project showcase | [Classic](screenshots/desktop-classic-project.png) | [Symbiote](screenshots/desktop-symbiote-project.png) |
| Contact keyboard | [Classic](screenshots/desktop-classic-keyboard.png) | [Symbiote](screenshots/desktop-symbiote-keyboard.png) |
| About | [Classic](screenshots/desktop-classic-about.png) | [Symbiote](screenshots/desktop-symbiote-about.png) |
| Experience | [Classic](screenshots/desktop-classic-experience.png) | [Symbiote](screenshots/desktop-symbiote-experience.png) |

[Original desktop](screenshots/before-desktop.png) · [Original mobile](screenshots/before-mobile.png) · [Arabic RTL](screenshots/mobile-ar.png) · [German](screenshots/mobile-de.png) · [Mobile menu](screenshots/mobile-navigation.png)

## G. Verification

- `npm run build`: passed.
- `npm run test:e2e`: **21 passed** on the final application source.
- The responsive matrix covers **72 combinations**: 9 widths × 4 languages × 2 suits. Widths: 320, 360, 375, 390, 430, 768, 1024, 1440 and 1920px. Checks inspect actual document overflow and key content/control bounds. No page-wide overflow clipping is used; only artwork/installations clip their intentional decorative effects.
- Automated axe WCAG 2 A/AA and 2.1 AA checks: **zero reported violations in both themes**. This is automated coverage, not a complete accessibility certification.
- Theme preference, live OS preference, persistence, blocked storage, fallback transition, translation/RTL, navigation, original project destinations, signature paths, mobile menu, touch book selection, selected-book continuity, pointer orbit, contact sequence, mapped keys and replay: passed.
- Canvas instrumentation: source sample caching, offscreen pause and live reduced-motion changes passed.
- Actual production browser walkthrough inspected all sections and theme switching; final resource/console check found no failures. In-app browser also checked suit switching and mobile menu navigation.
- Desktop/mobile screenshots reviewed against the baseline and in both themes; Arabic, German, bookshelf inspection, About hierarchy and contact materials reviewed visually.
- `git diff --check`: clean.

Reproduce from the repository:

```sh
npm ci
npm run build
npm run test:e2e
npm run preview -- --host 127.0.0.1 --port 4173
# In a second terminal:
npm run capture
```

Tests default to the installed macOS Google Chrome executable. Set `PLAYWRIGHT_CHROME` to another Chrome/Chromium executable on other machines. The capture script accepts `PORTFOLIO_URL` to target a different local preview.

## H. Remaining limits

No known reproducible functional regression remains in the exercised paths. Safari/WebKit, Firefox, physical phones/notches, real mobile GPU frame times, extended GPU leak testing, and a manual screen-reader audit were not performed. Mail destinations were verified without sending messages or opening an authenticated Gmail compose flow.

The original repository's large JS chunk warning remains. `npm audit` also reports two pre-existing high-severity development dependency advisories (`vite` and `source-map-js`). They were recorded at baseline; a tooling/security upgrade was not folded into the visual redesign.
