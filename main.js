// @ts-check
/// <reference types="electron" />

const Matter = require("matter-js");
const electron = require("electron");
const { app, BrowserWindow, screen } = require("electron");
const { ipcMain } = require("electron");

let win = null;
let watchers = false;

function getDisplayBounds() {
  const displays = screen.getAllDisplays();

  let minX = Infinity,
    minY = Infinity;
  let maxX = -Infinity,
    maxY = -Infinity;

  for (const {
    bounds: { x, y, width: w, height: h },
  } of displays) {
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x + w);
    maxY = Math.max(maxY, y + h);
  }

  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}

const createWindow = () => {
  const { x, y, width, height } = getDisplayBounds();

  if (!win) {
    win = new BrowserWindow({
      x,
      y,
      width,
      height,
      frame: false,
      transparent: true,
      alwaysOnTop: true,
      skipTaskbar: true,
      focusable: false,
      hasShadow: false,
      enableLargerThanScreen: true,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    });
    win.setIgnoreMouseEvents(true, { forward: true });
    win.loadFile("index.html");

    if (!watchers) {
      const resize = () => win && getDisplayBounds();
      screen.on("display-added", resize);
      screen.on("display-removed", resize);
      screen.on("display-metrics-changed", resize);
      watchers = true;
    }
  } else {
    win.setBounds({ x, y, width, height });
  }
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

  //activate means on mac when a process is running but there are no active windows, and you click the icon in the dock.
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
