import type { ComponentType } from "react";

/**
 * 工具元信息：描述工具箱中的一个功能模块。
 * 新增功能时只需在此登记一条记录，外壳与首页会自动渲染。
 *
 * @property id      唯一标识（用于导航状态）
 * @property name    显示名称
 * @property desc    一句话功能描述
 * @property icon    图标（emoji，V1 用简单方案，后续可替换为 SVG 图标组件）
 * @property element 该工具的页面组件
 */
export interface ToolMeta {
  id: string;
  name: string;
  desc: string;
  icon: string;
  element: ComponentType;
}

import { pdfWatermarkTool } from "../features/pdf-watermark";
import { ImageWatermarkPage, ImageBeautyPage } from "../features/image-tools/ImageToolPage";

/**
 * 全局工具清单。
 * 这是「工具箱」的扩展核心：图片水印 / 视频压缩等未来功能只需向此数组追加一项。
 */
export const TOOLS: ToolMeta[] = [pdfWatermarkTool,
  { id: "image-watermark", name: "图片文字水印", desc: "平铺或居中文字水印，自定义颜色、角度和透明度", icon: "🖼️", element: ImageWatermarkPage },
  { id: "image-beauty", name: "图片美颜", desc: "本地磨皮、提亮与肤色冷暖调整", icon: "✨", element: ImageBeautyPage },
];
