/// <reference types="vite/client" />

// 允许以 ?url 方式导入字体等静态资源，得到其运行时 URL
declare module "*.ttf?url" {
  const src: string;
  export default src;
}
