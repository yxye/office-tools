/** @type {import('tailwindcss').Config} */
// Tailwind 配置：仅扫描 src 下的模板文件，保持产物精简
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // 品牌主色（可后续调整），避免模板化默认蓝
        brand: {
          50: "#eef4ff",
          500: "#3b5bdb",
          600: "#364fc7",
          700: "#2f44ad",
        },
      },
    },
  },
  plugins: [],
};
