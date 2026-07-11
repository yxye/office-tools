import type { ToolMeta } from "../../shell/ToolRegistry";
import PdfWatermarkPage from "./PdfWatermarkPage";

/**
 * PDF 文字水印工具的注册信息。
 * 由 ToolRegistry 收集，用于首页宫格与侧边导航渲染。
 */
export const pdfWatermarkTool: ToolMeta = {
  id: "pdf-watermark",
  name: "PDF 文字水印",
  desc: "为 PDF 平铺文字水印，透明度/方向/字号可调",
  icon: "💧",
  element: PdfWatermarkPage,
};
