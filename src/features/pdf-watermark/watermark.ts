import { PDFDocument, PDFFont, degrees, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import {
  DEFAULT_COLOR,
  DEFAULT_FONT_SIZE,
  DEFAULT_GAP,
  DEFAULT_OPACITY,
} from "../../lib/constants";

/**
 * 水印参数。
 *
 * @property text      水印文字（可含中文）
 * @property opacity   透明度 0~1，默认 0.3
 * @property fontSize  字号（pt），默认 24
 * @property direction 倾斜方向：'up' = 左下→右上(+45°)，'down' = 左上→右下(-45°)
 * @property gap       平铺间距（相邻水印之间的额外留白，pt），默认 60
 * @property color     文字颜色，rgb 各分量 0~1，默认灰色
 */
export interface WatermarkOptions {
  text: string;
  opacity?: number;
  fontSize?: number;
  direction?: "up" | "down";
  gap?: number;
  color?: { r: number; g: number; b: number };
}

/**
 * 字体提供者：给定 PDFDocument，返回一个可用于绘制的 PDFFont。
 * 通过依赖注入解耦「字体来源」，便于：
 *  - 生产环境注入内置中文字体（子集化嵌入）；
 *  - 单元测试注入标准字体（无需外部文件即可验证核心逻辑）。
 */
export type FontProvider = (doc: PDFDocument) => Promise<PDFFont>;

/**
 * 给 PDF 每一页平铺文字水印（绘制在原内容之上）。
 *
 * 纯函数：仅在内存中处理字节，不涉及任何文件系统操作，便于测试与复用。
 *
 * @param pdfBytes     原始 PDF 字节
 * @param opts         水印参数
 * @param fontProvider 字体提供者（生产用内置中文字体，测试可注入标准字体）
 * @returns            加水印后的 PDF 字节
 */
export async function addTextWatermark(
  pdfBytes: Uint8Array,
  opts: WatermarkOptions,
  fontProvider: FontProvider
): Promise<Uint8Array> {
  const text = opts.text?.trim();
  if (!text) throw new Error("水印文字不能为空");

  const opacity = clamp(opts.opacity ?? DEFAULT_OPACITY, 0, 1);
  const fontSize = Math.max(1, opts.fontSize ?? DEFAULT_FONT_SIZE);
  const gap = Math.max(0, opts.gap ?? DEFAULT_GAP);
  const direction = opts.direction ?? "up";
  const c = opts.color ?? DEFAULT_COLOR;
  const color = rgb(c.r, c.g, c.b);
  // 'up' = 左下→右上（正角度），'down' = 左上→右下（负角度）
  const angle = direction === "up" ? 45 : -45;

  const pdfDoc = await PDFDocument.load(pdfBytes);
  pdfDoc.registerFontkit(fontkit);
  const font = await fontProvider(pdfDoc);

  // 平铺步长：文字宽度/高度 + 间距
  const textWidth = font.widthOfTextAtSize(text, fontSize);
  const stepX = textWidth + gap;
  const stepY = fontSize + gap;

  for (const page of pdfDoc.getPages()) {
    const { width, height } = page.getSize();
    // 过扫描：从负一屏到正两屏遍历，保证旋转后页面四角也被覆盖
    for (let y = -height; y < height * 2; y += stepY) {
      for (let x = -height; x < width + height; x += stepX) {
        page.drawText(text, {
          x,
          y,
          size: fontSize,
          font,
          color,
          opacity,
          rotate: degrees(angle),
        });
      }
    }
  }

  return pdfDoc.save();
}

/** 将数值限制在 [min, max] 区间内 */
function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}
