# 内置中文字体说明

水印支持中文依赖一款嵌入的中文 TTF 字体，命名为 `chinese.ttf` 放在本目录：

```
public/fonts/chinese.ttf
```

## 当前内置字体

本仓库已内置 **Noto Sans SC**（思源黑体的 Google 版本），采用 **SIL Open Font
License 1.1（OFL）**，**可自由随应用分发**。分发安装包时请一并附带该字体的
OFL 许可全文（可从 https://fonts.google.com/noto/specimen/Noto+Sans+SC 获取）。

## 更换字体

如需更换，放一款**可商用**中文字体覆盖 `chinese.ttf` 即可，例如：

- 思源黑体 Source Han Sans（Regular 子字重）
- 阿里巴巴普惠体 Alibaba PuHuiTi（Regular）
- Noto Sans SC（当前内置）

> 运行时由 `src/lib/pdf/loadFont.ts` 通过 `fetch('/fonts/chinese.ttf')` 加载，
> 并在 `chineseFontProvider.ts` 中以 `subset: true` 子集化嵌入，输出体积可控。
> 未放置字体不会阻断前端构建；只有导出中文水印时才会以中文提示报错。
> 英文/数字水印及单元测试使用测试字体，无需此文件。
