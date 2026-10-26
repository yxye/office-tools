export interface ImageOptions {
  text: string;
  opacity: number;
  size: number;
  angle: number;
  gap: number;
  color: string;
  tiled: boolean;
  smooth: number;
  brighten: number;
  warmth: number;
}

export const initialOptions: ImageOptions = {
  text: "仅供内部使用", opacity: 0.3, size: 36, angle: -30, gap: 100,
  color: "#ffffff", tiled: true, smooth: 35, brighten: 10, warmth: 0,
};

// Only blend the blurred layer into likely skin pixels; preserve strong edges.
export function beautifyPixels(original: Uint8ClampedArray, blurred: Uint8ClampedArray, options: ImageOptions) {
  const out = new Uint8ClampedArray(original);
  for (let i = 0; i < out.length; i += 4) {
    const r = original[i], g = original[i + 1], b = original[i + 2];
    // ponytail: skin-color heuristic; use face segmentation if selective portrait editing is needed.
    const skin = r > 60 && r > g && r > b && r - Math.min(g, b) > 12;
    const edge = Math.max(Math.abs(r - blurred[i]), Math.abs(g - blurred[i + 1]), Math.abs(b - blurred[i + 2]));
    const blend = skin ? options.smooth / 100 * Math.max(0, 1 - edge / 45) : 0;
    for (let c = 0; c < 3; c++) {
      const value = original[i + c] * (1 - blend) + blurred[i + c] * blend;
      const lift = options.brighten / 100 * (255 - value) * 0.45;
      const warmth = options.warmth * (c === 0 ? 0.35 : c === 2 ? -0.35 : 0);
      out[i + c] = value + lift + warmth;
    }
  }
  return out;
}

export function renderImage(source: HTMLCanvasElement, mode: "watermark" | "beauty", options: ImageOptions) {
  const canvas = document.createElement("canvas");
  canvas.width = source.width;
  canvas.height = source.height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("无法创建图片画布");
  ctx.drawImage(source, 0, 0);
  if (mode === "beauty") {
    const original = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.filter = `blur(${Math.max(1, Math.min(canvas.width, canvas.height) / 350)}px)`;
    ctx.drawImage(source, 0, 0);
    ctx.filter = "none";
    const blurred = ctx.getImageData(0, 0, canvas.width, canvas.height);
    original.data.set(beautifyPixels(original.data, blurred.data, options));
    ctx.putImageData(original, 0, 0);
  } else if (options.text.trim()) {
    ctx.font = `${options.size}px system-ui, "Microsoft YaHei", sans-serif`;
    ctx.fillStyle = options.color;
    ctx.globalAlpha = options.opacity;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    if (options.tiled) {
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(options.angle * Math.PI / 180);
      const radius = Math.hypot(canvas.width, canvas.height) / 2;
      const stepX = ctx.measureText(options.text).width + options.gap;
      const stepY = options.size + options.gap;
      for (let y = -radius; y <= radius; y += stepY)
        for (let x = -radius; x <= radius; x += stepX) ctx.fillText(options.text, x, y);
    } else {
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(options.angle * Math.PI / 180);
      ctx.fillText(options.text, 0, 0);
    }
  }
  return canvas;
}
