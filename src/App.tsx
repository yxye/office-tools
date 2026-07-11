import { useState, useMemo } from "react";
import Layout from "./shell/Layout";
import HomeGrid from "./shell/HomeGrid";
import { TOOLS } from "./shell/ToolRegistry";

/**
 * 根组件：以简单状态管理导航（V1 不引入 react-router，遵循 KISS）。
 * activeId 为 null 时展示首页宫格，否则展示对应工具页面。
 */
export default function App() {
  const [activeId, setActiveId] = useState<string | null>(null);

  // 根据 activeId 查找当前工具组件
  const ActiveTool = useMemo(() => {
    if (!activeId) return null;
    return TOOLS.find((t) => t.id === activeId)?.element ?? null;
  }, [activeId]);

  return (
    <Layout activeId={activeId} onNavigate={setActiveId}>
      {ActiveTool ? <ActiveTool /> : <HomeGrid onOpen={setActiveId} />}
    </Layout>
  );
}
