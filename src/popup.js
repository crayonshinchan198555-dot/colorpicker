// 页面加载时自动从本地存储读取并渲染历史颜色
document.addEventListener('DOMContentLoaded', renderColors);

// 点击“开始吸色”按钮
document.getElementById('pick-btn').addEventListener('click', async () => {
  // 1. 获取当前所在的网页标签
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) return;

  // 2. 检查浏览器是否支持 EyeDropper
  if (!window.EyeDropper) {
    alert("Your browser doesn't support EyeDropper API.");
    return;
  }

  try {
    // 3. 打开吸色器
    const eyeDropper = new EyeDropper();
    const result = await eyeDropper.open();
    const pickedColor = result.sRGBHex; // 拿到颜色值（例如 #ff0000）
    
    // 4. 保存并渲染颜色
    saveColor(pickedColor);
  } catch (e) {
    console.log("User canceled color picking or error occurred", e);
  }
});

// 保存颜色到 chrome.storage.local
function saveColor(color) {
  chrome.storage.local.get({ savedColors: [] }, (data) => {
    const colors = data.savedColors;
    if (!colors.includes(color)) {
      colors.push(color);
      chrome.storage.local.set({ savedColors: colors }, () => {
        renderColors(); // 刷新列表
      });
    }
  });
}

// 渲染历史色板列表
function renderColors() {
  const container = document.getElementById('colors-container');
  if (!container) return;
  container.innerHTML = '';

  chrome.storage.local.get({ savedColors: [] }, (data) => {
    data.savedColors.forEach(color => {
      const colorDiv = document.createElement('div');
      colorDiv.className = 'color-item';
      colorDiv.style.backgroundColor = color;
      colorDiv.setAttribute('data-color', color);
      
      // 点击色块自动复制
      colorDiv.addEventListener('click', () => {
        navigator.clipboard.writeText(color).then(() => {
          alert(`Copied to clipboard: ${color}`);
        });
      });

      container.appendChild(colorDiv);
    });
  });
}

// 清空全部已保存的颜色
document.getElementById('clear-btn').addEventListener('click', () => {
  chrome.storage.local.set({ savedColors: [] }, () => {
    renderColors();
  });
});