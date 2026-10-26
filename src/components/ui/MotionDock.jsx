import { useLayoutEffect, useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { Boxes, FolderOpen, UserRound, Linkedin } from "lucide-react";
import { springs } from "../../lib/motion";

function DockItem({ item, pointer, active, scrollTo }) {
  const ref = useRef(null);
  const center = useMotionValue(0);
  const reduced = useReducedMotion();
  useLayoutEffect(() => {
    const measure = () => { const box = ref.current?.getBoundingClientRect(); if (box) center.set(box.left + box.width / 2); };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [center, item.label]);
  const target = useTransform([pointer, center], ([x, mid]) => reduced ? 1 : 1 + Math.max(0, 1 - Math.abs(x - mid) / 130) * 0.36);
  const scale = useSpring(target, springs.dock);
  const y = useTransform(scale, [1, 1.36], [0, -5]);
  const Icon = item.icon;
  const contents = <><motion.span className="dock-icon" style={{ scale, y }}><Icon size={20} /></motion.span><span className="dock-label">{item.label}</span>{active && <motion.span className="dock-active" layoutId="dock-active" transition={springs.micro} />}</>;
  return item.href
    ? <a ref={ref} className="dock-item" href={item.href} target="_blank" rel="noreferrer">{contents}</a>
    : <button ref={ref} type="button" className="dock-item" aria-current={active ? "location" : undefined} onClick={() => scrollTo(item.id)}>{contents}</button>;
}
export default function MotionDock({ t, active, scrollTo }) {
  const pointer = useMotionValue(-1000);
  const items = [{ id: "system", label: t.nav.system, icon: Boxes }, { id: "work", label: t.nav.work, icon: FolderOpen }, { id: "about", label: t.nav.about, icon: UserRound }, { id: "linkedin", label: t.nav.linkedin, icon: Linkedin, href: "https://www.linkedin.com/in/saeid-kabak-5311a3309" }];
  return <nav className="motion-dock" aria-label="Main navigation" onPointerMove={(event) => { if (event.pointerType === "mouse") pointer.set(event.clientX); }} onPointerLeave={() => pointer.set(-1000)}>
    {items.map((item) => <DockItem key={item.id} item={item} pointer={pointer} active={active === item.id} scrollTo={scrollTo} />)}
  </nav>;
}
