// matter-view.js
// @ts-check
/// <reference types="matter-js" />

const { ipcRenderer } = require("electron");
const { Engine, Render, Bodies, Composite, Body, Mouse, MouseConstraint, Events, Query } = require("matter-js");

const localBodies = new Map();

const params = new URLSearchParams(location.search);
const offsetX = Number(params.get("offsetX")) || 0;
const offsetY = Number(params.get("offsetY")) || 0;
console.log("Renderer offset:", offsetX, offsetY);

const canvas = document.querySelector("canvas");
const engine = Engine.create();
const render = Render.create({
  canvas,
  engine,
  options: {
    width: 1,
    height: 1,
    wireframes: false,
    background: "transparent",
  },
});
Render.run(render);
console.log("Renderer started");

const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
  mouse,
  constraint: {
    stiffness: 0.2,
  },
});
Composite.add(engine.world, mouseConstraint);

let bodiesUnderMouse;

render.canvas.addEventListener("mousemove", (event) => {
  const rect = render.canvas.getBoundingClientRect();
  const mouseX = event.screenX - rect.left;
  const mouseY = event.screenY - rect.top;

  const allBodies = Composite.allBodies(engine.world);
  bodiesUnderMouse = Query.point(allBodies, { x: mouseX, y: mouseY });

  if (bodiesUnderMouse.length > 0) {
    ipcRenderer.send("body-under");
  }

  if (bodiesUnderMouse.length === 0) {
    ipcRenderer.send("no-bodies-found");
  }
});

function resize() {
  const width = window.innerWidth,
    height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
  render.options.width = width;
  render.options.height = height;
}
window.addEventListener("resize", resize);
resize();

let localBall = null;
ipcRenderer.on("world-state", (_evt, bodies) => {
  bodies.forEach((b) => {
    const x = b.x - offsetX;
    const y = b.y - offsetY;
    const inView = x >= 0 && y >= 0 && x <= window.innerWidth && y <= window.innerHeight;

    if (!inView) {
      if (localBodies.has(b.id)) {
        Composite.remove(engine.world, localBodies.get(b.id));
        localBodies.delete(b.id);
      }
      return;
    }

    let body = localBodies.get(b.id);
    if (!body) {
      if (b.label === "ball") {
        body = Bodies.circle(x, y, b.width / 2, {
          restitution: 0.8,
          render: { fillStyle: "steelblue" },
        });
      } else if (b.label === "platform") {
        body = Bodies.rectangle(x, y, b.width, b.height, {
          isStatic: true,
          render: { fillStyle: "darkgray" },
        });
      }
      localBodies.set(b.id, body);
      Composite.add(engine.world, body);
    }

    Body.setPosition(body, { x, y });
    Body.setAngle(body, b.angle);
  });
});
