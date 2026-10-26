# Motion implementation and provenance

Local adaptations of [Motion Primitives](https://motion-primitives.com), by Julien Thibeaut / ibelick. Source reviewed at commit `120f64f6ca60348e251f929e9c81f11ccbe45eda`. License retained in MOTION-LICENSE.md.

- [Animated Background](https://github.com/ibelick/motion-primitives/blob/120f64f6ca60348e251f929e9c81f11ccbe45eda/components/core/animated-background.tsx): shared layoutId and AnimatePresence indicator. Used in language controls and suit selector. Adapted to controlled state, ordinary CSS and semantic span children; preserves the original control's click handlers.
- [Magnetic](https://github.com/ibelick/motion-primitives/blob/120f64f6ca60348e251f929e9c81f11ccbe45eda/components/core/magnetic.tsx): MotionValues and springs for restrained pointer attraction. Used by the hero's explore action. Scoped pointer handlers replace the upstream document listener, and touch/reduced-motion skip attraction.
- [In View](https://github.com/ibelick/motion-primitives/blob/120f64f6ca60348e251f929e9c81f11ccbe45eda/components/core/in-view.tsx): useInView + motion container. Used for coherent groups in the hero biography, bookshelf introduction, projects, About, Experience and contact heading. One-time reveals have rise, lateral and settling compositions. Whole strings remain intact, including Arabic ligatures.

The upstream `motion/react` exports used here are available in the existing installed framer-motion 13.5 runtime. Local imports use `framer-motion`, retaining the signature's existing runtime and avoiding a duplicate package. No Tailwind required or installed.

Custom compositions (not represented as official Motion Primitives): Dock proximity magnification, project illustration parallax, hero scroll parallax, and the browser View Transition radial suit reveal. Springs live in src/lib/motion.js. Dock magnifies adjacent icons from a shared MotionValue; fixed control footprints avoid layout churn. Native section scrolling remains intact.

Deliberately omitted: project dialogs (preserve direct destinations), carousel (no content need), text scramble/character splitting (readability and Arabic shaping), competing bookshelf tilt. No decorative pre-heading text or numbering is introduced.
