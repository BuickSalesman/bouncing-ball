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
  restitution: 0.8,
  friction: 0.2,
  render: { fillStyle: "blue" },
});

const ball2 = Bodies.circle(250, 250, 20, {
  id: -6,
  restitution: 0.8,
  friction: 0.2,
  render: { fillStyle: "red" },
});

//windows do not collide with walls but balls collide with walls
const bottom = Bodies.rectangle(canvas.width / 2, canvas.height + 100, canvas.width + 100, 200, {
  isStatic: true,
  id: -2,
  friction: 0.2,
  render: { fillStyle: "white" },
});

const ceiling = Bodies.rectangle(canvas.width / 2, canvas.height - canvas.height - 100, canvas.width + 100, 200, {
  isStatic: true,
  id: -3,
  friction: 0.2,
  render: { fillStyle: "white" },
});

const left = Bodies.rectangle(-100, canvas.height / 2, 200, canvas.height, {
  isStatic: true,
  id: -4,
  friction: 0.2,
  render: { fillStyle: "white" },
});

const right = Bodies.rectangle(canvas.width + 100, canvas.height / 2, 200, canvas.height, {
  isStatic: true,
  id: -5,
  friction: 0.2,
  render: { fillStyle: "white" },
});

Composite.add(engine.world, [ball, ball2, bottom, ceiling, left, right]);

let bodiesUnderMouse;
Events.on(mouseConstraint, "mousemove", () => {
  let { x, y } = mouse.position;
  bodiesUnderMouse = Query.point(Composite.allBodies(engine.world), { x, y });

  if (bodiesUnderMouse.length > 0 && bodiesUnderMouse[0].id < 0) {
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

//Q!!!!!
let activeWindows = [];

function updateWindows(id, bounds) {
  if (id === activeWindows[0]) {
    //check bounds and update map
    let toBack = activeWindows.shift();
    activeWindows.push(toBack);
  } else {
    if (activeWindows.includes(id) === activeWindows[1]) {
      activeWindows.shift();
      let toBack = activeWindows.shift();
      activeWindows.push(toBack);
    } else {
      activeWindows.push(id);
      windowBodies.set(id, { x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height });
      let newWindow = Bodies.rectangle(
        bounds.x + bounds.width / 2,
        bounds.y + bounds.height / 2,
        bounds.width,
        bounds.height,
        {
          isStatic: true,
          id: id,
          friction: 0.2,
          render: { visible: false },
        }
      );
      Composite.add(engine.world, newWindow);
    }
  }
}

ipcRenderer.on("window-resize", (_, { id, bounds }) => {
  // we can listen for fullscreen, add, remove
  updateWindows(id, bounds);
});

ipcRenderer.on("window-drag", (_, { id, bounds }) => {
  updateWindows(id, bounds);
});

Events.on(engine, "afterUpdate", updateWindows);
