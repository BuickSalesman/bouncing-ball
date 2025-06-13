// matter-view.js
// @ts-check
/// <reference types="matter-js" />

const { ipcRenderer } = require("electron");
const { Engine, Render, Runner, Mouse, MouseConstraint, Composite, Bodies, Events, Query } = require("matter-js");

const canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const engine = Engine.create();
const render = Render.create({
  canvas,
  engine,
  options: {
    width: window.innerWidth,
    height: window.innerHeight,
    wireframes: false,
    background: "transparent",
  },
});
Render.run(render);

const runner = Runner.create();
Runner.run(runner, engine);

let mouse = Mouse.create(render.canvas),
  mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      render: {
        visible: true,
      },
    },
  });

Composite.add(engine.world, mouseConstraint);

//add to same collision category as windows
const ball = Bodies.circle(200, 200, 20, {
  id: -1,
  render: { fillStyle: "blue" },
});

//windows do not collide with walls but balls collide with walls
const bottom = Bodies.rectangle(canvas.width / 2, canvas.height + 100, canvas.width + 100, 200, {
  isStatic: true,
  id: -2,
  render: { fillStyle: "white" },
});

const ceiling = Bodies.rectangle(canvas.width / 2, canvas.height - canvas.height - 100, canvas.width + 100, 200, {
  isStatic: true,
  id: -3,
  render: { fillStyle: "white" },
});

const left = Bodies.rectangle(-100, canvas.height / 2, 200, canvas.height, {
  isStatic: true,
  id: -4,
  render: { fillStyle: "white" },
});

const right = Bodies.rectangle(canvas.width + 100, canvas.height / 2, 200, canvas.height, {
  isStatic: true,
  id: -5,
  render: { fillStyle: "white" },
});

Composite.add(engine.world, [ball, bottom, ceiling, left, right]);

let bodiesUnderMouse;
Events.on(mouseConstraint, "mousemove", () => {
  let { x, y } = mouse.position;
  bodiesUnderMouse = Query.point(Composite.allBodies(engine.world), { x, y });

  if (bodiesUnderMouse.length > 0) {
    ipcRenderer.send("body-under");
  }

  if (bodiesUnderMouse.length === 0) {
    ipcRenderer.send("no-bodies-found");
  }
});

// this does nothing but makes sure that the wall bounds and ball are all showing up
let bodiesInWorld = new Set();
for (const body of Composite.allBodies(engine.world)) {
  bodiesInWorld.add(body);
}

//listen for added window ✅
//listen for removed window
//listen for updated bounds
//listen for updates size
//listen for not enough ball space
//listen for update fullscreen but that might be the same as ball space

let windowBodies = new Map();

//STACK!!!!!
let activeWindows = [];

function updateWindows(id, bounds) {
  activeWindows.push(id);

  if (windowBodies.has(id)) {
  } else {
    // listen for added window
    windowBodies.set(id, { x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height });
  }

  //after body creation and all that
  const deletedWindow = activeWindows.pop();
}

ipcRenderer.on("window-resize", (_, { id, bounds }) => {
  // we can listen for fullscreen, add, remove
  updateWindows(id, bounds);
});

ipcRenderer.on("window-drag", (_, { id, bounds }) => {
  updateWindows(id, bounds);
});

Events.on(engine, "afterUpdate", updateWindows);
