// Local adaptations of Motion Primitives by @ibelick (MIT).
// Sources and adaptations: docs/refinement/MOTION.md
import { Children, cloneElement, useId, useRef } from "react";
import { AnimatePresence, motion, useInView, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { springs, revealTransition } from "../../lib/motion";

export function AnimatedBackground({ children, value, className = "selection-background" }) {
  const id = useId();
  const reduced = useReducedMotion();
  return Children.map(children, (child) => cloneElement(child, {
    className: `${child.props.className || ""} animated-background-item`,
    // Preserve the control's original event handlers and semantic children.
    children: <>
      <AnimatePresence initial={false}>
        {child.props["data-id"] === value && <motion.span aria-hidden="true" layoutId={reduced ? undefined : `background-${id}`} className={className} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={reduced ? { duration: 0 } : springs.micro} />}
      </AnimatePresence>
      <span className="selection-content">{child.props.children}</span>
    </>,
  }));
}

export function Magnetic({ children, className = "", intensity = 0.14 }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, springs.surface);
  const springY = useSpring(y, springs.surface);
  const reset = () => { x.set(0); y.set(0); };
  return <motion.div ref={ref} className={`magnetic ${className}`} style={{ x: springX, y: springY }}
    onPointerMove={(event) => {
      if (reduced || event.pointerType !== "mouse") return;
      const rect = ref.current.getBoundingClientRect();
      x.set((event.clientX - rect.left - rect.width / 2) * intensity);
      y.set((event.clientY - rect.top - rect.height / 2) * intensity);
    }} onPointerLeave={reset} onBlur={reset}>{children}</motion.div>;
}

export function InView({ children, className = "", variant = "rise", delay = 0, as = "div", ...props }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -40px 0px" });
  const reduced = useReducedMotion();
  const Component = motion[as];
  const hidden = variant === "slide" ? { opacity: 0, x: 28 } : variant === "settle" ? { opacity: 0, y: 34, scale: 0.98 } : { opacity: 0, y: 32 };
  return <Component ref={ref} className={className} initial={reduced ? false : hidden} animate={inView || reduced ? { opacity: 1, x: 0, y: 0, scale: 1 } : hidden} transition={reduced ? { duration: 0 } : { ...revealTransition, delay }} {...props}>{children}</Component>;
}
