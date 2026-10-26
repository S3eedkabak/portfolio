"use client";

import { useEffect, useId, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { parse as parseFont } from "opentype.js";
import { cn } from "../../lib/utils";

interface SignatureProps {
  /** Text to generate signature for */
  text?: string;
  /** Color of the signature path */
  color?: string;
  /** Font size of the signature */
  fontSize?: number;
  /** Animation duration in seconds */
  duration?: number;
  /** Delay before animation starts in seconds */
  delay?: number;
  /** Additional CSS classes */
  className?: string;
  /** Only animate when in view */
  inView?: boolean;
  /** Only animate once */
  once?: boolean;
  /** Custom font URL to load */
  fontUrl?: string;
}

export function Signature({
  text = "Signature",
  color = "currentColor",
  fontSize = 32,
  duration = 1.5,
  delay = 0,
  className,
  inView = false,
  once = true,
  fontUrl,
}: SignatureProps) {
  const reduced = useReducedMotion();
  const [failed, setFailed] = useState(false);
  const [paths, setPaths] = useState<string[]>([]);
  const [verticalBounds, setVerticalBounds] = useState({ y: 0, height: fontSize * 3 });
  const [width, setWidth] = useState<number>(300);
  const horizontalPadding = fontSize * 0.1;
  const topMargin = fontSize * 1.5; // Shift down
  const baseline = topMargin;
  const maskId = `signature-reveal-${useId().replace(/:/g, "")}`;

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        let font;
        const fontPaths = fontUrl 
          ? [fontUrl] 
          : [
              "/LastoriaBoldRegular.otf",
              "./LastoriaBoldRegular.otf",
              "https://www.componentry.fun/LastoriaBoldRegular.otf",
            ];

        for (const path of fontPaths) {
          try {
            const response = await fetch(path);
            if (!response.ok) throw new Error(`Font request failed: ${response.status}`);
            font = parseFont(await response.arrayBuffer());
            break;
          } catch {
            // Try next path
          }
        }

        if (!font) {
          throw new Error("Font could not be loaded from any path");
        }

        let x = horizontalPadding;
        const newPaths: string[] = [];
        let minY = Infinity, maxY = -Infinity;

        for (const char of text) {
          const glyph = font.charToGlyph(char);
          const path = glyph.getPath(x, baseline, fontSize);
          newPaths.push(path.toPathData(3));
          if (path.commands.length) {
            const bounds = path.getBoundingBox();
            minY = Math.min(minY, bounds.y1);
            maxY = Math.max(maxY, bounds.y2);
          }

          const advanceWidth = glyph.advanceWidth ?? font.unitsPerEm;
          x += advanceWidth * (fontSize / font.unitsPerEm);
        }

        if (cancelled) return;
        setFailed(false);
        setVerticalBounds({ y: minY - 12, height: maxY - minY + 24 });
        setPaths(newPaths);
        setWidth(x + horizontalPadding);
      } catch (error) {
        if (cancelled) return;
        setFailed(true);
        console.error("Signature component font load error:", error);
        setPaths([]);
        setWidth(text.length * fontSize * 0.6);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [text, fontSize, baseline, horizontalPadding, fontUrl]);

  const variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { pathLength: 1, opacity: 1 },
  };

  return (
    <motion.svg
      key={paths.length}
      width={width}
      height={verticalBounds.height}
      viewBox={`0 ${verticalBounds.y} ${width} ${verticalBounds.height}`}
      fill="none"
      className={cn("overflow-visible", className)}
      aria-hidden="true"
      initial={reduced ? "visible" : "hidden"}
      whileInView={inView ? "visible" : undefined}
      animate={inView ? undefined : "visible"}
      viewport={{ once }}
    >
      {failed && <text x={horizontalPadding} y={baseline} fill={color} fontSize={fontSize} fontFamily="cursive">{text}</text>}
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse">
          {paths.map((d, i) => (
            <motion.path
              key={i}
              d={d}
              stroke="white"
              strokeWidth={fontSize * 0.22}
              fill="none"
              variants={variants}
              transition={{
                pathLength: {
                  delay: reduced ? 0 : delay + i * 0.07,
                  duration: reduced ? 0 : duration,
                  ease: "easeInOut",
                },
                opacity: {
                  delay: reduced ? 0 : delay + i * 0.07 + 0.01,
                  duration: 0.01,
                },
              }}
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </mask>
      </defs>

      {paths.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          stroke={color}
          strokeWidth={2}
          fill="none"
          variants={variants}
          transition={{
            pathLength: {
              delay: reduced ? 0 : delay + i * 0.07,
              duration: reduced ? 0 : duration,
              ease: "easeInOut",
            },
            opacity: {
              delay: reduced ? 0 : delay + i * 0.07 + 0.01,
              duration: 0.01,
            },
          }}
          vectorEffect="non-scaling-stroke"
          strokeLinecap="butt"
          strokeLinejoin="round"
        />
      ))}

      <g mask={`url(#${maskId})`}>
        {paths.map((d, i) => <path key={i} d={d} fill={color} />)}
      </g>
    </motion.svg>
  );
}
