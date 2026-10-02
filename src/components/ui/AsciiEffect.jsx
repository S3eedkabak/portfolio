import { useEffect, useRef, useState } from "react";

const CHARACTER_RAMP = " .:-=+*#%@";
const FLOW_COLORS = ["#8ca18e", "#c2caa8", "#d0b47a"];

export default function AsciiEffect({ imageSrc, alt, className = "" }) {
  const hostRef = useRef(null);
  const canvasRef = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: false, willReadFrequently: true });
    if (!host || !canvas || !context) return undefined;

    const sampleCanvas = document.createElement("canvas");
    const sampleContext = sampleCanvas.getContext("2d", { willReadFrequently: true });
    const image = new Image();
    image.crossOrigin = "anonymous";
    let width = 0;
    let height = 0;
    let frameId = 0;
    let lastFrame = 0;
    let visible = true;
    let pointer = null;
    let disposed = false;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fontSize = 9;
    const cellWidth = fontSize * 0.62;
    const cellHeight = fontSize;

    const render = (time, force = false) => {
      if (disposed || !width || !height || !sampleContext || !image.complete || !image.naturalWidth) return;
      if (!force && time - lastFrame < 45) {
        if (!reducedMotion.matches && visible) frameId = requestAnimationFrame(render);
        return;
      }
      lastFrame = time;
      const columns = Math.max(1, Math.ceil(width / cellWidth));
      const rows = Math.max(1, Math.ceil(height / cellHeight));
      if (sampleCanvas.width !== columns || sampleCanvas.height !== rows) {
        sampleCanvas.width = columns;
        sampleCanvas.height = rows;
      }

      sampleContext.fillStyle = "#07090d";
      sampleContext.fillRect(0, 0, columns, rows);
      const imageRatio = image.naturalWidth / image.naturalHeight;
      const sampleRatio = columns / rows;
      let drawWidth;
      let drawHeight;
      let offsetX;
      let offsetY;
      if (imageRatio > sampleRatio) {
        drawHeight = rows * 1.15;
        drawWidth = drawHeight * imageRatio;
      } else {
        drawWidth = columns * 1.15;
        drawHeight = drawWidth / imageRatio;
      }
      offsetX = (columns - drawWidth) / 2;
      offsetY = (rows - drawHeight) / 2;
      sampleContext.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);

      let pixels;
      try {
        pixels = sampleContext.getImageData(0, 0, columns, rows).data;
      } catch {
        setFailed(true);
        return;
      }

      const flowTime = reducedMotion.matches ? 0 : time * 0.00022;
      context.fillStyle = "#07090d";
      context.fillRect(0, 0, width, height);

      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          const dx = pointer ? column * cellWidth - pointer.x : 9999;
          const dy = pointer ? row * cellHeight - pointer.y : 9999;
          const distance = Math.hypot(dx, dy);
          const ripple = pointer && distance < 150 ? Math.sin(distance * 0.07 - time * 0.0012) * (1 - distance / 150) * 2.4 : 0;
          const flow = Math.sin(column * 0.018 + row * 0.012 + flowTime) * 1.3;
          const sx = Math.max(0, Math.min(columns - 1, Math.round(column + flow + ripple)));
          const sy = Math.max(0, Math.min(rows - 1, row));
          const index = (sy * columns + sx) * 4;
          let luminance = (pixels[index] * 0.2126 + pixels[index + 1] * 0.7152 + pixels[index + 2] * 0.0722) / 255;
          luminance = Math.max(0, Math.min(1, (luminance - 0.5) * 1.1 + 0.5));
          luminance = Math.min(1, luminance * 2.2);
          if (luminance < 0.06) continue;
          const charIndex = Math.min(CHARACTER_RAMP.length - 1, Math.floor(luminance * (CHARACTER_RAMP.length - 1)));
          const colorIndex = Math.min(FLOW_COLORS.length - 1, Math.floor(luminance * FLOW_COLORS.length));
          context.fillStyle = FLOW_COLORS[colorIndex];
          context.globalAlpha = 0.52 + luminance * 0.48;
          context.fillText(CHARACTER_RAMP[charIndex], column * cellWidth, row * cellHeight);
        }
      }
      context.globalAlpha = 1;
      if (!reducedMotion.matches && visible) frameId = requestAnimationFrame(render);
    };

    const resize = () => {
      const bounds = host.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      width = bounds.width;
      height = bounds.height;
      const pixelRatio = Math.min(devicePixelRatio || 1, 1.4);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      context.font = `400 ${fontSize}px Arial, Helvetica, sans-serif`;
      context.textBaseline = "top";
      render(0, true);
    };

    image.onload = () => {
      if (disposed) return;
      setFailed(false);
      resize();
      if (!reducedMotion.matches && visible) frameId = requestAnimationFrame(render);
    };
    image.onerror = () => setFailed(true);
    image.src = imageSrc;

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
      if (visible && !reducedMotion.matches) frameId = requestAnimationFrame(render);
      else cancelAnimationFrame(frameId);
    });
    visibilityObserver.observe(host);

    const handlePointerMove = (event) => {
      const bounds = host.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) {
        pointer = null;
        return;
      }
      pointer = { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
    };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      window.removeEventListener("pointermove", handlePointerMove);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
    };
  }, [imageSrc]);

  return (
    <div className={`ascii-effect ${className}`} ref={hostRef} aria-hidden="true">
      <canvas className="ascii-effect-canvas" ref={canvasRef} role="img" aria-label={alt} />
      {failed && <div className="ascii-effect-fallback">ASCII image unavailable</div>}
    </div>
  );
}
