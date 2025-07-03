// @ts-check
/// <reference types="electron" />
/// <reference types="node" />
/// <reference types="matter-js" />
/// <reference types="node-window-manager" />

const { BrowserWindow, app, screen, ipcMain } = require("electron");
const { trackWindows } = require("./main-helpers/trackWindows.js")

let win;

const createWindow = () => {
    // getPrimaryDisplay only grabs the main mabook display if attached to other monitors, and if multtple desktop spaces, only grabs the one that the function is running in.

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



setInterval(trackWindows, 100)























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
