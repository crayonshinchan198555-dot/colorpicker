// 后台 Service Worker 保持待命状态
chrome.runtime.onInstalled.addListener(() => {
  console.log("Color Picker Extension Installed Successfully!");
});