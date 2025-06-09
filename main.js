// @ts-check
/// <reference types="electron" />
/// <reference types="node" />
/// <reference types="matter-js" />

const Matter = require("matter-js");
const path = require("path");
const electron = require("electron");
const { app, ipcMain, BrowserWindow, screen } = require("electron");
const { Engine, World, Bodies, Body } = require("matter-js");

let windows = [];
let engine, ball;

function setUpMatter() {
  engine = Engine.create();

  ball = Bodies.circle(1200, -500, 30, {
    label: "ball",
  });

  const platform = Bodies.rectangle(400, 400, 3000000, 20, {
    isStatic: true,
    label: "platform",
  });
  World.add(engine.world, [ball, platform]);

  const timestep = 1000 / 60;
  setInterval(() => {
    Engine.update(engine, timestep);
  }, timestep);

  console.log("Matter running!");
}

const createWindows = () => {
  windows.forEach((w) => w.close());
  windows = [];

  screen.getAllDisplays().forEach((d, i) => {
    const { x, y, width, height } = d.bounds;
    const win = new BrowserWindow({
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
    win.loadFile(path.join(__dirname, "index.html"), { query: { offsetX: d.bounds.x, offsetY: d.bounds.y } });
    win.webContents.openDevTools({ mode: "detach" });
    windows.push(win);
    console.log("windows created!");
  });
};

function startBroadcast() {
  setInterval(() => {
    if (!engine) return;
    const state = engine.world.bodies.map((b) => {
      return {
        id: b.id,
        label: b.label,
        x: b.position.x,
        y: b.position.y,
        angle: b.angle,
        width: b.bounds.max.x - b.bounds.min.x,
        height: b.bounds.max.y - b.bounds.min.y,
      };
    });
    windows.forEach((w) => w.webContents.send("world-state", state));
  }, 16);
}

ipcMain.on("body-under", (_evt) => {
  windows.forEach((win) => win.setIgnoreMouseEvents(false), console.log("body under"));
});

ipcMain.on("no-bodies-found", (_evt) => {
  windows.forEach((win) => win.setIgnoreMouseEvents(true, { forward: true }));
});

app.whenReady().then(() => {
  setUpMatter();
  createWindows();
  startBroadcast();

  screen.on("display-added", createWindows);
  screen.on("display-removed", createWindows);
  screen.on("display-metrics-changed", createWindows);
});

/* 
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  keep dis bullshit down here  */

//activate means on mac when a process is running but there are no active windows, and you click the icon in the dock.
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindows();
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
