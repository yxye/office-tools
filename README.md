# 办公工具箱（Office Tools）

跨平台（Win11 / macOS）办公支持桌面工具，提供 **PDF 文字水印、图片文字水印与图片美颜**。

## 技术栈

- 应用框架：**Tauri v2**（Rust 宿主 + 系统 WebView）
- 前端：**React + TypeScript + Vite + Tailwind CSS**
- PDF 处理：**pdf-lib** + **@pdf-lib/fontkit**（中文字体子集化嵌入）
- PDF 预览：**pdfjs-dist**
- 原生能力：Rust 宿主注册 `tauri-plugin-dialog` + `tauri-plugin-fs`，前端通过对应的 Tauri 插件 API 调用文件选择与读写

默认开发、打包入口均使用 **Tauri + Rust**。React 负责系统 WebView 中的界面，PDF 水印与预览继续使用现有前端实现。

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
    image-tools/    图片水印、美颜、预览与原尺寸导出
  lib/              文件读写、字体加载、常量
src-tauri/          Rust 宿主（插件注册、打包配置）
```

## 环境准备

1. Node.js 20+ + npm
2. **Rust 稳定版工具链**（Tauri 原生构建必需）：

   - Windows：安装 [rustup](https://rustup.rs/)（MSVC 工具链）、「Microsoft C++ Build Tools」（含“使用 C++ 的桌面开发”和 Windows SDK）与 WebView2 Runtime
   - macOS：`xcode-select --install` 后安装 rustup

3. 仓库已包含中文字体；更换字体见 `public/fonts/README.md`

## 常用命令

```bash
npm ci               # 按锁文件安装依赖
npm test             # 运行水印核心单元测试（无需 Rust）
npm run check:rust   # 检查 Rust 宿主与原生插件

npm run dev          # 编译 Rust，启动 Tauri 桌面应用（含前端热更新）
npm run build        # 构建前端、Rust 宿主并生成当前平台安装包

# 仅调试界面（浏览器中无法使用原生文件选择、读写）：
npm run dev:web      # 启动 Vite
npm run build:web    # 类型检查 + 前端构建（无需 Rust）
```

安装包位于 `src-tauri/target/release/bundle/`。Windows 生成 NSIS/MSI，macOS 生成 App/DMG；各平台需在对应系统上打包。原有 `npm run tauri dev` / `npm run tauri build` 入口仍可使用。

## 图片工具

- 输入支持 PNG、JPEG、WebP；导出 PNG（保留透明）或 JPEG（白底、95% 质量），保留原始像素尺寸。
- 图片水印：文字、颜色、透明度、字号、旋转角度、平铺间距，可选择满图平铺或居中。
- 图片美颜：按肤色范围磨皮并保留明显边缘，整图提亮与冷暖调整；不包含人脸识别、瘦脸或五官重塑。
- 支持原图/效果切换、恢复默认，所有图片均在本地处理，不上传。
- 为控制内存，输入限制为 2400 万像素、单边最多 8192 像素；动态图按单帧处理，导出不保留 EXIF 等元数据。

## 依赖升级

本次通过 `npm update` 与 `cargo update` 更新现有版本约束内的兼容依赖，包括 Tauri v2 及 dialog/fs 插件。React 19、Vite 8、Tailwind 4、TypeScript 7、PDF.js 6 等跨主版本更新留待单独迁移和验证。
