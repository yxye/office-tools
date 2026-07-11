import { CHINESE_FONT_URL, CHINESE_FONT_FILENAME } from "../constants";

/** 模块级缓存，避免重复网络/磁盘读取字体文件 */
let cachedFontBytes: Uint8Array | null = null;

/**
 * 加载内置中文字体字节（带缓存）。
 *
 * 字体作为运行时静态资源放在 public/fonts/ 下（见 constants.CHINESE_FONT_URL），
 * 采用运行时 fetch 而非静态 import：这样即便暂未放置字体也不会阻断前端构建，
 * 只有在真正需要中文水印时才会以清晰的中文提示报错。
 *
 * @returns 字体文件的 Uint8Array
 * @throws  当字体资源缺失或加载失败时抛出，提示放置字体文件
 */
export async function loadChineseFont(): Promise<Uint8Array> {
  if (cachedFontBytes) return cachedFontBytes;
  const hint = `请将一款可商用中文字体放到 public/fonts/${CHINESE_FONT_FILENAME}`;
  try {
    const res = await fetch(CHINESE_FONT_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const bytes = new Uint8Array(await res.arrayBuffer());
    // 校验确实是字体文件：若字体缺失，开发服务器可能回退返回 index.html，
    // 此时字节以 '<' 开头，直接嵌入会得到迷惑性的 "Unknown font format"。
    if (!isFontBytes(bytes)) {
      throw new Error("返回内容不是有效的字体文件（可能文件缺失）");
    }
    cachedFontBytes = bytes;
    return cachedFontBytes;
  } catch (err) {
    throw new Error(`内置中文字体加载失败（${CHINESE_FONT_FILENAME}）。${hint}。原始错误：${String(err)}`);
  }
}

/**
 * 通过魔数（前 4 字节）判断字节是否为受支持的字体文件。
 * 支持：TrueType(0x00010000/'true')、OpenType('OTTO')、TrueType 集合('ttcf')、WOFF/WOFF2。
 *
 * @param bytes 待校验的字节
 */
function isFontBytes(bytes: Uint8Array): boolean {
  if (bytes.length < 4) return false;
  const tag = String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3]);
  const magic = (bytes[0] << 24) | (bytes[1] << 16) | (bytes[2] << 8) | bytes[3];
  return (
    magic === 0x00010000 || // TrueType
    tag === "true" ||
    tag === "OTTO" || // OpenType/CFF
    tag === "ttcf" || // TrueType Collection
    tag === "wOFF" ||
    tag === "wOF2"
  );
}
