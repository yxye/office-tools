# 内置中文字体说明

水印支持中文依赖一款嵌入的中文 TTF 字体，命名为 `chinese.ttf` 放在本目录：

```
public/fonts/chinese.ttf
```

## 当前内置字体

本仓库已内置 **Noto Sans SC 的静态实例（wght=400）**，采用 **SIL Open Font
License 1.1（OFL）**，**可自由随应用分发**。分发安装包时请一并附带该字体的
OFL 许可全文（可从 https://fonts.google.com/noto/specimen/Noto+Sans+SC 获取）。

## ⚠️ 必须使用「静态」字体，不能用「可变字体(VF)」

pdf-lib / @pdf-lib/fontkit 对**可变字体(Variable Font)**子集化存在缺陷：
嵌入后中文**只有第一个字形正确，后续字全部显示成第一个字**（如"三生相伴"→"三三三三"）。
因此 `chinese.ttf` 必须是**静态字体**。若手头只有可变字体（如系统里的
`NotoSansSC-VF.ttf`），用 fonttools 实例化为静态版：

```bash
pip install fonttools brotli
python -m fontTools.varLib.instancer NotoSansSC-VF.ttf wght=400 -o chinese.ttf
```

## 更换字体

如需更换，放一款**可商用且为静态**的中文字体覆盖 `chinese.ttf` 即可，例如：

- 思源黑体 Source Han Sans（Regular 子字重，静态）
- 阿里巴巴普惠体 Alibaba PuHuiTi（Regular，静态）
- Noto Sans SC 静态实例（当前内置）

> 运行时由 `src/lib/pdf/loadFont.ts` 通过 `fetch('/fonts/chinese.ttf')` 加载，
> 并在 `chineseFontProvider.ts` 中以 `subset: true` 子集化嵌入，输出体积可控。
> 未放置字体不会阻断前端构建；只有导出中文水印时才会以中文提示报错。
> 英文/数字水印及单元测试使用测试字体，无需此文件。
