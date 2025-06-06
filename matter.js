// @ts-check
/// <reference types="matter-js" />

const { Engine, Render, Runner, Bodies, Composite, Query, Events, Mouse, MouseConstraint } = require("matter-js");
const { ipcRenderer } = require("electron");

const width = window.innerWidth;
const height = window.innerHeight;

const engine = Engine.create();
const container = document.getElementById("matter-container");

const render = Render.create({
  element: container,
  engine: engine,
  options: {
    width: width,
    height: height,
    wireframes: false,
    background: "transparent",
  },
});

const mouse = Mouse.create(render.canvas);

const mouseConstraint = MouseConstraint.create(engine, {
  mouse: mouse,
  constraint: {
    stiffness: 0.2,
  },
});

const ball = Bodies.circle(800, 800, 30, {
  isStatic: true,
  render: {
    fillStyle: "blue",
    strokeStyle: "blue",
    lineWidth: 2,
  },
});

const ball2 = Bodies.circle(880, 800, 30, {
  render: {
    fillStyle: "red",
    strokeStyle: "red",
    lineWidth: 2,
  },
});

const bottom = Bodies.rectangle(width / 2, height + 51, width, 100, {
  isStatic: true,
  render: {
    fillStyle: "black",
    strokeStyle: "black",
    lineWidth: 2,
  },
});

Composite.add(engine.world, [ball, ball2, bottom]);
Composite.add(engine.world, mouseConstraint);

Render.run(render);

const runner = Runner.create();
Runner.run(runner, engine);

Events.on(mouseConstraint, "mousemove", (event) => {
  const { x, y } = event.mouse.position;
  const allBodies = Composite.allBodies(engine.world);
  const bodiesUnderMouse = Query.point(allBodies, { x, y });

  if (bodiesUnderMouse.length > 0) {
    ipcRenderer.send("body-under");
  }

  if (bodiesUnderMouse.length === 0) {
    ipcRenderer.send("no-bodies-found");
  }
});
