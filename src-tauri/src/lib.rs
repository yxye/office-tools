// 应用运行入口：注册插件并启动 Tauri。
// 本版仅需 dialog（文件选择）与 fs（读写文件）两个插件；
// 未来的视频压缩等原生能力可在此追加自定义 command 与 ffmpeg sidecar。
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .run(tauri::generate_context!())
        .expect("启动 Tauri 应用失败");
}
