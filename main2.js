// @ts-check
/// <reference types="electron" />
/// <reference types="node" />
/// <reference types="matter-js" />

const { BrowserWindow, app, screen } = require("electron");
const { Engine } = require("matter-js");

const engine = Engine.create();

const createWindow = () => {
  const { x, y, width, height } = screen.getPrimaryDisplay().bounds;
  const win = new BrowserWindow({
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
