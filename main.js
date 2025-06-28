// @ts-check
/// <reference types="electron" />
/// <reference types="node" />
/// <reference types="matter-js" />
/// <reference types="node-window-manager" />

const { BrowserWindow, app, screen, ipcMain } = require("electron");
const { windowManager } = require("node-window-manager");

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
  // win.webContents.openDevTools({ mode: "detach" });
  win.setIgnoreMouseEvents(true, { forward: true });
};

ipcMain.on("body-under", (_) => {
  win.setIgnoreMouseEvents(false), console.log("body under");
});

ipcMain.on("no-bodies-found", (_) => {
  win.setIgnoreMouseEvents(true, { forward: true });
});

// ipcMain.on("bodies-in-set", (_evt, bodies) => {
//   for (const body of bodies) {
//     console.log(body);
//   }
// });


app.whenReady().then(() => {
  createWindow();
});

// on app run but should also run on addwindow or resize
let latestBounds = new Map();

setInterval(() => {
  windowManager
    .getWindows()
    .filter((w) => w.path.includes("/Applications/") && !w.path.includes("CoreServices") && w.isVisible())
    .sort((a, b) => a.id - b.id)
    .forEach((w) => {
      const { x, y, width, height } = w.getBounds();
      console.log(x, y, width, height);
      const prev = latestBounds.get(w.id);

      if (!prev) {
        latestBounds.set(w.id, { x: -1, y: -1, width: -1, height: -1 });
        return;
      }

      //window-resize covers addition of and removal of window objects active sent to matter.js

      if (prev.width !== width || prev.height !== height) {
        win.webContents.send("window-resize", { id: w.id, bounds: { x, y, width, height } });
        console.log("window-resize");
      }

      if (prev.x !== x || prev.y !== y) {
        win.webContents.send("window-drag", { id: w.id, bounds: { x, y } });
        console.log("window dragged");
      }

      if (prev.x !== x || prev.y !== y || prev.width !== width || prev.height !== height) {
        latestBounds.set(w.id, { x, y, width, height });
        console.log("reset prev bounds!");
      }
    });
}, 2000);
//run at 16 or 33

//filter out windows to only visible non fullscreen with a margin between end of screen on one side at least a little larger the size of our ball

//get bounds of all windows

//for each window create a matter body in matter.js on canvas

//broadcast changes in windowsize to matter.js
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
