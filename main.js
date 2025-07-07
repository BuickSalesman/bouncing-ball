// @ts-check
/// <reference types="electron" />
/// <reference types="node" />
/// <reference types="matter-js" />
/// <reference types="node-window-manager" />

const { BrowserWindow, app, screen, ipcMain } = require("electron");
const { trackWindows } = require("./main-helpers/trackWindows.js")

let overlay;
/*
 * need to create a second browserwindow and html here to make a control panel for
 * gravity and shapes and all sorts of stuff
 */
const createWindow = () => {

    const { x, y, width, height } = screen.getPrimaryDisplay().bounds;
    /* 
     * getPrimaryDisplay only grabs the main mabook display if attached to other monitors,
     * and if multtple desktop spaces, only grabs the one that the function is running in.
     */
    overlay = new BrowserWindow({
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
    overlay.loadFile("index.html");
    //overlay.webContents.openDevTools({ mode: "detach" });
    overlay.setIgnoreMouseEvents(true, { forward: true });
};
/*
 * will also need to reconfigure these to allowing clicking on the modal, and allowing
 * hotkeying of picking up window-all-closed
 */
ipcMain.on("body-under", (_) => {
    overlay.setIgnoreMouseEvents(false), console.log("body under");
});

ipcMain.on("no-bodies-found", (_) => {
    overlay.setIgnoreMouseEvents(true, { forward: true });
});

app.whenReady().then(() => {
    createWindow();
    //stop tracking when leaving desktop space
    setInterval(() => trackWindows(overlay), 30)
    /*
     * @trackWindows will need to be renamed to something like updateWindows
     * as it will also link to hammerspoon updating coordinates from the physics engine    
     */
});























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

