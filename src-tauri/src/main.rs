// 阻止 Windows release 构建时弹出多余的控制台窗口
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// 桌面端入口：委托给库中的 run() 启动应用
fn main() {
    office_tools_lib::run()
}
