/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Tauri 期望前端固定端口；构建产物输出到 dist，由 tauri.conf.json 引用
const host = process.env.TAURI_DEV_HOST;

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [react()],
  // 让 Tauri CLI 能正确探测 dev server
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? { protocol: "ws", host, port: 1421 }
      : undefined,
    watch: {
      // 避免监听 Rust 侧文件导致重复触发
      ignored: ["**/src-tauri/**"],
    },
  },
  // 单元测试配置：node 环境即可验证水印核心逻辑
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
}));
