import { describe, it, expect } from "vitest";
import { PDFDocument, StandardFonts } from "pdf-lib";
import { addTextWatermark, type FontProvider } from "./watermark";

/**
 * 测试用字体提供者：使用 pdf-lib 内置标准字体（仅 ASCII）。
 * 这样即可在无外部中文字体、无 Rust 环境下验证水印核心逻辑。
 */
const helveticaProvider: FontProvider = (doc) => doc.embedFont(StandardFonts.Helvetica);

/**
 * 生成一个用于测试的多页样例 PDF。
 * @param pages 页数
 */
async function makeSamplePdf(pages = 3): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  for (let i = 0; i < pages; i++) doc.addPage([595, 842]); // A4
  return doc.save();
}

describe("addTextWatermark", () => {
  it("输出可被重新加载且页数与原文一致", async () => {
    const src = await makeSamplePdf(3);
    const out = await addTextWatermark(src, { text: "CONFIDENTIAL" }, helveticaProvider);

    expect(out.byteLength).toBeGreaterThan(0);
    const reloaded = await PDFDocument.load(out);
    expect(reloaded.getPageCount()).toBe(3);
  });

  it("加水印后体积应增大（已写入内容）", async () => {
    const src = await makeSamplePdf(1);
    const out = await addTextWatermark(src, { text: "DRAFT" }, helveticaProvider);
    expect(out.byteLength).toBeGreaterThan(src.byteLength);
  });

  it("两个方向都能正常生成", async () => {
    const src = await makeSamplePdf(1);
    const up = await addTextWatermark(src, { text: "X", direction: "up" }, helveticaProvider);
    const down = await addTextWatermark(src, { text: "X", direction: "down" }, helveticaProvider);
    expect(up.byteLength).toBeGreaterThan(0);
    expect(down.byteLength).toBeGreaterThan(0);
  });

  it("空文字应抛出错误", async () => {
    const src = await makeSamplePdf(1);
    await expect(
      addTextWatermark(src, { text: "   " }, helveticaProvider)
    ).rejects.toThrow("水印文字不能为空");
  });

  it("透明度越界时被裁剪且不报错", async () => {
    const src = await makeSamplePdf(1);
    const out = await addTextWatermark(
      src,
      { text: "OK", opacity: 5, fontSize: 20, gap: 40 },
      helveticaProvider
    );
    expect(out.byteLength).toBeGreaterThan(0);
  });
});
