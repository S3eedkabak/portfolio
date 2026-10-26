# Rebrand preservation audit

Baseline: clean `rebrand`, React 18 / Vite 6 / Framer Motion 13.5. No Tailwind setup; retain CSS. Production build passes before changes, with existing >500 kB chunk warnings. npm ci reports two existing high severity dependency advisories.

Mounted: Navbar, Hero (ASCII canvas + Lastoria/OpenType signature), System (lazy R3F bookshelf), Projects, About, Experience, Contact (DOM keyboard + email sequence), footer.
Inactive and protected: GameSection, MacBookScene. Keep unmounted and unchanged.

The later critical design override authorizes a full visual transformation of all layouts, typography and section compositions. Functional centerpieces, content and destinations remain protected; zero decorative eyebrow labels.

## Preservation checklist (recorded before implementation; checked after verification)

- [x] src/data/portfolio.js, i18n.js, syrianArabic.js: byte-identical; translations and Syrian override unchanged.
- [x] spider.svg and bundled Lastoria font unchanged.
- [x] All original text, project stacks, URLs, contact address, nav destinations remain.
- [x] Signature retains custom font, glyph paths, mask and drawing animation.
- [x] ASCII retains sampling, character flow, pointer distortion, visibility pause and reduced motion.
- [x] Bookshelf retains five books, cover technologies, seeded geometry, select/inspect, camera drag, orbit, arrows, Enter and Escape.
- [x] Contact retains 450 ms activation delay, 115 ms character sequence, key mapping, replay, desktop Gmail/mobile mailto routing.
- [x] EN/DE/SK/AR with Syrian override and RTL survive theme changes.
- [x] Mobile menu and top/system/work/about/LinkedIn navigation survive.
- [x] Keyboard listeners, WebAudio cleanup, lazy boundary and inactive features survive.

## Risks and safe enhancement points

ASCII currently resamples its static source every frame and can schedule overlapping RAFs through load/resize/intersection callbacks. Cache source samples per resize; own one RAF; theme changes must not recreate renderer. Source has a white background, so use inverse luminance for the illustration silhouette rather than bright background pixels.

Bookshelf has continuous imperative camera/book motion. Preserve its render mode while visible; pause when offscreen/hidden, cap DPR. Theme material changes must retain selected book and camera. Texture cleanup currently couples geometry disposal to texture updates; separate those lifecycles.

Contact timing effect depends only on motion/started/run. Theme updates must not remount it or add theme to those dependencies. Existing keyboard min-width overflows its console on desktop; use fluid layout at every size.

Signature currently has no font failure fallback and does not honor reduced motion. Add final-state path rendering and a semantic name/fallback without replacing the custom signature.

Hardcoded legacy palette appears in hero/wash/ASCII, navbar glass, book covers/foil/paper, contact console/keys, tooltip and selection. Central semantic tokens plus a shared JS palette will bridge CSS, canvas and WebGL. Existing styles remain; migrate color declarations and add focused refinement rules.

Motion Primitives source inspected: Animated Background, Magnetic, In View from github.com/ibelick/motion-primitives/components/core. Adapt locally to existing framer-motion exports, regular CSS, pointer-only listeners and reduced-motion support. No second runtime or Tailwind required.
