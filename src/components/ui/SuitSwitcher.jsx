import { Moon, Sun } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useTheme } from "../../theme/ThemeProvider";
import { AnimatedBackground } from "../motion/primitives";

const labels = {
  EN: ["Choose suit", "Classic suit — light theme", "Symbiote suit — dark theme"],
  DE: ["Anzug wählen", "Klassischer Anzug — helles Design", "Symbiontenanzug — dunkles Design"],
  SK: ["Vybrať oblek", "Klasický oblek — svetlá téma", "Symbiotický oblek — tmavá téma"],
  AR: ["اختار البدلة", "البدلة الكلاسيكية — مظهر فاتح", "بدلة سيمبيوت — مظهر داكن"],
};
export default function SuitSwitcher({ language }) {
  const { theme, setTheme, switching } = useTheme();
  const reduced = useReducedMotion();
  const text = labels[language];
  return <div className="suit-switcher" role="group" aria-label={text[0]}>
    <AnimatedBackground value={theme}>
      {["classic", "symbiote"].map((suit, index) => {
        const Icon = index ? Moon : Sun;
        return <motion.button key={suit} type="button" data-id={suit} data-suit={suit} aria-label={text[index + 1]} title={text[index + 1]} aria-pressed={theme === suit} disabled={switching} onClick={(event) => setTheme(suit, event)} whileTap={reduced ? undefined : { scale: 0.88 }}><Icon size={17} /></motion.button>;
      })}
    </AnimatedBackground>
  </div>;
}
