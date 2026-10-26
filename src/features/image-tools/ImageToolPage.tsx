import { useEffect, useRef, useState } from "react";
import { open, save } from "@tauri-apps/plugin-dialog";
import { readFile, writeFile } from "@tauri-apps/plugin-fs";
import { initialOptions, renderImage, type ImageOptions } from "./process";

const button = "rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm disabled:opacity-50";

export default function ImageToolPage({ mode }: { mode: "watermark" | "beauty" }) {
  const [source, setSource] = useState<HTMLCanvasElement | null>(null);
  const [path, setPath] = useState("");
  const [options, setOptions] = useState({ ...initialOptions });
  const [format, setFormat] = useState("png");
  const [compare, setCompare] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");
  const [rendering, setRendering] = useState(false);
  const preview = useRef<HTMLDivElement>(null);
  const result = useRef<HTMLCanvasElement | null>(null);
  const title = mode === "watermark" ? "图片文字水印" : "图片美颜";
  const update = (key: keyof ImageOptions, value: string | number | boolean) => {
    setOptions(current => ({ ...current, [key]: value }));
    setSaved("");
  };

  useEffect(() => {
    result.current = null;
    if (!source) return;
    setRendering(true);
    const timer = window.setTimeout(() => {
      try {
        const canvas = compare ? source : renderImage(source, mode, options);
        canvas.style.maxWidth = "100%";
        canvas.style.maxHeight = "65vh";
        canvas.style.objectFit = "contain";
        canvas.setAttribute("role", "img");
        canvas.setAttribute("aria-label", compare ? "原始图片" : `${title}效果预览`);
        preview.current?.replaceChildren(canvas);
        result.current = compare ? null : canvas;
        setError("");
      } catch (e) { setError(`处理失败：${String(e)}`); }
      finally { setRendering(false); }
    }, 180);
    return () => window.clearTimeout(timer);
  }, [source, mode, options, compare, title]);

  async function choose() {
    setBusy(true); setError(""); setSaved("");
    let url = "";
    try {
      const selected = await open({ multiple: false, filters: [{ name: "图片", extensions: ["png", "jpg", "jpeg", "webp"] }] });
      if (typeof selected !== "string") return;
      const bytes = await readFile(selected);
      if (bytes.byteLength > 80 * 1024 * 1024) throw new Error("图片文件不能超过 80 MB");
      url = URL.createObjectURL(new Blob([bytes]));
      const image = new Image();
      image.src = url;
      await image.decode();
      if (image.naturalWidth * image.naturalHeight > 24_000_000 || Math.max(image.naturalWidth, image.naturalHeight) > 8192)
        throw new Error("请使用 2400 万像素以内、单边不超过 8192 像素的图片");
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth; canvas.height = image.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("无法读取图片");
      ctx.drawImage(image, 0, 0);
      setCompare(false); setSource(canvas); setPath(selected);
    } catch (e) { setError(`打开失败：${String(e)}`); }
    finally { if (url) URL.revokeObjectURL(url); setBusy(false); }
  }

  async function exportImage() {
    const canvas = result.current;
    if (!canvas) return;
    setBusy(true); setError(""); setSaved("");
    try {
      // JPEG has no alpha channel: use white rather than implicit black.
      const output = document.createElement("canvas");
      output.width = canvas.width; output.height = canvas.height;
      const ctx = output.getContext("2d");
      if (!ctx) throw new Error("无法导出图片");
      if (format === "jpg") { ctx.fillStyle = "white"; ctx.fillRect(0, 0, output.width, output.height); }
      ctx.drawImage(canvas, 0, 0);
      const blob = await new Promise<Blob>((resolve, reject) => output.toBlob(value => value ? resolve(value) : reject(new Error("编码失败")), format === "jpg" ? "image/jpeg" : "image/png", 0.95));
      const name = (path.split(/[\\/]/).pop() ?? "image").replace(/\.[^.]+$/, "");
      const destination = await save({ defaultPath: `${name}-${mode}.${format}`, filters: [{ name: format.toUpperCase(), extensions: [format] }] });
      if (!destination) return;
      await writeFile(destination, new Uint8Array(await blob.arrayBuffer()));
      setSaved(destination);
    } catch (e) { setError(`保存失败：${String(e)}`); }
    finally { setBusy(false); }
  }

  function slider(key: keyof ImageOptions, label: string, min: number, max: number, step = 1) {
    return <label className="block text-sm text-slate-600">{label} <span className="float-right">{options[key]}</span>
      <input className="mt-2 w-full" aria-label={label} type="range" min={min} max={max} step={step} value={Number(options[key])} onChange={e => update(key, Number(e.target.value))} />
    </label>;
  }

  return <div className="flex min-h-full flex-col">
    <header className="border-b bg-white px-6 py-4"><h2 className="text-lg font-semibold">{title}</h2><p className="text-sm text-slate-500">本地处理 · 原始尺寸导出 · 支持 PNG / JPEG / WebP 输入</p></header>
    <div className="grid flex-1 gap-6 p-6 lg:grid-cols-[300px_1fr]">
      <div className="space-y-5">
        <button className={`${button} w-full`} disabled={busy} onClick={choose}>{busy ? "处理中…" : "选择图片"}</button>
        {source && <p className="break-all text-xs text-slate-500">{path}<br />{source.width} × {source.height} 像素</p>}
        <fieldset disabled={busy} className="space-y-4">
          {mode === "watermark" ? <>
            <label className="block text-sm">水印文字<input className="mt-2 w-full rounded border p-2" maxLength={100} value={options.text} onChange={e => update("text", e.target.value)} /></label>
            {slider("opacity", "透明度", 0.05, 1, 0.05)}
            {slider("size", "字号（像素）", 12, 240)}
            {slider("angle", "旋转角度", -90, 90)}
            {slider("gap", "平铺间距（像素）", 20, 400)}
            <label className="flex items-center justify-between text-sm">文字颜色<input aria-label="文字颜色" type="color" value={options.color} onChange={e => update("color", e.target.value)} /></label>
            <label className="flex gap-2 text-sm"><input type="checkbox" checked={options.tiled} onChange={e => update("tiled", e.target.checked)} />平铺满图（取消后居中）</label>
          </> : <>
            {slider("smooth", "磨皮强度", 0, 100)}
            {slider("brighten", "提亮", 0, 100)}
            {slider("warmth", "肤色冷暖", -50, 50)}
            <p className="text-xs leading-5 text-slate-500">磨皮按肤色范围柔化并保留明显边缘；提亮、冷暖作用于整张图片。此版本不包含人脸识别或五官重塑。</p>
          </>}
          <button className={button} onClick={() => { setOptions({ ...initialOptions }); setSaved(""); }}>恢复默认</button>
        </fieldset>
        <label className="block text-sm">导出格式<select className="ml-3 rounded border p-2" value={format} disabled={busy} onChange={e => { setFormat(e.target.value); setSaved(""); }}><option value="png">PNG（保留透明）</option><option value="jpg">JPEG（白色背景）</option></select></label>
        <button className="w-full rounded-lg bg-brand-500 px-4 py-2 text-white disabled:opacity-50" disabled={!source || busy || rendering || compare || (mode === "watermark" && !options.text.trim())} onClick={exportImage}>{busy ? "处理中…" : "导出图片"}</button>
        {saved && <p role="status" className="break-all text-xs text-emerald-600">已保存：{saved}</p>}
        {error && <p role="alert" className="text-sm text-rose-600">{error}</p>}
      </div>
      <div className="min-w-0 rounded-xl border bg-white p-4">
        <div className="mb-4 flex items-center justify-between"><span className="text-sm text-slate-500">{compare ? "原图" : "效果预览"}{rendering && " · 正在更新…"}</span><button className={button} disabled={!source || busy} onClick={() => setCompare(!compare)}>{compare ? "查看效果" : "对比原图"}</button></div>
        <div ref={preview} className="flex min-h-[360px] items-center justify-center overflow-hidden rounded bg-slate-100">{!source && <span className="text-sm text-slate-400">选择图片后显示预览</span>}</div>
      </div>
    </div>
  </div>;
}

export function ImageWatermarkPage() { return <ImageToolPage mode="watermark" />; }
export function ImageBeautyPage() { return <ImageToolPage mode="beauty" />; }
