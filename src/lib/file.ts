import { open, save } from "@tauri-apps/plugin-dialog";
import { readFile, writeFile } from "@tauri-apps/plugin-fs";

/**
 * 弹出「打开 PDF」对话框并读取文件字节。
 *
 * @returns 选中文件的 { path, bytes }；用户取消时返回 null
 */
export async function pickPdf(): Promise<{ path: string; bytes: Uint8Array } | null> {
  const selected = await open({
    multiple: false,
    filters: [{ name: "PDF", extensions: ["pdf"] }],
  });
  if (!selected || Array.isArray(selected)) return null;
  const bytes = await readFile(selected);
  return { path: selected, bytes };
}

/**
 * 弹出「保存 PDF」对话框并写入字节。
 *
 * @param bytes           要写出的 PDF 字节
 * @param defaultFileName 默认文件名
 * @returns 实际保存路径；用户取消时返回 null
 */
export async function savePdf(
  bytes: Uint8Array,
  defaultFileName = "watermarked.pdf"
): Promise<string | null> {
  const path = await save({
    defaultPath: defaultFileName,
    filters: [{ name: "PDF", extensions: ["pdf"] }],
  });
  if (!path) return null;
  await writeFile(path, bytes);
  return path;
}

/**
 * 根据原始文件路径生成建议的输出文件名（加 -watermarked 后缀）。
 *
 * @param inputPath 原始文件完整路径
 */
export function suggestOutputName(inputPath: string): string {
  const base = inputPath.split(/[\/]/).pop() ?? "output.pdf";
  return base.replace(/\.pdf$/i, "") + "-watermarked.pdf";
}
