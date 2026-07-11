/** 水印默认参数与取值范围常量，集中管理避免魔法数字散落各处。 */

/** 默认透明度（0~1） */
export const DEFAULT_OPACITY = 0.3;
/** 默认字号（pt） */
export const DEFAULT_FONT_SIZE = 24;
/** 默认平铺间距（pt） */
export const DEFAULT_GAP = 60;
/** 默认水印文字颜色（灰色），rgb 各分量取值 0~1 */
export const DEFAULT_COLOR = { r: 0.5, g: 0.5, b: 0.5 };

/** 字号可调范围（pt） */
export const FONT_SIZE_MIN = 8;
export const FONT_SIZE_MAX = 96;
/** 平铺间距可调范围（pt） */
export const GAP_MIN = 0;
export const GAP_MAX = 300;

/** 内置中文字体文件名（放置于 public/fonts/ 下） */
export const CHINESE_FONT_FILENAME = "chinese.ttf";
/** 内置中文字体的运行时 URL（Vite 会原样暴露 public/ 下资源） */
export const CHINESE_FONT_URL = `/fonts/${CHINESE_FONT_FILENAME}`;
