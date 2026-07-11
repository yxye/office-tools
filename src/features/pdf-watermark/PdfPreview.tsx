import { useEffect, useRef } from "react";
import * as pdfjs from "pdfjs-dist";
// Vite 方式加载 pdf.js worker
import PdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjs.GlobalWorkerOptions.workerSrc = PdfWorker;

/**
 * PDF 首页预览：用 pdf.js 将传入的 PDF 字节渲染到 canvas。
 * 采用 pdf.js 而非 WebView 原生渲染，保证 Win/Mac 表现一致。
 *
 * @param bytes 待预览的 PDF 字节；为 null 时显示占位提示
 */
export default function PdfPreview({ bytes }: { bytes: Uint8Array | null }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!bytes) return;
    let cancelled = false;

    (async () => {
      // pdf.js 会转移（transfer）底层 buffer，这里复制一份避免影响上层数据
      const doc = await pdfjs.getDocument({ data: bytes.slice() }).promise;
      if (cancelled) return;
      const page = await doc.getPage(1);
      const viewport = page.getViewport({ scale: 1.2 });
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await page.render({ canvasContext: ctx, viewport }).promise;
    })().catch(() => {
      /* 预览失败静默处理，不阻断主流程 */
    });

    return () => {
      cancelled = true;
    };
  }, [bytes]);

  if (!bytes) {
    return (
      <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white text-sm text-slate-400">
        选择 PDF 后在此预览首页效果
      </div>
    );
  }

  return (
    <div className="flex justify-center overflow-auto rounded-xl border border-slate-200 bg-slate-50 p-4">
      <canvas ref={canvasRef} className="max-w-full shadow" />
    </div>
  );
}
