const { BrowserWindow, app } = require('electron');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    // Electron >= 5 에서는 기본적으로 webview tag를 사용할 수 없으므로 webview tag를 true로 설정한다.
    webPreferences: {
      webviewTag: true,
    },
  });

  win.loadFile('src/index.html');
  // 개발자 도구 열기
  // win.webContents.openDevTools();
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
