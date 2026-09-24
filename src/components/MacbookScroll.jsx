import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

export default function MacbookScroll({ progress = 0 }) {
  const [isMobile, setIsMobile] = useState(false);
  const controlled = useMotionValue(progress);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    controlled.set(progress);
  }, [progress, controlled]);

  const scaleX = useTransform(controlled, [0, 0.3], [1.2, isMobile ? 1 : 1.45]);
  const scaleY = useTransform(controlled, [0, 0.3], [0.6, isMobile ? 1 : 1.45]);
  const translate = useTransform(controlled, [0, 0.72], [0, 760]);
  const rotate = useTransform(controlled, [0.1, 0.13, 0.3], [-28, -28, 0]);

  return (
    <div className="portfolio-macbook">
      <div className="portfolio-macbook-lid">
        <div className="portfolio-macbook-logo"><span>⌁</span></div>
      </div>

      <motion.div
        className="portfolio-macbook-screen"
        style={{
          scaleX,
          scaleY,
          rotateX: rotate,
          translateY: translate,
          transformStyle: "preserve-3d",
          transformOrigin: "top",
        }}
      >
        <div className="portfolio-macbook-screen-inner">
          <img src="https://opengraph.githubassets.com/1/S3eedkabak/test" alt="GitHub repository preview" />
        </div>
      </motion.div>

      <div className="portfolio-macbook-base">
        <div className="portfolio-macbook-speakers" />
        <div className="portfolio-macbook-keys">
          {[
            ["esc","F1","F2","F3","F4","F5","F6","F7","F8","F9","F10","F11","F12","●"],
            ["~ 1","! 1","@ 2","# 3","$ 4","% 5","^ 6","& 7","* 8","( 9",") 0","- _","+ =","delete"],
            ["tab","Q","W","E","R","T","Y","U","I","O","P","{ [","} ]","| \\"],
            ["caps","A","S","D","F","G","H","J","K","L",": ;","\" '","return"],
            ["shift","Z","X","C","V","B","N","M","< ,","> .","? /","shift"],
            ["fn","control","option","command","space","command","option","↑ ← ↓ →"],
          ].map((row, ri) => (
            <div className="portfolio-macbook-key-row" key={ri}>
              {row.map((key, i) => <span key={i}>{key}</span>)}
            </div>
          ))}
        </div>
        <div className="portfolio-macbook-trackpad" />
      </div>
    </div>
  );
}