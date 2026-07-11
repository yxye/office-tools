import type { WatermarkOptions } from "./watermark";
import {
  FONT_SIZE_MAX,
  FONT_SIZE_MIN,
  GAP_MAX,
  GAP_MIN,
} from "../../lib/constants";

/**
 * 水印参数表单。
 * 受控组件：所有取值由上层 state 管理，变更通过 onChange 回传。
 *
 * @param value    当前参数
 * @param onChange 参数变更回调
 */
export default function WatermarkForm({
  value,
  onChange,
}: {
  value: Required<Pick<WatermarkOptions, "text" | "opacity" | "fontSize" | "direction" | "gap">>;
  onChange: (next: typeof value) => void;
}) {
  // 局部更新某个字段
  const set = <K extends keyof typeof value>(k: K, v: (typeof value)[K]) =>
    onChange({ ...value, [k]: v });

  return (
    <div className="space-y-5">
      {/* 水印文字 */}
      <label className="block">
        <span className="text-sm font-medium text-slate-700">水印文字</span>
        <input
          type="text"
          value={value.text}
          onChange={(e) => set("text", e.target.value)}
          placeholder="例如：机密 内部资料"
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
        />
      </label>

      {/* 方向 */}
      <div>
        <span className="text-sm font-medium text-slate-700">方向</span>
        <div className="mt-1 flex gap-2">
          <DirButton
            active={value.direction === "up"}
            onClick={() => set("direction", "up")}
            label="左下 → 右上"
          />
          <DirButton
            active={value.direction === "down"}
            onClick={() => set("direction", "down")}
            label="左上 → 右下"
          />
        </div>
      </div>

      {/* 透明度 */}
      <label className="block">
        <span className="text-sm font-medium text-slate-700">
          透明度：{Math.round(value.opacity * 100)}%
        </span>
        <input
          type="range"
          min={5}
          max={100}
          value={Math.round(value.opacity * 100)}
          onChange={(e) => set("opacity", Number(e.target.value) / 100)}
          className="mt-1 w-full accent-brand-500"
        />
      </label>

      {/* 字号 */}
      <label className="block">
        <span className="text-sm font-medium text-slate-700">
          字号：{value.fontSize} pt
        </span>
        <input
          type="range"
          min={FONT_SIZE_MIN}
          max={FONT_SIZE_MAX}
          value={value.fontSize}
          onChange={(e) => set("fontSize", Number(e.target.value))}
          className="mt-1 w-full accent-brand-500"
        />
      </label>

      {/* 平铺间距 */}
      <label className="block">
        <span className="text-sm font-medium text-slate-700">
          平铺间距：{value.gap} pt
        </span>
        <input
          type="range"
          min={GAP_MIN}
          max={GAP_MAX}
          value={value.gap}
          onChange={(e) => set("gap", Number(e.target.value))}
          className="mt-1 w-full accent-brand-500"
        />
      </label>
    </div>
  );
}

/** 方向切换按钮 */
function DirButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 rounded-lg border px-3 py-2 text-sm transition ${
        active
          ? "border-brand-500 bg-brand-50 font-medium text-brand-600"
          : "border-slate-300 text-slate-600 hover:bg-slate-50"
      }`}
    >
      {label}
    </button>
  );
}
