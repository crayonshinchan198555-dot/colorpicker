// 后台 Service Worker 协作监听器
chrome.runtime.onInstalled.addListener(() => {
  console.log("🎨 Palette Grabber Background Worker Service Ready!");
});

// 监听存储变化（可选的后台监控任务）
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes.savedColors) {
    console.log("New palette synchronized in background:", changes.savedColors.newValue);
  }
});