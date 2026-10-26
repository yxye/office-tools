import { TOOLS } from "./ToolRegistry";

/**
 * 首页工具宫格。
 * 遍历工具注册表渲染入口卡片，点击后通知外壳切换到对应工具。
 *
 * @param onOpen 打开某个工具的回调，参数为工具 id
 */
export default function HomeGrid({ onOpen }: { onOpen: (id: string) => void }) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-slate-800">办公工具箱</h1>
      <p className="mt-1 text-sm text-slate-500">
        PDF 水印、图片水印与图片美颜，文件均在本地处理。
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onOpen(tool.id)}
            className="group flex flex-col items-start rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-brand-500 hover:shadow-md"
          >
            <span className="text-3xl">{tool.icon}</span>
            <span className="mt-3 font-medium text-slate-800 group-hover:text-brand-600">
              {tool.name}
            </span>
            <span className="mt-1 text-sm text-slate-500">{tool.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
