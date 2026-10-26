import { useEffect, useRef, useState } from "react";
import { useTheme } from "../../theme/ThemeProvider";

const CHARACTER_RAMP = " .:-=+*#%@";

export default function AsciiEffect({ imageSrc, alt, className = "" }) {
  const hostRef = useRef(null);
  const canvasRef = useRef(null);
  const { palette } = useTheme();
  const paletteRef = useRef(palette);
  const redrawRef = useRef(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    paletteRef.current = palette;
    redrawRef.current?.();
  }, [palette]);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: false });
    if (!host || !context) return undefined;
    const sampleCanvas = document.createElement("canvas");
    const sampleContext = sampleCanvas.getContext("2d", { willReadFrequently: true });
    const image = new Image();
    let width = 0, height = 0, columns = 0, rows = 0;
    let frameId = null, lastFrame = 0, visible = false, disposed = false;
    let densities = null, tones = null, pointer = null, targetPointer = null;
    let bounds = null;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fontSize = 8;
    const cellWidth = fontSize * 0.62, cellHeight = fontSize;
    const stop = () => { if (frameId !== null) cancelAnimationFrame(frameId); frameId = null; };
    const canAnimate = () => visible && !document.hidden && !reduced.matches && !disposed;

    const draw = (time) => {
      if (!densities || disposed) return;
      if (targetPointer && !reduced.matches) {
        if (!pointer) pointer = { ...targetPointer };
        pointer.x += (targetPointer.x - pointer.x) * 0.18;
        pointer.y += (targetPointer.y - pointer.y) * 0.18;
        pointer.strength += (1 - pointer.strength) * 0.12;
      } else if (pointer) {
        pointer.strength *= 0.82;
        if (pointer.strength < 0.01) pointer = null;
      }
      const colors = paletteRef.current;
      context.globalAlpha = 1;
      context.fillStyle = colors.background;
      context.fillRect(0, 0, width, height);
      const flowTime = reduced.matches ? 0 : time * 0.00022;
      for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
          const dx = pointer ? column * cellWidth - pointer.x : 9999;
          const dy = pointer ? row * cellHeight - pointer.y : 9999;
          const distance = Math.hypot(dx, dy);
          const ripple = pointer && distance < 150 && !reduced.matches ? Math.sin(distance * 0.07 - time * 0.0012) * (1 - distance / 150) * 2.4 * pointer.strength : 0;
          const flow = reduced.matches ? 0 : Math.sin(column * 0.018 + row * 0.012 + flowTime) * 0.7;
          const sx = Math.max(0, Math.min(columns - 1, Math.round(column + flow + ripple)));
          const index = row * columns + sx;
          const density = densities[index];
          if (density < 0.08) continue;
          context.fillStyle = colors.ascii[tones[index]];
          context.globalAlpha = 0.42 + density * 0.58;
          context.fillText(CHARACTER_RAMP[Math.min(CHARACTER_RAMP.length - 1, Math.floor(density * (CHARACTER_RAMP.length - 1)))], column * cellWidth, row * cellHeight);
        }
      }
      context.globalAlpha = 1;
    };
    const frame = (time) => {
      frameId = null;
      if (!canAnimate()) return;
      if (time - lastFrame >= 40) { draw(time); lastFrame = time; }
      if (canAnimate()) frameId = requestAnimationFrame(frame);
    };
    const start = () => { if (frameId === null && canAnimate() && densities) frameId = requestAnimationFrame(frame); };
    const refresh = () => { draw(performance.now()); start(); };
    redrawRef.current = refresh;

    // Sample only when the source or canvas size changes, never in the render loop.
    const resize = () => {
      bounds = host.getBoundingClientRect();
      if (!bounds.width || !bounds.height || !image.naturalWidth || !sampleContext) return;
      width = bounds.width; height = bounds.height;
      const dpr = Math.min(devicePixelRatio || 1, 1.4);
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.font = `400 ${fontSize}px ui-monospace, monospace`;
      context.textBaseline = "top";
      columns = Math.max(1, Math.ceil(width / cellWidth)); rows = Math.max(1, Math.ceil(height / cellHeight));
      sampleCanvas.width = columns; sampleCanvas.height = rows;
      sampleContext.fillStyle = "#ffffff";
      sampleContext.fillRect(0, 0, columns, rows);
      const imageRatio = image.naturalWidth / image.naturalHeight;
      const drawWidth = Math.min(width * 0.97, height * imageRatio);
      const drawHeight = drawWidth / imageRatio;
      sampleContext.drawImage(image, (width - drawWidth) / 2 / cellWidth, (height - drawHeight) / 2 / cellHeight, drawWidth / cellWidth, drawHeight / cellHeight);
      try {
        const pixels = sampleContext.getImageData(0, 0, columns, rows).data;
        densities = new Float32Array(columns * rows); tones = new Uint8Array(columns * rows);
        for (let i = 0; i < densities.length; i++) {
          const r = pixels[i * 4], g = pixels[i * 4 + 1], b = pixels[i * 4 + 2];
          const luminance = (r * .2126 + g * .7152 + b * .0722) / 255;
          densities[i] = Math.min(1, (1 - luminance) * 1.3);
          tones[i] = Math.max(r, g, b) - Math.min(r, g, b) < 25 ? 2 : r > b ? 1 : 0;
        }
        setFailed(false); refresh();
      } catch { setFailed(true); }
    };
    image.onload = () => { if (!disposed) resize(); };
    image.onerror = () => { if (!disposed) setFailed(true); };
    image.src = imageSrc;
    const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(host);
    const observer = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
      if (visible) refresh(); else stop();
    }); observer.observe(host);
    const preferenceChanged = () => { stop(); refresh(); };
    const visibilityChanged = () => { if (document.hidden) stop(); else refresh(); };
    const scroll = () => { bounds = host.getBoundingClientRect(); };
    const pointerMove = (event) => {
      if (event.pointerType !== "mouse" || !visible || reduced.matches || !bounds) return;
      targetPointer = event.clientX >= bounds.left && event.clientX <= bounds.right && event.clientY >= bounds.top && event.clientY <= bounds.bottom
        ? { x: event.clientX - bounds.left, y: event.clientY - bounds.top, strength: 0 } : null;
    };
    window.addEventListener("pointermove", pointerMove, { passive: true });
    window.addEventListener("scroll", scroll, { passive: true });
    document.addEventListener("visibilitychange", visibilityChanged);
    reduced.addEventListener("change", preferenceChanged);
    return () => {
      disposed = true; stop(); redrawRef.current = null;
      image.onload = null; image.onerror = null;
      observer.disconnect(); resizeObserver.disconnect();
      window.removeEventListener("pointermove", pointerMove); window.removeEventListener("scroll", scroll);
      document.removeEventListener("visibilitychange", visibilityChanged); reduced.removeEventListener("change", preferenceChanged);
    };
  }, [imageSrc]);
  return <div className={`ascii-effect ${className}`} ref={hostRef} aria-hidden="true">
    <canvas className="ascii-effect-canvas" ref={canvasRef} role="img" aria-label={alt} />
    {failed && <img className="ascii-source-fallback" src={imageSrc} alt={alt} />}
  </div>;
}
