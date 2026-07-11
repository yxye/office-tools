import { useCallback, useState } from "react";
import { addTextWatermark, type WatermarkOptions } from "./watermark";
import { chineseFontProvider } from "./chineseFontProvider";
import { pickPdf, savePdf, suggestOutputName } from "../../lib/file";

/** 已加载的源 PDF 信息 */
interface SourceFile {
  path: string;
  bytes: Uint8Array;
}

/**
 * PDF 水印页面的交互逻辑 hook。
 * 负责：选文件、根据参数生成水印字节、导出保存，以及加载/错误状态管理。
 */
export function useWatermark() {
  const [source, setSource] = useState<SourceFile | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedPath, setSavedPath] = useState<string | null>(null);

  /** 选择源 PDF 文件 */
  const chooseFile = useCallback(async () => {
    setError(null);
    setSavedPath(null);
    try {
      const picked = await pickPdf();
      if (picked) setSource(picked);
    } catch (e) {
      setError(`打开文件失败：${String(e)}`);
    }
  }, []);

  /**
   * 根据当前参数生成加水印后的字节（不落盘），用于预览。
   * @param opts 水印参数
   */
  const generate = useCallback(
    async (opts: WatermarkOptions): Promise<Uint8Array | null> => {
      if (!source) return null;
      return addTextWatermark(source.bytes, opts, chineseFontProvider);
    },
    [source]
  );

  /**
   * 生成并弹出保存对话框导出 PDF。
   * @param opts 水印参数
   */
  const exportFile = useCallback(
    async (opts: WatermarkOptions) => {
      if (!source) return;
      setBusy(true);
      setError(null);
      setSavedPath(null);
      try {
        const bytes = await addTextWatermark(source.bytes, opts, chineseFontProvider);
        const path = await savePdf(bytes, suggestOutputName(source.path));
        if (path) setSavedPath(path);
      } catch (e) {
        setError(`导出失败：${String(e)}`);
      } finally {
        setBusy(false);
      }
    },
    [source]
  );

  return { source, busy, error, savedPath, chooseFile, generate, exportFile };
}
