import { useEffect, useRef, useState } from "react";
import WatermarkForm from "./WatermarkForm";
import PdfPreview from "./PdfPreview";
import { useWatermark } from "./useWatermark";
import {
  DEFAULT_FONT_SIZE,
  DEFAULT_GAP,
  DEFAULT_OPACITY,
} from "../../lib/constants";

/** 表单参数类型（与 WatermarkForm 对齐） */
type FormValue = {
  text: string;
  opacity: number;
  fontSize: number;
  direction: "up" | "down";
  gap: number;
};

const INITIAL: FormValue = {
  text: "机密",
  opacity: DEFAULT_OPACITY,
  fontSize: DEFAULT_FONT_SIZE,
  direction: "up",
  gap: DEFAULT_GAP,
};

/**
 * PDF 文字水印页面：左侧参数表单，右侧首页预览。
 * 参数变更后防抖生成预览；点击导出保存文件。
 */
export default function PdfWatermarkPage() {
  const { source, busy, error, savedPath, chooseFile, generate, exportFile } =
    useWatermark();
  const [form, setForm] = useState<FormValue>(INITIAL);
  const [previewBytes, setPreviewBytes] = useState<Uint8Array | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const timer = useRef<number | null>(null);

  // 源文件或参数变化时，防抖重新生成预览
  useEffect(() => {
    if (!source) {
      setPreviewBytes(null);
      return;
    }
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(async () => {
      try {
        setPreviewError(null);
        const bytes = await generate(form);
        setPreviewBytes(bytes);
      } catch (e) {
        setPreviewError(String(e));
      }
    }, 250);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [source, form, generate]);

  return (
    <div className="flex h-full flex-col">
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <h2 className="text-lg font-semibold text-slate-800">PDF 文字水印</h2>
        <p className="text-sm text-slate-500">
          平铺满页 · 可调透明度 / 方向 / 字号 · 水印绘制在内容上方
        </p>
      </header>

      <div className="grid flex-1 grid-cols-1 gap-6 overflow-auto p-6 lg:grid-cols-[360px_1fr]">
        {/* 左侧：操作区 */}
        <div className="space-y-5">
          <button
            onClick={chooseFile}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-brand-500 hover:text-brand-600"
          >
            {source ? "重新选择 PDF" : "选择 PDF 文件"}
          </button>

          {source && (
            <p className="truncate text-xs text-slate-400" title={source.path}>
              已选：{source.path}
            </p>
          )}

          <WatermarkForm value={form} onChange={setForm} />

          <button
            onClick={() => exportFile(form)}
            disabled={!source || busy}
            className="w-full rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? "导出中…" : "导出为 PDF"}
          </button>

          {savedPath && (
            <p className="text-xs text-emerald-600">已保存：{savedPath}</p>
          )}
          {(error || previewError) && (
            <p className="text-xs text-rose-600">{error || previewError}</p>
          )}
        </div>

        {/* 右侧：预览 */}
        <div className="min-h-[400px]">
          <PdfPreview bytes={previewBytes} />
        </div>
      </div>
    </div>
  );
}
