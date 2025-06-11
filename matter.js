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

const ball = Bodies.circle(200, 200, 20, {
  render: { fillStyle: "blue" },
});

const bottom = Bodies.rectangle(canvas.width / 2, canvas.height + 100, canvas.width + 100, 200, {
  isStatic: true,
  render: { fillStyle: "white" },
});

const ceiling = Bodies.rectangle(canvas.width / 2, canvas.height - canvas.height - 100, canvas.width + 100, 200, {
  isStatic: true,
  render: { fillStyle: "white" },
});

const left = Bodies.rectangle(-100, canvas.height / 2, 200, canvas.height, {
  isStatic: true,
  render: { fillStyle: "white" },
});

const right = Bodies.rectangle(canvas.width + 100, canvas.height / 2, 200, canvas.height, {
  isStatic: true,
  render: { fillStyle: "white" },
});

Composite.add(engine.world, [ball, bottom, ceiling, left, right]);

let bodiesUnderMouse;
Events.on(mouseConstraint, "mousemove", () => {
  let { x, y } = mouse.position;
  const bodiesUnderMouse = Query.point(Composite.allBodies(engine.world), { x, y });

  if (bodiesUnderMouse.length > 0) {
    ipcRenderer.send("body-under");
  }

  if (bodiesUnderMouse.length === 0) {
    ipcRenderer.send("no-bodies-found");
  }
});
