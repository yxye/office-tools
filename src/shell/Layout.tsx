import type { ReactNode } from "react";
import { TOOLS } from "./ToolRegistry";

/**
 * 应用外壳布局：左侧工具导航 + 右侧内容区。
 *
 * @param activeId 当前激活的工具 id；为 null 时表示首页
 * @param onNavigate 导航回调；参数为工具 id，null 表示回到首页
 * @param children 右侧内容区
 */
export default function Layout({
  activeId,
  onNavigate,
  children,
}: {
  activeId: string | null;
  onNavigate: (id: string | null) => void;
  children: ReactNode;
}) {
  return (
    <div className="flex h-full">
      <aside className="flex w-56 flex-col border-r border-slate-200 bg-white">
        <button
          onClick={() => onNavigate(null)}
          className={`px-4 py-3 text-left text-sm font-semibold ${
            activeId === null ? "text-brand-600" : "text-slate-700"
          }`}
        >
          🧰 工具箱
        </button>
        <nav className="flex-1 space-y-1 px-2">
          {TOOLS.map((tool) => (
            <button
              key={tool.id}
              onClick={() => onNavigate(tool.id)}
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition ${
                activeId === tool.id
                  ? "bg-brand-50 font-medium text-brand-600"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <span>{tool.icon}</span>
              <span>{tool.name}</span>
            </button>
          ))}
        </nav>
        <div className="p-3 text-xs text-slate-400">v0.1.0</div>
      </aside>

      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
