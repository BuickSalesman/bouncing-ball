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
  win.setIgnoreMouseEvents(true, { forward: true });
  win.loadFile("index.html");
};

ipcMain.on("body-under", (e) => {
  win.setIgnoreMouseEvents(false);
});

ipcMain.on("no-bodies-found", (e) => {
  win.setIgnoreMouseEvents(true, { forward: true });
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
