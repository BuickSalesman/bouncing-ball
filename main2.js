// @ts-check
/// <reference types="electron" />
/// <reference types="node" />
/// <reference types="matter-js" />

const { BrowserWindow, app, screen, ipcMain } = require("electron");

let win;

const createWindow = () => {
  const { x, y, width, height } = screen.getPrimaryDisplay().bounds;
  win = new BrowserWindow({
    x,
    y,
    width,
    height,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    focusable: false,
    hasShadow: false,
    enableLargerThanScreen: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  win.loadFile("index.html");
  win.webContents.openDevTools({ mode: "detach" });
  win.setIgnoreMouseEvents(true, { forward: true });
};

ipcMain.on("body-under", (_evt) => {
  win.setIgnoreMouseEvents(false), console.log("body under");
});

ipcMain.on("no-bodies-found", (_evt) => {
  win.setIgnoreMouseEvents(true, { forward: true });
});

app.whenReady().then(() => {
  createWindow();
});

/* 
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  keep dis bullshit down here  */

//activate means on mac when a process is running but there are no active windows, and you click the icon in the dock.
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
