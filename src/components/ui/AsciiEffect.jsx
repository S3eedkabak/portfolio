import { useEffect, useRef, useState } from "react";

const CHARACTER_RAMP = "  .·:+*xX#@";
const FLOW_COLORS = ["#6f8c7a", "#a8b99b", "#d0b47a"];

export default function AsciiEffect({ imageSrc, alt, className = "" }) {
  const hostRef = useRef(null);
  const canvasRef = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: false, willReadFrequently: true });
    if (!host || !canvas || !context) {
      setFailed(true);
      return undefined;
    }

    const sampleCanvas = document.createElement("canvas");
    const sampleContext = sampleCanvas.getContext("2d", { willReadFrequently: true });
    const image = new Image();
    let width = 0;
    let height = 0;
    let frameId = 0;
    let lastFrame = 0;
    let visible = true;
    let pointer = null;
    let disposed = false;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fontSize = window.innerWidth < 700 ? 9 : 11;
    const cellWidth = fontSize * 0.66;
    const cellHeight = fontSize * 1.2;

    const render = (time, force = false) => {
      if (disposed || !width || !height || !sampleContext || !image.complete || !image.naturalWidth) return;
      if (!force && time - lastFrame < 55) {
        if (!reducedMotion.matches && visible) frameId = window.requestAnimationFrame(render);
        return;
      }
      lastFrame = time;
      const columns = Math.max(1, Math.ceil(width / cellWidth));
      const rows = Math.max(1, Math.ceil(height / cellHeight));
      if (sampleCanvas.width !== columns || sampleCanvas.height !== rows) {
        sampleCanvas.width = columns;
        sampleCanvas.height = rows;
      }

      sampleContext.fillStyle = "#111816";
      sampleContext.fillRect(0, 0, columns, rows);
      const imageRatio = image.naturalWidth / image.naturalHeight;
      const sampleRatio = columns / rows;
      let drawWidth = columns;
      let drawHeight = rows;
      let offsetX = 0;
      let offsetY = 0;
      if (imageRatio > sampleRatio) {
        drawHeight = columns / imageRatio;
        offsetY = (rows - drawHeight) / 2;
      } else {
        drawWidth = rows * imageRatio;
        offsetX = (columns - drawWidth) / 2;
      }
      sampleContext.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
      const pixels = sampleContext.getImageData(0, 0, columns, rows).data;
      const flowTime = reducedMotion.matches ? 0 : time * 0.00016;
      const ripple = pointer && !reducedMotion.matches ? pointer : null;

      context.fillStyle = "#111816";
      context.fillRect(0, 0, width, height);
      for (let row = 0; row < rows; row += 1) {
        const y = row * cellHeight;
        for (let column = 0; column < columns; column += 1) {
          const wave = Math.sin(column * 0.07 + row * 0.045 + flowTime) * 0.75;
          const dx = ripple ? (column - ripple.x) * cellWidth : 0;
          const dy = ripple ? (row - ripple.y) * cellHeight : 0;
          const radius = ripple ? Math.sqrt(dx * dx + dy * dy) : 10000;
          const influence = ripple ? Math.max(0, 1 - radius / 210) : 0;
          const displacedX = Math.max(0, Math.min(columns - 1, Math.round(column + wave + influence * 1.8)));
          const displacedY = Math.max(0, Math.min(rows - 1, Math.round(row + Math.sin(column * 0.04 + flowTime) * 0.45)));
          const sampleIndex = (displacedY * columns + displacedX) * 4;
          const luminance = (pixels[sampleIndex] * 0.2126 + pixels[sampleIndex + 1] * 0.7152 + pixels[sampleIndex + 2] * 0.0722) / 255;
          if (luminance < 0.2) continue;
          const characterIndex = Math.min(CHARACTER_RAMP.length - 1, Math.floor(luminance * (CHARACTER_RAMP.length - 1)));
          const colorIndex = Math.min(FLOW_COLORS.length - 1, Math.floor(luminance * FLOW_COLORS.length));
          context.fillStyle = FLOW_COLORS[colorIndex];
          context.globalAlpha = 0.3 + luminance * 0.58;
          context.fillText(CHARACTER_RAMP[characterIndex], column * cellWidth, y);
        }
      }
      context.globalAlpha = 1;
      if (!reducedMotion.matches && visible) frameId = window.requestAnimationFrame(render);
    };

    const resize = () => {
      const bounds = host.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      width = bounds.width;
      height = bounds.height;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.2);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      context.font = `500 ${fontSize}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      context.textBaseline = "top";
      context.fillStyle = "#111816";
      context.fillRect(0, 0, width, height);
      render(0, true);
    };

    image.onload = () => {
      if (disposed) return;
      setFailed(false);
      resize();
      if (!reducedMotion.matches && visible) frameId = window.requestAnimationFrame(render);
    };
    image.onerror = () => setFailed(true);
    image.src = imageSrc;

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
      if (visible && !reducedMotion.matches) frameId = window.requestAnimationFrame(render);
      else window.cancelAnimationFrame(frameId);
    }, { rootMargin: "80px" });
    visibilityObserver.observe(host);

    const handlePointerMove = (event) => {
      const bounds = host.getBoundingClientRect();
      const inside = event.clientX >= bounds.left && event.clientX <= bounds.right && event.clientY >= bounds.top && event.clientY <= bounds.bottom;
      pointer = inside ? { x: ((event.clientX - bounds.left) / width) * (width / cellWidth), y: ((event.clientY - bounds.top) / height) * (height / cellHeight) } : null;
    };
    const handleMotionChange = () => {
      window.cancelAnimationFrame(frameId);
      render(0, true);
      if (!reducedMotion.matches && visible) frameId = window.requestAnimationFrame(render);
    };
    const handleWindowResize = () => resize();
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("resize", handleWindowResize, { passive: true });
    reducedMotion.addEventListener?.("change", handleMotionChange);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("resize", handleWindowResize);
      reducedMotion.removeEventListener?.("change", handleMotionChange);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      image.onload = null;
      image.onerror = null;
    };
  }, [imageSrc]);

  return (
    <div className={`ascii-effect ${className}`} ref={hostRef} aria-hidden="true">
      <canvas className="ascii-effect-canvas" ref={canvasRef} role="img" aria-label={alt} />
      {failed && (
        <pre className="ascii-effect-fallback">
          {"       .       .       .\n   .     .   .     .\n .   . .   .   . .   .\n      .   . .   .\n   .     .   .     .\n       .       ."}
        </pre>
      )}
    </div>
  );
}
