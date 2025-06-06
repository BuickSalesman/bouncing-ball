const Matter = require("matter-js");
const electron = require("electron/main");
const { app, BrowserWindow, screen } = require("electron/main");
const { ipcMain } = require("electron");

let win = null;

const createWindow = () => {
  const { width, height } = screen.getPrimaryDisplay().bounds;
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width,
    height,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  win.setIgnoreMouseEvents(false);
  win.loadFile("index.html");
};

ipcMain.on("set-ignore-mouse", (e, shouldIgnore) => {
  if (shouldIgnore) {
    win.setIgnoreMouseEvents(true, { forward: true });
  } else {
    win.setIgnoreMouseEvents(false);
  }
});

app.whenReady().then(() => {
  createWindow();

  /* 
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  keep dis bullshit down here  */

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
