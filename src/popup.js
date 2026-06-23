document.getElementById('pick-btn').addEventListener('click', async () => {
  // 1. 获取当前活跃的标签页
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) return;

  // 2. 在当前网页执行吸色脚本
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: async () => {
      // 检查浏览器是否支持 EyeDropper
      if (!window.EyeDropper) {
        alert("Your browser doesn't support EyeDropper API.");
        return null;
      }
      try {
        const eyeDropper = new EyeDropper();
        const result = await eyeDropper.open();
        return result.sRGBHex; // 返回吸取到的十六进制颜色值 (例如 #ffffff)
      } catch (e) {
        return null; // 用户取消了吸色
      }
    }
  }, (results) => {
    // 3. 处理吸色脚本返回的结果
    if (!results || !results[0] || !results[0].result) return;
    const pickedColor = results[0].result;
    
    // 4. 将颜色保存进 chrome.storage
    saveColor(pickedColor);
  });
});

// 保存颜色并更新 UI
function saveColor(color) {
  chrome.storage.local.get({ savedColors: [] }, (data) => {
    const colors = data.savedColors;
    if (!colors.includes(color)) {
      colors.push(color);
      chrome.storage.local.set({ savedColors: colors }, () => {
        renderColors();
      });
    }
  });
}

// 从存储中读取并渲染颜色列表
function renderColors() {
  const container = document.getElementById('colors-container');
  container.innerHTML = '';

  chrome.storage.local.get({ savedColors: [] }, (data) => {
    data.savedColors.forEach(color => {
      const colorDiv = document.createElement('div');
      colorDiv.className = 'color-item';
      colorDiv.style.backgroundColor = color;
      colorDiv.setAttribute('data-color', color);
      
      // 点击色块自动复制到剪贴板
      colorDiv.addEventListener('click', () => {
        navigator.clipboard.writeText(color);
        alert(`Copied: ${color}`);
      });

      container.appendChild(colorDiv);
    });
  });
}

// 清空所有颜色
document.getElementById('clear-btn').addEventListener('click', () => {
  chrome.storage.local.set({ savedColors: [] }, () => {
    renderColors();
  });
});

// 页面加载时自动渲染一次
document.addEventListener('DOMContentLoaded', renderColors);