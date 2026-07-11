import type { PDFDocument } from "pdf-lib";
import type { FontProvider } from "./watermark";
import { loadChineseFont } from "../../lib/pdf/loadFont";

/**
 * 生产环境字体提供者：加载内置中文字体并以子集化方式嵌入，
 * 既支持中文水印，又控制输出 PDF 体积。
 */
export const chineseFontProvider: FontProvider = async (doc: PDFDocument) => {
  const fontBytes = await loadChineseFont();
  return doc.embedFont(fontBytes, { subset: true });
};
