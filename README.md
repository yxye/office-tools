# 办公工具箱（Office Tools）

跨平台（Win11 / macOS）办公支持桌面工具。**V1：PDF 文字水印**。

## 技术栈

- 应用框架：**Tauri v2**（Rust 宿主 + 系统 WebView）
- 前端：**React + TypeScript + Vite + Tailwind CSS**
- PDF 处理：**pdf-lib** + **@pdf-lib/fontkit**（中文字体子集化嵌入）
- PDF 预览：**pdfjs-dist**
- 文件读写：`@tauri-apps/plugin-dialog` + `@tauri-apps/plugin-fs`

## V1 功能

- PDF 文字水印，**平铺满页**，绘制在原内容**上方**
- 可调：**透明度**、**方向**（左下→右上 / 左上→右下）、**字号**、平铺间距
- 支持中文水印（需放置内置字体，见下）

## 目录结构

```
src/
  shell/            应用外壳 + 工具注册表（扩展核心）
  features/
    pdf-watermark/  PDF 水印功能模块（watermark.ts 为核心纯函数）
  lib/              文件读写、字体加载、常量
src-tauri/          Rust 宿主（插件注册、打包配置）
```

## 环境准备

1. Node.js（已验证 v25） + npm/pnpm
2. **Rust 工具链**（Tauri 原生构建必需，当前机器尚未安装）：

   - Windows：安装 [rustup](https://rustup.rs/) 与「Microsoft C++ Build Tools」
   - macOS：`xcode-select --install` 后安装 rustup

3. 放置中文字体：见 `public/fonts/README.md`（缺失不影响构建，仅影响中文水印导出）

## 常用命令

```bash
npm install          # 安装前端依赖
npm test             # 运行水印核心单元测试（无需 Rust）
npm run build        # 类型检查 + 前端构建（无需 Rust）

# 安装 Rust 后：
npm run tauri dev    # 启动桌面应用（开发）
npm run tauri build  # 打包 Win(NSIS/MSI) / macOS(dmg)
```

## 后续规划

- 图片水印（复用平铺/角度算法）
- 批量处理（file.ts 已按字节流进出设计）
- 视频压缩（Rust command + ffmpeg sidecar）
